import { Slide, Region, BtlLogo, Halo, ProductImage, Eyebrow, Headline, spinalDecompressionImages } from '@reach/btl-design-system';

export const AroundTheDevice = () => (
  <Slide background="dark" lightFrom="bottom-left" scale={0.36} alt="Equipo dentro de un halo de luz">
    <Halo cx={560} cy={560} r={330} glow={0.7} />
    <Halo cx={560} cy={560} r={420} thickness={1} glow={0} opacity={0.5} />
    <ProductImage src={spinalDecompressionImages.prono} alt="Paciente en prono sobre BTL Spinal Decompression" left={120} top={400} width={880} />
    <BtlLogo placement="top-left" />
    <Region top={1000} right="m" gap={16}>
      <Eyebrow>BTL Spinal Decompression</Eyebrow>
      <Headline size="m" tone="base">Tecnología que trabaja mientras tú supervisas.</Headline>
    </Region>
  </Slide>
);

export const BleedingCorner = () => (
  <Slide background="light" scale={0.36} alt="Halo que asoma por la esquina">
    <Halo cx={1040} cy={1290} r={420} tone="enterprise" glow={0.2} />
    <BtlLogo />
    <Region top={320} width={760}><Headline size="xl">Una idea que{'\n'}merece luz.</Headline></Region>
  </Slide>
);
