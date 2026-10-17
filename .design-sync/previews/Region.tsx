import { Slide, Region, BtlLogo, Eyebrow, Headline, Body, SwipeCue, ProductImage, spinalDecompressionImages } from '@reach/btl-design-system';

export const AsymmetricPanels = () => (
  <Slide background="white" scale={0.36} alt="Composición asimétrica con un panel Enterprise Blue">
    <BtlLogo placement="top-left" />
    <ProductImage src={spinalDecompressionImages.equipo} alt="Camilla BTL Spinal Decompression" left={-120} top={230} width={1300} />
    <Region left={0} right={0} bottom={0} height={470} surface="enterprise" padding="56px var(--btl-m) var(--btl-m)" align="between">
      <Eyebrow>BTL Spinal Decompression</Eyebrow>
      <Headline size="l" tone="base">Diseñada para enfocar el segmento exacto.</Headline>
      <SwipeCue placement="inline">Desliza</SwipeCue>
    </Region>
  </Slide>
);

export const CenteredColumn = () => (
  <Slide background="dark" lightFrom="bottom-left" scale={0.36} alt="Columna de texto centrada verticalmente">
    <BtlLogo />
    <Region top={236} bottom={236} width={700} align="center" gap={32}>
      <Eyebrow>Para clínicas de rehabilitación</Eyebrow>
      <Headline size="xl" tone="base">Descompresión vertebral no invasiva.</Headline>
      <Body size="l" tone="accent">Zona lumbar y cervical en un solo equipo.</Body>
    </Region>
    <SwipeCue>Desliza</SwipeCue>
  </Slide>
);
