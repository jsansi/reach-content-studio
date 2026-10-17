import { Slide, Region, BtlLogo, SpineDiagram, Headline, Body } from '@reach/btl-design-system';

export const LabeledZones = () => (
  <Slide background="white" scale={0.36} alt="Diagrama lateral de la columna con zonas">
    <BtlLogo placement="top-left" />
    <Region left={640} top={260}><SpineDiagram height={980} /></Region>
    <Region top={320} width={520} gap={28}>
      <Headline size="l">Cervical, torácica y lumbar.</Headline>
      <Body size="m">BTL Spinal Decompression trata la zona lumbar y la cervical.</Body>
    </Region>
  </Slide>
);

export const OnEnterprise = () => (
  <Slide background="enterprise" scale={0.36} alt="Diagrama de la columna sobre Enterprise Blue">
    <BtlLogo />
    <Region left={120} top={260}><SpineDiagram height={980} highlight={['lumbar']} /></Region>
    <Region left={560} bottom={200} right="m" gap={24}>
      <Headline size="m" tone="base">L1–L5: la zona lumbar.</Headline>
    </Region>
  </Slide>
);
