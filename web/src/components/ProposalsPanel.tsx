// The three creative proposals of a round, side by side: preview, validation state, and "elegir".
// Earlier rounds stay available from the round selector; nothing is deleted.
import { useState } from 'react';
import type { Version } from '../../../shared/types.ts';

export function ProposalsPanel({
  versions, currentId, viewing, locked, busy, onView, onSelect,
}: {
  versions: Version[];
  currentId: number | null;
  viewing: number | null;
  locked: boolean;
  busy: boolean;
  onView: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  const sets = [...new Set(versions.filter((v) => v.origin === 'proposal' && v.proposal_set !== null).map((v) => v.proposal_set!))].sort((a, b) => b - a);
  const [set, setSet] = useState<number | null>(null);
  if (!sets.length) return null;
  const active = set ?? sets[0];
  const round = versions.filter((v) => v.proposal_set === active && v.origin === 'proposal').sort((a, b) => (a.direction ?? '').localeCompare(b.direction ?? ''));
  // Latest revision of each proposal in this round (revisions keep the set and the direction).
  const latest = (v: Version) => versions.filter((x) => x.proposal_set === active && x.direction === v.direction).sort((a, b) => b.number - a.number)[0];
  const chosen = versions.find((v) => v.id === currentId && v.proposal_set === active);

  return (
    <section className="card" id="proposals">
      <div className="section-title">
        <h2>Propuestas creativas</h2>
        <span className="spacer" />
        {sets.length > 1 && (
          <div className="versions" role="group" aria-label="Rondas de propuestas">
            {sets.map((s, i) => (
              <button key={s} aria-pressed={s === active} onClick={() => setSet(s)}>Ronda {sets.length - i}</button>
            ))}
          </div>
        )}
      </div>
      <p className="small muted" style={{ marginTop: 0 }}>
        Tres direcciones de arte para la misma publicación, compuestas con el sistema de diseño BTL y validadas automáticamente.
        {chosen ? ` Elegida: propuesta ${chosen.direction} (v${chosen.number}).` : ' Elige una para revisarla, pedir cambios y aprobarla.'}
      </p>
      <div className="proposals">
        {round.map((first) => {
          const v = latest(first);
          const d = v.design!;
          const review = v.validation.design?.status === 'needs_review';
          const claims = v.validation.claim_checks?.problems.length ?? 0;
          const isChosen = v.id === currentId;
          return (
            <article key={first.id} className={`proposal${isChosen ? ' chosen' : ''}${viewing === v.id ? ' viewing' : ''}`}>
              <header>
                <span className="dir">{d.direction}</span>
                <div>
                  <h3>{d.direction_name}</h3>
                  <span className="small muted">v{v.number}{v.id !== first.id ? ` · revisión de v${first.number}` : ''}</span>
                </div>
              </header>
              <button className="strip" onClick={() => onView(v.id)} aria-label={`Ver la propuesta ${d.direction} completa`}>
                {v.slides.map((s, i) => (
                  <img key={s.file} src={`${v.dir}/${s.file}?v=${v.id}`} alt={d.slides[i]?.alt ?? `Diapositiva ${i + 1}`} loading="lazy" />
                ))}
              </button>
              <p className="small">{d.concept}</p>
              <details className="small">
                <summary>En qué se diferencia</summary>
                <p style={{ margin: '4px 0 0' }}>{d.differentiation}</p>
              </details>
              <div className="row" style={{ marginTop: 6 }}>
                {review ? <span className="tag warn">⚠ Revisión manual</span> : <span className="tag ok">✓ Validación visual</span>}
                {claims > 0 && <span className="tag warn">{claims} aviso(s) de afirmaciones</span>}
                {(v.validation.design?.autofixes.length ?? 0) > 0 && <span className="tag">{v.validation.design!.autofixes.length} corrección(es) automática(s)</span>}
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn sm" onClick={() => onView(v.id)}>Ver en grande</button>
                {isChosen ? (
                  <span className="tag ok">Elegida</span>
                ) : (
                  <button className="btn sm primary" disabled={locked || busy} onClick={() => onSelect(v.id)}>Elegir esta propuesta</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
