// Direct edits of a chosen design proposal, without AI (step 3 "Ajustes"): change a text, its weight, size or
// colour tone, and move slides between versions. Shared by the API (validation + apply) and the web editor.
// Kept free of the design-system catalog import so the browser bundle stays small.
import type { DesignSlideT } from './design.ts';

export const WEIGHTS = ['thin', 'light', 'regular', 'semibold'] as const;
export const TONES = ['strong', 'base', 'accent'] as const;
export type Weight = (typeof WEIGHTS)[number];
export type Tone = (typeof TONES)[number];

export const WEIGHT_LABELS: Record<Weight, string> = { thin: 'Fina', light: 'Ligera', regular: 'Regular', semibold: 'Seminegrita' };
// The tone colour depends on the background: on dark slides strong/base are white and accent is Sky Blue; on
// light slides strong/accent are Enterprise Blue and base is Dark Blue.
export const TONE_LABELS: Record<Tone, string> = { strong: 'Principal', base: 'Texto', accent: 'Acento (celeste / azul)' };

// Sizes from smallest to largest, per component (catalog: Headline display/xl/l/m/s, Body l/m/s, Eyebrow 30–44).
export const SIZE_STEPS: Record<string, (string | number)[]> = {
  Headline: ['s', 'm', 'l', 'xl', 'display'],
  Body: ['s', 'm', 'l'],
  Eyebrow: [30, 32, 34, 36, 38, 40, 42, 44],
};
export const SIZE_PX: Record<string, Record<string, number>> = {
  Headline: { s: 48, m: 60, l: 76, xl: 96, display: 116 },
  Body: { s: 30, m: 34, l: 42 },
};
// Default prop values of each component (design-system/btl/src/parts.tsx), used when a node doesn't set them.
const DEFAULTS: Record<string, { size?: string | number; weight?: Weight; tone?: Tone }> = {
  Headline: { size: 'm', tone: 'strong' },
  Body: { size: 'm', tone: 'base' },
  Eyebrow: { size: 30, weight: 'semibold', tone: 'accent' },
  Footnote: { tone: 'base' },
};
const HEADLINE_WEIGHT: Record<string, Weight> = { display: 'semibold', xl: 'light', l: 'light', m: 'light', s: 'light' };
const BODY_WEIGHT: Record<string, Weight> = { l: 'light', m: 'regular', s: 'regular' };

export const TEXT_TYPES = ['Headline', 'Body', 'Eyebrow', 'Footnote', 'DatePill', 'SwipeCue'] as const;
export const TYPE_LABELS: Record<string, string> = {
  Headline: 'Titular', Body: 'Texto', Eyebrow: 'Etiqueta', Footnote: 'Nota al pie', DatePill: 'Fecha (pastilla)', SwipeCue: '“Desliza”', CtaBlock: 'Llamada a la acción',
};
// Which style controls each component accepts (catalog props).
export const CONTROLS: Record<string, { size: boolean; weight: boolean; tone: boolean }> = {
  Headline: { size: true, weight: true, tone: true },
  Body: { size: true, weight: true, tone: true },
  Eyebrow: { size: true, weight: true, tone: true },
  Footnote: { size: false, weight: false, tone: true },
  DatePill: { size: false, weight: false, tone: false },
  SwipeCue: { size: false, weight: false, tone: false },
  CtaBlock: { size: false, weight: false, tone: false },
};

export interface EditableText {
  node: string;
  type: string;
  text: string;
  size: string | number | null;
  weight: Weight | null;
  tone: Tone | null;
}

export interface NodeEdit {
  node: string;
  text?: string;
  size?: string | number;
  weight?: Weight;
  tone?: Tone;
}

const props = (s: string): Record<string, any> => {
  try {
    return JSON.parse(s) ?? {};
  } catch {
    return {};
  }
};

// Effective weight when the node doesn't set one (the size decides it for headlines and body copy).
function effectiveWeight(type: string, p: Record<string, any>): Weight | null {
  if (p.weight) return p.weight;
  if (type === 'Headline') return HEADLINE_WEIGHT[p.size ?? 'm'] ?? 'light';
  if (type === 'Body') return BODY_WEIGHT[p.size ?? 'm'] ?? 'regular';
  return DEFAULTS[type]?.weight ?? null;
}

// Text nodes of a slide that can be edited directly, with their current style (defaults filled in).
export function editableTexts(slide: DesignSlideT): EditableText[] {
  const out: EditableText[] = [];
  for (const n of slide.nodes) {
    const p = props(n.props);
    if ((TEXT_TYPES as readonly string[]).includes(n.type) && n.text !== null) {
      const c = CONTROLS[n.type];
      out.push({
        node: n.id, type: n.type, text: n.text,
        size: c.size ? p.size ?? DEFAULTS[n.type]?.size ?? null : null,
        weight: c.weight ? effectiveWeight(n.type, p) : null,
        tone: c.tone ? p.tone ?? DEFAULTS[n.type]?.tone ?? null : null,
      });
    } else if (n.type === 'CtaBlock') {
      out.push({ node: n.id, type: 'CtaBlock', text: typeof p.title === 'string' && p.title ? p.title : p.detail ?? 'Solicita tu demo', size: null, weight: null, tone: null });
    }
  }
  return out;
}

// Applies the edits to a copy of the slide. Throws a Spanish message for anything the component doesn't accept.
export function applyNodeEdits(slide: DesignSlideT, edits: NodeEdit[]): DesignSlideT {
  const out: DesignSlideT = JSON.parse(JSON.stringify(slide));
  for (const e of edits) {
    const n = out.nodes.find((x) => x.id === e.node);
    if (!n) throw new Error(`No existe el elemento ${e.node} en esta diapositiva.`);
    const c = CONTROLS[n.type];
    if (!c) throw new Error(`El elemento ${e.node} (${n.type}) no es un texto editable.`);
    const p = props(n.props);
    if (e.text !== undefined) {
      const t = e.text.replace(/\r\n/g, '\n').trim();
      if (!t) throw new Error(`El ${TYPE_LABELS[n.type]?.toLowerCase() ?? 'texto'} no puede quedar vacío.`);
      if (n.type === 'CtaBlock') {
        if (typeof p.title === 'string' && p.title) p.title = t;
        else p.detail = t;
      } else n.text = t;
    }
    if (e.size !== undefined) {
      if (!c.size || !SIZE_STEPS[n.type].some((x) => String(x) === String(e.size))) throw new Error(`Tamaño no válido para ${TYPE_LABELS[n.type]}.`);
      p.size = n.type === 'Eyebrow' ? Number(e.size) : e.size;
    }
    if (e.weight !== undefined) {
      if (!c.weight || !WEIGHTS.includes(e.weight)) throw new Error(`Peso no válido para ${TYPE_LABELS[n.type]}.`);
      p.weight = e.weight;
    }
    if (e.tone !== undefined) {
      if (!c.tone || !TONES.includes(e.tone)) throw new Error(`Color no válido para ${TYPE_LABELS[n.type]}.`);
      p.tone = e.tone;
    }
    n.props = JSON.stringify(p);
  }
  return out;
}

// 1-based slide a claim belongs to ("diapositiva 3", "slide 3"), or null (caption, general).
export const claimSlide = (location: string): number | null => {
  const m = location.match(/(?:diapositiva|slide)\s*(\d+)/i);
  return m ? Number(m[1]) : null;
};
