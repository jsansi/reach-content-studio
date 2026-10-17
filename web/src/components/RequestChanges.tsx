// Natural-language change requests. With the Anthropic API they run immediately; otherwise a Claude Code task is prepared.
import { useState } from 'react';
import { api } from '../api.ts';
import { Field, Modal, useToast } from '../ui.tsx';
import { REVISION_TARGETS, type PublicationDetail, type RevisionTarget, type Version } from '../../../shared/types.ts';

const EXAMPLES = [
  'La segunda diapositiva tiene demasiado texto.',
  'Haz más grande la imagen del equipo.',
  'El hook no genera suficiente interés.',
  'Quiero que la última diapositiva destaque más las ventajas comerciales.',
];
const NEEDS_SLIDE: RevisionTarget[] = ['slide', 'headline', 'supporting_text', 'product_image', 'layout', 'hierarchy'];

export function RequestChanges({
  version, manual, onClose, onSaved, onEditTexts,
}: {
  version: Version;
  manual: boolean;
  onClose: () => void;
  onSaved: (d: PublicationDetail) => void;
  onEditTexts: () => void;
}) {
  const [target, setTarget] = useState<RevisionTarget>('carousel');
  const [slide, setSlide] = useState<number | null>(null);
  const [instruction, setInstruction] = useState('');
  const [pref, setPref] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const send = async () => {
    setSaving(true);
    try {
      onSaved(await api.requestChanges(version.publication_id, { target, slide_number: NEEDS_SLIDE.includes(target) ? slide : null, instruction, save_as_preference: pref }));
      toast(manual ? 'Solicitud guardada. Se preparó una tarea para Claude Code.' : 'Solicitud enviada. Claude está revisando el carrusel.');
    } catch (e) {
      toast((e as Error).message, true);
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Solicitar cambios"
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" style={{ marginRight: 'auto' }} onClick={onEditTexts}>¿Solo cambiar un texto? Editar textos sin IA</button>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!instruction.trim() || saving} onClick={send}>
            {saving ? 'Enviando…' : 'Solicitar cambios'}
          </button>
        </>
      }
    >
      <div className="grid2">
        <Field label="¿Qué quieres cambiar?">
          <select value={target} onChange={(e) => setTarget(e.target.value as RevisionTarget)}>
            {Object.entries(REVISION_TARGETS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        {NEEDS_SLIDE.includes(target) && (
          <Field label="Diapositiva" optional>
            <select value={slide ?? ''} onChange={(e) => setSlide(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Cualquiera / varias</option>
              {version.slides.map((_, i) => (
                <option key={i} value={i + 1}>Diapositiva {i + 1}</option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <Field label="Describe el cambio" hint="En español, como se lo dirías a un diseñador.">
        <textarea rows={4} value={instruction} onChange={(e) => setInstruction(e.target.value)} autoFocus />
      </Field>
      <div className="chips" style={{ marginBottom: 14 }}>
        {EXAMPLES.map((x) => (
          <button key={x} className="chip" onClick={() => setInstruction(x)}>{x}</button>
        ))}
      </div>
      <label className="row small" style={{ marginBottom: 12 }}>
        <input type="checkbox" checked={pref} onChange={(e) => setPref(e.target.checked)} />
        Guardar también como preferencia editorial para futuras publicaciones de esta marca
      </label>
      <div className={`notice ${manual ? 'warn' : 'info'}`}>
        {manual
          ? 'Modo Claude Code: la solicitud se guardará y se preparará una tarea para ejecutar en Claude Code (paso manual). Después importarás el resultado.'
          : 'Claude interpretará la solicitud y solo se volverán a renderizar las diapositivas que cambien. Se conserva la versión actual.'}
      </div>
    </Modal>
  );
}
