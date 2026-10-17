import { Slide, Region, BtlLogo, Rule, Eyebrow, Headline, Body } from '@reach/btl-design-system';

export const AccentBarAndHairline = () => (
  <Slide background="dark" scale={0.36} alt="Barra de acento y línea divisoria">
    <BtlLogo />
    <Region top={330} right="m" gap={40}>
      <Rule length={120} thickness={6} />
      <Eyebrow size={36}>Día Mundial de la Columna Vertebral</Eyebrow>
      <Headline size="xl" tone="base">Cada zona pide su ángulo.</Headline>
      <Rule length={892} thickness={1} emphasis="subtle" />
      <Body size="l" tone="accent">Cervical o lumbar: elige entre +100 posiciones.</Body>
    </Region>
  </Slide>
);
