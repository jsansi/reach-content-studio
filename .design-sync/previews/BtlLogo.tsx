import { Slide, Region, BtlLogo, Eyebrow } from '@reach/btl-design-system';

export const Placements = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 12, justifyContent: 'start' }}>
    {(['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const).map((p, i) => (
      <Slide key={p} background={i % 2 ? 'white' : 'dark'} format="square" scale={0.22} alt={`Logo ${p}`}>
        <BtlLogo placement={p} />
        <Region top={p.startsWith('top') ? undefined : 'm'} bottom={p.startsWith('top') ? 'm' : undefined} right="m">
          <Eyebrow size={40}>{p}</Eyebrow>
        </Region>
      </Slide>
    ))}
  </div>
);
