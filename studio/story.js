// Story (9:16) versions of an approved carousel: the same design, re-laid out on a 1080×1920 canvas.
// Works on any rendered slides.html (classic layouts: section.slide; design-system proposals: [data-btl-slide]).
//
// Rules (applied in the browser, on the real rendered slide):
//  - The 1350 px composition is mapped into the story safe band (SAFE_TOP…H-SAFE_BOTTOM: Instagram covers the top
//    and bottom of a story with its own UI; BTL Social Media Guideline p. 6 asks to keep elements out of it).
//  - Text blocks and the logo keep their size and move to the mapped position, so the hierarchy is unchanged.
//  - Backgrounds stretch (gradients are relative to the box). Photos, bands and decor that touch the top or bottom
//    edge keep touching it: they grow into the extra height (photos with object-fit: cover, never distorted).
//  - "Desliza…" cues are removed: stories advance by tapping.
// Checks after the layout: text inside the canvas and the safe band, no overlapping text blocks.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

export const STORY_W = 1080;
export const STORY_H = 1920;
export const SAFE_TOP = 250;
export const SAFE_BOTTOM = 250;
const SRC_H = 1350;

export const storyFile = (i) => `story-${String(i + 1).padStart(2, '0')}.png`;

/**
 * @param {object} o
 * @param {string} o.html     rendered slides.html of the version
 * @param {string} o.outDir   folder for story-0N.png
 * @returns {Promise<{slides:{index:number,file:string,width:number,height:number,bytes:number}[], problems:{slide:number,message:string}[]}>}
 */
export async function renderStories({ html, outDir }) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: STORY_H + 80 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const count = await page.evaluate(({ W, H, SAFE_TOP, SAFE_BOTTOM, SRC_H }) => {
      const slides = [...document.querySelectorAll('[data-btl-slide], section.slide')];
      const band = H - SAFE_TOP - SAFE_BOTTOM;
      const k = band / SRC_H;
      const map = (y) => SAFE_TOP + y * k;
      slides.forEach((s, i) => {
        s.setAttribute('data-story', String(i + 1));
        const sr = s.getBoundingClientRect();
        const rows = [...s.children].map((el) => {
          const r = el.getBoundingClientRect();
          return { el, t: r.top - sr.top, b: r.bottom - sr.top };
        });
        const moved = [];
        let floor = H - SAFE_BOTTOM - 24; // lowest point blocks may reach (above bottom bands such as a CTA strip)
        // Lowest text in the original slide: decor and photos entirely below it stay below it (anchored to the bottom).
        const textBottom = Math.max(0, ...[...s.querySelectorAll('.blk, [data-btl-text]')]
          .filter((e) => !e.matches('.swipe, .btl-swipe') && !e.closest('.swipe, .btl-swipe') && (e.textContent || '').trim())
          .map((e) => e.getBoundingClientRect().bottom - sr.top));
        const isText = (el) => el.matches('.blk, [data-btl-text], [data-btl-logo], .btl-region') || !!el.querySelector('[data-btl-text], [data-btl-logo]');
        // Resize the canvas (and a fixed-height wrapper around it, if any).
        s.style.height = `${H}px`;
        const wrap = s.parentElement;
        if (wrap && wrap !== document.body && Math.round(wrap.getBoundingClientRect().height) === SRC_H) wrap.style.height = `${H}px`;
        for (const { el, t, b } of rows) {
          const cs = getComputedStyle(el);
          if (el.matches('.swipe, .btl-swipe') || el.querySelector(':scope > .btl-swipe')) { el.style.display = 'none'; continue; }
          if (cs.position !== 'absolute') continue;
          const touchesTop = t <= 1, touchesBottom = b >= SRC_H - 1;
          const place = (top, height) => {
            el.style.top = `${top}px`;
            el.style.bottom = 'auto';
            if (height !== undefined) el.style.height = `${height}px`;
          };
          if (isText(el) && !(touchesTop && touchesBottom)) {
            if (touchesBottom && cs.backgroundImage === 'none' && cs.backgroundColor === 'rgba(0, 0, 0, 0)') place(map(t));
            else if (touchesBottom) { el.style.paddingBottom = `${parseFloat(cs.paddingBottom) + SAFE_BOTTOM}px`; place(map(t), H - map(t)); floor = Math.min(floor, map(t) - 48); }
            else if (touchesTop) place(0, map(b));
            else { place(map(t)); moved.push(el); }
            continue;
          }
          // Media, bands and decor.
          if (touchesTop && touchesBottom) {
            // Full-canvas layers (photo frames, curves): photos inside are handled one by one; SVG decor is mapped.
            if (el.tagName.toLowerCase() === 'svg') {
              const g = el.getBBox ? el.getBBox() : null;
              el.style.transformOrigin = '0 0';
              el.style.transform = g && g.y >= textBottom ? `translateY(${H - SRC_H}px)` : `translateY(${SAFE_TOP}px) scaleY(${k})`;
              continue;
            }
            el.style.height = `${H}px`;
            for (const im of el.querySelectorAll(':scope > img')) {
              const r = im.getBoundingClientRect();
              const it = r.top - sr.top, ib = r.bottom - sr.top;
              const nt = it <= 1 ? it : map(it), nb = ib >= SRC_H - 1 ? ib + (H - SRC_H) : map(ib);
              im.style.top = `${nt}px`;
              if (it <= 1 || ib >= SRC_H - 1) { im.style.height = `${nb - nt}px`; im.style.objectFit = 'cover'; }
            }
            continue;
          }
          if (!touchesTop && !touchesBottom && t >= textBottom) { place(t + (H - SRC_H)); continue; }
          const nt = touchesTop ? t : map(t);
          const nb = touchesBottom ? b + (H - SRC_H) : map(b);
          if (touchesTop || touchesBottom) {
            place(nt, nb - nt);
            for (const im of el.querySelectorAll('img')) { im.style.height = '100%'; im.style.objectFit = 'cover'; }
            // Content of a clipped box anchored at the top (photo boxes) moves down with the safe band.
            if (touchesTop && cs.overflow === 'hidden') for (const c of el.children) c.style.transform = `translateY(${SAFE_TOP}px)`;
          } else { place(nt); moved.push(el); }
        }
        // Distribute: blocks below the logo spread over the whole safe band (gaps grow, sizes don't), so the extra
        // height of the story is shared between the groups instead of piling up at the bottom.
        const top = (e) => e.getBoundingClientRect().top - sr.top;
        const logo = s.querySelector('[data-btl-logo], .logo');
        const lb = logo ? logo.getBoundingClientRect().bottom - sr.top : 0;
        const L = lb && lb < H / 2 ? lb + 40 : SAFE_TOP;
        const below = moved.filter((e) => e !== logo && !e.contains(logo) && top(e) >= L && getComputedStyle(e).display !== 'none');
        // Real height of a block: its own box or anything inside it that sticks out.
        const tall = (e) => Math.max(e.getBoundingClientRect().bottom, ...[...e.querySelectorAll('*')].map((c) => c.getBoundingClientRect().bottom)) - e.getBoundingClientRect().top;
        if (below.length) {
          const last = below.reduce((a, e) => (top(e) + tall(e) > top(a) + tall(a) ? e : a));
          const t0 = top(last) - L, room = floor - tall(last) - L;
          const base = below.map((e) => top(e));
          const bottom = () => Math.max(...below.map((e) => top(e) + tall(e)));
          // Largest stretch (≤ 1.6) that keeps every block inside the safe band, measured on the real layout.
          for (let f = t0 > 0 ? Math.min(1.6, Math.max(1, room / t0)) : 1; f >= 1; f -= 0.02) {
            below.forEach((e, j) => (e.style.top = `${L + (base[j] - L) * f}px`));
            if (bottom() <= floor || f - 0.02 < 1) break;
          }
          if (bottom() > floor) below.forEach((e, j) => (e.style.top = `${base[j]}px`));
        }
      });
      return slides.length;
    }, { W: STORY_W, H: STORY_H, SAFE_TOP, SAFE_BOTTOM, SRC_H });

    const slides = [];
    const problems = [];
    for (let i = 0; i < count; i++) {
      const sel = `[data-story="${i + 1}"]`;
      const issues = await page.evaluate(({ sel, W, H, SAFE_TOP, SAFE_BOTTOM }) => {
        const s = document.querySelector(sel);
        const sr = s.getBoundingClientRect();
        const out = [];
        const texts = [...s.querySelectorAll('.blk, [data-btl-text], [data-btl-logo]')]
          .filter((e) => getComputedStyle(e).display !== 'none' && !e.closest('[style*="display: none"]'))
          .filter((e) => !e.parentElement.closest('.blk, [data-btl-text]'));
        // The text itself (not its box: a CTA band may run to the bottom edge while its words stay in the safe band).
        const box = (e) => {
          const range = document.createRange(); range.selectNodeContents(e);
          const rs = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
          const list = rs.length && (e.textContent || '').trim() ? rs : [e.getBoundingClientRect()];
          return { l: Math.min(...list.map((r) => r.left)) - sr.left, t: Math.min(...list.map((r) => r.top)) - sr.top, r: Math.max(...list.map((r) => r.right)) - sr.left, b: Math.max(...list.map((r) => r.bottom)) - sr.top };
        };
        const label = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) || 'logo';
        for (const e of texts) {
          const b = box(e);
          if (b.r - b.l < 1) continue;
          if (b.l < -1 || b.r > W + 1 || b.t < -1 || b.b > H + 1) out.push(`texto fuera del lienzo («${label(e)}»)`);
          else if ((b.t < SAFE_TOP - 1 || b.b > H - SAFE_BOTTOM + 1) && (e.textContent || '').trim()) out.push(`texto en la zona que tapa la interfaz de historias («${label(e)}»)`);
        }
        for (let a = 0; a < texts.length; a++)
          for (let c = a + 1; c < texts.length; c++) {
            if (texts[a].contains(texts[c]) || texts[c].contains(texts[a])) continue;
            const p = box(texts[a]), q = box(texts[c]);
            if (Math.min(p.r, q.r) - Math.max(p.l, q.l) > 2 && Math.min(p.b, q.b) - Math.max(p.t, q.t) > 2) out.push(`textos superpuestos («${label(texts[a])}» y «${label(texts[c])}»)`);
          }
        return [...new Set(out)];
      }, { sel, W: STORY_W, H: STORY_H, SAFE_TOP, SAFE_BOTTOM });
      issues.forEach((message) => problems.push({ slide: i + 1, message }));
      const file = storyFile(i);
      await page.locator(`[data-story="${i + 1}"]`).screenshot({ path: path.join(outDir, file) });
      const buf = fs.readFileSync(path.join(outDir, file));
      const width = buf.readUInt32BE(16), height = buf.readUInt32BE(20);
      if (width !== STORY_W || height !== STORY_H) problems.push({ slide: i + 1, message: `PNG de ${width}×${height}, se esperaba ${STORY_W}×${STORY_H}` });
      slides.push({ index: i, file, width, height, bytes: buf.length });
    }
    return { slides, problems };
  } finally {
    await browser.close();
  }
}
