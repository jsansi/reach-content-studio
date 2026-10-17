// Deterministic checks on top of the renderer's layout checks: structure, assets, icons and editorial rules.
import fs from 'node:fs';
import { availableIcons } from '../../studio/engine.js';
import { abs } from '../paths.ts';
import { CarouselContent, type CarouselContentT, type ClaimT } from '../../shared/schema.ts';
import type { RenderProblem } from '../../studio/engine.js';
import type { Validation } from '../../shared/types.ts';
import type { ProductContext } from './context.ts';
import { designTexts, type ProposalT } from '../../shared/design.ts';
import type { RenderedProposal } from '../design/render.ts';

// Errors here stop the job before rendering: the content cannot be drawn as is.
export function checkRenderable(content: unknown): CarouselContentT {
  const parsed = CarouselContent.safeParse(content);
  if (!parsed.success)
    throw new Error(`El contenido no tiene la estructura esperada:\n${parsed.error.issues.slice(0, 8).map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n')}`);
  const c = parsed.data;
  if (!c.slides.length) throw new Error('El carrusel no tiene diapositivas.');
  const icons = new Set(availableIcons());
  const errors: string[] = [];
  const exists = (p: string | undefined, where: string) => p && !fs.existsSync(abs(p)) && errors.push(`${where}: no existe la imagen ${p}`);
  // Every image path anywhere in a slide (src, image, productLogo) must exist.
  const paths = (o: unknown): string[] =>
    Array.isArray(o) ? o.flatMap(paths)
      : o && typeof o === 'object' ? Object.entries(o).flatMap(([k, x]) => (['src', 'image', 'productLogo'].includes(k) && typeof x === 'string' ? [x] : paths(x)))
      : [];
  c.slides.forEach((s, i) => {
    const n = `Diapositiva ${i + 1}`;
    paths(s).forEach((p) => exists(p, n));
    if (s.layout === 'product' && !s.images?.length && !s.image) errors.push(`${n}: el layout de producto necesita una imagen.`);
    if (s.layout === 'hero' && !s.image) errors.push(`${n}: el layout hero necesita una imagen.`);
    if (s.layout === 'split' && !s.image) errors.push(`${n}: el layout split necesita una imagen.`);
    if (s.layout === 'benefits') s.benefits.forEach((b) => !icons.has(b.icon) && errors.push(`${n}: icono "${b.icon}" no disponible (${[...icons].join(', ')})`));
  });
  if (errors.length) throw new Error(errors.join('\n'));
  return c;
}

const RENDER_MESSAGES: [RegExp, (...m: string[]) => string][] = [
  [/^overflow in (.+)$/, (s) => `texto desbordado en ${s}`],
  [/^text below (\d+)px in (.+) \((.+)\)$/, (min, s, size) => `texto menor de ${min} px en ${s} (${size})`],
  [/^text clipped at the edge in (.+)$/, (s) => `texto cortado en el borde del lienzo (${s})`],
  [/^(.+) overlaps (.+)$/, (a, b) => `elementos superpuestos: ${a} y ${b}`],
  [/^(.+) outside slide$/, (s) => `elemento fuera del lienzo: ${s}`],
  [/^(.+) inside logo safe zone$/, (s) => `${s} invade la zona de seguridad del logo`],
  [/^logo closer than 2 units to the border$/, () => 'logo a menos de 2 unidades del borde'],
  [/^PNG is (.+), expected (.+)$/, (got, exp) => `dimensiones ${got}, se esperaba ${exp}`],
  [/^image runs under \.h-title$/, () => 'la imagen queda detrás del titular; súbela o reduce su tamaño'],
];
const translate = (p: RenderProblem) => {
  for (const [re, f] of RENDER_MESSAGES) {
    const m = p.message.match(re);
    if (m) return `Diapositiva ${p.slide}: ${f(...m.slice(1))}`;
  }
  return `Diapositiva ${p.slide}: ${p.message}`;
};

const texts = (c: CarouselContentT): string[] => {
  const out: string[] = [c.caption];
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string' && !['layout', 'src', 'image', 'productLogo', 'icon', 'illustration', 'selector', 'property', 'value', 'theme'].includes(key)) out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k));
  };
  c.slides.forEach((s) => walk(s));
  return out;
};

export function buildValidation(
  content: CarouselContentT,
  renderProblems: RenderProblem[],
  opts: { claims: ClaimT[]; products: ProductContext[]; expectedSlides: number; warnings?: string[] }
): Validation {
  const problems = renderProblems.map(translate);
  const notes: string[] = [];
  const all = texts(content).join('\n');
  if (/BTL Medical/i.test(all)) problems.push('Nombre de marca: en las piezas se usa "BTL El Salvador", no "BTL Medical".');
  if (/\b\d+\+|más de \d+/i.test(all)) notes.push('Formato de cifra: la preferencia es "+100", no "100+" ni "más de 100".');
  if (content.slides.length !== opts.expectedSlides)
    notes.push(`El brief pide ${opts.expectedSlides} diapositiva(s) y el carrusel tiene ${content.slides.length}.`);
  if (content.caption.length > 900) notes.push(`Caption de ${content.caption.length} caracteres; la preferencia es ≈ 500.`);

  const approved = new Set(opts.products.flatMap((p) => p.approvedClaims.map((c) => c.toLowerCase())));
  for (const c of opts.claims) {
    if (c.approval === 'approved_claim' && !approved.has(c.claim.toLowerCase()))
      problems.push(`Afirmación marcada como aprobada sin estar en approved_claims: «${c.claim}» (${c.location}).`);
    if (!c.source?.trim()) problems.push(`Afirmación sin fuente: «${c.claim}» (${c.location}).`);
  }
  if (opts.claims.some((c) => c.approval === 'manufacturer_description'))
    notes.push('Hay descripciones del fabricante sin aprobación clínica formal (ver Fuentes).');
  for (const w of opts.warnings ?? []) notes.push(w);
  return { status: problems.length ? 'warnings' : 'passed', problems, notes };
}

// ---------- design-system proposals ----------
// Visual validation (from the renderer) and claim / brand-copy verification are kept in separate sections.
export function buildDesignValidation(
  p: ProposalT,
  r: Pick<RenderedProposal, 'issues' | 'notes' | 'autofixes'>,
  opts: { products: ProductContext[]; expectedSlides: number; warnings?: string[] }
): Validation {
  const problems = r.issues.flatMap((list, i) => list.map((m) => `Diapositiva ${i + 1}: ${m}`));
  const claimProblems: string[] = [];
  const claimNotes: string[] = [];
  const all = designTexts(p).join('\n');
  if (/BTL Medical|BTL Est[ée]tica/i.test(all)) claimProblems.push('Nombre de marca: en las piezas se usa "BTL El Salvador", no "BTL Medical" ni "BTL Estética".');
  if (/\bEXION\b/i.test(all)) claimProblems.push('Se menciona EXION: en las piezas de EMFEMME 360 solo se nombra "EMFEMME 360".');
  if (/\b\d+\+|más de \d+/i.test(all)) claimNotes.push('Formato de cifra: la preferencia es "+100", no "100+" ni "más de 100".');
  if (p.slides.length !== opts.expectedSlides) claimNotes.push(`El brief pide ${opts.expectedSlides} diapositiva(s) y la propuesta tiene ${p.slides.length}.`);
  if (p.caption.length > 900) claimNotes.push(`Caption de ${p.caption.length} caracteres; la preferencia es ≈ 500.`);
  const approved = new Set(opts.products.flatMap((x) => x.approvedClaims.map((c) => c.toLowerCase())));
  for (const c of p.claims) {
    if (c.approval === 'approved_claim' && !approved.has(c.claim.toLowerCase()))
      claimProblems.push(`Afirmación marcada como aprobada sin estar en approved_claims: «${c.claim}» (${c.location}).`);
    if (!c.source?.trim()) claimProblems.push(`Afirmación sin fuente: «${c.claim}» (${c.location}).`);
  }
  if (p.claims.some((c) => c.approval === 'manufacturer_description')) claimNotes.push('Hay descripciones del fabricante sin aprobación clínica formal (ver Fuentes y afirmaciones).');
  for (const w of opts.warnings ?? []) claimNotes.push(w);
  return {
    status: problems.length || claimProblems.length ? 'warnings' : 'passed',
    problems,
    notes: r.notes,
    design: { status: problems.length ? 'needs_review' : 'passed', slides: r.issues, autofixes: r.autofixes },
    claim_checks: { problems: claimProblems, notes: claimNotes },
  };
}
