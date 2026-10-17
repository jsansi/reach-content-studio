import { ProductSlide, spinalDecompressionImages } from '@reach/btl-design-system';

export const TreatmentPositions = () => (
  <ProductSlide
    scale={0.36}
    images={[
      { src: spinalDecompressionImages.semiincorporada, alt: 'Paciente en posición semiincorporada', label: 'Semiincorporada', left: 30, top: 250, width: 640, label_x: 60, label_y: 350 },
      { src: spinalDecompressionImages.flexionPelvica, alt: 'Paciente en supino con flexión pélvica', label: 'Flexión pélvica', left: 700, top: 225, width: 340, label_x: 20, label_y: 175 },
      { src: spinalDecompressionImages.prono, alt: 'Paciente en prono', label: 'Prono', left: 720, top: 465, width: 290, label_x: 0, label_y: 185 },
    ]}
    productLogo={spinalDecompressionImages.productLogoWhite}
    eyebrow="BTL Spinal Decompression"
    title="Descompresión que se adapta a cada paciente"
    stat={{ value: '+100', label: 'posiciones de tratamiento' }}
    body="Ajustas el ángulo para enfocar el segmento exacto que necesitas tratar."
    swipe="Desliza y descubre sus ventajas"
    alt="Tres posiciones de tratamiento en BTL Spinal Decompression. +100 posiciones de tratamiento."
  />
);

export const SinglePhoto = () => (
  <ProductSlide
    scale={0.36}
    image={spinalDecompressionImages.equipo}
    imageAlt="Camilla BTL Spinal Decompression, vista lateral"
    eyebrow="BTL Spinal Decompression"
    title="Fuerza robótica controlada, con la precisión de unas manos"
    body="Zona lumbar y cervical en un solo equipo."
    swipe="Desliza"
    alt="Camilla BTL Spinal Decompression. Fuerza robótica controlada, con la precisión de unas manos."
  />
);
