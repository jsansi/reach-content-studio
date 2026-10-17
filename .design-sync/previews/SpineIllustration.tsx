import { Slide, Region, BtlLogo, SpineIllustration, Headline, Body } from '@reach/btl-design-system';

export const LitLumbarDiscs = () => (
  <Slide background="dark" scale={0.36} alt="Columna con discos lumbares iluminados">
    <BtlLogo placement="top-left" />
    <Region left={560} top={240}><SpineIllustration width={460} height={1000} /></Region>
    <Region bottom={200} width={520} gap={28}>
      <Headline size="l" tone="base">Cada disco cuenta.</Headline>
      <Body size="l" tone="accent">Zona lumbar y cervical.</Body>
    </Region>
  </Slide>
);
