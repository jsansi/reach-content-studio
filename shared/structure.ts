// Fixed narrative of every publication and the texts Jaime approves before the visual proposals (step 1 "Mensaje").
// A carousel with a product is always: 1 hook · 2 the equipment · 3 advantages for the clinic + CTA (middle slides of a
// longer carousel develop the equipment). Shared by the prompt builder, the pipeline, task:check and the web app.
import { z } from 'zod';
import { Claim } from './schema.ts';
import type { Publication } from './types.ts';

export interface SlideRole {
  role: 'hook' | 'equipo' | 'ventajas' | 'desarrollo' | 'cierre' | 'pieza';
  label: string; // Spanish, shown in the UI
  hint: string; // one line for the UI
  guide: string; // what the slide does (Spanish; also sent to the model)
  options: number; // how many text options step 1 proposes for it
}

const HOOK: SlideRole = {
  role: 'hook', label: 'Hook', options: 8, hint: 'Detiene el scroll y conecta con la ventaja para la clínica. La fecha va en segundo plano.',
  guide: 'Gancho que detiene el scroll, en primer plano; la fecha y el nombre del día en segundo plano. Abre una brecha de curiosidad que conecta con la ventaja para la clínica o el profesional que compra el equipo, y que la diapositiva 2 resuelve. `support`: pregunta o subtítulo breve que invita a deslizar (opcional).',
};
const EQUIPO: SlideRole = {
  role: 'equipo', label: 'Equipo', options: 4, hint: 'Responde al hook: el equipo (logo y fotos) y las ventajas de usarlo.',
  guide: 'Responde al gancho presentando el equipo (logo y fotos oficiales): qué permite hacer y las ventajas de usarlo, sin detalles técnicos. `headline`: idea principal; `support`: una o dos frases breves; `points`: 0–3 ventajas de uso (opcional).',
};
const VENTAJAS: SlideRole = {
  role: 'ventajas', label: 'Ventajas para la clínica', options: 4, hint: 'Lo que gana la clínica, con 3 ventajas. El CTA "Solicita tu demo" se añade solo.',
  guide: 'Lo que gana la clínica o el profesional que tiene el equipo, conectado con el gancho, y el CTA "Solicita tu demo" (fijo, no lo escribas). `headline`: título de ≤ 2 líneas; `points`: exactamente 3 ventajas {title ≤ 30 caracteres, text ≤ 70}.',
};

export function narrative(p: Pick<Publication, 'format' | 'slide_count' | 'product_ids'>): SlideRole[] {
  const product = p.product_ids.length > 0;
  if (p.format === 'single_image')
    return [{
      role: 'pieza', label: 'Pieza única', options: 6, hint: product ? 'Gancho, equipo y demo en una sola pieza.' : 'Homenaje: el día y una frase breve.',
      guide: product
        ? 'Una sola pieza que se entiende sin deslizar: gancho, el equipo y la invitación a pedir la demo. `headline`: el gancho; `support`: una frase sobre el equipo o la ventaja para la clínica.'
        : 'Homenaje a la fecha: el nombre del día y una frase breve. `headline`: la frase; `support`: opcional. Sin CTA ni características de equipos.',
    }];
  const n = Math.max(1, p.slide_count);
  if (n === 1) return [HOOK];
  const middle = product ? EQUIPO : { ...EQUIPO, role: 'desarrollo' as const, label: 'Desarrollo', hint: 'Responde al hook con el argumento principal.', guide: 'Responde al gancho con el argumento principal. `headline` + `support`; `points` opcionales.' };
  const last = product ? VENTAJAS : { ...VENTAJAS, role: 'cierre' as const, label: 'Cierre', hint: 'La idea que queda y la llamada a la acción.', guide: 'Cierre con la idea que queda y, si aplica, la llamada a la acción. `headline` + `support` o `points`.' };
  return [HOOK, ...Array.from({ length: n - 2 }, () => middle), last];
}

export function structureMarkdown(p: Pick<Publication, 'format' | 'slide_count' | 'product_ids'>): string {
  return narrative(p).map((r, i) => `${i + 1}. **${r.label}** — ${r.guide}`).join('\n');
}

export const CopyPoint = z.object({ title: z.string(), text: z.string() });

export const CopyOption = z.object({
  headline: z.string().describe('Main text of the slide; "\\n" for line breaks'),
  support: z.string().nullable().describe('Supporting line (question, subtitle or body), or null'),
  points: z.array(CopyPoint).describe('Advantages {title, text}; empty when the slide has none'),
  rationale: z.string().describe('Why it works and how it connects with the other slides (Spanish, one line)'),
  claims: z.array(Claim).describe('Every product or medical statement in this option, with its source'),
});

export const CopyResult = z.object({
  angle: z.string().describe('The angle chosen for the whole carousel (Spanish, one line)'),
  slides: z.array(z.object({
    slide: z.number().int().describe('1-based slide number'),
    options: z.array(CopyOption),
  })).describe('Options for each requested slide'),
  warnings: z.array(z.string()),
});

export type CopyPointT = z.infer<typeof CopyPoint>;
export type CopyOptionT = z.infer<typeof CopyOption>;
export type CopyResultT = z.infer<typeof CopyResult>;

// One proposed option as stored (table copy_options).
export interface StoredCopyOption extends CopyOptionT {
  id: number;
  slide: number;
  job_id: number;
  created_at: string;
}

// The texts Jaime approved, one entry per slide (publications.approved_copy_json).
export interface ApprovedSlide {
  slide: number;
  role: SlideRole['role'];
  headline: string;
  support: string | null;
  points: CopyPointT[];
  claims: z.infer<typeof Claim>[];
}
export interface ApprovedCopy {
  slides: ApprovedSlide[];
  approved_at: string;
}

// Short publication brief asked when the publication is created, so the angle is set before generating.
export interface QuickBrief {
  audience: string;
  angle: string; // main advantage for the clinic
  tone: string;
  avoid: string;
}
export const TONES = ['Profesional y cercano', 'Inspirador y emotivo', 'Educativo', 'Directo y comercial'];
export const DEFAULT_AUDIENCE: Record<string, string> = {
  'btl-medical-sv': 'Fisioterapeutas, médicos rehabilitadores, clínicas y centros de rehabilitación',
  'btl-estetica-sv': 'Clínicas y médicos de medicina estética y ginecología',
};
export const emptyBrief = (brandId: string): QuickBrief => ({ audience: DEFAULT_AUDIENCE[brandId] ?? '', angle: '', tone: TONES[0], avoid: '' });

// ---------- checks: the approved texts must appear in the generated slides ----------
const norm = (s: string) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const needle = (s: string) => norm(s).replace(/[.。]+$/, '');

// Every visible string of a classic slide (alt texts and style overrides excluded).
export function classicSlideTexts(slide: unknown): string {
  const out: string[] = [];
  const walk = (v: unknown, key: string) => {
    if (['alt', 'imageAlt', 'style', 'layout', 'image', 'src', 'icon', 'productLogo', 'theme'].includes(key)) return;
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k));
  };
  walk(slide, '');
  return out.join(' \n ');
}

// Visible text of a design-system slide: node texts and text props (not the slide alt).
export function designSlideTexts(slide: { nodes: { text: string | null; props: string }[] }): string {
  const out: string[] = [];
  for (const n of slide.nodes) {
    if (n.text) out.push(n.text);
    try {
      const p = JSON.parse(n.props) as Record<string, unknown>;
      for (const k of ['title', 'label', 'text', 'value', 'detail']) if (typeof p[k] === 'string') out.push(p[k] as string);
    } catch { /* reported by the structural check */ }
  }
  return out.join(' \n ');
}

// Spanish messages for each approved text missing from its slide (`slideTexts[i]` = visible text of slide i + 1).
export function missingApprovedTexts(copy: ApprovedCopy, slideTexts: string[]): string[] {
  const problems: string[] = [];
  for (const s of copy.slides) {
    const hay = norm(slideTexts[s.slide - 1] ?? '');
    const want = [s.headline, s.support ?? '', ...s.points.flatMap((p) => [p.title, p.text])].filter((x) => x.trim());
    const missing = want.filter((w) => !hay.includes(needle(w)));
    if (missing.length) problems.push(`Diapositiva ${s.slide}: no aparece el texto aprobado ${missing.map((m) => `"${m.replace(/\n/g, ' ')}"`).join(', ')}.`);
  }
  return problems;
}
