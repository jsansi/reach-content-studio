import { Slide, Region, BtlLogo, Headline, Eyebrow } from '@reach/btl-design-system';

export const SizeScale = () => (
  <Slide background="white" scale={0.36} alt="Escala de titulares">
    <BtlLogo />
    <Region top={250} right="m" gap={40}>
      {(['display', 'xl', 'l', 'm', 's'] as const).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Eyebrow weight="regular">{s}</Eyebrow>
          <Headline size={s}>{s === 'display' ? 'Ninguna espalda.' : 'Cada paciente, su ángulo.'}</Headline>
        </div>
      ))}
    </Region>
  </Slide>
);

export const OnDark = () => (
  <Slide background="dark" scale={0.36} alt="Titular sobre fondo oscuro">
    <BtlLogo />
    <Region top={420} right="m" gap={40}>
      <Headline as="h1" size="display" tone="base">{'La columna\nno se trata\nen una sola\nposición.'}</Headline>
      <Headline size="m" tone="accent">Con +100 posiciones, eliges el ángulo.</Headline>
    </Region>
  </Slide>
);
