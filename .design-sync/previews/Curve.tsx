import { Slide, Region, BtlLogo, Curve, Headline, SwipeCue } from '@reach/btl-design-system';

// One line in carousel coordinates; each slide shifts x by 1080 × its index so the stroke meets at the cut.
const LINE: [number, number][] = [[-200, 1240], [700, 1120], [1500, 860], [2300, 980]];
const at = (i: number) => LINE.map(([x, y]) => [x - 1080 * i, y] as [number, number]);

export const AcrossSlides = () => (
  <div style={{ display: 'flex' }}>
    <Slide background="dark" scale={0.3} alt="Línea de luz que continúa en la siguiente diapositiva">
      <Curve points={at(0)} glow={0.6} />
      <BtlLogo />
      <Region top={320} width={800}><Headline size="xl" tone="base">Una línea{'\n'}que sigue.</Headline></Region>
      <SwipeCue>Desliza</SwipeCue>
    </Slide>
    <Slide background="dark" lightFrom="bottom-left" scale={0.3} alt="La línea de luz continúa">
      <Curve points={at(1)} glow={0.6} />
      <BtlLogo />
      <Region top={320} width={800}><Headline size="l" tone="base">Y enlaza{'\n'}la historia.</Headline></Region>
    </Slide>
  </div>
);
