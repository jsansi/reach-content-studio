import { Slide, Region, BtlLogo, IconList, Headline } from '@reach/btl-design-system';

const items = [
  { icon: 'do_not_touch' as const, title: 'Terapia manos libres', text: 'Tú supervisas y ajustas.' },
  { icon: 'airline_seat_flat' as const, title: 'Toda la columna', text: 'Zona lumbar y cervical.' },
  { icon: 'trending_up' as const, title: 'Nueva línea de servicio', text: 'Más ingresos para tu consulta.' },
];

export const RowsOnLight = () => (
  <Slide background="light" lightFrom="top-left" scale={0.36} alt="Ventajas con iconos en filas">
    <BtlLogo />
    <Region top={280} width={700}><Headline size="l" style={{ fontSize: 64 }}>Más posibilidades para tu clínica</Headline></Region>
    <Region top={540} right="m"><IconList items={items} /></Region>
  </Slide>
);

export const ColumnsOnDark = () => (
  <Slide background="dark" lightFrom="bottom-right" scale={0.36} alt="Ventajas con iconos en columnas">
    <BtlLogo />
    <Region top={300} width={760}><Headline size="l" tone="base">Tres razones para sumarla a tu clínica</Headline></Region>
    <Region bottom={200} right="m"><IconList layout="columns" items={items} iconSize={110} /></Region>
  </Slide>
);
