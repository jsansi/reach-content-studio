import { Slide, Region, BtlLogo, ProductLogo, Headline, Body } from '@reach/btl-design-system';

export const OnDark = () => (
  <Slide background="dark" lightFrom="bottom-left" scale={0.36} alt="Logo de producto Spinal Decompression">
    <BtlLogo />
    <Region top={420} right="m" gap={36}>
      <ProductLogo />
      <Headline size="l" tone="base">Descompresión vertebral no invasiva.</Headline>
      <Body size="l" tone="accent">Para clínicas de fisioterapia y rehabilitación.</Body>
    </Region>
  </Slide>
);
