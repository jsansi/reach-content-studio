// Slides of one version, downloads, caption, validation and sources.
import { useEffect, useState } from 'react';
import { Modal, useToast } from '../ui.tsx';
import type { Version } from '../../../shared/types.ts';

const ORIGIN = { import: 'Importada del POC', generation: 'Generada', manual_edit: 'Edición directa', revision: 'Revisión', proposal: 'Propuesta creativa' } as const;
const vlabel = (x: Version) => `v${x.number}${x.direction ? ` · ${x.direction}` : ''}`;
const provider = (p: string) =>
  p === 'poc' ? 'POC original, sin regenerar' : p === 'manual' ? 'sin IA' : p === 'claude_code' ? 'Claude Code' : p.startsWith('anthropic_api:') ? `API de Anthropic (${p.slice(14)})` : p;
const APPROVAL = { approved_claim: 'Aprobada', manufacturer_description: 'Descripción del fabricante (sin aprobación clínica)', general_statement: 'Dato general' } as const;

// Step 3 on the chosen design proposal: approve slides one by one, adjust texts without AI, comment a slide, and
// drag a slide from another version onto one of these (or pick it and press "Usar aquí").
export interface SlideActions {
  busy: boolean;
  onLock: (slide: number, locked: boolean) => void;
  onEdit: (slide: number) => void;
  onComment: (slide: number) => void;
  onReplace: (slide: number, fromVersionId: number, fromSlide: number) => void;
}
type Pick = { versionId: number; slide: number };

export function CarouselViewer({
  version, versions, onSelect, isCurrent, currentId, onRegenerate, actions,
}: {
  version: Version;
  versions: Version[];
  onSelect: (id: number) => void;
  isCurrent: boolean;
  currentId?: number | null;
  onRegenerate?: (slide: number) => void; // design proposals: ask for another composition of one slide
  actions?: SlideActions; // only on the current design version while it can still change
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [tray, setTray] = useState<number | null>(null);
  const [pick, setPick] = useState<Pick | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [pending, setPending] = useState<{ slide: number; from: Pick } | null>(null);
  const locked = version.design?.locked_slides ?? [];
  const sources = versions.filter((x) => x.kind === 'design' && x.id !== version.id);
  const source = sources.find((x) => x.id === tray) ?? null;
  const vlab = (id: number) => { const x = versions.find((y) => y.id === id); return x ? vlabel(x) : `#${id}`; };
  const drop = (slide: number, from: Pick) => {
    setOver(null);
    setPick(null);
    if (!locked.includes(slide)) setPending({ slide, from });
  };
  const fromVersion = pending ? versions.find((x) => x.id === pending.from.versionId) : null;
  const [compare, setCompare] = useState<number | null>(null);
  const other = versions.find((x) => x.id === compare && x.id !== version.id) ?? null;
  const toast = useToast();
  const src = (file: string) => `${version.dir}/${file}?v=${version.id}`;

  useEffect(() => {
    if (zoom === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null);
      if (e.key === 'ArrowRight') setZoom((z) => Math.min((z ?? 0) + 1, version.slides.length - 1));
      if (e.key === 'ArrowLeft') setZoom((z) => Math.max((z ?? 0) - 1, 0));
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [zoom, version.slides.length]);

  const v = version.validation;
  return (
    <section className="card" id="viewer">
      <div className="section-title">
        <h2>Carrusel</h2>
        <span className="spacer" />
        <a className="btn primary sm" href={`/api/versions/${version.id}/zip`}>Descargar carrusel (ZIP)</a>
      </div>
      <div className="row" style={{ marginBottom: 4 }}>
        <span className="small muted">Versiones:</span>
        <div className="versions" role="group" aria-label="Versiones">
          {versions.map((x) => (
            <button key={x.id} aria-pressed={x.id === version.id} onClick={() => onSelect(x.id)} title={`${ORIGIN[x.origin]} · ${x.created_at}`}>
              {vlabel(x)}
              {x.id === (currentId ?? versions[0]?.id) ? ' · actual' : ''}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <label className="small muted row">
          Comparar con
          <select value={compare ?? ''} onChange={(e) => setCompare(e.target.value ? Number(e.target.value) : null)}>
            <option value="">—</option>
            {versions.filter((x) => x.id !== version.id).map((x) => (
              <option key={x.id} value={x.id}>{vlabel(x)} · {ORIGIN[x.origin]}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="small muted" style={{ margin: '6px 0 0' }}>
        {version.design && <b>Propuesta {version.design.direction} · {version.design.direction_name} · </b>}
        {ORIGIN[version.origin]} · {provider(version.provider)}
        {!isCurrent && ' · no es la versión actual (solo lectura)'}
        {version.notes && ` · ${version.notes}`}
      </p>

      {actions && (
        <div className="adjust-bar">
          <p className="small" style={{ margin: 0 }}>
            <b>Ajustes sin IA.</b> Aprueba las diapositivas que ya estén listas (ninguna revisión las cambia), ajusta textos al momento
            o trae una diapositiva de otra versión arrastrándola sobre la que quieres reemplazar.
          </p>
          <label className="small row">
            Traer de
            <select value={tray ?? ''} onChange={(e) => (setTray(e.target.value ? Number(e.target.value) : null), setPick(null))} disabled={!sources.length}>
              <option value="">{sources.length ? 'elige una versión…' : 'no hay otras versiones'}</option>
              {sources.map((x) => <option key={x.id} value={x.id}>{vlabel(x)} · {ORIGIN[x.origin]}</option>)}
            </select>
          </label>
          {source && (
            <div className="tray" aria-label={`Diapositivas de la ${vlabel(source)}`}>
              {source.slides.map((s, i) => {
                const me = pick?.versionId === source.id && pick.slide === i + 1;
                return (
                  <button
                    key={s.file} className={`tray-item${me ? ' picked' : ''}`} draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/x-reach-slide', JSON.stringify({ versionId: source.id, slide: i + 1 }))}
                    onClick={() => setPick(me ? null : { versionId: source.id, slide: i + 1 })}
                    title="Arrástrala sobre una diapositiva de abajo, o pulsa y luego «Usar aquí»"
                  >
                    <img src={`${source.dir}/${s.file}?v=${source.id}`} alt={source.design?.slides[i]?.alt ?? `Diapositiva ${i + 1}`} loading="lazy" />
                    <span>{i + 1}</span>
                  </button>
                );
              })}
            </div>
          )}
          {pick && <p className="small" style={{ margin: 0 }}>Elegida: diapositiva {pick.slide} de la {vlab(pick.versionId)}. Pulsa <b>Usar aquí</b> en la diapositiva que quieres reemplazar.</p>}
        </div>
      )}

      <div className="slides">
        {version.slides.map((s, i) => {
          const n = i + 1;
          const isLocked = locked.includes(n);
          return (
          <figure
            className={`slide${isLocked ? ' locked' : ''}${over === n ? ' drop-over' : ''}`} key={s.file}
            onDragOver={actions && !isLocked ? (e) => (e.preventDefault(), setOver(n)) : undefined}
            onDragLeave={actions ? () => setOver(null) : undefined}
            onDrop={actions && !isLocked ? (e) => { e.preventDefault(); const raw = e.dataTransfer.getData('application/x-reach-slide'); if (raw) drop(n, JSON.parse(raw)); } : undefined}
          >
            <button className="img" onClick={() => setZoom(i)} aria-label={`Ampliar diapositiva ${n}`}>
              <img src={src(s.file)} alt={(version.content.slides[i] as { alt?: string })?.alt ?? `Diapositiva ${n}`} loading="lazy" />
              {isLocked && <span className="lock-badge">✓ Aprobada</span>}
            </button>
            <figcaption>
              <span>
                {n} · {s.width}×{s.height}
              </span>
              {!s.rendered && version.parent_version_id && <span className="tag" title="Copiada sin cambios de la versión anterior">sin cambios</span>}
              <span className="spacer" />
              {onRegenerate && isCurrent && version.kind === 'design' && !isLocked && (
                <button className="btn sm ghost" onClick={() => onRegenerate(n)} title="Otra composición para esta diapositiva; las demás no cambian">Regenerar</button>
              )}
              <a className="btn sm" href={`/api/versions/${version.id}/slides/${n}/download`}>Descargar</a>
            </figcaption>
            {actions && (
              <div className="slide-actions">
                <button className={`btn sm${isLocked ? '' : ' dark'}`} disabled={actions.busy} onClick={() => actions.onLock(n, !isLocked)}>
                  {isLocked ? 'Quitar aprobación' : '✓ Aprobar diapositiva'}
                </button>
                {!isLocked && (
                  <>
                    <button className="btn sm" disabled={actions.busy} onClick={() => actions.onEdit(n)}>Ajustar textos</button>
                    <button className="btn sm" disabled={actions.busy} onClick={() => actions.onComment(n)}>Comentar</button>
                    {pick && <button className="btn sm primary" disabled={actions.busy} onClick={() => drop(n, pick)}>Usar aquí</button>}
                  </>
                )}
              </div>
            )}
            {version.validation.design?.slides[i]?.length ? (
              <div className="small" style={{ color: 'var(--warn-ink)', marginTop: 4 }}>⚠ {version.validation.design.slides[i].join(' · ')}</div>
            ) : null}
          </figure>
          );
        })}
      </div>
      {other && (
        <>
          <h3 style={{ margin: '0 0 4px' }}>Comparación: {vlabel(other)} · {ORIGIN[other.origin]}</h3>
          <div className="slides compare">
            {other.slides.map((s, i) => (
              <figure className="slide" key={s.file}>
                <button className="img" onClick={() => onSelect(other.id)} aria-label={`Abrir ${vlabel(other)}`}>
                  <img src={`${other.dir}/${s.file}?v=${other.id}`} alt={(other.content.slides[i] as { alt?: string })?.alt ?? `Diapositiva ${i + 1}`} loading="lazy" />
                </button>
                <figcaption>{i + 1}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      <div className="section-title" style={{ marginTop: 8 }}>
        <h3>Caption</h3>
        <span className="small muted">{version.caption.length} caracteres</span>
        <span className="spacer" />
        <button className="btn sm" onClick={() => navigator.clipboard.writeText(version.caption).then(() => toast('Caption copiado'))}>Copiar</button>
      </div>
      <div className="caption-box">{version.caption}</div>

      {v.design ? (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Validación visual</h3>
          {v.design.status === 'passed' ? (
            <div className="notice info">✓ Sin desbordes, solapes, palabras cortadas, problemas de contraste ni de logo; tipografía Noto Sans, colores BTL y texto ≥ 30 px.</div>
          ) : (
            <div className="notice warn">⚠ Requiere revisión manual: no se pudo corregir automáticamente. No la apruebes sin revisar estos puntos.</div>
          )}
          {v.problems.map((p) => (
            <div key={p} className="notice error">✕ {p}</div>
          ))}
          {v.design.autofixes.length > 0 && <p className="small muted">Correcciones automáticas aplicadas: {v.design.autofixes.join(' · ')}</p>}
          {v.notes.length > 0 && <ul className="list muted" style={{ marginTop: 8 }}>{v.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
          <h3 style={{ margin: '16px 0 8px' }}>Verificación de afirmaciones y marca</h3>
          {!v.claim_checks?.problems.length && <div className="notice info">✓ Sin afirmaciones sin fuente, nombres de marca incorrectos ni términos excluidos.</div>}
          {v.claim_checks?.problems.map((p) => <div key={p} className="notice error">✕ {p}</div>)}
          {(v.claim_checks?.notes.length ?? 0) > 0 && <ul className="list muted" style={{ marginTop: 8 }}>{v.claim_checks!.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
        </div>
      ) : (
      <div style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Validación</h3>
        {v.status === 'passed' && <div className="notice info">✓ Sin problemas de layout (desbordes, solapamientos, zona del logo, texto mínimo de 30 px) ni de marca.</div>}
        {v.status === 'not_run' && <div className="notice info">Versión importada: no se volvió a renderizar ni validar automáticamente.</div>}
        {v.problems.map((p) => (
          <div key={p} className="notice error">✕ {p}</div>
        ))}
        {v.notes.length > 0 && (
          <ul className="list muted" style={{ marginTop: 8 }}>
            {v.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
      )}

      <details style={{ marginTop: 12 }}>
        <summary>Fuentes y afirmaciones ({version.sources.length + version.claims.length})</summary>
        {version.concept && (
          <p className="small">
            <b>Concepto:</b> {version.concept}
          </p>
        )}
        <h3 style={{ margin: '8px 0 4px' }}>Documentos utilizados</h3>
        <ul className="list small">
          {version.sources.map((s) => (
            <li key={s} className="mono">{s}</li>
          ))}
        </ul>
        {version.claims.length > 0 && (
          <>
            <h3 style={{ margin: '12px 0 4px' }}>Afirmaciones y su fuente</h3>
            <ul className="list small">
              {version.claims.map((c, i) => (
                <li key={i}>
                  «{c.claim}» — {c.location} · <span className="mono">{c.source}</span> ·{' '}
                  <span className={c.approval === 'approved_claim' ? 'tag' : 'tag warn'}>{APPROVAL[c.approval]}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {version.prompt_versions && (
          <>
            <h3 style={{ margin: '12px 0 4px' }}>Versiones de prompts</h3>
            <ul className="list small mono">
              {Object.entries(version.prompt_versions).map(([k, x]) => (
                <li key={k}>
                  {k} {x}
                </li>
              ))}
            </ul>
          </>
        )}
      </details>

      {pending && fromVersion && (
        <Modal
          title={`Reemplazar la diapositiva ${pending.slide}`}
          onClose={() => setPending(null)}
          footer={
            <>
              <button className="btn" onClick={() => setPending(null)}>Cancelar</button>
              <button className="btn primary" onClick={() => (actions!.onReplace(pending.slide, pending.from.versionId, pending.from.slide), setPending(null))}>Reemplazar</button>
            </>
          }
        >
          <div className="swap-preview">
            <figure>
              <img src={src(version.slides[pending.slide - 1].file)} alt="" />
              <figcaption className="small muted">Ahora · {vlabel(version)} · diapositiva {pending.slide}</figcaption>
            </figure>
            <span aria-hidden="true">→</span>
            <figure>
              <img src={`${fromVersion.dir}/${fromVersion.slides[pending.from.slide - 1].file}?v=${fromVersion.id}`} alt="" />
              <figcaption className="small muted">Se trae de {vlabel(fromVersion)} · diapositiva {pending.from.slide}</figcaption>
            </figure>
          </div>
          <p className="small muted" style={{ marginBottom: 0 }}>Sin IA: se crea una versión nueva con esa diapositiva (y sus afirmaciones); las demás no cambian y la versión actual se conserva.</p>
        </Modal>
      )}

      {zoom !== null && (
        <div className="lightbox" onClick={(e) => e.target === e.currentTarget && setZoom(null)} role="dialog" aria-label={`Diapositiva ${zoom + 1}`}>
          <img src={src(version.slides[zoom].file)} alt={(version.content.slides[zoom] as { alt?: string })?.alt ?? ''} />
          <div className="row">
            <a className="btn sm" href={`/api/versions/${version.id}/slides/${zoom + 1}/download`}>Descargar</a>
            <button className="btn sm" onClick={() => setZoom(null)}>Cerrar ✕</button>
          </div>
          {zoom > 0 && <button className="btn nav prev" onClick={() => setZoom(zoom - 1)} aria-label="Anterior">‹</button>}
          {zoom < version.slides.length - 1 && <button className="btn nav next" onClick={() => setZoom(zoom + 1)} aria-label="Siguiente">›</button>}
        </div>
      )}
    </section>
  );
}
