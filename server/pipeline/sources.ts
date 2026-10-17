// Official sources gathered before a generation, so Jaime doesn't have to copy them by hand:
//  1. The product's official BTL web page (the "url" of its record): visible text saved as data/web/<product>.md
//     (used as the product's documentation excerpt) and its large photos added to the publication's Archivos as
//     "web-…" images, once per publication. Only BTL domains are visited.
//  2. Photos inside the publication's PDFs, only when the publication still has no image: embedded images are
//     extracted; a long page capture (a "screencapture" PDF) is cut into its photo blocks. Added as "pdf-…" images.
// Everything added is a normal attachment: Jaime sees it in Archivos and can delete what doesn't fit.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium, type Browser } from 'playwright';
import { getMeta, setMeta } from '../db.ts';
import { DATA_DIR, UPLOADS_DIR, abs, rel } from '../paths.ts';
import * as repo from '../repo.ts';
import type { Product, Publication } from '../../shared/types.ts';

export const WEB_DIR = path.join(DATA_DIR, 'web');
const WEB_TTL_DAYS = 7;
const MAX_WEB_IMAGES = 8;
const MAX_PDF_IMAGES = 10;

/** Official BTL sites only (btlnet.*, btlaesthetics.*, btlmed*, btl.*); third-party pages are never fetched. */
export function officialUrl(url: unknown): URL | null {
  try {
    const u = new URL(String(url));
    if (!/^https?:$/.test(u.protocol)) return null;
    return /(^|\.)(btlnet|btlaesthetics|btlmedical|btlmed|btl)\.[a-z]{2,3}(\.[a-z]{2})?$/i.test(u.hostname) ? u : null;
  } catch {
    return null;
  }
}

/** The product's web page: its "url" field, else the first link written in its description. */
export function productUrl(product: Product): string | null {
  const d = product.data as { url?: string; description?: string };
  return d.url || d.description?.match(/https?:\/\/[^\s)"'<>]+/)?.[0] || null;
}

export const webExcerptPath = (productId: string) => path.join(WEB_DIR, `${productId}.md`);

export interface SourcesReport {
  notes: string[]; // what was added (Spanish, for the job stage)
  warnings: string[];
}

export async function gatherSources(pub: Publication, products: Product[]): Promise<SourcesReport> {
  const notes: string[] = [];
  const warnings: string[] = [];
  let browser: Browser | null = null;
  const open = async () => (browser ??= await chromium.launch());
  const offline = process.env.REACH_OFFLINE === '1'; // tests and offline work: no web requests
  try {
    for (const product of products) {
      const url = productUrl(product);
      if (!url) continue;
      const u = officialUrl(url);
      if (!u) {
        warnings.push(`La página de ${product.name} (${url}) no es un sitio oficial de BTL: no se consultó.`);
        continue;
      }
      const textFresh = isFresh(webExcerptPath(product.id));
      const imagesKey = `web_images:${pub.id}:${product.id}`;
      // Photos from the web only for products without an official image folder in the repo.
      const hasOfficial = !!(product.data as { assets_path?: string }).assets_path;
      const needImages = !hasOfficial && !getMeta(imagesKey);
      if (offline) continue;
      if (textFresh && !needImages) continue;
      try {
        const page = await (await open()).newPage({ viewport: { width: 1440, height: 1000 } });
        const r = await readPage(page, u.href);
        if (!textFresh && r.text.length > 200) {
          fs.mkdirSync(WEB_DIR, { recursive: true });
          const date = new Date().toISOString().slice(0, 10);
          fs.writeFileSync(webExcerptPath(product.id), `---\nid: web-${product.id}\nsource: ${u.href}\nretrieved: ${date}\n---\n\n# ${product.name} · página oficial (${u.hostname}, consultada ${date})\n\n${r.text}\n`);
          notes.push(`texto de ${u.hostname}`);
        }
        if (needImages) {
          let n = 0;
          for (const src of r.images.slice(0, MAX_WEB_IMAGES)) {
            const res = await page.request.get(src).catch(() => null);
            const type = res?.headers()['content-type'] ?? '';
            const ext = /png/.test(type) ? '.png' : /jpe?g/.test(type) ? '.jpg' : /webp/.test(type) ? '.webp' : null;
            if (!res?.ok() || !ext) continue;
            addImage(pub.id, `web-${product.id}-${String(++n).padStart(2, '0')}${ext}`, await res.body());
          }
          setMeta(imagesKey, new Date().toISOString());
          if (n) notes.push(`${n} foto(s) de ${u.hostname}`);
        }
        await page.close();
      } catch (e) {
        warnings.push(`No se pudo consultar la página de ${product.name} (${u.href}): ${(e as Error).message.split('\n')[0]}`);
      }
    }

    // PDF photos, only when the publication has no image at all.
    const attachments = repo.listAttachments(pub.id);
    if (!attachments.some((a) => a.kind === 'image')) {
      for (const doc of attachments.filter((a) => a.kind === 'document' && /\.pdf$/i.test(a.filename))) {
        const key = `pdf_images:${doc.id}`;
        if (getMeta(key)) continue;
        try {
          const images = extractPdfImages(fs.readFileSync(abs(doc.path)));
          const crops = await photoBlocks(await open(), images);
          crops.slice(0, MAX_PDF_IMAGES).forEach((c, i) =>
            addImage(pub.id, `pdf-${slug(doc.filename)}-${String(i + 1).padStart(2, '0')}${c.ext}`, c.data));
          setMeta(key, new Date().toISOString());
          notes.push(crops.length ? `${Math.min(crops.length, MAX_PDF_IMAGES)} foto(s) de ${doc.filename}` : `${doc.filename}: sin fotos utilizables`);
        } catch (e) {
          warnings.push(`No se pudieron extraer las fotos de ${doc.filename}: ${(e as Error).message.split('\n')[0]}`);
        }
      }
    }
  } finally {
    if (browser) await (browser as Browser).close();
  }
  return { notes, warnings };
}

const isFresh = (file: string) => fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < WEB_TTL_DAYS * 864e5;
const slug = (s: string) => s.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'documento';

function addImage(pubId: number, name: string, data: Buffer) {
  const dir = path.join(UPLOADS_DIR, `pub-${pubId}`);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, name);
  fs.writeFileSync(file, data);
  const ext = path.extname(name).slice(1);
  repo.addAttachment(pubId, { kind: 'image', filename: name, path: rel(file), mime: `image/${ext === 'jpg' ? 'jpeg' : ext}`, size: data.length });
}

// ---------- web page ----------
async function readPage(page: import('playwright').Page, url: string): Promise<{ text: string; images: string[] }> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  // Scroll through the page so lazy-loaded images load.
  for (let y = 0; y < 30; y++) {
    const done = await page.evaluate(() => { window.scrollBy(0, window.innerHeight); return window.scrollY + window.innerHeight >= document.body.scrollHeight; });
    await page.waitForTimeout(250);
    if (done) break;
  }
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  return page.evaluate(() => {
    const skip = 'header, footer, nav, form, script, style, noscript, [role="navigation"], [aria-hidden="true"], .cookie, #cookie';
    const main = (document.querySelector('main') ?? document.body).cloneNode(true) as HTMLElement;
    main.querySelectorAll(skip).forEach((e) => e.remove());
    const lines = (t: string) => t.split('\n').map((l) => l.trim()).filter(Boolean);
    const visible = lines(main.innerText || '');
    // Collapsed content (FAQ answers, tabs) is not in innerText: add hidden blocks with real sentences.
    const live = document.querySelector('main') ?? document.body;
    const hidden = [...live.querySelectorAll('p, li, dd, div')]
      .filter((e) => !e.closest(skip) && !(e as HTMLElement).offsetParent && !e.querySelector('p, li, dd, div') && (e.textContent || '').trim().length > 60)
      .map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim());
    const seenLine = new Set(visible);
    const text = [...visible, ...hidden.filter((l) => !seenLine.has(l) && seenLine.add(l))].join('\n').slice(0, 20000);
    const seen = new Set<string>();
    const images = [...document.images]
      .filter((im) => !im.closest('header, footer, nav, form') && im.naturalWidth >= 600 && im.naturalHeight >= 400)
      .sort((a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight)
      .map((im) => im.currentSrc || im.src)
      .filter((s) => s && !s.startsWith('data:') && !/\.svg(\?|$)/i.test(s) && !seen.has(s) && seen.add(s));
    return { text, images };
  });
}

// ---------- PDF images (no dependencies: image XObjects are always top-level streams) ----------
export interface PdfImage { width: number; height: number; ext: '.jpg' | '.png'; data: Buffer }

export function extractPdfImages(pdf: Buffer): PdfImage[] {
  const out: PdfImage[] = [];
  const s = pdf.toString('latin1');
  const re = /<<((?:(?!>>\s*stream)[\s\S]){0,2000}?\/Subtype\s*\/Image[\s\S]{0,2000}?)>>\s*stream\r?\n/g;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    const dict = m[1];
    const num = (k: string) => Number(dict.match(new RegExp(`/${k}\\s+(\\d+)(?!\\s+\\d+\\s+R)`))?.[1]);
    const width = num('Width'), height = num('Height'), bpc = num('BitsPerComponent') || 8;
    if (!width || !height || bpc !== 8 || /\/ImageMask\s+true/.test(dict)) continue;
    const start = m.index + m[0].length;
    let len = num('Length');
    if (!len || s.slice(start + len, start + len + 20).search(/^\s*endstream/) < 0) len = s.indexOf('endstream', start) - start;
    const raw = pdf.subarray(start, start + len);
    const filter = dict.match(/\/Filter\s*\[?\s*\/(\w+)/)?.[1];
    if (filter === 'DCTDecode') out.push({ width, height, ext: '.jpg', data: Buffer.from(raw) });
    else if (filter === 'FlateDecode') {
      let px: Buffer;
      try { px = zlib.inflateSync(raw); } catch { continue; }
      const predictor = Number(dict.match(/\/Predictor\s+(\d+)/)?.[1] ?? 1);
      const rowBytes = predictor >= 10 ? px.length / height - 1 : px.length / height;
      const comps = rowBytes / width;
      if (![1, 3].includes(comps)) continue; // grey or RGB; CMYK / palettes are skipped
      out.push({ width, height, ext: '.png', data: png(width, height, comps === 3 ? 2 : 0, px, predictor >= 10) });
    }
  }
  return out;
}

// PNG from raw rows; PDF PNG-predictor rows already carry a per-row filter byte, so they pass through as is.
function png(w: number, h: number, colorType: number, px: Buffer, filtered: boolean): Buffer {
  const comps = colorType === 2 ? 3 : 1;
  let rows = px;
  if (!filtered) {
    rows = Buffer.alloc(h * (w * comps + 1));
    for (let y = 0; y < h; y++) px.copy(rows, y * (w * comps + 1) + 1, y * w * comps, (y + 1) * w * comps);
  }
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = colorType;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}

// ---------- photo blocks ----------
// Ordinary photos (not page captures) are kept whole. A page capture (slices of the same width, stitched
// vertically, much taller than wide) is cut into rectangular blocks separated by plain bands; blocks that are
// mostly flat background (text, buttons, forms) are dropped, the rest are kept as JPEG crops, largest first.
async function photoBlocks(browser: Browser, images: PdfImage[]): Promise<{ ext: string; data: Buffer }[]> {
  const big = images.filter((i) => i.width >= 500 && i.height >= 350);
  const widths = new Set(big.map((i) => i.width));
  const total = big.reduce((a, i) => a + i.height, 0);
  const capture = big.length > 0 && widths.size === 1 && total > 2.2 * big[0].width;
  if (!capture) return big.map((i) => ({ ext: i.ext, data: i.data }));
  const page = await browser.newPage();
  try {
    const crops: string[] = await page.evaluate(async (parts) => {
      const imgs = await Promise.all(parts.map(async (p) => { const im = new Image(); im.src = p; await im.decode(); return im; }));
      const W = imgs[0].naturalWidth, H = imgs.reduce((a, i) => a + i.naturalHeight, 0);
      const full = document.createElement('canvas'); full.width = W; full.height = H;
      const fc = full.getContext('2d')!; let y0 = 0;
      for (const im of imgs) { fc.drawImage(im, 0, y0); y0 += im.naturalHeight; }
      // Analysis at 700 px wide.
      const k = W / 700, w = 700, h = Math.round(H / k);
      const a = document.createElement('canvas'); a.width = w; a.height = h;
      const ac = a.getContext('2d', { willReadFrequently: true })!; ac.drawImage(full, 0, 0, w, h);
      const d = ac.getImageData(0, 0, w, h).data;
      const L = (x: number, y: number) => { const p = 4 * (y * w + x); return 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]; };
      const busy = (x0: number, x1: number, y0: number, y1: number, vertical: boolean) => {
        // A line is "plain" when neighbouring pixels barely change along it.
        const out: boolean[] = [];
        if (!vertical) for (let y = y0; y < y1; y++) { let s = 0; for (let x = x0 + 1; x < x1; x++) s += Math.abs(L(x, y) - L(x - 1, y)); out.push(s / (x1 - x0) > 1.2); }
        else for (let x = x0; x < x1; x++) { let s = 0; for (let y = y0 + 1; y < y1; y++) s += Math.abs(L(x, y) - L(x, y - 1)); out.push(s / (y1 - y0) > 1.2); }
        return out;
      };
      const runs = (b: boolean[], gap: number) => {
        const r: [number, number][] = []; let s = -1, plain = 0;
        b.forEach((v, i) => { if (v) { if (s < 0) s = i; plain = 0; } else if (s >= 0 && ++plain >= gap) { r.push([s, i - plain + 1]); s = -1; plain = 0; } });
        if (s >= 0) r.push([s, b.length]);
        return r;
      };
      const blocks: { x: number; y: number; w: number; h: number; score: number }[] = [];
      for (const [ya, yb] of runs(busy(0, w, 0, h, false), 10)) {
        for (const [xa, xb] of runs(busy(0, w, ya, yb, true), 18)) {
          const bw = xb - xa, bh = yb - ya;
          if (bw < 140 || bh < 100) continue;
          // Photo-ness: share of pixels far from the block's dominant colour and spread of tones.
          const hist = new Map<number, number>(); let n = 0;
          for (let y = ya; y < yb; y += 2) for (let x = xa; x < xb; x += 2) { const p = 4 * (y * w + x); const q = ((d[p] >> 5) << 6) | ((d[p + 1] >> 5) << 3) | (d[p + 2] >> 5); hist.set(q, (hist.get(q) ?? 0) + 1); n++; }
          const top = Math.max(...hist.values()) / n;
          const tones = [...hist.values()].filter((v) => v / n > 0.004).length;
          if (top > 0.82 || tones < 12) continue; // flat panels, text on plain background, buttons
          blocks.push({ x: xa, y: ya, w: bw, h: bh, score: bw * bh });
        }
      }
      blocks.sort((p, q) => q.score - p.score);
      return blocks.slice(0, 12).map((b) => {
        const c = document.createElement('canvas'); c.width = Math.round(b.w * k); c.height = Math.round(b.h * k);
        c.getContext('2d')!.drawImage(full, b.x * k, b.y * k, c.width, c.height, 0, 0, c.width, c.height);
        return c.toDataURL('image/jpeg', 0.92);
      });
    }, big.map((i) => `data:image/${i.ext === '.jpg' ? 'jpeg' : 'png'};base64,${i.data.toString('base64')}`));
    return crops.map((u) => ({ ext: '.jpg', data: Buffer.from(u.split(',')[1], 'base64') }));
  } finally {
    await page.close();
  }
}
