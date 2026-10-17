// Renders a carousel option whose sources live inside its own output folder:
//   <option>/source/content.json   editorial copy, caption, alt texts
//   <option>/source/layouts.js     styles() + layouts + backgrounds for this option
// Usage: node studio/render-option.js output/spinal-decompression/opcion-b
// Writes slides.html, slide-0N.png, preview.html, caption.txt, textos.md and revision-360.png into <option>.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { btl, unit } from './brands/btl.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1080, H = 1350, MIN_TEXT = 30; // px on the 1080 canvas; smaller is unreadable on a phone

const optionArg = process.argv[2];
if (!optionArg) {
  console.error('Usage: node studio/render-option.js <option folder>');
  process.exit(1);
}
const outDir = path.resolve(ROOT, optionArg);
const content = JSON.parse(fs.readFileSync(path.join(outDir, 'source/content.json'), 'utf8'));
const { styles, layouts, backgrounds } = await import(pathToFileURL(path.join(outDir, 'source/layouts.js')).href);

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

const doc = (title, css, body) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><style>${css}</style></head><body>${body}</body></html>`;

const slidesHtml = content.slides
  .map((s, i) => {
    const layout = layouts[s.layout];
    if (!layout) throw new Error(`Unknown layout "${s.layout}" in slide ${i + 1}`);
    return `<section class="slide ${backgrounds[s.layout]}" id="slide-${i + 1}">${layout(s, ctx)}</section>`;
  })
  .join('\n');
const slidesFile = path.join(outDir, 'slides.html');
fs.writeFileSync(slidesFile, doc(content.name, styles(ctx), slidesHtml));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(slidesFile).href);
await page.evaluate(() => document.fonts.ready);

const problems = [];
const pngs = [];
for (let i = 0; i < content.slides.length; i++) {
  const id = `slide-${i + 1}`;
  const issues = await page.evaluate(
    ({ id, u, minText }) => {
      const slide = document.getElementById(id);
      const sr = slide.getBoundingClientRect();
      const out = [];
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - sr.left, t: r.top - sr.top, r: r.right - sr.left, b: r.bottom - sr.top };
      };
      const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
      const name = (el) => '.' + [...el.classList].join('.');
      for (const el of slide.querySelectorAll('*')) {
        if (!el.hasAttribute('data-clip') && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'hidden')
          out.push(`overflow in ${name(el)}`);
        // Legibility: any element that directly holds text must be at least minText px.
        const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (ownText && !el.closest('svg') && parseFloat(getComputedStyle(el).fontSize) < minText)
          out.push(`text below ${minText}px in ${name(el)} (${getComputedStyle(el).fontSize})`);
      }
      const blocks = [...slide.querySelectorAll('.blk')];
      blocks.forEach((el, k) => {
        const a = box(el);
        if (a.l < 0 || a.t < 0 || a.r > 1080 || a.b > 1350) out.push(`${name(el)} outside slide`);
        blocks.slice(k + 1).forEach((o) => hit(a, box(o)) && out.push(`${name(el)} overlaps ${name(o)}`));
      });
      // Logo: 1 unit clear on every side and 2 units from the border (manual p. 5).
      const lg = slide.querySelector('[data-logo]');
      if (lg) {
        const z = box(lg);
        const zone = { l: z.l - u, t: z.t - u, r: z.r + u, b: z.b + u };
        blocks.filter((b) => b !== lg).forEach((b) => hit(zone, box(b)) && out.push(`${name(b)} inside logo safe zone`));
        if (z.t < 2 * u - 1 || 1080 - z.r < 2 * u - 1) out.push('logo closer than 2 units to the border');
      }
      return out;
    },
    { id, u, minText: MIN_TEXT }
  );
  issues.forEach((m) => problems.push(`slide ${i + 1}: ${m}`));
  const file = `slide-${String(i + 1).padStart(2, '0')}.png`;
  pngs.push(file);
  await page.locator(`#${id}`).screenshot({ path: path.join(outDir, file) });
  const buf = fs.readFileSync(path.join(outDir, file));
  console.log(`${path.relative(ROOT, path.join(outDir, file))}  ${buf.readUInt32BE(16)}×${buf.readUInt32BE(20)}  ${(buf.length / 1024).toFixed(0)} KB`);
}

// Mobile check: the three slides at 360 px wide, as on a phone feed.
const mobile = await browser.newPage({ viewport: { width: 3 * 360 + 4 * 16, height: 450 + 32 }, deviceScaleFactor: 1 });
await mobile.goto(pathToFileURL(slidesFile).href);
await mobile.setContent(
  `<body style="margin:0;padding:16px;display:flex;gap:16px;background:#fff">${pngs
    .map((p) => `<img src="${pathToFileURL(path.join(outDir, p)).href}" style="width:360px;height:450px">`)
    .join('')}</body>`
);
await mobile.waitForLoadState('load');
await mobile.screenshot({ path: path.join(outDir, 'revision-360.png') });
await browser.close();

// Caption, copy file and preview.
fs.writeFileSync(path.join(outDir, 'caption.txt'), content.caption + '\n');

const md = [
  `# ${content.name}`,
  '',
  `- Marca: ${content.brand}`,
  `- Fecha: ${content.date}`,
  `- Enfoque: ${content.approach}`,
  '',
  ...content.slides.flatMap((s, i) => [
    `## Lámina ${i + 1} (${s.layout})`,
    '',
    ...Object.entries(s)
      .filter(([k]) => !['layout', 'image', 'images', 'icon', 'productLogo'].includes(k))
      .flatMap(([k, v]) =>
        Array.isArray(v)
          ? [`- **${k}:**`, ...v.map((b) => `  - ${[b.title, b.label, b.text].filter(Boolean).join(': ')}`)]
          : typeof v === 'object'
            ? [`- **${k}:** ${Object.values(v).join(' ')}`]
            : [`- **${k}:** ${String(v).replace(/\n/g, ' ')}`]
      ),
    '',
  ]),
  '## Caption',
  '',
  content.caption,
  '',
  '## Fuentes de las afirmaciones',
  '',
  ...content.claims.map((c) => `- «${c.claim}» — ${c.source}`),
  '',
];
fs.writeFileSync(path.join(outDir, 'textos.md'), md.join('\n'));

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
fs.writeFileSync(
  path.join(outDir, 'preview.html'),
  doc(
    content.name,
    `:root{--ink:#000a32;--blue:#00508c;--bg:#f2f5f8;--card:#fff}
     @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#e8f1fa;--blue:#96d2ff;--bg:#0b1020;--card:#141b2e}}
     body{margin:0;padding:32px 16px;background:var(--bg);font-family:system-ui,sans-serif;color:var(--ink)}
     main{max-width:1200px;margin:0 auto}h1{font-size:22px;margin:0 0 4px}p.meta{margin:0 0 24px;color:var(--blue)}
     .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
     figure{margin:0}img{width:100%;height:auto;display:block;box-shadow:0 8px 30px rgba(0,10,50,.18)}
     figcaption{font-size:13px;margin-top:8px;color:var(--blue)}
     pre{white-space:pre-wrap;background:var(--card);padding:20px;font:15px/1.55 system-ui,sans-serif;border-left:3px solid var(--blue);margin:28px 0 0}`,
    `<main><h1>${escHtml(content.name)}</h1><p class="meta">${escHtml(content.approach)}</p>
     <div class="grid">${pngs.map((p, i) => `<figure><img src="${p}" alt="${escHtml(content.slides[i].alt || '')}"><figcaption>${p} · ${W}×${H}</figcaption></figure>`).join('')}</div>
     <pre>${escHtml(content.caption)}</pre></main>`
  )
);

if (problems.length) {
  console.log('\nChecks:\n' + problems.map((p) => `  ✗ ${p}`).join('\n'));
  process.exitCode = 2;
} else console.log('\nChecks passed (layout, logo safe zone, min text size).');
