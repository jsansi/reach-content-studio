import { Slide, Region, BtlLogo, Footnote, Stat, Headline } from '@reach/btl-design-system';

export const SourceNote = () => (
  <Slide background="white" scale={0.36} alt="Cifra con nota de fuente">
    <BtlLogo />
    <Region top={300} right="m" gap={48}>
      <Headline size="m">Un protocolo que cabe en tu agenda</Headline>
      <Stat value="≈10" label="sesiones, de 1 a 2 por semana" size={160} />
    </Region>
    <Region bottom="m" right="m"><Footnote maxWidth={820}>Fuente: BTL, btlnet.es/spinal-decompression. El plan depende de la condición y evolución de cada paciente.</Footnote></Region>
  </Slide>
);
