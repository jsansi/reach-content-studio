// Decorative primitives (Halo, Curve, LightBand, ProductImage fade) and the product secondary color: the
// structural check, the visual checks that guard them (decor behind text, secondary color > 10 %) and the
// color lookup from the BTL Social Media Guideline. ~10 s (Playwright renders).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkDesign, renderProposal } from '../server/design/render.ts';
import { secondaryColorFor } from '../design-system/btl/catalog.mjs';
import type { ProposalT } from '../shared/design.ts';

const IMG = 'public/assets/products/spinal-decompression/posiciones/semiincorporada-inclinada.png';
const node = (id: string, type: string, props: object, text: string | null = null, parent: string | null = null) => ({ id, parent, type, props: JSON.stringify(props), text });
const one = (nodes: ReturnType<typeof node>[], background: ProposalT['slides'][number]['background'] = 'dark'): ProposalT => ({
  direction: 'A', direction_name: 'Prueba', concept: 'x', differentiation: 'x', caption: 'x', sources: [], claims: [],
  slides: [{ purpose: 'x', background, lightFrom: null, alt: 'x', nodes: [node('logo', 'BtlLogo', { placement: 'top-right' }), ...nodes] }],
});
const headline = [node('r', 'Region', { top: 400, right: 'm' }), node('h', 'Headline', { size: 'xl', tone: 'base' }, 'Una línea\nque sigue.', 'r')];
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'reach-decor-'));

test('secondary colors follow the Social Media Guideline; EMFEMME 360 has none', () => {
  assert.equal(secondaryColorFor(['EMFACE']), '#e2007d');
  assert.equal(secondaryColorFor(['Emsculpt  Neo']), '#0096ff');
  assert.equal(secondaryColorFor(['EMFEMME 360']), null);
  assert.equal(secondaryColorFor(['EMFACE', 'EXOMIND']), null, 'two products with different colors: none applies');
});

test('structural check: secondary tone needs an assigned color; Curve needs 2–5 points', () => {
  const p = one([node('h', 'Halo', { cx: 500, cy: 500, r: 200, tone: 'secondary' }), node('c', 'Curve', { points: [[0, 0]] })]);
  const errors = checkDesign(p, new Set(), 1, null);
  assert.ok(errors.some((e) => /color secundario/.test(e)));
  assert.ok(errors.some((e) => /points/.test(e)));
  assert.equal(checkDesign(one([node('h', 'Halo', { cx: 500, cy: 500, r: 200, tone: 'secondary' })]), new Set(), 1, '#e2007d').length, 0);
});

test('decor clear of the text, a faded photo and a light band pass the visual checks', async () => {
  const out = tmp();
  const p = one([
    node('img', 'ProductImage', { src: IMG, alt: 'Equipo', left: 80, top: 700, width: 1000, fade: ['left', 'bottom'] }),
    node('band', 'LightBand', { left: -40, top: 1060, width: 900, height: 200, fade: ['right'] }),
    node('halo', 'Halo', { cx: 900, cy: 900, r: 200, glow: 0.6 }),
    node('c', 'Curve', { points: [[-100, 640], [600, 600], [1200, 660]] }),
    ...headline,
  ]);
  const r = await renderProposal(p, out);
  assert.deepEqual(r.issues, [[]]);
  fs.rmSync(out, { recursive: true, force: true });
});

test('a curve behind the headline and too much secondary color are flagged', async () => {
  const out = tmp();
  const p = one([
    node('c', 'Curve', { points: [[-100, 470], [600, 440], [1200, 500]], width: 6 }),
    // Eight thick concentric rings: well over 10 % of the canvas in the secondary color.
    ...[120, 170, 220, 270, 320, 370, 420, 470].map((r) => node(`h${r}`, 'Halo', { cx: 540, cy: 1100, r, thickness: 16, tone: 'secondary', glow: 0 })),
    ...headline,
  ]);
  const r = await renderProposal(p, out, { secondary: '#e2007d' });
  assert.ok(r.issues[0].some((i) => /curva o un halo pasa por detrás del texto/.test(i)), r.issues[0].join('; '));
  assert.ok(r.issues[0].some((i) => /color secundario del producto ocupa/.test(i)), r.issues[0].join('; '));
  fs.rmSync(out, { recursive: true, force: true });
});

test('bone illustrations render and pass the visual checks', async () => {
  const out = tmp();
  const p = one([
    node('rb', 'Region', { left: 640, top: 260 }),
    node('bone', 'BoneIllustration', { width: 330, height: 920, porous: true }, null, 'rb'),
    node('r', 'Region', { top: 300, width: 520, gap: 30 }),
    node('h', 'Headline', { size: 'l', tone: 'base' }, 'Huesos que\nsostienen\ncada paso.', 'r'),
    node('row', 'Stack', { direction: 'row', gap: 40 }, null, 'r'),
    node('d1', 'BoneDensity', { size: 220, label: 'Sano' }, null, 'row'),
    node('d2', 'BoneDensity', { size: 220, porous: true, label: 'Poroso' }, null, 'row'),
  ]);
  assert.deepEqual(checkDesign(p, new Set(), 1, null), []);
  const r = await renderProposal(p, out);
  assert.deepEqual(r.issues, [[]]);
  fs.rmSync(out, { recursive: true, force: true });
});

test('Illustration: only shapes in brand colours; renders and passes the checks', async () => {
  const { checkIllustrationSvg } = await import('../design-system/btl/illustration.mjs');
  const knee = '<defs><filter id="g"><feGaussianBlur stdDeviation="4"/></filter></defs>'
    + '<path d="M120 20 L150 230 Q160 270 200 280 L230 285" fill="none" stroke="#ffffff" stroke-width="4"/>'
    + '<path d="M100 520 L140 330 Q150 300 190 300 L240 305" fill="none" stroke="#ffffff" stroke-width="4"/>'
    + '<ellipse cx="190" cy="292" rx="60" ry="12" fill="#96d2ff" filter="url(#g)"/>';
  assert.deepEqual(checkIllustrationSvg(knee), []);
  assert.ok(checkIllustrationSvg('<text x="0" y="0">Hola</text>').length);
  assert.ok(checkIllustrationSvg('<path d="M0 0L10 10" stroke="#ff0000"/>').some((e) => /paleta/.test(e)));
  assert.ok(checkIllustrationSvg('<path d="M0 0" onclick="x()"/>').length);
  assert.ok(checkIllustrationSvg('<image href="http://x/y.png"/>').length);
  const out = tmp();
  const p = one([
    node('ri', 'Region', { left: 600, top: 280 }),
    node('ill', 'Illustration', { svg: knee, viewBox: '0 0 300 540', width: 340, title: 'Rodilla esquemática' }, null, 'ri'),
    ...headline,
  ]);
  assert.deepEqual(checkDesign(p, new Set(), 1, null), []);
  const r = await renderProposal(p, out);
  assert.deepEqual(r.issues, [[]]);
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /url\(#ill\d+-g\)/);
  fs.rmSync(out, { recursive: true, force: true });
});
