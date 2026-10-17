// Renders every preview story in .design-sync/previews against the built package and checks each slide:
// the shared checks in ../validate.mjs (size, typeface, brand colors, overflow, overlaps, logo, contrast).
// Usage: node design-system/btl/scripts/check.mjs [--overview]   (writes design-system/btl/.check/)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { formatIssue, validateSlide } from '../validate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, '..');
const root = path.resolve(pkg, '../..');
const previewsDir = path.join(root, '.design-sync/previews');
const out = path.join(pkg, '.check');
fs.mkdirSync(out, { recursive: true });

const files = fs.readdirSync(previewsDir).filter((f) => f.endsWith('.tsx')).sort();
const entry = path.join(out, 'gallery-entry.tsx');
fs.writeFileSync(
  entry,
  `import { createRoot } from 'react-dom/client';\n` +
    files.map((f, i) => `import * as P${i} from ${JSON.stringify(path.join(previewsDir, f))};`).join('\n') +
    `\nconst groups = [${files.map((f, i) => `[${JSON.stringify(f.slice(0, -4))}, P${i}]`).join(', ')}] as const;\n` +
    `createRoot(document.getElementById('root')!).render(<>{groups.map(([name, mod]) => (
      <section key={name} className="g-comp"><h2>{name}</h2><div className="g-row">{Object.entries(mod).filter(([k, v]) => /^[A-Z]/.test(k) && typeof v === 'function').map(([k, C]) => {
        const Story = C as () => JSX.Element;
        return <figure key={k} className="g-story" data-story={name + '/' + k}><figcaption>{k}</figcaption><Story /></figure>;
      })}</div></section>))}</>);\n`,
);
await build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  outfile: path.join(out, 'gallery.js'),
  jsx: 'automatic',
  alias: { '@reach/btl-design-system': path.join(pkg, 'dist/index.js') },
  nodePaths: [path.join(root, 'node_modules')],
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});
fs.cpSync(path.join(pkg, 'dist/fonts'), path.join(out, 'fonts'), { recursive: true });
fs.copyFileSync(path.join(pkg, 'dist/btl.css'), path.join(out, 'btl.css'));
fs.writeFileSync(
  path.join(out, 'gallery.html'),
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>BTL design system — overview</title>
<link rel="stylesheet" href="btl.css"><style>
body{margin:0;padding:40px;background:#e9edf2;font-family:'Noto Sans',sans-serif;color:#000a32}
.g-comp{margin:0 0 48px}.g-comp h2{font-size:22px;font-weight:600;margin:0 0 12px}
.g-row{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start}
.g-head h1{font-size:28px;margin:0 0 4px}.g-head p{margin:0 0 32px;font-size:16px}.g-ok{color:#178f5a}.g-bad{color:#b42318}.g-story{margin:0}.g-story>figcaption{font-size:14px;margin:0 0 6px;color:#00508c}
body.full [data-btl-scaler]{width:auto!important;height:auto!important;overflow:visible!important}
body.full [data-btl-scaler]>section{transform:none!important;box-shadow:none!important}
</style></head><body><header class="g-head"><h1>BTL El Salvador · sistema de diseño</h1><p id="g-sum"></p></header><div id="root"></div>
<script src="gallery.js"></script><script src="report.js"></script><script>
setTimeout(function () {
  var r = window.__report || [], bad = 0;
  document.querySelectorAll('[data-story]').forEach(function (f) {
    var mine = r.filter(function (x) { return x.story.indexOf(f.dataset.story + ' #') === 0; });
    var issues = [].concat.apply([], mine.map(function (x) { return x.issues; }));
    if (issues.length) bad++;
    var b = document.createElement('span'); b.className = issues.length ? 'g-bad' : 'g-ok';
    b.textContent = issues.length ? ' ✗ ' + issues.join(' · ') : ' ✓ validado';
    f.querySelector('figcaption').appendChild(b);
  });
  document.getElementById('g-sum').textContent = document.querySelectorAll('.g-comp').length + ' componentes · ' + r.length + ' slides validados (texto ≥ 30 px, desbordes, solapes, contraste, zona de seguridad del logo) · ' + (r.filter(function (x) { return x.issues.length; }).length) + ' con problemas';
}, 300);
</script></body></html>`,
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1600 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('file://' + path.join(out, 'gallery.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
if (errors.length) console.error('page errors:', errors);

if (process.argv.includes('--overview')) {
  const comps = await page.$$('.g-comp');
  const shots = [];
  for (let i = 0; i < comps.length; i++) {
    const f = path.join(out, `overview-${String(i + 1).padStart(2, '0')}.png`);
    await comps[i].screenshot({ path: f });
    shots.push(f);
  }
  console.log(`overview: ${shots.length} component sheets in ${path.relative(root, out)}`);
}

// Full-size checks
await page.evaluate(() => document.body.classList.add('full'));
await page.waitForTimeout(200);
const slides = await page.$$('[data-btl-slide]');
const report = [];
for (const slide of slides) {
  const story = await slide.evaluate((el) => el.closest('[data-story]')?.getAttribute('data-story') + ' #' + [...el.closest('[data-story]').querySelectorAll('[data-btl-slide]')].indexOf(el));
  const { issues: found } = await validateSlide(page, slide);
  const issues = found.map(formatIssue);
  report.push({ story, issues });
}
await browser.close();

fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(out, 'report.js'), `window.__report = ${JSON.stringify(report)};`);
const bad = report.filter((r) => r.issues.length);
for (const r of bad) console.log(`✗ ${r.story}\n   - ${r.issues.join('\n   - ')}`);
console.log(`${report.length} slides checked, ${bad.length} with issues${errors.length ? `, ${errors.length} page errors` : ''}`);
process.exit(bad.length || errors.length ? 1 : 0);
