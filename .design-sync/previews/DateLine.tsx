import { Slide, Region, BtlLogo, DateLine, Headline, Body } from '@reach/btl-design-system';

export const QuietDate = () => (
  <Slide background="dark" scale={0.36} alt="Fecha discreta sobre el titular">
    <BtlLogo placement="top-left" />
    <Region top={290} right="m" gap={28}>
      <DateLine date="16 de octubre" occasion="Día Mundial de la Columna Vertebral" />
      <Headline size="l" tone="base" style={{ fontSize: 84 }}>¿Y si la camilla se adaptara al paciente?</Headline>
      <Body size="l" tone="accent">Y no al revés.</Body>
    </Region>
  </Slide>
);
