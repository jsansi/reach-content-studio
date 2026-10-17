// Creative proposals composed from the BTL design system (design-system/btl). A slide is a flat list of
// component nodes (parent ids instead of nesting, so the schema is non-recursive and works with structured
// outputs); props travel as a JSON string and are checked against design-system/btl/catalog.mjs.
import { z } from 'zod';
import { CATALOG } from '../design-system/btl/catalog.mjs';
import { Claim } from './schema.ts';

export const COMPONENTS = Object.keys(CATALOG) as [string, ...string[]];
export const BACKGROUNDS = ['dark', 'blue', 'enterprise', 'deep', 'light', 'white'] as const;
export const CORNERS = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const;

export const DesignNode = z.object({
  id: z.string().describe('Unique id within the slide, e.g. "n3"'),
  parent: z.string().nullable().describe('id of a container node (Region, Stack, ModuleGrid, Module), or null for a direct child of the slide'),
  type: z.enum(COMPONENTS).describe('Design-system component'),
  props: z.string().describe('JSON object with the component props, e.g. {"top":290,"right":"m","gap":24}. Use "{}" for none.'),
  text: z.string().nullable().describe('Text for text components (Headline, Body, Eyebrow, Footnote, DatePill, SwipeCue); null for the rest. "\\n" = line break.'),
});

export const DesignSlide = z.object({
  purpose: z.string().describe('What this slide does in the narrative (Spanish, one line)'),
  background: z.enum(BACKGROUNDS),
  lightFrom: z.enum(CORNERS).nullable().describe('Gradient light corner; null = default'),
  alt: z.string().describe('Accessible description of the whole slide in Spanish, including its text'),
  nodes: z.array(DesignNode).describe('Children of the slide, back to front. Exactly one BtlLogo.'),
});

export const Proposal = z.object({
  direction: z.enum(['A', 'B', 'C']).describe('Slot of the art direction assigned in the brief'),
  direction_name: z.string().describe('Name of the assigned art direction (Spanish)'),
  concept: z.string().describe('Creative concept in 1–3 sentences (Spanish)'),
  differentiation: z.string().describe('How composition, hierarchy, image prominence and negative space differ from the other proposals (Spanish)'),
  slides: z.array(DesignSlide),
  caption: z.string().describe('Instagram caption in Spanish, ≈500 characters, CTA by DM "DEMO", ~5 hashtags'),
  sources: z.array(z.string()).describe('Files actually used'),
  claims: z.array(Claim).describe('Every technical, medical or commercial statement used, with its source and approval level'),
});

export const ProposalsResult = z.object({
  concepts_explored: z
    .array(z.string())
    .optional()
    .describe('6–8 genuinely different creative concepts considered before composing, one line each (Spanish); the three proposals develop the three most different ones'),
  proposals: z.array(Proposal).describe('Exactly three proposals: A, B and C'),
  warnings: z.array(z.string()).describe('Missing data, unverifiable claims or compliance doubts (Spanish)'),
});

export const DesignRevisionResult = z.object({
  proposal: Proposal.describe('The complete revised proposal (same direction)'),
  summary: z.string().describe('What changed and why (Spanish)'),
  changed_slides: z.array(z.number().int()).describe('1-based numbers of the slides that changed'),
  warnings: z.array(z.string()),
});

export type DesignNodeT = z.infer<typeof DesignNode>;
export type DesignSlideT = z.infer<typeof DesignSlide>;
export type ProposalT = z.infer<typeof Proposal>;
export type ProposalsResultT = z.infer<typeof ProposalsResult>;
export type DesignRevisionResultT = z.infer<typeof DesignRevisionResult>;

// What a design version stores in versions.content_json. direction_id: entry of the art-direction bank
// (prompts/system/creative-directions.md) assigned by the app; missing in proposals made before the bank.
// locked_slides: 1-based slides Jaime approved one by one; revisions and edits never change them, and every
// version derived from this one keeps the list.
export type DesignContentT = Omit<ProposalT, 'claims'> & { direction_id?: string; locked_slides?: number[] };

const TEXT_PROPS = ['title', 'label', 'text', 'value', 'detail', 'signature', 'date', 'occasion', 'alt'];

// Every human-readable string in a proposal (for brand-naming and claim checks).
export function designTexts(p: Pick<ProposalT, 'slides' | 'caption'>): string[] {
  const out: string[] = [p.caption];
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string' && TEXT_PROPS.includes(key)) out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k));
  };
  for (const s of p.slides) {
    out.push(s.alt);
    for (const n of s.nodes) {
      if (n.text) out.push(n.text);
      try {
        walk(JSON.parse(n.props));
      } catch { /* reported by the structural check */ }
    }
  }
  return out;
}
