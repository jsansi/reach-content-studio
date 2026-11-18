// Create / edit a publication brief. "Guardar en el calendario" only persists; generation is a separate action.
import { useEffect, useRef, useState } from 'react';
import { api, type PublicationInput, type SheetDraftState } from '../api.ts';
import { Field, Modal, useToast } from '../ui.tsx';
import { FORMATS, GENERATABLE_FORMATS, OBJECTIVES, type Brand, type Product, type Publication } from '../../../shared/types.ts';
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
    reference_ids: initial.reference_ids ?? [],
    brief: initial.brief ?? emptyBrief(initial.brand_id ?? data.brands[0]?.id ?? ''),
  });
  const [pending, setPending] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [sheet, setSheet] = useState<Product | null>(null);
  const [past, setPast] = useState<Publication[]>([]);
  const toast = useToast();
  // Past publications that can be picked as references (any client, newest first, not this one).
  useEffect(() => {
    api.publications({ from: '2000-01-01', to: '2999-12-31' })
      .then((list) => setPast(list.filter((x) => x.id !== initial.id && x.current_version_id).sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => setPast([]));
  }, [initial.id]);
  // The client's own products first; the rest stay visible (they belong to the other client or to none).
  const mine = (p: Product) => !p.brand_ids?.length || p.brand_ids.includes(f.brand_id);
  const brandName = (id: string) => data.brands.find((b) => b.id === id)?.name ?? id;
  const pastLabel = (x: Publication) => `${x.date} · ${x.topic} · ${brandName(x.brand_id)}`;
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

      <Field label="Productos BTL relacionados" optional hint="Primero los equipos del cliente elegido. Si no está, regístralo.">
        <div className="chips">
          {data.products.filter(mine).map((p) => {
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
        {data.products.some((p) => !mine(p)) && (
          <>
            <p className="small muted" style={{ margin: '8px 0 4px' }}>Equipos asignados a otro cliente:</p>
            <div className="chips">
              {data.products.filter((p) => !mine(p)).map((p) => {
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
            </div>
          </>
        )}
        {f.product_ids.length > 0 && (
          <div className="row small" style={{ marginTop: 8 }}>
            <span className="muted">Ver o editar la ficha:</span>
            {data.products.filter((p) => f.product_ids.includes(p.id)).map((p) => (
              <button key={p.id} type="button" className="btn sm" onClick={() => setSheet(p)}>Ficha de {p.name}</button>
            ))}
          </div>
        )}
      </Field>

      <Field label="Publicaciones de referencia" optional hint="Publicaciones anteriores cuyo tono, estructura o estilo quieres retomar (máximo 5). La IA ve sus textos e imágenes, sin copiarlos.">
        <div style={{ display: 'grid', gap: 6 }}>
          {f.reference_ids.map((id) => {
            const x = past.find((y) => y.id === id);
            return (
              <div key={id} className="row small">
                <a href={`#/p/${id}`} target="_blank" rel="noreferrer">{x ? pastLabel(x) : `Publicación ${id}`}</a>
                <span className="spacer" />
                <button type="button" className="btn ghost sm danger" aria-label="Quitar referencia" onClick={() => set('reference_ids', f.reference_ids.filter((y) => y !== id))}>✕</button>
              </div>
            );
          })}
          {f.reference_ids.length < 5 && (
            <select value="" onChange={(e) => e.target.value && set('reference_ids', [...f.reference_ids, Number(e.target.value)])}>
              <option value="">{past.length ? '+ Añadir una publicación de referencia…' : 'Aún no hay publicaciones con diseños'}</option>
              {past.filter((x) => !f.reference_ids.includes(x.id)).map((x) => (
                <option key={x.id} value={x.id}>{pastLabel(x)}</option>
              ))}
            </select>
          )}
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
      {files !== false && (
        <Field
          label={editing ? 'Añadir documentos o imágenes a la publicación' : 'Documentos de apoyo e imágenes adicionales'}
          optional
          hint={`PDF, MD o TXT para documentos; PNG, JPG o WEBP para imágenes.${editing ? ' Se suman a los que ya tiene (sección Archivos) al guardar.' : ' También puedes añadirlos después.'} Para material que sirve en todas las publicaciones de un equipo, súbelo a su ficha.`}
        >
          <input type="file" multiple accept=".pdf,.md,.txt,.png,.jpg,.jpeg,.webp" onChange={(e) => setPending([...(e.target.files ?? [])])} />
          {pending.length > 0 && <span className="small muted">{pending.length} archivo(s) se subirán al guardar: {pending.map((x) => x.name).join(', ')}</span>}
        </Field>
      )}

      {sheet && (
        <NewProduct
          brands={data.brands}
          product={sheet}
          onClose={() => setSheet(null)}
          onCreated={async () => {
            await data.reloadProducts();
            setSheet(null);
          }}
        />
      )}
      {newProduct && (
        <NewProduct
          brands={data.brands}
          brand={f.brand_id}
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

// Product sheet: registers a product (pending review) or, with `product`, completes any product's sheet.
// Every sheet takes several reference links (e.g. the English and the Spanish BTL page) and files of any kind;
// the description and features of catalog products come from the catalog and are shown read-only.
export function NewProduct({ onClose, onCreated, product, brands, brand }: {
  onClose: () => void; onCreated: (id: string) => void; product?: Product; brands: Brand[]; brand?: string;
}) {
  const [current, setCurrent] = useState<Product | undefined>(product);
  const [brandIds, setBrandIds] = useState<string[]>(product ? product.brand_ids : brand ? [brand] : []);
  const [reviewed, setReviewed] = useState(product ? product.review_status !== 'pending_review' : false);
  const [draft, setDraft] = useState<SheetDraftState>({ status: 'none' });
  const [drafting, setDrafting] = useState(false);
  const catalog = current?.source === 'catalog';
  const d = (current?.data ?? {}) as { url?: string; description?: string; key_features?: string[] };
  const links0 = (current?.refs ?? []).filter((r) => r.kind === 'link').map((r) => r.url ?? '');
  const [p, setP] = useState({
    name: current?.name ?? '', category: current?.category ?? '', description: d.description ?? '', features: (d.key_features ?? []).join('\n'),
  });
  const [links, setLinks] = useState<string[]>(links0.length ? links0 : ['']);
  const [pending, setPending] = useState<File[]>([]); // files chosen before the product exists
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const files = (current?.refs ?? []).filter((r) => r.kind === 'file');
  const urls = links.map((x) => x.trim()).filter(Boolean);

  const upload = async (id: string, list: File[]) => {
    let last: Product | undefined;
    for (const f of list) {
      try {
        last = await api.uploadProductFile(id, f);
      } catch (e) {
        toast(`${f.name}: ${(e as Error).message}`, true);
      }
    }
    return last;
  };
  const addFiles = async (list: File[]) => {
    if (!list.length) return;
    if (!current) return setPending((x) => [...x, ...list]);
    setBusy(true);
    const r = await upload(current.id, list);
    if (r) (setCurrent(r), toast(list.length === 1 ? `${list[0].name} añadido a la ficha` : `${list.length} archivos añadidos a la ficha`));
    setBusy(false);
    if (fileInput.current) fileInput.current.value = '';
  };
  const removeFile = async (refId: number) => {
    try {
      setCurrent(await api.deleteProductRef(refId));
    } catch (e) {
      toast((e as Error).message, true);
    }
  };
  const save = async () => {
    setBusy(true);
    try {
      const features = p.features.split('\n').map((x) => x.trim()).filter(Boolean);
      let r = current
        ? await api.updateProduct(current.id, catalog ? { urls, brand_ids: brandIds } : { category: p.category, urls, description: p.description, features, brand_ids: brandIds, reviewed })
        : await api.createProduct({ name: p.name, category: p.category, urls, description: p.description, features, brand_ids: brandIds, reviewed });
      if (pending.length) r = (await upload(r.id, pending)) ?? r;
      toast(current ? `Ficha de ${r.name} guardada` : `${r.name} registrado (pendiente de revisión)`);
      onCreated(r.id);
    } catch (e) {
      toast((e as Error).message, true);
      setBusy(false);
    }
  };
  // Draft from the sources: the sheet is saved first (links and files), then the draft is requested or imported.
  const startDraft = async () => {
    setDrafting(true);
    try {
      let target = current;
      const features = p.features.split('\n').map((x) => x.trim()).filter(Boolean);
      if (target) target = await api.updateProduct(target.id, { category: p.category, urls, description: p.description, features, brand_ids: brandIds, reviewed });
      else {
        target = await api.createProduct({ name: p.name, category: p.category, urls, description: p.description, features, brand_ids: brandIds, reviewed });
        if (pending.length) (target = (await upload(target.id, pending)) ?? target, setPending([]));
      }
      setCurrent(target);
      const r = await api.startSheetDraft(target.id);
      setDraft(r);
      if (r.status === 'waiting') toast('Tarea preparada para Claude Code: ejecútala y luego pulsa "Importar".');
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setDrafting(false);
    }
  };
  const importDraft = async () => {
    if (!current) return;
    try {
      const r = await api.sheetDraft(current.id);
      setDraft(r);
      if (r.status === 'waiting') toast('Todavía no hay resultado: ejecuta la tarea en Claude Code.', true);
    } catch (e) {
      toast((e as Error).message, true);
    }
  };
  const useDraft = () => {
    if (draft.status !== 'ready') return;
    setP({ ...p, category: draft.draft.category ?? p.category, description: draft.draft.description, features: draft.draft.key_features.join('\n') });
    setDraft({ status: 'none' });
    toast('Textos copiados a la ficha: revísalos y pulsa "Guardar ficha".');
  };
  const kb = (n: number | null) => (n ? (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`) : '');
  const kindOf = (name: string) => (/\.(png|jpe?g|webp)$/i.test(name) ? (/logo/i.test(name) ? 'Logo' : 'Imagen') : /\.(pdf|md|txt)$/i.test(name) ? 'Documento' : 'Otro');

  return (
    <Modal
      title={current ? `Ficha de ${current.name}` : 'Registrar producto'}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!p.name.trim() || busy} onClick={save}>{current ? 'Guardar ficha' : 'Registrar'}</button>
        </>
      }
    >
      {catalog ? (
        <div className="notice info" style={{ marginBottom: 14 }}>
          Producto del <b>catálogo</b>: su descripción y características vienen del catálogo. Aquí puedes añadir más enlaces de
          referencia y archivos (imágenes, logo, PDF…) que se usarán al generar contenido.
        </div>
      ) : (
        <div className={`notice ${reviewed ? 'info' : 'warn'}`} style={{ marginBottom: 14 }}>
          {reviewed ? <>Ficha <b>revisada</b>.</> : <>La ficha queda <b>pendiente de revisión</b> hasta que la marques como revisada (abajo).</>} No se usan afirmaciones clínicas. Para generar contenido hace falta
          <b> información</b> (descripción, enlaces oficiales o un PDF) y <b>al menos una imagen del equipo</b>, aquí en la ficha
          o en los Archivos de la publicación. Puedes completar la ficha después.
        </div>
      )}
      <Field label="Nombre">
        <input type="text" value={p.name} disabled={!!current} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="BTL …" />
      </Field>
      <Field label="Cliente" hint="En qué cliente aparece el equipo al crear publicaciones. Sin marcar, aparece en los dos.">
        <div className="row">
          {brands.map((b) => (
            <label key={b.id} className="row small" style={{ gap: 6 }}>
              <input type="checkbox" checked={brandIds.includes(b.id)} onChange={(e) => setBrandIds(e.target.checked ? [...brandIds, b.id] : brandIds.filter((x) => x !== b.id))} />
              {b.name}
            </label>
          ))}
        </div>
      </Field>
      {!catalog && (
        <Field label="Categoría" optional>
          <input type="text" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} />
        </Field>
      )}

      <Field label="Enlaces de referencia" optional hint="Uno por línea, por ejemplo la página de BTL en inglés y en español. Las páginas oficiales de BTL se leen al generar (texto y fotos); los demás enlaces se anotan como referencia.">
        <div className="stack" style={{ display: 'grid', gap: 6 }}>
          {catalog && d.url && (
            <div className="row small muted">
              <span className="tag">Catálogo</span>
              <a href={d.url} target="_blank" rel="noreferrer" style={{ overflowWrap: 'anywhere' }}>{d.url}</a>
            </div>
          )}
          {links.map((u, i) => (
            <div key={i} className="row">
              <input
                type="url" value={u} placeholder="https://www.btlnet.com/…" style={{ flex: 1 }}
                onChange={(e) => setLinks(links.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <button type="button" className="btn ghost sm danger" aria-label="Quitar enlace" onClick={() => setLinks(links.length > 1 ? links.filter((_, j) => j !== i) : [''])}>✕</button>
            </div>
          ))}
          <div>
            <button type="button" className="btn sm" onClick={() => setLinks([...links, ''])}>+ Añadir enlace</button>
          </div>
        </div>
      </Field>

      <Field label="Archivos de la ficha" optional hint='Imágenes del equipo (PNG, JPG, WEBP; si el nombre del archivo incluye "logo" se usa como logo del producto), documentación (PDF, MD, TXT) y cualquier otro material de apoyo. Se usan en todas las publicaciones de este producto.'>
        <div style={{ display: 'grid', gap: 6 }}>
          {files.length === 0 && pending.length === 0 && <p className="small muted" style={{ margin: 0 }}>Aún no hay archivos.</p>}
          {files.map((f) => (
            <div key={f.id} className="row small">
              <span className="tag">{kindOf(f.filename ?? '')}</span>
              <a href={`/api/product-refs/${f.id}/file`} target="_blank" rel="noreferrer" style={{ overflowWrap: 'anywhere' }}>{f.filename}</a>
              <span className="muted">{kb(f.size)}</span>
              <span className="spacer" />
              <button type="button" className="btn ghost sm danger" aria-label={`Quitar ${f.filename}`} onClick={() => removeFile(f.id)}>✕</button>
            </div>
          ))}
          {pending.map((f, i) => (
            <div key={`p${i}`} className="row small">
              <span className="tag">{kindOf(f.name)}</span>
              <span style={{ overflowWrap: 'anywhere' }}>{f.name}</span>
              <span className="muted">{kb(f.size)} · se sube al registrar</span>
              <span className="spacer" />
              <button type="button" className="btn ghost sm danger" aria-label={`Quitar ${f.name}`} onClick={() => setPending(pending.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <div>
            <button type="button" className="btn sm" disabled={busy} onClick={() => fileInput.current?.click()}>+ Añadir archivos</button>
            <input ref={fileInput} type="file" multiple hidden onChange={(e) => addFiles([...(e.target.files ?? [])])} />
          </div>
        </div>
      </Field>

      {catalog ? (
        (d.description || (d.key_features?.length ?? 0) > 0) && (
          <details className="small">
            <summary>Descripción y características del catálogo</summary>
            {d.description && <p>{d.description}</p>}
            {!!d.key_features?.length && <ul>{d.key_features.map((x) => <li key={x}>{x}</li>)}</ul>}
          </details>
        )
      ) : (
        <>
          <div className="notice info small" style={{ marginBottom: 12 }}>
            <div className="row">
              <span style={{ flex: 1 }}>
                <b>Completar con las fuentes:</b> Claude lee los enlaces oficiales de BTL y los documentos de la ficha y propone la
                categoría, la descripción y las características. Nada se guarda hasta que lo revises y pulses "Guardar ficha".
              </span>
              <button type="button" className="btn sm primary" disabled={drafting || busy || !p.name.trim() || (!urls.length && !files.length && !pending.length)} onClick={startDraft}>
                {drafting ? 'Leyendo fuentes…' : 'Completar con las fuentes'}
              </button>
            </div>
            {draft.status === 'waiting' && (
              <div style={{ marginTop: 8 }}>
                Paso manual pendiente. Ejecuta en Claude Code:
                <pre className="small" style={{ whiteSpace: 'pre-wrap', margin: '6px 0' }}>{draft.command}</pre>
                <button type="button" className="btn sm" onClick={() => navigator.clipboard?.writeText(draft.command)}>Copiar comando</button>{' '}
                <button type="button" className="btn sm primary" onClick={importDraft}>Importar</button>
              </div>
            )}
            {draft.status === 'ready' && (
              <div style={{ marginTop: 8 }}>
                <b>Propuesta</b>{draft.draft.category ? ` · ${draft.draft.category}` : ''}
                <p style={{ margin: '4px 0' }}>{draft.draft.description}</p>
                <ul style={{ margin: '4px 0' }}>{draft.draft.key_features.map((x) => <li key={x}>{x}</li>)}</ul>
                {draft.draft.warnings.length > 0 && <p className="muted" style={{ margin: '4px 0' }}>Avisos: {draft.draft.warnings.join(' · ')}</p>}
                <button type="button" className="btn sm primary" onClick={useDraft}>Usar estos textos</button>{' '}
                <button type="button" className="btn sm ghost" onClick={() => setDraft({ status: 'none' })}>Descartar</button>
              </div>
            )}
          </div>
          <Field label="Descripción" optional hint="Opcional si añades enlaces oficiales o un PDF de documentación.">
            <textarea value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
          </Field>
          <Field label="Características verificadas" optional hint="Una por línea, tal como aparecen en la documentación oficial.">
            <textarea value={p.features} onChange={(e) => setP({ ...p, features: e.target.value })} />
          </Field>
          <label className="row small" style={{ gap: 8 }}>
            <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            <span><b>Ficha revisada:</b> comprobé la descripción, las características y los enlaces con las fuentes de BTL. Quita la etiqueta
            "pendiente de revisión". No convierte nada en afirmación clínica aprobada.</span>
          </label>
        </>
      )}
    </Modal>
  );
}
