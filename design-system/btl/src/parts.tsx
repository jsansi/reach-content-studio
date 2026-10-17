import type * as React from 'react';
import type { CSSProperties, ReactNode } from 'react';
// @ts-expect-error plain JS module without type declarations
import { spineSVG } from '../../../studio/layouts.js';
import { iconSvg, logoMarkup, type IconName } from './context';
import { spinalDecompressionImages } from './assets';

/* ============================== helpers ============================== */

/** A length on the 1080-px canvas: a number in px, `"m"` for the 2 U brand margin (94 px), or any CSS length. */
export type Len = number | 'm' | (string & {});
const len = (v: Len | undefined): string | undefined =>
  v === undefined ? undefined : v === 'm' ? 'var(--btl-m)' : typeof v === 'number' ? `${v}px` : v;

/** Surface tone. Text colors, rules, pills and the logo follow it automatically. */
export type Tone = 'dark' | 'light';
/** Text color role: strong = headlines (white / Enterprise Blue), base = body (white / Dark Blue), accent = Sky Blue / Enterprise Blue. */
export type TextTone = 'strong' | 'base' | 'accent';
export type Weight = 'thin' | 'light' | 'regular' | 'semibold';
const W: Record<Weight, number> = { thin: 100, light: 300, regular: 400, semibold: 600 };
/** Never below 30 px on the 1080 canvas (REACH mobile legibility rule). */
const MIN_TEXT = 30;
const px = (n: number) => Math.max(MIN_TEXT, n);

type Align = 'start' | 'center' | 'end' | 'between';
const JUSTIFY: Record<Align, string> = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };

/** A side of a box, for soft (faded) edges. */
export type Edge = 'left' | 'right' | 'top' | 'bottom';
const TOWARD: Record<Edge, string> = { left: 'to right', right: 'to left', top: 'to bottom', bottom: 'to top' };
// One linear mask per faded edge, intersected, so each listed edge dissolves to transparent.
const fadeMask = (edges: Edge[] | undefined, size: number): CSSProperties => {
  if (!edges?.length) return {};
  const layers = edges.map((e) => `linear-gradient(${TOWARD[e]}, transparent 0, #000 ${size}px)`).join(', ');
  return { maskImage: layers, WebkitMaskImage: layers, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' } as CSSProperties;
};

/** Decorative tones: brand colors, plus the product's secondary color when the slide has one. */
export type DecorTone = 'sky' | 'white' | 'enterprise' | 'secondary';
const DECOR: Record<DecorTone, string> = { sky: 'var(--btl-sky)', white: 'var(--btl-white)', enterprise: 'var(--btl-enterprise)', secondary: 'var(--btl-secondary, var(--btl-sky))' };
const soften = (color: string, pct: number) => `color-mix(in srgb, ${color} ${Math.round(pct)}%, transparent)`;

/* ============================== canvas ============================== */

export type SlideBackground = 'dark' | 'blue' | 'enterprise' | 'deep' | 'light' | 'white';
export type Corner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type SlideFormat = 'portrait' | 'square' | 'story';

const BG_TONE: Record<SlideBackground, Tone> = { dark: 'dark', blue: 'dark', enterprise: 'dark', deep: 'dark', light: 'light', white: 'light' };
const LIGHT_AT: Record<Corner, [string, string]> = {
  'top-right': ['108%', '-8%'], 'top-left': ['-8%', '-8%'], 'bottom-right': ['108%', '108%'], 'bottom-left': ['-8%', '108%'],
};
const FORMAT: Record<SlideFormat, [number, number]> = { portrait: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };

export interface SlideProps {
  /** dark (Dark Blue + Enterprise Blue light, default), blue, enterprise (flat), deep (flat Dark Blue), light (Sky Blue → white) or white. */
  background?: SlideBackground;
  /** Corner the gradient light comes from (outside the canvas). Default top-right; bottom-left for blue, whose Sky Blue light would sit under the white logo. */
  lightFrom?: Corner;
  /** portrait 1080×1350 (default, feed carousel), square 1080×1080, story 1080×1920. */
  format?: SlideFormat;
  /** Accessible description of the whole slide, in Spanish. */
  alt?: string;
  /** Display scale for mockups (e.g. 0.4 to show a carousel side by side). Design and export at 1. */
  scale?: number;
  /** The product's secondary color (BTL Social Media Guideline p. 8), e.g. "#e2007d" for EMFACE. Enables tone "secondary" on decor; graphics only, max 10 % of the visual. */
  secondary?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

/**
 * The BTL canvas. Every composition starts here: children are placed with `Region` (absolute, in canvas px)
 * and colored automatically from the background tone. Brand margin is 2 U = 94 px (`"m"`).
 */
export function Slide({ background = 'dark', lightFrom = background === 'blue' ? 'bottom-left' : 'top-right', format = 'portrait', alt, scale = 1, secondary, children, style }: SlideProps) {
  const [w, h] = FORMAT[format];
  const [lx, ly] = LIGHT_AT[lightFrom];
  const slide = (
    <section
      className={`btl-slide btl-bg-${background} btl-tone-${BG_TONE[background]}`}
      data-btl-slide=""
      data-btl-secondary={secondary}
      aria-label={alt}
      style={{ width: w, height: h, ['--lx' as string]: lx, ['--ly' as string]: ly, ...(secondary && { ['--btl-secondary' as string]: secondary }), ...(scale !== 1 && { transform: `scale(${scale})`, transformOrigin: '0 0' }), ...style }}
    >
      {children}
    </section>
  );
  if (scale === 1) return slide;
  return (
    <div data-btl-scaler="" style={{ width: w * scale, height: h * scale, overflow: 'hidden', flex: '0 0 auto' }}>
      {slide}
    </div>
  );
}

/* ============================== layout ============================== */

export interface RegionProps {
  left?: Len;
  top?: Len;
  right?: Len;
  bottom?: Len;
  width?: Len;
  height?: Len;
  /** Child flow direction (default column). */
  direction?: 'column' | 'row';
  /** Distribution of children along the flow. */
  align?: Align;
  /** Cross-axis alignment (default start: text stays left-aligned). */
  crossAlign?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
  padding?: Len;
  /** Paint a solid brand panel behind the region; switches the tone to match it. */
  surface?: 'enterprise' | 'deep' | 'white' | 'sky';
  /** Force the tone for children (e.g. a light card on a dark slide). */
  tone?: Tone;
  wrap?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
}

const SURFACE_TONE = { enterprise: 'dark', deep: 'dark', white: 'light', sky: 'light' } as const;
const CROSS = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' } as const;

/** Absolutely positioned block on the slide. The main composition tool: place text, images and panels anywhere. */
export function Region({
  left: leftProp, top, right, bottom, width, height, direction = 'column', align = 'start', crossAlign = 'stretch', gap = 0,
  padding, surface, tone, wrap, children, style,
}: RegionProps) {
  // Left defaults to the brand margin, unless the region is anchored by right + width.
  const left = leftProp ?? (right !== undefined && width !== undefined ? undefined : 'm');
  const t = tone ?? (surface ? SURFACE_TONE[surface] : undefined);
  const cls = ['btl-region', surface && `btl-surface-${surface}`, t && `btl-tone-${t}`].filter(Boolean).join(' ');
  return (
    <div
      className={cls}
      style={{
        left: len(left), top: len(top), right: len(right), bottom: len(bottom), width: len(width), height: len(height),
        flexDirection: direction, justifyContent: JUSTIFY[align], alignItems: CROSS[crossAlign], gap,
        padding: len(padding), flexWrap: wrap ? 'wrap' : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface StackProps {
  direction?: 'column' | 'row';
  gap?: number;
  align?: Align;
  crossAlign?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Fixed width or flex basis inside a parent row. */
  width?: Len;
  grow?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
}

/** Flow container inside a Region or Module (flex column or row with gap). */
export function Stack({ direction = 'column', gap = 0, align = 'start', crossAlign = 'stretch', width, grow, children, style }: StackProps) {
  return (
    <div
      className="btl-stack"
      style={{
        flexDirection: direction, gap, justifyContent: JUSTIFY[align],
        alignItems: crossAlign === 'baseline' ? 'baseline' : CROSS[crossAlign], width: len(width), flex: grow ? '1 1 0' : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface ModuleGridProps {
  /** Number of equal columns, or a CSS grid-template-columns value ("380px 1fr"). */
  columns?: number | string;
  /** CSS grid-template-rows value; default auto rows. */
  rows?: string;
  /** Drop the outer left/right borders for an open, editorial look. */
  open?: boolean;
  children?: ReactNode;
  style?: React.CSSProperties;
}

/** Modular grid with hairline rules between modules (scientific / educational compositions). Place it inside a Region. */
export function ModuleGrid({ columns = 2, rows, open, children, style }: ModuleGridProps) {
  return (
    <div
      className={`btl-grid${open ? ' btl-grid-open' : ''}`}
      style={{ gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns, gridTemplateRows: rows, ...style }}
    >
      {children}
    </div>
  );
}

export interface ModuleProps {
  /** Columns spanned in the ModuleGrid. */
  span?: number;
  rowSpan?: number;
  padding?: Len;
  gap?: number;
  align?: Align;
  /** Solid fill; enterprise/deep make the module dark (white text), white/sky light. */
  surface?: 'enterprise' | 'deep' | 'white' | 'sky';
  height?: Len;
  children?: ReactNode;
  style?: React.CSSProperties;
}

/** One cell of a ModuleGrid. */
export function Module({ span, rowSpan, padding = 40, gap = 16, align = 'start', surface, height, children, style }: ModuleProps) {
  const cls = ['btl-module', surface && `btl-surface-${surface}`, surface && `btl-tone-${SURFACE_TONE[surface]}`].filter(Boolean).join(' ');
  return (
    <div
      className={cls}
      style={{
        gridColumn: span ? `span ${span}` : undefined, gridRow: rowSpan ? `span ${rowSpan}` : undefined,
        padding: len(padding), gap, justifyContent: JUSTIFY[align], height: len(height), ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============================== text ============================== */

type HeadlineSize = 'display' | 'xl' | 'l' | 'm' | 's';
const HEADLINE: Record<HeadlineSize, { size: number; weight: Weight; lh: number; ls: string }> = {
  display: { size: 116, weight: 'semibold', lh: 1.0, ls: '-1.5px' },
  xl: { size: 96, weight: 'light', lh: 1.04, ls: '-0.02em' },
  l: { size: 76, weight: 'light', lh: 1.08, ls: '-0.01em' },
  m: { size: 60, weight: 'light', lh: 1.12, ls: '0' },
  s: { size: 48, weight: 'light', lh: 1.15, ls: '0' },
};

export interface HeadlineProps {
  /** Headline copy in sentence case; `\n` forces a line break. */
  children: ReactNode;
  /** display 116 SemiBold · xl 96 · l 76 · m 60 · s 48 (Light). */
  size?: HeadlineSize;
  weight?: Weight;
  tone?: TextTone;
  /** Max line length in px. */
  maxWidth?: Len;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  style?: React.CSSProperties;
}

/** Hook or slide title. Left-aligned, sentence case, one color (no highlighted words — manual p. 19). */
export function Headline({ children, size = 'm', weight, tone = 'strong', maxWidth, as: Tag = 'h2', style }: HeadlineProps) {
  const s = HEADLINE[size];
  return (
    <Tag
      className={`btl-text btl-headline btl-c-${tone}`}
      data-btl-text=""
      style={{ fontSize: s.size, fontWeight: W[weight ?? s.weight], lineHeight: s.lh, letterSpacing: s.ls, maxWidth: len(maxWidth), ...style }}
    >
      {children}
    </Tag>
  );
}

const BODY = { l: { size: 42, weight: 'light' as Weight, lh: 1.25 }, m: { size: 34, weight: 'regular' as Weight, lh: 1.32 }, s: { size: 30, weight: 'regular' as Weight, lh: 1.3 } };

export interface BodyProps {
  children: ReactNode;
  /** l 42 Light · m 34 Regular · s 30 Regular. */
  size?: keyof typeof BODY;
  weight?: Weight;
  tone?: TextTone;
  maxWidth?: Len;
  style?: React.CSSProperties;
}

/** Body copy, question or supporting line. Benefits for the clinic, not specs. */
export function Body({ children, size = 'm', weight, tone = 'base', maxWidth, style }: BodyProps) {
  const s = BODY[size];
  return (
    <p className={`btl-text btl-c-${tone}`} data-btl-text="" style={{ fontSize: s.size, fontWeight: W[weight ?? s.weight], lineHeight: s.lh, maxWidth: len(maxWidth), ...style }}>
      {children}
    </p>
  );
}

export interface EyebrowProps {
  children: ReactNode;
  /** 30–44 px (default 30). */
  size?: number;
  weight?: Weight;
  tone?: TextTone;
  style?: React.CSSProperties;
}

/** Small label above a headline: product name, occasion, section. Accent colored by default. */
export function Eyebrow({ children, size = 30, weight = 'semibold', tone = 'accent', style }: EyebrowProps) {
  return (
    <p className={`btl-text btl-c-${tone}`} data-btl-text="" style={{ fontSize: px(size), fontWeight: W[weight], lineHeight: 1.25, ...style }}>
      {children}
    </p>
  );
}

export interface FootnoteProps {
  children: ReactNode;
  tone?: TextTone;
  maxWidth?: Len;
}

/** Source or disclaimer line at the minimum legible size (30 px Regular). */
export function Footnote({ children, tone = 'base', maxWidth }: FootnoteProps) {
  return (
    <p className={`btl-text btl-c-${tone}`} data-btl-text="" style={{ fontSize: MIN_TEXT, fontWeight: 400, lineHeight: 1.3, maxWidth: len(maxWidth) }}>
      {children}
    </p>
  );
}

export interface BigNumberProps {
  /** The figure as written in copy: "+100", "16", "10". */
  value: string;
  /** Font size in px (120–480, default 300). */
  size?: number;
  weight?: Weight;
  tone?: TextTone;
  style?: React.CSSProperties;
}

/** Oversized thin numeral used as the typographic hero of a slide (editorial compositions). */
export function BigNumber({ value, size = 300, weight = 'thin', tone = 'strong', style }: BigNumberProps) {
  return (
    <p className={`btl-text btl-c-${tone}`} data-btl-text="" style={{ fontSize: Math.max(120, size), fontWeight: W[weight], lineHeight: 0.82, letterSpacing: '-0.045em', whiteSpace: 'nowrap', ...style }}>
      {value}
    </p>
  );
}

export interface StatProps {
  value: string;
  label: string;
  /** Size of the value in px (52–160, default 92). */
  size?: number;
  /** Accent rule at the left or top, or none. */
  rule?: 'left' | 'top' | 'none';
  labelMaxWidth?: Len;
}

/** Figure + label pair ("+100" / "posiciones de tratamiento"). Only use figures from approved sources. */
export function Stat({ value, label, size = 92, rule = 'left', labelMaxWidth }: StatProps) {
  const border = rule === 'left' ? { borderLeft: '2px solid var(--rule-strong)', paddingLeft: 24 } : rule === 'top' ? { borderTop: '1.5px solid var(--rule-strong)', paddingTop: 22 } : {};
  return (
    <div className="btl-stack" style={{ flexDirection: 'column', gap: 10, flex: '0 0 auto', ...border }}>
      <p className="btl-text btl-c-strong" data-btl-text="" style={{ fontSize: Math.max(52, size), fontWeight: size >= 80 ? 100 : 300, lineHeight: 0.95, whiteSpace: 'nowrap' }}>{value}</p>
      <p className="btl-text btl-c-accent" data-btl-text="" style={{ fontSize: MIN_TEXT, fontWeight: 400, lineHeight: 1.25, maxWidth: len(labelMaxWidth) }}>{label}</p>
    </div>
  );
}

export interface DatePillProps {
  /** Date of the commemoration, e.g. "16 de octubre". */
  children: ReactNode;
}

/** Rounded pill for the date of a commemorative day (Sky Blue on dark, Enterprise Blue on light). */
export function DatePill({ children }: DatePillProps) {
  return <span className="btl-pill" data-btl-text="">{children}</span>;
}

export interface DateLineProps {
  date: string;
  occasion: string;
}

/** Quieter alternative to the pill: "16 de octubre —— Día Mundial de la Columna Vertebral". */
export function DateLine({ date, occasion }: DateLineProps) {
  return (
    <p className="btl-dateline" data-btl-text="">
      <span>{date}</span>
      <i aria-hidden="true" />
      <span>{occasion}</span>
    </p>
  );
}

/* ============================== lists ============================== */

export type NumberedItem = {
  title: string;
  text?: string;
};

export interface NumberedListProps {
  items: { title: string; text?: string }[];
  /** rows: one per line with hairlines; columns: side by side. */
  layout?: 'rows' | 'columns';
  /** Numeral size in px (default 72, thin). */
  numeralSize?: number;
  /** Width reserved for the numeral in rows layout. */
  numeralWidth?: number;
  gap?: number;
}

/** 01 / 02 / 03 list: steps, reasons or benefits with thin numerals. */
export function NumberedList({ items, layout = 'rows', numeralSize = 72, numeralWidth = 140, gap = 32 }: NumberedListProps) {
  const num = (i: number) => (
    <span className="btl-text btl-c-accent" data-btl-text="" style={{ fontSize: numeralSize, fontWeight: 100, lineHeight: 0.9, flex: layout === 'rows' ? `0 0 ${numeralWidth}px` : undefined }}>
      {String(i + 1).padStart(2, '0')}
    </span>
  );
  const body = (it: NumberedItem) => (
    <div className="btl-stack" style={{ flexDirection: 'column', gap: 8, minWidth: 0, flex: '1 1 0' }}>
      <h3 className="btl-text btl-c-base" data-btl-text="" style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.2 }}>{it.title}</h3>
      {it.text && <p className="btl-text btl-c-accent" data-btl-text="" style={{ fontSize: 32, fontWeight: 400, lineHeight: 1.3 }}>{it.text}</p>}
    </div>
  );
  if (layout === 'columns')
    return (
      <ol className="btl-stack" style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap }}>
        {items.map((it, i) => (
          <li key={i} className="btl-stack" style={{ flexDirection: 'column', gap: 18, borderTop: '1.5px solid var(--rule-strong)', paddingTop: 24 }}>
            {num(i)}
            {body(it)}
          </li>
        ))}
      </ol>
    );
  return (
    <ol className="btl-stack btl-rows" style={{ flexDirection: 'column' }}>
      {items.map((it, i) => (
        <li key={i} className="btl-stack" style={{ flexDirection: 'row', alignItems: 'baseline', padding: '32px 0' }}>
          {num(i)}
          {body(it)}
        </li>
      ))}
    </ol>
  );
}

export type IconItem = {
  icon: IconName;
  title: string;
  text?: string;
};

export interface IconListProps {
  items: { icon: 'accessibility_new' | 'airline_seat_flat' | 'checklist' | 'do_not_touch' | 'patient_list' | 'shield_person' | 'swipe_left' | 'trending_up'; title: string; text?: string }[];
  /** rows: icon left of text with hairlines; columns: icon above text, side by side. */
  layout?: 'rows' | 'columns';
  iconSize?: number;
}

/** Benefits with Material Symbols Sharp icons (weight 100). */
export function IconList({ items, layout = 'rows', iconSize = 92 }: IconListProps) {
  if (layout === 'columns')
    return (
      <ul className="btl-stack" style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 32 }}>
        {items.map((it, i) => (
          <li key={i} className="btl-stack" style={{ flexDirection: 'column', gap: 14 }}>
            <Icon name={it.icon} size={iconSize} />
            <p className="btl-text btl-c-base" data-btl-text="" style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2 }}>{it.title}</p>
            {it.text && <p className="btl-text btl-c-accent" data-btl-text="" style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.3 }}>{it.text}</p>}
          </li>
        ))}
      </ul>
    );
  return (
    <ul className="btl-stack btl-rows" style={{ flexDirection: 'column' }}>
      {items.map((it, i) => (
        <li key={i} className="btl-stack" style={{ flexDirection: 'row', alignItems: 'center', gap: 36, padding: '36px 0' }}>
          <Icon name={it.icon} size={iconSize} />
          <div className="btl-stack" style={{ flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <h3 className="btl-text btl-c-base" data-btl-text="" style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.2 }}>{it.title}</h3>
            {it.text && <p className="btl-text btl-c-strong" data-btl-text="" style={{ fontSize: 32, fontWeight: 400, lineHeight: 1.3 }}>{it.text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface RuleProps {
  orientation?: 'horizontal' | 'vertical';
  /** Length in px (default 120); omit thickness for a hairline. */
  length?: Len;
  thickness?: number;
  /** strong = accent color (Sky / Enterprise), subtle = translucent. */
  emphasis?: 'strong' | 'subtle';
}

/** Accent bar or hairline divider. */
export function Rule({ orientation = 'horizontal', length = 120, thickness = 2, emphasis = 'strong' }: RuleProps) {
  const size = orientation === 'horizontal' ? { width: len(length), height: thickness } : { width: thickness, height: len(length) };
  return <div className={`btl-rule${emphasis === 'strong' ? ' btl-rule-strong' : ''}`} aria-hidden="true" style={size} />;
}

/* ============================== media ============================== */

export interface ProductImageProps {
  /** Image URL or data URL; defaults to the official BTL Spinal Decompression photo. Replace freely with another official BTL image. */
  src?: string;
  alt: string;
  /** Position and size on the canvas in px; may extend past the edges to bleed. */
  left?: Len;
  top?: Len;
  right?: Len;
  bottom?: Len;
  width: number;
  /** Set a height to crop the photo inside a fixed box (object-fit cover). */
  height?: number;
  objectPosition?: string;
  /** auto: white photo backgrounds blend into light slides (multiply); normal on dark. */
  blend?: 'auto' | 'multiply' | 'normal';
  /** Edges that dissolve into the background (CSS mask at render time; the image file is untouched). Hides hard photo cuts. */
  fade?: ('left' | 'right' | 'top' | 'bottom')[];
  /** Width of the fade in px (default 180). */
  fadeSize?: number;
  /** Caption on the photo (30 px SemiBold Dark Blue), position relative to the image. */
  caption?: { text: string; x: number; y: number };
}

/** Official product photo placed anywhere on the slide, optionally cropped or bleeding off the edge. */
export function ProductImage({ src = spinalDecompressionImages.equipo, alt, left, top, right, bottom, width, height, objectPosition, blend = 'auto', fade, fadeSize = 180, caption }: ProductImageProps) {
  const mask = fadeMask(fade, fadeSize);
  return (
    <figure
      className={`btl-media btl-blend-${blend}`}
      data-btl-media=""
      style={{ left: len(left), top: len(top), right: len(right), bottom: len(bottom), width, height: height ?? 'auto' }}
    >
      <img src={src} alt={alt} style={{ height: height ? '100%' : 'auto', objectFit: height ? 'cover' : undefined, objectPosition, ...mask }} />
      {caption && <figcaption data-btl-text="" style={{ left: caption.x, top: caption.y }}>{caption.text}</figcaption>}
    </figure>
  );
}

export interface ProductLogoProps {
  /** Defaults to the white SPINAL DECOMPRESSION logo (dark backgrounds only). */
  src?: string;
  alt?: string;
  width?: number;
}

/** Official product wordmark, inline in a text stack. Keep at least 1 U from the BTL logo. */
export function ProductLogo({ src = spinalDecompressionImages.productLogoWhite, alt = 'BTL Spinal Decompression', width = 400 }: ProductLogoProps) {
  return <img src={src} alt={alt} data-btl-media="" style={{ display: 'block', width, height: 'auto', marginLeft: -10 }} />;
}

/* ============================== brand marks ============================== */

export interface BtlLogoProps {
  /** Corner of the slide, always 2 U from both edges. Default top-right. */
  placement?: Corner;
  /** Color follows the tone (white on dark, Enterprise Blue on light); force only if needed. */
  color?: 'white' | 'blue';
}

/** Official BTL logo, 200 px wide, with its 1 U safe zone. Exactly one per slide. Never recolor, rotate or crop. */
export function BtlLogo({ placement = 'top-right', color }: BtlLogoProps) {
  const [v, h] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
  return (
    <div
      className="btl-logo"
      data-btl-logo=""
      role="img"
      aria-label="BTL"
      style={{ [v]: 'var(--btl-m)', [h]: 'var(--btl-m)', color: color === 'white' ? '#fff' : color === 'blue' ? 'var(--btl-enterprise)' : undefined }}
      dangerouslySetInnerHTML={{ __html: logoMarkup }}
    />
  );
}

export interface SwipeCueProps {
  /** e.g. "Desliza para ver la respuesta". */
  children?: ReactNode;
  /** Slide corner (2 U from the edges), or inline to flow inside a Region/Module. Default bottom-right. */
  placement?: Corner | 'inline';
}

/** "Desliza…" cue with the swipe icon (30 px Regular). Every slide but the last should have one. */
export function SwipeCue({ children = 'Desliza', placement = 'bottom-right' }: SwipeCueProps) {
  const style: CSSProperties = {};
  if (placement !== 'inline') {
    const [v, h] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
    Object.assign(style, { position: 'absolute', [v]: 'var(--btl-m)', [h]: 'var(--btl-m)' });
  }
  return (
    <div className="btl-swipe" data-btl-text="" style={style}>
      {children}
      <Icon name="swipe_left" size={52} tone="accent" />
    </div>
  );
}

export interface IconProps {
  name: IconName;
  /** Size in px (default 92). */
  size?: number;
  tone?: TextTone;
}

/** Material Symbols Sharp icon, weight 100. Available: accessibility_new, airline_seat_flat, checklist, do_not_touch, patient_list, shield_person, swipe_left, trending_up. */
export function Icon({ name, size = 92, tone = 'strong' }: IconProps) {
  return <span className={`btl-icon btl-c-${tone}`} aria-hidden="true" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: iconSvg(name) }} />;
}

export interface CtaBlockProps {
  /** Default "Solicita tu demo". */
  title?: string;
  /** Default: Escríbenos "DEMO" por mensaje directo. */
  detail?: string;
  /** Default "BTL El Salvador"; set "" to hide. */
  signature?: string;
  /** stacked: title over detail; outline: detail as an outlined action pill; split: signature at the right. */
  variant?: 'stacked' | 'outline' | 'split';
  /** Title size in px (48–120, default 60). */
  size?: number;
}

/** Closing call to action. Demos are requested by DM with the word "DEMO". */
export function CtaBlock({ title = 'Solicita tu demo', detail = 'Escríbenos “DEMO” por mensaje directo', signature = 'BTL El Salvador', variant = 'stacked', size = 60 }: CtaBlockProps) {
  const t = <p className="btl-text btl-c-strong" data-btl-text="" style={{ fontSize: Math.max(48, size), fontWeight: size >= 100 ? 600 : 300, lineHeight: 1.02, letterSpacing: size >= 100 ? '-1.5px' : 0 }}>{title}</p>;
  const sig = signature ? <p className="btl-text btl-c-base" data-btl-text="" style={{ fontSize: 30, fontWeight: 600, whiteSpace: 'nowrap' }}>{signature}</p> : null;
  if (variant === 'outline')
    return (
      <div className="btl-stack" style={{ flexDirection: 'column', gap: 40 }}>
        {t}
        <span className="btl-action" data-btl-text="">{detail}</span>
        {sig}
      </div>
    );
  const d = <p className="btl-text btl-c-accent" data-btl-text="" style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.3 }}>{detail}</p>;
  if (variant === 'split')
    return (
      <div className="btl-stack" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div className="btl-stack" style={{ flexDirection: 'column', gap: 12 }}>{t}{d}</div>
        {sig}
      </div>
    );
  return (
    <div className="btl-stack" style={{ flexDirection: 'column', gap: 12 }}>
      {t}
      {d}
      {sig && <div style={{ marginTop: 12 }}>{sig}</div>}
    </div>
  );
}

/* ============================== decor ============================== */

export interface GlowProps {
  left: Len;
  top: Len;
  width: number;
  height: number;
  /** 0–1, default 0.3. */
  intensity?: number;
}

/** Soft Sky Blue light pool (floor glow under equipment, halo behind a subject). Decorative. */
export function Glow({ left, top, width, height, intensity = 0.3 }: GlowProps) {
  return (
    <div
      className="btl-decor"
      aria-hidden="true"
      style={{
        left: len(left), top: len(top), width, height, borderRadius: '50%',
        background: `radial-gradient(ellipse at 50% 50%, rgba(150,210,255,${intensity}) 0%, rgba(150,210,255,${intensity / 4}) 45%, rgba(150,210,255,0) 70%)`,
      }}
    />
  );
}

export interface RingsProps {
  /** Center on the canvas. */
  cx: number;
  cy: number;
  radii?: number[];
}

/** Concentric hairline circles that frame a product (tech compositions). Decorative. */
export function Rings({ cx, cy, radii = [300, 400] }: RingsProps) {
  return (
    <>
      {radii.map((r, i) => (
        <div key={r} className="btl-decor" aria-hidden="true" style={{ left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `1px solid rgba(150,210,255,${0.2 - i * 0.05})` }} />
      ))}
    </>
  );
}

export interface HaloProps {
  /** Center on the canvas; may lie outside it so the ring bleeds off an edge. */
  cx: number;
  cy: number;
  r: number;
  /** Ring line width in px (default 3). */
  thickness?: number;
  /** sky / white / enterprise, or secondary (the product color, when the slide has one). */
  tone?: 'sky' | 'white' | 'enterprise' | 'secondary';
  /** Soft light around the ring, 0–1 (default 0.5). */
  glow?: number;
  opacity?: number;
}

/** Luminous ring around or behind a subject, the BTL carousel-template circle with light. Repeat it across slides as a motif. Decorative. */
export function Halo({ cx, cy, r, thickness = 3, tone = 'sky', glow = 0.5, opacity = 1 }: HaloProps) {
  const c = DECOR[tone];
  const g = Math.max(0, Math.min(1, glow));
  return (
    <div
      className="btl-decor"
      data-btl-decor=""
      aria-hidden="true"
      style={{
        left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', opacity,
        border: `${Math.max(1, Math.min(16, thickness))}px solid ${c}`,
        boxShadow: g ? `0 0 ${Math.round(70 * g)}px ${Math.round(10 * g)}px ${soften(c, 55 * g)}, inset 0 0 ${Math.round(70 * g)}px ${Math.round(6 * g)}px ${soften(c, 40 * g)}` : undefined,
      }}
    />
  );
}

export interface CurveProps {
  /** 2–5 points [x, y] in canvas px; points outside the canvas continue the line onto the neighbouring slide. */
  points: [number, number][];
  /** Line width in px (default 3). */
  width?: number;
  /** sky / white / enterprise, or secondary (the product color, when the slide has one). */
  tone?: 'sky' | 'white' | 'enterprise' | 'secondary';
  /** Soft light along the line, 0–1 (default 0.4). */
  glow?: number;
  opacity?: number;
}

// Catmull-Rom spline through the points, as cubic Béziers: a smooth line that passes through every point.
const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

/** Smooth luminous line (a sweep of light) that can run from one slide into the next. Decorative. */
export function Curve({ points, width = 3, tone = 'sky', glow = 0.4, opacity = 1 }: CurveProps) {
  const c = DECOR[tone];
  const g = Math.max(0, Math.min(1, glow));
  const w = Math.max(1, Math.min(12, width));
  return (
    <svg className="btl-decor" data-btl-decor="" aria-hidden="true" width="100%" height="100%" style={{ left: 0, top: 0, overflow: 'visible', opacity }}>
      {g > 0 && <path d={smoothPath(points)} fill="none" stroke={c} strokeWidth={w * 8} strokeLinecap="round" opacity={0.22 * g} style={{ filter: `blur(${Math.round(10 + 14 * g)}px)` }} />}
      <path d={smoothPath(points)} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
}

export interface LightBandProps {
  left: Len;
  top: Len;
  width: number;
  height: number;
  /** Side where the Sky Blue light is strongest (default left). */
  from?: 'left' | 'right';
  /** Edges that dissolve into the slide background. */
  fade?: ('left' | 'right' | 'top' | 'bottom')[];
  opacity?: number;
}

/** Soft Sky Blue → white light band from the BTL carousel template; can cross the slide edge to link two slides. */
export function LightBand({ left, top, width, height, from = 'left', fade, opacity = 1 }: LightBandProps) {
  return (
    <div
      className="btl-decor"
      data-btl-decor="surface"
      aria-hidden="true"
      style={{
        left: len(left), top: len(top), width, height, opacity,
        background: `linear-gradient(${from === 'left' ? 'to right' : 'to left'}, var(--btl-sky) 0%, color-mix(in srgb, var(--btl-sky) 45%, var(--btl-white)) 100%)`,
        ...fadeMask(fade, Math.min(110, Math.round(Math.min(width, height) / 4))),
      }}
    />
  );
}

/* ---------- bone (osteoporosis and bone-health topics) ---------- */

// Deterministic pseudo-random numbers, so an illustration renders identically every time.
const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
let boneId = 0;

// Trabecular (spongy bone) network inside a box: jittered grid points joined to their neighbours. Porous bone
// (osteoporosis) has fewer, thinner struts and many broken links, leaving large holes.
function trabeculae(x0: number, y0: number, w: number, h: number, porous: boolean, seed: number, scale = 1) {
  const r = rng(seed);
  const step = (porous ? 34 : 20) * scale;
  const cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
  const pt: [number, number][][] = [];
  for (let j = 0; j < rows; j++) {
    pt.push([]);
    for (let i = 0; i < cols; i++) pt[j].push([x0 + i * step + (r() - 0.5) * step * 0.7, y0 + j * step + (r() - 0.5) * step * 0.7]);
  }
  const keep = porous ? 0.5 : 0.94;
  const lines: string[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      for (const [dj, di] of [[0, 1], [1, 0], [1, 1]] as const) {
        const q = pt[j + dj]?.[i + di];
        if (!q || r() > (di && dj ? keep * 0.5 : keep)) continue;
        const p = pt[j][i];
        lines.push(`M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
      }
  return lines.join('');
}

export interface BoneIllustrationProps {
  width?: number;
  height?: number;
  /** Draw the spongy bone sparse and broken (osteoporosis) instead of dense. */
  porous?: boolean;
}

/** Glowing stylised femur with its spongy bone at both ends, for dark backgrounds (bone-health topics). Not a clinical image. */
export function BoneIllustration({ width = 360, height = 1000, porous = false }: BoneIllustrationProps) {
  const id = `bone${++boneId}`;
  // Right femur, front view: greater trochanter (left), neck and head (right), shaft, condyles.
  const outline = 'M92 118C110 108 142 112 172 104L192 142C176 166 166 200 168 236C182 246 184 262 170 274C164 330 168 420 170 800C172 845 215 860 222 900C230 945 210 975 182 972C165 970 158 952 150 948C142 952 135 970 118 972C88 975 70 945 78 900C85 860 112 845 114 800L110 330C108 260 90 205 80 162C74 140 78 122 92 118Z';
  const head = 'M205 148A50 50 0 1 0 205 48A50 50 0 0 0 205 148Z';
  return (
    <svg aria-hidden="true" viewBox="0 0 300 1000" style={{ width, height, flex: '0 0 auto', overflow: 'visible' }}>
      <defs>
        <clipPath id={`${id}c`}><path d={outline} /><path d={head} /></clipPath>
        <radialGradient id={`${id}h`}><stop offset="0" stopColor="#96d2ff" stopOpacity={porous ? 0.28 : 0.38} /><stop offset="1" stopColor="#96d2ff" stopOpacity="0" /></radialGradient>
        <filter id={`${id}g`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse cx="170" cy="150" rx="150" ry="160" fill={`url(#${id}h)`} />
      <ellipse cx="152" cy="905" rx="150" ry="120" fill={`url(#${id}h)`} />
      <g fill="rgba(150,210,255,0.08)" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" strokeLinejoin="round">
        <path d={outline} />
        <path d={head} />
      </g>
      <g clipPath={`url(#${id}c)`} fill="none" stroke="#96d2ff" strokeLinecap="round" filter={`url(#${id}g)`}>
        <path d={trabeculae(70, 40, 200, 260, porous, 7, 0.6)} strokeWidth={porous ? 1.4 : 2.2} strokeOpacity={porous ? 0.7 : 0.95} />
        <path d={trabeculae(60, 830, 190, 150, porous, 11, 0.6)} strokeWidth={porous ? 1.4 : 2.2} strokeOpacity={porous ? 0.7 : 0.95} />
        <path d="M126 330L128 790M156 330L156 790" strokeWidth="1.5" strokeOpacity="0.35" />
      </g>
    </svg>
  );
}

export interface BoneDensityProps {
  /** Spongy bone with osteoporosis (sparse, broken struts) or healthy (dense). */
  porous?: boolean;
  /** Diameter of the circular sample in px (default 360). */
  size?: number;
  /** Optional caption under the sample (30 px), e.g. "Hueso sano". */
  label?: string;
}

/** Circular close-up of spongy bone: dense (healthy) or porous (osteoporosis). Pair two to compare. Educational, not clinical. */
export function BoneDensity({ porous = false, size = 360, label }: BoneDensityProps) {
  const id = `dens${++boneId}`;
  return (
    <div className="btl-stack" style={{ flexDirection: 'column', alignItems: 'center', gap: 18, width: size, flex: '0 0 auto' }}>
      <svg aria-hidden="true" viewBox="0 0 200 200" style={{ width: size, height: size, display: 'block' }}>
        <defs><clipPath id={`${id}c`}><circle cx="100" cy="100" r="96" /></clipPath></defs>
        <circle cx="100" cy="100" r="96" fill="var(--rule)" fillOpacity="0.35" />
        <g clipPath={`url(#${id}c)`} fill="none" stroke="var(--fg-accent)" strokeLinecap="round">
          <path d={trabeculae(-10, -10, 220, 220, porous, porous ? 23 : 5, 0.75)} strokeWidth={porous ? 2.2 : 4.4} strokeOpacity={porous ? 0.8 : 1} />
        </g>
        <circle cx="100" cy="100" r="96" fill="none" stroke="var(--rule-strong)" strokeWidth="2" />
      </svg>
      {label && <p className="btl-text btl-c-base" data-btl-text="" style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.25, textAlign: 'center' }}>{label}</p>}
    </div>
  );
}

export interface IllustrationProps {
  /** Inner SVG markup: shapes only (path, circle, ellipse, rect, line, polyline, polygon, g, gradients, clipPath, blur), in BTL colours. */
  svg: string;
  /** SVG viewBox of the drawing, e.g. "0 0 400 600". */
  viewBox: string;
  width: number;
  height?: number;
  /** Accessible description of what the drawing shows. */
  title?: string;
}

/** A topic illustration drawn for this publication (schematic, like the spine and the femur). Validated before rendering: shapes and brand colours only, no text or images. */
export function Illustration({ svg, viewBox, width, height, title }: IllustrationProps) {
  const prefix = `ill${++boneId}`;
  const scoped = svg.replace(/\bid\s*=\s*"([\w-]+)"/g, `id="${prefix}-$1"`).replace(/url\(#([\w-]+)\)/g, `url(#${prefix}-$1)`);
  return (
    <svg
      data-btl-decor="" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      viewBox={viewBox} style={{ width, height: height ?? 'auto', display: 'block', flex: '0 0 auto', overflow: 'visible' }}
      dangerouslySetInnerHTML={{ __html: scoped }}
    />
  );
}

export interface SpineIllustrationProps {
  width?: number;
  height?: number;
}

/** Glowing lateral spine (lumbar discs lit), from the studio renderer. For dark backgrounds; not a clinical image. */
export function SpineIllustration({ width = 410, height = 891 }: SpineIllustrationProps) {
  return <div aria-hidden="true" style={{ width, height, lineHeight: 0, flex: '0 0 auto' }} dangerouslySetInnerHTML={{ __html: spineSVG({ sky: '#96d2ff' }).replace('<svg ', '<svg width="100%" height="100%" ') }} />;
}

export interface VertebraRulerProps {
  /** Total height in px (default 840). */
  height?: number;
  /** Zones drawn strong and labeled; default cervical + lumbar (the zones Spinal Decompression treats). */
  highlight?: ('cervical' | 'thoracic' | 'lumbar')[];
  /** Show the zone labels at the left of the ticks. */
  labels?: boolean;
}

const RULER = [
  ...Array.from({ length: 7 }, (_, i) => ({ zone: 'cervical' as const, w: 56 + i * 2.4 })),
  ...Array.from({ length: 12 }, (_, i) => ({ zone: 'thoracic' as const, w: 76 + i * 2.8 })),
  ...Array.from({ length: 5 }, (_, i) => ({ zone: 'lumbar' as const, w: 118 + i * 4.5 })),
  ...[84, 68, 54, 40, 28, 18, 12, 8, 6].map((w) => ({ zone: 'sacral' as const, w })),
];
const ZONE_LABEL = { cervical: 'Cervical', thoracic: 'Torácica', lumbar: 'Lumbar' };

/** Minimal "spine as a ruler": 33 ticks, one per vertebra, with highlighted zones. Typographic compositions. */
export function VertebraRuler({ height = 840, highlight = ['cervical', 'lumbar'], labels = true }: VertebraRulerProps) {
  const step = height / RULER.length;
  const mid = (zone: string) => {
    const idx = RULER.map((r, i) => (r.zone === zone ? i : -1)).filter((i) => i >= 0);
    return ((idx[0] + idx[idx.length - 1]) / 2) * step;
  };
  return (
    <div style={{ position: 'relative', width: 340, height, flex: '0 0 auto' }}>
      {RULER.map((r, i) => {
        const on = (highlight as string[]).includes(r.zone);
        return (
          <div key={i} aria-hidden="true" style={{ position: 'absolute', right: 0, top: i * step, width: r.w, height: on ? (r.zone === 'lumbar' ? 6 : 4) : 2, background: on ? 'var(--rule-strong)' : 'var(--rule)' }} />
        );
      })}
      {labels &&
        highlight.map((z) => (
          <p key={z} className="btl-text btl-c-accent" data-btl-text="" style={{ position: 'absolute', left: 0, top: mid(z) - 20, fontSize: 30, fontWeight: 400, lineHeight: 1.3 }}>
            {ZONE_LABEL[z]}
          </p>
        ))}
    </div>
  );
}

export interface SpineDiagramProps {
  /** Rendered height in px (default 880). */
  height?: number;
  /** Zones filled solid; the rest outlined. Default cervical + lumbar. */
  highlight?: ('cervical' | 'thoracic' | 'lumbar')[];
  /** Segment labels C1–C7 / T1–T12 / L1–L5. */
  labels?: boolean;
}

const CERV = [[92, -14], [100, -11], [106, -7], [110, -3], [112, 3], [110, 7], [106, 10]];
const THOR = [[100, 12], [92, 10], [85, 7], [80, 5], [76, 3], [74, 1], [74, 0], [76, -3], [80, -6], [86, -8], [94, -11], [104, -13]];
const LUMB = [[114, -11], [124, -7], [130, 0], [130, 7], [124, 11]];

/** Educational lateral spine diagram with zone labels, drawn in brand colors on any tone. */
export function SpineDiagram({ height = 880, highlight = ['cervical', 'lumbar'], labels = true }: SpineDiagramProps) {
  const on = (z: string) => (highlight as string[]).includes(z);
  const v = (zone: string, list: number[][], y0: number, step: number, w: number, h: number, rx: number) =>
    list.map(([cx, a], i) => {
      const y = y0 + i * step;
      return (
        <rect key={zone + i} x={cx - w / 2} y={y} width={w} height={h} rx={rx} transform={`rotate(${a} ${cx} ${y + h / 2})`}
          fill={on(zone) ? 'var(--rule-strong)' : 'none'} stroke="var(--rule-strong)" strokeWidth={2} />
      );
    });
  return (
    <svg role="img" aria-label="Columna vertebral en vista lateral: zonas cervical, torácica y lumbar" viewBox="0 0 320 1090" style={{ height, width: (height * 320) / 1090, overflow: 'visible', flex: '0 0 auto' }}>
      {v('cervical', CERV, 10, 30, 50, 22, 5)}
      {v('thoracic', THOR, 222, 38, 60, 28, 6)}
      {v('lumbar', LUMB, 678, 52, 78, 40, 7)}
      <path d="M84 944 L160 952 Q150 1015 118 1082 Q94 1020 84 944 Z" fill="var(--btl-sky)" />
      {labels && (
        <g fontFamily="Noto Sans, sans-serif" fontSize={39} fontWeight={400} fill="var(--fg-accent)">
          <line x1="160" y1="115" x2="196" y2="115" stroke="var(--rule)" strokeWidth={2} />
          <line x1="140" y1="440" x2="196" y2="440" stroke="var(--rule)" strokeWidth={2} />
          <line x1="178" y1="802" x2="196" y2="802" stroke="var(--rule)" strokeWidth={2} />
          <text x="204" y="128">C1–C7</text>
          <text x="204" y="453">T1–T12</text>
          <text x="204" y="815">L1–L5</text>
        </g>
      )}
    </svg>
  );
}

export interface SessionSquaresProps {
  /** Number of squares (sessions, steps…). */
  count: number;
  /** Squares per row (default 5). */
  perRow?: number;
  size?: number;
}

/** Unit chart: one square per session. Pair with a Stat or Body that states the figure in words. */
export function SessionSquares({ count, perRow = 5, size = 36 }: SessionSquaresProps) {
  return (
    <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: `repeat(${perRow}, ${size}px)`, gap: 10 }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ width: size, height: size, background: 'var(--fg-accent)' }} />
      ))}
    </div>
  );
}

export interface DiscGlyphProps {
  /** hernia: bulging disc · lumbar: whole segment · facet: posterior joints · degenerative: thinned disc. */
  kind: 'hernia' | 'lumbar' | 'facet' | 'degenerative';
  size?: number;
}

/** Tiny two-vertebra glyph that illustrates an indication in educational grids. Decorative. */
export function DiscGlyph({ kind, size = 108 }: DiscGlyphProps) {
  const s = 'var(--rule-strong)';
  const sky = 'var(--btl-sky)';
  return (
    <svg aria-hidden="true" viewBox="0 0 120 80" style={{ width: size, height: (size * 2) / 3, flex: '0 0 auto' }}>
      {kind === 'facet' ? (
        <>
          <rect x="34" y="4" width="80" height="26" rx="5" fill="none" stroke={s} strokeWidth={2} />
          <rect x="34" y="50" width="80" height="26" rx="5" fill="none" stroke={s} strokeWidth={2} />
          <rect x="38" y="35" width="72" height="10" rx="5" fill={sky} />
          <circle cx="14" cy="28" r="9" fill={s} />
          <circle cx="14" cy="52" r="9" fill={s} />
        </>
      ) : kind === 'degenerative' ? (
        <>
          <rect x="14" y="8" width="100" height="26" rx="5" fill="none" stroke={s} strokeWidth={2} />
          <rect x="14" y="46" width="100" height="26" rx="5" fill="none" stroke={s} strokeWidth={2} />
          <rect x="18" y="38" width="92" height="4" rx="2" fill={s} />
        </>
      ) : (
        <>
          <rect x="14" y="4" width="100" height="26" rx="5" fill={kind === 'lumbar' ? s : 'none'} stroke={s} strokeWidth={2} />
          <rect x="14" y="50" width="100" height="26" rx="5" fill={kind === 'lumbar' ? s : 'none'} stroke={s} strokeWidth={2} />
          <rect x="18" y="35" width="92" height="10" rx="5" fill={sky} />
          {kind === 'hernia' && <ellipse cx="14" cy="40" rx="12" ry="8" fill={s} />}
        </>
      )}
    </svg>
  );
}
