// Generation job runner. Jobs are persisted in SQLite and executed one at a time in this process.
// Each job records the real stages it went through (no invented percentages). A failed job never touches
// existing versions: a new version is only inserted in the final "persist" stage.
import fs from 'node:fs';
import path from 'node:path';
import { renderCarousel, slideFile } from '../../studio/engine.js';
import { getProvider } from '../ai/provider.ts';
import { buildPrompt } from '../ai/prompts.ts';
import { readTaskResult, taskKind } from '../ai/claude-code.ts';
import { checkDesign, renderProposal } from '../design/render.ts';
import { gatherSources } from './sources.ts';
import { renderStories } from '../../studio/story.js';
import { secondaryColorFor } from '../../design-system/btl/catalog.mjs';
import { buildDesignValidation } from './validate.ts';
import { chooseDirections, findDirections } from '../design/directions.ts';
import { recentDesigns, repetitionWarnings } from '../design/memory.ts';
import type { DesignRevisionResultT, ProposalT, ProposalsResultT } from '../../shared/design.ts';
import { applyNodeEdits, claimSlide, type NodeEdit } from '../../shared/design-edit.ts';
import type { GenerationResultT } from '../../shared/schema.ts';
import { TASKS_DIR, versionDir, versionUrl } from '../paths.ts';
import { classicSlideTexts, designSlideTexts, missingApprovedTexts, narrative, type ApprovedCopy, type CopyResultT } from '../../shared/structure.ts';
import * as repo from '../repo.ts';
import { buildContext, loadAssets, loadBrand, loadBrief, loadProducts, loadReferences, type ProductContext } from './context.ts';
import { buildValidation, checkRenderable } from './validate.ts';
import { REVISION_TARGETS, type Job, type JobKind, type Publication, type Stage, type Version } from '../../shared/types.ts';
import type { CarouselContentT, ClaimT, RevisionResultT } from '../../shared/schema.ts';

const S = (key: string, label: string): Stage => ({ key, label, status: 'pending' });
const TAIL = () => [S('layouts', 'Seleccionar y comprobar layouts'), S('render', 'Renderizar diapositivas'), S('validate', 'Validar el resultado'), S('persist', 'Guardar archivos y metadatos')];
export const STAGES: Record<JobKind, () => Stage[]> = {
  generate: () => [
    S('brief', 'Cargar el brief'), S('brand', 'Identificar la marca'), S('guidelines', 'Recuperar el manual de marca'),
    S('sources', 'Fuentes oficiales (página de BTL y PDF)'), S('product', 'Información del producto'), S('docs', 'Documentación del producto'), S('assets', 'Imágenes y logos oficiales'),
    S('references', 'Referencias editoriales y creativas'), S('content', 'Construir el contenido del carrusel'), ...TAIL(),
  ],
  revise: () => [S('base', 'Cargar la versión actual'), S('context', 'Recuperar marca, producto y activos'), S('content', 'Interpretar la solicitud y revisar el contenido'), ...TAIL()],
  import: () => [S('content', 'Importar el resultado de Claude Code'), ...TAIL()],
  edit: () => [S('base', 'Cargar la versión actual'), S('diff', 'Detectar cambios'), ...TAIL()],
  propose: () => [
    S('brief', 'Cargar el brief'), S('brand', 'Identificar la marca'), S('guidelines', 'Recuperar el manual de marca'),
    S('sources', 'Fuentes oficiales (página de BTL y PDF)'), S('product', 'Información del producto'), S('assets', 'Imágenes oficiales'), S('feedback', 'Comentarios y referencias previas'),
    S('directions', 'Elegir tres direcciones de arte (las menos usadas)'), S('content', 'Componer tres propuestas (A · B · C)'), ...DESIGN_TAIL(),
  ],
  story: () => [S('story', 'Adaptar a historias (1080 × 1920, 9:16)'), S('persist', 'Guardar las historias')],
  copy: () => [
    S('brief', 'Cargar el brief y la estructura'), S('brand', 'Identificar la marca'), S('sources', 'Fuentes oficiales (página de BTL y PDF)'),
    S('product', 'Información del producto'), S('feedback', 'Textos ya propuestos y comentarios'), S('content', 'Escribir opciones de texto por diapositiva'),
    S('persist', 'Guardar las opciones'),
  ],
  design_revise: () => [S('base', 'Cargar la propuesta'), S('context', 'Recuperar marca, producto y activos'), S('content', 'Interpretar la solicitud y revisar la propuesta'), ...DESIGN_TAIL()],
  design_edit: () => [S('base', 'Cargar la propuesta'), S('apply', 'Aplicar el ajuste (sin IA)'), ...DESIGN_TAIL()],
};
function DESIGN_TAIL() {
  return [S('structure', 'Comprobar componentes, props e imágenes'), S('render', 'Renderizar con el sistema de diseño BTL'), S('validate', 'Validar y corregir (texto, solapes, contraste, logo)'), S('claims', 'Verificar afirmaciones y marca'), S('persist', 'Guardar archivos y metadatos')];
}

class StageTracker {
  private jobId: number;
  stages: Stage[];
  constructor(jobId: number, stages: Stage[]) {
    this.jobId = jobId;
    this.stages = stages;
  }
  private save() {
    repo.updateJob(this.jobId, { stages: this.stages });
  }
  // An import job only learns the kind of result when it reads it: design results use the design stages.
  replaceAfter(key: string, stages: Stage[]) {
    this.stages = [...this.stages.slice(0, this.stages.findIndex((x) => x.key === key) + 1), ...stages];
    this.save();
  }
  set(key: string, status: Stage['status'], detail?: string) {
    const s = this.stages.find((x) => x.key === key)!;
    s.status = status;
    if (detail !== undefined) s.detail = detail;
    this.save();
  }
  async step<T>(key: string, fn: () => T | Promise<T>, detail?: (r: T) => string): Promise<T> {
    this.set(key, 'running');
    try {
      const r = await fn();
      this.set(key, 'done', detail?.(r));
      return r;
    } catch (e) {
      this.set(key, 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    }
  }
}

export class MissingInfo extends Error {}

// ---------- queue ----------
let busy = false;
export function enqueue(pubId: number, kind: JobKind, input: object = {}, revisionId: number | null = null): Job {
  const job = repo.insertJob(pubId, kind, STAGES[kind](), input, getProvider().id, revisionId);
  setImmediate(drain);
  return job;
}
export async function drain() {
  if (busy) return;
  busy = true;
  try {
    for (let next = repo.pendingJobs()[0]; next; next = repo.pendingJobs()[0]) await execute(next);
  } finally {
    busy = false;
  }
}

async function execute(job: Job) {
  const t = new StageTracker(job.id, job.stages);
  const prev = repo.jobPrevStatus(job.id) ?? 'planned';
  repo.updateJob(job.id, { status: 'running', started: true });
  // Story renders run after approval and never touch the publication status.
  const quiet = job.kind === 'story';
  if (!quiet) repo.setStatus(job.publication_id, 'generating', `job_${job.kind}_started`, `Trabajo #${job.id}`);
  if (job.revision_id) repo.updateRevision(job.revision_id, 'in_progress');
  try {
    const input = repo.jobInput(job.id);
    const outcome = await RUNNERS[job.kind](job, t, input);
    repo.updateJob(job.id, { status: 'completed', outcome, finished: true, error: null });
    if (quiet) return;
    // Text options don't create a version: the publication goes back to the status it had.
    if (outcome === 'copy') repo.setStatus(job.publication_id, prev, 'copy_created', `Trabajo #${job.id}: opciones de texto`);
    if (outcome === 'task_package') {
      repo.setStatus(job.publication_id, prev, 'task_package_ready', `Trabajo #${job.id}: paso pendiente en Claude Code`);
      if (job.revision_id) repo.updateRevision(job.revision_id, 'awaiting_claude_code');
    }
  } catch (e) {
    const msg = (e as Error).message;
    console.error(`[job ${job.id}] ${job.kind} failed: ${msg}`);
    repo.updateJob(job.id, { status: 'failed', error: msg, finished: true });
    if (quiet) repo.addHistory(job.publication_id, null, 'story_failed', null, null, msg.split('\n')[0]);
    else repo.setStatus(job.publication_id, prev, `job_${job.kind}_failed`, msg.split('\n')[0]);
    if (job.revision_id) repo.updateRevision(job.revision_id, 'failed');
  }
}

// Official web page and PDF photos (sources.ts). Never blocks: problems are shown in the stage detail.
async function sourcesStep(t: StageTracker, pub: Publication) {
  await t.step('sources', () => gatherSources(pub, repo.getProducts(pub.product_ids)), (r) =>
    [r.notes.length ? `Añadido: ${r.notes.join(' · ')}` : 'Sin novedades', ...r.warnings].join(' · '));
}

type Runner = (job: Job, t: StageTracker, input: any) => Promise<'version' | 'copy' | 'task_package'>;

// ---------- runners ----------
const RUNNERS: Record<JobKind, Runner> = {
  async generate(job, t) {
    const pub = await t.step('brief', () => loadBrief(job.publication_id), (p) => `${p.topic} · ${p.date}`);
    const b = await t.step('brand', () => loadBrand(pub), (x) => `${x.brand.name} (firma: ${x.brand.signature})`);
    t.set('guidelines', 'done', `${b.guideline.summaryPath} (fuente: ${b.guideline.path})`);
    await sourcesStep(t, pub);
    const p = await t.step('product', () => loadProducts(pub), (x) => x.products.map((y) => `${y.product.name}${y.product.review_status === 'pending_review' ? ' (pendiente de revisión)' : ''}`).join(', ') || 'Sin producto asociado');
    await t.step('docs', () => p, (x) => x.products.map((y) => y.excerpt?.path ?? `${y.product.name}: sin extracto`).join(', ') || 'No aplica');
    const a = await t.step('assets', () => loadAssets(pub, p.products), (x) => `${x.assets.filter((y) => y.kind !== 'brand_logo').length} imagen(es) · ${x.documents.length} documento(s) adjunto(s)`);
    const blocking = [...p.blocking, ...a.blocking];
    if (blocking.length) {
      t.set('assets', 'failed', 'Falta información esencial');
      throw new MissingInfo(`Falta información para generar el contenido:\n${blocking.map((x) => `- ${x}`).join('\n')}`);
    }
    await t.step('references', () => loadReferences(pub), (r) => `${r.exemplar ? 'ejemplo aprobado' : 'sin ejemplo'} · ${r.recent.length} publicación(es) reciente(s)`);

    const ctx = buildContext(job.publication_id);
    const prompt = buildPrompt('generate', ctx);
    const approved = keepApproved(job, pub);
    const provider = getProvider();
    t.set('content', 'running', provider.label);
    const res = await provider.run({ kind: 'generate', jobId: job.id, prompt, context: ctx, approvedCopy: approved }).catch((e) => {
      t.set('content', 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    });
    if (res.type === 'task_package') {
      repo.updateJob(job.id, { task_dir: res.dir });
      t.set('content', 'waiting', `Paso manual: ejecutar ${res.dir}/TASK.md en Claude Code e importar el resultado`);
      return 'task_package';
    }
    const g = res.result as GenerationResultT;
    t.set('content', 'done', `${res.provider} · ${g.content.slides.length} diapositivas`);
    return produceVersion(job, t, {
      content: g.content, origin: 'generation', provider: res.provider, concept: g.concept,
      claims: g.claims, promptVersions: prompt.versions, warnings: [...ctx.missing.warnings, ...g.warnings, ...copyWarnings(approved, g.content.slides.map(classicSlideTexts))],
      products: ctx.products, base: null, notes: null,
    });
  },

  async revise(job, t, input: { base_version_id: number }) {
    const revision = repo.getRevision(job.revision_id!)!;
    const base = await t.step('base', () => repo.getVersion(input.base_version_id), (v) => `Versión ${v.number}`);
    const ctx = await t.step('context', () => buildContext(job.publication_id), (c) => `${c.brand.name} · ${c.assets.length} activo(s)`);
    const prompt = buildPrompt('revise', ctx, {
      current: base.content, target: REVISION_TARGETS[revision.target] ?? revision.target,
      slideNumber: revision.slide_number, instruction: revision.instruction,
    });
    const provider = getProvider();
    t.set('content', 'running', provider.label);
    const res = await provider.run({ kind: 'revise', jobId: job.id, prompt, context: ctx }).catch((e) => {
      t.set('content', 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    });
    if (res.type === 'task_package') {
      repo.updateJob(job.id, { task_dir: res.dir });
      t.set('content', 'waiting', `Paso manual: ejecutar ${res.dir}/TASK.md en Claude Code e importar el resultado`);
      return 'task_package';
    }
    const r = res.result as RevisionResultT;
    t.set('content', 'done', r.summary);
    return produceVersion(job, t, {
      content: r.content, origin: 'revision', provider: res.provider, concept: r.concept, claims: r.claims,
      promptVersions: prompt.versions, warnings: [...ctx.missing.warnings, ...r.warnings], products: ctx.products,
      base, notes: `Solicitud: "${revision.instruction}" — ${r.summary}`,
    });
  },

  async import(job, t, input: { source_job_id: number }) {
    const source = repo.getJob(input.source_job_id);
    const srcInput = repo.jobInput(source.id);
    const versionsFile = path.join(TASKS_DIR, path.basename(source.task_dir!), 'prompt-versions.json');
    const promptVersions = fs.existsSync(versionsFile) ? JSON.parse(fs.readFileSync(versionsFile, 'utf8')) : null;
    const tk = taskKind(source.task_dir!);
    if (tk === 'propose') {
      const r = await t.step('content', () => readTaskResult(source.task_dir!, 'propose'), (x) => `${source.task_dir}/result.json · ${x.proposals.length} propuestas`);
      t.replaceAfter('content', DESIGN_TAIL());
      return produceProposals(job, t, r, { provider: 'claude_code', promptVersions, setId: source.id, directions: srcInput.directions ?? null, approved: srcInput.approved_copy ?? null });
    }
    if (tk === 'copy') {
      const r = await t.step('content', () => readTaskResult(source.task_dir!, 'copy'), (x) => `${source.task_dir}/result.json · ${x.slides.reduce((n, s) => n + s.options.length, 0)} opciones`);
      t.replaceAfter('content', [S('persist', 'Guardar las opciones')]);
      return produceCopy(job, t, r, srcInput.slide ?? null, source.id);
    }
    if (tk === 'design_revise') {
      const r = await t.step('content', () => readTaskResult(source.task_dir!, 'design_revise'), (x) => x.summary);
      t.replaceAfter('content', DESIGN_TAIL());
      const revision = source.revision_id ? repo.getRevision(source.revision_id)! : null;
      return produceDesignRevision(job, t, r, { base: repo.getVersion(srcInput.base_version_id), slide: srcInput.slide_number ?? null, allowed: srcInput.slides_allowed ?? null, provider: 'claude_code', promptVersions, revisionId: source.revision_id, instruction: revision?.instruction ?? '' });
    }
    const kind = tk === 'revise' ? 'revise' : 'generate';
    const result = await t.step('content', () => readTaskResult(source.task_dir!, kind), (r) => `${source.task_dir}/result.json · ${r.content.slides.length} diapositivas`);
    const products = loadProducts(loadBrief(job.publication_id)).products;
    const base = kind === 'revise' ? repo.getVersion(srcInput.base_version_id) : null;
    const revision = source.revision_id ? repo.getRevision(source.revision_id) : null;
    const r = result as RevisionResultT;
    return produceVersion(job, t, {
      content: result.content, origin: kind === 'revise' ? 'revision' : 'generation', provider: 'claude_code',
      concept: result.concept, claims: result.claims, promptVersions, products, base,
      warnings: [...result.warnings, ...(kind === 'generate' ? copyWarnings(srcInput.approved_copy ?? null, result.content.slides.map(classicSlideTexts)) : [])],
      notes: revision ? `Solicitud: "${revision.instruction}"${r.summary ? ` — ${r.summary}` : ''}` : `Importado de ${source.task_dir}`,
      revisionId: source.revision_id,
    });
  },

  async edit(job, t, input: { base_version_id: number; content: CarouselContentT; note?: string }) {
    const base = await t.step('base', () => repo.getVersion(input.base_version_id), (v) => `Versión ${v.number}`);
    const changed = await t.step('diff', () => changedSlides(base.content, input.content), (c) =>
      c.length ? `Cambian: ${c.map((i) => `diapositiva ${i + 1}`).join(', ')}` : 'Solo cambia el caption'
    );
    if (!changed.length && base.caption === input.content.caption) throw new Error('No hay cambios respecto a la versión actual.');
    return produceVersion(job, t, {
      content: input.content, origin: 'manual_edit', provider: 'manual', concept: base.concept, claims: base.claims,
      promptVersions: null, warnings: [], products: loadProducts(loadBrief(job.publication_id)).products, base,
      notes: input.note || 'Edición directa de textos',
    });
  },

  // Story (9:16) versions of an approved version: same design, re-laid out on 1080×1920 (studio/story.js).
  async story(job, t, input: { version_id: number }) {
    const v = repo.getVersion(input.version_id);
    const dir = versionDir(v.publication_id, v.number);
    const out = path.join(dir, 'historias');
    if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
    const r = await t.step('story', () => renderStories({ html: path.join(dir, 'slides.html'), outDir: out }), (x) =>
      `${x.slides.length} historia(s) · ${x.problems.length ? `${x.problems.length} aviso(s)` : 'validación correcta'}`);
    await t.step('persist', () => {
      repo.setVersionStory(v.id, { slides: r.slides, problems: r.problems.map((p) => `Historia ${p.slide}: ${p.message}`), created_at: new Date().toISOString() });
      repo.addHistory(v.publication_id, v.id, 'stories_created', null, null, `${r.slides.length} historia(s) 1080 × 1920`);
    }, () => `${versionUrl(v.publication_id, v.number)}/historias/`);
    return 'version';
  },

  async propose(job, t) {
    const pub = await t.step('brief', () => loadBrief(job.publication_id), (p) => `${p.topic} · ${p.date}`);
    const b = await t.step('brand', () => loadBrand(pub), (x) => `${x.brand.name} (firma: ${x.brand.signature})`);
    t.set('guidelines', 'done', `${b.guideline.summaryPath} (fuente: ${b.guideline.path})`);
    await sourcesStep(t, pub);
    const p = await t.step('product', () => loadProducts(pub), (x) => x.products.map((y) => `${y.product.name}${y.product.review_status === 'pending_review' ? ' (pendiente de revisión)' : ''}`).join(', ') || 'Sin producto asociado');
    const a = await t.step('assets', () => loadAssets(pub, p.products), (x) => `${x.assets.filter((y) => y.kind !== 'brand_logo').length} imagen(es) · ${x.documents.length} documento(s)`);
    const blocking = [...p.blocking, ...a.blocking];
    if (blocking.length) {
      t.set('assets', 'failed', 'Falta información esencial');
      throw new MissingInfo(`Falta información para crear las propuestas:\n${blocking.map((x) => `- ${x}`).join('\n')}`);
    }
    await t.step('feedback', () => ({ revisions: repo.listRevisions(pub.id).length, refs: loadReferences(pub), past: recentDesigns(pub.brand_id).length }), (r) => `${r.revisions} comentario(s) previos · ${r.refs.recent.length} publicación(es) reciente(s) · ${r.past} diseño(s) anteriores`);
    // Three art directions from the bank, the least used by this brand (server/design/directions.ts). Kept in the
    // job input so a Claude Code import knows which direction each slot had.
    const input = repo.jobInput(job.id);
    const directions = await t.step('directions', () => (input.directions ? findDirections(input.directions) : chooseDirections(pub.brand_id)), (d) => d.map((x, i) => `${'ABC'[i]}: ${x.name}`).join(' · '));
    repo.updateJob(job.id, { input: { ...input, directions: directions.map((d) => d.id) } });
    const ctx = buildContext(job.publication_id);
    const prompt = buildPrompt('propose', ctx, undefined, directions);
    const approved = keepApproved(job, pub);
    const provider = getProvider();
    t.set('content', 'running', provider.label);
    const res = await provider.run({ kind: 'propose', jobId: job.id, prompt, context: ctx, allowedImages: allowedImages(ctx.assets), approvedCopy: approved }).catch((e) => {
      t.set('content', 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    });
    if (res.type === 'task_package') {
      repo.updateJob(job.id, { task_dir: res.dir });
      t.set('content', 'waiting', `Paso manual: ejecutar ${res.dir}/TASK.md en Claude Code e importar el resultado`);
      return 'task_package';
    }
    const r = res.result as ProposalsResultT;
    t.set('content', 'done', `${res.provider} · ${r.concepts_explored?.length ?? 0} conceptos explorados · ${r.proposals.length} propuestas`);
    return produceProposals(job, t, r, { provider: res.provider, promptVersions: prompt.versions, setId: job.id, directions: directions.map((d) => d.id), approved });
  },

  // Step 1 "Mensaje": text options per slide (all slides, or more options for one slide with Jaime's comment).
  async copy(job, t, input: { slide?: number | null; instruction?: string }) {
    const pub = await t.step('brief', () => loadBrief(job.publication_id), (p) => `${p.topic} · ${narrative(p).map((r) => r.label).join(' · ')}`);
    await t.step('brand', () => loadBrand(pub), (x) => x.brand.name);
    await sourcesStep(t, pub);
    const p = await t.step('product', () => loadProducts(pub), (x) => x.products.map((y) => y.product.name).join(', ') || 'Sin producto asociado');
    if (p.blocking.length) {
      t.set('product', 'failed', 'Falta información esencial');
      throw new MissingInfo(`Falta información para proponer los textos:\n${p.blocking.map((x) => `- ${x}`).join('\n')}`);
    }
    await t.step('feedback', () => repo.listCopyOptions(pub.id).length, (n) => `${n} opción(es) ya propuestas${input.instruction ? ` · comentario: "${input.instruction}"` : ''}`);
    const ctx = buildContext(job.publication_id);
    const prompt = buildPrompt('copy', ctx, undefined, [], { slide: input.slide ?? null, instruction: input.instruction ?? '' });
    const provider = getProvider();
    t.set('content', 'running', provider.label);
    const res = await provider.run({ kind: 'copy', jobId: job.id, prompt, context: ctx }).catch((e) => {
      t.set('content', 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    });
    if (res.type === 'task_package') {
      repo.updateJob(job.id, { task_dir: res.dir });
      t.set('content', 'waiting', `Paso manual: ejecutar ${res.dir}/TASK.md en Claude Code e importar el resultado`);
      return 'task_package';
    }
    const r = res.result as CopyResultT;
    t.set('content', 'done', `${res.provider} · ${r.angle}`);
    return produceCopy(job, t, r, input.slide ?? null, job.id);
  },

  async design_revise(job, t, input: { base_version_id: number; slide_number: number | null; slides_allowed?: number[] | null }) {
    const revision = repo.getRevision(job.revision_id!)!;
    const base = await t.step('base', () => repo.getVersion(input.base_version_id), (v) => `Versión ${v.number} · propuesta ${v.direction}${v.design?.locked_slides?.length ? ` · aprobadas: ${v.design.locked_slides.join(', ')}` : ''}`);
    if (base.kind !== 'design' || !base.design) throw new Error('La versión base no es una propuesta del sistema de diseño.');
    const ctx = await t.step('context', () => buildContext(job.publication_id), (c) => `${c.brand.name} · ${c.assets.length} activo(s)`);
    const current = { ...base.design, claims: base.claims } as ProposalT;
    const fixed = fixedSlides(base, input.slide_number, input.slides_allowed ?? null);
    const prompt = buildPrompt('design_revise', ctx, {
      current, target: input.slide_number ? 'Una diapositiva' : input.slides_allowed ? 'Algunas diapositivas' : 'Toda la propuesta',
      slideNumber: input.slide_number, instruction: revision.instruction, fixedSlides: fixed,
    }, base.design.direction_id ? findDirections([base.design.direction_id]) : []);
    const provider = getProvider();
    t.set('content', 'running', provider.label);
    const res = await provider.run({ kind: 'design_revise', jobId: job.id, prompt, context: ctx, allowedImages: allowedImages(ctx.assets), fixedSlides: fixed.length ? { slides: fixed, base: current } : null }).catch((e) => {
      t.set('content', 'failed', (e as Error).message.split('\n')[0]);
      throw e;
    });
    if (res.type === 'task_package') {
      repo.updateJob(job.id, { task_dir: res.dir });
      t.set('content', 'waiting', `Paso manual: ejecutar ${res.dir}/TASK.md en Claude Code e importar el resultado`);
      return 'task_package';
    }
    const r = res.result as DesignRevisionResultT;
    t.set('content', 'done', r.summary);
    return produceDesignRevision(job, t, r, { base, slide: input.slide_number, allowed: input.slides_allowed ?? null, provider: res.provider, promptVersions: prompt.versions, revisionId: job.revision_id, instruction: revision.instruction });
  },

  // Direct adjustment of a design version, without AI: edit texts and their style on one slide, or bring a slide
  // from another version of the publication. Only that slide is re-rendered; approved slides can't be touched.
  async design_edit(job, t, input: { base_version_id: number; op: 'text' | 'swap'; slide: number; edits?: NodeEdit[]; from_version_id?: number; from_slide?: number }) {
    const base = await t.step('base', () => repo.getVersion(input.base_version_id), (v) => `Versión ${v.number} · propuesta ${v.direction}`);
    if (base.kind !== 'design' || !base.design) throw new Error('La versión base no es una propuesta del sistema de diseño.');
    const i = input.slide - 1;
    if (i < 0 || i >= base.design.slides.length) throw new Error('Número de diapositiva fuera de rango.');
    if (base.design.locked_slides?.includes(input.slide)) throw new Error(`La diapositiva ${input.slide} está aprobada. Quita la aprobación para cambiarla.`);
    const slides = [...base.design.slides];
    let claims = base.claims;
    let note = '';
    await t.step('apply', () => {
      if (input.op === 'text') {
        if (!input.edits?.length) throw new Error('No hay cambios que aplicar.');
        slides[i] = applyNodeEdits(slides[i], input.edits);
        if (JSON.stringify(slides[i]) === JSON.stringify(base.design!.slides[i])) throw new Error('No hay cambios respecto a la diapositiva actual.');
        note = `Diapositiva ${input.slide} · ajuste directo de ${input.edits.length} texto(s)`;
      } else {
        const src = repo.getVersion(Number(input.from_version_id));
        const k = Number(input.from_slide) - 1;
        if (src.publication_id !== base.publication_id || src.kind !== 'design' || !src.design?.slides[k]) throw new Error('La diapositiva de origen no existe en esta publicación.');
        slides[i] = JSON.parse(JSON.stringify(src.design.slides[k]));
        // The claims of that slide travel with it.
        claims = [
          ...base.claims.filter((c) => claimSlide(c.location) !== input.slide),
          ...src.claims.filter((c) => claimSlide(c.location) === k + 1).map((c) => ({ ...c, location: `diapositiva ${input.slide}` })),
        ];
        note = `Diapositiva ${input.slide} traída de la v${src.number}${src.direction ? ` (propuesta ${src.direction})` : ''}, diapositiva ${k + 1}`;
      }
      return note;
    }, (x) => x);
    const proposal = { ...base.design, slides, claims } as ProposalT;
    await structure(t, [proposal], job.publication_id);
    t.set('render', 'running');
    const chosen = repo.getPublication(job.publication_id).current_version_id === base.id;
    const m = await renderDesignVersion(job, t, { proposal, parent: base, only: [i], origin: 'manual_edit', notes: note }, {
      provider: 'manual', promptVersions: base.prompt_versions, setId: base.proposal_set, status: chosen ? 'selected' : 'proposed', warnings: [],
    }, chosen);
    if (chosen) repo.selectVersion(m.version.id);
    t.set('render', 'done', `1 diapositiva renderizada, ${slides.length - 1} copiadas`);
    t.set('validate', 'done', m.validation.design?.status === 'needs_review' ? 'Requiere revisión manual' : `Pasa${m.validation.design?.autofixes.length ? ` · ${m.validation.design.autofixes.length} corrección(es) automática(s)` : ''}`);
    t.set('claims', 'done', m.validation.claim_checks?.problems.length ? `${m.validation.claim_checks.problems.length} problema(s)` : 'Sin problemas');
    t.set('persist', 'done', `Versión ${m.version.number}`);
    repo.setStatus(job.publication_id, 'ready_for_review', 'version_created', `Versión ${m.version.number} · ${note}`, m.version.id);
    return 'version';
  },
};

// Slides a design revision may not change: the ones Jaime approved, plus — when the request only comments on
// some slides — every other slide. 1-based.
export function fixedSlides(base: Version, slide: number | null, allowed: number[] | null): number[] {
  const n = base.design!.slides.length;
  const ok = slide ? [slide] : allowed;
  const out = new Set(base.design!.locked_slides ?? []);
  if (ok) for (let k = 1; k <= n; k++) if (!ok.includes(k)) out.add(k);
  return [...out].sort((a, b) => a - b);
}

// Texts approved in step 1, frozen in the job input when the job starts (an import checks against the same texts).
function keepApproved(job: Job, pub: Publication): ApprovedCopy | null {
  const input = repo.jobInput(job.id);
  if (!input.approved_copy && pub.approved_copy) repo.updateJob(job.id, { input: { ...input, approved_copy: pub.approved_copy } });
  return input.approved_copy ?? pub.approved_copy ?? null;
}
const copyWarnings = (copy: ApprovedCopy | null, slideTexts: string[]) =>
  copy ? missingApprovedTexts(copy, slideTexts).map((m) => `Texto aprobado modificado · ${m}`) : [];

async function produceCopy(job: Job, t: StageTracker, r: CopyResultT, slide: number | null, sourceJob: number): Promise<'copy'> {
  const pub = repo.getPublication(job.publication_id);
  const n = narrative(pub).length;
  const rows = r.slides
    .filter((s) => s.slide >= 1 && s.slide <= n && (!slide || s.slide === slide))
    .flatMap((s) => s.options.filter((o) => o.headline.trim()).map((option) => ({ slide: s.slide, option })));
  if (!rows.length) throw new Error(slide ? `El resultado no trae opciones para la diapositiva ${slide}.` : 'El resultado no trae opciones de texto.');
  await t.step('persist', () => repo.insertCopyOptions(pub.id, sourceJob, rows), () => `${rows.length} opción(es)${r.warnings.length ? ` · ${r.warnings.join(' · ')}` : ''}`);
  return 'copy';
}

// The product's secondary color (BTL Social Media Guideline), or null when none is assigned.
export const secondaryColor = (products: { product: { name: string } }[]): string | null => secondaryColorFor(products.map((x) => x.product.name));

export const allowedImages = (assets: { path: string; kind: string }[]) => assets.filter((a) => a.kind !== 'brand_logo').map((a) => a.path);

// ---------- design-system proposals ----------
type DesignOut = { proposal: ProposalT; notes: string | null; parent: Version | null; only: number[] | null; origin: Version['origin'] };

async function renderDesignVersion(job: Job, t: StageTracker, d: DesignOut, meta: { provider: string; promptVersions: Record<string, string> | null; setId: number | null; status: Version['proposal_status']; warnings: string[] }, current: boolean) {
  // renderProposal deep-copies the proposal, so extra fields (direction_id) reach the stored design.
  const pub = repo.getPublication(job.publication_id);
  const number = repo.nextVersionNumber(pub.id);
  const outDir = versionDir(pub.id, number);
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  let persisted = false;
  try {
    const reuseFrom = d.parent ? versionDir(pub.id, d.parent.number) : null;
    const products = loadProducts(loadBrief(pub.id)).products;
    const r = await renderProposal(d.proposal, outDir, { only: d.only, reuseFrom, secondary: secondaryColor(products) });
    const { claims, ...design } = r.proposal;
    fs.writeFileSync(path.join(outDir, 'design.json'), JSON.stringify(r.proposal, null, 2));
    fs.writeFileSync(path.join(outDir, 'caption.txt'), design.caption + '\n');
    const validation = buildDesignValidation(r.proposal, r, { products, expectedSlides: pub.format === 'single_image' ? 1 : pub.slide_count, warnings: meta.warnings });
    const version = repo.insertVersion({
      publication_id: pub.id, number, origin: d.origin, provider: meta.provider, kind: 'design', design, direction: d.proposal.direction,
      proposal_set: meta.setId, proposal_status: meta.status,
      content: null as never, caption: design.caption, slides: r.slides, validation, sources: design.sources, claims,
      concept: `${design.direction_name}: ${design.concept}`, prompt_versions: meta.promptVersions, parent_version_id: d.parent?.id ?? null,
      job_id: job.id, notes: d.notes, dir: versionUrl(pub.id, number),
    }, current);
    persisted = true;
    return { version, validation, rendered: r };
  } finally {
    if (!persisted && fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  }
}

function structure(t: StageTracker, proposals: ProposalT[], pubId: number) {
  const pub = repo.getPublication(pubId);
  const ctx = buildContext(pubId);
  const allowed = new Set(allowedImages(ctx.assets));
  const expected = pub.format === 'single_image' ? 1 : pub.slide_count;
  const secondary = secondaryColor(ctx.products);
  return t.step('structure', () => {
    const errors = proposals.flatMap((p) => checkDesign(p, allowed, expected, secondary).map((e) => `Propuesta ${p.direction}: ${e}`));
    if (errors.length) throw new Error(`La propuesta no se puede renderizar:\n${errors.slice(0, 12).join('\n')}`);
    return proposals.length;
  }, (n) => `${n} propuesta(s) correctas`);
}

async function produceProposals(job: Job, t: StageTracker, r: ProposalsResultT, o: { provider: string; promptVersions: Record<string, string> | null; setId: number; directions: string[] | null; approved: ApprovedCopy | null }): Promise<'version'> {
  const dirs = new Set(r.proposals.map((p) => p.direction));
  if (r.proposals.length !== 3 || dirs.size !== 3) throw new Error('Se esperaban exactamente tres propuestas con direcciones A, B y C.');
  // Each slot keeps the bank direction the app assigned (older task packages have none).
  const assigned = o.directions ? findDirections(o.directions) : [];
  const proposals = [...r.proposals]
    .sort((a, b) => a.direction.localeCompare(b.direction))
    .map((p, i) => (assigned[i] ? { ...p, direction_id: assigned[i].id, direction_name: assigned[i].name } : p));
  await structure(t, proposals, job.publication_id);
  // Compared with the brand's previous proposals before these are stored.
  const repeated = repetitionWarnings(proposals, recentDesigns(repo.getPublication(job.publication_id).brand_id));
  const made: { version: Version; validation: import('../../shared/types.ts').Validation; rendered: Awaited<ReturnType<typeof renderProposal>> }[] = [];
  t.set('render', 'running');
  for (const p of proposals) made.push(await renderDesignVersion(job, t, { proposal: p, notes: `Propuesta ${p.direction} · ${p.direction_name}`, parent: null, only: null, origin: 'proposal' }, { ...o, status: 'proposed', warnings: [...(repeated.get(p.direction) ?? []), ...copyWarnings(o.approved, p.slides.map(designSlideTexts)), ...r.warnings] }, false));
  t.set('render', 'done', made.map((m) => `${m.version.direction}: v${m.version.number}`).join(' · '));
  const review = made.filter((m) => m.validation.design?.status === 'needs_review');
  const fixes = made.reduce((n, m) => n + (m.validation.design?.autofixes.length ?? 0), 0);
  t.set('validate', 'done', `${review.length ? `${review.map((m) => m.version.direction).join(', ')}: revisión manual` : 'Todas pasan'}${fixes ? ` · ${fixes} corrección(es) automática(s)` : ''}`);
  const claimIssues = made.reduce((n, m) => n + (m.validation.claim_checks?.problems.length ?? 0), 0);
  t.set('claims', 'done', claimIssues ? `${claimIssues} problema(s) de afirmaciones o marca` : 'Sin problemas de afirmaciones ni de marca');
  t.set('persist', 'done', `Propuestas ${made.map((m) => `v${m.version.number}`).join(', ')}`);
  repo.setStatus(job.publication_id, 'ready_for_review', 'proposals_created', `Tres propuestas: ${made.map((m) => `${m.version.direction} (v${m.version.number})`).join(', ')}`);
  return 'version';
}

async function produceDesignRevision(job: Job, t: StageTracker, r: DesignRevisionResultT, o: { base: Version; slide: number | null; allowed?: number[] | null; provider: string; promptVersions: Record<string, string> | null; revisionId: number | null; instruction: string }): Promise<'version'> {
  const base = o.base;
  const locked = base.design!.locked_slides ?? [];
  const proposal: ProposalT = {
    ...r.proposal, direction: base.direction ?? r.proposal.direction, direction_name: base.design!.direction_name,
    ...(base.design!.direction_id ? { direction_id: base.design!.direction_id } : {}),
    ...(locked.length ? { locked_slides: locked } : {}),
  };
  // Approved slides, and slides outside the request (one slide, or only the commented ones), are restored from
  // the base proposal whatever the result says.
  const fixed = fixedSlides(base, o.slide, o.allowed ?? null);
  const restored = fixed.filter((n) => r.proposal.slides[n - 1] && JSON.stringify(r.proposal.slides[n - 1]) !== JSON.stringify(base.design!.slides[n - 1]));
  if (fixed.length) proposal.slides = base.design!.slides.map((s, i) => (fixed.includes(i + 1) ? s : r.proposal.slides[i] ?? s));
  const warnings = [...r.warnings, ...restored.map((n) => `Diapositiva ${n}: ${locked.includes(n) ? 'está aprobada' : 'no estaba incluida en la solicitud'}; se mantuvo sin cambios.`)];
  const changed = proposal.slides.map((s, i) => (JSON.stringify(s) === JSON.stringify(base.design!.slides[i]) ? -1 : i)).filter((i) => i >= 0);
  if (!changed.length && proposal.caption === base.caption) throw new Error('La revisión no cambió nada respecto a la propuesta actual.');
  await structure(t, [proposal], job.publication_id);
  t.set('render', 'running');
  // Revising the chosen proposal keeps it chosen; revising one that wasn't chosen leaves the choice to Jaime.
  const chosen = repo.getPublication(job.publication_id).current_version_id === base.id;
  const m = await renderDesignVersion(job, t, {
    proposal, parent: base, only: changed, origin: 'revision',
    notes: `${o.slide ? `Diapositiva ${o.slide} · ` : ''}Solicitud: "${o.instruction}" — ${r.summary}`,
  }, { provider: o.provider, promptVersions: o.promptVersions, setId: base.proposal_set, status: chosen ? 'selected' : 'proposed', warnings }, chosen);
  if (chosen) repo.selectVersion(m.version.id);
  t.set('render', 'done', `${changed.length} diapositiva(s) renderizada(s), ${proposal.slides.length - changed.length} copiadas`);
  t.set('validate', 'done', m.validation.design?.status === 'needs_review' ? 'Requiere revisión manual' : `Pasa${m.validation.design?.autofixes.length ? ` · ${m.validation.design.autofixes.length} corrección(es) automática(s)` : ''}`);
  t.set('claims', 'done', m.validation.claim_checks?.problems.length ? `${m.validation.claim_checks.problems.length} problema(s)` : 'Sin problemas');
  t.set('persist', 'done', `Versión ${m.version.number}`);
  repo.setStatus(job.publication_id, 'ready_for_review', 'version_created', `Versión ${m.version.number} (revisión de la propuesta ${base.direction})`, m.version.id);
  if (o.revisionId) repo.updateRevision(o.revisionId, 'applied', m.version.id);
  return 'version';
}

export function changedSlides(a: CarouselContentT, b: CarouselContentT): number[] {
  if (a.slides.length !== b.slides.length) return b.slides.map((_, i) => i);
  return b.slides.map((s, i) => (JSON.stringify(s) === JSON.stringify(a.slides[i]) ? -1 : i)).filter((i) => i >= 0);
}

async function produceVersion(
  job: Job,
  t: StageTracker,
  o: {
    content: unknown; origin: Version['origin']; provider: string; concept: string | null; claims: ClaimT[];
    promptVersions: Record<string, string> | null; warnings: string[]; products: ProductContext[];
    base: Version | null; notes: string | null; revisionId?: number | null;
  }
): Promise<'version'> {
  const pub = repo.getPublication(job.publication_id);
  const content = await t.step('layouts', () => checkRenderable(o.content), (c) => c.slides.map((s) => s.layout).join(' · '));
  const number = repo.nextVersionNumber(pub.id);
  const outDir = versionDir(pub.id, number);
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true }); // leftovers of an earlier failed attempt
  let persisted = false;
  try {
    // Only changed slides are re-rendered; the rest are copied from the previous version's PNGs.
    const only = o.base ? changedSlides(o.base.content, content) : null;
    const reuseFrom = o.base ? versionDir(pub.id, o.base.number) : null;
    const rendered = await t.step(
      'render',
      () => renderCarousel({ content, outDir, only, reuseFrom, extras: true }),
      (r) => {
        const n = r.slides.filter((s) => s.rendered).length;
        return `${n} renderizada(s)${r.slides.length - n ? `, ${r.slides.length - n} sin cambios (copiadas)` : ''} · ${r.slides[0]?.width}×${r.slides[0]?.height}`;
      }
    );
    fs.writeFileSync(path.join(outDir, 'content.json'), JSON.stringify(content, null, 2));
    fs.writeFileSync(path.join(outDir, 'caption.txt'), content.caption + '\n');
    const expected = pub.format === 'single_image' ? 1 : pub.slide_count;
    const validation = await t.step(
      'validate',
      () => buildValidation(content, rendered.problems, { claims: o.claims, products: o.products, expectedSlides: o.base ? content.slides.length : expected, warnings: o.warnings }),
      (v) => (v.problems.length ? `${v.problems.length} problema(s) detectado(s)` : 'Sin problemas de layout ni de marca')
    );
    const version = await t.step('persist', () => repo.insertVersion({
      publication_id: pub.id, number, origin: o.origin, provider: o.provider, content, caption: content.caption,
      slides: rendered.slides.map((s) => ({ ...s, file: slideFile(s.index) })), validation,
      sources: content.sources, claims: o.claims, concept: o.concept, prompt_versions: o.promptVersions,
      parent_version_id: o.base?.id ?? null, job_id: job.id, notes: o.notes, dir: versionUrl(pub.id, number),
    }), (v) => `Versión ${v.number}`);
    persisted = true;
    repo.setStatus(pub.id, 'ready_for_review', 'version_created', `Versión ${version.number} (${o.origin})`, version.id);
    const revisionId = o.revisionId ?? job.revision_id;
    if (revisionId) repo.updateRevision(revisionId, 'applied', version.id);
    return 'version';
  } finally {
    if (!persisted && fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  }
}
