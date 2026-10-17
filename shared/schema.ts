// Carousel content schema shared by the server, the AI providers and the task packages.
// It mirrors the shape of content/*.json consumed by studio/engine.js.
import { z } from 'zod';

const text = z.string();

// Per-slide visual adjustments (font size, position…) applied by the engine as scoped CSS.
export const StyleOverride = z.object({
  selector: z.string().describe('Class selector inside the slide, e.g. ".p-title" or ".b-item h3"'),
  property: z.string().describe('CSS property from the allowed list (font-size, width, top, …)'),
  value: z.string().describe('CSS value in px, %, em, or a plain number'),
});

export const PositionedImage = z.object({
  src: z.string().describe('Repo-relative path of an available image asset'),
  alt: text,
  label: text,
  left: z.number(),
  top: z.number(),
  width: z.number(),
  label_x: z.number(),
  label_y: z.number(),
});

export const CommemorationSlide = z.object({
  layout: z.literal('commemoration'),
  datePill: text.optional(),
  eyebrow: text.optional(),
  title: text.describe('Hook headline; use \\n for line breaks; **words** in SemiBold only on explicit request'),
  rule: z.boolean().optional().describe('Thin accent rule under the headline (on request)'),
  question: text.optional(),
  swipe: text.optional(),
  illustration: z.enum(['spine', 'bone', 'none']).optional().describe('"spine" draws the vertebral column (spine topics); "bone" draws a glowing porous femur (bone health, osteoporosis); "none" for any other topic'),
  alt: text,
  style: z.array(StyleOverride).optional(),
});

export const ProductSlide = z.object({
  layout: z.literal('product'),
  images: z.array(PositionedImage).optional().describe('Several images placed on the 1080×720 photo box'),
  image: z.string().optional().describe('Single photo path (used when images is absent)'),
  imageAlt: text.optional(),
  imageFrame: z.object({ width: z.number(), left: z.number(), top: z.number() }).optional(),
  productLogo: z.string().optional(),
  eyebrow: text,
  title: text,
  stat: z.object({ value: text, label: text }).optional(),
  body: text.optional(),
  swipe: text.optional(),
  alt: text,
  style: z.array(StyleOverride).optional(),
});

export const Benefit = z.object({ icon: z.string(), title: text, text: text });

export const BenefitsSlide = z.object({
  layout: z.literal('benefits'),
  title: text,
  rule: z.boolean().optional().describe('Thin accent rule under the headline (on request)'),
  benefits: z.array(Benefit),
  cta: text.optional(),
  signature: text.optional(),
  ctaBand: z.enum(['flat', 'glow']).optional().describe('CTA band background: flat Enterprise Blue (default) or "glow", the lit gradient of the dark slides'),
  alt: text,
  style: z.array(StyleOverride).optional(),
});

// ----- Layouts added in v2 (see prompts/system/carousel-content.md) -----
const Frame = z.object({
  left: z.number(), top: z.number(), width: z.number(),
  height: z.number().optional().describe('Crop the photo to this height (object-fit cover)'),
  focusY: z.number().optional().describe('With height: vertical part of the photo kept, 0 = top, 50 = centre, 100 = bottom'),
  fadeTop: z.number().optional().describe('Dissolve the top edge of the photo into the background over this many px'),
  fadeBottom: z.number().optional().describe('Dissolve the bottom edge of the photo into the background over this many px'),
  fadeLeft: z.number().optional().describe('Dissolve the left edge of the photo into the background over this many px'),
  fadeRight: z.number().optional().describe('Dissolve the right edge of the photo into the background over this many px'),
}).describe('Image position and width in px on the 1080×1350 canvas');
const Theme = z.enum(['dark', 'light']).optional().describe('Background: dark (default) or light');
const common = { swipe: text.optional(), alt: text, style: z.array(StyleOverride).optional() };

export const HeroSlide = z.object({
  layout: z.literal('hero'), theme: Theme,
  image: z.string(), imageAlt: text.optional(), imageFrame: Frame.optional(),
  extraImages: z.array(z.object({ image: z.string(), imageAlt: text.optional(), imageFrame: Frame }))
    .max(2).optional().describe('Up to two more photos in the image area (same rules as image: above the headline)'),
  datePill: text.optional(), eyebrow: text.optional(), title: text,
  body: text.optional().describe('Supporting text; **phrases** in SemiBold + corporate accent colour only on explicit request'),
  rule: z.boolean().optional().describe('Thin accent rule between headline and body (on request)'),
  lightFrom: z.enum(['left', 'right']).optional().describe('Light theme only: corner of the sky gradient (default left)'),
  pillColor: z.enum(['brand', 'pink']).optional().describe('Date pill background; "pink" (#ffb0d4) only on explicit request'),
  align: z.enum(['left', 'center']).optional().describe('Text alignment; "center" only when the user explicitly asks (brand manual p. 19 is left-aligned)'),
  ...common,
});
export const StatementSlide = z.object({
  layout: z.literal('statement'), theme: Theme,
  datePill: text.optional(), kicker: text.optional(), title: text.describe('Short statement; use \\n for line breaks'), body: text.optional(), ...common,
});
export const StatItem = z.object({
  image: z.string().optional().describe('Official figure badge image; the figure is shown exactly as supplied'),
  width: z.number().optional(), alt: text.optional(),
  value: text.optional(), label: text.optional(),
});
export const StatsSlide = z.object({
  layout: z.literal('stats'), theme: Theme,
  title: text, items: z.array(StatItem), note: text.optional().describe('Footnote with the source of the figures'), ...common,
});
export const SplitSlide = z.object({
  layout: z.literal('split'),
  image: z.string(), imageAlt: text.optional(), imageFrame: Frame.optional(), label: text.optional(),
  eyebrow: text.optional(), title: text, body: text.optional(), points: z.array(text).optional(), ...common,
});
export const StepsSlide = z.object({
  layout: z.literal('steps'),
  title: text, items: z.array(z.object({ title: text, text: text.optional() })),
  cta: text.optional(), signature: text.optional(), ...common,
});
export const CtaSlide = z.object({
  layout: z.literal('cta'), theme: z.enum(['dark', 'blue']).optional(),
  image: z.string().optional(), imageAlt: text.optional(), imageFrame: Frame.optional(),
  productLogo: z.string().optional(), productName: text.optional(),
  kicker: text.optional(), title: text, body: text.optional(), action: text.optional(), signature: text.optional(),
  alt: text, style: z.array(StyleOverride).optional(),
});

export const Slide = z.discriminatedUnion('layout', [
  CommemorationSlide, ProductSlide, BenefitsSlide, HeroSlide, StatementSlide, StatsSlide, SplitSlide, StepsSlide, CtaSlide,
]);

export const ClaimApproval = z.enum(['approved_claim', 'manufacturer_description', 'general_statement']);

export const Claim = z.object({
  claim: text.describe('Exact technical, medical or commercial statement used in the copy'),
  location: z.string().describe('"slide 2", "caption", …'),
  source: z.string().describe('File and section, e.g. "spinal-decompression.pdf · [posiciones]"'),
  approval: ClaimApproval,
});

export const CarouselContent = z.object({
  brand: text.describe('Signature brand name used in copy'),
  date: z.string(),
  occasion: text,
  product: z.string().optional(),
  audience: text,
  slides: z.array(Slide),
  caption: text,
  sources: z.array(z.string()),
  claims: z.array(Claim).optional(),
});

// What a provider (Anthropic API or a Claude Code task) returns for a generation.
export const GenerationResult = z.object({
  concept: text.describe('Creative direction in 1–3 sentences (Spanish)'),
  content: CarouselContent,
  claims: z.array(Claim),
  warnings: z.array(z.string()).describe('Missing data, unverifiable claims or compliance doubts (Spanish)'),
});

export const RevisionResult = GenerationResult.extend({
  summary: text.describe('What changed and why (Spanish)'),
  changed_slides: z.array(z.number()).describe('1-based numbers of slides whose content or style changed'),
});

export type CarouselContentT = z.infer<typeof CarouselContent>;
export type SlideT = z.infer<typeof Slide>;
export type ClaimT = z.infer<typeof Claim>;
export type GenerationResultT = z.infer<typeof GenerationResult>;
export type RevisionResultT = z.infer<typeof RevisionResult>;
