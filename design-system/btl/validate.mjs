// Visual validation of one rendered BTL slide (a [data-btl-slide] element at scale 1) in a Playwright page.
// Shared by the design-system preview check (scripts/check.mjs) and the REACH app's proposal renderer.
// Geometry, typography, color, logo and contrast only: medical/claim verification lives elsewhere.
//
// Returns { issues, notes }: issues block approval (the slide needs a fix or manual review); notes are
// informative (e.g. a photo that bleeds off the canvas on purpose). Each entry: { kind, message, label? }
// where label is the first 40 characters of the text involved, so callers can map it back to their nodes.

import { SECONDARY_MAX_SHARE } from './catalog.mjs';

const BRAND_RGB = ['rgb(255, 255, 255)', 'rgb(0, 10, 50)', 'rgb(0, 80, 140)', 'rgb(150, 210, 255)'];

export async function validateSlide(page, slide) {
  await slide.scrollIntoViewIfNeeded();
  const geo = await slide.evaluate((s, BRAND_RGB) => {
    const issues = [];
    const notes = [];
    const sr = s.getBoundingClientRect();
    const rel = (r) => ({ l: r.left - sr.left, t: r.top - sr.top, r: r.right - sr.left, b: r.bottom - sr.top });
    const u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--btl-u'));
    const label = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    const leaves = [...s.querySelectorAll('[data-btl-text]')].filter((el) => !el.querySelector('[data-btl-text]'));
    // Text line rects clipped to the element's own box: a 0.82 line-height numeral's font content area
    // is taller than the line it occupies, and the glyphs stay inside the line box.
    const rectsOf = (el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const box = rel(el.getBoundingClientRect());
      return [...range.getClientRects()].map(rel)
        .map((r) => ({ l: Math.max(r.l, box.l), t: Math.max(r.t, box.t), r: Math.min(r.r, box.r), b: Math.min(r.b, box.b) }))
        .filter((r) => r.r - r.l > 1 && r.b - r.t > 1);
    };
    // Minimum size (HTML and SVG text), typeface and brand colors
    for (const el of s.querySelectorAll('*')) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const cs = getComputedStyle(el);
      let size = parseFloat(cs.fontSize);
      const svg = el.closest('svg');
      if (svg) size *= svg.getScreenCTM().a / (s.getBoundingClientRect().width / s.offsetWidth);
      if (size < 29.5) issues.push({ kind: 'min_text', message: `text ${size.toFixed(1)}px < 30px`, label: label(el) });
      if (!/Noto Sans/.test(cs.fontFamily)) issues.push({ kind: 'typeface', message: `text not set in Noto Sans (${cs.fontFamily})`, label: label(el) });
      if (!svg && !BRAND_RGB.includes(cs.color)) issues.push({ kind: 'color', message: `text color ${cs.color} is not a BTL brand color`, label: label(el) });
    }
    // Canvas bounds + box overflow
    for (const el of leaves) {
      if (rectsOf(el).some((r) => r.l < -1 || r.t < -1 || r.r > s.offsetWidth + 1 || r.b > s.offsetHeight + 1))
        issues.push({ kind: 'outside', message: 'text outside the canvas', label: label(el) });
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).display !== 'inline')
        issues.push({ kind: 'overflow', message: 'text overflows its box horizontally', label: label(el) });
    }
    // A word broken across two lines (overflow-wrap kicks in when a single word is wider than its box).
    for (const el of leaves) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let broken = null;
      for (let node = walker.nextNode(); node && !broken; node = walker.nextNode()) {
        const re = /\S{3,}/g;
        for (let m = re.exec(node.data); m && !broken; m = re.exec(node.data)) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          const tops = new Set([...r.getClientRects()].filter((x) => x.width > 1).map((x) => Math.round(x.top)));
          if (tops.size > 1) broken = m[0];
        }
      }
      if (broken) issues.push({ kind: 'word_break', message: `word split across lines ("${broken}")`, label: label(el) });
    }
    for (const reg of s.querySelectorAll('.btl-region, .btl-module')) {
      if (reg.style.height && reg.scrollHeight > reg.clientHeight + 2)
        issues.push({ kind: 'overflow', message: 'content taller than its region', label: label(reg) });
    }
    // Overlaps between distinct text blocks
    const boxes = leaves.map((el) => ({ el, rects: rectsOf(el) }));
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const hit = boxes[i].rects.some((a) => boxes[j].rects.some((b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 2 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 2));
        if (hit) issues.push({ kind: 'overlap', message: `overlapping text: "${label(boxes[i].el)}" × "${label(boxes[j].el)}"`, label: label(boxes[i].el), other: label(boxes[j].el) });
      }
    // Images: must load; report how much bleeds off the canvas (a deliberate choice, but worth seeing)
    for (const m of s.querySelectorAll('[data-btl-media]')) {
      const img = m.tagName === 'IMG' ? m : m.querySelector('img');
      if (img && (!img.complete || img.naturalWidth === 0)) issues.push({ kind: 'image', message: `image did not load: ${img.getAttribute('src')?.split('/').pop()}` });
      const r = rel(m.getBoundingClientRect());
      const area = (r.r - r.l) * (r.b - r.t);
      const inside = Math.max(0, Math.min(r.r, s.offsetWidth) - Math.max(r.l, 0)) * Math.max(0, Math.min(r.b, s.offsetHeight) - Math.max(r.t, 0));
      if (area > 0 && inside / area < 0.6)
        notes.push({ kind: 'image_crop', message: `${Math.round(100 - (100 * inside) / area)}% of an image falls outside the canvas: ${img?.getAttribute('alt') || 'image'}` });
    }
    // Logo
    const logos = s.querySelectorAll('[data-btl-logo]');
    if (logos.length !== 1) issues.push({ kind: 'logo', message: `expected exactly one BTL logo, found ${logos.length}` });
    for (const lg of logos) {
      const z = rel(lg.getBoundingClientRect());
      if (Math.min(z.t, s.offsetHeight - z.b) < 2 * u - 1.5 || Math.min(z.l, s.offsetWidth - z.r) < 2 * u - 1.5)
        issues.push({ kind: 'logo', message: 'logo closer than 2 U to an edge' });
      const zone = { l: z.l - u, t: z.t - u, r: z.r + u, b: z.b + u };
      const inZone = (r) => r.l < zone.r && zone.l < r.r && r.t < zone.b && zone.t < r.b;
      for (const b of boxes) if (b.rects.some(inZone)) issues.push({ kind: 'logo_zone', message: 'text inside the logo safe zone', label: label(b.el) });
    }
    const lg = logos[0] ? rel(logos[0].getBoundingClientRect()) : null;
    return {
      issues, notes,
      secondary: s.dataset.btlSecondary || null,
      logoColor: logos[0] ? getComputedStyle(logos[0]).color : 'rgb(0,0,0)',
      logoZone: lg && { l: lg.l - u, t: lg.t - u, r: lg.r + u, b: lg.b + u },
      texts: boxes.map((b) => ({ rects: b.rects, color: getComputedStyle(b.el).color, size: parseFloat(getComputedStyle(b.el).fontSize), label: label(b.el) })),
    };
  }, BRAND_RGB);

  // Contrast and busy backgrounds, measured against the real pixels behind each text block
  await slide.evaluate((s) => s.classList.add('btl-hide-text'));
  await page.addStyleTag({ content: '.btl-hide-text [data-btl-text], .btl-hide-text [data-btl-text] *{color:transparent!important;text-shadow:none!important} .btl-hide-text [data-btl-text] svg{opacity:0} .btl-hide-text [data-btl-logo]{opacity:0}' });
  const png = (await slide.screenshot()).toString('base64');
  // Same view without line decor (Halo, Curve): the difference is where it paints, to catch it behind text.
  // Surfaces meant to carry text (LightBand, data-btl-decor="surface") stay visible.
  const hasDecor = await slide.evaluate((s) => !!s.querySelector('[data-btl-decor]:not([data-btl-decor="surface"])'));
  let bare = null;
  if (hasDecor) {
    await page.addStyleTag({ content: '.btl-hide-decor [data-btl-decor]:not([data-btl-decor=\"surface\"]){visibility:hidden!important}' });
    await slide.evaluate((s) => s.classList.add('btl-hide-decor'));
    bare = (await slide.screenshot()).toString('base64');
    await slide.evaluate((s) => s.classList.remove('btl-hide-decor'));
  }
  await slide.evaluate((s) => s.classList.remove('btl-hide-text'));
  const pixel = await page.evaluate(async ({ png, bare, texts, zone, logoColor, secondary, maxShare }) => {
    const load = async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const cv = document.createElement('canvas');
      cv.width = img.width;
      cv.height = img.height;
      const cx = cv.getContext('2d');
      cx.drawImage(img, 0, 0);
      return { cv, cx };
    };
    const { cv: c, cx: ctx } = await load(png);
    const plain = bare ? (await load(bare)).cx : null;
    const lum = (r, g, b) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const box = (rc, min) => {
      const x0 = Math.max(0, Math.floor(rc.l)), y0 = Math.max(0, Math.floor(rc.t));
      const w = Math.min(c.width - x0, Math.ceil(rc.r - rc.l)), h = Math.min(c.height - y0, Math.ceil(rc.b - rc.t));
      return w < min || h < min ? null : { w, h, d: ctx.getImageData(x0, y0, w, h).data };
    };
    const out = [];
    for (const t of texts) {
      const [r, g, b] = t.color.match(/\d+(\.\d+)?/g).map(Number);
      const lt = lum(r, g, b);
      const ratios = [];
      const diffs = [];
      for (const rc of t.rects) {
        const bx = box(rc, 1);
        if (!bx) continue;
        for (let p = 0; p < bx.d.length; p += 4 * 7) {
          const lb = lum(bx.d[p], bx.d[p + 1], bx.d[p + 2]);
          ratios.push((Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05));
        }
        if (bx.w < 5 || bx.h < 5) continue;
        const L = (x, y) => { const p = 4 * (y * bx.w + x); return lum(bx.d[p], bx.d[p + 1], bx.d[p + 2]); };
        for (let y = 0; y < bx.h - 3; y += 3) for (let x = 0; x < bx.w - 3; x += 3) diffs.push(Math.abs(L(x, y) - L(x + 3, y)), Math.abs(L(x, y) - L(x, y + 3)));
      }
      // Decor drawn behind the letters (a curve or halo crossing a headline) hurts legibility and looks accidental.
      if (plain) {
        let crossed = 0;
        for (const rc of t.rects) {
          const x0 = Math.max(0, Math.floor(rc.l)), y0 = Math.max(0, Math.floor(rc.t));
          const w = Math.min(c.width - x0, Math.ceil(rc.r - rc.l)), h = Math.min(c.height - y0, Math.ceil(rc.b - rc.t));
          if (w < 1 || h < 1) continue;
          const a = ctx.getImageData(x0, y0, w, h).data, b = plain.getImageData(x0, y0, w, h).data;
          for (let p = 0; p < a.length; p += 4) if (Math.abs(a[p] - b[p]) + Math.abs(a[p + 1] - b[p + 1]) + Math.abs(a[p + 2] - b[p + 2]) > 60) crossed++;
        }
        if (crossed > 150) out.push({ kind: 'decor_text', message: `decorative element behind the text (${crossed} px)`, label: t.label });
      }
      if (!ratios.length) continue;
      ratios.sort((a, b) => a - b);
      diffs.sort((a, b) => a - b);
      // Busy background: photo detail behind the letters hurts legibility even when the average contrast passes.
      const busy = diffs.length ? diffs[Math.floor(diffs.length * 0.95)] : 0;
      if (busy > 0.04) out.push({ kind: 'busy', message: `text over a busy image area (detail ${busy.toFixed(3)})`, label: t.label });
      const p10 = ratios[Math.floor(ratios.length * 0.1)];
      const need = t.size >= 40 ? 3 : 4.5;
      if (p10 < need) out.push({ kind: 'contrast', message: `low contrast ${p10.toFixed(2)}:1 (needs ${need}:1)`, label: t.label });
    }
    // The logo must sit on a plain area (manual p. 6, p. 8): smooth brand gradients are fine, photo detail
    // or graphics in the safe zone are not. And it must stand out from that area (>= 3:1, graphical object).
    if (zone) {
      const bx = box(zone, 4);
      if (bx) {
        const L = (x, y) => { const p = 4 * (y * bx.w + x); return lum(bx.d[p], bx.d[p + 1], bx.d[p + 2]); };
        const diffs = [], ls = [];
        for (let y = 0; y < bx.h - 3; y += 2) for (let x = 0; x < bx.w - 3; x += 2) { const a = L(x, y); ls.push(a); diffs.push(Math.abs(a - L(x + 3, y)), Math.abs(a - L(x, y + 3))); }
        diffs.sort((a, b) => a - b);
        ls.sort((a, b) => a - b);
        const detail = diffs[Math.floor(diffs.length * 0.98)];
        if (detail > 0.03) out.push({ kind: 'logo_zone', message: `logo safe zone is not a plain background (local detail ${detail.toFixed(3)})` });
        const [r, g, b] = logoColor.match(/\d+(\.\d+)?/g).map(Number);
        const ll = lum(r, g, b);
        const worst = Math.min(...[ls[Math.floor(ls.length * 0.05)], ls[Math.floor(ls.length * 0.95)]].map((lb) => (Math.max(ll, lb) + 0.05) / (Math.min(ll, lb) + 0.05)));
        if (worst < 3) out.push({ kind: 'logo', message: `logo contrast ${worst.toFixed(2)}:1 against its background (needs 3:1)` });
      }
    }
    // Product secondary color (Social Media Guideline p. 7–8): at most 10 % of the visual. Pixels close to it
    // (graphics and glows; text is hidden in this screenshot) over the whole canvas.
    if (secondary) {
      const hex = secondary.replace('#', '');
      const [sr, sg, sb] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const all = ctx.getImageData(0, 0, c.width, c.height).data;
      let hit = 0, n = 0;
      for (let p = 0; p < all.length; p += 4 * 3) {
        n++;
        const d = Math.hypot(all[p] - sr, all[p + 1] - sg, all[p + 2] - sb);
        if (d < 70) hit++;
      }
      const share = hit / n;
      if (share > maxShare) out.push({ kind: 'secondary_area', message: `secondary color covers ${(100 * share).toFixed(1)}% of the slide (max ${100 * maxShare}%)` });
    }
    return out;
  }, { png, bare, texts: geo.texts, zone: geo.logoZone, logoColor: geo.logoColor, secondary: geo.secondary, maxShare: SECONDARY_MAX_SHARE });

  return { issues: [...geo.issues, ...pixel], notes: geo.notes };
}

export const formatIssue = (i) => (i.label && !i.message.includes(i.label) ? `${i.message}: "${i.label}"` : i.message);
