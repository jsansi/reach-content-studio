import { Slide, Region, BtlLogo, Eyebrow, Headline, Body } from '@reach/btl-design-system';

export const ProductAndSection = () => (
  <Slide background="dark" lightFrom="bottom-right" scale={0.36} alt="Eyebrows sobre titulares">
    <BtlLogo />
    <Region top={300} right="m" gap={90}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Eyebrow>BTL Spinal Decompression</Eyebrow>
        <Headline size="l" tone="base">Descompresión que se adapta a cada paciente</Headline>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Eyebrow size={36} weight="regular">Día Mundial de la Columna Vertebral</Eyebrow>
        <Body size="l">Una fecha para hablar de lo que cada espalda necesita.</Body>
      </div>
    </Region>
  </Slide>
);
