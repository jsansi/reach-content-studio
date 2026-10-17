import { CommemorationSlide } from '@reach/btl-design-system';

export const GlowingSpine = () => (
  <CommemorationSlide
    scale={0.36}
    datePill="16 de octubre"
    eyebrow={'Día Mundial de la\nColumna Vertebral'}
    title={'Ninguna\nespalda\nes igual.'}
    question="¿Por qué tratarlas en la misma posición?"
    swipe="Desliza para ver la respuesta"
    alt="Columna vertebral iluminada. 16 de octubre, Día Mundial de la Columna Vertebral. Ninguna espalda es igual."
  />
);

export const VertebraRuler = () => (
  <CommemorationSlide
    scale={0.36}
    illustration="ruler"
    datePill="16 de octubre"
    eyebrow="Día Mundial de la Columna Vertebral"
    title={'El dolor\ncambia\nde lugar.'}
    question="¿Tu tratamiento también?"
    swipe="Desliza"
    alt="Regla de 33 vértebras con las zonas cervical y lumbar resaltadas. El dolor cambia de lugar."
  />
);

export const LightDiagram = () => (
  <CommemorationSlide
    scale={0.36}
    theme="light"
    illustration="diagram"
    datePill="16 de octubre"
    eyebrow="Día Mundial de la Columna Vertebral"
    title={'24 vértebras\nmóviles.'}
    question="¿Cuántas posiciones tienes para tratarlas?"
    swipe="Desliza para ver la respuesta"
    alt="Diagrama lateral de la columna con zonas cervical, torácica y lumbar. 24 vértebras móviles."
  />
);
