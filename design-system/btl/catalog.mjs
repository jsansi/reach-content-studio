// Machine-readable catalog of the BTL primitives that AI-written compositions may use (REACH proposals).
// role: "container" takes child nodes, "text" takes a text child, "leaf" takes neither.
// props: allowed prop names → type description (shown to the model; values are checked by the renderer).
// Anything not listed here (style, className, colors, raw CSS) is rejected, so brand rules stay enforced.

const LEN = 'number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px)';
const TONE = '"strong" | "base" | "accent"';
const WEIGHT = '"thin" | "light" | "regular" | "semibold"';
const ICONS = '"accessibility_new" | "airline_seat_flat" | "checklist" | "do_not_touch" | "patient_list" | "shield_person" | "swipe_left" | "trending_up"';
const DECOR_TONE = '"sky" | "white" | "enterprise" | "secondary" (the product secondary color: only when the brief assigns one; graphics only, max 10 % of the slide)';
const EDGES = '("left" | "right" | "top" | "bottom")[]';

export const CATALOG = {
  // ---- layout ----
  Region: {
    role: 'container',
    summary: 'Absolutely positioned block: the main composition tool. Default left = "m" unless right + width are set. right="m" alone = full width between margins.',
    props: { left: LEN, top: LEN, right: LEN, bottom: LEN, width: LEN, height: LEN, direction: '"column" | "row"', align: '"start" | "center" | "end" | "between"', crossAlign: '"start" | "center" | "end" | "stretch"', gap: 'number', padding: LEN, surface: '"enterprise" | "deep" | "white" | "sky" (solid panel; switches text tone)', tone: '"dark" | "light"', wrap: 'boolean' },
  },
  Stack: {
    role: 'container',
    summary: 'Flex flow inside a Region or Module.',
    props: { direction: '"column" | "row"', gap: 'number', align: '"start" | "center" | "end" | "between"', crossAlign: '"start" | "center" | "end" | "stretch" | "baseline"', width: LEN, grow: 'boolean' },
  },
  ModuleGrid: {
    role: 'container',
    summary: 'Hairline modular grid (scientific/educational). Children must be Module nodes. Place inside a Region.',
    props: { columns: 'number | CSS grid-template-columns string, e.g. "380px 1fr"', rows: 'CSS grid-template-rows string', open: 'boolean (no outer side borders)' },
  },
  Module: {
    role: 'container',
    summary: 'One cell of a ModuleGrid.',
    props: { span: 'number', rowSpan: 'number', padding: LEN, gap: 'number', align: '"start" | "center" | "end" | "between"', surface: '"enterprise" | "deep" | "white" | "sky"', height: LEN },
  },
  // ---- text ----
  Headline: {
    role: 'text',
    summary: 'Hook or title, sentence case, one color. Sizes: display 116 SemiBold, xl 96, l 76, m 60, s 48 (Light). "\\n" forces a line break.',
    props: { size: '"display" | "xl" | "l" | "m" | "s"', weight: WEIGHT, tone: TONE, maxWidth: LEN, as: '"h1" | "h2" | "h3" | "p"' },
  },
  Body: { role: 'text', summary: 'Body copy or question: l 42 Light, m 34, s 30.', props: { size: '"l" | "m" | "s"', weight: WEIGHT, tone: TONE, maxWidth: LEN } },
  Eyebrow: { role: 'text', summary: 'Small label above a headline (product, occasion, section). 30–44 px.', props: { size: 'number 30–44', weight: WEIGHT, tone: TONE } },
  Footnote: { role: 'text', summary: 'Source or disclaimer at 30 px.', props: { tone: TONE, maxWidth: LEN } },
  DatePill: { role: 'text', summary: 'Rounded date pill, e.g. "18 de octubre".', props: {} },
  DateLine: { role: 'leaf', summary: 'Quiet "date —— occasion" line.', props: { date: 'string', occasion: 'string' } },
  BigNumber: { role: 'leaf', summary: 'Oversized thin numeral as typographic hero ("18", "+100"). Only figures with a source.', props: { value: 'string', size: 'number 120–480', weight: WEIGHT, tone: TONE } },
  Stat: { role: 'leaf', summary: 'Figure + label with an accent rule. Only figures with a source.', props: { value: 'string', label: 'string', size: 'number 52–160', rule: '"left" | "top" | "none"', labelMaxWidth: LEN } },
  // ---- lists ----
  NumberedList: { role: 'leaf', summary: '01/02/03 list in rows (hairlines) or columns.', props: { items: '[{ title: string, text?: string }]', layout: '"rows" | "columns"', numeralSize: 'number', numeralWidth: 'number', gap: 'number' } },
  IconList: { role: 'leaf', summary: 'Benefits with weight-100 icons, rows or columns.', props: { items: `[{ icon: ${ICONS}, title: string, text?: string }]`, layout: '"rows" | "columns"', iconSize: 'number' } },
  Rule: { role: 'leaf', summary: 'Accent bar or hairline divider.', props: { orientation: '"horizontal" | "vertical"', length: LEN, thickness: 'number', emphasis: '"strong" | "subtle"' } },
  // ---- media ----
  ProductImage: {
    role: 'leaf',
    summary: 'Official product photo anywhere on the canvas; may bleed off an edge; set height to crop. White photo backgrounds blend into light slides automatically.',
    props: { src: 'string (an asset path from the list)', alt: 'string', left: LEN, top: LEN, right: LEN, bottom: LEN, width: 'number', height: 'number', objectPosition: 'CSS object-position', blend: '"auto" | "multiply" | "normal"', fade: `${EDGES} (those edges dissolve into the background: hides hard photo cuts; the file is not modified)`, fadeSize: 'number px (default 180)', caption: '{ text: string, x: number, y: number }' },
  },
  ProductLogo: { role: 'leaf', summary: 'Official product wordmark/badge image inline in a text stack. Keep ≥ 1 U from the BTL logo.', props: { src: 'string (asset path)', alt: 'string', width: 'number' } },
  // ---- brand ----
  BtlLogo: { role: 'leaf', summary: 'Official BTL logo, exactly one per slide, 2 U from the edges; color follows the tone.', props: { placement: '"top-right" | "top-left" | "bottom-right" | "bottom-left"' } },
  SwipeCue: { role: 'text', summary: '"Desliza…" cue with icon; on every slide except the last.', props: { placement: '"top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline"' } },
  Icon: { role: 'leaf', summary: 'Material Symbols Sharp weight 100.', props: { name: ICONS, size: 'number', tone: TONE } },
  CtaBlock: { role: 'leaf', summary: 'Closing CTA. Defaults: "Solicita tu demo" / Escríbenos “DEMO” por mensaje directo / "BTL El Salvador".', props: { title: 'string', detail: 'string', signature: 'string ("" hides it)', variant: '"stacked" | "outline" | "split"', size: 'number 48–120' } },
  // ---- decor ----
  Glow: { role: 'leaf', summary: 'Soft Sky Blue light pool (floor glow, halo).', props: { left: LEN, top: LEN, width: 'number', height: 'number', intensity: 'number 0–1' } },
  Halo: {
    role: 'leaf',
    summary: 'Luminous ring (optionally with a soft glow) around or behind a subject; may bleed off the canvas. Repeat it across slides as a continuous motif.',
    props: { cx: 'number (center x; may be < 0 or > 1080)', cy: 'number', r: 'number', thickness: 'number 1–16 (default 3)', tone: DECOR_TONE, glow: 'number 0–1 (default 0.5)', opacity: 'number 0–1' },
  },
  Curve: {
    role: 'leaf',
    summary: 'Smooth luminous line through 2–5 points. Points may lie outside the canvas: to continue it on the next slide, a point at x = 1080 + d here is x = d there (same y).',
    props: { points: '[[x, y], …] (2–5 points)', width: 'number 1–12 (default 3)', tone: DECOR_TONE, glow: 'number 0–1 (default 0.4)', opacity: 'number 0–1' },
  },
  LightBand: {
    role: 'leaf',
    summary: 'Soft Sky Blue → white light band (BTL carousel template); may cross the slide edge to link two slides. Text over it goes in a Region with tone "light".',
    props: { left: LEN, top: LEN, width: 'number', height: 'number', from: '"left" | "right" (where the light is strongest)', fade: EDGES, opacity: 'number 0–1' },
  },
  Rings: { role: 'leaf', summary: 'Concentric hairline circles framing a subject.', props: { cx: 'number', cy: 'number', radii: 'number[]' } },
  SessionSquares: { role: 'leaf', summary: 'Unit chart: one square per unit; pair with a sourced figure.', props: { count: 'number', perRow: 'number', size: 'number' } },
  Illustration: {
    role: 'leaf',
    summary: 'Topic illustration you draw yourself as SVG (anatomy, organ, joint, concept), schematic like SpineIllustration. Shapes only (path, circle, ellipse, rect, line, polyline, polygon, g, defs, linear/radialGradient, stop, clipPath, mask, filter with feGaussianBlur/feMerge), colours only #00508c #000a32 #96d2ff #ffffff or none; no text, images or links. Never draw BTL equipment. Place it in a Region like a photo; it may not pass behind text.',
    props: { svg: 'string (inner SVG markup, ≤ 60 000 characters)', viewBox: 'string, e.g. "0 0 400 600"', width: 'number', height: 'number', title: 'string (what it shows, Spanish)' },
  },
  BoneIllustration: { role: 'leaf', summary: 'Glowing stylised femur with spongy bone at both ends (bone-health/osteoporosis topics only, dark backgrounds). porous=true draws it sparse and broken.', props: { width: 'number', height: 'number', porous: 'boolean' } },
  BoneDensity: { role: 'leaf', summary: 'Circular close-up of spongy bone: dense (healthy) or porous (osteoporosis), with an optional 30 px label. Pair two to compare (bone-health topics only; educational, not a clinical image).', props: { porous: 'boolean', size: 'number', label: 'string' } },
  SpineIllustration: { role: 'leaf', summary: 'Glowing lateral spine (spine topics only, dark backgrounds).', props: { width: 'number', height: 'number' } },
  SpineDiagram: { role: 'leaf', summary: 'Labeled lateral spine diagram (spine topics only).', props: { height: 'number', highlight: '("cervical" | "thoracic" | "lumbar")[]', labels: 'boolean' } },
  VertebraRuler: { role: 'leaf', summary: '33-tick vertebra ruler (spine topics only).', props: { height: 'number', highlight: '("cervical" | "thoracic" | "lumbar")[]', labels: 'boolean' } },
  DiscGlyph: { role: 'leaf', summary: 'Two-vertebra indication glyph (spine topics only).', props: { kind: '"hernia" | "lumbar" | "facet" | "degenerative"', size: 'number' } },
};

// Secondary colors per aesthetic product (BTL Social Media Guideline (Aesthetics) v1.3, pp. 7–8): graphic
// elements and icons only (never text), at most 10 % of the visual, one per piece. Products not listed have no
// assigned color (e.g. EMFEMME 360): the "secondary" tone is then unavailable.
export const SECONDARY_COLORS = {
  EXION: '#ffb0d4',
  EMFACE: '#e2007d',
  'EMSCULPT NEO': '#0096ff',
  EMFUSION: '#00cccc',
  EXOMIND: '#db6a1d',
};
export const SECONDARY_MAX_SHARE = 0.1;

/** The secondary color for a publication: only when exactly one of its products has one assigned. */
export function secondaryColorFor(productNames) {
  const found = [...new Set(productNames.map((n) => SECONDARY_COLORS[String(n).trim().toUpperCase().replace(/\s+/g, ' ')]).filter(Boolean))];
  return found.length === 1 ? found[0] : null;
}

// Safe layout-only style keys a node may set (spacing inside flows). Never colors or fonts.
export const STYLE_KEYS = ['marginTop', 'marginBottom', 'marginLeft', 'maxWidth', 'alignSelf', 'flex'];

export const SLIDE_PROPS = {
  background: '"dark" | "blue" | "enterprise" | "deep" | "light" | "white"',
  lightFrom: '"top-right" | "top-left" | "bottom-right" | "bottom-left" (gradient light corner; keep it away from the logo on "blue")',
};

// Compact Markdown reference for prompts.
export function catalogMarkdown() {
  const lines = [];
  for (const [name, c] of Object.entries(CATALOG)) {
    const props = Object.entries(c.props).map(([k, v]) => `\`${k}\`: ${v}`).join('; ');
    lines.push(`- **${name}** (${c.role}) — ${c.summary}${props ? `\n  Props: ${props}` : ''}`);
  }
  lines.push(`- Optional \`style\` on any node, layout keys only: ${STYLE_KEYS.join(', ')}.`);
  return lines.join('\n');
}
