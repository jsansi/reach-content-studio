import { Slide, Region, BtlLogo, Glow, ProductImage, Headline, spinalDecompressionImages } from '@reach/btl-design-system';

export const FloorLight = () => (
  <Slide background="deep" scale={0.36} alt="Equipo con luz de piso">
    <Glow left={-100} top={860} width={1280} height={460} intensity={0.4} />
    <ProductImage src={spinalDecompressionImages.prono} alt="Paciente en prono sobre BTL Spinal Decompression" left={60} top={560} width={960} />
    <BtlLogo />
    <Region top={300} width={760}><Headline size="l" tone="base">Tecnología que trabaja mientras tú supervisas.</Headline></Region>
  </Slide>
);
