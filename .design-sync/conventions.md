# BTL El Salvador slides — how to build with this system

You design social-media slides for BTL El Salvador (medical equipment). Every design is one or more
`Slide` canvases (1080×1350 by default) composed from the primitives below. Read
`guidelines/guidelines/btl-brand-rules.md` before composing — the brand rules are strict.

## Setup

No provider is needed. Link `styles.css` (tokens, Noto Sans fonts, component CSS) and load
`_ds_bundle.js`; components live on `window.BTLDesignSystem`. Everything must sit inside a `Slide`:
the slide sets the background and the tone (`dark` or `light`) that every text primitive, rule,
pill and the logo read their colors from. Text outside a `Slide` renders uncolored.

## Composing

- Position blocks with `Region` (absolute, canvas px). `left`/`right`/`top`/`bottom` accept numbers or
  `"m"` = the 2 U brand margin (94 px). `right="m"` alone keeps the default left margin (full width);
  `right` + `width` anchors to the right. `surface="enterprise" | "deep" | "white" | "sky"` paints a
  panel and switches the tone for its children.
- Inside a Region use `Stack` (flex) or `ModuleGrid` + `Module` (hairline modular grid).
- Text: `Headline` (`size` display | xl | l | m | s), `Body` (l | m | s), `Eyebrow`, `Footnote`,
  `BigNumber`, `Stat`, `DatePill`, `DateLine`. Color via `tone` = strong | base | accent — never raw
  colors, never a color change inside a sentence. Nothing renders below 30 px.
- Exactly one `BtlLogo` per slide (`placement` corner). Keep text and photos out of its corner.
- `SwipeCue` on every slide except the last; `CtaBlock` (or `CtaSlide`) on the last.
- Images: `ProductImage` (`src`, `left`/`top`/`width`, optional `height` crop, may bleed off the
  edge). Official photos: `spinalDecompressionImages.equipo | semiincorporada | prono |
  flexionPelvica | aplicacionLumbar | productLogoWhite`. Never invent equipment imagery.
- Decor: `Glow`, `Rings`, `SpineIllustration` (dark only), `SpineDiagram`, `VertebraRuler`,
  `SessionSquares`, `DiscGlyph`, `Rule`, `Icon` (only its five names).
- Backgrounds: `Slide background` = dark | blue | enterprise | deep | light | white,
  `lightFrom` = gradient corner. Formats: portrait (default), square, story.
- Ready-made compositions (`CommemorationSlide`, `ProductSlide`, `BenefitsSlide`, `HeroSlide`,
  `StatementSlide`, `StatsSlide`, `SplitSlide`, `StepsSlide`, `CtaSlide`) take plain content props;
  use them as starting points, or compose your own layout from the primitives for something new.
- To show a carousel side by side, pass `scale={0.36}` to each slide; export at scale 1.

## Copy rules (Spanish)

Brand name in copy: "BTL El Salvador". CTA "Solicita tu demo"; demos by DM with the word "DEMO".
Numbers as "+100". Benefits for the clinic over specs. Hooks open a curiosity gap. Spinal
Decompression treats the lumbar and cervical zones. No invented figures, outcomes or testimonials;
put the source of any figure in a `Footnote`.

## Example

```jsx
const { Slide, Region, BtlLogo, Eyebrow, Headline, Body, ProductImage, Glow, SwipeCue,
  spinalDecompressionImages } = window.BTLDesignSystem;

<Slide background="dark" alt="Paciente en BTL Spinal Decompression. ¿Y si la camilla se adaptara al paciente?">
  <Glow left={-200} top={980} width={1480} height={420} />
  <ProductImage src={spinalDecompressionImages.semiincorporada} alt="Paciente semiincorporado"
    left={-30} top={655} width={1240} />
  <BtlLogo placement="top-left" />
  <Region top={290} right="m" gap={26}>
    <Eyebrow>16 de octubre · Día Mundial de la Columna Vertebral</Eyebrow>
    <Headline as="h1" size="l" tone="base">¿Y si la camilla se adaptara al paciente?</Headline>
    <Body size="l" tone="accent">Y no al revés.</Body>
  </Region>
  <SwipeCue placement="top-right">Desliza</SwipeCue>
</Slide>
```
