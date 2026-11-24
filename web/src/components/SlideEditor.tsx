// Direct adjustment of one slide of a design proposal, without AI: each text with its size (steps or exact px),
// weight, colour and highlighted parts (**phrase** in SemiBold). A live preview renders the slide with the pending
// changes; applying creates a new version where only this slide is re-rendered and validated.
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.ts';
import { Modal, useToast } from '../ui.tsx';
import {
  CONTROLS, PX_RANGE, SIZE_PX, SIZE_STEPS, TONE_LABELS, TONES, TYPE_LABELS, WEIGHTS, WEIGHT_LABELS, editableTexts,
  type EditableText, type NodeEdit, type Tone, type Weight,
} from '../../../shared/design-edit.ts';
import type { PublicationDetail, Version } from '../../../shared/types.ts';

// Effective size in px of a text (exact px, else its size step).
const pxOf = (it: EditableText): number | null =>
  it.px ?? (typeof it.size === 'number' ? it.size : it.size !== null ? SIZE_PX[it.type]?.[it.size] ?? null : null);

// Wraps the selected part of the textarea in ** … ** (or removes the marks if the selection is already highlighted).
function toggleHighlight(el: HTMLTextAreaElement, text: string): string | null {
  let a = el.selectionStart, b = el.selectionEnd;
  if (a === b) return null;
  while (a < b && /\s/.test(text[a])) a++;
  while (b > a && /\s/.test(text[b - 1])) b--;
  const sel = text.slice(a, b);
  if (text.slice(a - 2, a) === '**' && text.slice(b, b + 2) === '**') return text.slice(0, a - 2) + sel + text.slice(b + 2);
  if (sel.startsWith('**') && sel.endsWith('**') && sel.length > 4) return text.slice(0, a) + sel.slice(2, -2) + text.slice(b);
  return text.slice(0, a) + '**' + sel.replace(/\*\*/g, '') + '**' + text.slice(b);
}

// Number field for an exact size: free typing, limits applied on Enter or when leaving the field.
function PxInput({ value, min, max, label, onChange }: { value: number; min: number; max: number; label: string; onChange: (v: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const n = Math.round(Number(draft));
    if (!draft.trim() || !Number.isFinite(n)) return setDraft(String(value));
    const v = Math.min(max, Math.max(min, n));
    setDraft(String(v));
    if (v !== value) onChange(v);
  };
  return (
    <input
      type="number" min={min} max={max} value={draft} style={{ width: 64 }} aria-label={label}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commit())}
    />
  );
}

export function SlideEditor({ version, slide, onClose, onSaved }: { version: Version; slide: number; onClose: () => void; onSaved: (d: PublicationDetail) => void }) {
  const original = useMemo(() => editableTexts(version.design!.slides[slide - 1]), [version, slide]);
  const [items, setItems] = useState<EditableText[]>(original);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const areas = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const toast = useToast();

  const set = (node: string, f: Partial<EditableText>) => setItems((xs) => xs.map((x) => (x.node === node ? { ...x, ...f } : x)));
  const step = (it: EditableText, d: number) => {
    const steps = SIZE_STEPS[it.type];
    const i = steps.findIndex((x) => String(x) === String(it.size));
    const next = steps[Math.min(steps.length - 1, Math.max(0, (i < 0 ? 0 : i) + d))];
    set(it.node, { size: next, px: null });
  };
  const edits: NodeEdit[] = items.flatMap((it) => {
    const o = original.find((x) => x.node === it.node)!;
    const e: NodeEdit = { node: it.node };
    if (it.text.trim() !== o.text) e.text = it.text;
    if (it.size !== o.size && it.size !== null) e.size = it.size;
    if (it.px !== o.px) e.px = it.px;
    if (it.weight !== o.weight && it.weight) e.weight = it.weight;
    if (it.tone !== o.tone && it.tone) e.tone = it.tone;
    return Object.keys(e).length > 1 ? [e] : [];
  });
  const key = JSON.stringify(edits);

  // Live preview: re-rendered on the server shortly after the last change (nothing is saved).
  useEffect(() => {
    if (!edits.length) {
      setPreview((u) => (u && URL.revokeObjectURL(u), null));
      setPreviewError(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setPreviewing(true);
      try {
        const r = await fetch(`/api/versions/${version.id}/slides/${slide}/preview`, {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: key === '[]' ? '{}' : JSON.stringify({ edits }), signal: ctrl.signal,
        });
        if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || `Error ${r.status}`);
        const url = URL.createObjectURL(await r.blob());
        setPreview((u) => (u && URL.revokeObjectURL(u), url));
        setPreviewError(null);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setPreviewError((e as Error).message);
      } finally {
        if (!ctrl.signal.aborted) setPreviewing(false);
      }
    }, 700);
    return () => (clearTimeout(t), ctrl.abort());
  }, [key, version.id, slide]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = async () => {
    setSaving(true);
    try {
      onSaved(await api.designEdit(version.id, slide, edits));
      toast('Aplicando el ajuste… solo se vuelve a renderizar esta diapositiva.');
    } catch (e) {
      toast((e as Error).message, true);
      setSaving(false);
    }
  };

  const current = `${version.dir}/${version.slides[slide - 1].file}?v=${version.id}`;
  return (
    <Modal
      wide
      title={`Ajustar la diapositiva ${slide} · v${version.number}`}
      onClose={onClose}
      footer={
        <>
          <span className="small muted" style={{ marginRight: 'auto' }}>Sin IA: se crea una versión nueva y la actual se conserva.</span>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!edits.length || saving} onClick={apply}>
            {saving ? 'Aplicando…' : edits.length ? `Aplicar ${edits.length} cambio(s)` : 'Sin cambios'}
          </button>
        </>
      }
    >
      <div className="slide-editor">
        <div className="slide-editor-preview">
          <img src={preview ?? current} alt={version.design!.slides[slide - 1].alt} style={{ opacity: previewing ? 0.6 : 1, transition: 'opacity .2s' }} />
          <p className="small muted" style={{ margin: '6px 0 0' }}>
            {previewing ? 'Actualizando la vista previa…' : preview ? 'Vista previa con tus cambios (aún sin aplicar).' : 'Diapositiva actual.'}
            {preview && !previewing && <> · <a href={current} target="_blank" rel="noreferrer">ver la actual</a></>}
          </p>
          {previewError && <p className="small" style={{ color: 'var(--danger, #b42318)', margin: '4px 0 0' }}>{previewError}</p>}
        </div>
        <div className="slide-editor-list">
          {items.length === 0 && <p className="muted">Esta diapositiva no tiene textos editables.</p>}
          {items.map((it) => {
            const c = CONTROLS[it.type];
            const o = original.find((x) => x.node === it.node)!;
            const changed = JSON.stringify(it) !== JSON.stringify(o);
            const range = PX_RANGE[it.type];
            const px = pxOf(it);
            const highlightable = it.type !== 'CtaBlock' && it.type !== 'DatePill' && it.type !== 'SwipeCue';
            return (
              <fieldset key={it.node} className={`text-edit${changed ? ' changed' : ''}`}>
                <legend>{TYPE_LABELS[it.type] ?? it.type}</legend>
                <textarea
                  ref={(el) => { areas.current[it.node] = el; }}
                  rows={Math.min(5, Math.max(1, it.text.split('\n').length))}
                  value={it.text}
                  onChange={(e) => set(it.node, { text: e.target.value })}
                  aria-label={`${TYPE_LABELS[it.type]}: texto`}
                />
                {highlightable && (
                  <div className="row small" style={{ gap: 6, margin: '4px 0' }}>
                    <button
                      type="button" className="btn sm"
                      title="Selecciona una parte del texto y pulsa para resaltarla en seminegrita (vuelve a pulsar para quitarlo)"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        const el = areas.current[it.node];
                        const t = el ? toggleHighlight(el, it.text) : null;
                        if (t === null) toast('Selecciona primero la parte del texto que quieres resaltar.', true);
                        else set(it.node, { text: t });
                      }}
                    >
                      <b>Resaltar</b> selección
                    </button>
                    {it.text.includes('**') && (
                      <button type="button" className="btn sm ghost" onClick={() => set(it.node, { text: it.text.replace(/\*\*/g, '') })}>Quitar resaltados</button>
                    )}
                    <span className="muted">Las partes entre ** se ven en seminegrita.</span>
                  </div>
                )}
                {(c.weight || c.size || c.tone) && (
                  <div className="row text-edit-controls">
                    {c.weight && (
                      <label className="small">
                        Peso{' '}
                        <select value={it.weight ?? ''} onChange={(e) => set(it.node, { weight: e.target.value as Weight })}>
                          {WEIGHTS.map((w) => <option key={w} value={w}>{WEIGHT_LABELS[w]}</option>)}
                        </select>
                      </label>
                    )}
                    {c.size && !range && (
                      <span className="small row" style={{ gap: 4 }}>
                        Tamaño
                        <button className="btn sm ghost" onClick={() => step(it, -1)} aria-label="Más pequeño">−</button>
                        <b style={{ minWidth: 54, textAlign: 'center' }}>{px} px</b>
                        <button className="btn sm ghost" onClick={() => step(it, 1)} aria-label="Más grande">+</button>
                      </span>
                    )}
                    {c.size && range && px !== null && (
                      <span className="small row" style={{ gap: 6, flexWrap: 'wrap' }}>
                        Tamaño
                        <button className="btn sm ghost" disabled={px <= range.min} onClick={() => set(it.node, { px: Math.max(range.min, px - 2) })} aria-label="2 px más pequeño">−</button>
                        <input
                          type="range" min={range.min} max={range.max} step={1} value={px}
                          onChange={(e) => set(it.node, { px: Number(e.target.value) })}
                          aria-label={`${TYPE_LABELS[it.type]}: tamaño en px`} style={{ width: 140 }}
                        />
                        <button className="btn sm ghost" disabled={px >= range.max} onClick={() => set(it.node, { px: Math.min(range.max, px + 2) })} aria-label="2 px más grande">+</button>
                        <PxInput value={px} min={range.min} max={range.max} label={`${TYPE_LABELS[it.type]}: px`} onChange={(v) => set(it.node, { px: v })} /> px
                        <select
                          value="" onChange={(e) => e.target.value && set(it.node, { size: e.target.value, px: null })}
                          aria-label="Tamaños de la marca" title="Tamaños estándar del sistema de diseño de BTL"
                        >
                          <option value="">Tamaño de la marca…</option>
                          {SIZE_STEPS[it.type].map((s) => <option key={String(s)} value={String(s)}>{SIZE_PX[it.type][String(s)]} px</option>)}
                        </select>
                      </span>
                    )}
                    {c.tone && (
                      <label className="small">
                        Color{' '}
                        <select value={it.tone ?? ''} onChange={(e) => set(it.node, { tone: e.target.value as Tone })}>
                          {TONES.map((t) => <option key={t} value={t}>{TONE_LABELS[t]}</option>)}
                        </select>
                      </label>
                    )}
                    {changed && <button className="btn sm ghost" onClick={() => set(it.node, o)}>Deshacer</button>}
                  </div>
                )}
              </fieldset>
            );
          })}
          <p className="small muted">
            Tamaños: cualquier valor entre 30 y 140 px en titulares y entre 30 y 80 px en textos (30 px es el mínimo legible en
            el móvil). Resaltado: por peso, nunca por color (manual de BTL). El color sigue la paleta de BTL según el fondo. Si un
            cambio no cabe, el validador lo reduce o lo marca para revisión al aplicar.
          </p>
        </div>
      </div>
    </Modal>
  );
}
