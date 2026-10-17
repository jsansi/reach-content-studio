import { Slide, Region, BtlLogo, ProductImage, Glow, Headline, Eyebrow, spinalDecompressionImages } from '@reach/btl-design-system';

export const BleedOnDark = () => (
  <Slide background="dark" scale={0.36} alt="Equipo a sangre sobre fondo oscuro con luz de piso">
    <Glow left={-200} top={980} width={1480} height={420} />
    <ProductImage src={spinalDecompressionImages.semiincorporada} alt="Paciente semiincorporado en BTL Spinal Decompression" left={-30} top={640} width={1260} />
    <BtlLogo />
    <Region top={300} width={760} gap={20}>
      <Eyebrow>BTL Spinal Decompression</Eyebrow>
      <Headline size="l" tone="base">Diseñada alrededor del paciente.</Headline>
    </Region>
  </Slide>
);

export const CroppedOnWhite = () => (
  <Slide background="white" scale={0.36} alt="Foto recortada en un marco sobre blanco">
    <BtlLogo placement="top-left" />
    <ProductImage src={spinalDecompressionImages.equipo} alt="Detalle de la camilla BTL Spinal Decompression" left={300} top={236} width={780} height={700} objectPosition="60% 50%" />
    <Region bottom="m" width={700} gap={20}>
      <Eyebrow>Zona lumbar y cervical</Eyebrow>
      <Headline size="l">Un solo equipo para toda la columna.</Headline>
    </Region>
  </Slide>
);

export const WithCaptions = () => (
  <Slide background="light" lightFrom="top-left" scale={0.36} alt="Posiciones de tratamiento con leyenda">
    <BtlLogo />
    <ProductImage src={spinalDecompressionImages.semiincorporada} alt="Posición semiincorporada" left={30} top={330} width={640} caption={{ text: 'Semiincorporada', x: 60, y: 350 }} />
    <ProductImage src={spinalDecompressionImages.flexionPelvica} alt="Posición de flexión pélvica" left={660} top={500} width={400} caption={{ text: 'Flexión pélvica', x: 40, y: 210 }} />
    <Region bottom="m" width={860}><Headline size="m">+100 posiciones: eliges la que necesita cada paciente.</Headline></Region>
  </Slide>
);

export const FadedEdges = () => (
  <Slide background="light" lightFrom="bottom-left" scale={0.36} alt="Foto que se disuelve en el fondo, sin recuadro">
    <ProductImage src={spinalDecompressionImages.equipo} alt="BTL Spinal Decompression" left={80} top={180} width={1000} fade={['left', 'bottom']} fadeSize={220} />
    <BtlLogo placement="top-left" />
    <Region top={1000} width={800}><Headline size="m">Sin recuadros: la foto respira.</Headline></Region>
  </Slide>
);
