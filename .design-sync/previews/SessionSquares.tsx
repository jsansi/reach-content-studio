import { Slide, Region, BtlLogo, SessionSquares, Stat, Footnote, Headline } from '@reach/btl-design-system';

export const TenSessions = () => (
  <Slide background="enterprise" format="square" scale={0.36} alt="Unas 10 sesiones, de 1 a 2 por semana">
    <BtlLogo />
    <Region top={260} width={700}><Headline size="m" tone="base">Protocolo habitual</Headline></Region>
    <Region top={440} right="m" direction="row" gap={80} crossAlign="center">
      <SessionSquares count={10} size={64} />
      <Stat value="≈10" label="sesiones, de 1 a 2 por semana" size={96} rule="none" />
    </Region>
    <Region bottom="m" right="m"><Footnote tone="accent">Fuente: BTL. El plan depende de cada paciente.</Footnote></Region>
  </Slide>
);
