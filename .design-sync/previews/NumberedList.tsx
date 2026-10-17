import { Slide, Region, BtlLogo, NumberedList, Headline, CtaBlock } from '@reach/btl-design-system';

const reasons = [
  { title: 'Terapia manos libres', text: 'El equipo aplica la descompresión; tú supervisas y ajustas.' },
  { title: 'Toda la columna', text: 'Zona lumbar y cervical en un solo equipo.' },
  { title: 'Una nueva línea de servicio', text: 'Una nueva fuente de ingresos para tu consulta.' },
];

export const Rows = () => (
  <Slide background="enterprise" scale={0.36} alt="Lista numerada de ventajas con CTA">
    <BtlLogo placement="top-left" />
    <Region top={290} width={760}><Headline size="l" tone="base" style={{ fontSize: 64 }}>Lo que gana tu clínica</Headline></Region>
    <Region top={430} right="m"><NumberedList items={reasons} numeralWidth={200} numeralSize={96} /></Region>
    <Region bottom="m" right="m"><CtaBlock variant="split" size={72} /></Region>
  </Slide>
);

export const Columns = () => (
  <Slide background="white" scale={0.36} alt="Tres pasos en columnas">
    <BtlLogo />
    <Region top={300} width={760}><Headline size="l">Así funciona en tu consulta</Headline></Region>
    <Region top={640} right="m">
      <NumberedList layout="columns" items={[
        { title: 'Posicionas', text: 'Lumbar o cervical, con el ángulo exacto.' },
        { title: 'Programas', text: 'Tracción controlada en ciclos.' },
        { title: 'Supervisas', text: 'El equipo trabaja; tú ajustas.' },
      ]} />
    </Region>
  </Slide>
);
