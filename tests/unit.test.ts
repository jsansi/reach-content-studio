// Fast checks: schema, validation rules, prompts, ZIP writer, slide diffing. Run: npm test
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

process.env.REACH_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-unit-')); // never touch data/
const { CarouselContent } = await import('../shared/schema.ts');
const { buildValidation, checkRenderable } = await import('../server/pipeline/validate.ts');
const { loadPrompt } = await import('../server/ai/prompts.ts');
const { changedSlides } = await import('../server/pipeline/jobs.ts');
const { zip } = await import('../server/zip.ts');
const { styleOverrides } = await import('../studio/engine.js');

const poc = JSON.parse(fs.readFileSync('content/spinal-decompression/dia-mundial-columna-2026.json', 'utf8'));

test('the POC content matches the carousel schema and is renderable', () => {
  assert.ok(CarouselContent.safeParse(poc).success);
  assert.equal(checkRenderable(poc).slides.length, 3);
});

test('unknown icons and missing images are rejected before rendering', () => {
  const bad = structuredClone(poc);
  bad.slides[2].benefits[0].icon = 'rocket';
  bad.slides[1].images[0].src = 'public/assets/nope.png';
  assert.throws(() => checkRenderable(bad), /rocket[\s\S]*nope\.png|nope\.png[\s\S]*rocket/);
});

test('validation flags brand naming and unapproved "approved" claims', () => {
  const c = structuredClone(poc);
  c.caption += ' Somos BTL Medical.';
  const v = buildValidation(c, [{ slide: 2, message: '.p-title overlaps .p-row' }], {
    claims: [{ claim: 'Alivia el dolor', location: 'caption', source: 'x', approval: 'approved_claim' }],
    products: [{ approvedClaims: [] } as never],
    expectedSlides: 3,
  });
  assert.equal(v.status, 'warnings');
  assert.ok(v.problems.some((p) => p.includes('BTL El Salvador')));
  assert.ok(v.problems.some((p) => p.includes('approved_claims')));
  assert.ok(v.problems.some((p) => p.startsWith('Diapositiva 2: elementos superpuestos')));
});

test('every prompt file has an id and a version', () => {
  const files = ['system', 'brands'].flatMap((d) => fs.readdirSync(`prompts/${d}`).map((f) => `prompts/${d}/${f}`));
  assert.ok(files.length >= 8);
  for (const f of files) {
    const p = loadPrompt(path.resolve(f));
    assert.match(p.version, /^\d+\.\d+\.\d+$/, f);
    assert.ok(p.body.length > 100, f);
  }
});

test('changedSlides detects only the edited slide', () => {
  const b = structuredClone(poc);
  b.slides[1].title = 'Otro titular';
  assert.deepEqual(changedSlides(poc, b), [1]);
  b.caption = 'x';
  assert.deepEqual(changedSlides(poc, b), [1]);
});

test('style overrides only accept whitelisted selectors, properties and values', () => {
  assert.match(styleOverrides([{ style: [{ selector: '.p-title', property: 'font-size', value: '60px' }] }]), /#slide-1 \.p-title\{font-size:60px\}/);
  assert.throws(() => styleOverrides([{ style: [{ selector: '.p-title', property: 'background', value: 'red' }] }]));
  assert.throws(() => styleOverrides([{ style: [{ selector: '.p-title', property: 'width', value: '1px;}body{x:1' }] }]));
});

test('zip writer produces a readable archive', async () => {
  const data = zip([{ name: 'a.txt', data: Buffer.from('hola') }, { name: 'b.txt', data: Buffer.from('mundo') }]);
  assert.equal(data.readUInt32LE(0), 0x04034b50);
  assert.equal(data.readUInt32LE(data.length - 22), 0x06054b50);
  assert.equal(data.readUInt16LE(data.length - 12), 2);
  const file = path.join(process.env.REACH_DATA_DIR!, 't.zip');
  fs.writeFileSync(file, data);
  const { execFileSync } = await import('node:child_process');
  assert.match(execFileSync('unzip', ['-t', file]).toString(), /No errors detected/);
});

test('a registered product can be completed later, and an attached PDF counts as its information', async () => {
  const { seed } = await import('../server/seed.ts');
  const repo = await import('../server/repo.ts');
  const { loadProducts } = await import('../server/pipeline/context.ts');
  seed();
  const prod = repo.createProduct({ name: 'BTL Prueba Ficha' });
  const pub = repo.createPublication({ brand_id: 'btl-medical-sv', date: '2026-10-20', topic: 'x', format: 'carousel', objective: 'Fecha conmemorativa', slide_count: 3, product_ids: [prod.id] } as any);
  assert.match(loadProducts(pub).blocking.join(' '), /Completar ficha/);
  repo.addAttachment(pub.id, { kind: 'document', filename: 'ficha.pdf', path: 'data/uploads/x/ficha.pdf', mime: 'application/pdf', size: 1 });
  const withPdf = loadProducts(pub);
  assert.deepEqual(withPdf.blocking, []);
  assert.ok(withPdf.warnings.some((w) => /documentos adjuntos/.test(w)));
  const pub2 = repo.createPublication({ brand_id: 'btl-medical-sv', date: '2026-10-21', topic: 'y', format: 'carousel', objective: 'Fecha conmemorativa', slide_count: 3, product_ids: [prod.id] } as any);
  repo.updateProduct(prod.id, { description: 'Descripción oficial', features: ['Uno'] });
  assert.deepEqual(loadProducts(pub2).blocking, []);
  assert.throws(() => repo.updateProduct('spinal-decompression', { description: 'x' }), /catálogo/);
});

test('official sources: only BTL sites; PDF photos are extracted when the publication has no image', async () => {
  process.env.REACH_OFFLINE = '1';
  const zlib = await import('node:zlib');
  const { officialUrl, extractPdfImages, gatherSources } = await import('../server/pipeline/sources.ts');
  const repo = await import('../server/repo.ts');
  const { UPLOADS_DIR, rel } = await import('../server/paths.ts');
  assert.ok(officialUrl('https://www.btlnet.es/magnetotherapy'));
  assert.ok(officialUrl('https://www.btlaesthetics.com/es/emfemme'));
  assert.equal(officialUrl('https://eternawellnessmd.com/emfemme'), null);
  // A minimal PDF with one 600×400 RGB Flate image.
  const w = 600, h = 400, px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < px.length; i += 3) { px[i] = (i / 3) % 256; px[i + 1] = 120; px[i + 2] = 200; }
  const z = zlib.deflateSync(px);
  const pdf = Buffer.concat([Buffer.from(`%PDF-1.4\n1 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ${z.length} /Filter /FlateDecode >>\nstream\n`, 'latin1'), z, Buffer.from('\nendstream\nendobj\n%%EOF\n', 'latin1')]);
  const imgs = extractPdfImages(pdf);
  assert.equal(imgs.length, 1);
  assert.deepEqual([imgs[0].width, imgs[0].height, imgs[0].ext], [600, 400, '.png']);
  assert.equal(imgs[0].data.readUInt32BE(16), 600);
  const prod = repo.createProduct({ name: 'BTL Prueba PDF', url: 'https://www.btlnet.es/prueba' });
  const pub = repo.createPublication({ brand_id: 'btl-medical-sv', date: '2026-10-22', topic: 'z', format: 'carousel', objective: 'Fecha conmemorativa', slide_count: 3, product_ids: [prod.id] } as any);
  const file = path.join(UPLOADS_DIR, `pub-${pub.id}`, 'doc.pdf');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, pdf);
  repo.addAttachment(pub.id, { kind: 'document', filename: 'doc.pdf', path: rel(file), mime: 'application/pdf', size: pdf.length });
  const r = await gatherSources(pub, repo.getProducts([prod.id]));
  assert.ok(r.notes.some((n) => /1 foto\(s\) de doc\.pdf/.test(n)), JSON.stringify(r));
  assert.ok(repo.listAttachments(pub.id).some((a) => a.kind === 'image' && a.filename.startsWith('pdf-doc-')));
  // Second run: nothing new (already processed, and the publication now has an image).
  assert.deepEqual((await gatherSources(pub, repo.getProducts([prod.id]))).notes, []);
});

test('art directions: the bank parses and three come from different families, least used first', async () => {
  const { loadBank, pickDirections } = await import('../server/design/directions.ts');
  const bank = loadBank();
  assert.ok(bank.length >= 12);
  assert.equal(new Set(bank.map((d) => d.id)).size, bank.length);
  for (const d of bank) assert.ok(d.name && d.family && d.body.length > 80, d.id);
  for (let i = 0; i < 20; i++) {
    const p = pickDirections(bank, []);
    assert.equal(p.length, 3);
    assert.equal(new Set(p.map((d) => d.family)).size, 3);
  }
  // everything used except three: those three come next, whatever the order of the history
  const unused = ['poster-tipografico', 'macro-detalle', 'plano-tecnico'];
  const used = bank.map((d) => d.id).filter((id) => !unused.includes(id));
  assert.deepEqual(pickDirections(bank, used).map((d) => d.id).sort(), [...unused].sort());
});

test('design memory: similar structures are flagged, different ones are not', async () => {
  const { designSignature, describeDesign, repetitionWarnings, similarity } = await import('../server/design/memory.ts');
  const n = (type: string, props = {}, text: string | null = null) => ({ id: type, parent: null, type, props: JSON.stringify(props), text });
  const slide = (background: string, ...types: string[]) => ({ purpose: '', background, lightFrom: null, alt: '', nodes: [n('BtlLogo', { placement: 'top-right' }), n('Headline', {}, 'Gancho\nde prueba'), ...types.map((t) => n(t))] });
  const a = { direction: 'A', slides: [slide('dark', 'BoneIllustration', 'Halo'), slide('white', 'BigNumber', 'ProductImage'), slide('light', 'Curve')] };
  const b = { direction: 'B', slides: [slide('white', 'ModuleGrid', 'Stat'), slide('deep', 'ProductImage', 'Rings'), slide('blue', 'LightBand')] } as any;
  assert.equal(similarity(designSignature(a as any), designSignature(a as any)), 1);
  assert.ok(similarity(designSignature(a as any), designSignature(b)) < 0.5);
  assert.match(describeDesign(a as any), /diap\. 1 dark: BoneIllustration, Halo .* gancho: «Gancho de prueba»/);
  const past = [{ versionId: 1, publicationId: 1, label: 'v1', directionId: null, directionName: 'x', signature: designSignature(a as any), description: '' }];
  const w = repetitionWarnings([a as any, b], past);
  assert.match(w.get('A')![0], /Diseño repetido/);
  assert.deepEqual(w.get('B'), []);
});

test('fixed structure: hook · equipo · ventajas, and approved texts must appear in their slides', async () => {
  const { narrative, missingApprovedTexts, classicSlideTexts } = await import('../shared/structure.ts');
  assert.deepEqual(narrative({ format: 'carousel', slide_count: 3, product_ids: ['x'] }).map((r) => r.role), ['hook', 'equipo', 'ventajas']);
  assert.deepEqual(narrative({ format: 'carousel', slide_count: 4, product_ids: ['x'] }).map((r) => r.role), ['hook', 'equipo', 'equipo', 'ventajas']);
  assert.deepEqual(narrative({ format: 'carousel', slide_count: 3, product_ids: [] }).map((r) => r.role), ['hook', 'desarrollo', 'cierre']);
  assert.deepEqual(narrative({ format: 'single_image', slide_count: 1, product_ids: [] }).map((r) => r.role), ['pieza']);

  const copy = {
    approved_at: '', slides: [
      { slide: 1, role: 'hook' as const, headline: 'Cuando el hueso\nse vuelve frágil.', support: null, points: [], claims: [] },
      { slide: 3, role: 'ventajas' as const, headline: 'Tu ventaja', support: null, points: [{ title: 'Pacientes en orden', text: 'Base de datos de pacientes.' }], claims: [] },
    ],
  };
  // line breaks, **emphasis**, case and a dropped final period don't count as changes
  const slides = [
    { layout: 'commemoration', title: '**Cuando el hueso se vuelve\nfrágil**', alt: 'x' },
    { layout: 'hero', title: 'x', alt: 'x' },
    { layout: 'benefits', title: 'Tu ventaja', benefits: [{ icon: 'checklist', title: 'Pacientes en orden', text: 'Base de datos de pacientes' }], alt: 'x' },
  ];
  assert.deepEqual(missingApprovedTexts(copy, slides.map(classicSlideTexts)), []);
  slides[2].benefits[0].title = 'Pacientes ordenados';
  // the alt text never satisfies the check
  (slides[2] as any).alt = 'Pacientes en orden';
  assert.match(missingApprovedTexts(copy, slides.map(classicSlideTexts)).join(), /Diapositiva 3.*Pacientes en orden/);
});

test('direct design edits: editable texts with their effective style; invalid values are rejected', async () => {
  const { editableTexts, applyNodeEdits, claimSlide } = await import('../shared/design-edit.ts');
  const n = (id: string, type: string, props: object, text: string | null = null) => ({ id, parent: null, type: type as any, props: JSON.stringify(props), text });
  const slide = {
    purpose: 't', background: 'dark' as const, lightFrom: null, alt: 't',
    nodes: [n('logo', 'BtlLogo', {}), n('h', 'Headline', { size: 'xl' }, 'Titular'), n('e', 'Eyebrow', {}, 'Etiqueta'), n('c', 'CtaBlock', { title: 'Solicita tu demo' })],
  };
  const t = editableTexts(slide);
  assert.deepEqual(t.map((x) => x.node), ['h', 'e', 'c']);
  assert.deepEqual(t[0], { node: 'h', type: 'Headline', text: 'Titular', size: 'xl', weight: 'light', tone: 'strong' });
  assert.deepEqual(t[1], { node: 'e', type: 'Eyebrow', text: 'Etiqueta', size: 30, weight: 'semibold', tone: 'accent' });
  const out = applyNodeEdits(slide, [{ node: 'h', text: 'Nuevo\r\ntitular ', weight: 'regular', size: 'l' }, { node: 'e', size: 44 }, { node: 'c', text: 'Agenda tu demo' }]);
  assert.equal(out.nodes[1].text, 'Nuevo\ntitular');
  assert.deepEqual(JSON.parse(out.nodes[1].props), { size: 'l', weight: 'regular' });
  assert.equal(JSON.parse(out.nodes[2].props).size, 44);
  assert.equal(JSON.parse(out.nodes[3].props).title, 'Agenda tu demo');
  assert.equal(slide.nodes[1].text, 'Titular', 'the original slide is untouched');
  assert.throws(() => applyNodeEdits(slide, [{ node: 'h', size: 'huge' }]), /Tamaño no válido/);
  assert.throws(() => applyNodeEdits(slide, [{ node: 'e', size: 50 }]), /Tamaño no válido/);
  assert.throws(() => applyNodeEdits(slide, [{ node: 'logo', text: 'x' }]), /no es un texto editable/);
  assert.throws(() => applyNodeEdits(slide, [{ node: 'h', text: '  ' }]), /no puede quedar vacío/);
  assert.equal(claimSlide('diapositiva 3'), 3);
  assert.equal(claimSlide('slide 2'), 2);
  assert.equal(claimSlide('caption'), null);
});
