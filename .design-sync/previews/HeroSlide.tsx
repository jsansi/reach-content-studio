import { HeroSlide, spinalDecompressionImages } from '@reach/btl-design-system';

export const TextAbove = () => (
  <HeroSlide
    scale={0.36}
    image={spinalDecompressionImages.semiincorporada}
    eyebrow="16 de octubre · Día Mundial de la Columna Vertebral"
    title="¿Y si la camilla se adaptara al paciente?"
    body="Y no al revés."
    swipe="Desliza"
    alt="Paciente en posición semiincorporada sobre BTL Spinal Decompression. ¿Y si la camilla se adaptara al paciente?"
  />
);

export const TextBelow = () => (
  <HeroSlide
    scale={0.36}
    textPosition="bottom"
    image={spinalDecompressionImages.prono}
    imageAlt="Paciente en prono con la unidad de control"
    imageFrame={{ left: 40, top: 200, width: 1000 }}
    eyebrow="BTL Spinal Decompression"
    title="La precisión de unas manos."
    body="Fuerza robótica controlada, sesión tras sesión."
    swipe="Desliza"
    alt="Paciente en prono sobre BTL Spinal Decompression. La precisión de unas manos."
  />
);
