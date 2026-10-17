import { Slide, Region, BtlLogo, Body, Eyebrow, Headline } from '@reach/btl-design-system';

export const Sizes = () => (
  <Slide background="light" lightFrom="top-left" scale={0.36} alt="Tamaños de cuerpo de texto">
    <BtlLogo />
    <Region top={280} width={860} gap={44}>
      <Headline size="m">Para el paciente que ya probó casi todo</Headline>
      <Body size="l">Descompresión vertebral no invasiva para hernia discal y lumbalgia crónica.</Body>
      <Body size="m">Aplica fuerzas robóticas controladas con una precisión similar a la de las manos.</Body>
      <Body size="s">Normalmente unas 10 sesiones, de 1 a 2 por semana, según cada caso.</Body>
      <Eyebrow>Fuente: BTL, btlnet.es/spinal-decompression</Eyebrow>
    </Region>
  </Slide>
);

export const QuestionOnDark = () => (
  <Slide background="dark" scale={0.36} alt="Pregunta en Sky Blue">
    <BtlLogo />
    <Region bottom={260} width={760} gap={28}>
      <Headline size="xl" tone="base">Ya probó medicamentos e infiltraciones.</Headline>
      <Body size="l" tone="accent">¿Qué más le ofreces a tu paciente con ciática?</Body>
    </Region>
  </Slide>
);
