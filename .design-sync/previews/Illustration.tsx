import { Slide, Region, BtlLogo, Illustration, Headline, Body } from '@reach/btl-design-system';

// A schematic knee drawn as SVG for one publication: shapes and brand colours only.
const KNEE = '<defs><filter id="glow"><feGaussianBlur stdDeviation="5"/></filter><radialGradient id="halo"><stop offset="0" stop-color="#96d2ff" stop-opacity=".35"/><stop offset="1" stop-color="#96d2ff" stop-opacity="0"/></radialGradient></defs>'
  + '<ellipse cx="170" cy="300" rx="160" ry="120" fill="url(#halo)"/>'
  + '<path d="M110 20 C118 120 128 200 138 250 C142 272 170 282 214 280 C236 279 246 268 240 252 C226 214 214 120 206 20" fill="#96d2ff" fill-opacity=".08" stroke="#ffffff" stroke-width="3"/>'
  + '<path d="M120 580 C126 480 134 400 142 352 C146 330 172 322 214 324 C236 325 246 336 240 352 C228 392 216 480 210 580" fill="#96d2ff" fill-opacity=".08" stroke="#ffffff" stroke-width="3"/>'
  + '<ellipse cx="188" cy="302" rx="58" ry="10" fill="#96d2ff" filter="url(#glow)"/>'
  + '<ellipse cx="252" cy="300" rx="20" ry="34" fill="none" stroke="#ffffff" stroke-width="3"/>';

export const DrawnForThePost = () => (
  <Slide background="dark" scale={0.36} alt="Rodilla esquemática con la articulación iluminada">
    <BtlLogo />
    <Region left={620} top={300}><Illustration svg={KNEE} viewBox="0 0 300 600" width={330} title="Rodilla esquemática" /></Region>
    <Region top={340} width={500} gap={26}>
      <Headline size="l" tone="base">Cada articulación{'\n'}cuenta.</Headline>
      <Body size="l" tone="accent">Ilustración dibujada para la publicación.</Body>
    </Region>
  </Slide>
);
