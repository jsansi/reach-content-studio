import { Slide, Region, BtlLogo, SwipeCue, Headline } from '@reach/btl-design-system';

export const CornerAndInline = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Slide background="dark" format="square" scale={0.3} alt="Desliza en la esquina">
      <BtlLogo />
      <Region top={300} width={760}><Headline size="l" tone="base">¿Por qué tratarlas en la misma posición?</Headline></Region>
      <SwipeCue>Desliza para ver la respuesta</SwipeCue>
    </Slide>
    <Slide background="white" format="square" scale={0.3} alt="Desliza dentro de un bloque">
      <BtlLogo placement="top-left" />
      <Region bottom="m" right="m" gap={40}>
        <Headline size="l">Descubre sus ventajas para tu clínica.</Headline>
        <SwipeCue placement="inline">Desliza</SwipeCue>
      </Region>
    </Slide>
  </div>
);
