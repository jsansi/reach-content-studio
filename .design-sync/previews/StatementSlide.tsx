import { StatementSlide } from '@reach/btl-design-system';

export const OversizedDate = () => (
  <StatementSlide
    scale={0.36}
    numeral="16"
    ruler
    kicker={'de octubre\nDía Mundial de la Columna Vertebral'}
    title="El dolor cambia de lugar."
    body="¿Tu tratamiento también?"
    swipe="Desliza"
    alt="16 de octubre, Día Mundial de la Columna Vertebral. El dolor cambia de lugar. ¿Tu tratamiento también?"
  />
);

export const AccentBarDark = () => (
  <StatementSlide
    scale={0.36}
    theme="dark"
    kicker="Para fisioterapeutas y médicos rehabilitadores"
    title={'Tu paciente ya probó\ncasi todo.'}
    body="¿Qué más le ofreces cuando el dolor vuelve?"
    swipe="Desliza para ver la respuesta"
    alt="Tu paciente ya probó casi todo. ¿Qué más le ofreces cuando el dolor vuelve?"
  />
);
