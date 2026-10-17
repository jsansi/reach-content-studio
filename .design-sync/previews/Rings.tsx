import { Slide, Region, BtlLogo, Rings, Glow, ProductImage, Headline, Stat, spinalDecompressionImages } from '@reach/btl-design-system';

export const FramedProduct = () => (
  <Slide background="dark" lightFrom="bottom-left" scale={0.36} alt="Equipo enmarcado por anillos">
    <Rings cx={540} cy={760} radii={[420, 320, 220]} />
    <Glow left={60} top={480} width={960} height={560} intensity={0.22} />
    <ProductImage src={spinalDecompressionImages.prono} alt="Paciente en prono con la unidad de control" left={40} top={440} width={1000} />
    <BtlLogo />
    <Region top={260} width={700}><Headline size="m">Fuerza robótica, precisión de manos.</Headline></Region>
    <Region bottom="m" width={400}><Stat value="+100" label="posiciones de tratamiento" size={72} rule="top" /></Region>
  </Slide>
);
