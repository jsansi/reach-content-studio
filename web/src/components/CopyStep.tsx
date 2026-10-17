// Step 1 "Mensaje": text options per slide (fixed structure hook · equipo · ventajas), pick and edit one per slide,
// ask for more options for one slide with a comment, and approve the texts. Step 2 (visual proposals) uses them as is.
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.ts';
import { useToast } from '../ui.tsx';
import { narrative, type ApprovedSlide, type CopyPointT, type StoredCopyOption } from '../../../shared/structure.ts';
import type { PublicationDetail } from '../../../shared/types.ts';

type Pick = Omit<ApprovedSlide, 'role'> & { optionId: number | null };
const EXAMPLES = ['Más conectado con la ventaja para la clínica', 'Más corto', 'Menos técnico', 'Más intriga, sin revelar el equipo'];

const fromOption = (o: StoredCopyOption): Pick => ({ slide: o.slide, headline: o.headline, support: o.support, points: o.points.map((p) => ({ ...p })), claims: o.claims, optionId: o.id });

export function CopyStep({ d, manual, disabled, onChange }: { d: PublicationDetail; manual: boolean; disabled: boolean; onChange: (d: PublicationDetail) => void }) {
  const p = d.publication;
  const roles = narrative(p);
  const approved = p.approved_copy;
  const initial = useMemo(() => {
    const m: Record<number, Pick> = {};
    for (const s of approved?.slides ?? []) m[s.slide] = { ...s, points: s.points.map((x) => ({ ...x })), optionId: null };
    return m;
  }, [approved]);
  const [picks, setPicks] = useState<Record<number, Pick>>(initial);
  const [editing, setEditing] = useState(!approved);
  const [more, setMore] = useState<number | 'all' | null>(null);
  const [comment, setComment] = useState('');
  const [pref, setPref] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  useEffect(() => {
    setPicks(initial);
    setEditing(!approved);
  }, [initial, approved]);

  const options = (n: number) => d.copy_options.filter((o) => o.slide === n);
  const none = d.copy_options.length === 0;
  const complete = roles.every((_, i) => picks[i + 1]?.headline.trim());

  const act = async (fn: () => Promise<PublicationDetail>, ok: string) => {
    setBusy(true);
    try {
      onChange(await fn());
      toast(ok);
      return true;
    } catch (e) {
      toast((e as Error).message, true);
      return false;
    } finally {
      setBusy(false);
    }
  };
  const ask = async (slide: number | null) => {
    if (await act(() => api.copy(p.id, { slide, instruction: comment, save_as_preference: pref }), manual ? 'Se preparó la tarea para Claude Code.' : 'Escribiendo opciones…')) {
      setMore(null);
      setComment('');
      setPref(false);
    }
  };
  const update = (n: number, f: Partial<Pick>) => setPicks((x) => ({ ...x, [n]: { ...x[n], ...f, optionId: f.optionId ?? null } }));
  const setPoint = (n: number, i: number, f: Partial<CopyPointT>) => update(n, { points: picks[n].points.map((pt, j) => (j === i ? { ...pt, ...f } : pt)) });

  const moreForm = (slide: number | null) => (
    <div className="copy-more">
      <label className="field" style={{ marginBottom: 8 }}>
        <span>¿Qué no te convenció? <em>(opcional)</em></span>
        <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} autoFocus placeholder="Ej.: tiene que conectar con la ventaja para la clínica que compra el equipo" />
      </label>
      <div className="chips" style={{ marginBottom: 8 }}>
        {EXAMPLES.map((x) => (
          <button key={x} type="button" className="chip" onClick={() => setComment(x)}>{x}</button>
        ))}
      </div>
      <label className="row small" style={{ marginBottom: 8 }}>
        <input type="checkbox" checked={pref} disabled={!comment.trim()} onChange={(e) => setPref(e.target.checked)} />
        Guardar también como preferencia para futuras publicaciones de esta marca
      </label>
      <div className="row">
        <button className="btn primary sm" disabled={busy || disabled} onClick={() => ask(slide)}>
          {slide ? `Pedir más opciones para la diapositiva ${slide}` : 'Pedir opciones nuevas para todas'}
        </button>
        <button className="btn ghost sm" onClick={() => setMore(null)}>Cancelar</button>
      </div>
    </div>
  );

  return (
    <section className="card" id="copy">
      <div className="section-title">
        <h2>Paso 1 · Mensaje</h2>
        {approved && <span className="tag ok">✓ Textos aprobados</span>}
        <span className="spacer" />
        {approved && !editing && <button className="btn sm" disabled={disabled} onClick={() => setEditing(true)}>Cambiar textos</button>}
      </div>

      {!editing && approved ? (
        <>
          <ol className="copy-summary">
            {approved.slides.map((s) => (
              <li key={s.slide}>
                <span className="small muted">{roles[s.slide - 1]?.label}</span>
                <b>{s.headline}</b>
                {s.support && <span>{s.support}</span>}
                {s.points.length > 0 && <ul className="list small">{s.points.map((x, i) => <li key={i}><b>{x.title}</b> · {x.text}</li>)}</ul>}
              </li>
            ))}
          </ol>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Las propuestas creativas (paso 2) usan estos textos tal cual y solo cambian el diseño.
          </p>
        </>
      ) : none ? (
        <>
          <p style={{ marginTop: 0 }}>
            Primero eliges los textos y después el estilo. La app propone {roles.map((r) => `${r.options} opciones de ${r.label.toLowerCase()}`).join(', ')} según la estructura fija
            ({roles.map((r, i) => `${i + 1} ${r.label}`).join(' · ')}).
          </p>
          <button className="btn primary" disabled={disabled || busy} onClick={() => ask(null)}>Proponer textos</button>
          {manual && <p className="small muted">Sin clave de API se prepara una tarea para Claude Code (paso manual).</p>}
        </>
      ) : (
        <>
          <p className="small muted" style={{ marginTop: 0 }}>
            Elige un texto por diapositiva. Puedes editarlo. Si ninguno te convence, pide más opciones con un comentario.
          </p>
          {roles.map((r, i) => {
            const n = i + 1;
            const pick = picks[n];
            return (
              <div key={n} className="copy-slide">
                <div className="section-title" style={{ marginBottom: 6 }}>
                  <h3>{n} · {r.label}</h3>
                  <span className="small muted">{r.hint}</span>
                  <span className="spacer" />
                  <button className="btn ghost sm" disabled={disabled || busy} onClick={() => setMore(more === n ? null : n)}>+ Más opciones</button>
                </div>
                {more === n && moreForm(n)}
                <div className="copy-options" role="radiogroup" aria-label={`Opciones para la diapositiva ${n}`}>
                  {options(n).map((o) => (
                    <button key={o.id} role="radio" aria-checked={pick?.optionId === o.id} className="copy-opt" onClick={() => setPicks((x) => ({ ...x, [n]: fromOption(o) }))}>
                      <b>{o.headline}</b>
                      {o.support && <span>{o.support}</span>}
                      {o.points.length > 0 && <ul>{o.points.map((x, j) => <li key={j}><b>{x.title}</b> · {x.text}</li>)}</ul>}
                      {o.rationale && <small>{o.rationale}</small>}
                    </button>
                  ))}
                  {options(n).length === 0 && <p className="small muted">Sin opciones todavía para esta diapositiva.</p>}
                </div>
                {pick && (
                  <div className="copy-edit">
                    <span className="small muted">{pick.optionId ? 'Elegido · puedes editarlo' : 'Texto editado'}</span>
                    <textarea rows={Math.max(2, pick.headline.split('\n').length)} value={pick.headline} onChange={(e) => update(n, { headline: e.target.value })} aria-label={`Texto principal de la diapositiva ${n}`} />
                    <textarea rows={2} value={pick.support ?? ''} placeholder="Texto de apoyo (opcional)" onChange={(e) => update(n, { support: e.target.value || null })} aria-label={`Texto de apoyo de la diapositiva ${n}`} />
                    {pick.points.map((pt, j) => (
                      <div key={j} className="copy-point">
                        <input type="text" value={pt.title} maxLength={30} onChange={(e) => setPoint(n, j, { title: e.target.value })} aria-label={`Ventaja ${j + 1}`} />
                        <input type="text" value={pt.text} maxLength={70} onChange={(e) => setPoint(n, j, { text: e.target.value })} aria-label={`Texto de la ventaja ${j + 1}`} />
                        <button className="btn ghost sm" onClick={() => update(n, { points: pick.points.filter((_, k) => k !== j) })} aria-label={`Quitar la ventaja ${j + 1}`}>✕</button>
                      </div>
                    ))}
                    {(r.role === 'ventajas' || r.role === 'equipo') && pick.points.length < 3 && (
                      <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => update(n, { points: [...pick.points, { title: '', text: '' }] })}>+ Ventaja</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {more === 'all' && moreForm(null)}
          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn dark" disabled={!complete || disabled || busy}
              title={complete ? undefined : 'Elige un texto para cada diapositiva'}
              onClick={() => act(() => api.approveCopy(p.id, roles.map((_, i) => { const { optionId, ...s } = picks[i + 1]; return s; })), 'Textos aprobados').then((ok) => ok && setEditing(false))}
            >
              ✓ Aprobar textos
            </button>
            <button className="btn ghost sm" disabled={disabled || busy} onClick={() => setMore(more === 'all' ? null : 'all')}>Opciones nuevas para todas</button>
            {approved && <button className="btn ghost sm" onClick={() => (setPicks(initial), setEditing(false))}>Cancelar</button>}
          </div>
        </>
      )}
    </section>
  );
}
