import { Slide, Region, BtlLogo, VertebraRuler, Headline, Body } from '@reach/btl-design-system';

export const TreatedZones = () => (
  <Slide background="white" scale={0.36} alt="Regla de vértebras con zonas cervical y lumbar">
    <BtlLogo placement="top-left" />
    <Region right="m" top={260} width={340}><VertebraRuler height={836} /></Region>
    <Region bottom={200} width={560} gap={24}>
      <Headline size="l">33 vértebras. Dos zonas que tratar.</Headline>
      <Body size="m">Cervical y lumbar, en un solo equipo.</Body>
    </Region>
  </Slide>
);

export const OnDark = () => (
  <Slide background="dark" lightFrom="top-left" scale={0.36} alt="Regla de vértebras sobre oscuro">
    <BtlLogo />
    <Region right="m" top={300} width={340}><VertebraRuler height={820} highlight={['lumbar']} /></Region>
    <Region top={320} width={520} gap={28}>
      <Headline size="l" tone="base">Empieza por la zona lumbar.</Headline>
    </Region>
  </Slide>
);
