// Data access: maps SQLite rows to the shared types. All writes that touch several tables use tx().
import fs from 'node:fs';
import { db, tx } from './db.ts';
import { TASKS_DIR, versionDir } from './paths.ts';
import path from 'node:path';
import type {
  Attachment, Brand, EditorialPreference, HistoryEvent, Job, JobKind, Product, Publication,
  PublicationDetail, RevisionRequest, Stage, Status, StoryRender, Version,
} from '../shared/types.ts';
import { narrative, type ApprovedCopy, type ApprovedSlide, type CopyOptionT, type QuickBrief, type StoredCopyOption } from '../shared/structure.ts';

type Row = Record<string, any>;
const all = (sql: string, ...p: any[]) => db.prepare(sql).all(...p) as Row[];
const one = (sql: string, ...p: any[]) => db.prepare(sql).get(...p) as Row | undefined;
const run = (sql: string, ...p: any[]) => db.prepare(sql).run(...p);
const json = (s: string | null) => (s ? JSON.parse(s) : null);

export class NotFound extends Error {}
export class Conflict extends Error {}
export class BadRequest extends Error {}

// ---------- brands & products ----------
export interface BrandRow extends Brand {
  tokens: string;
  guideline_path: string;
  guideline_summary: string;
  editorial_prompt: string;
}
export const listBrands = (): Brand[] => all('SELECT id, name, signature, color FROM brands ORDER BY name') as Brand[];
export const getBrand = (id: string): BrandRow => {
  const b = one('SELECT * FROM brands WHERE id = ?', id);
  if (!b) throw new NotFound(`Marca no encontrada: ${id}`);
  return b as BrandRow;
};

const toProduct = ({ data_json, ...r }: Row): Product => ({ ...r, data: JSON.parse(data_json) } as Product);
export const listProducts = (): Product[] =>
  all('SELECT id, name, category, data_json, source, review_status, created_at FROM products ORDER BY name').map(toProduct);
export const getProducts = (ids: string[]): Product[] =>
  ids.map((id) => one('SELECT * FROM products WHERE id = ?', id)).filter(Boolean).map((r) => toProduct(r!));

export function createProduct(input: { name: string; category?: string; description?: string; url?: string; features?: string[] }): Product {
  const name = input.name?.trim();
  if (!name) throw new BadRequest('El producto necesita un nombre.');
  let id = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^btl\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (one('SELECT 1 FROM products WHERE id = ?', id)) id = `${id}-${Date.now().toString(36)}`;
  const data = {
    id, name, category: input.category || null, url: input.url || null,
    description: input.description || '', key_features: input.features || [], approved_claims: [],
    assets_path: null, documentation: null,
  };
  run(
    "INSERT INTO products (id, name, category, data_json, source, review_status) VALUES (?, ?, ?, ?, 'user', 'pending_review')",
    id, name, input.category || null, JSON.stringify(data)
  );
  return getProducts([id])[0];
}

// Completes or corrects a product registered by the user (catalog products are read-only).
export function updateProduct(id: string, input: { category?: string; description?: string; url?: string; features?: string[] }): Product {
  const row = one('SELECT * FROM products WHERE id = ?', id);
  if (!row) throw new BadRequest('El producto no existe.');
  if (row.source !== 'user') throw new BadRequest('Los productos del catálogo no se editan desde aquí.');
  const data = { ...JSON.parse(String(row.data_json)) };
  if (input.category !== undefined) data.category = input.category || null;
  if (input.url !== undefined) data.url = input.url || null;
  if (input.description !== undefined) data.description = input.description;
  if (input.features !== undefined) data.key_features = input.features;
  run('UPDATE products SET category = ?, data_json = ? WHERE id = ?', data.category, JSON.stringify(data), id);
  return getProducts([id])[0];
}

// ---------- publications ----------
const toPublication = ({ brief_json, approved_copy_json, ...r }: Row): Publication => ({
  ...(r as Publication),
  brief: json(brief_json),
  approved_copy: json(approved_copy_json),
  product_ids: all('SELECT product_id FROM publication_products WHERE publication_id = ?', r.id).map((x) => x.product_id),
});

export function listPublications(filter: { from?: string; to?: string; brand?: string; status?: string }): Publication[] {
  const where: string[] = [];
  const p: any[] = [];
  if (filter.from) (where.push('date >= ?'), p.push(filter.from));
  if (filter.to) (where.push('date <= ?'), p.push(filter.to));
  if (filter.brand) (where.push('brand_id = ?'), p.push(filter.brand));
  if (filter.status) (where.push('status = ?'), p.push(filter.status));
  return all(`SELECT * FROM publications ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY date, id`, ...p).map(toPublication);
}

export function getPublication(id: number): Publication {
  const r = one('SELECT * FROM publications WHERE id = ?', id);
  if (!r) throw new NotFound(`Publicación ${id} no encontrada`);
  return toPublication(r);
}

export interface PublicationInput {
  brand_id: string;
  date: string;
  topic: string;
  format: string;
  objective: string;
  slide_count?: number;
  creative_instructions?: string;
  deadline?: string | null;
  product_ids?: string[];
  brief?: Partial<QuickBrief> | null;
}

const cleanBrief = (b: Partial<QuickBrief> | null | undefined): string | null => {
  if (!b) return null;
  const o = { audience: String(b.audience ?? '').trim(), angle: String(b.angle ?? '').trim(), tone: String(b.tone ?? '').trim(), avoid: String(b.avoid ?? '').trim() };
  return Object.values(o).some(Boolean) ? JSON.stringify(o) : null;
};

function checkInput(i: Partial<PublicationInput>, partial: boolean) {
  const missing = (['brand_id', 'date', 'topic', 'format', 'objective'] as const).filter((k) => !partial && !String(i[k] ?? '').trim());
  if (missing.length) throw new BadRequest(`Faltan campos obligatorios: ${missing.join(', ')}`);
  if (i.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(i.date)) throw new BadRequest('Fecha inválida (AAAA-MM-DD).');
  if (i.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(i.deadline)) throw new BadRequest('Fecha de producción inválida.');
  if (i.slide_count !== undefined && !(Number.isInteger(i.slide_count) && i.slide_count >= 1 && i.slide_count <= 10))
    throw new BadRequest('El número de diapositivas debe estar entre 1 y 10.');
  if (i.brand_id !== undefined) getBrand(i.brand_id);
  if (i.product_ids) for (const pid of i.product_ids) if (!one('SELECT 1 FROM products WHERE id = ?', pid)) throw new BadRequest(`Producto desconocido: ${pid}`);
}

export function createPublication(i: PublicationInput): Publication {
  checkInput(i, false);
  return tx(() => {
    const r = run(
      `INSERT INTO publications (brand_id, date, topic, format, objective, slide_count, creative_instructions, deadline, brief_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      i.brand_id, i.date, i.topic.trim(), i.format, i.objective.trim(), i.slide_count ?? 3, i.creative_instructions ?? '', i.deadline || null, cleanBrief(i.brief)
    );
    const id = Number(r.lastInsertRowid);
    for (const pid of i.product_ids ?? []) run('INSERT INTO publication_products VALUES (?, ?)', id, pid);
    addHistory(id, null, 'created', null, 'planned', 'Guardada en el calendario');
    return getPublication(id);
  });
}

export function updatePublication(id: number, i: Partial<PublicationInput>): Publication {
  const before = getPublication(id);
  checkInput(i, true);
  const cols = ['brand_id', 'date', 'topic', 'format', 'objective', 'slide_count', 'creative_instructions', 'deadline'] as const;
  return tx(() => {
    for (const c of cols) if (i[c] !== undefined) run(`UPDATE publications SET ${c} = ?, updated_at = datetime('now') WHERE id = ?`, (i[c] as any) ?? null, id);
    if (i.brief !== undefined) run("UPDATE publications SET brief_json = ?, updated_at = datetime('now') WHERE id = ?", cleanBrief(i.brief), id);
    // Approved texts belong to a structure: changing the format or the slide count invalidates them.
    if ((i.format !== undefined && i.format !== before.format) || (i.slide_count !== undefined && i.slide_count !== before.slide_count))
      run('UPDATE publications SET approved_copy_json = NULL WHERE id = ?', id);
    if (i.product_ids) {
      run('DELETE FROM publication_products WHERE publication_id = ?', id);
      for (const pid of i.product_ids) run('INSERT INTO publication_products VALUES (?, ?)', id, pid);
    }
    if (i.date && i.date !== before.date) addHistory(id, null, 'rescheduled', null, null, `${before.date} → ${i.date}`);
    else addHistory(id, null, 'brief_updated', null, null, null);
    return getPublication(id);
  });
}

export function deletePublication(id: number) {
  getPublication(id);
  if (activeJob(id)) throw new Conflict('Hay un trabajo en curso para esta publicación.');
  run('DELETE FROM publications WHERE id = ?', id);
}

export function setStatus(id: number, to: Status, action: string, note: string | null = null, versionId: number | null = null) {
  const from = getPublication(id).status;
  run("UPDATE publications SET status = ?, updated_at = datetime('now') WHERE id = ?", to, id);
  addHistory(id, versionId, action, from, to, note);
}

export const addHistory = (pubId: number, versionId: number | null, action: string, from: Status | null, to: Status | null, note: string | null) =>
  run('INSERT INTO history (publication_id, version_id, action, from_status, to_status, note) VALUES (?, ?, ?, ?, ?, ?)', pubId, versionId, action, from, to, note);

// ---------- attachments ----------
export const listAttachments = (pubId: number): Attachment[] =>
  all('SELECT id, publication_id, kind, filename, path, size, created_at FROM attachments WHERE publication_id = ? ORDER BY id', pubId) as Attachment[];
export function addAttachment(pubId: number, a: { kind: 'document' | 'image'; filename: string; path: string; mime: string; size: number }): Attachment {
  const r = run('INSERT INTO attachments (publication_id, kind, filename, path, mime, size) VALUES (?, ?, ?, ?, ?, ?)', pubId, a.kind, a.filename, a.path, a.mime, a.size);
  return one('SELECT id, publication_id, kind, filename, path, size, created_at FROM attachments WHERE id = ?', r.lastInsertRowid) as Attachment;
}
export function getAttachment(id: number): Attachment & { mime: string } {
  const a = one('SELECT * FROM attachments WHERE id = ?', id);
  if (!a) throw new NotFound('Archivo no encontrado');
  return a as Attachment & { mime: string };
}
export const deleteAttachment = (id: number) => run('DELETE FROM attachments WHERE id = ?', id);

// ---------- versions ----------
// Design versions keep their proposal in content_json; `content` gets a stub (alt texts + caption) so
// generic consumers (viewer, references) keep working without knowing the design format.
const designStub = (d: any, caption: string) => ({ slides: d.slides.map((s: any) => ({ layout: 'design', alt: s.alt })), caption, sources: d.sources ?? [] });
const toVersion = (r: Row): Version => ({
  id: r.id, publication_id: r.publication_id, number: r.number, origin: r.origin, provider: r.provider,
  kind: r.kind ?? 'carousel', direction: r.direction ?? null, proposal_set: r.proposal_set ?? null, proposal_status: r.proposal_status ?? null,
  design: r.kind === 'design' ? JSON.parse(r.content_json) : null,
  content: r.kind === 'design' ? (designStub(JSON.parse(r.content_json), r.caption) as any) : JSON.parse(r.content_json),
  caption: r.caption, slides: JSON.parse(r.slides_json),
  validation: JSON.parse(r.validation_json), concept: r.concept, prompt_versions: json(r.prompt_versions_json),
  parent_version_id: r.parent_version_id, job_id: r.job_id, notes: r.notes, dir: r.dir, created_at: r.created_at,
  story: r.story_json ? JSON.parse(String(r.story_json)) : null,
  sources: all("SELECT source FROM source_refs WHERE version_id = ? AND kind = 'source' ORDER BY id", r.id).map((x) => x.source),
  claims: all("SELECT claim, location, source, approval FROM source_refs WHERE version_id = ? AND kind = 'claim' ORDER BY id", r.id) as any,
});
export const listVersions = (pubId: number): Version[] =>
  all('SELECT * FROM versions WHERE publication_id = ? ORDER BY number DESC', pubId).map(toVersion);
export function getVersion(id: number): Version {
  const r = one('SELECT * FROM versions WHERE id = ?', id);
  if (!r) throw new NotFound(`Versión ${id} no encontrada`);
  return toVersion(r);
}
// Slides Jaime approved one by one in a design version (metadata of the version, not its content: the PNGs don't
// change). Stored in the design JSON so every version derived from it inherits the list.
export function setLockedSlides(versionId: number, slides: number[]): Version {
  const v = getVersion(versionId);
  if (v.kind !== 'design' || !v.design) throw new Error('Solo las propuestas del sistema de diseño tienen diapositivas aprobadas.');
  const locked = [...new Set(slides)].filter((n) => n >= 1 && n <= v.design!.slides.length).sort((a, b) => a - b);
  const design = { ...v.design, locked_slides: locked };
  run('UPDATE versions SET content_json = ? WHERE id = ?', JSON.stringify(design), versionId);
  const file = path.join(versionDir(v.publication_id, v.number), 'design.json');
  if (fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ ...JSON.parse(fs.readFileSync(file, 'utf8')), locked_slides: locked }, null, 2));
  return getVersion(versionId);
}
export const setVersionStory = (id: number, story: StoryRender) => run('UPDATE versions SET story_json = ? WHERE id = ?', JSON.stringify(story), id);
export const nextVersionNumber = (pubId: number) =>
  Number(one('SELECT COALESCE(MAX(number), 0) + 1 AS n FROM versions WHERE publication_id = ?', pubId)!.n);

type NewVersion = Omit<Version, 'id' | 'created_at' | 'kind' | 'design' | 'direction' | 'proposal_set' | 'proposal_status' | 'story'> &
  Partial<Pick<Version, 'kind' | 'design' | 'direction' | 'proposal_set' | 'proposal_status'>>;
// setCurrent=false inserts a proposal without making it the publication's current version (Jaime picks one).
export function insertVersion(v: NewVersion, setCurrent = true): Version {
  return tx(() => {
    const r = run(
      `INSERT INTO versions (publication_id, number, origin, provider, content_json, caption, slides_json, validation_json,
        concept, prompt_versions_json, parent_version_id, job_id, notes, dir, kind, direction, proposal_set, proposal_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      v.publication_id, v.number, v.origin, v.provider, JSON.stringify(v.kind === 'design' ? v.design : v.content), v.caption, JSON.stringify(v.slides),
      JSON.stringify(v.validation), v.concept, v.prompt_versions ? JSON.stringify(v.prompt_versions) : null,
      v.parent_version_id, v.job_id, v.notes, v.dir, v.kind ?? 'carousel', v.direction ?? null, v.proposal_set ?? null, v.proposal_status ?? null
    );
    const id = Number(r.lastInsertRowid);
    for (const s of v.sources) run("INSERT INTO source_refs (version_id, kind, source) VALUES (?, 'source', ?)", id, s);
    for (const c of v.claims) run("INSERT INTO source_refs (version_id, kind, claim, location, source, approval) VALUES (?, 'claim', ?, ?, ?, ?)", id, c.claim, c.location, c.source, c.approval);
    if (setCurrent) run("UPDATE publications SET current_version_id = ?, updated_at = datetime('now') WHERE id = ?", id, v.publication_id);
    return getVersion(id);
  });
}

// Jaime picks one proposal (or a revision of it): it becomes the current version; the rest of its set is kept
// as "not_selected" (never deleted) so it can be compared or picked later.
export function selectVersion(versionId: number): Version {
  const v = getVersion(versionId);
  tx(() => {
    if (v.proposal_set !== null)
      run("UPDATE versions SET proposal_status = 'not_selected' WHERE publication_id = ? AND proposal_set = ? AND id != ?", v.publication_id, v.proposal_set, v.id);
    run("UPDATE versions SET proposal_status = 'selected' WHERE id = ?", v.id);
    run("UPDATE publications SET current_version_id = ?, updated_at = datetime('now') WHERE id = ?", v.id, v.publication_id);
  });
  return getVersion(versionId);
}

// ---------- jobs ----------
const toJob = (r: Row): Job => ({
  id: r.id, publication_id: r.publication_id, kind: r.kind, status: r.status, stages: JSON.parse(r.stages_json),
  error: r.error, outcome: r.outcome, task_dir: r.task_dir, provider: r.provider, revision_id: r.revision_id,
  created_at: r.created_at, started_at: r.started_at, finished_at: r.finished_at,
  task_ready: !!r.task_dir && fs.existsSync(path.join(TASKS_DIR, path.basename(r.task_dir), 'result.json')),
});
export const jobInput = (id: number) => JSON.parse(one('SELECT input_json FROM jobs WHERE id = ?', id)!.input_json);
export const jobPrevStatus = (id: number) => one('SELECT prev_status FROM jobs WHERE id = ?', id)?.prev_status as Status | null;
export function getJob(id: number): Job {
  const r = one('SELECT * FROM jobs WHERE id = ?', id);
  if (!r) throw new NotFound(`Trabajo ${id} no encontrado`);
  return toJob(r);
}
export const listJobs = (pubId: number): Job[] => all('SELECT * FROM jobs WHERE publication_id = ? ORDER BY id DESC LIMIT 20', pubId).map(toJob);
export const activeJob = (pubId: number): Job | null => {
  const r = one("SELECT * FROM jobs WHERE publication_id = ? AND status IN ('pending','running') ORDER BY id DESC", pubId);
  return r ? toJob(r) : null;
};
// A Claude Code task package that was prepared but not imported yet (the latest job of the publication).
export const waitingTask = (pubId: number): Job | null => {
  const r = one('SELECT * FROM jobs WHERE publication_id = ? ORDER BY id DESC', pubId);
  return r && r.outcome === 'task_package' ? toJob(r) : null;
};
export const pendingJobs = (): Job[] => all("SELECT * FROM jobs WHERE status = 'pending' ORDER BY id").map(toJob);

export function insertJob(pubId: number, kind: JobKind, stages: Stage[], input: object, provider: string, revisionId: number | null = null): Job {
  // The duplicate check and the insert happen in one transaction, so two quick clicks cannot both create a job.
  return tx(() => {
    if (activeJob(pubId)) throw new Conflict('Ya hay un trabajo en curso para esta publicación. Espera a que termine.');
    const r = run(
      'INSERT INTO jobs (publication_id, kind, stages_json, input_json, provider, revision_id, prev_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      pubId, kind, JSON.stringify(stages), JSON.stringify(input), provider, revisionId, getPublication(pubId).status
    );
    return getJob(Number(r.lastInsertRowid));
  });
}
export function updateJob(id: number, f: Partial<{ status: string; stages: Stage[]; input: object; error: string | null; outcome: string; task_dir: string; started: boolean; finished: boolean }>) {
  if (f.status) run('UPDATE jobs SET status = ? WHERE id = ?', f.status, id);
  if (f.stages) run('UPDATE jobs SET stages_json = ? WHERE id = ?', JSON.stringify(f.stages), id);
  if (f.input) run('UPDATE jobs SET input_json = ? WHERE id = ?', JSON.stringify(f.input), id);
  if (f.error !== undefined) run('UPDATE jobs SET error = ? WHERE id = ?', f.error, id);
  if (f.outcome) run('UPDATE jobs SET outcome = ? WHERE id = ?', f.outcome, id);
  if (f.task_dir) run('UPDATE jobs SET task_dir = ? WHERE id = ?', f.task_dir, id);
  if (f.started) run("UPDATE jobs SET started_at = datetime('now') WHERE id = ?", id);
  if (f.finished) run("UPDATE jobs SET finished_at = datetime('now') WHERE id = ?", id);
}
// Jobs interrupted by a server stop cannot resume mid-render; mark them failed so they can be retried.
export function failInterruptedJobs() {
  for (const r of all("SELECT id, publication_id, prev_status, stages_json FROM jobs WHERE status = 'running'")) {
    const stages = (JSON.parse(r.stages_json) as Stage[]).map((s) => (s.status === 'running' ? { ...s, status: 'failed' as const } : s));
    run("UPDATE jobs SET status = 'failed', error = ?, stages_json = ?, finished_at = datetime('now') WHERE id = ?",
      'El servidor se detuvo mientras se ejecutaba este trabajo. Puedes reintentarlo.', JSON.stringify(stages), r.id);
    const pub = one('SELECT status FROM publications WHERE id = ?', r.publication_id);
    if (pub?.status === 'generating') run('UPDATE publications SET status = ? WHERE id = ?', r.prev_status || 'planned', r.publication_id);
  }
}

// ---------- revisions ----------
export const listRevisions = (pubId: number): RevisionRequest[] =>
  all('SELECT * FROM revision_requests WHERE publication_id = ? ORDER BY id DESC', pubId) as RevisionRequest[];
export function insertRevision(pubId: number, r: { version_id: number | null; target: string; slide_number: number | null; instruction: string }): RevisionRequest {
  const x = run('INSERT INTO revision_requests (publication_id, version_id, target, slide_number, instruction) VALUES (?, ?, ?, ?, ?)',
    pubId, r.version_id, r.target, r.slide_number, r.instruction);
  return one('SELECT * FROM revision_requests WHERE id = ?', x.lastInsertRowid) as RevisionRequest;
}
export const getRevision = (id: number) => one('SELECT * FROM revision_requests WHERE id = ?', id) as RevisionRequest | undefined;
export const updateRevision = (id: number, status: string, resultVersionId: number | null = null) =>
  run('UPDATE revision_requests SET status = ?, result_version_id = COALESCE(?, result_version_id) WHERE id = ?', status, resultVersionId, id);

// ---------- step 1 "Mensaje": text options and approved texts ----------
export const listCopyOptions = (pubId: number): StoredCopyOption[] =>
  all('SELECT * FROM copy_options WHERE publication_id = ? ORDER BY id DESC', pubId).map((r) => ({ ...JSON.parse(r.option_json), id: r.id, slide: r.slide, job_id: r.job_id, created_at: r.created_at }));
export function insertCopyOptions(pubId: number, jobId: number, options: { slide: number; option: CopyOptionT }[]) {
  tx(() => {
    for (const o of options) run('INSERT INTO copy_options (publication_id, job_id, slide, option_json) VALUES (?, ?, ?, ?)', pubId, jobId, o.slide, JSON.stringify(o.option));
  });
}

// Jaime approves one text per slide (picked from the options and possibly edited).
export function approveCopy(pubId: number, slides: Omit<ApprovedSlide, 'role'>[]): ApprovedCopy {
  const p = getPublication(pubId);
  const roles = narrative(p);
  if (!Array.isArray(slides) || slides.length !== roles.length) throw new BadRequest(`Aprueba un texto para cada una de las ${roles.length} diapositivas.`);
  const out: ApprovedSlide[] = roles.map((r, i) => {
    const s = slides.find((x) => Number(x.slide) === i + 1);
    if (!s || !String(s.headline ?? '').trim()) throw new BadRequest(`Falta el texto principal de la diapositiva ${i + 1} (${r.label}).`);
    const points = (Array.isArray(s.points) ? s.points : []).map((x) => ({ title: String(x.title ?? '').trim(), text: String(x.text ?? '').trim() })).filter((x) => x.title || x.text);
    return {
      slide: i + 1, role: r.role, headline: String(s.headline).trim(), support: String(s.support ?? '').trim() || null, points,
      claims: Array.isArray(s.claims) ? s.claims : [],
    };
  });
  const copy: ApprovedCopy = { slides: out, approved_at: new Date().toISOString() };
  tx(() => {
    run("UPDATE publications SET approved_copy_json = ?, updated_at = datetime('now') WHERE id = ?", JSON.stringify(copy), pubId);
    addHistory(pubId, null, 'copy_approved', null, null, out.map((s) => `${s.slide}: ${s.headline.replace(/\n/g, ' ')}`).join(' · '));
  });
  return copy;
}

// ---------- history & preferences ----------
export const listHistory = (pubId: number): HistoryEvent[] =>
  all('SELECT * FROM history WHERE publication_id = ? ORDER BY id DESC', pubId) as HistoryEvent[];

export const listPreferences = (): EditorialPreference[] =>
  all('SELECT * FROM editorial_preferences ORDER BY id').map((r) => ({ ...r, active: !!r.active }) as EditorialPreference);
export const activePreferences = (brandId: string): string[] =>
  all('SELECT text FROM editorial_preferences WHERE active = 1 AND (brand_id IS NULL OR brand_id = ?) ORDER BY id', brandId).map((r) => r.text);
export function addPreference(brandId: string | null, text: string): EditorialPreference {
  if (!text?.trim()) throw new BadRequest('La preferencia está vacía.');
  const r = run('INSERT INTO editorial_preferences (brand_id, text) VALUES (?, ?)', brandId, text.trim());
  return { ...(one('SELECT * FROM editorial_preferences WHERE id = ?', r.lastInsertRowid) as any), active: true };
}
export const updatePreference = (id: number, f: { active?: boolean; text?: string }) => {
  if (f.active !== undefined) run('UPDATE editorial_preferences SET active = ? WHERE id = ?', f.active ? 1 : 0, id);
  if (f.text !== undefined) run('UPDATE editorial_preferences SET text = ? WHERE id = ?', f.text, id);
};
export const deletePreference = (id: number) => run('DELETE FROM editorial_preferences WHERE id = ?', id);

export const recordPromptVersion = (id: string, version: string, sha: string, p: string) =>
  run('INSERT OR IGNORE INTO prompt_versions (prompt_id, version, sha256, path) VALUES (?, ?, ?, ?)', id, version, sha, p);

export function publicationDetail(id: number): PublicationDetail {
  const publication = getPublication(id);
  const b = getBrand(publication.brand_id);
  return {
    publication,
    brand: { id: b.id, name: b.name, signature: b.signature, color: b.color },
    products: getProducts(publication.product_ids),
    attachments: listAttachments(id),
    versions: listVersions(id),
    jobs: listJobs(id),
    revisions: listRevisions(id),
    history: listHistory(id),
    copy_options: listCopyOptions(id),
  };
}
