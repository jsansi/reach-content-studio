import { Slide, Region, BtlLogo, DiscGlyph, Body, Headline } from '@reach/btl-design-system';

const kinds = [
  ['hernia', 'Hernia discal'],
  ['lumbar', 'Dolor lumbar crónico'],
  ['facet', 'Síndrome facetario'],
  ['degenerative', 'Disco degenerado'],
] as const;

export const Indications = () => (
  <Slide background="white" format="square" scale={0.36} alt="Glifos de indicaciones">
    <BtlLogo />
    <Region top={260} width={700}><Headline size="m">Indicaciones descritas por BTL</Headline></Region>
    <Region top={480} right="m" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 48 }}>
      {kinds.map(([k, label]) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <DiscGlyph kind={k} size={132} />
          <Body size="m">{label}</Body>
        </div>
      ))}
    </Region>
  </Slide>
);
