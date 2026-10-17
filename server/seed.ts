// Initial data: brands, the product catalog, default editorial preferences, and the World Spine Day
// carousel from the POC registered as Version 1 (files copied byte-for-byte, never re-rendered).
import fs from 'node:fs';
import path from 'node:path';
import { db, getMeta, setMeta, tx } from './db.ts';
import { ROOT, versionDir, versionUrl } from './paths.ts';
import * as repo from './repo.ts';

const BRANDS = [
  {
    id: 'btl-medical-sv',
    name: 'BTL Medical El Salvador',
    signature: 'BTL El Salvador',
    color: '#102630',
    tokens: 'btl',
    guideline_path: 'knowledge/brand-guidelines/btl_corporate_identity.pdf',
    guideline_summary: 'knowledge/brand-guidelines/btl-corporate-identity.md',
    editorial_prompt: 'prompts/brands/btl-medical-el-salvador.md',
  },
  {
    id: 'btl-estetica-sv',
    name: 'BTL Estética El Salvador',
    signature: 'BTL El Salvador',
    color: '#178F79',
    tokens: 'btl',
    guideline_path: 'knowledge/brand-guidelines/btl_corporate_identity.pdf',
    guideline_summary: 'knowledge/brand-guidelines/btl-corporate-identity.md',
    editorial_prompt: 'prompts/brands/btl-estetica-el-salvador.md',
  },
];

// Reusable preferences gathered while producing the POC (kept separate from per-publication comments).
const PREFERENCES = [
  'Nombrar siempre a la marca como "BTL El Salvador" en diapositivas, captions, textos alternativos y firmas. Nunca "BTL Medical" ni separar en divisiones médica/estética.',
  'CTA corto: "Solicita tu demo", sin flecha. Las demos se piden por mensaje directo con la palabra "DEMO".',
  'Escribir las cifras como "+100 posiciones", no "100+" ni "más de 100".',
  'Priorizar ventajas prácticas para la clínica o el profesional (personalizar protocolos, manos libres, nueva línea de servicio); dejar los detalles técnicos fuera o al mínimo.',
  'Caption de unos 500 caracteres: gancho con la palabra clave de la fecha, un párrafo de beneficio que nombre el producto, CTA por mensaje directo "DEMO" y unos 5 hashtags.',
  'Las piezas se ven sobre todo en el móvil: ningún texto por debajo de 30 px en el lienzo de 1080 px (incluye "Desliza…", etiquetas y pills), y peso regular en los textos pequeños.',
];
// Learned while producing the World Osteoporosis Day carousel (2026-10-17); added once to existing databases too.
const PREFERENCES_2 = [
  'El gancho de la diapositiva 1 conecta con la ventaja para la clínica o el profesional que compra el equipo, y la diapositiva 2 lo resuelve.',
  'No afirmar que un equipo trata una enfermedad o condición si la fuente oficial de BTL no lo dice (p. ej., no decir que la magnetoterapia trata la osteoporosis): la fecha y la ilustración ilustran el tema, no prueban un resultado.',
];
// Learned on the Día Mundial del Ictus carousel (2026-10-17). "No decorations" was left out on purpose (sometimes
// they want them), and the name/description treatment of each device depends on the piece.
const PREFERENCES_3 = [
  'Titulares en dos pesos: la idea principal en seminegrita y el complemento en ligero (el énfasis es de peso y tamaño, nunca de color dentro del texto).',
  '"Desliza" siempre abajo a la derecha, con la misma posición, tamaño y tratamiento en todas las diapositivas menos la última.',
  'Cierre de la pieza: el único CTA es "Solicita tu demo", en peso regular, sin pastilla, botón ni contenedor, y sin la firma "BTL El Salvador" ni "Escríbenos DEMO" en la diapositiva (la invitación a escribir "DEMO" por mensaje directo va solo en el caption).',
  'Cada equipo que se menciona aparece con su foto oficial y, normalmente, con su logo oficial de producto; si falta el logo en los activos, avisarlo en warnings.',
];

export function seed() {
  tx(() => {
    for (const b of BRANDS)
      db.prepare(
        `INSERT INTO brands (id, name, signature, color, tokens, guideline_path, guideline_summary, editorial_prompt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, signature = excluded.signature, color = excluded.color,
           tokens = excluded.tokens, guideline_path = excluded.guideline_path, guideline_summary = excluded.guideline_summary,
           editorial_prompt = excluded.editorial_prompt`
      ).run(b.id, b.name, b.signature, b.color, b.tokens, b.guideline_path, b.guideline_summary, b.editorial_prompt);

    // The catalog file stays the source of truth for catalog products; user-created products live only in SQLite.
    const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge/products/btl_products.json'), 'utf8'));
    for (const p of catalog.products)
      db.prepare(
        `INSERT INTO products (id, name, category, data_json, source, review_status) VALUES (?, ?, ?, ?, 'catalog', 'catalog')
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, category = excluded.category, data_json = excluded.data_json
         WHERE products.source = 'catalog'`
      ).run(p.id, p.name, p.category ?? null, JSON.stringify(p));

    if (!getMeta('seed.preferences')) {
      for (const t of PREFERENCES) repo.addPreference(null, t);
      setMeta('seed.preferences', new Date().toISOString());
    }
    if (!getMeta('seed.preferences.2')) {
      for (const t of PREFERENCES_2) repo.addPreference(null, t);
      setMeta('seed.preferences.2', new Date().toISOString());
    }
    if (!getMeta('seed.preferences.3')) {
      for (const t of PREFERENCES_3) repo.addPreference(null, t);
      setMeta('seed.preferences.3', new Date().toISOString());
    }
  });
  if (!getMeta('seed.poc_world_spine_day')) importPoc();
}

function importPoc() {
  const contentPath = 'content/spinal-decompression/dia-mundial-columna-2026.json';
  const content = JSON.parse(fs.readFileSync(path.join(ROOT, contentPath), 'utf8'));
  const srcDir = path.join(ROOT, content.output);
  const pngs = content.slides.map((_: unknown, i: number) => `slide-${String(i + 1).padStart(2, '0')}.png`);
  if (!pngs.every((p: string) => fs.existsSync(path.join(srcDir, p)))) {
    console.warn(`[seed] POC images not found in ${content.output}; World Spine Day publication not imported.`);
    return;
  }
  const pub = repo.createPublication({
    brand_id: 'btl-medical-sv',
    date: content.date,
    topic: `${content.occasion} · BTL Spinal Decompression`,
    format: 'carousel',
    objective: 'Fecha conmemorativa',
    slide_count: content.slides.length,
    creative_instructions: `Audiencia: ${content.audience}. Carrusel original de la prueba de concepto (opción A).`,
    product_ids: ['spinal-decompression'],
  });
  const dir = versionDir(pub.id, 1);
  fs.mkdirSync(dir, { recursive: true });
  const slides = pngs.map((p: string, i: number) => {
    fs.copyFileSync(path.join(srcDir, p), path.join(dir, p)); // byte-for-byte copy, appearance unchanged
    const buf = fs.readFileSync(path.join(dir, p));
    return { index: i, file: p, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length, rendered: false };
  });
  fs.writeFileSync(path.join(dir, 'content.json'), JSON.stringify(content, null, 2));
  fs.writeFileSync(path.join(dir, 'caption.txt'), content.caption + '\n');
  const dims = slides.filter((s: any) => s.width !== 1080 || s.height !== 1350).map((s: any) => `${s.file}: ${s.width}×${s.height}`);
  const v = repo.insertVersion({
    publication_id: pub.id, number: 1, origin: 'import', provider: 'poc', content, caption: content.caption, slides,
    validation: {
      status: dims.length ? 'warnings' : 'not_run',
      problems: dims,
      notes: ['Importada del POC sin regenerar (output/spinal-decompression).', 'Dimensiones verificadas: 1080×1350.'],
    },
    sources: content.sources, claims: [], concept: null, prompt_versions: null, parent_version_id: null, job_id: null,
    notes: `Registrada desde ${content.output} y ${contentPath}`, dir: versionUrl(pub.id, 1),
  });
  repo.setStatus(pub.id, 'ready_for_review', 'version_imported', 'Versión 1 importada del POC', v.id);
  setMeta('seed.poc_world_spine_day', String(pub.id));
  console.log(`[seed] World Spine Day carousel imported as publication ${pub.id}, version 1.`);
}
