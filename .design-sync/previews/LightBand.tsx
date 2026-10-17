import { Slide, Region, BtlLogo, LightBand, Headline, Body } from '@reach/btl-design-system';

export const SoftPanel = () => (
  <Slide background="dark" scale={0.36} alt="Banda de luz con texto">
    <LightBand left={-40} top={760} width={1060} height={380} fade={['right', 'top', 'bottom']} />
    <BtlLogo />
    <Region top={320} width={760}><Headline size="xl" tone="base">Luz, no{'\n'}recuadros.</Headline></Region>
    <Region top={860} width={700} tone="light" gap={12}>
      <Headline size="s">Una banda que respira</Headline>
      <Body size="m">Se disuelve en el fondo y puede cruzar a la siguiente diapositiva.</Body>
    </Region>
  </Slide>
);
