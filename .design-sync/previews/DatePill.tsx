import { Slide, Region, BtlLogo, DatePill, Headline } from '@reach/btl-design-system';

export const OnDarkAndLight = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Slide background="dark" format="square" scale={0.3} alt="Pill sobre oscuro">
      <BtlLogo />
      <Region bottom="m" right="m" gap={28}>
        <DatePill>16 de octubre</DatePill>
        <Headline size="l" tone="base">Día Mundial de la Columna Vertebral</Headline>
      </Region>
    </Slide>
    <Slide background="light" format="square" lightFrom="top-left" scale={0.3} alt="Pill sobre claro">
      <BtlLogo />
      <Region bottom="m" right="m" gap={28}>
        <DatePill>16 de octubre</DatePill>
        <Headline size="l">Día Mundial de la Columna Vertebral</Headline>
      </Region>
    </Slide>
  </div>
);
