import { Slide, Region, BtlLogo, Stat, Headline, Footnote } from '@reach/btl-design-system';

export const RuleVariants = () => (
  <Slide background="dark" scale={0.36} alt="Cifras con regla izquierda y superior">
    <BtlLogo />
    <Region top={280} width={640}><Headline size="m">Cifras que importan a tu clínica</Headline></Region>
    <Region top={520} right="m" gap={56}>
      <Stat value="+100" label="posiciones de tratamiento" size={120} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 32 }}>
        <Stat value="2 zonas" label="lumbar y cervical" size={60} rule="top" />
        <Stat value="1–2" label="sesiones por semana" size={60} rule="top" />
      </div>
    </Region>
    <Region bottom="m" right="m"><Footnote tone="accent">Fuente: BTL. El plan depende de cada paciente.</Footnote></Region>
  </Slide>
);
