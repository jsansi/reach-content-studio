import { Slide, Region, Eyebrow, Headline, BtlLogo } from '@reach/btl-design-system';

const backgrounds = [
  ['dark', 'Dark Blue con luz Enterprise'],
  ['blue', 'Azul con luz Sky Blue'],
  ['enterprise', 'Enterprise Blue plano'],
  ['deep', 'Dark Blue plano'],
  ['light', 'Sky Blue a blanco'],
  ['white', 'Blanco'],
] as const;

export const Backgrounds = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 12, justifyContent: 'start' }}>
    {backgrounds.map(([bg, label]) => (
      <Slide key={bg} background={bg} lightFrom="top-left" format="square" scale={0.2} alt={label}>
        <BtlLogo />
        <Region bottom="m" right="m" gap={12}>
          <Eyebrow size={44}>{bg}</Eyebrow>
          <Headline size="m" tone="base">{label}</Headline>
        </Region>
      </Slide>
    ))}
  </div>
);

export const Formats = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
    {(['portrait', 'square', 'story'] as const).map((f) => (
      <Slide key={f} format={f} lightFrom="bottom-left" scale={0.2} alt={`Formato ${f}`}>
        <BtlLogo />
        <Region bottom="m" right="m" gap={12}>
          <Eyebrow size={44}>{f === 'portrait' ? '1080 × 1350' : f === 'square' ? '1080 × 1080' : '1080 × 1920'}</Eyebrow>
          <Headline size="l" tone="base">{f === 'portrait' ? 'Carrusel' : f === 'square' ? 'Post cuadrado' : 'Historia'}</Headline>
        </Region>
      </Slide>
    ))}
  </div>
);
