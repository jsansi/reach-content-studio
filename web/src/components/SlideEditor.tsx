// Direct adjustment of one slide of the chosen design proposal, without AI: each text with its weight, size and
// colour. Applying creates a new version where only this slide is re-rendered and validated (a few seconds).
import { useMemo, useState } from 'react';
import { api } from '../api.ts';
import { Modal, useToast } from '../ui.tsx';
import {
  CONTROLS, SIZE_PX, SIZE_STEPS, TONE_LABELS, TONES, TYPE_LABELS, WEIGHTS, WEIGHT_LABELS, editableTexts,
  type EditableText, type NodeEdit, type Tone, type Weight,
} from '../../../shared/design-edit.ts';
import type { PublicationDetail, Version } from '../../../shared/types.ts';

const sizeLabel = (type: string, s: string | number | null) => (s === null ? '' : typeof s === 'number' ? `${s} px` : `${SIZE_PX[type]?.[s] ?? s} px`);

export function SlideEditor({ version, slide, onClose, onSaved }: { version: Version; slide: number; onClose: () => void; onSaved: (d: PublicationDetail) => void }) {
  const original = useMemo(() => editableTexts(version.design!.slides[slide - 1]), [version, slide]);
  const [items, setItems] = useState<EditableText[]>(original);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const set = (node: string, f: Partial<EditableText>) => setItems((xs) => xs.map((x) => (x.node === node ? { ...x, ...f } : x)));
  const step = (it: EditableText, d: number) => {
    const steps = SIZE_STEPS[it.type];
    const i = steps.findIndex((x) => String(x) === String(it.size));
    const next = steps[Math.min(steps.length - 1, Math.max(0, (i < 0 ? 0 : i) + d))];
    set(it.node, { size: next });
  };
  const edits: NodeEdit[] = items.flatMap((it) => {
    const o = original.find((x) => x.node === it.node)!;
    const e: NodeEdit = { node: it.node };
    if (it.text.trim() !== o.text) e.text = it.text;
    if (it.size !== o.size && it.size !== null) e.size = it.size;
    if (it.weight !== o.weight && it.weight) e.weight = it.weight;
    if (it.tone !== o.tone && it.tone) e.tone = it.tone;
    return Object.keys(e).length > 1 ? [e] : [];
  });

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
        <img src={`${version.dir}/${version.slides[slide - 1].file}?v=${version.id}`} alt={version.design!.slides[slide - 1].alt} />
        <div className="slide-editor-list">
          {items.length === 0 && <p className="muted">Esta diapositiva no tiene textos editables.</p>}
          {items.map((it) => {
            const c = CONTROLS[it.type];
            const o = original.find((x) => x.node === it.node)!;
            const changed = JSON.stringify(it) !== JSON.stringify(o);
            return (
              <fieldset key={it.node} className={`text-edit${changed ? ' changed' : ''}`}>
                <legend>{TYPE_LABELS[it.type] ?? it.type}</legend>
                <textarea
                  rows={Math.min(5, Math.max(1, it.text.split('\n').length))}
                  value={it.text}
                  onChange={(e) => set(it.node, { text: e.target.value })}
                  aria-label={`${TYPE_LABELS[it.type]}: texto`}
                />
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
                    {c.size && (
                      <span className="small row" style={{ gap: 4 }}>
                        Tamaño
                        <button className="btn sm ghost" onClick={() => step(it, -1)} aria-label="Más pequeño">−</button>
                        <b style={{ minWidth: 54, textAlign: 'center' }}>{sizeLabel(it.type, it.size)}</b>
                        <button className="btn sm ghost" onClick={() => step(it, 1)} aria-label="Más grande">+</button>
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
            El color sigue la paleta de BTL según el fondo: en fondos oscuros, Principal y Texto son blanco y Acento es celeste;
            en fondos claros, azul BTL y azul oscuro. Si un cambio no cabe, el validador lo reduce o lo marca para revisión.
          </p>
        </div>
      </div>
    </Modal>
  );
}
