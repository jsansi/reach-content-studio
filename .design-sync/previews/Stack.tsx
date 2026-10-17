import { Slide, Region, Stack, BtlLogo, Headline, Stat, Body, Rule } from '@reach/btl-design-system';

export const RowOfFigures = () => (
  <Slide background="dark" scale={0.36} alt="Fila de cifras">
    <BtlLogo />
    <Region top={300} right="m" gap={60}>
      <Headline size="m">Lo esencial, en dos cifras</Headline>
      <Stack direction="row" gap={64}>
        <Stat value="+100" label="posiciones de tratamiento" size={120} labelMaxWidth={300} />
        <Stat value="≈10" label="sesiones por protocolo" size={120} labelMaxWidth={300} />
      </Stack>
      <Rule length={892} thickness={1} emphasis="subtle" />
      <Stack direction="row" gap={40} crossAlign="baseline">
        <Body size="m" style={{ flex: '1 1 0' }}>Ajustas el ángulo para cada paciente.</Body>
        <Body size="m" style={{ flex: '1 1 0' }}>De 1 a 2 sesiones por semana.</Body>
      </Stack>
    </Region>
  </Slide>
);
