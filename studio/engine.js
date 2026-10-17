// Carousel rendering engine shared by the CLI (studio/render.js) and the app server.
// Builds slides.html from a content object, screenshots each slide to a 1080×1350 PNG
// and runs the layout checks (overflow, overlaps, logo safe zone, min text size, bounds).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { btl, unit } from './brands/btl.js';
import { styles, layouts, backgrounds } from './layouts.js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const W = 1080, H = 1350, MIN_TEXT = 30; // px on the 1080 canvas; smaller is unreadable on a phone

export const LAYOUTS = Object.keys(layouts);
export const availableIcons = () =>
  fs.readdirSync(path.resolve(ROOT, btl.iconDir)).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4));

export const slideFile = (i) => `slide-${String(i + 1).padStart(2, '0')}.png`;

// Per-slide style overrides ([{ selector: ".p-title", property: "font-size", value: "60px" }]) let a
// revision adjust visual hierarchy without code changes. Only class selectors and a short list of properties.
export const STYLE_PROPS = new Set([
  'font-size', 'font-weight', 'line-height', 'letter-spacing', 'max-width', 'width', 'height',
  'top', 'left', 'right', 'bottom', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'gap',
]);
const SELECTOR = /^\.[a-z][a-z0-9-]*( \.[a-z][a-z0-9-]*)?$/;
const VALUE = /^-?[\d.]+(px|%|em)?( -?[\d.]+(px|%|em)?)*$|^(normal|auto)$/;
export function styleOverrides(slides) {
  const rules = [];
  slides.forEach((s, i) => {
    for (const { selector, property, value } of s.style || []) {
      if (!SELECTOR.test(selector)) throw new Error(`Invalid style selector "${selector}" in slide ${i + 1}`);
      if (!STYLE_PROPS.has(property)) throw new Error(`Style property "${property}" not allowed (slide ${i + 1})`);
      if (!VALUE.test(String(value))) throw new Error(`Invalid value "${value}" for ${property} (slide ${i + 1})`);
      rules.push(`#slide-${i + 1} ${selector}{${property}:${value}}`);
    }
  });
  return rules.length ? `\n/* per-slide overrides */\n${rules.join('\n')}\n` : '';
}

const doc = (title, css, body) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><style>${css}</style></head><body>${body}</body></html>`;

/**
 * Render a carousel.
 * @param {object} opts
 * @param {object} opts.content   editorial content (same shape as content/*.json)
 * @param {string} opts.outDir    absolute output folder
 * @param {number[]} [opts.only]  slide indexes (0-based) to screenshot; the rest are copied from reuseFrom
 * @param {string} [opts.reuseFrom] folder holding the previous version's PNGs
 * @param {boolean} [opts.extras] also write preview.html and textos.md (CLI behaviour)
 * @returns {Promise<{slides: {index:number,file:string,width:number,height:number,bytes:number,rendered:boolean}[], problems: {slide:number,message:string}[]}>}
 */
export async function renderCarousel({ content, outDir, only = null, reuseFrom = null, extras = true }) {
  fs.mkdirSync(outDir, { recursive: true });

  // Asset URLs are relative to the output folder so the HTML files stay portable inside the repo.
  const asset = (p) => path.relative(outDir, path.resolve(ROOT, p)).split(path.sep).join('/');
  const brand = { ...btl, fontUrl: asset(btl.fontDir) };
  const u = unit(brand);
  const logo = fs.readFileSync(path.resolve(ROOT, btl.logo), 'utf8');
  const icon = (name) => {
    const file = path.resolve(ROOT, btl.iconDir, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Missing icon: ${file}`);
    return fs.readFileSync(file, 'utf8').replace(/ width="\d+" height="\d+"/, '').replace('<svg ', '<svg aria-hidden="true" ');
  };
  const ctx = { brand, u, asset, icon, logo };

  const slidesHtml = content.slides
    .map((s, i) => {
      const layout = layouts[s.layout];
      if (!layout) throw new Error(`Unknown layout "${s.layout}" in slide ${i + 1}`);
      const bg = typeof backgrounds[s.layout] === 'function' ? backgrounds[s.layout](s) : backgrounds[s.layout];
      return `<section class="slide ${bg}" id="slide-${i + 1}">${layout(s, ctx)}</section>`;
    })
    .join('\n');

  const slidesFile = path.join(outDir, 'slides.html');
  fs.writeFileSync(slidesFile, doc(content.occasion, styles(ctx) + styleOverrides(content.slides), slidesHtml));

  const browser = await chromium.launch();
  const problems = [];
  const slides = [];
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(slidesFile).href);
    await page.evaluate(() => document.fonts.ready);

    for (let i = 0; i < content.slides.length; i++) {
      const id = `slide-${i + 1}`;
      const issues = await page.evaluate(
        ({ id, u, minText, W, H }) => {
          const slide = document.getElementById(id);
          const sr = slide.getBoundingClientRect();
          const out = [];
          const blocks = [...slide.querySelectorAll('.blk')];
          const box = (el) => {
            const r = el.getBoundingClientRect();
            return { l: r.left - sr.left, t: r.top - sr.top, r: r.right - sr.left, b: r.bottom - sr.top };
          };
          const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
          for (const el of slide.querySelectorAll('*')) {
            if (!el.hasAttribute('data-clip') && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'hidden')
              out.push(`overflow in .${el.className}`);
            const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            if (ownText && !el.closest('svg') && parseFloat(getComputedStyle(el).fontSize) < minText)
              out.push(`text below ${minText}px in .${el.className} (${getComputedStyle(el).fontSize})`);
            // Clipping: any element holding text must sit entirely inside the canvas.
            if (ownText && !el.closest('svg')) {
              const a = box(el);
              if (a.l < -0.5 || a.t < -0.5 || a.r > W + 0.5 || a.b > H + 0.5) out.push(`text clipped at the edge in .${el.className}`);
            }
          }
          blocks.forEach((el, k) => {
            const a = box(el);
            if (a.l < 0 || a.t < 0 || a.r > W || a.b > H) out.push(`.${el.classList[0]} outside slide`);
            blocks.slice(k + 1).forEach((o) => {
              if (hit(a, box(o))) out.push(`.${el.classList[0]} overlaps .${o.classList[0]}`);
            });
          });
          // Hero: the image may run under the shade, but not under the headline itself.
          const ht = slide.querySelector('.h-title');
          slide.querySelectorAll('.img-frame img').forEach((im) => {
            if (ht && box(im).b > box(ht).t + 10) out.push('image runs under .h-title');
          });
          // Logo safe zone: 1 unit clear on every side (manual p. 5).
          const lg = slide.querySelector('[data-logo]');
          if (lg) {
            const z = box(lg);
            const zone = { l: z.l - u, t: z.t - u, r: z.r + u, b: z.b + u };
            blocks.filter((b) => b !== lg).forEach((b) => hit(zone, box(b)) && out.push(`.${b.classList[0]} inside logo safe zone`));
            if (z.t < 2 * u - 1 || W - z.r < 2 * u - 1) out.push('logo closer than 2 units to the border');
          }
          return out;
        },
        { id, u, minText: MIN_TEXT, W, H }
      );
      issues.forEach((message) => problems.push({ slide: i + 1, message }));

      const name = slideFile(i);
      const file = path.join(outDir, name);
      const reuse = only && !only.includes(i) && reuseFrom && fs.existsSync(path.join(reuseFrom, name));
      if (reuse) fs.copyFileSync(path.join(reuseFrom, name), file);
      else await page.locator(`#${id}`).screenshot({ path: file });
      const buf = fs.readFileSync(file);
      const width = buf.readUInt32BE(16), height = buf.readUInt32BE(20);
      if (width !== W || height !== H) problems.push({ slide: i + 1, message: `PNG is ${width}×${height}, expected ${W}×${H}` });
      slides.push({ index: i, file: name, width, height, bytes: buf.length, rendered: !reuse });
    }
  } finally {
    await browser.close();
  }

  if (extras) writeExtras(content, outDir, slides.map((s) => s.file));
  return { slides, problems };
}

// Preview page and copy file (textos.md), as the original POC produced them.
export function writeExtras(content, outDir, pngs) {
  fs.writeFileSync(
    path.join(outDir, 'preview.html'),
    doc(
      `Vista previa · ${content.occasion}`,
      `body{margin:0;padding:40px 16px;background:#f2f5f8;font-family:system-ui,sans-serif;color:#000a32}
     h1{font-size:22px;font-weight:600;max-width:1200px;margin:0 auto 4px}p.meta{max-width:1200px;margin:0 auto 28px;color:#00508c}
     .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1200px;margin:0 auto}
     figure{margin:0}img{width:100%;height:auto;display:block;box-shadow:0 8px 30px rgba(0,10,50,.18)}
     figcaption{font-size:13px;margin-top:10px;color:#00508c}pre{max-width:1200px;margin:32px auto 0;white-space:pre-wrap;
     background:#fff;padding:20px;font:15px/1.5 system-ui,sans-serif;border-left:3px solid #00508c}`,
      `<h1>${content.occasion} · ${content.brand}</h1><p class="meta">${content.date} · ${content.audience}</p>
     <div class="grid">${pngs.map((p, i) => `<figure><img src="${p}" alt="${(content.slides[i].alt || `Diapositiva ${i + 1}`).replace(/"/g, '&quot;')}"><figcaption>${p} · ${W}×${H}</figcaption></figure>`).join('')}</div>
     <pre>${content.caption.replace(/</g, '&lt;')}</pre>`
    )
  );

  const t = (s) => Object.entries(s).filter(([k]) => !['layout', 'image', 'icon', 'style'].includes(k));
  const md = [
    `# Textos — ${content.occasion}`,
    '',
    `- Marca: ${content.brand}`,
    `- Fecha: ${content.date}`,
    `- Audiencia: ${content.audience}`,
    '',
    ...content.slides.flatMap((s, i) => [
      `## Diapositiva ${i + 1} (${s.layout})`,
      '',
      ...t(s).flatMap(([k, v]) =>
        Array.isArray(v)
          ? [`- **${k}:**`, ...v.map((b) => `  - ${b.title}: ${b.text}`)]
          : typeof v === 'object'
            ? [`- **${k}:** ${v.value} ${v.label}`]
            : [`- **${k}:** ${v}`]
      ),
      '',
    ]),
    '## Copy para la publicación',
    '',
    content.caption,
    '',
    '## Fuentes',
    '',
    ...(content.sources || []).map((s) => `- ${s}`),
    '',
  ];
  fs.writeFileSync(path.join(outDir, 'textos.md'), md.join('\n'));
}
