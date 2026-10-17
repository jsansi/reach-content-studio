import { Slide, Region, BtlLogo, Icon, Footnote, Headline } from '@reach/btl-design-system';

const icons = [
  ['do_not_touch', 'Manos libres'],
  ['airline_seat_flat', 'Camilla'],
  ['trending_up', 'Ingresos'],
  ['checklist', 'Protocolo'],
  ['swipe_left', 'Desliza'],
] as const;

export const ApprovedSet = () => (
  <Slide background="white" format="square" scale={0.36} alt="Iconos Material Symbols Sharp peso 100">
    <BtlLogo />
    <Region top={260} width={700}><Headline size="m">Iconos Material Symbols Sharp, peso 100</Headline></Region>
    <Region bottom="m" right="m" direction="row" align="between">
      {icons.map(([n, label]) => (
        <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', width: 160 }}>
          <Icon name={n} size={120} />
          <Footnote>{label}</Footnote>
        </div>
      ))}
    </Region>
  </Slide>
);
