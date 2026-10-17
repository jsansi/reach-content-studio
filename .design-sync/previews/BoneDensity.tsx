import { Slide, Region, Stack, BtlLogo, BoneDensity, Headline, Footnote } from '@reach/btl-design-system';

export const HealthyVsPorous = () => (
  <Slide background="light" scale={0.36} alt="Hueso sano y hueso con osteoporosis, vistos de cerca">
    <BtlLogo />
    <Region top={280} right="m" gap={60}>
      <Headline size="l">Por dentro,{'\n'}no todo hueso es igual.</Headline>
      <Stack direction="row" gap={60} crossAlign="start">
        <BoneDensity size={380} label="Hueso sano" />
        <BoneDensity size={380} porous label="Con osteoporosis" />
      </Stack>
      <Footnote>Ilustración esquemática.</Footnote>
    </Region>
  </Slide>
);

export const OnDark = () => (
  <Slide background="dark" scale={0.36} alt="Muestra de hueso poroso sobre fondo oscuro">
    <BtlLogo />
    <Region top={360} left={300}><BoneDensity size={480} porous label="Con osteoporosis" /></Region>
  </Slide>
);
