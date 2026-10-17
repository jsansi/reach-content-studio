import { StatsSlide } from '@reach/btl-design-system';

export const StackedFigures = () => (
  <StatsSlide
    scale={0.36}
    title="Un protocolo pensado para tu agenda"
    items={[
      { value: '+100', label: 'posiciones de tratamiento' },
      { value: '≈10', label: 'sesiones, de 1 a 2 por semana' },
    ]}
    note="Fuente: BTL, btlnet.es/spinal-decompression. El plan depende de cada paciente."
    swipe="Desliza"
    alt="+100 posiciones de tratamiento. Unas 10 sesiones, de 1 a 2 por semana."
  />
);

export const SpecStrip = () => (
  <StatsSlide
    scale={0.36}
    arrangement="row"
    title="La precisión de unas manos, con fuerza robótica controlada."
    items={[
      { value: '+100', label: 'posiciones de tratamiento' },
      { value: '2 zonas', label: 'lumbar y cervical' },
      { value: '≈10', label: 'sesiones por protocolo' },
    ]}
    note="Fuente: BTL. El plan depende de cada paciente."
    alt="Paciente en prono sobre BTL Spinal Decompression. +100 posiciones, zona lumbar y cervical, unas 10 sesiones."
  />
);
