// Nine ready-made compositions built only from the primitives in parts.tsx. Their content props match the
// carousel schema (shared/schema.ts) so app content drops in; composition props (theme, sides, art…) let
// one slide type produce several looks. For anything else, compose Slide + Region + primitives directly.
import {
  BigNumber, Body, BtlLogo, CtaBlock, DatePill, Eyebrow, Footnote, Glow, Headline, IconList, Module, ModuleGrid,
  ProductImage, ProductLogo, Region, Rings, Rule, SpineDiagram, SpineIllustration, Stack, Stat, SwipeCue, Slide, VertebraRuler,
  type IconItem, type SlideBackground,
} from './parts';
import { spinalDecompressionImages as img } from './assets';
import type { IconName } from './context';

/** Image placement on the canvas, in px. */
export type ImageFrame = {
  left: number;
  top: number;
  width: number;
};

const themeBg = (t: string | undefined, dflt: SlideBackground): SlideBackground =>
  t === 'light' ? 'light' : t === 'white' ? 'white' : t === 'blue' ? 'blue' : t === 'dark' ? 'dark' : dflt;

/* 1 ─────────────────────────────────────────────────────────────── */

export interface CommemorationSlideProps {
  /** e.g. "16 de octubre". */
  datePill?: string;
  /** Name of the day; `\n` for line breaks. */
  eyebrow?: string;
  /** Hook headline that opens a curiosity gap. */
  title: string;
  /** Question that the next slides answer. */
  question?: string;
  swipe?: string;
  /** Art in the right column: glowing spine (dark only), educational spine diagram, vertebra ruler, or none (wide text). */
  illustration?: 'spine' | 'diagram' | 'ruler' | 'none';
  theme?: 'dark' | 'light';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Cover for a commemorative day: text column at the left, anatomical art at the right. */
export function CommemorationSlide({ datePill, eyebrow, title, question, swipe, illustration = 'spine', theme = 'dark', alt, scale }: CommemorationSlideProps) {
  const art = theme === 'light' && illustration === 'spine' ? 'diagram' : illustration;
  const wide = art === 'none';
  return (
    <Slide background={theme === 'light' ? 'light' : 'dark'} alt={alt} scale={scale}>
      <BtlLogo />
      {art === 'spine' && <Region left={600} top={300} width={410}><SpineIllustration /></Region>}
      {art === 'diagram' && <Region left={700} top={300}><SpineDiagram height={860} /></Region>}
      {art === 'ruler' && <Region right="m" top={300} width={340}><VertebraRuler height={820} /></Region>}
      <Region top={320} width={wide ? 892 : art === 'diagram' ? 580 : 520} gap={0}>
        {datePill && <div style={{ marginBottom: 26 }}><DatePill>{datePill}</DatePill></div>}
        {eyebrow && <Body size="l" tone="base" style={{ fontSize: 52, lineHeight: 1.12 }}>{eyebrow}</Body>}
        <Headline as="h1" size="display" tone="base" style={{ marginTop: 52 }}>{title}</Headline>
        {question && <Body size="l" tone="accent" maxWidth={wide ? 760 : 480} style={{ marginTop: 44 }}>{question}</Body>}
      </Region>
      {swipe && <SwipeCue>{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 2 ─────────────────────────────────────────────────────────────── */

export type PositionedImage = {
  src: string;
  alt: string;
  label: string;
  left: number;
  top: number;
  width: number;
  label_x: number;
  label_y: number;
};

export interface ProductSlideProps {
  /** Several photos on the light photo box, each with a caption. */
  images?: { src: string; alt: string; label: string; left: number; top: number; width: number; label_x: number; label_y: number }[];
  /** Single photo (when images is absent). Default: official device photo. */
  image?: string;
  imageAlt?: string;
  imageFrame?: { left: number; top: number; width: number };
  /** Product wordmark image shown instead of the eyebrow text. */
  productLogo?: string;
  eyebrow: string;
  title: string;
  stat?: { value: string; label: string };
  body?: string;
  swipe?: string;
  /** Height of the light photo box (default 720). */
  photoHeight?: number;
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Product introduction: light photo box on top, dark band with name, title, stat and body below. */
export function ProductSlide({ images, image = img.equipo, imageAlt = 'BTL Spinal Decompression', imageFrame, productLogo, eyebrow, title, stat, body, swipe, photoHeight = 720, alt, scale }: ProductSlideProps) {
  const f = imageFrame ?? { left: -40, top: 40, width: 1160 };
  return (
    <Slide background="dark" lightFrom="bottom-right" alt={alt} scale={scale}>
      <Region left={0} top={0} width={1080} height={photoHeight} tone="light" style={{ overflow: 'hidden', background: 'radial-gradient(75% 70% at -8% -8%, var(--btl-sky) 0%, var(--btl-white) 70%)' }}>
        {images
          ? images.map((im) => <ProductImage key={im.src} src={im.src} alt={im.alt} left={im.left} top={im.top} width={im.width} caption={{ text: im.label, x: im.label_x, y: im.label_y }} />)
          : <ProductImage src={image} alt={imageAlt} left={f.left} top={f.top} width={f.width} />}
      </Region>
      <BtlLogo color="blue" />
      <Region top={photoHeight + 50} right="m" gap={0}>
        {productLogo ? <ProductLogo src={productLogo} alt={eyebrow} /> : <Eyebrow>{eyebrow}</Eyebrow>}
        <Headline size="m" tone="base" maxWidth={820} style={{ marginTop: 14 }}>{title}</Headline>
        <Stack direction="row" gap={48} style={{ marginTop: 34 }}>
          {stat && <Stat value={stat.value} label={stat.label} labelMaxWidth={240} />}
          {body && <Body size="m" style={{ paddingTop: 6 }}>{body}</Body>}
        </Stack>
      </Region>
      {swipe && <SwipeCue>{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 3 ─────────────────────────────────────────────────────────────── */

export interface BenefitsSlideProps {
  title: string;
  benefits: { icon: 'accessibility_new' | 'airline_seat_flat' | 'checklist' | 'do_not_touch' | 'patient_list' | 'shield_person' | 'swipe_left' | 'trending_up'; title: string; text?: string }[];
  /** Default "Solicita tu demo"; set "" to drop the CTA band. */
  cta?: string;
  signature?: string;
  /** rows: icon list with hairlines; columns: three icons side by side. */
  layout?: 'rows' | 'columns';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Clinic benefits with icons on a light slide, closing with an Enterprise Blue CTA band. */
export function BenefitsSlide({ title, benefits, cta = 'Solicita tu demo', signature = 'BTL El Salvador', layout = 'rows', alt, scale }: BenefitsSlideProps) {
  return (
    <Slide background="light" lightFrom="top-left" alt={alt} scale={scale}>
      <BtlLogo />
      <Region top={270} width={700}><Headline size="l" style={{ fontSize: 64 }}>{title}</Headline></Region>
      <Region top={layout === 'columns' ? undefined : 500} bottom={layout === 'columns' ? (cta ? 360 : 200) : undefined} right="m">
        <IconList items={benefits} layout={layout} />
      </Region>
      {cta && (
        <Region left={0} right={0} bottom={0} height={250} padding="0 var(--btl-m)" align="center" surface="enterprise">
          <CtaBlock title={cta} detail={signature} signature="" size={54} />
        </Region>
      )}
    </Slide>
  );
}

/* 4 ─────────────────────────────────────────────────────────────── */

export interface HeroSlideProps {
  /** Default: official semi-reclined treatment photo (transparent background). */
  image?: string;
  imageAlt?: string;
  imageFrame?: { left: number; top: number; width: number };
  datePill?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  swipe?: string;
  /** Text above the equipment (logo moves left, swipe top-right) or below it. */
  textPosition?: 'top' | 'bottom';
  theme?: 'dark' | 'light';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Equipment as the protagonist: a large product image on a lit floor, with the hook above or below it. */
export function HeroSlide({ image = img.semiincorporada, imageAlt = 'Paciente sobre BTL Spinal Decompression', imageFrame, datePill, eyebrow, title, body, swipe, textPosition = 'top', theme = 'dark', alt, scale }: HeroSlideProps) {
  const top = textPosition === 'top';
  const f = imageFrame ?? (top ? { left: -30, top: 655, width: 1240 } : { left: -60, top: 150, width: 1200 });
  const floorY = f.top + (f.width * 367) / 688 - 160;
  return (
    <Slide background={theme === 'light' ? 'light' : 'dark'} lightFrom={top ? 'top-right' : 'bottom-left'} alt={alt} scale={scale}>
      {theme === 'dark' && <Glow left={-200} top={floorY} width={1480} height={420} intensity={0.32} />}
      <ProductImage src={image} alt={imageAlt} left={f.left} top={f.top} width={f.width} />
      <BtlLogo placement={top ? 'top-left' : 'top-right'} />
      <Region top={top ? 290 : undefined} bottom={top ? undefined : 200} right="m" gap={26}>
        {datePill && <DatePill>{datePill}</DatePill>}
        {eyebrow && <Eyebrow size={34} weight="regular">{eyebrow}</Eyebrow>}
        <Headline as="h1" size="l" tone="base" style={{ fontSize: 84 }}>{title}</Headline>
        {body && <Body size="l" tone="accent">{body}</Body>}
      </Region>
      {swipe && <SwipeCue placement={top ? 'top-right' : 'bottom-right'}>{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 5 ─────────────────────────────────────────────────────────────── */

export interface StatementSlideProps {
  /** Giant thin numeral as the typographic hero ("16", "+100"). */
  numeral?: string;
  datePill?: string;
  kicker?: string;
  /** Short statement; `\n` for line breaks. */
  title: string;
  body?: string;
  swipe?: string;
  /** Vertebra ruler along the right edge. */
  ruler?: boolean;
  theme?: 'white' | 'light' | 'dark' | 'blue';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Editorial, asymmetric typography: oversized numeral, negative space and one statement. */
export function StatementSlide({ numeral, datePill, kicker, title, body, swipe, ruler, theme = 'white', alt, scale }: StatementSlideProps) {
  return (
    <Slide background={themeBg(theme, 'white')} lightFrom="bottom-right" alt={alt} scale={scale}>
      <BtlLogo placement="top-left" />
      {numeral && <Region left={70} top={250}><BigNumber value={numeral} size={numeral.length > 2 ? 330 : 460} /></Region>}
      {ruler && <Region right="m" top={260} width={340}><VertebraRuler height={836} /></Region>}
      <Region top={numeral ? 650 : 330} width={ruler ? 640 : 892} gap={0}>
        {datePill && <div style={{ marginBottom: 30 }}><DatePill>{datePill}</DatePill></div>}
        {!numeral && <div style={{ marginBottom: 40 }}><Rule length={120} thickness={6} /></div>}
        {kicker && <Body size="m" tone="base" weight="light" style={{ fontSize: 36 }}>{kicker}</Body>}
      </Region>
      <Region bottom={numeral ? 200 : undefined} top={numeral ? undefined : 560} width={ruler ? 760 : 892} gap={32}>
        <Headline as="h1" size="xl">{title}</Headline>
        {body && <Body size="l">{body}</Body>}
      </Region>
      {swipe && <SwipeCue placement="bottom-left">{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 6 ─────────────────────────────────────────────────────────────── */

export type StatItem = {
  /** Official figure badge image, shown exactly as supplied. */
  image?: string;
  width?: number;
  alt?: string;
  value?: string;
  label?: string;
};

export interface StatsSlideProps {
  title: string;
  items: { image?: string; width?: number; alt?: string; value?: string; label?: string }[];
  /** Source of the figures. */
  note?: string;
  swipe?: string;
  /** stack: big figures down the slide; row: spec strip at the bottom with the product image framed by rings above. */
  arrangement?: 'stack' | 'row';
  /** Product image for the row arrangement. Default: official prone photo. */
  image?: string;
  imageAlt?: string;
  theme?: 'dark' | 'light' | 'blue';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Figures slide. Only figures with an approved or manufacturer source, with the source in `note`. */
export function StatsSlide({ title, items, note, swipe, arrangement = 'stack', image = img.prono, imageAlt = 'Paciente en prono sobre BTL Spinal Decompression', theme = 'dark', alt, scale }: StatsSlideProps) {
  const fig = (it: StatItem, i: number, size: number, rule: 'left' | 'top') =>
    it.image
      ? <img key={i} src={it.image} alt={it.alt ?? it.label ?? ''} data-btl-media="" style={{ display: 'block', width: it.width ?? 640, height: 'auto' }} />
      : <Stat key={i} value={it.value ?? ''} label={it.label ?? ''} size={size} rule={rule} />;
  if (arrangement === 'row')
    return (
      <Slide background={themeBg(theme, 'dark')} lightFrom="bottom-left" alt={alt} scale={scale}>
        <Rings cx={540} cy={700} radii={[360, 260]} />
        <Glow left={140} top={470} width={800} height={480} intensity={0.22} />
        <ProductImage src={image} alt={imageAlt} left={160} top={470} width={760} />
        <BtlLogo />
        <Region top={250} right="m"><Headline size="m">{title}</Headline></Region>
        <Region bottom={note ? 200 : 94} right="m" direction="row" gap={32} style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((it, i) => fig(it, i, 52, 'top'))}
        </Region>
        {note && <Region bottom="m" right="m"><Footnote tone="accent">{note}</Footnote></Region>}
        {swipe && !note && <SwipeCue placement="top-right">{swipe}</SwipeCue>}
      </Slide>
    );
  return (
    <Slide background={themeBg(theme, 'dark')} alt={alt} scale={scale}>
      <BtlLogo />
      <Region top={270} width={640}><Headline size="m">{title}</Headline></Region>
      <Region top={500} right="m" gap={56}>{items.map((it, i) => fig(it, i, 120, 'left'))}</Region>
      {note && <Region bottom={swipe ? 190 : 94} right="m"><Footnote tone="accent">{note}</Footnote></Region>}
      {swipe && <SwipeCue>{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 7 ─────────────────────────────────────────────────────────────── */

export interface SplitSlideProps {
  /** Photo in the light panel. Default: official pelvic-flexion position. */
  image?: string;
  imageAlt?: string;
  imageFrame?: { left: number; top: number; width: number };
  /** Caption at the bottom of the panel. */
  label?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  points?: string[];
  swipe?: string;
  /** Side of the light image panel. */
  imageSide?: 'left' | 'right';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Vertical split: light image panel on one side, dark text column with bullet points on the other. */
export function SplitSlide({ image = img.flexionPelvica, imageAlt = 'Posición de flexión pélvica en BTL Spinal Decompression', imageFrame, label, eyebrow, title, body, points, swipe, imageSide = 'left', alt, scale }: SplitSlideProps) {
  const left = imageSide === 'left';
  const f = imageFrame ?? { left: -120, top: 470, width: 760 };
  return (
    <Slide background="dark" lightFrom={left ? 'top-right' : 'top-left'} alt={alt} scale={scale}>
      <Region left={left ? 0 : 560} top={0} width={520} height={1350} tone="light" style={{ overflow: 'hidden', background: 'radial-gradient(120% 70% at -10% -5%, var(--btl-sky) 0%, var(--btl-white) 70%)' }}>
        <ProductImage src={image} alt={imageAlt} left={f.left} top={f.top} width={f.width} />
        {label && <Region left={60} bottom="m" width={420}><Eyebrow tone="base">{label}</Eyebrow></Region>}
      </Region>
      <BtlLogo placement={left ? 'top-right' : 'top-left'} />
      <Region left={left ? 580 : 'm'} top={330} width={left ? 406 : 406} gap={0}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Headline size="m" tone="base" style={{ marginTop: 18 }}>{title}</Headline>
        {body && <Body size="m" style={{ marginTop: 30 }}>{body}</Body>}
        {points && points.length > 0 && (
          <ul className="btl-stack btl-rows" style={{ flexDirection: 'column', marginTop: 36 }}>
            {points.map((p) => <li key={p} style={{ padding: '18px 0' }}><Body size="m">{p}</Body></li>)}
          </ul>
        )}
      </Region>
      {swipe && <SwipeCue placement={left ? 'bottom-right' : 'bottom-left'}>{swipe}</SwipeCue>}
    </Slide>
  );
}

/* 8 ─────────────────────────────────────────────────────────────── */

export interface StepsSlideProps {
  title: string;
  /** Two to four steps. */
  items: { title: string; text?: string }[];
  /** Highlighted figure module next to the title, e.g. { value: "+100", label: "posiciones de tratamiento" }. */
  stat?: { value: string; label: string };
  /** When set, a closing CTA module replaces the swipe cue. */
  cta?: string;
  signature?: string;
  swipe?: string;
  /** Source or disclaimer under the grid. */
  note?: string;
  theme?: 'white' | 'dark';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Scientific, modular composition: a hairline grid with a title module, a figure module and one module per step. */
export function StepsSlide({ title, items, stat, cta, signature = 'BTL El Salvador', swipe, note, theme = 'white', alt, scale }: StepsSlideProps) {
  const footer = Boolean(note || (!cta && swipe));
  return (
    <Slide background={theme === 'dark' ? 'deep' : 'white'} alt={alt} scale={scale}>
      <BtlLogo placement="top-left" />
      <Region top={236} bottom={footer ? 200 : 'm'} right="m">
        <ModuleGrid columns={items.length} rows={`auto 1fr${cta ? ' auto' : ''}`} style={{ height: '100%' }}>
          <Module span={stat ? Math.max(1, items.length - 1) : items.length} padding={40} align="end">
            <Headline size="m">{title}</Headline>
          </Module>
          {stat && (
            <Module surface="enterprise" padding={36} align="end">
              <Stat value={stat.value} label={stat.label} size={92} rule="none" />
            </Module>
          )}
          {items.map((it, i) => (
            <Module key={i} padding={30} gap={12} align="between">
              <BigNumber value={String(i + 1).padStart(2, '0')} size={120} tone="accent" style={{ fontSize: 96, lineHeight: 1 }} />
              <div className="btl-stack" style={{ flexDirection: 'column', gap: 12 }}>
                <Headline as="h3" size="s" tone="strong" style={{ fontSize: 36, fontWeight: 400 }}>{it.title}</Headline>
                {it.text && <Body size="s" weight="light">{it.text}</Body>}
              </div>
            </Module>
          ))}
          {cta && (
            <Module span={items.length} surface="enterprise" padding={40}>
              <CtaBlock title={cta} signature={signature} variant="split" size={60} />
            </Module>
          )}
        </ModuleGrid>
      </Region>
      {footer && (
        <Region bottom="m" right="m" direction="row" align="between" crossAlign="end" gap={32}>
          {note ? <Footnote maxWidth={700}>{note}</Footnote> : <span />}
          {!cta && swipe && <SwipeCue placement="inline">{swipe}</SwipeCue>}
        </Region>
      )}
    </Slide>
  );
}

/* 9 ─────────────────────────────────────────────────────────────── */

export interface CtaSlideProps {
  /** Product image at the lower right. Default: official device photo on light themes, prone photo on dark. */
  image?: string;
  imageAlt?: string;
  imageFrame?: { left: number; top: number; width: number };
  /** Product wordmark image (white; dark/blue themes). */
  productLogo?: string;
  productName?: string;
  kicker?: string;
  /** Default "Solicita tu demo". */
  title?: string;
  body?: string;
  /** Outlined action pill. Default: Escríbenos "DEMO" por mensaje directo. */
  action?: string;
  signature?: string;
  theme?: 'dark' | 'blue' | 'enterprise';
  alt?: string;
  /** Display scale for mockups (e.g. 0.4); design and export at 1. */
  scale?: number;
}

/** Closing slide: big CTA, outlined DM action, signature, product image bleeding off the corner. */
export function CtaSlide({ image = img.prono, imageAlt = 'BTL Spinal Decompression', imageFrame, productLogo, productName, kicker, title = 'Solicita tu demo', body, action = 'Escríbenos “DEMO” por mensaje directo', signature = 'BTL El Salvador', theme = 'dark', alt, scale }: CtaSlideProps) {
  const f = imageFrame ?? { left: 430, top: 860, width: 760 };
  return (
    <Slide background={theme} lightFrom="bottom-right" alt={alt} scale={scale}>
      {image && <Glow left={f.left - 80} top={f.top + 120} width={f.width + 160} height={360} intensity={0.25} />}
      {image && <ProductImage src={image} alt={imageAlt} left={f.left} top={f.top} width={f.width} />}
      <BtlLogo />
      <Region top={330} width={892} gap={0}>
        {productLogo && <div style={{ marginBottom: 44 }}><ProductLogo src={productLogo} alt={productName} /></div>}
        {kicker && <Body size="l" weight="regular" tone="base" style={{ fontSize: 38 }}>{kicker}</Body>}
        <Headline as="h2" size="display" tone="base" style={{ marginTop: 24, fontSize: 120 }}>{title}</Headline>
        {body && <Body size="l" maxWidth={760} style={{ marginTop: 40 }}>{body}</Body>}
        {action && <span className="btl-action" data-btl-text="" style={{ marginTop: 52 }}>{action}</span>}
      </Region>
      {signature && <Region bottom="m" width={420}><Eyebrow size={34} tone={theme === 'dark' ? 'accent' : 'base'}>{signature}</Eyebrow></Region>}
    </Slide>
  );
}
