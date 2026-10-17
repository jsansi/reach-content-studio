// Builds output/spinal-decompression/comparativa.html from options A, B and C.
// Read-only for every option: it only references their PNGs and reads their captions.
// Usage: node studio/compare.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'output/spinal-decompression');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const a = read('content/spinal-decompression/dia-mundial-columna-2026.json');
const b = read('output/spinal-decompression/opcion-b/source/content.json');
const c = read('output/spinal-decompression/opcion-c/source/content.json');

const options = [
  { key: 'A', name: 'Opción A · Actual', approach: 'Versión aprobada, sin cambios.', dir: '', data: a },
  { key: 'B', name: b.name, approach: b.approach, dir: 'opcion-b/', data: b },
  { key: 'C', name: c.name, approach: c.approach, dir: 'opcion-c/', data: c },
];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const img = (o, i) =>
  `<img src="${o.dir}slide-0${i}.png" alt="${esc(o.data.slides[i - 1].alt || `Opción ${o.key}, lámina ${i}`)}" loading="lazy">`;

const byOption = options
  .map(
    (o) => `<section class="opt">
      <header><h2>${esc(o.name)}</h2><p>${esc(o.approach)}</p></header>
      <div class="row">${[1, 2, 3].map((i) => `<figure>${img(o, i)}<figcaption>Lámina ${i}</figcaption></figure>`).join('')}</div>
      <details><summary>Caption (${o.data.caption.length} caracteres)</summary><pre>${esc(o.data.caption)}</pre></details>
    </section>`
  )
  .join('');

const bySlide = [1, 2, 3]
  .map(
    (i) => `<section class="opt">
      <header><h2>Lámina ${i}</h2></header>
      <div class="row">${options.map((o) => `<figure>${img(o, i)}<figcaption>Opción ${o.key}</figcaption></figure>`).join('')}</div>
    </section>`
  )
  .join('');

const captions = `<section class="opt"><header><h2>Captions</h2></header><div class="caps">${options
  .map((o) => `<div><h3>Opción ${o.key}</h3><pre>${esc(o.data.caption)}</pre></div>`)
  .join('')}</div></section>`;

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Comparativa A · B · C</title>
<style>
:root { --ink:#000a32; --muted:#00508c; --bg:#f2f5f8; --card:#ffffff; --line:#d5dfe9; --accent:#00508c; --on-accent:#fff; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ink:#e8f1fa; --muted:#96d2ff; --bg:#0b1020; --card:#141b2e; --line:#26324d; --accent:#96d2ff; --on-accent:#000a32; } }
:root[data-theme="dark"] { --ink:#e8f1fa; --muted:#96d2ff; --bg:#0b1020; --card:#141b2e; --line:#26324d; --accent:#96d2ff; --on-accent:#000a32; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font-family: system-ui, -apple-system, sans-serif; }
main { max-width: 1240px; margin: 0 auto; padding: 28px 16px 60px; }
h1 { font-size: 24px; margin: 0 0 4px; } .lede { color: var(--muted); margin: 0 0 20px; }
.tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom: 20px; }
.tabs button { font: inherit; font-size: 14px; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line);
  background: var(--card); color: var(--ink); cursor: pointer; }
.tabs button[aria-selected="true"] { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.view[hidden] { display:none; }
.opt { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 18px; margin-bottom: 18px; }
.opt header h2 { font-size: 18px; margin: 0 0 4px; } .opt header p { margin: 0 0 14px; color: var(--muted); font-size: 14px; line-height: 1.45; }
.row { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
figure { margin:0; } img { width:100%; height:auto; display:block; border-radius: 4px; box-shadow: 0 6px 22px rgba(0,10,50,.16); }
figcaption { font-size: 13px; color: var(--muted); margin-top: 8px; }
details { margin-top: 14px; } summary { cursor: pointer; font-size: 14px; color: var(--muted); }
pre { white-space: pre-wrap; font: 14px/1.55 system-ui, sans-serif; margin: 10px 0 0; padding: 14px; border-left: 3px solid var(--accent); background: var(--bg); }
.caps { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; } .caps h3 { margin: 0; font-size: 15px; }
@media (max-width: 760px) { .row, .caps { grid-template-columns: 1fr; } }
</style></head>
<body><main>
<h1>Día Mundial de la Columna Vertebral · Comparativa</h1>
<p class="lede">BTL El Salvador · BTL Spinal Decompression · 16 de octubre de 2026 · Opción A sin cambios; B y C son alternativas.</p>
<div class="tabs" role="tablist">
  <button role="tab" aria-selected="true" data-view="opciones">Carrusel completo</button>
  <button role="tab" aria-selected="false" data-view="laminas">Lámina por lámina</button>
  <button role="tab" aria-selected="false" data-view="captions">Captions</button>
</div>
<div class="view" id="opciones">${byOption}</div>
<div class="view" id="laminas" hidden>${bySlide}</div>
<div class="view" id="captions" hidden>${captions}</div>
</main>
<script>
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach((t) => t.addEventListener('click', () => {
  tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
  document.querySelectorAll('.view').forEach((v) => (v.hidden = v.id !== t.dataset.view));
}));
</script>
</body></html>`;

fs.writeFileSync(path.join(OUT, 'comparativa.html'), html);
console.log('output/spinal-decompression/comparativa.html');
