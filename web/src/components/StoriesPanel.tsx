// Story (9:16, 1080 × 1920) versions of the approved carousel, made automatically on approval.
import type { Version } from '../../../shared/types.ts';

export function StoriesPanel({ version, running, busy, onRender }: { version: Version; running: boolean; busy: boolean; onRender: () => void }) {
  const st = version.story;
  return (
    <section className="card" id="stories">
      <div className="section-title">
        <h2>Historias</h2>
        <span className="small muted">1080 × 1920 · 9:16</span>
        <span className="spacer" />
        {!running && (
          <button className="btn sm" disabled={busy} onClick={onRender}>{st ? 'Volver a generar' : 'Generar historias'}</button>
        )}
      </div>
      {running && <p className="small muted" style={{ margin: 0 }}>Adaptando el carrusel aprobado al formato de historias…</p>}
      {!running && !st && <p className="small muted" style={{ margin: 0 }}>Aún no hay historias para esta versión.</p>}
      {st && (
        <>
          <p className="small muted" style={{ marginTop: 0 }}>
            El mismo diseño del carrusel, redistribuido en 1080 × 1920 y con los textos dentro de la zona segura de las historias.
            Se incluyen en el ZIP del carrusel (carpeta <b>historias</b>).
          </p>
          <div className="stories">
            {st.slides.map((s, i) => (
              <figure key={s.file}>
                <img src={`${version.dir}/historias/${s.file}?t=${encodeURIComponent(st.created_at)}`} alt={`Historia ${i + 1}: ${version.content.slides[i]?.alt ?? ''}`} loading="lazy" />
                <figcaption className="row small">
                  Historia {i + 1}
                  <span className="spacer" />
                  <a className="btn sm" href={`/api/versions/${version.id}/stories/${i + 1}/download`}>Descargar</a>
                </figcaption>
              </figure>
            ))}
          </div>
          {st.problems.length > 0 && (
            <div className="notice warn" style={{ marginTop: 12 }}>
              Revisión manual: {st.problems.join(' · ')}
            </div>
          )}
        </>
      )}
    </section>
  );
}
