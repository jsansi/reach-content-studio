import { StepsSlide } from '@reach/btl-design-system';

const steps = [
  { title: 'Posicionas', text: 'Lumbar o cervical, con el ángulo que necesitas.' },
  { title: 'Programas', text: 'Tracción controlada en ciclos programados.' },
  { title: 'Supervisas', text: 'El equipo trabaja; tú ajustas.' },
];

export const ModularWithFigure = () => (
  <StepsSlide
    scale={0.36}
    title="Así funciona en tu consulta"
    stat={{ value: '+100', label: 'posiciones' }}
    items={steps}
    note="Protocolo orientativo de BTL; el plan depende de cada paciente."
    swipe="Desliza"
    alt="Así funciona: posicionas, programas, supervisas. +100 posiciones."
  />
);

export const ModularWithCta = () => (
  <StepsSlide
    scale={0.36}
    theme="dark"
    title="Empieza en tres pasos"
    items={[
      { title: 'Escríbenos', text: 'Envía “DEMO” por mensaje directo.' },
      { title: 'Agenda', text: 'Coordinamos contigo fecha y hora.' },
      { title: 'Pruébalo', text: 'Conoce el equipo con tu equipo.' },
    ]}
    cta="Solicita tu demo"
    alt="Empieza en tres pasos: escríbenos DEMO, agenda la visita, pruébalo. Solicita tu demo con BTL El Salvador."
  />
);
