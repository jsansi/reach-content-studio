// Change request for a design-system proposal: a general comment and/or one comment per slide, each next to
// its thumbnail. With only per-slide comments, the other slides don't change; approved slides never change.
// Sent with everything empty from "Regenerar", it asks for another composition of that slide.
import { useState } from 'react';
import { api } from '../api.ts';
import { Field, Modal, useToast } from '../ui.tsx';
import type { PublicationDetail, Version } from '../../../shared/types.ts';

const EXAMPLES = [
  'El gancho de la portada es demasiado genérico; hazlo más específico para clínicas.',
  'Da más protagonismo a la imagen del equipo.',
  'Hay demasiado texto; reduce y deja más aire.',
  'Usa más espacio en blanco y menos elementos.',
];

export function DesignChanges({
  version, manual, slide: focus, onClose, onSaved,
}: {
  version: Version;
  manual: boolean;
  slide: number | null; // slide the modal was opened from ("Comentar" / "Regenerar")
  onClose: () => void;
  onSaved: (d: PublicationDetail) => void;
}) {
  const [general, setGeneral] = useState('');
  const [comments, setComments] = useState<Record<number, string>>({});
  const [pref, setPref] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const locked = version.design?.locked_slides ?? [];
  const list = Object.entries(comments).map(([k, v]) => ({ slide: Number(k), text: v.trim() })).filter((c) => c.text);
  const regenerate = !general.trim() && !list.length && focus !== null && !locked.includes(focus);
  const only = !general.trim() && list.length > 0;

  const send = async () => {
    setSaving(true);
    try {
      onSaved(await api.designRevision(version.publication_id, {
        version_id: version.id, slide_number: regenerate ? focus : null, instruction: general, slide_comments: list, save_as_preference: pref,
      }));
      toast(manual ? 'Solicitud guardada. Se preparó una tarea para Claude Code.' : 'Solicitud enviada.');
    } catch (e) {
      toast((e as Error).message, true);
      setSaving(false);
    }
  };

  return (
    <Modal
      wide
      title={`Cambios en la propuesta ${version.direction} · v${version.number}`}
      onClose={onClose}
      footer={
        <>
          <span className="small muted" style={{ marginRight: 'auto' }}>
            {regenerate
              ? `Sin comentarios: se pedirá otra composición de la diapositiva ${focus}.`
              : only
                ? `Solo cambian las diapositivas comentadas (${list.map((c) => c.slide).join(', ')}).`
                : locked.length ? `Las diapositivas aprobadas (${locked.join(', ')}) no cambian.` : ''}
          </span>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={(!general.trim() && !list.length && !regenerate) || saving} onClick={send}>
            {saving ? 'Enviando…' : regenerate ? `Regenerar diapositiva ${focus}` : 'Solicitar cambios'}
          </button>
        </>
      }
    >
      <Field label="Comentario general (toda la propuesta)" optional hint="Para lo que afecta a todo el carrusel. Lo de una diapositiva, escríbelo junto a ella.">
        <textarea rows={2} value={general} onChange={(e) => setGeneral(e.target.value)} autoFocus={focus === null} />
      </Field>
      <div className="chips" style={{ marginBottom: 14 }}>
        {EXAMPLES.map((x) => (
          <button key={x} className="chip" onClick={() => setGeneral(x)}>{x}</button>
        ))}
      </div>
      <div className="slide-comments">
        {version.slides.map((s, i) => {
          const n = i + 1;
          const isLocked = locked.includes(n);
          return (
            <div key={s.file} className={`slide-comment${isLocked ? ' locked' : ''}${focus === n ? ' focus' : ''}`}>
              <img src={`${version.dir}/${s.file}?v=${version.id}`} alt={version.design?.slides[i]?.alt ?? `Diapositiva ${n}`} loading="lazy" />
              <div>
                <b className="small">Diapositiva {n}</b>
                {isLocked ? (
                  <p className="small muted" style={{ margin: '4px 0 0' }}>✓ Aprobada: no cambia. Quita la aprobación en el visor si quieres comentarla.</p>
                ) : (
                  <textarea
                    rows={3} value={comments[n] ?? ''} placeholder="Comentario solo para esta diapositiva (opcional)"
                    autoFocus={focus === n} onChange={(e) => setComments((c) => ({ ...c, [n]: e.target.value }))}
                    aria-label={`Comentario para la diapositiva ${n}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <label className="row small" style={{ margin: '12px 0' }}>
        <input type="checkbox" checked={pref} disabled={!general.trim()} onChange={(e) => setPref(e.target.checked)} />
        Guardar el comentario general como preferencia editorial para futuras publicaciones de esta marca
      </label>
      <div className={`notice ${manual ? 'warn' : 'info'}`}>
        {manual
          ? 'Modo Claude Code: se preparará una tarea para ejecutar en Claude Code (paso manual); después importarás el resultado. La propuesta actual se conserva.'
          : 'Claude revisará la propuesta; solo se vuelven a renderizar las diapositivas que cambien. La propuesta actual se conserva.'}
        {' '}Para cambios exactos de un texto (palabras, peso, tamaño, color) usa <b>Ajustar textos</b> en el visor: es inmediato y sin IA.
      </div>
    </Modal>
  );
}
