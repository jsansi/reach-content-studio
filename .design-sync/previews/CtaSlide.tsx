import { CtaSlide, spinalDecompressionImages } from '@reach/btl-design-system';

export const DarkWithProduct = () => (
  <CtaSlide
    scale={0.36}
    kicker="¿Tienes una clínica de rehabilitación en El Salvador?"
    title="Solicita tu demo"
    alt="Solicita tu demo de BTL Spinal Decompression. Escríbenos DEMO por mensaje directo. BTL El Salvador."
  />
);

export const BlueWithProductLogo = () => (
  <CtaSlide
    scale={0.36}
    theme="blue"
    image={spinalDecompressionImages.semiincorporada}
    imageFrame={{ left: 380, top: 900, width: 820 }}
    productLogo={spinalDecompressionImages.productLogoWhite}
    productName="BTL Spinal Decompression"
    title="Conócelo en tu clínica"
    action="Escríbenos “DEMO”"
    alt="BTL Spinal Decompression. Conócelo en tu clínica. Escríbenos DEMO."
  />
);
