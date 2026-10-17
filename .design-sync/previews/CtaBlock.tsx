import { Slide, Region, BtlLogo, CtaBlock } from '@reach/btl-design-system';

export const Stacked = () => (
  <Slide background="dark" format="square" scale={0.3} alt="CTA apilado">
    <BtlLogo />
    <Region bottom="m" right="m"><CtaBlock size={96} /></Region>
  </Slide>
);

export const Outline = () => (
  <Slide background="blue" format="square" scale={0.3} alt="CTA con acción delineada">
    <BtlLogo />
    <Region top={300} right="m"><CtaBlock variant="outline" size={110} detail="Escríbenos “DEMO”" /></Region>
  </Slide>
);

export const SplitBand = () => (
  <Slide background="white" format="square" scale={0.3} alt="Banda CTA">
    <BtlLogo placement="top-left" />
    <Region left={0} right={0} bottom={0} padding="48px var(--btl-m) var(--btl-m)" surface="enterprise">
      <CtaBlock variant="split" size={64} />
    </Region>
  </Slide>
);
