// Reusable editorial preferences: applied to every generation and revision, separate from per-post comments.
import { useEffect, useState } from 'react';
import { api } from '../api.ts';
import { Field, useToast } from '../ui.tsx';
import type { EditorialPreference } from '../../../shared/types.ts';
import type { AppData } from '../App.tsx';

export function Preferences({ data }: { data: AppData }) {
  const [prefs, setPrefs] = useState<EditorialPreference[]>([]);
  const [text, setText] = useState('');
  const [brand, setBrand] = useState('');
  const toast = useToast();
  useEffect(() => {
    api.preferences().then(setPrefs).catch((e) => toast(e.message, true));
  }, [toast]);
  const brandName = (id: string | null) => (id ? data.brands.find((b) => b.id === id)?.name : 'Todas las marcas');

  return (
    <>
      <h1 style={{ marginBottom: 6 }}>Preferencias editoriales</h1>
      <p className="muted" style={{ marginTop: 0, maxWidth: 720 }}>
        Reglas que se aplican a todas las generaciones y revisiones de la marca. Los comentarios de una publicación concreta se guardan en su
        historial, no aquí.
      </p>
      <section className="card">
        {prefs.map((p) => (
          <div key={p.id} className={`pref${p.active ? '' : ' off'}`}>
            <p>
              {p.text}
              <br />
              <span className="small muted">{brandName(p.brand_id)}</span>
            </p>
            <label className="row small">
              <input type="checkbox" checked={p.active} onChange={(e) => api.updatePreference(p.id, { active: e.target.checked }).then(setPrefs)} />
              Activa
            </label>
            <button className="btn ghost sm danger" onClick={() => api.deletePreference(p.id).then(setPrefs)} aria-label="Eliminar preferencia">✕</button>
          </div>
        ))}
        {prefs.length === 0 && <p className="empty">Sin preferencias.</p>}
      </section>
      <section className="card">
        <h2>Nueva preferencia</h2>
        <div className="grid2">
          <Field label="Marca">
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Todas las marcas</option>
              {data.brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Regla">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='Ej.: "Evitar signos de exclamación en los titulares."' />
        </Field>
        <button
          className="btn primary"
          disabled={!text.trim()}
          onClick={() =>
            api.addPreference(brand || null, text).then((p) => {
              setPrefs([...prefs, p]);
              setText('');
              toast('Preferencia guardada');
            }, (e) => toast(e.message, true))
          }
        >
          Guardar preferencia
        </button>
      </section>
    </>
  );
}
