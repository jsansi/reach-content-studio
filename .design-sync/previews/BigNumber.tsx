import { Slide, Region, BtlLogo, BigNumber, Body, Headline, SwipeCue } from '@reach/btl-design-system';

export const PositionsNumeral = () => (
  <Slide background="white" scale={0.36} alt="+100 posiciones de tratamiento">
    <BtlLogo placement="top-left" />
    <Region left={66} top={290}><BigNumber value="+100" size={340} /></Region>
    <Region top={600}><Body size="l" tone="base">posiciones de tratamiento</Body></Region>
    <Region bottom={200} width={620} gap={18}>
      <Headline size="m">Ajustas el ángulo hasta el segmento exacto.</Headline>
    </Region>
    <SwipeCue>Desliza</SwipeCue>
  </Slide>
);

export const DateNumeral = () => (
  <Slide background="dark" lightFrom="bottom-left" scale={0.36} alt="16 de octubre">
    <BtlLogo />
    <Region left={70} top={300}><BigNumber value="16" size={480} tone="accent" /></Region>
    <Region top={740} width={760} gap={20}>
      <Body size="l" tone="base">de octubre · Día Mundial de la Columna Vertebral</Body>
    </Region>
  </Slide>
);
