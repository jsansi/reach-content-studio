// Direct text editing (no AI). Saves a new version; only slides whose text changed are re-rendered.
import { useState } from 'react';
import { api } from '../api.ts';
import { Field, Modal, useToast } from '../ui.tsx';
import type { PublicationDetail, Version } from '../../../shared/types.ts';
import type { CarouselContentT } from '../../../shared/schema.ts';

type Path = (string | number)[];
const FIELDS: Record<string, { path: Path; label: string; long?: boolean }[]> = {
  commemoration: [
    { path: ['datePill'], label: 'Fecha (pill)' },
    { path: ['eyebrow'], label: 'Antetítulo', long: true },
    { path: ['title'], label: 'Titular (gancho)', long: true },
    { path: ['question'], label: 'Pregunta / subtítulo', long: true },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  product: [
    { path: ['eyebrow'], label: 'Nombre del producto' },
    { path: ['title'], label: 'Titular', long: true },
    { path: ['stat', 'value'], label: 'Cifra' },
    { path: ['stat', 'label'], label: 'Texto de la cifra' },
    { path: ['body'], label: 'Texto de apoyo', long: true },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  benefits: [
    { path: ['title'], label: 'Titular', long: true },
    { path: ['cta'], label: 'CTA' },
    { path: ['signature'], label: 'Firma' },
  ],
  hero: [
    { path: ['datePill'], label: 'Fecha (pill)' },
    { path: ['eyebrow'], label: 'Antetítulo', long: true },
    { path: ['title'], label: 'Titular', long: true },
    { path: ['body'], label: 'Texto de apoyo', long: true },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  statement: [
    { path: ['datePill'], label: 'Fecha (pill)' },
    { path: ['kicker'], label: 'Antetítulo', long: true },
    { path: ['title'], label: 'Frase principal', long: true },
    { path: ['body'], label: 'Texto de apoyo', long: true },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  stats: [
    { path: ['title'], label: 'Titular', long: true },
    { path: ['note'], label: 'Nota al pie (fuente)', long: true },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  split: [
    { path: ['eyebrow'], label: 'Antetítulo' },
    { path: ['title'], label: 'Titular', long: true },
    { path: ['body'], label: 'Texto de apoyo', long: true },
    { path: ['label'], label: 'Etiqueta de la imagen' },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  steps: [
    { path: ['title'], label: 'Titular', long: true },
    { path: ['cta'], label: 'CTA' },
    { path: ['signature'], label: 'Firma' },
    { path: ['swipe'], label: 'Indicación para deslizar' },
  ],
  cta: [
    { path: ['kicker'], label: 'Antetítulo', long: true },
    { path: ['title'], label: 'Llamada a la acción', long: true },
    { path: ['body'], label: 'Texto de apoyo', long: true },
    { path: ['action'], label: 'Botón' },
    { path: ['signature'], label: 'Firma' },
  ],
};

const get = (o: any, p: Path) => p.reduce((x, k) => x?.[k], o);
const setIn = (o: any, p: Path, v: string) => {
  let x = o;
  p.slice(0, -1).forEach((k) => (x = x[k]));
  x[p[p.length - 1]] = v;
};

export function EditTexts({ version, onClose, onSaved }: { version: Version; onClose: () => void; onSaved: (d: PublicationDetail) => void }) {
  const [c, setC] = useState<CarouselContentT>(() => structuredClone(version.content));
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const update = (p: Path, v: string) =>
    setC((prev) => {
      const next = structuredClone(prev);
      setIn(next, p, v);
      return next;
    });

  const changed = JSON.stringify(c) !== JSON.stringify(version.content);
  const save = async () => {
    setSaving(true);
    try {
      onSaved(await api.edit(version.publication_id, version.id, c));
      toast('Guardando nueva versión: solo se renderizan las diapositivas modificadas');
    } catch (e) {
      toast((e as Error).message, true);
      setSaving(false);
    }
  };

  const input = (p: Path, label: string, long?: boolean) => {
    const v = get(c, p);
    if (v === undefined) return null;
    return (
      <Field key={p.join('.')} label={label} hint={long ? 'Usa saltos de línea donde quieras cortar el texto.' : undefined}>
        {long ? <textarea rows={2} value={v} onChange={(e) => update(p, e.target.value)} /> : <input type="text" value={v} onChange={(e) => update(p, e.target.value)} />}
      </Field>
    );
  };

  return (
    <Modal
      wide
      title={`Editar textos · a partir de v${version.number}`}
      onClose={onClose}
      footer={
        <>
          <span className="muted small" style={{ marginRight: 'auto', alignSelf: 'center' }}>
            Sin IA. Se crea una nueva versión y se conserva v{version.number}.
          </span>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={save} disabled={!changed || saving}>
            {saving ? 'Guardando…' : 'Guardar como nueva versión'}
          </button>
        </>
      }
    >
      {c.slides.map((s, i) => (
        <div className="edit-slide" key={i}>
          <img src={`${version.dir}/${version.slides[i]?.file}`} alt="" />
          <div>
            <h3 style={{ marginBottom: 10 }}>Diapositiva {i + 1}</h3>
            {(FIELDS[s.layout] ?? []).map((f) => input(['slides', i, ...f.path], f.label, f.long))}
            {s.layout === 'product' &&
              s.images?.map((_, j) => input(['slides', i, 'images', j, 'label'], `Etiqueta de imagen ${j + 1}`))}
            {s.layout === 'stats' &&
              s.items.map((it, j) =>
                it.image ? null : (
                  <div key={j} className="grid2">
                    {input(['slides', i, 'items', j, 'value'], `Cifra ${j + 1}`)}
                    {input(['slides', i, 'items', j, 'label'], `Texto de la cifra ${j + 1}`)}
                  </div>
                )
              )}
            {s.layout === 'steps' &&
              s.items.map((_, j) => (
                <div key={j} className="grid2">
                  {input(['slides', i, 'items', j, 'title'], `Punto ${j + 1}`)}
                  {input(['slides', i, 'items', j, 'text'], `Texto del punto ${j + 1}`)}
                </div>
              ))}
            {s.layout === 'split' && s.points?.map((_, j) => input(['slides', i, 'points', j], `Punto ${j + 1}`))}
            {s.layout === 'benefits' &&
              s.benefits.map((_, j) => (
                <div key={j} className="grid2">
                  {input(['slides', i, 'benefits', j, 'title'], `Ventaja ${j + 1}`)}
                  {input(['slides', i, 'benefits', j, 'text'], `Texto de la ventaja ${j + 1}`)}
                </div>
              ))}
            <details>
              <summary className="small">Texto alternativo (accesibilidad)</summary>
              {input(['slides', i, 'alt'], 'Texto alternativo', true)}
            </details>
          </div>
        </div>
      ))}
      <Field label="Caption">
        <textarea rows={7} value={c.caption} onChange={(e) => setC({ ...c, caption: e.target.value })} />
      </Field>
    </Modal>
  );
}
