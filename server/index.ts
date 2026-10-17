// REACH Content Studio API + static web app. Run: npm start (or npm run dev for the Vite dev server).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { ROOT, DATA_DIR, MEDIA_DIR, UPLOADS_DIR, WEB_DIST, abs, rel, versionDir } from './paths.ts';

const repo = await import('./repo.ts');
const { seed } = await import('./seed.ts');
const { enqueue, drain } = await import('./pipeline/jobs.ts');
const { getProvider } = await import('./ai/provider.ts');
const { claudeCommand } = await import('./ai/claude-code.ts');
const { saveIllustrations } = await import('./design/library.ts');
const { zip } = await import('./zip.ts');
const { STATUS_LABELS, MANUAL_TRANSITIONS, GENERATABLE_FORMATS, REVISION_TARGETS } = await import('../shared/types.ts');
const { narrative } = await import('../shared/structure.ts');
const { applyNodeEdits } = await import('../shared/design-edit.ts');
type Status = import('../shared/types.ts').Status;

const PORT = Number(process.env.PORT || 4600);
const MAX_UPLOAD = 50 * 1024 * 1024;

// ---------- helpers ----------
class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
type Req = http.IncomingMessage & { params: string[]; query: URLSearchParams };
type Handler = (req: Req, res: http.ServerResponse) => Promise<unknown> | unknown;
const routes: [string, RegExp, Handler][] = [];
const route = (method: string, pattern: string, h: Handler) =>
  routes.push([method, new RegExp('^' + pattern.replace(/:\w+/g, '([^/]+)') + '$'), h]);

const readBody = (req: http.IncomingMessage, limit = 2 * 1024 * 1024) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        reject(new HttpError(413, 'Archivo demasiado grande (máximo 50 MB).'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
const jsonBody = async (req: http.IncomingMessage) => {
  const b = await readBody(req);
  try {
    return b.length ? JSON.parse(b.toString('utf8')) : {};
  } catch {
    throw new HttpError(400, 'JSON inválido');
  }
};
const send = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};
const sendFile = (res: http.ServerResponse, file: string, downloadName?: string, cache = 'no-cache') => {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new HttpError(404, 'Archivo no encontrado');
  const headers: Record<string, string> = { 'content-type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'cache-control': cache };
  if (downloadName) headers['content-disposition'] = `attachment; filename="${downloadName.replace(/[^\w.-]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`;
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
};
// Serve a file from inside base only (no path traversal).
const safeJoin = (base: string, p: string) => {
  const f = path.resolve(base, '.' + path.posix.normalize('/' + decodeURIComponent(p)));
  if (!f.startsWith(base + path.sep)) throw new HttpError(403, 'Ruta no permitida');
  return f;
};
const id = (s: string) => {
  const n = Number(s);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'Identificador inválido');
  return n;
};
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
// REACH file naming convention: REACH_Cliente_Tipo_AAAA-MM-DD_v01.ext (brand manual, "Archivos").
const exportName = (versionId: number, suffix: string) => {
  const v = repo.getVersion(versionId);
  const p = repo.getPublication(v.publication_id);
  const b = repo.getBrand(p.brand_id);
  return `REACH_${slug(b.name)}_${p.format === 'single_image' ? 'Imagen' : 'Carrusel'}_${p.date}_v${String(v.number).padStart(2, '0')}${suffix}`;
};
const detail = (pubId: number) => repo.publicationDetail(pubId);

// ---------- settings & catalog ----------
route('GET', '/api/settings', () => {
  const p = getProvider();
  return { ai_mode: p.id, model: p.model, data_dir: rel(DATA_DIR), statuses: STATUS_LABELS };
});
route('GET', '/api/brands', () => repo.listBrands());
route('GET', '/api/products', () => repo.listProducts());
route('POST', '/api/products', async (req) => repo.createProduct(await jsonBody(req)));
route('PUT', '/api/products/:id', async (req) => repo.updateProduct(decodeURIComponent(req.params[0]), await jsonBody(req)));

// ---------- publications ----------
route('GET', '/api/publications', (req) =>
  repo.listPublications({ from: req.query.get('from') ?? undefined, to: req.query.get('to') ?? undefined, brand: req.query.get('brand') || undefined, status: req.query.get('status') || undefined })
);
route('POST', '/api/publications', async (req) => repo.createPublication(await jsonBody(req)));
route('GET', '/api/publications/:id', (req) => detail(id(req.params[0])));
route('PATCH', '/api/publications/:id', async (req) => {
  const pubId = id(req.params[0]);
  repo.updatePublication(pubId, await jsonBody(req));
  return detail(pubId);
});
route('DELETE', '/api/publications/:id', (req) => {
  const pubId = id(req.params[0]);
  repo.deletePublication(pubId);
  return { ok: true };
});

// ---------- attachments (raw body upload: POST ...?name=file.pdf) ----------
route('POST', '/api/publications/:id/attachments', async (req) => {
  const pubId = id(req.params[0]);
  repo.getPublication(pubId);
  const name = path.basename(req.query.get('name') || '').replace(/[^\w.\- ()áéíóúñÁÉÍÓÚÑ]/g, '_');
  if (!name) throw new HttpError(400, 'Falta el nombre del archivo');
  const ext = path.extname(name).toLowerCase();
  const kind = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ? 'image' : ['.pdf', '.md', '.txt'].includes(ext) ? 'document' : null;
  if (!kind) throw new HttpError(400, 'Formato no admitido. Imágenes: PNG, JPG, WEBP. Documentos: PDF, MD, TXT.');
  const data = await readBody(req, MAX_UPLOAD);
  const dir = path.join(UPLOADS_DIR, `pub-${pubId}`);
  fs.mkdirSync(dir, { recursive: true });
  let file = path.join(dir, name);
  if (fs.existsSync(file)) file = path.join(dir, `${path.basename(name, ext)}-${Date.now().toString(36)}${ext}`);
  fs.writeFileSync(file, data);
  repo.addAttachment(pubId, { kind, filename: name, path: rel(file), mime: MIME[ext]?.split(';')[0] ?? 'application/octet-stream', size: data.length });
  return detail(pubId);
});
route('GET', '/api/attachments/:id/file', (req, res) => {
  const a = repo.getAttachment(id(req.params[0]));
  sendFile(res, abs(a.path), req.query.get('download') ? a.filename : undefined);
});
route('DELETE', '/api/attachments/:id', (req) => {
  const a = repo.getAttachment(id(req.params[0]));
  repo.deleteAttachment(a.id); // the file stays on disk: versions may still reference it
  return detail(a.publication_id);
});

// ---------- generation workflow ----------
route('POST', '/api/publications/:id/generate', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const waiting = repo.waitingTask(pubId);
  if (waiting && !(await jsonBody(req)).discard_task)
    throw new HttpError(409, `Ya hay una tarea preparada para Claude Code (#${waiting.id}). Ejecútala e importa el resultado, o descártala y prepárala de nuevo.`);
  if (waiting) repo.addHistory(pubId, null, 'task_discarded', null, null, `Tarea #${waiting.id} descartada`);
  if (!GENERATABLE_FORMATS.includes(p.format)) throw new HttpError(400, 'Este formato se puede planificar, pero la generación solo está disponible para carrusel e imagen única.');
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación si quieres generar o cambiar el contenido.');
  enqueue(pubId, 'generate');
  return detail(pubId);
});
// Creative proposals (design system): three art directions for the same carousel or single image, in one job.
route('POST', '/api/publications/:id/proposals', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const waiting = repo.waitingTask(pubId);
  if (waiting && !(await jsonBody(req)).discard_task)
    throw new HttpError(409, `Ya hay una tarea preparada para Claude Code (#${waiting.id}). Ejecútala e importa el resultado, o descártala.`);
  if (waiting) {
    repo.updateJob(waiting.id, { outcome: 'discarded' });
    repo.addHistory(pubId, null, 'task_discarded', null, null, `Tarea #${waiting.id} descartada`);
  }
  if (!GENERATABLE_FORMATS.includes(p.format)) throw new HttpError(400, 'Las propuestas creativas están disponibles para carrusel e imagen única.');
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación si quieres nuevas propuestas.');
  enqueue(pubId, 'propose');
  return detail(pubId);
});
// Step 1 "Mensaje": text options for every slide, or more options for one slide (with Jaime's comment).
route('POST', '/api/publications/:id/copy', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const b = await jsonBody(req);
  if (!GENERATABLE_FORMATS.includes(p.format)) throw new HttpError(400, 'Los textos se proponen para carrusel e imagen única.');
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación si quieres cambiar los textos.');
  const slides = narrative(p).length;
  const slide = b.slide ? Number(b.slide) : null;
  if (slide && !(Number.isInteger(slide) && slide >= 1 && slide <= slides)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  const instruction = String(b.instruction ?? '').trim();
  if (repo.activeJob(pubId)) throw new HttpError(409, 'Ya hay un trabajo en curso para esta publicación. Espera a que termine.');
  const waiting = repo.waitingTask(pubId);
  if (waiting && !b.discard_task)
    throw new HttpError(409, `Ya hay una tarea preparada para Claude Code (#${waiting.id}). Ejecútala e importa el resultado, o descártala.`);
  if (waiting) {
    repo.updateJob(waiting.id, { outcome: 'discarded' });
    repo.addHistory(pubId, null, 'task_discarded', null, null, `Tarea #${waiting.id} descartada`);
  }
  if (b.save_as_preference && instruction) repo.addPreference(p.brand_id, instruction);
  enqueue(pubId, 'copy', { slide, instruction });
  return detail(pubId);
});
route('POST', '/api/publications/:id/copy/approve', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación si quieres cambiar los textos.');
  if (repo.activeJob(pubId)) throw new HttpError(409, 'Hay un trabajo en curso. Espera a que termine.');
  repo.approveCopy(pubId, (await jsonBody(req)).slides);
  return detail(pubId);
});
route('POST', '/api/versions/:id/select', (req) => {
  const v = repo.getVersion(id(req.params[0]));
  const p = repo.getPublication(v.publication_id);
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación para elegir otra propuesta.');
  if (repo.activeJob(p.id)) throw new HttpError(409, 'Hay un trabajo en curso. Espera a que termine.');
  repo.selectVersion(v.id);
  repo.addHistory(p.id, v.id, 'proposal_selected', null, null, `v${v.number}${v.direction ? ` · propuesta ${v.direction}` : ''}`);
  if (p.status !== 'ready_for_review') repo.setStatus(p.id, 'ready_for_review', 'status_changed', 'Propuesta elegida', v.id);
  return detail(p.id);
});
// Natural-language change to a design proposal, or "regenerate slide N" (slide_number set).
route('POST', '/api/publications/:id/design-revisions', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const b = await jsonBody(req);
  const v = repo.getVersion(id(String(b.version_id)));
  if (v.publication_id !== pubId || v.kind !== 'design') throw new HttpError(400, 'Elige una propuesta del sistema de diseño.');
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación para pedir cambios.');
  // Comments per slide (step 3): with no general comment, only the commented slides may change.
  const locked = v.design?.locked_slides ?? [];
  const comments: { slide: number; text: string }[] = (Array.isArray(b.slide_comments) ? b.slide_comments : [])
    .map((c: any) => ({ slide: Number(c?.slide), text: String(c?.text ?? '').trim() }))
    .filter((c: { slide: number; text: string }) => c.text);
  for (const c of comments) {
    if (!(c.slide >= 1 && c.slide <= v.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
    if (locked.includes(c.slide)) throw new HttpError(400, `La diapositiva ${c.slide} está aprobada. Quita la aprobación para pedir cambios en ella.`);
  }
  const general = String(b.instruction ?? '').trim();
  let slide = b.slide_number ? Number(b.slide_number) : null;
  if (!general && comments.length === 1) slide = comments[0].slide;
  if (slide && (slide < 1 || slide > v.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  if (slide && locked.includes(slide)) throw new HttpError(400, `La diapositiva ${slide} está aprobada. Quita la aprobación para cambiarla.`);
  if (!slide && !comments.length && locked.length === v.slides.length) throw new HttpError(400, 'Todas las diapositivas están aprobadas: quita la aprobación de las que quieras cambiar.');
  const perSlide = comments.map((c) => `- Diapositiva ${c.slide}: ${c.text}`).join('\n');
  const instruction =
    (general && perSlide ? `${general}\n\nPor diapositiva:\n${perSlide}` : general || (comments.length > 1 ? `Por diapositiva:\n${perSlide}` : comments[0]?.text ?? ''))
    || (slide ? `Regenerar la diapositiva ${slide}: otra composición con la misma función y los mismos datos.` : '');
  if (!instruction) throw new HttpError(400, 'Describe el cambio que quieres.');
  const allowed = !general && comments.length > 1 ? comments.map((c) => c.slide) : null;
  if (repo.activeJob(pubId)) throw new HttpError(409, 'Ya hay un trabajo en curso para esta publicación. Espera a que termine.');
  const waiting = repo.waitingTask(pubId);
  if (waiting && !b.discard_task) throw new HttpError(409, `Hay una tarea de Claude Code sin importar (#${waiting.id}). Impórtala o descártala antes de pedir otro cambio.`);
  if (waiting) {
    repo.updateJob(waiting.id, { outcome: 'discarded' });
    repo.addHistory(pubId, null, 'task_discarded', null, null, `Tarea #${waiting.id} descartada`);
  }
  const r = repo.insertRevision(pubId, { version_id: v.id, target: slide ? 'slide' : 'carousel', slide_number: slide, instruction });
  repo.setStatus(pubId, 'changes_requested', 'changes_requested', instruction, v.id);
  if (b.save_as_preference && general) repo.addPreference(p.brand_id, general);
  enqueue(pubId, 'design_revise', { base_version_id: v.id, slide_number: slide, slides_allowed: allowed }, r.id);
  return detail(pubId);
});

// ---------- step 3 without AI: approve slides one by one, edit texts, bring slides from other versions ----------
function editableDesign(versionId: number, opts: { job: boolean }) {
  const v = repo.getVersion(versionId);
  const p = repo.getPublication(v.publication_id);
  if (v.kind !== 'design' || !v.design) throw new HttpError(400, 'Solo las propuestas del sistema de diseño se ajustan así.');
  if (['approved', 'scheduled', 'published'].includes(p.status)) throw new HttpError(409, 'La publicación ya está aprobada. Revoca la aprobación para hacer cambios.');
  if (p.current_version_id !== v.id) throw new HttpError(409, 'Elige primero esta propuesta: los ajustes se hacen sobre la versión actual.');
  if (repo.activeJob(p.id)) throw new HttpError(409, 'Hay un trabajo en curso. Espera a que termine.');
  if (opts.job) {
    const waiting = repo.waitingTask(p.id);
    if (waiting) throw new HttpError(409, `Hay una tarea de Claude Code sin importar (#${waiting.id}). Impórtala o descártala antes de hacer otro ajuste.`);
  }
  return { v, p };
}
route('POST', '/api/versions/:id/locks', async (req) => {
  const { v, p } = editableDesign(id(req.params[0]), { job: false });
  const b = await jsonBody(req);
  const n = Number(b.slide);
  if (!(n >= 1 && n <= v.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  const now = new Set(v.design!.locked_slides ?? []);
  if (b.locked) now.add(n);
  else now.delete(n);
  repo.setLockedSlides(v.id, [...now]);
  repo.addHistory(p.id, v.id, b.locked ? 'slide_approved' : 'slide_unlocked', null, null, `v${v.number} · diapositiva ${n}`);
  return detail(p.id);
});
route('POST', '/api/versions/:id/design-edit', async (req) => {
  const { v, p } = editableDesign(id(req.params[0]), { job: true });
  const b = await jsonBody(req);
  const n = Number(b.slide);
  if (!(n >= 1 && n <= v.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  if (v.design!.locked_slides?.includes(n)) throw new HttpError(400, `La diapositiva ${n} está aprobada. Quita la aprobación para cambiarla.`);
  const edits = Array.isArray(b.edits) ? b.edits : [];
  if (!edits.length) throw new HttpError(400, 'No hay cambios que aplicar.');
  try {
    applyNodeEdits(v.design!.slides[n - 1], edits);
  } catch (e) {
    throw new HttpError(400, (e as Error).message);
  }
  enqueue(p.id, 'design_edit', { base_version_id: v.id, op: 'text', slide: n, edits });
  return detail(p.id);
});
route('POST', '/api/versions/:id/slides/:n/replace', async (req) => {
  const { v, p } = editableDesign(id(req.params[0]), { job: true });
  const n = Number(req.params[1]);
  const b = await jsonBody(req);
  if (!(n >= 1 && n <= v.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  if (v.design!.locked_slides?.includes(n)) throw new HttpError(400, `La diapositiva ${n} está aprobada. Quita la aprobación para reemplazarla.`);
  const src = repo.getVersion(id(String(b.from_version_id)));
  const k = Number(b.from_slide);
  if (src.publication_id !== p.id || src.kind !== 'design' || !src.design?.slides[k - 1]) throw new HttpError(400, 'Elige una diapositiva de otra propuesta de esta publicación.');
  if (src.id === v.id && k === n) throw new HttpError(400, 'Es la misma diapositiva.');
  enqueue(p.id, 'design_edit', { base_version_id: v.id, op: 'swap', slide: n, from_version_id: src.id, from_slide: k });
  return detail(p.id);
});

route('GET', '/api/jobs/:id', (req) => repo.getJob(id(req.params[0])));
route('GET', '/api/jobs/:id/command', (req) => {
  const j = repo.getJob(id(req.params[0]));
  if (!j.task_dir) throw new HttpError(404, 'Este trabajo no tiene paquete de tarea');
  return { command: claudeCommand(j.task_dir), task_dir: j.task_dir };
});
route('POST', '/api/jobs/:id/import', (req) => {
  const j = repo.getJob(id(req.params[0]));
  if (j.outcome !== 'task_package' || !j.task_dir) throw new HttpError(400, 'Este trabajo no tiene un resultado de Claude Code que importar.');
  if (!j.task_ready) throw new HttpError(400, `Todavía no existe ${j.task_dir}/result.json. Ejecuta la tarea en Claude Code primero.`);
  enqueue(j.publication_id, 'import', { source_job_id: j.id }, j.revision_id);
  return detail(j.publication_id);
});
route('POST', '/api/jobs/:id/discard', (req) => {
  const j = repo.getJob(id(req.params[0]));
  if (j.outcome !== 'task_package') throw new HttpError(400, 'Solo se pueden descartar tareas de Claude Code pendientes.');
  repo.updateJob(j.id, { outcome: 'discarded' });
  if (j.revision_id) repo.updateRevision(j.revision_id, 'failed');
  repo.addHistory(j.publication_id, null, 'task_discarded', null, null, `Tarea #${j.id} descartada`);
  return detail(j.publication_id);
});
route('POST', '/api/jobs/:id/retry', (req) => {
  const j = repo.getJob(id(req.params[0]));
  if (j.status !== 'failed') throw new HttpError(400, 'Solo se pueden reintentar trabajos fallidos.');
  enqueue(j.publication_id, j.kind, repo.jobInput(j.id), j.revision_id);
  return detail(j.publication_id);
});

// Direct text edit: no AI call; only changed slides are re-rendered.
route('POST', '/api/publications/:id/edit', async (req) => {
  const pubId = id(req.params[0]);
  const body = await jsonBody(req);
  const base = repo.getVersion(id(String(body.version_id)));
  if (base.publication_id !== pubId) throw new HttpError(400, 'La versión no pertenece a esta publicación');
  if (!body.content?.slides) throw new HttpError(400, 'Falta el contenido editado');
  if (base.kind === 'design') throw new HttpError(400, 'Las propuestas del sistema de diseño se cambian con "Solicitar cambios".');
  enqueue(pubId, 'edit', { base_version_id: base.id, content: body.content, note: body.note });
  return detail(pubId);
});

route('POST', '/api/publications/:id/revisions', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const b = await jsonBody(req);
  if (!String(b.instruction ?? '').trim()) throw new HttpError(400, 'Describe el cambio que quieres.');
  if (!(b.target in REVISION_TARGETS)) throw new HttpError(400, 'Alcance de cambio desconocido');
  if (!p.current_version_id) throw new HttpError(400, 'La publicación aún no tiene contenido generado.');
  const v = repo.getVersion(p.current_version_id);
  if (v.kind === 'design') throw new HttpError(400, 'La versión actual es una propuesta del sistema de diseño: usa /design-revisions.');
  const slide = b.slide_number ? Number(b.slide_number) : null;
  if (slide && (slide < 1 || slide > v.content.slides.length)) throw new HttpError(400, 'Número de diapositiva fuera de rango');
  if (repo.activeJob(pubId)) throw new HttpError(409, 'Ya hay un trabajo en curso para esta publicación. Espera a que termine.');
  const waiting = repo.waitingTask(pubId);
  if (waiting && !b.discard_task)
    throw new HttpError(409, `Hay una tarea de Claude Code sin importar (#${waiting.id}). Impórtala o descártala antes de pedir otro cambio.`);
  if (waiting) repo.addHistory(pubId, null, 'task_discarded', null, null, `Tarea #${waiting.id} descartada`);
  const r = repo.insertRevision(pubId, { version_id: v.id, target: b.target, slide_number: slide, instruction: String(b.instruction).trim() });
  repo.setStatus(pubId, 'changes_requested', 'changes_requested', r.instruction, v.id);
  if (b.save_as_preference) repo.addPreference(p.brand_id, String(b.instruction).trim());
  if (b.run !== false) enqueue(pubId, 'revise', { base_version_id: v.id }, r.id);
  return detail(pubId);
});

// ---------- approval & status ----------
route('POST', '/api/publications/:id/approve', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const b = await jsonBody(req);
  if (p.status !== 'ready_for_review') throw new HttpError(409, `Solo se aprueban publicaciones listas para revisión (estado actual: ${STATUS_LABELS[p.status]}).`);
  if (!p.current_version_id || Number(b.version_id) !== p.current_version_id) throw new HttpError(409, 'Solo se puede aprobar la versión actual.');
  repo.setStatus(pubId, 'approved', 'approved', b.note || null, p.current_version_id);
  // Topic illustrations drawn for this publication go to the library for future publications.
  const saved = saveIllustrations(repo.getVersion(p.current_version_id), p.topic, p.date);
  if (saved.length) repo.addHistory(pubId, p.current_version_id, 'illustrations_saved', null, null, saved.join(', '));
  // Every approval also produces the story (9:16) version of the approved carousel.
  if (!repo.activeJob(pubId)) enqueue(pubId, 'story', { version_id: p.current_version_id });
  return detail(pubId);
});
// Re-render the stories of an approved version (e.g. if the first render failed).
route('POST', '/api/versions/:id/stories', (req) => {
  const v = repo.getVersion(id(req.params[0]));
  const p = repo.getPublication(v.publication_id);
  if (!['approved', 'scheduled', 'published'].includes(p.status) || p.current_version_id !== v.id) throw new HttpError(409, 'Las historias se generan para la versión aprobada.');
  if (repo.activeJob(p.id)) throw new HttpError(409, 'Hay un trabajo en curso. Espera a que termine.');
  enqueue(p.id, 'story', { version_id: v.id });
  return detail(p.id);
});
route('POST', '/api/publications/:id/status', async (req) => {
  const pubId = id(req.params[0]);
  const p = repo.getPublication(pubId);
  const to = (await jsonBody(req)).to as Status;
  if (!MANUAL_TRANSITIONS[p.status]?.includes(to)) throw new HttpError(409, `No se puede pasar de "${STATUS_LABELS[p.status]}" a "${STATUS_LABELS[to] ?? to}".`);
  repo.setStatus(pubId, to, to === 'ready_for_review' ? 'approval_revoked' : 'status_changed', 'Cambio manual (sin publicación externa)', p.current_version_id);
  return detail(pubId);
});

// ---------- downloads ----------
route('GET', '/api/versions/:id/slides/:n/download', (req, res) => {
  const v = repo.getVersion(id(req.params[0]));
  const s = v.slides[id(req.params[1]) - 1];
  if (!s) throw new HttpError(404, 'Diapositiva no encontrada');
  sendFile(res, path.join(versionDir(v.publication_id, v.number), s.file), exportName(v.id, `_${s.file}`));
});
route('GET', '/api/versions/:id/stories/:n/download', (req, res) => {
  const v = repo.getVersion(id(req.params[0]));
  const s = v.story?.slides[id(req.params[1]) - 1];
  if (!s) throw new HttpError(404, 'Historia no encontrada');
  sendFile(res, path.join(versionDir(v.publication_id, v.number), 'historias', s.file), exportName(v.id, `_historia_${s.file.replace('story-', '')}`));
});
route('GET', '/api/versions/:id/zip', (req, res) => {
  const v = repo.getVersion(id(req.params[0]));
  const dir = versionDir(v.publication_id, v.number);
  const base = exportName(v.id, '');
  const data = zip([
    ...v.slides.map((s) => ({ name: `${base}_${s.file}`, data: fs.readFileSync(path.join(dir, s.file)) })),
    ...(v.story?.slides ?? []).map((s) => ({ name: `historias/${base}_historia_${s.file.replace('story-', '')}`, data: fs.readFileSync(path.join(dir, 'historias', s.file)) })),
    { name: `${base}_caption.txt`, data: Buffer.from(v.caption + '\n', 'utf8') },
  ]);
  res.writeHead(200, { 'content-type': 'application/zip', 'content-length': data.length, 'content-disposition': `attachment; filename="${base}.zip"` });
  res.end(data);
});

// ---------- editorial preferences ----------
route('GET', '/api/preferences', () => repo.listPreferences());
route('POST', '/api/preferences', async (req) => {
  const b = await jsonBody(req);
  return repo.addPreference(b.brand_id || null, b.text);
});
route('PATCH', '/api/preferences/:id', async (req) => {
  repo.updatePreference(id(req.params[0]), await jsonBody(req));
  return repo.listPreferences();
});
route('DELETE', '/api/preferences/:id', (req) => {
  repo.deletePreference(id(req.params[0]));
  return repo.listPreferences();
});

// ---------- server ----------
const server = http.createServer(async (rawReq, res) => {
  const url = new URL(rawReq.url ?? '/', 'http://localhost');
  const req = Object.assign(rawReq, { params: [] as string[], query: url.searchParams });
  try {
    if (url.pathname.startsWith('/api/')) {
      for (const [method, re, h] of routes) {
        const m = url.pathname.match(re);
        if (m && method === req.method) {
          req.params = m.slice(1);
          const out = await h(req, res);
          if (!res.headersSent) send(res, 200, out);
          return;
        }
      }
      throw new HttpError(404, 'Ruta no encontrada');
    }
    if (url.pathname.startsWith('/media/')) return sendFile(res, safeJoin(MEDIA_DIR, url.pathname.slice('/media/'.length)));
    // Repo assets (product images) for previews in the web app.
    if (url.pathname.startsWith('/assets-repo/')) return sendFile(res, safeJoin(path.join(ROOT, 'public'), url.pathname.slice('/assets-repo/'.length)));
    if (!fs.existsSync(WEB_DIST)) {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('API en marcha. Ejecuta "npm run build" (o usa "npm run dev") para la interfaz web.');
    }
    const file = url.pathname === '/' ? path.join(WEB_DIST, 'index.html') : safeJoin(WEB_DIST, url.pathname);
    return sendFile(res, fs.existsSync(file) ? file : path.join(WEB_DIST, 'index.html'), undefined, url.pathname.startsWith('/assets/') ? 'max-age=31536000, immutable' : 'no-cache');
  } catch (e) {
    const err = e as Error;
    const status = e instanceof HttpError ? e.status : e instanceof repo.NotFound ? 404 : e instanceof repo.Conflict ? 409 : e instanceof repo.BadRequest ? 400 : 500;
    if (status === 500) console.error(err);
    if (!res.headersSent) send(res, status, { error: status === 500 ? `Error interno: ${err.message}` : err.message });
    else res.end();
  }
});

repo.failInterruptedJobs();
// Exit on SIGTERM / SIGINT even while a render is running: Playwright installs its own handlers for these signals
// while a browser is open (they close the browser but don't exit), which would leave the HTTP server running.
// Jobs cut short are marked failed on the next start (failInterruptedJobs above).
for (const sig of ['SIGTERM', 'SIGINT'] as const) process.on(sig, () => process.exit(0));
seed();
server.listen(PORT, '127.0.0.1', () => {
  const p = getProvider();
  console.log(`REACH Content Studio → http://localhost:${PORT}`);
  console.log(`Datos: ${rel(DATA_DIR)} · IA: ${p.label}${p.model ? ` (${p.model})` : ''}`);
  void drain();
});
