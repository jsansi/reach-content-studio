// One publication: brief, files, generation jobs, carousel viewer, revisions, approval and history.
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.ts';
import { CarouselViewer } from '../components/CarouselViewer.tsx';
import { EditTexts } from '../components/EditTexts.tsx';
import { JobPanel } from '../components/JobPanel.tsx';
import { DesignChanges } from '../components/DesignChanges.tsx';
import { SlideEditor } from '../components/SlideEditor.tsx';
import { ProposalsPanel } from '../components/ProposalsPanel.tsx';
import { CopyStep } from '../components/CopyStep.tsx';
import { StoriesPanel } from '../components/StoriesPanel.tsx';
import { NewProduct, PublicationForm } from '../components/PublicationForm.tsx';
import { RequestChanges } from '../components/RequestChanges.tsx';
import { BrandTag, Modal, StatusBadge, dateTime, longDate, useToast } from '../ui.tsx';
import { FORMATS, GENERATABLE_FORMATS, REVISION_TARGETS, STATUS_LABELS, type Product, type PublicationDetail } from '../../../shared/types.ts';
import type { AppData } from '../App.tsx';

const ACTIONS: Record<string, string> = {
  created: 'Publicación creada',
  brief_updated: 'Brief actualizado',
  rescheduled: 'Reprogramada',
  version_imported: 'Versión importada',
  version_created: 'Nueva versión',
  changes_requested: 'Cambios solicitados',
  approved: 'Aprobada',
  approval_revoked: 'Aprobación revocada',
  status_changed: 'Cambio de estado',
  task_package_ready: 'Tarea preparada para Claude Code',
  task_discarded: 'Tarea de Claude Code descartada',
  proposals_created: 'Propuestas creativas creadas',
  proposal_selected: 'Propuesta elegida',
  copy_created: 'Opciones de texto propuestas',
  copy_approved: 'Textos aprobados',
  slide_approved: 'Diapositiva aprobada',
  slide_unlocked: 'Aprobación de diapositiva retirada',
};
const REV_STATUS = { open: 'Abierta', in_progress: 'En curso', awaiting_claude_code: 'Esperando Claude Code', applied: 'Aplicada', failed: 'Falló' } as const;
const label = (a: string) => ACTIONS[a] ?? (a.startsWith('job_') ? (a.endsWith('_failed') ? 'Trabajo fallido' : 'Trabajo iniciado') : a);

export function PublicationPage({ id, data }: { id: number; data: AppData }) {
  const [d, setD] = useState<PublicationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [modal, setModal] = useState<null | 'brief' | 'edit' | 'changes' | 'design' | 'slide' | 'approve' | 'delete'>(null);
  const [productSheet, setProductSheet] = useState<Product | null>(null);
  const [designSlide, setDesignSlide] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(() => api.publication(id).then(setD).catch((e) => setError(e.message)), [id]);
  useEffect(() => {
    load();
  }, [load]);

  const job = d?.jobs[0];
  const active = !!job && (job.status === 'pending' || job.status === 'running');
  const waitingImport = !!job && job.outcome === 'task_package' && !job.task_ready;
  // Poll while a job runs, and (slower) while waiting for Claude Code to write result.json.
  useEffect(() => {
    if (!active && !waitingImport) return;
    const t = setInterval(load, active ? 1200 : 4000);
    return () => clearInterval(t);
  }, [active, waitingImport, load]);

  // Follow the current version (or the newest, e.g. a fresh round of proposals) when one is created.
  const newest = d?.versions[0]?.id;
  const currentId = d?.publication.current_version_id ?? null;
  useEffect(() => setSelected(currentId ?? newest ?? null), [newest, currentId]);

  if (error) return <div className="notice error">{error}</div>;
  if (!d) return <p className="muted">Cargando…</p>;

  const p = d.publication;
  const version = d.versions.find((v) => v.id === selected) ?? d.versions[0];
  // The current version is the one Jaime approves and downloads (a chosen proposal, or the latest carousel).
  const current = d.versions.find((v) => v.id === p.current_version_id) ?? d.versions[0];
  const designCurrent = current?.kind === 'design';
  const pendingChoice = !!d.versions[0] && d.versions[0].origin === 'proposal' && d.versions[0].proposal_set !== null && !d.versions.some((v) => v.proposal_set === d.versions[0].proposal_set && v.id === p.current_version_id);
  const manual = data.settings.ai_mode === 'claude_code';
  const generatable = GENERATABLE_FORMATS.includes(p.format);
  const locked = ['approved', 'scheduled', 'published'].includes(p.status);
  const showJob = job && !(job.status === 'completed' && (job.outcome === 'version' || job.outcome === 'copy' || job.outcome === 'discarded'));
  // Step 1 (texts) comes before step 2 (visual proposals) and the classic generation.
  const needsCopy = generatable && !p.approved_copy;
  const step = needsCopy ? 1 : !current ? 2 : 3;
  const blockedTitle = !generatable ? 'Solo para carrusel e imagen única' : locked ? 'Ya aprobada' : needsCopy ? 'Primero aprueba los textos (paso 1 · Mensaje)' : job?.outcome === 'task_package' ? 'Hay una tarea de Claude Code pendiente de importar' : undefined;

  const act = async (fn: () => Promise<PublicationDetail>, ok?: string) => {
    setBusy(true);
    try {
      setD(await fn());
      if (ok) toast(ok);
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const upload = async (files: FileList | null) => {
    for (const f of files ?? []) await act(() => api.upload(p.id, f), `${f.name} añadido`);
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <>
      <div className="crumbs">
        <a href="#/">← Calendario</a>
      </div>
      <div className="pub-head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>{p.topic}</h1>
          <div className="meta">
            <StatusBadge status={p.status} />
            <BrandTag brand={d.brand} />
            <span>{longDate(p.date)}</span>
            <span>· {FORMATS[p.format]}{p.format === 'carousel' ? ` de ${p.slide_count}` : ''}</span>
          </div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => setModal('brief')}>Editar brief</button>
          <button
            className="btn primary"
            disabled={!generatable || needsCopy || active || locked || busy || job?.outcome === 'task_package'}
            title={blockedTitle ?? 'Tres direcciones de arte con los textos aprobados'}
            onClick={() => act(() => api.proposals(p.id), manual ? 'Preparando las propuestas…' : 'Creando tres propuestas…')}
          >
            2 · {d.versions.some((v) => v.origin === 'proposal') ? 'Nuevas propuestas creativas' : 'Propuestas creativas'}
          </button>
          <button
            className="btn"
            disabled={!generatable || needsCopy || active || locked || busy || job?.outcome === 'task_package'}
            title={blockedTitle ?? 'Carrusel con los layouts clásicos y los textos aprobados'}
            onClick={() => act(() => api.generate(p.id), manual ? 'Preparando el contenido…' : 'Generación iniciada')}
          >
            {current ? 'Generar de nuevo (clásico)' : 'Generar clásico'}
          </button>
        </div>
      </div>

      {generatable && (
        <ol className="stepper" aria-label="Proceso">
          {['Mensaje: elegir los textos', 'Estilo: propuestas visuales', 'Ajustes y aprobación'].map((x, i) => (
            <li key={x} className={i + 1 < step ? 'done' : i + 1 === step ? 'now' : ''} aria-current={i + 1 === step ? 'step' : undefined}>
              <b>{i + 1 < step ? '✓' : i + 1}</b> {x}
            </li>
          ))}
        </ol>
      )}

      <div className="pub-layout">
        <div>
          {showJob && <JobPanel job={job!} onChange={setD} />}
          {generatable && (!locked || p.approved_copy) && (
            <div style={{ marginTop: showJob ? 16 : 0, marginBottom: 16 }}>
              <CopyStep d={d} manual={manual} disabled={locked || active || job?.outcome === 'task_package'} onChange={setD} />
            </div>
          )}
          <div style={{ marginTop: showJob ? 16 : 0 }}>
            <ProposalsPanel
              versions={d.versions} currentId={p.current_version_id} viewing={version?.id ?? null} locked={locked} busy={busy || active}
              onView={(vid) => (setSelected(vid), document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth' }))}
              onSelect={(vid) => act(() => api.selectVersion(vid), 'Propuesta elegida')}
            />
          </div>
          {version ? (
            <div style={{ marginTop: 16 }}>
              <CarouselViewer
                version={version} versions={d.versions} onSelect={setSelected} isCurrent={version.id === current.id} currentId={p.current_version_id}
                onRegenerate={!locked && !active && job?.outcome !== 'task_package' ? (n) => (setDesignSlide(n), setModal('design')) : undefined}
                actions={designCurrent && !locked && version.id === current.id ? {
                  busy: busy || active,
                  onLock: (n, on) => act(() => api.lockSlide(version.id, n, on), on ? `Diapositiva ${n} aprobada: ninguna revisión la cambiará` : `Diapositiva ${n} desbloqueada`),
                  onEdit: (n) => (setDesignSlide(n), setModal('slide')),
                  onComment: (n) => (setDesignSlide(n), setModal('design')),
                  onReplace: (n, from, k) => act(() => api.replaceSlide(version.id, n, from, k), `Trayendo la diapositiva ${k}…`),
                } : undefined}
              />
              {locked && version.id === current.id && (
                <div style={{ marginTop: 16 }}>
                  <StoriesPanel
                    version={version} busy={busy} running={active && job?.kind === 'story'}
                    onRender={() => act(() => api.stories(version.id), 'Generando historias…')}
                  />
                </div>
              )}
            </div>
          ) : (
            !showJob && !generatable && (
              <section className="card empty">
                <h2 style={{ marginBottom: 8 }}>Aún no hay diseños</h2>
                <p>
                  {needsCopy
                    ? <>Empieza por el <b>paso 1 · Mensaje</b>: elige los textos. Después pulsa <b>Propuestas creativas</b> para ver tres estilos con esos textos.</>
                    : <>Textos aprobados. Pulsa <b>Propuestas creativas</b> para ver tres estilos con esos textos.</>}
                  {manual && ' Sin clave de API, cada paso prepara una tarea para ejecutar en Claude Code.'}
                </p>
                {!generatable && <p className="small">El formato {FORMATS[p.format]} se planifica aquí, pero aún no se genera automáticamente.</p>}
              </section>
            )
          )}
        </div>

        <aside>
          {current && (
            <section className="card">
              <h2>Revisión</h2>
              {p.status === 'ready_for_review' && (
                <p className="small muted" style={{ marginTop: 0 }}>
                  Versión actual: v{current.number}. Revísala y apruébala, o pide cambios.
                </p>
              )}
              <div className="row">
                {!locked && !designCurrent && (
                  <>
                    <button className="btn" disabled={active || busy} onClick={() => setModal('edit')}>Editar textos</button>
                    <button className="btn" disabled={active || busy || job?.outcome === 'task_package'} onClick={() => setModal('changes')}>Solicitar cambios</button>
                  </>
                )}
                {!locked && designCurrent && (
                  <button className="btn" disabled={active || busy || job?.outcome === 'task_package'} onClick={() => (setDesignSlide(null), setModal('design'))}>Solicitar cambios</button>
                )}
                {pendingChoice && <p className="small muted" style={{ margin: 0 }}>Hay propuestas nuevas: elige una para aprobarla.</p>}
                {p.status === 'ready_for_review' && (
                  <button className="btn dark" disabled={active || busy || version?.id !== current.id} onClick={() => setModal('approve')}>
                    ✓ Aprobar v{current.number}
                  </button>
                )}
              </div>
              {locked && (
                <>
                  <div className="row" style={{ marginTop: 4 }}>
                    {p.status === 'approved' && (
                      <>
                        <button className="btn" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'scheduled'), 'Marcada como programada')}>Marcar como programada</button>
                        <button className="btn" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'published'), 'Marcada como publicada')}>Marcar como publicada</button>
                        <button className="btn ghost" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'ready_for_review'), 'Aprobación revocada')}>Revocar aprobación</button>
                      </>
                    )}
                    {p.status === 'scheduled' && (
                      <>
                        <button className="btn" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'published'), 'Marcada como publicada')}>Marcar como publicada</button>
                        <button className="btn ghost" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'approved'))}>Volver a aprobada</button>
                      </>
                    )}
                    {p.status === 'published' && (
                      <button className="btn ghost" disabled={busy} onClick={() => act(() => api.setStatus(p.id, 'scheduled'))}>Volver a programada</button>
                    )}
                  </div>
                  <p className="small muted" style={{ marginBottom: 0 }}>
                    Estos estados son solo de seguimiento: la aplicación no programa ni publica en redes sociales.
                  </p>
                </>
              )}
            </section>
          )}

          <section className="card">
            <h2>Brief</h2>
            <dl className="brief">
              <dt>Objetivo</dt>
              <dd>{p.objective}</dd>
              <dt>Productos</dt>
              <dd>
                {d.products.length
                  ? d.products.map((x) => (
                      <div key={x.id}>
                        {x.name} {x.review_status === 'pending_review' && <span className="tag warn">pendiente de revisión</span>}
                        {x.source === 'user' && (
                          <button className="btn sm" style={{ marginLeft: 8 }} onClick={() => setProductSheet(x)}>Completar ficha</button>
                        )}
                      </div>
                    ))
                  : '—'}
              </dd>
              {p.deadline && (
                <>
                  <dt>Producción</dt>
                  <dd>{longDate(p.deadline)}</dd>
                </>
              )}
              {p.brief?.audience && (<><dt>Audiencia</dt><dd>{p.brief.audience}</dd></>)}
              {p.brief?.angle && (<><dt>Ventaja principal</dt><dd>{p.brief.angle}</dd></>)}
              {p.brief?.tone && (<><dt>Tono</dt><dd>{p.brief.tone}</dd></>)}
              {p.brief?.avoid && (<><dt>Evitar</dt><dd>{p.brief.avoid}</dd></>)}
              <dt>Instrucciones</dt>
              <dd>{p.creative_instructions || '—'}</dd>
            </dl>
          </section>

          <section className="card">
            <div className="section-title">
              <h2>Archivos</h2>
              <span className="spacer" />
              <button className="btn sm" onClick={() => fileInput.current?.click()} disabled={busy}>+ Añadir</button>
              <input ref={fileInput} type="file" multiple hidden accept=".pdf,.md,.txt,.png,.jpg,.jpeg,.webp" onChange={(e) => upload(e.target.files)} />
            </div>
            {d.attachments.length === 0 && <p className="small muted" style={{ margin: 0 }}>Documentos de apoyo e imágenes adicionales para esta publicación.</p>}
            <ul className="list small" style={{ paddingLeft: 0, listStyle: 'none' }}>
              {d.attachments.map((a) => (
                <li key={a.id} className="row">
                  <span className="tag">{a.kind === 'image' ? 'Imagen' : 'Documento'}</span>
                  <a href={`/api/attachments/${a.id}/file`} target="_blank" rel="noreferrer" style={{ overflowWrap: 'anywhere' }}>{a.filename}</a>
                  <span className="spacer" />
                  <button className="btn ghost sm danger" onClick={() => act(() => api.deleteAttachment(a.id))} aria-label={`Quitar ${a.filename}`}>✕</button>
                </li>
              ))}
            </ul>
          </section>

          {d.revisions.length > 0 && (
            <section className="card">
              <h2>Solicitudes de cambio</h2>
              <ul className="timeline">
                {d.revisions.map((r) => (
                  <li key={r.id}>
                    <time>
                      {dateTime(r.created_at)} · {REVISION_TARGETS[r.target]}
                      {r.slide_number ? ` · diapositiva ${r.slide_number}` : ''} · {REV_STATUS[r.status]}
                    </time>
                    «{r.instruction}»
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card">
            <h2>Historial</h2>
            <ul className="timeline">
              {d.history.filter((h) => !/^job_\w+_started$/.test(h.action)).map((h) => (
                <li key={h.id}>
                  <time>{dateTime(h.created_at)}</time>
                  <b>{label(h.action)}</b>
                  {h.to_status && h.from_status !== h.to_status && h.from_status !== 'generating' && STATUS_LABELS[h.to_status] !== label(h.action) && ` → ${STATUS_LABELS[h.to_status]}`}
                  {h.note && <div className="small muted">{h.note}</div>}
                </li>
              ))}
            </ul>
            <button className="btn ghost sm danger" style={{ marginTop: 8 }} onClick={() => setModal('delete')} disabled={active}>Eliminar publicación</button>
          </section>
        </aside>
      </div>

      {productSheet && (
        <NewProduct product={productSheet} onClose={() => setProductSheet(null)} onCreated={() => (setProductSheet(null), load())} />
      )}
      {modal === 'brief' && (
        <PublicationForm
          data={data}
          initial={p}
          files={false}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            toast('Brief actualizado');
            load();
          }}
        />
      )}
      {modal === 'edit' && current && <EditTexts version={current} onClose={() => setModal(null)} onSaved={(x) => (setD(x), setModal(null))} />}
      {modal === 'design' && current?.kind === 'design' && (
        <DesignChanges version={current} manual={manual} slide={designSlide} onClose={() => setModal(null)} onSaved={(x) => (setD(x), setModal(null))} />
      )}
      {modal === 'slide' && current?.kind === 'design' && designSlide && (
        <SlideEditor version={current} slide={designSlide} onClose={() => setModal(null)} onSaved={(x) => (setD(x), setModal(null))} />
      )}
      {modal === 'changes' && current && (
        <RequestChanges version={current} manual={manual} onClose={() => setModal(null)} onSaved={(x) => (setD(x), setModal(null))} onEditTexts={() => setModal('edit')} />
      )}
      {modal === 'approve' && current && (
        <Modal
          title={`Aprobar versión ${current.number}`}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn dark" disabled={busy} onClick={() =>
                  act(async () => {
                    // A proposal that was never chosen (e.g. revised without "Elegir") is chosen first: approving it is explicit.
                    if (p.current_version_id !== current.id) await api.selectVersion(current.id);
                    return api.approve(p.id, current.id);
                  }, 'Publicación aprobada').then(() => setModal(null))
                }>
                ✓ Aprobar
              </button>
            </>
          }
        >
          <p style={{ marginTop: 0 }}>
            Confirmas que la versión {current.number} ({current.slides.length} diapositivas y caption) está lista para publicarse.
          </p>
          {p.current_version_id !== current.id && (
            <div className="notice info">Esta versión todavía no estaba elegida: al aprobarla queda elegida como la versión actual.</div>
          )}
          {current.validation.problems.length > 0 && (
            <div className="notice warn">La validación detectó {current.validation.problems.length} problema(s). Revísalos antes de aprobar.</div>
          )}
          <p className="small muted">La aprobación queda registrada en el historial. No se publica nada automáticamente.</p>
        </Modal>
      )}
      {modal === 'delete' && (
        <Modal
          title="Eliminar publicación"
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn" onClick={() => setModal(null)}>Cancelar</button>
              <button
                className="btn danger"
                onClick={() =>
                  api.deletePublication(p.id).then(() => {
                    toast('Publicación eliminada');
                    location.hash = '#/';
                  }, (e) => toast(e.message, true))
                }
              >
                Eliminar
              </button>
            </>
          }
        >
          <p style={{ marginTop: 0 }}>
            Se eliminará «{p.topic}» del calendario junto con su historial. Los archivos de imagen generados permanecen en la carpeta de datos.
          </p>
        </Modal>
      )}
    </>
  );
}
