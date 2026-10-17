import { Slide, Region, ModuleGrid, Module, BtlLogo, Headline, Body, SpineDiagram, Eyebrow, SwipeCue } from '@reach/btl-design-system';

export const AnatomyGrid = () => (
  <Slide background="white" scale={0.36} alt="Retícula modular con diagrama de la columna">
    <BtlLogo placement="top-left" />
    <Region top={236} right="m" height={1020}>
      <ModuleGrid columns="380px minmax(0, 1fr)" rows="1fr auto auto" style={{ height: '100%' }}>
        <Module rowSpan={3} padding="32px 0 32px 36px" align="between">
          <Eyebrow tone="strong" weight="regular">Vista lateral</Eyebrow>
          <SpineDiagram height={860} />
        </Module>
        <Module surface="enterprise" align="between" padding={44}>
          <Headline size="m">Tu paciente tiene 24 vértebras móviles.</Headline>
          <Body size="l" tone="accent">¿Cuántas posiciones tienes para tratarlas?</Body>
        </Module>
        <Module padding="32px 40px"><Body size="m">Cervical, torácica y lumbar: cada zona pide su ángulo.</Body></Module>
        <Module padding="28px 40px"><SwipeCue placement="inline">Desliza</SwipeCue></Module>
      </ModuleGrid>
    </Region>
  </Slide>
);
