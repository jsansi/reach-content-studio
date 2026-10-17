// Prompt loader. Prompts are version-controlled Markdown files under prompts/ with front matter
// (id, version, purpose). A built prompt combines: system instructions + brand editorial instructions (system),
// and brand guidelines + product context + references + brief + user instructions (user message).
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { PROMPTS_DIR, abs, rel } from '../paths.ts';
import * as repo from '../repo.ts';
import { FORMATS } from '../../shared/types.ts';
import type { GenerationContext } from '../pipeline/context.ts';
import type { CarouselContentT } from '../../shared/schema.ts';
import type { ProposalT } from '../../shared/design.ts';
import { catalogMarkdown, SLIDE_PROPS, secondaryColorFor } from '../../design-system/btl/catalog.mjs';
import { libraryMarkdown } from '../design/library.ts';
import { recentDesigns } from '../design/memory.ts';
import { BANK_FILE, type Direction } from '../design/directions.ts';
import { narrative, structureMarkdown, type ApprovedCopy, type ApprovedSlide } from '../../shared/structure.ts';

export interface PromptFile {
  id: string;
  version: string;
  purpose: string;
  body: string;
  path: string;
  sha256: string;
}

export function loadPrompt(file: string): PromptFile {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Prompt sin front matter: ${file}`);
  const meta = Object.fromEntries(m[1].split('\n').map((l) => l.split(/:\s*/, 2) as [string, string]).filter(([k]) => k));
  if (!meta.id || !meta.version) throw new Error(`Prompt sin id o version: ${file}`);
  return { id: meta.id, version: meta.version, purpose: meta.purpose ?? '', body: m[2].trim(), path: rel(file), sha256: crypto.createHash('sha256').update(raw).digest('hex') };
}

const SYSTEM_SETS = {
  generate: ['creative-direction', 'carousel-content', 'caption', 'brand-compliance', 'claim-verification'],
  revise: ['creative-direction', 'carousel-revision', 'carousel-content', 'caption', 'brand-compliance', 'claim-verification'],
  propose: ['creative-direction', 'design-proposals', 'caption', 'brand-compliance', 'claim-verification'],
  design_revise: ['creative-direction', 'design-proposals', 'design-revision', 'caption', 'brand-compliance', 'claim-verification'],
  copy: ['creative-direction', 'copy-options', 'brand-compliance', 'claim-verification'],
} as const;
export type PromptKind = keyof typeof SYSTEM_SETS;

export interface BuiltPrompt {
  system: string;
  user: string;
  versions: Record<string, string>; // prompt id → version@sha8
}

export interface RevisionInput {
  current: CarouselContentT | ProposalT;
  target: string;
  slideNumber: number | null;
  instruction: string;
  fixedSlides?: number[]; // design revisions: slides that must come back identical (approved, or not in the request)
}

// Step 1: which slides need options (null = all) and Jaime's comment on the previous ones.
export interface CopyRequest {
  slide: number | null;
  instruction: string;
}

const copyText = (s: Pick<ApprovedSlide, 'headline' | 'support' | 'points'>) =>
  [`  - Texto principal: "${s.headline.replace(/\n/g, '\\n')}"`, s.support ? `  - Apoyo: "${s.support.replace(/\n/g, '\\n')}"` : '', ...s.points.map((x) => `  - Ventaja: "${x.title}" — "${x.text}"`)]
    .filter(Boolean).join('\n');

function approvedSection(copy: ApprovedCopy, kind: PromptKind): string {
  const rule = kind === 'revise' || kind === 'design_revise'
    ? 'Jaime aprobó estos textos en el paso 1. Mantenlos tal cual salvo que la solicitud de cambios pida cambiar un texto.'
    : 'Jaime aprobó estos textos en el paso 1 (Mensaje). Úsalos **tal cual**, cada uno en su diapositiva y como texto (no dentro de una imagen): no cambies, quites ni añadas palabras. Puedes decidir los saltos de línea (`\\n`) y la jerarquía visual. Además puedes añadir solo los textos fijos: fecha y nombre del día (pill, eyebrow), "Desliza…", el CTA "Solicita tu demo" y la firma "BTL El Salvador". Tu trabajo aquí es el diseño: composición, imágenes, ilustración y continuidad.';
  const claims = copy.slides.flatMap((s) => s.claims.map((c) => `- ${c.claim} · ${c.source} (${c.approval})`));
  return `${rule}\n\n${copy.slides.map((s) => `- Diapositiva ${s.slide}:\n${copyText(s)}`).join('\n')}${claims.length ? `\n\nAfirmaciones de estos textos (regístralas en \`claims\` con la misma fuente):\n${claims.join('\n')}` : ''}`;
}

// Structure of the brand's latest proposals (server/design/memory.ts), newest first.
function pastDesigns(ctx: GenerationContext): string {
  const past = recentDesigns(ctx.brand.id);
  return past.length
    ? `Resumen de cada diseño: fondo y componentes clave por diapositiva, y el gancho de la portada. Una propuesta que repita uno de estos esquemas (mismos fondos y mismos componentes protagonistas en las mismas diapositivas) se marca como "Diseño repetido".\n\n${past.map((d) => `- ${d.label}: ${d.description}`).join('\n')}`
    : 'Ninguno todavía.';
}

// Whether the decor tone "secondary" is available for this publication (BTL Social Media Guideline pp. 7–8).
function secondaryNote(names: string[]): string {
  const c = secondaryColorFor(names);
  return c
    ? `**Color secundario del producto: ${c}** (tono \`secondary\` en Halo, Curve). Solo en elementos gráficos, nunca en texto; como máximo el 10 % de cada diapositiva (el validador lo mide). Los colores de marca siguen dominando.`
    : '**Color secundario: ninguno asignado** para el producto de esta publicación en la guía de redes sociales de BTL. No uses el tono `secondary`; usa `sky`, `white` o `enterprise`.';
}

// `directions`: the art directions assigned by the app (design kinds; server/design/directions.ts), in slot order.
export function buildPrompt(kind: PromptKind, ctx: GenerationContext, revision?: RevisionInput, directions: Direction[] = [], copyReq?: CopyRequest): BuiltPrompt {
  const design = kind === 'propose' || kind === 'design_revise';
  const copy = kind === 'copy';
  const files = [
    ...SYSTEM_SETS[kind].map((id) => loadPrompt(path.join(PROMPTS_DIR, 'system', `${id}.md`))),
    loadPrompt(abs(ctx.editorialPrompt)),
  ];
  // The direction bank is not sent whole (only the assigned entries go in the brief) but its version is recorded.
  const bank = design ? loadPrompt(BANK_FILE()) : null;
  for (const f of bank ? [...files, bank] : files) repo.recordPromptVersion(f.id, f.version, f.sha256, f.path);
  const versions = Object.fromEntries((bank ? [...files, bank] : files).map((f) => [f.id, `${f.version}@${f.sha256.slice(0, 8)}`]));

  const p = ctx.publication;
  // Embedded knowledge files: drop their front matter and nest their headings under the section heading.
  const embed = (text: string) => text.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^(#{1,4}) /gm, '$1## ').trim();
  const section = (title: string, body: string) => `## ${title}\n\n${body.trim()}\n`;
  const products = ctx.products.length
    ? ctx.products
        .map(({ product, approvedClaims, excerpt, documentation }) =>
          [
            `### ${product.name} (id: ${product.id})`,
            `- Estado: ${product.review_status === 'pending_review' ? 'creado por el usuario, PENDIENTE DE REVISIÓN' : 'catálogo'}`,
            `- approved_claims: ${approvedClaims.length ? approvedClaims.map((c) => `"${c}"`).join('; ') : '[] (vacío: ninguna afirmación clínica aprobada)'}`,
            documentation ? `- Documentación original: ${documentation}` : '',
            '- Registro del catálogo (btl_products.json):',
            '```json',
            JSON.stringify(product.data, null, 2),
            '```',
            excerpt ? `- Extractos de la documentación (${excerpt.path}):\n\n${embed(excerpt.text)}` : '- Sin extractos de documentación.',
          ].filter(Boolean).join('\n')
        )
        .join('\n\n')
    : 'La publicación no está asociada a ningún producto. No menciones características de equipos.';

  const assets = ctx.assets
    .map((a) => `- \`${a.path}\` · ${a.kind}${a.product ? ` · ${a.product}` : ''}${a.width ? ` · ${a.width}×${a.height}px` : ''}`)
    .join('\n');
  const documents = ctx.documents.length
    ? ctx.documents.map((d) => `- \`${d.path}\` (${d.filename}, ${Math.round(d.size / 1024)} KB)`).join('\n')
    : 'Ninguno.';

  const feedback = repo
    .listRevisions(p.id)
    .reverse()
    .map((r) => `- ${r.created_at.slice(0, 10)}: "${r.instruction}"`)
    .join('\n');
  const TITLES = { generate: 'generar un carrusel nuevo', revise: 'revisar un carrusel existente', propose: `tres propuestas creativas de ${p.format === 'single_image' ? 'una imagen única' : 'un carrusel'}`, design_revise: 'revisar una propuesta de diseño', copy: 'proponer textos para elegir (paso 1, Mensaje)' };
  const roles = narrative(p);
  const qb = p.brief;
  // Step 1: the slides that need options, the options already shown to Jaime (not to be repeated) and his comment.
  const wanted = copy ? roles.map((r, i) => ({ ...r, slide: i + 1 })).filter((r) => !copyReq?.slide || r.slide === copyReq.slide) : [];
  const shown = copy ? repo.listCopyOptions(p.id).filter((o) => wanted.some((w) => w.slide === o.slide)) : [];

  const user = [
    `# Encargo: ${TITLES[kind]}`,
    section(
      'Brief de la publicación',
      [
        `- Marca (cliente): ${ctx.brand.name} — firma en las piezas: "${ctx.brand.signature}"`,
        `- Fecha de publicación: ${p.date}`,
        `- Tema: ${p.topic}`,
        `- Formato: ${FORMATS[p.format] ?? p.format} · ${p.format === 'single_image' ? 1 : p.slide_count} diapositiva(s) de 1080 × 1350 px`,
        `- Objetivo de marketing: ${p.objective}`,
        qb?.audience ? `- A quién le habla: ${qb.audience}` : '',
        qb?.angle ? `- Ventaja principal para la clínica (el ángulo del carrusel): ${qb.angle}` : '',
        qb?.tone ? `- Tono: ${qb.tone}` : '',
        qb?.avoid ? `- Qué evitar: ${qb.avoid}` : '',
        p.deadline ? `- Fecha límite de producción: ${p.deadline}` : '',
      ].filter(Boolean).join('\n')
    ),
    section(
      `Estructura ${p.format === 'single_image' ? 'de la pieza' : 'del carrusel'} (fija para todas las publicaciones de la marca)`,
      `${structureMarkdown(p)}\n\nEs la estructura de siempre: no hace falta que el usuario la explique y no la cambies salvo que sus instrucciones lo pidan.`
    ),
    section('Instrucciones creativas del usuario', p.creative_instructions || 'Ninguna.'),
    section('Preferencias editoriales activas (obligatorias)', ctx.preferences.map((x) => `- ${x}`).join('\n') || 'Ninguna.'),
    section(`Manual de marca — resumen (${ctx.guideline.summaryPath}, fuente: ${ctx.guideline.path})`, embed(ctx.guideline.text)),
    section('Productos seleccionados', products),
    copy ? '' : section('Imágenes y logos disponibles (usa solo estas rutas)', assets),
    copy ? '' : design
      ? section(
          'Sistema de diseño BTL — componentes disponibles (design-system/btl)',
          `Cada diapositiva es un \`Slide\` con ${Object.entries(SLIDE_PROPS).map(([k, v]) => `\`${k}\`: ${v}`).join('; ')}.\nSus hijos son nodos de este catálogo (cualquier otra prop se rechaza):\n\n${catalogMarkdown()}\n\n${secondaryNote(ctx.products.map((x) => x.product.name))}`
        )
      : section('Iconos disponibles', ctx.icons.map((i) => `\`${i}\``).join(', ')),
    design || copy ? '' : section('Propiedades permitidas en `style`', ctx.styleProps.join(', ')),
    design ? section('Ilustraciones disponibles', libraryMarkdown()) : '',
    directions.length
      ? section(
          kind === 'propose' ? 'Direcciones de arte asignadas a esta ronda (elegidas por la app)' : 'Dirección de arte de esta propuesta',
          `${kind === 'propose' ? 'La app rota un banco de direcciones para no repetir las de rondas anteriores. Propuesta A = primera, B = segunda, C = tercera; usa estos nombres en `direction_name`.\n\n' : ''}${directions
            .map((d, i) => `### ${kind === 'propose' ? `${'ABC'[i]} · ` : ''}${d.name}\n\n${d.body}`)
            .join('\n\n')}`
        )
      : '',
    kind === 'propose' ? section('Diseños anteriores de la marca (no repitas estas estructuras ni estos ganchos)', pastDesigns(ctx)) : '',
    design || copy ? section('Comentarios previos de Jaime en esta publicación (respétalos)', feedback || 'Ninguno.') : '',
    p.approved_copy && !copy ? section('Textos aprobados (paso 1, Mensaje)', approvedSection(p.approved_copy, kind)) : '',
    copy
      ? section(
          'Diapositivas a proponer',
          `${wanted.map((w) => `- Diapositiva ${w.slide} · ${w.label}: **${w.options} opciones**. ${w.guide}`).join('\n')}${copyReq?.instruction ? `\n\n**Comentario de Jaime sobre las opciones anteriores:** "${copyReq.instruction}"` : ''}${p.approved_copy && copyReq?.slide ? `\n\nLas demás diapositivas ya tienen texto aprobado; la nueva opción debe encajar con ellos:\n${p.approved_copy.slides.filter((s) => s.slide !== copyReq.slide).map((s) => `- Diapositiva ${s.slide}:\n${copyText(s)}`).join('\n')}` : ''}`
        ) +
        '\n' +
        section(
          'Textos ya propuestos (no los repitas ni los parafrasees)',
          shown.length ? shown.map((o) => `- Diapositiva ${o.slide}: "${o.headline.replace(/\n/g, ' ')}"${o.support ? ` / "${o.support.replace(/\n/g, ' ')}"` : ''}`).join('\n') : 'Ninguno todavía.'
        )
      : '',
    section('Documentos adjuntos por el usuario', documents),
    section(
      'Referencias editoriales',
      [
        ctx.references.exemplar && !design && !copy
          ? `Ejemplo aprobado del formato y el tono (${ctx.references.exemplar.path}); no copies sus textos:\n\n\`\`\`json\n${ctx.references.exemplar.json}\n\`\`\``
          : '',
        ctx.references.recent.length ? `Publicaciones recientes de la marca (evita repetir ganchos):\n${ctx.references.recent.map((r) => `- ${r}`).join('\n')}` : '',
        ctx.references.folders.length ? `Carpetas de referencias visuales en public/assets/brands/btl/references: ${ctx.references.folders.join(', ')}` : '',
      ].filter(Boolean).join('\n\n')
    ),
    section('Fuentes consultables', ctx.sources.map((s) => `- ${s}`).join('\n')),
    revision
      ? section(
          design ? 'Propuesta actual' : 'Versión actual',
          `\`\`\`json\n${JSON.stringify(revision.current, null, 2)}\n\`\`\``
        ) +
        '\n' +
        section(
          'Solicitud de cambios de Jaime',
          `- Alcance: ${revision.target}${revision.slideNumber ? ` (diapositiva ${revision.slideNumber})` : ''}${revision.fixedSlides?.length ? `\n- **No cambies las diapositivas ${revision.fixedSlides.join(', ')}**: Jaime las aprobó o no están en esta solicitud. Devuélvelas idénticas (mismos nodos y props); la app las restaura igualmente.` : ''}\n- Solicitud: "${revision.instruction}"`
        )
      : '',
    section(
      'Entrega',
      kind === 'generate'
        ? `Devuelve el objeto JSON del esquema: \`concept\`, \`content\` (con exactamente ${p.format === 'single_image' ? 1 : p.slide_count} diapositivas), \`claims\` y \`warnings\`. Todo el texto en español.`
        : kind === 'revise'
          ? 'Devuelve el objeto JSON del esquema: `concept`, `content` completo revisado, `claims`, `warnings`, `summary` y `changed_slides`. Todo el texto en español.'
          : kind === 'propose'
            ? `Devuelve el objeto JSON del esquema: \`proposals\` (exactamente tres: A, B y C, cada una con ${p.format === 'single_image' ? 1 : p.slide_count} diapositivas, caption, fuentes y afirmaciones) y \`warnings\`. Todo el texto en español.`
            : kind === 'copy'
              ? `Devuelve el objeto JSON del esquema: \`angle\`, \`slides\` (una entrada por cada diapositiva de "Diapositivas a proponer", con su número en \`slide\` y el número de opciones indicado) y \`warnings\`. Cada opción lleva sus afirmaciones en \`claims\`. Todo el texto en español.`
              : 'Devuelve el objeto JSON del esquema: `proposal` completa revisada (misma dirección), `summary`, `changed_slides` y `warnings`. Todo el texto en español.'
    ),
  ].filter(Boolean).join('\n');

  const system = files.map((f) => `<!-- ${f.id} v${f.version} -->\n${f.body}`).join('\n\n---\n\n');
  return { system, user, versions };
}
