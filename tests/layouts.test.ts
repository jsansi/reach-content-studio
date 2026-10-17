// Every layout renders at 1080×1350 with no layout problems, and the checks catch a misplaced hero image.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

process.env.REACH_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-layouts-'));
const { renderCarousel, LAYOUTS } = await import('../studio/engine.js');
const { checkRenderable } = await import('../server/pipeline/validate.ts');

const gallery = JSON.parse(fs.readFileSync('content/layout-gallery.json', 'utf8'));
const poc = JSON.parse(fs.readFileSync('content/spinal-decompression/dia-mundial-columna-2026.json', 'utf8'));

test('the gallery plus the POC cover every layout', () => {
  const used = new Set([...gallery.slides, ...poc.slides].map((s: { layout: string }) => s.layout));
  assert.deepEqual([...LAYOUTS].sort(), [...used].sort());
  assert.equal(checkRenderable(gallery).slides.length, gallery.slides.length);
});

test('every new layout renders 1080×1350 without layout problems', async () => {
  const out = path.join(process.env.REACH_DATA_DIR!, 'gallery');
  const { slides, problems } = await renderCarousel({ content: gallery, outDir: out, extras: false });
  assert.deepEqual(problems, []);
  for (const s of slides) assert.deepEqual([s.width, s.height], [1080, 1350]);
});

test('a hero image running under the headline is reported', async () => {
  const bad = structuredClone(gallery);
  bad.slides = [{ ...gallery.slides[0], imageFrame: { left: 0, top: 500, width: 1080 } }];
  const { problems } = await renderCarousel({ content: bad, outDir: path.join(process.env.REACH_DATA_DIR!, 'bad'), extras: false });
  assert.ok(problems.some((p) => p.message === 'image runs under .h-title'), JSON.stringify(problems));
});

test('a hero image can be cropped in height and faded at the top', async () => {
  const s = { ...gallery.slides[0], imageFrame: { left: 0, top: 200, width: 1080, height: 500, fadeTop: 200 } };
  const content = { ...gallery, slides: [s] };
  const out = path.join(process.env.REACH_DATA_DIR!, 'crop');
  const { problems } = await renderCarousel({ content, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  const html = fs.readFileSync(path.join(out, 'slides.html'), 'utf8');
  assert.match(html, /height:500px;object-fit:cover/);
  assert.match(html, /mask-image:linear-gradient\(to bottom,transparent 0,#000 200px,#000 100%\)/);
});

test('hero text can be centred when asked (align: "center")', async () => {
  const s = { ...gallery.slides[0], align: 'center' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'center');
  const { problems } = await renderCarousel({ content: { ...gallery, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /class="h-text blk h-center"/);
});

test('hero title can set **words** in SemiBold when asked', async () => {
  const s = { ...gallery.slides[0], title: 'Día de la\n**prueba**' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'bold');
  const { problems } = await renderCarousel({ content: { ...gallery, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /Día de la<br><b>prueba<\/b>/);
});

test('hero date pill can be pink when asked', async () => {
  const s = { ...gallery.slides[0], datePill: '19 de octubre', pillColor: 'pink' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'pink');
  const { problems } = await renderCarousel({ content: { ...gallery, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /class="pill pill-pink">19 de octubre/);
});

test('benefits CTA band can use the lit gradient (ctaBand: "glow")', async () => {
  const s = { ...poc.slides[2], ctaBand: 'glow' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'glow');
  const { problems } = await renderCarousel({ content: { ...poc, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /class="b-cta blk b-cta-glow"/);
});

test('a commemoration cover can carry the femur (illustration: "bone") without layout problems', async () => {
  const s = {
    layout: 'commemoration', illustration: 'bone', datePill: '20 de octubre', eyebrow: 'Día Mundial de\nla Osteoporosis',
    title: 'Cuando el hueso\nse vuelve frágil,\nla consulta se\nvuelve clave.', question: '¿Qué puede ofrecer tu consulta\nde rehabilitación?',
    swipe: 'Desliza para descubrirlo', style: [{ selector: '.c-title', property: 'font-size', value: '80px' }], alt: 'Portada con fémur.',
  };
  const content = { ...poc, slides: [s] };
  assert.equal(checkRenderable(content).slides.length, 1);
  const out = path.join(process.env.REACH_DATA_DIR!, 'bone');
  const { slides, problems } = await renderCarousel({ content, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.deepEqual([slides[0].width, slides[0].height], [1080, 1350]);
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /class="c-bone blk"/);
});

test('a hero can show two photos (extraImages) with side fades, and the headline check covers both', async () => {
  const base = gallery.slides.find((s: { layout: string; theme?: string }) => s.layout === 'hero');
  const s = {
    ...base, theme: 'light',
    imageFrame: { left: -60, top: 140, width: 640, fadeRight: 80, fadeBottom: 60 },
    extraImages: [{ image: base.image, imageAlt: 'Segunda foto', imageFrame: { left: 520, top: 360, width: 600, fadeLeft: 80, fadeTop: 40 } }],
  };
  const content = { ...gallery, slides: [s] };
  assert.equal(checkRenderable(content).slides.length, 1);
  const out = path.join(process.env.REACH_DATA_DIR!, 'hero2');
  const { problems } = await renderCarousel({ content, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  const html = fs.readFileSync(path.join(out, 'slides.html'), 'utf8');
  assert.equal((html.match(/<img [^>]*mask-composite:intersect/g) ?? []).length, 2);
  // a second photo running under the headline is reported like the first one
  const bad = { ...s, extraImages: [{ ...s.extraImages[0], imageFrame: { left: 0, top: 700, width: 1080 } }] };
  const r = await renderCarousel({ content: { ...gallery, slides: [bad] }, outDir: path.join(process.env.REACH_DATA_DIR!, 'hero2bad'), extras: false });
  assert.ok(r.problems.some((p) => p.message === 'image runs under .h-title'), JSON.stringify(r.problems));
});

test('a hero can carry an accent rule and **accented** body phrases (on request)', async () => {
  const base = gallery.slides.find((s: { layout: string }) => s.layout === 'hero');
  const s = { ...base, theme: 'light', rule: true, body: 'Texto de apoyo con\n**una frase resaltada.**' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'hero-rule');
  const { problems } = await renderCarousel({ content: { ...gallery, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  const html = fs.readFileSync(path.join(out, 'slides.html'), 'utf8');
  assert.match(html, /<div class="h-rule"><\/div>/);
  assert.match(html, /<p class="h-body">Texto de apoyo con<br>\s*<b>una frase resaltada\.<\/b><\/p>|<b>una frase resaltada\.<\/b>/);
});

test('a light hero can take its sky light from the right (lightFrom: "right")', async () => {
  const base = gallery.slides.find((s: { layout: string }) => s.layout === 'hero');
  const s = { ...base, theme: 'light', lightFrom: 'right' };
  const out = path.join(process.env.REACH_DATA_DIR!, 'hero-light-right');
  const { problems } = await renderCarousel({ content: { ...gallery, slides: [s] }, outDir: out, extras: false });
  assert.deepEqual(problems, [], JSON.stringify(problems));
  assert.match(fs.readFileSync(path.join(out, 'slides.html'), 'utf8'), /class="slide bg-light light-right"/);
});
