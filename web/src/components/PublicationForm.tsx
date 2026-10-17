// Create / edit a publication brief. "Guardar en el calendario" only persists; generation is a separate action.
import { useState } from 'react';
import { api, type PublicationInput } from '../api.ts';
import { Field, Modal, useToast } from '../ui.tsx';
import { FORMATS, GENERATABLE_FORMATS, OBJECTIVES, type Product, type Publication } from '../../../shared/types.ts';
import { DEFAULT_AUDIENCE, TONES, emptyBrief, narrative, type QuickBrief } from '../../../shared/structure.ts';
import type { AppData } from '../App.tsx';

export function PublicationForm({
  data, initial, onClose, onSaved, files,
}: {
  data: AppData;
  initial: Partial<Publication>;
  onClose: () => void;
  onSaved: (p: Publication) => void;
  files?: boolean;
}) {
  const editing = !!initial.id;
  const [f, setF] = useState<PublicationInput>({
    brand_id: initial.brand_id ?? data.brands[0]?.id ?? '',
    date: initial.date ?? '',
    topic: initial.topic ?? '',
    format: initial.format ?? 'carousel',
    objective: initial.objective ?? '',
    slide_count: initial.slide_count ?? 3,
    creative_instructions: initial.creative_instructions ?? '',
    deadline: initial.deadline ?? null,
    product_ids: initial.product_ids ?? [],
    brief: initial.brief ?? emptyBrief(initial.brand_id ?? data.brands[0]?.id ?? ''),
  });
  const [pending, setPending] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const toast = useToast();
  const set = <K extends keyof PublicationInput>(k: K, v: PublicationInput[K]) => setF((x) => ({ ...x, [k]: v }));
  const brief = f.brief ?? emptyBrief(f.brand_id);
  const setBrief = (k: keyof QuickBrief, v: string) => set('brief', { ...brief, [k]: v });
  const roles = narrative({ format: f.format as Publication['format'], slide_count: f.slide_count, product_ids: f.product_ids });
  const structureChanges = editing && !!initial.approved_copy && (f.format !== initial.format || f.slide_count !== initial.slide_count);
  const missing = !f.brand_id || !f.date || !f.topic.trim() || !f.format || !f.objective.trim();
  const customObjective = f.objective && !OBJECTIVES.includes(f.objective);

  const save = async () => {
    setSaving(true);
    try {
      let p: Publication;
      if (editing) p = (await api.updatePublication(initial.id!, f)).publication;
      else p = await api.createPublication(f);
      for (const file of pending) await api.upload(p.id, file);
      onSaved(p);
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? 'Editar publicación' : 'Nueva publicación'}
      onClose={onClose}
      footer={
        <>
          <span className="muted small" style={{ marginRight: 'auto', alignSelf: 'center' }}>
            Guardar no genera contenido. Podrás generarlo después desde la publicación.
          </span>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={save} disabled={missing || saving}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Guardar en el calendario'}
          </button>
        </>
      }
    >
      <div className="grid2">
        <Field label="Marca">
          <select
            value={f.brand_id}
            onChange={(e) => {
              // The default audience follows the brand unless Jaime already wrote his own.
              if (!brief.audience || brief.audience === DEFAULT_AUDIENCE[f.brand_id]) set('brief', { ...brief, audience: DEFAULT_AUDIENCE[e.target.value] ?? '' });
              set('brand_id', e.target.value);
            }}
          >
            {data.brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha de publicación">
          <input type="date" value={f.date} onChange={(e) => set('date', e.target.value)} required />
        </Field>
      </div>
      <Field label="Tema" hint="Ej.: Día Mundial de la Columna Vertebral · BTL Spinal Decompression">
        <input type="text" value={f.topic} onChange={(e) => set('topic', e.target.value)} placeholder="¿De qué trata la publicación?" />
      </Field>
      <div className="grid2">
        <Field label="Formato" hint={GENERATABLE_FORMATS.includes(f.format as never) ? undefined : 'Este formato se planifica en el calendario; la generación automática aún no está disponible.'}>
          <select value={f.format} onChange={(e) => set('format', e.target.value)}>
            {Object.entries(FORMATS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Objetivo de marketing">
          <select value={customObjective ? '__other' : f.objective} onChange={(e) => set('objective', e.target.value === '__other' ? ' ' : e.target.value)}>
            <option value="">Elige un objetivo…</option>
            {OBJECTIVES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
            <option value="__other">Otro…</option>
          </select>
          {customObjective && <input type="text" value={f.objective.trimStart()} onChange={(e) => set('objective', e.target.value)} placeholder="Describe el objetivo" autoFocus />}
        </Field>
      </div>

      <Field label="Productos BTL relacionados" optional hint="Del catálogo btl_products.json. Si no está, regístralo; quedará pendiente de revisión.">
        <div className="chips">
          {data.products.map((p) => {
            const on = f.product_ids.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                className="chip"
                aria-pressed={on}
                style={on ? { background: 'var(--mint)', borderStyle: 'solid', borderColor: 'var(--mint)' } : undefined}
                onClick={() => set('product_ids', on ? f.product_ids.filter((x) => x !== p.id) : [...f.product_ids, p.id])}
              >
                {on ? '✓ ' : ''}
                {p.name}
                {p.review_status === 'pending_review' && <span className="tag warn" style={{ marginLeft: 6 }}>pendiente de revisión</span>}
              </button>
            );
          })}
          <button type="button" className="chip" onClick={() => setNewProduct(true)}>+ Registrar producto</button>
        </div>
      </Field>

      <div className="grid2">
        <Field label="Número de diapositivas" optional>
          <input type="number" min={1} max={10} value={f.format === 'single_image' ? 1 : f.slide_count} disabled={f.format === 'single_image'} onChange={(e) => set('slide_count', Number(e.target.value))} />
        </Field>
        <Field label="Fecha límite de producción" optional>
          <input type="date" value={f.deadline ?? ''} onChange={(e) => set('deadline', e.target.value || null)} />
        </Field>
      </div>
      {GENERATABLE_FORMATS.includes(f.format as never) && (
        <div className="notice info small" style={{ marginBottom: 14 }}>
          <b>Estructura fija:</b> {roles.map((r, i) => `${i + 1} ${r.label}`).join(' · ')}
          {roles.some((r) => r.role === 'ventajas') && ' + "Solicita tu demo"'}. No hace falta explicarla en las instrucciones.
          {structureChanges && <div style={{ marginTop: 4 }}>Al cambiar el formato o el número de diapositivas se descartan los textos aprobados.</div>}
        </div>
      )}
      <h3 style={{ margin: '4px 0 10px' }}>Brief rápido</h3>
      <div className="grid2">
        <Field label="¿A quién le habla?" optional>
          <input type="text" value={brief.audience} onChange={(e) => setBrief('audience', e.target.value)} />
        </Field>
        <Field label="Tono" optional>
          <select value={brief.tone} onChange={(e) => setBrief('tone', e.target.value)}>
            {[...new Set([...TONES, brief.tone].filter(Boolean))].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Ventaja principal para la clínica" optional hint="La idea que el profesional se lleva; el hook y las ventajas conectan con ella. Si la dejas vacía, los textos proponen varios ángulos.">
        <input type="text" value={brief.angle} onChange={(e) => setBrief('angle', e.target.value)} placeholder="Ej.: tratar más zonas del cuerpo con un solo equipo" />
      </Field>
      <Field label="Qué evitar" optional>
        <input type="text" value={brief.avoid} onChange={(e) => setBrief('avoid', e.target.value)} placeholder="Ej.: decir que el equipo trata la osteoporosis; tono alarmista" />
      </Field>
      <Field label="Otras instrucciones" optional hint="Lo que no cubre el brief rápido: estilo, imágenes, referencias…">
        <textarea value={f.creative_instructions} onChange={(e) => set('creative_instructions', e.target.value)} rows={3} />
      </Field>
      {files !== false && !editing && (
        <Field label="Documentos de apoyo e imágenes adicionales" optional hint="PDF, MD o TXT para documentos; PNG, JPG o WEBP para imágenes. También puedes añadirlos después.">
          <input type="file" multiple accept=".pdf,.md,.txt,.png,.jpg,.jpeg,.webp" onChange={(e) => setPending([...(e.target.files ?? [])])} />
        </Field>
      )}

      {newProduct && (
        <NewProduct
          onClose={() => setNewProduct(false)}
          onCreated={async (id) => {
            await data.reloadProducts();
            set('product_ids', [...f.product_ids, id]);
            setNewProduct(false);
          }}
        />
      )}
    </Modal>
  );
}

// Registers a product (pending review) or, with `product`, completes the record of one already registered.
export function NewProduct({ onClose, onCreated, product }: { onClose: () => void; onCreated: (id: string) => void; product?: Product }) {
  const d = (product?.data ?? {}) as { url?: string; description?: string; key_features?: string[] };
  const [p, setP] = useState({
    name: product?.name ?? '', category: product?.category ?? '', url: d.url ?? '', description: d.description ?? '', features: (d.key_features ?? []).join('\n'),
  });
  const toast = useToast();
  const create = async () => {
    try {
      const features = p.features.split('\n').map((x) => x.trim()).filter(Boolean);
      const r = product
        ? await api.updateProduct(product.id, { category: p.category, url: p.url, description: p.description, features })
        : await api.createProduct({ ...p, features });
      toast(product ? `Ficha de ${r.name} guardada` : `${r.name} registrado (pendiente de revisión)`);
      onCreated(r.id);
    } catch (e) {
      toast((e as Error).message, true);
    }
  };
  return (
    <Modal
      title={product ? `Ficha de ${product.name}` : 'Registrar producto'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!p.name.trim()} onClick={create}>{product ? 'Guardar ficha' : 'Registrar'}</button>
        </>
      }
    >
      <div className="notice warn" style={{ marginBottom: 14 }}>
        El producto queda <b>pendiente de revisión</b> y no se usan afirmaciones clínicas. Para generar contenido hace falta
        <b> una descripción o características</b> (aquí) <b>o un PDF de documentación</b> adjunto a la publicación, y
        <b> al menos una imagen del equipo</b> en la sección Archivos de la publicación. Puedes completar esta ficha después.
      </div>
      <Field label="Nombre">
        <input type="text" value={p.name} disabled={!!product} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="BTL …" />
      </Field>
      <div className="grid2">
        <Field label="Categoría" optional>
          <input type="text" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} />
        </Field>
        <Field label="Página oficial" optional hint="Si es de BTL, se consulta para obtener texto y fotos.">
          <input type="text" value={p.url} onChange={(e) => setP({ ...p, url: e.target.value })} placeholder="https://" />
        </Field>
      </div>
      <Field label="Descripción" optional hint="Opcional si adjuntas un PDF de documentación a la publicación.">
        <textarea value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
      </Field>
      <Field label="Características verificadas" optional hint="Una por línea, tal como aparecen en la documentación oficial.">
        <textarea value={p.features} onChange={(e) => setP({ ...p, features: e.target.value })} />
      </Field>
    </Modal>
  );
}
