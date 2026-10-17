import { Slide, Region, BtlLogo, BoneIllustration, Headline, Body, DatePill } from '@reach/btl-design-system';

export const HealthyBone = () => (
  <Slide background="dark" scale={0.36} alt="Fémur iluminado con su hueso esponjoso">
    <BtlLogo />
    <Region left={600} top={250}><BoneIllustration width={330} height={920} /></Region>
    <Region top={300} width={520} gap={26}>
      <DatePill>20 de octubre</DatePill>
      <Headline size="l" tone="base">Huesos que{'\n'}sostienen{'\n'}cada paso.</Headline>
      <Body size="l" tone="accent">Día Mundial de la Osteoporosis.</Body>
    </Region>
  </Slide>
);

export const PorousBone = () => (
  <Slide background="deep" scale={0.36} alt="Fémur con hueso esponjoso poroso">
    <BtlLogo placement="top-left" />
    <Region left={600} top={250}><BoneIllustration width={330} height={920} porous /></Region>
    <Region bottom={220} width={520}><Headline size="m" tone="base">Por dentro, más frágil.</Headline></Region>
  </Slide>
);
