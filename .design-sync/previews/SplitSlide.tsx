import { SplitSlide, spinalDecompressionImages } from '@reach/btl-design-system';

export const ImageLeft = () => (
  <SplitSlide
    scale={0.36}
    image={spinalDecompressionImages.flexionPelvica}
    label="Flexión pélvica"
    eyebrow="BTL Spinal Decompression"
    title="Una posición para cada segmento"
    points={['Zona lumbar y cervical', '+100 posiciones', 'Terapia manos libres']}
    swipe="Desliza"
    alt="Paciente en flexión pélvica. Una posición para cada segmento: zona lumbar y cervical, +100 posiciones, terapia manos libres."
  />
);

export const ImageRight = () => (
  <SplitSlide
    scale={0.36}
    imageSide="right"
    image={spinalDecompressionImages.prono}
    imageAlt="Paciente en prono sobre BTL Spinal Decompression"
    imageFrame={{ left: 20, top: 520, width: 700 }}
    label="Prono"
    eyebrow="Indicaciones descritas por BTL"
    title="Para el paciente que ya probó casi todo"
    body="Hernia discal, lumbalgia crónica y síndrome facetario, entre otras."
    swipe="Desliza"
    alt="Paciente en prono durante una aplicación lumbar. Indicaciones: hernia discal, lumbalgia crónica, síndrome facetario."
  />
);
