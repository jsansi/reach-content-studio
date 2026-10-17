import { BenefitsSlide } from '@reach/btl-design-system';

const benefits = [
  { icon: 'do_not_touch' as const, title: 'Terapia manos libres', text: 'El equipo aplica la descompresión; tú supervisas y ajustas.' },
  { icon: 'airline_seat_flat' as const, title: 'Trata toda la columna', text: 'Zona lumbar y cervical en un solo equipo.' },
  { icon: 'trending_up' as const, title: 'Una nueva línea de servicio', text: 'Una nueva fuente de ingresos para tu consulta.' },
];

export const IconRows = () => (
  <BenefitsSlide
    scale={0.36}
    title="Más posibilidades para tu clínica"
    benefits={benefits}
    alt="Tres ventajas de BTL Spinal Decompression para clínicas. Solicita tu demo con BTL El Salvador."
  />
);

export const IconColumns = () => (
  <BenefitsSlide
    scale={0.36}
    layout="columns"
    title="Lo que gana tu clínica"
    benefits={benefits.map((b) => ({ ...b, text: undefined }))}
    signature="Escríbenos “DEMO” por mensaje directo"
    alt="Lo que gana tu clínica: terapia manos libres, toda la columna, una nueva línea de servicio. Solicita tu demo."
  />
);
