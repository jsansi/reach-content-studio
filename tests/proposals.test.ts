// Creative proposals end to end on a temporary data folder (Claude Code mode, results written by the test):
// calendar publication → three proposals rendered with the BTL design system and validated → choose one →
// regenerate one slide (only that slide re-rendered) → approve → ZIP export. ~30 s (Playwright renders).
import assert from 'node:assert/strict';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-prop-'));
const PORT = 4691;
const URL = `http://localhost:${PORT}`;
let server: ChildProcess | null = null;

const api = async (method: string, p: string, body?: unknown) => {
  const r = await fetch(URL + p, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, json: (await r.json().catch(() => null)) as any };
};
const waitJob = async (pubId: number) => {
  for (let i = 0; i < 300; i++) {
    const d = (await api('GET', `/api/publications/${pubId}`)).json;
    if (d.jobs[0] && !['pending', 'running'].includes(d.jobs[0].status)) return d;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('job timeout');
};

let firstRound: string[] = [];
const node = (id: string, parent: string | null, type: string, props: object, text: string | null = null) => ({ id, parent, type, props: JSON.stringify(props), text });
const slide = (title: string, img: string, last: boolean) => ({
  purpose: 'test', background: 'dark', lightFrom: null, alt: title,
  nodes: [
    node('logo', null, 'BtlLogo', { placement: 'top-left' }),
    node('img', null, 'ProductImage', { src: img, alt: 'Equipo', left: 160, top: 760, width: 760 }),
    node('ill', null, 'Illustration', { svg: '<path d="M20 20 L150 260" stroke="#96d2ff" stroke-width="4" fill="none"/>', viewBox: '0 0 300 540', width: 120, title: 'Rodilla de prueba' }),
    node('r', null, 'Region', { top: 300, right: 'm', gap: 24 }),
    node('h', 'r', 'Headline', { size: 'l', tone: 'base' }, title),
    last ? node('cta', null, 'Region', { bottom: 'm', right: 'm' }) : node('sw', null, 'SwipeCue', {}, 'Desliza'),
    ...(last ? [node('c', 'cta', 'CtaBlock', { variant: 'split', size: 60 })] : []),
  ],
});
const proposal = (dir: 'A' | 'B' | 'C', img: string) => ({
  direction: dir, direction_name: `Dirección ${dir}`, concept: 'Concepto de prueba.', differentiation: 'Prueba.',
  slides: [slide(`Portada ${dir}`, img, false), slide(`Producto ${dir}`, img, false), slide(`Cierre ${dir}`, img, true)],
  caption: 'Caption de prueba. Escríbenos "DEMO" por mensaje directo.', sources: ['test'], claims: [],
});

before(async () => {
  server = spawn(process.execPath, ['server/index.ts'], {
    env: { ...process.env, REACH_DATA_DIR: DATA, PORT: String(PORT), REACH_AI_MODE: 'claude_code', ANTHROPIC_API_KEY: '', REACH_OFFLINE: '1' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${URL}/api/settings`)).ok) return;
    } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('server did not start');
});
after(async () => {
  if (server) await new Promise((r) => (server!.once('exit', r), server!.kill()));
  fs.rmSync(DATA, { recursive: true, force: true });
});

test('proposals: create, choose, regenerate one slide, approve and export', async () => {
  const pub = (await api('POST', '/api/publications', {
    brand_id: 'btl-medical-sv', date: '2026-10-18', topic: 'Prueba de propuestas', format: 'carousel',
    objective: 'Fecha conmemorativa', slide_count: 3, product_ids: ['spinal-decompression'],
  })).json;

  // 1 · three proposals (manual Claude Code step, result written here)
  assert.equal((await api('POST', `/api/publications/${pub.id}/proposals`, {})).status, 200);
  let d = await waitJob(pub.id);
  const job = d.jobs[0];
  assert.equal(job.outcome, 'task_package', job.error);
  const taskDir = path.join(DATA, 'tasks', path.basename(job.task_dir));
  const allowed: string[] = JSON.parse(fs.readFileSync(path.join(taskDir, 'assets.json'), 'utf8'));
  const img = allowed.find((a) => /semiincorporada/.test(a)) ?? allowed[0];
  // the app assigned three art directions from the bank and wrote them in the brief as "### A · <name>"
  const assigned = [...fs.readFileSync(path.join(taskDir, 'brief.md'), 'utf8').matchAll(/^### ([ABC]) · (.+)$/gm)].map((m) => m[2]);
  assert.equal(assigned.length, 3, 'three directions in "Direcciones de arte asignadas a esta ronda"');
  assert.match(fs.readFileSync(path.join(taskDir, 'TASK.md'), 'utf8'), /desde cero/);
  fs.writeFileSync(path.join(taskDir, 'result.json'), JSON.stringify({ concepts_explored: ['a', 'b', 'c', 'd', 'e', 'f'], proposals: (['A', 'B', 'C'] as const).map((x) => proposal(x, img)), warnings: [] }));
  assert.equal((await api('POST', `/api/jobs/${job.id}/import`)).status, 200);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const props = d.versions.filter((v: any) => v.origin === 'proposal');
  assert.deepEqual(props.map((v: any) => v.direction).sort(), ['A', 'B', 'C']);
  for (const v of props) {
    assert.equal(v.kind, 'design');
    assert.equal(v.proposal_status, 'proposed');
    assert.equal(v.slides.length, 3);
    assert.deepEqual([v.slides[0].width, v.slides[0].height], [1080, 1350]);
    assert.ok(v.validation.design, 'visual validation recorded');
    assert.ok(v.validation.claim_checks, 'claim checks recorded separately');
  }
  assert.equal(d.publication.current_version_id, null, 'no proposal is chosen automatically');
  const byDir = [...props].sort((x: any, y: any) => x.direction.localeCompare(y.direction));
  assert.deepEqual(byDir.map((v: any) => v.design.direction_name), assigned, 'each slot keeps its assigned direction');
  firstRound = byDir.map((v: any) => v.design.direction_id);
  assert.equal(new Set(firstRound).size, 3);
  // the fixture's three proposals share one structure: flagged as repeated
  assert.ok(props.every((v: any) => v.validation.claim_checks.notes.some((n: string) => /comparten casi la misma estructura/.test(n))));

  // 2 · choose B
  const b = props.find((v: any) => v.direction === 'B');
  d = (await api('POST', `/api/versions/${b.id}/select`)).json;
  assert.equal(d.publication.current_version_id, b.id);
  assert.equal(d.versions.find((v: any) => v.direction === 'A').proposal_status, 'not_selected');

  // 3 · regenerate slide 2 only
  assert.equal((await api('POST', `/api/publications/${pub.id}/design-revisions`, { version_id: b.id, slide_number: 2, instruction: '' })).status, 200);
  d = await waitJob(pub.id);
  const rj = d.jobs[0];
  const rdir = path.join(DATA, 'tasks', path.basename(rj.task_dir));
  const revised = proposal('B', img);
  revised.slides[1] = slide('Producto B, otra composición', img, false);
  revised.slides[0].nodes = b.design.slides[0].nodes; // unchanged slides come back as they were
  revised.slides[2].nodes = b.design.slides[2].nodes;
  fs.writeFileSync(path.join(rdir, 'result.json'), JSON.stringify({ proposal: revised, summary: 'Nueva composición de la diapositiva 2', changed_slides: [2], warnings: [] }));
  await api('POST', `/api/jobs/${rj.id}/import`);
  d = await waitJob(pub.id);
  const v2 = d.versions[0];
  assert.equal(v2.parent_version_id, b.id);
  assert.equal(d.publication.current_version_id, v2.id, 'revising the chosen proposal keeps it chosen');
  assert.deepEqual(v2.slides.map((s: any) => s.rendered), [false, true, false], 'only slide 2 re-rendered');
  assert.equal(d.revisions[0].status, 'applied');
  assert.equal(v2.design.direction_id, b.design.direction_id, 'a revision keeps its art direction');

  // 4 · approve and export
  assert.equal((await api('POST', `/api/publications/${pub.id}/approve`, { version_id: v2.id })).json.publication.status, 'approved');
  // 5 · approval renders the story (9:16) versions without changing the status
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].kind, 'story');
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  assert.equal(d.publication.status, 'approved');
  const story = d.versions.find((v: any) => v.id === v2.id).story;
  assert.equal(story.slides.length, 3);
  for (const s of story.slides) assert.deepEqual([s.width, s.height], [1080, 1920]);
  const st = await fetch(`${URL}/api/versions/${v2.id}/stories/1/download`);
  assert.equal(st.status, 200);
  // the illustration used in the approved version is now in the library
  const lib = path.join(DATA, 'illustrations', 'rodilla-de-prueba.json');
  assert.ok(fs.existsSync(lib), 'illustration saved to the library');
  assert.equal(JSON.parse(fs.readFileSync(lib, 'utf8')).viewBox, '0 0 300 540');
  const zip = await fetch(`${URL}/api/versions/${v2.id}/zip`);
  assert.equal(zip.headers.get('content-type'), 'application/zip');
  const body = Buffer.from(await zip.arrayBuffer()).toString('latin1');
  assert.equal((body.match(/slide-0\d\.png/g) ?? []).length >= 3, true);
  assert.equal((body.match(/historias\/[^\0]*?historia_0\d\.png/g) ?? []).length >= 3, true);
  assert.ok(body.includes('caption.txt'));
});

test('proposals for a single image: three one-slide proposals, rendered and selectable', async () => {
  const pub = (await api('POST', '/api/publications', {
    brand_id: 'btl-medical-sv', date: '2026-10-19', topic: 'Prueba imagen única', format: 'single_image',
    objective: 'Fecha conmemorativa', slide_count: 1, product_ids: ['spinal-decompression'],
  })).json;
  assert.equal((await api('POST', `/api/publications/${pub.id}/proposals`, {})).status, 200);
  let d = await waitJob(pub.id);
  const job = d.jobs[0];
  assert.equal(job.outcome, 'task_package');
  const taskDir = path.join(DATA, 'tasks', path.basename(job.task_dir));
  const brief = fs.readFileSync(path.join(taskDir, 'brief.md'), 'utf8');
  assert.match(brief, /cada una con 1 diapositivas/);
  // second round for the brand: the first round is listed as a past design and its directions are not reused
  assert.match(brief, /Diseños anteriores de la marca[\s\S]*Prueba de propuestas · v\d+/);

  const allowed: string[] = JSON.parse(fs.readFileSync(path.join(taskDir, 'assets.json'), 'utf8'));
  const one = (dir: 'A' | 'B' | 'C') => ({ ...proposal(dir, allowed[0]), slides: [slide(`Pieza ${dir}`, allowed[0], true)] });
  fs.writeFileSync(path.join(taskDir, 'result.json'), JSON.stringify({ proposals: (['A', 'B', 'C'] as const).map(one), warnings: [] }));
  await api('POST', `/api/jobs/${job.id}/import`);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const props = d.versions.filter((v: any) => v.origin === 'proposal');
  assert.equal(props.length, 3);
  for (const v of props) assert.ok(!firstRound.includes(v.design.direction_id), 'directions rotate between rounds');
  for (const v of props) assert.equal(v.slides.length, 1);
  d = (await api('POST', `/api/versions/${props[0].id}/select`)).json;
  assert.equal(d.publication.current_version_id, props[0].id);
});

test('step 1 "Mensaje": text options → more options for one slide → approve → proposals must use the approved texts', async () => {
  const pub = (await api('POST', '/api/publications', {
    brand_id: 'btl-medical-sv', date: '2026-10-20', topic: 'Prueba de textos', format: 'carousel', objective: 'Fecha conmemorativa',
    slide_count: 3, product_ids: ['spinal-decompression'],
    brief: { audience: 'Clínicas de rehabilitación', angle: 'Tratar más pacientes con un solo equipo', tone: 'Profesional y cercano', avoid: 'Promesas de curación' },
  })).json;
  assert.equal(pub.brief.angle, 'Tratar más pacientes con un solo equipo');

  // 1 · options for the three slides of the fixed structure
  assert.equal((await api('POST', `/api/publications/${pub.id}/copy`, {})).status, 200);
  let d = await waitJob(pub.id);
  let job = d.jobs[0];
  assert.equal(job.kind, 'copy');
  assert.equal(job.outcome, 'task_package', job.error);
  let dir = path.join(DATA, 'tasks', path.basename(job.task_dir));
  let brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8');
  assert.match(brief, /1\. \*\*Hook\*\*[\s\S]*2\. \*\*Equipo\*\*[\s\S]*3\. \*\*Ventajas para la clínica\*\*/);
  assert.match(brief, /Ventaja principal para la clínica \(el ángulo del carrusel\): Tratar más pacientes/);
  assert.doesNotMatch(brief, /Imágenes y logos disponibles/, 'text-only step: no image list');
  const opt = (h: string, points: { title: string; text: string }[] = []) => ({ headline: h, support: null, points, rationale: 'r', claims: [] });
  const pts = [{ title: 'Uno', text: 'Ventaja uno.' }, { title: 'Dos', text: 'Ventaja dos.' }, { title: 'Tres', text: 'Ventaja tres.' }];
  fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify({
    angle: 'a', warnings: [],
    slides: [
      { slide: 1, options: Array.from({ length: 8 }, (_, i) => opt(`Gancho ${i + 1}`)) },
      { slide: 2, options: Array.from({ length: 4 }, (_, i) => opt(`Equipo ${i + 1}`)) },
      { slide: 3, options: Array.from({ length: 4 }, (_, i) => opt(`Ventajas ${i + 1}`, pts)) },
    ],
  }));
  const taskCheck = (name: string) => spawnSync(process.execPath, ['scripts/task-check.ts', name], { env: { ...process.env, REACH_DATA_DIR: DATA }, encoding: 'utf8' });
  assert.equal(taskCheck(path.basename(dir)).status, 0, 'task:check accepts the text options');
  await api('POST', `/api/jobs/${job.id}/import`);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  assert.equal(d.copy_options.length, 16);
  assert.equal(d.publication.status, 'planned', 'text options do not change the status');
  assert.equal(d.versions.length, 0);

  // 2 · none convinced: more options for slide 1 only, with a comment saved as a preference
  await api('POST', `/api/publications/${pub.id}/copy`, { slide: 1, instruction: 'Más conectado con la clínica', save_as_preference: true });
  d = await waitJob(pub.id);
  job = d.jobs[0];
  dir = path.join(DATA, 'tasks', path.basename(job.task_dir));
  brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8');
  assert.match(brief, /- Diapositiva 1 · Hook: \*\*8 opciones\*\*/);
  assert.doesNotMatch(brief, /- Diapositiva 2 · Equipo: \*\*/);
  assert.match(brief, /Comentario de Jaime sobre las opciones anteriores:\*\* "Más conectado con la clínica"/);
  assert.match(brief, /Textos ya propuestos[\s\S]*"Gancho 8"/);
  assert.match(brief, /Preferencias editoriales activas[\s\S]*Más conectado con la clínica/);
  fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify({ angle: 'b', warnings: [], slides: [{ slide: 1, options: [opt('Gancho nuevo\nde clínica')] }, { slide: 2, options: [opt('Ignorada')] }] }));
  assert.match(taskCheck(path.basename(dir)).stderr, /se piden 8 opciones y hay 1[\s\S]*Diapositiva 2: no se pidieron/);
  await api('POST', `/api/jobs/${job.id}/import`);
  d = await waitJob(pub.id);
  assert.equal(d.copy_options.length, 17, 'only the requested slide is stored');
  assert.equal(d.copy_options[0].headline, 'Gancho nuevo\nde clínica');

  // 3 · approve one text per slide (edited), then the proposals carry them
  assert.equal((await api('POST', `/api/publications/${pub.id}/copy/approve`, { slides: [{ slide: 1, headline: 'Portada A' }] })).status, 400, 'every slide needs a text');
  d = (await api('POST', `/api/publications/${pub.id}/copy/approve`, {
    slides: [
      { slide: 1, headline: 'Portada A', support: null, points: [], claims: [] },
      { slide: 2, headline: 'Producto A', support: null, points: [], claims: [] },
      { slide: 3, headline: 'Cierre A', support: null, points: [], claims: [] },
    ],
  })).json;
  assert.deepEqual(d.publication.approved_copy.slides.map((s: any) => s.role), ['hook', 'equipo', 'ventajas']);
  await api('POST', `/api/publications/${pub.id}/proposals`, {});
  d = await waitJob(pub.id);
  job = d.jobs[0];
  dir = path.join(DATA, 'tasks', path.basename(job.task_dir));
  assert.match(fs.readFileSync(path.join(dir, 'brief.md'), 'utf8'), /Textos aprobados \(paso 1, Mensaje\)[\s\S]*"Portada A"/);
  assert.ok(fs.existsSync(path.join(dir, 'approved-copy.json')));
  const allowed: string[] = JSON.parse(fs.readFileSync(path.join(dir, 'assets.json'), 'utf8'));
  const props = (['A', 'B', 'C'] as const).map((x) => ({ ...proposal(x, allowed[0]), slides: [slide('Portada A', allowed[0], false), slide('Producto A', allowed[0], false), slide('Cierre A', allowed[0], true)] }));
  props[2].slides[0] = slide('Otra portada', allowed[0], false); // C changed the approved hook
  fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify({ concepts_explored: ['a', 'b', 'c', 'd', 'e', 'f'], proposals: props, warnings: [] }));
  // task:check blocks the proposal that changed an approved text
  const check = taskCheck(path.basename(dir));
  assert.equal(check.status, 2);
  assert.match(check.stderr, /Propuesta C: Diapositiva 1: no aparece el texto aprobado "Portada A"/);
  // an import still works (e.g. the API path cannot be re-asked) but flags it
  await api('POST', `/api/jobs/${job.id}/import`);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const c = d.versions.find((v: any) => v.direction === 'C');
  assert.ok(c.validation.claim_checks.notes.some((n: string) => /Texto aprobado modificado · Diapositiva 1/.test(n)));
  const a = d.versions.find((v: any) => v.direction === 'A');
  assert.ok(!a.validation.claim_checks.notes.some((n: string) => /Texto aprobado modificado/.test(n)));
});

test('step 3 without AI: approve slides, adjust texts, bring a slide from another version, comment per slide', async () => {
  const pub = (await api('POST', '/api/publications', {
    brand_id: 'btl-medical-sv', date: '2026-10-22', topic: 'Prueba de ajustes', format: 'carousel',
    objective: 'Fecha conmemorativa', slide_count: 3, product_ids: ['spinal-decompression'],
  })).json;
  assert.equal((await api('POST', `/api/publications/${pub.id}/proposals`, {})).status, 200);
  let d = await waitJob(pub.id);
  const pdir = path.join(DATA, 'tasks', path.basename(d.jobs[0].task_dir));
  const img = (JSON.parse(fs.readFileSync(path.join(pdir, 'assets.json'), 'utf8')) as string[])[0];
  fs.writeFileSync(path.join(pdir, 'result.json'), JSON.stringify({ concepts_explored: ['a', 'b', 'c', 'd', 'e', 'f'], proposals: (['A', 'B', 'C'] as const).map((x) => proposal(x, img)), warnings: [] }));
  await api('POST', `/api/jobs/${d.jobs[0].id}/import`);
  d = await waitJob(pub.id);
  const a = d.versions.find((v: any) => v.direction === 'A');
  const b = d.versions.find((v: any) => v.direction === 'B');
  // adjustments only on the chosen (current) proposal
  assert.equal((await api('POST', `/api/versions/${a.id}/locks`, { slide: 2, locked: true })).status, 409);
  await api('POST', `/api/versions/${a.id}/select`);

  // 1 · approve slide 2
  d = (await api('POST', `/api/versions/${a.id}/locks`, { slide: 2, locked: true })).json;
  assert.deepEqual(d.versions.find((v: any) => v.id === a.id).design.locked_slides, [2]);
  assert.equal(d.history[0].action, 'slide_approved');
  const designFile = JSON.parse(fs.readFileSync(path.join(DATA, 'media', `pub-${pub.id}`, `v${String(a.number).padStart(2, '0')}`, 'design.json'), 'utf8'));
  assert.deepEqual(designFile.locked_slides, [2], 'design.json on disk keeps the list');
  assert.equal((await api('POST', `/api/versions/${a.id}/design-edit`, { slide: 2, edits: [{ node: 'h', text: 'No' }] })).status, 400, 'an approved slide cannot be edited');

  // 2 · adjust the headline of slide 1 without AI: text, weight and size; only that slide is re-rendered
  assert.equal((await api('POST', `/api/versions/${a.id}/design-edit`, { slide: 1, edits: [{ node: 'h', weight: 'heavy' }] })).status, 400, 'invalid weight rejected');
  assert.equal((await api('POST', `/api/versions/${a.id}/design-edit`, { slide: 1, edits: [{ node: 'h', text: 'Portada ajustada', weight: 'semibold', size: 'm' }] })).status, 200);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].kind, 'design_edit');
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const e1 = d.versions[0];
  assert.equal(e1.parent_version_id, a.id);
  assert.equal(e1.origin, 'manual_edit');
  assert.equal(e1.provider, 'manual');
  assert.equal(d.publication.current_version_id, e1.id, 'the adjusted version becomes the current one');
  assert.deepEqual(e1.slides.map((s: any) => s.rendered), [true, false, false]);
  const h = e1.design.slides[0].nodes.find((n: any) => n.id === 'h');
  assert.equal(h.text, 'Portada ajustada');
  assert.deepEqual(JSON.parse(h.props), { size: 'm', tone: 'base', weight: 'semibold' });
  assert.deepEqual(e1.design.locked_slides, [2], 'approved slides carry over');

  // 3 · bring slide 3 of proposal B
  assert.equal((await api('POST', `/api/versions/${e1.id}/slides/3/replace`, { from_version_id: b.id, from_slide: 3 })).status, 200);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const e2 = d.versions[0];
  assert.deepEqual(e2.slides.map((s: any) => s.rendered), [false, false, true]);
  assert.deepEqual(e2.design.slides[2], b.design.slides[2]);
  assert.deepEqual(e2.design.slides[0], e1.design.slides[0]);
  assert.match(e2.notes, /traída de la v\d+ \(propuesta B\), diapositiva 3/);

  // 4 · comments per slide: an approved slide can't be commented; only the commented slides may change
  assert.equal((await api('POST', `/api/publications/${pub.id}/design-revisions`, { version_id: e2.id, instruction: '', slide_comments: [{ slide: 2, text: 'Cambia esto' }] })).status, 400);
  assert.equal((await api('POST', `/api/publications/${pub.id}/design-revisions`, { version_id: e2.id, instruction: '', slide_comments: [{ slide: 1, text: 'Titular más corto' }, { slide: 3, text: 'Menos texto' }] })).status, 200);
  d = await waitJob(pub.id);
  const rj = d.jobs[0];
  assert.equal(d.revisions[0].target, 'carousel');
  assert.match(d.revisions[0].instruction, /Por diapositiva:\n- Diapositiva 1: Titular más corto\n- Diapositiva 3: Menos texto/);
  const rdir = path.join(DATA, 'tasks', path.basename(rj.task_dir));
  const fixed = JSON.parse(fs.readFileSync(path.join(rdir, 'fixed-slides.json'), 'utf8'));
  assert.deepEqual(fixed.slides, [2], 'slide 2 (approved) is fixed; 1 and 3 have comments');
  assert.match(fs.readFileSync(path.join(rdir, 'brief.md'), 'utf8'), /No cambies las diapositivas 2/);
  assert.match(fs.readFileSync(path.join(rdir, 'TASK.md'), 'utf8'), /task:preview/);
  // a result that also touches the approved slide is blocked by task:check, and restored on import
  const changed = JSON.parse(JSON.stringify(e2.design));
  delete changed.locked_slides;
  changed.slides[0].nodes.find((n: any) => n.id === 'h').text = 'Portada corta';
  changed.slides[1].nodes.find((n: any) => n.id === 'h').text = 'Cambiada sin permiso';
  fs.writeFileSync(path.join(rdir, 'result.json'), JSON.stringify({ proposal: { ...changed, claims: [] }, summary: 'Titular más corto', changed_slides: [1, 2], warnings: [] }));
  const check = spawnSync(process.execPath, ['scripts/task-check.ts', path.basename(rdir)], { env: { ...process.env, REACH_DATA_DIR: DATA }, encoding: 'utf8' });
  assert.equal(check.status, 2);
  assert.match(check.stderr, /Diapositiva 2: no se puede cambiar/);
  await api('POST', `/api/jobs/${rj.id}/import`);
  d = await waitJob(pub.id);
  assert.equal(d.jobs[0].status, 'completed', d.jobs[0].error);
  const r = d.versions[0];
  assert.equal(r.design.slides[0].nodes.find((n: any) => n.id === 'h').text, 'Portada corta');
  assert.deepEqual(r.design.slides[1], e2.design.slides[1], 'the approved slide was restored');
  assert.deepEqual(r.slides.map((s: any) => s.rendered), [true, false, false]);
  assert.deepEqual(r.design.locked_slides, [2]);
  assert.ok(r.validation.claim_checks.notes.some((n: string) => /Diapositiva 2: está aprobada; se mantuvo sin cambios/.test(n)));

  // 5 · unlocking makes it editable again
  d = (await api('POST', `/api/versions/${r.id}/locks`, { slide: 2, locked: false })).json;
  assert.deepEqual(d.versions[0].design.locked_slides, []);
});
