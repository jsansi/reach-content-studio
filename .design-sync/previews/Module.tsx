import { Slide, Region, ModuleGrid, Module, BtlLogo, Headline, Body, DiscGlyph, CtaBlock, Footnote } from '@reach/btl-design-system';

const indications = [
  ['hernia', 'Hernia discal'],
  ['lumbar', 'Dolor lumbar crónico'],
  ['facet', 'Síndrome facetario'],
  ['degenerative', 'Enfermedad degenerativa del disco'],
] as const;

export const IndicationModules = () => (
  <Slide background="white" scale={0.36} alt="Indicaciones en módulos y CTA">
    <BtlLogo placement="top-left" />
    <Region top={236} right="m">
      <ModuleGrid columns={2}>
        <Module span={2} gap={14}>
          <Headline size="m">¿A qué pacientes puedes ofrecerla?</Headline>
          <Body size="s">Indicaciones descritas por BTL.</Body>
        </Module>
        {indications.map(([k, label]) => (
          <Module key={k} padding="28px 32px" gap={14}>
            <DiscGlyph kind={k} />
            <Body size="m">{label}</Body>
          </Module>
        ))}
        <Module span={2} surface="enterprise">
          <CtaBlock variant="split" size={64} />
        </Module>
      </ModuleGrid>
    </Region>
    <Region bottom="m" right="m"><Footnote>Los resultados pueden variar según cada paciente.</Footnote></Region>
  </Slide>
);
