# Encargo: tres propuestas creativas de un carrusel
## Brief de la publicación

- Marca (cliente): BTL Estética El Salvador — firma en las piezas: "BTL El Salvador"
- Fecha de publicación: 2026-10-18
- Tema: Dia Mundial de la Menopausia
- Formato: Carrusel · 3 diapositiva(s) de 1080 × 1350 px
- Objetivo de marketing: Fecha conmemorativa
- Fecha límite de producción: 2026-10-18

## Instrucciones creativas del usuario

El objetivo de este carrusel es conectar la fecha conmemorativa con el equipo, resaltando ventajas y no detalles técnicos. También debe llevar un llamado a la acción muy claro.

## Preferencias editoriales activas (obligatorias)

- Nombrar siempre a la marca como "BTL El Salvador" en diapositivas, captions, textos alternativos y firmas. Nunca "BTL Medical" ni separar en divisiones médica/estética.
- CTA corto: "Solicita tu demo", sin flecha. Las demos se piden por mensaje directo con la palabra "DEMO".
- Escribir las cifras como "+100 posiciones", no "100+" ni "más de 100".
- Priorizar ventajas prácticas para la clínica o el profesional (personalizar protocolos, manos libres, nueva línea de servicio); dejar los detalles técnicos fuera o al mínimo.
- Caption de unos 500 caracteres: gancho con la palabra clave de la fecha, un párrafo de beneficio que nombre el producto, CTA por mensaje directo "DEMO" y unos 5 hashtags.
- Las piezas se ven sobre todo en el móvil: ningún texto por debajo de 30 px en el lienzo de 1080 px (incluye "Desliza…", etiquetas y pills), y peso regular en los textos pequeños.
- Este carrusel se asemeja mucho al diseño del último carrusel, asegurémonos de que haya variedad gráfica o nuevas propuestas de diseño siguiendo el lineamiento de la marca.

## Manual de marca — resumen (knowledge/brand-guidelines/btl-corporate-identity.md, fuente: knowledge/brand-guidelines/btl_corporate_identity.pdf)

### BTL Corporate Identity Guideline — resumen operativo

Resumen de las reglas que aplica el generador de carruseles (`studio/brands/btl.js`, `studio/layouts.js`).
Citar como `btl_corporate_identity.pdf p. N`.

#### Logo
- p. 4: logo optimizado 2025. Usar solo el SVG extraído (`public/assets/brands/btl/logo/btl-logo.svg`); no redibujar.
- p. 5: unidad U = mitad de la altura del logo. Zona de seguridad de 1 U sin texto, líneas ni gráficos. Al menos 2 U al borde. 3 U a cualquier otro logo.
- p. 6: combinaciones permitidas: logo Enterprise Blue sobre blanco, Sky Blue o imagen de fondo liso similar; logo blanco sobre Enterprise Blue; monocromo.
- p. 7: tamaño según el lado corto: formatos 1000–2000 px → logo de 140–300 px (en 1080 px se usa 200 px).
- p. 8: no recolorear, no efectos, no recortar, no contornear, no deformar, no rotar, nada dentro de la zona de seguridad.
- p. 10–11: el logo de producto (ProductName) va al menos a 1 U del logo BTL, con 75 % de su altura; si el nombre contiene "BTL", separarlos 6 U o más.
- p. 12: texto junto al logo en Noto Sans SemiBold con altura de 1 U (p. ej. especificación de sucursal).

#### Color
- p. 14: Enterprise Blue #00508C (principal), Dark Blue #000A32, Sky Blue #96D2FF, White #FFFFFF.
- p. 15: degradado radial de dos colores de marca, con la fuente de luz fuera del lienzo, en una esquina.
- p. 16: color secundario **solo para productos estéticos**, asignado por la central de BTL, máximo 10 % del visual y uno por pieza.

#### Tipografía
- p. 18: BTL Noto Sans. Peso principal Light; también Thin y SemiBold.
- p. 19: texto alineado a la izquierda (centrado solo bajo pictogramas). Sentence case. Mayúsculas solo en nombres registrados. No resaltar partes de un texto, no cursivas, no subrayados ni cambios de color dentro del texto.
- p. 20: escala: cuerpo S, texto pequeño T = 2/3 S, H2 = 2 S, H1 = 4 S.
- p. 21: posicionar el texto con las zonas de seguridad que define el logo.
- p. 22: "Short statement" de 4–10 letras centrado en la parte superior (sustituye el titular).

#### Elementos gráficos
- p. 27: iconos Google Material Symbols, Sharp, peso 100, tamaño óptico 48, relleno desactivado.
- p. 28–29: infografías simples, sin degradados, colores de marca + blanco, 1 U de zona de seguridad alrededor.

#### Reglas añadidas por REACH (legibilidad móvil)
- Mínimo 30 px de texto en el lienzo de 1080 × 1350 (incluye "Desliza…", etiquetas y pills); texto pequeño en peso 400.

## Productos seleccionados

### EMFEMME 360 (id: emfemme-360)
- Estado: creado por el usuario, PENDIENTE DE REVISIÓN
- approved_claims: [] (vacío: ninguna afirmación clínica aprobada)
- Registro del catálogo (btl_products.json):
```json
{
  "id": "emfemme-360",
  "name": "EMFEMME 360",
  "category": "women's intimate health and vaginal rejuvenation",
  "url": "https://eternawellnessmd.com/what-is-emfemme-360-vaginal-rejuvenation-meaning-benefits-and-how-it-works/",
  "description": "EmFemme 360 is an FDA-cleared, non-invasive radiofrequency (RF) treatment for comprehensive vaginal rejuvenation. It targets internal vaginal walls and external vulva areas using 360° volumetric heating. \n\nUnlike lasers or surgery, EmFemme 360 uses a probe that heats the full length of vaginal tissue uniformly in just 8-10 minutes per session. No anesthesia or downtime is needed.",
  "key_features": [
    "1. Utiliza radiofrecuencia monopolar no ablativa: calienta el tejido sin cortarlo ni emplear láser.",
    "2. Emite energía en 360° mediante un aplicador intravaginal y permite tratamiento externo de la zona vulvar.",
    "3. Monitoriza la temperatura en tiempo real mediante un sensor integrado. En el protocolo estudiado, el tejido vaginal alcanzaba aproximadamente 40–45 °C.",
    "4. La aplicación interna dura unos 8 minutos. El tratamiento externo requiere tiempo adicional; en ese estudio fueron 12 minutos.",
    "5. Se realiza de forma ambulatoria y sin anestesia en el protocolo publicado. Se permitió retomar las actividades habituales inmediatamente.",
    "6. Utiliza puntas de aplicador de un solo uso. Fabricante BTL.",
    "7. Existen resultados preliminares favorables sobre sequedad, dolor durante las relaciones y salud vaginal. Un estudio de 2024 incluyó solo 24 mujeres, sin grupo de control y con seguimiento de 12 semanas: no demuestra beneficios duraderos ni resultados garantizados."
  ],
  "approved_claims": [],
  "assets_path": null,
  "documentation": null
}
```
- Sin extractos de documentación.

## Imágenes y logos disponibles (usa solo estas rutas)

- `data/uploads/pub-2/Exion_360_PIC_Emfemme-360-Applicator-Tips_ENUS100.png` · upload · 1920×1292px
- `data/uploads/pub-2/Exion_ICON_32__Oval_ES100.png` · upload · 830×243px
- `data/uploads/pub-2/Exion_ICON_82__Oval_ES100.png` · upload · 830×243px
- `data/uploads/pub-2/Exion_ICON_123_Vaginal-Health-Improvement_ENUS100.png` · upload · 795×249px
- `data/uploads/pub-2/Exion_ICON_Oval_Emfemme-360_ENUS100.png` · upload · 1505×373px
- `data/uploads/pub-2/Exion_ICON_Vaginal-Rejuvenation_EN100.png` · upload · 2293×471px
- `data/uploads/pub-2/Exion_PIC_Circle-intimate_ENUS100.png` · upload · 2550×2550px
- `data/uploads/pub-2/Exion_PIC_Device-4880-Rotate-Clear-RF_EN100.png` · upload · 3840×5760px
- `data/uploads/pub-2/Exion_PIC_Device-Dark_EN100.png` · upload · 10276×15000px
- `data/uploads/pub-2/Exion_PIC_Device-top-view_5082_ENUS100.png` · upload · 2512×3861px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator_5262_ENUS100.png` · upload · 5760×3840px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator_5325_ENUS100.png` · upload · 5760×3840px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator-Energy_ENUS101.jpg` · upload · 1638×874px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator-V-24-Tip-5564_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator-V-30-Tip-5563_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-2/Exion_PIC_Emfemme-360-Applicator-V-Tip-5565_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-2/Exion_PIC_Intimate-app_5375_ENUS100.png` · upload · 1920×2880px
- `public/assets/brands/btl/logo/btl-logo.svg` · brand_logo

## Sistema de diseño BTL — componentes disponibles (design-system/btl)

Cada diapositiva es un `Slide` con `background`: "dark" | "blue" | "enterprise" | "deep" | "light" | "white"; `lightFrom`: "top-right" | "top-left" | "bottom-right" | "bottom-left" (gradient light corner; keep it away from the logo on "blue").
Sus hijos son nodos de este catálogo (cualquier otra prop se rechaza):

- **Region** (container) — Absolutely positioned block: the main composition tool. Default left = "m" unless right + width are set. right="m" alone = full width between margins.
  Props: `left`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `top`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `right`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `bottom`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `width`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `height`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `direction`: "column" | "row"; `align`: "start" | "center" | "end" | "between"; `crossAlign`: "start" | "center" | "end" | "stretch"; `gap`: number; `padding`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `surface`: "enterprise" | "deep" | "white" | "sky" (solid panel; switches text tone); `tone`: "dark" | "light"; `wrap`: boolean
- **Stack** (container) — Flex flow inside a Region or Module.
  Props: `direction`: "column" | "row"; `gap`: number; `align`: "start" | "center" | "end" | "between"; `crossAlign`: "start" | "center" | "end" | "stretch" | "baseline"; `width`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `grow`: boolean
- **ModuleGrid** (container) — Hairline modular grid (scientific/educational). Children must be Module nodes. Place inside a Region.
  Props: `columns`: number | CSS grid-template-columns string, e.g. "380px 1fr"; `rows`: CSS grid-template-rows string; `open`: boolean (no outer side borders)
- **Module** (container) — One cell of a ModuleGrid.
  Props: `span`: number; `rowSpan`: number; `padding`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `gap`: number; `align`: "start" | "center" | "end" | "between"; `surface`: "enterprise" | "deep" | "white" | "sky"; `height`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px)
- **Headline** (text) — Hook or title, sentence case, one color. Sizes: display 116 SemiBold, xl 96, l 76, m 60, s 48 (Light). "\n" forces a line break.
  Props: `size`: "display" | "xl" | "l" | "m" | "s"; `weight`: "thin" | "light" | "regular" | "semibold"; `tone`: "strong" | "base" | "accent"; `maxWidth`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `as`: "h1" | "h2" | "h3" | "p"
- **Body** (text) — Body copy or question: l 42 Light, m 34, s 30.
  Props: `size`: "l" | "m" | "s"; `weight`: "thin" | "light" | "regular" | "semibold"; `tone`: "strong" | "base" | "accent"; `maxWidth`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px)
- **Eyebrow** (text) — Small label above a headline (product, occasion, section). 30–44 px.
  Props: `size`: number 30–44; `weight`: "thin" | "light" | "regular" | "semibold"; `tone`: "strong" | "base" | "accent"
- **Footnote** (text) — Source or disclaimer at 30 px.
  Props: `tone`: "strong" | "base" | "accent"; `maxWidth`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px)
- **DatePill** (text) — Rounded date pill, e.g. "18 de octubre".
- **DateLine** (leaf) — Quiet "date —— occasion" line.
  Props: `date`: string; `occasion`: string
- **BigNumber** (leaf) — Oversized thin numeral as typographic hero ("18", "+100"). Only figures with a source.
  Props: `value`: string; `size`: number 120–480; `weight`: "thin" | "light" | "regular" | "semibold"; `tone`: "strong" | "base" | "accent"
- **Stat** (leaf) — Figure + label with an accent rule. Only figures with a source.
  Props: `value`: string; `label`: string; `size`: number 52–160; `rule`: "left" | "top" | "none"; `labelMaxWidth`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px)
- **NumberedList** (leaf) — 01/02/03 list in rows (hairlines) or columns.
  Props: `items`: [{ title: string, text?: string }]; `layout`: "rows" | "columns"; `numeralSize`: number; `numeralWidth`: number; `gap`: number
- **IconList** (leaf) — Benefits with weight-100 icons, rows or columns.
  Props: `items`: [{ icon: "airline_seat_flat" | "checklist" | "do_not_touch" | "swipe_left" | "trending_up", title: string, text?: string }]; `layout`: "rows" | "columns"; `iconSize`: number
- **Rule** (leaf) — Accent bar or hairline divider.
  Props: `orientation`: "horizontal" | "vertical"; `length`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `thickness`: number; `emphasis`: "strong" | "subtle"
- **ProductImage** (leaf) — Official product photo anywhere on the canvas; may bleed off an edge; set height to crop. White photo backgrounds blend into light slides automatically.
  Props: `src`: string (an asset path from the list); `alt`: string; `left`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `top`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `right`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `bottom`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `width`: number; `height`: number; `objectPosition`: CSS object-position; `blend`: "auto" | "multiply" | "normal"; `caption`: { text: string, x: number, y: number }
- **ProductLogo** (leaf) — Official product wordmark/badge image inline in a text stack. Keep ≥ 1 U from the BTL logo.
  Props: `src`: string (asset path); `alt`: string; `width`: number
- **BtlLogo** (leaf) — Official BTL logo, exactly one per slide, 2 U from the edges; color follows the tone.
  Props: `placement`: "top-right" | "top-left" | "bottom-right" | "bottom-left"
- **SwipeCue** (text) — "Desliza…" cue with icon; on every slide except the last.
  Props: `placement`: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline"
- **Icon** (leaf) — Material Symbols Sharp weight 100.
  Props: `name`: "airline_seat_flat" | "checklist" | "do_not_touch" | "swipe_left" | "trending_up"; `size`: number; `tone`: "strong" | "base" | "accent"
- **CtaBlock** (leaf) — Closing CTA. Defaults: "Solicita tu demo" / Escríbenos “DEMO” por mensaje directo / "BTL El Salvador".
  Props: `title`: string; `detail`: string; `signature`: string ("" hides it); `variant`: "stacked" | "outline" | "split"; `size`: number 48–120
- **Glow** (leaf) — Soft Sky Blue light pool (floor glow, halo).
  Props: `left`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `top`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `width`: number; `height`: number; `intensity`: number 0–1
- **Rings** (leaf) — Concentric hairline circles framing a subject.
  Props: `cx`: number; `cy`: number; `radii`: number[]
- **SessionSquares** (leaf) — Unit chart: one square per unit; pair with a sourced figure.
  Props: `count`: number; `perRow`: number; `size`: number
- **SpineIllustration** (leaf) — Glowing lateral spine (spine topics only, dark backgrounds).
  Props: `width`: number; `height`: number
- **SpineDiagram** (leaf) — Labeled lateral spine diagram (spine topics only).
  Props: `height`: number; `highlight`: ("cervical" | "thoracic" | "lumbar")[]; `labels`: boolean
- **VertebraRuler** (leaf) — 33-tick vertebra ruler (spine topics only).
  Props: `height`: number; `highlight`: ("cervical" | "thoracic" | "lumbar")[]; `labels`: boolean
- **DiscGlyph** (leaf) — Two-vertebra indication glyph (spine topics only).
  Props: `kind`: "hernia" | "lumbar" | "facet" | "degenerative"; `size`: number
- Optional `style` on any node, layout keys only: marginTop, marginBottom, marginLeft, maxWidth, alignSelf, flex.

## Comentarios previos de Jaime en esta publicación (respétalos)

- 2026-10-14: "Este carrusel se asemeja mucho al diseño del último carrusel, asegurémonos de que haya variedad gráfica o nuevas propuestas de diseño siguiendo el lineamiento de la marca."
- 2026-10-14: "Rehacer con los layouts nuevos y más variedad gráfica. Nuevo hook que deje al público con ganas de saber más. Solo EMFEMME 360, sin mencionar Exion."
- 2026-10-14: "Cambia el hook, aún lo sentimos muy genérico. Personalízalo para la fecha y la audiencia: las clínicas que van a ofrecer el servicio."

## Documentos adjuntos por el usuario

Ninguno.

## Referencias editoriales

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json

## Entrega

Devuelve el objeto JSON del esquema: `proposals` (exactamente tres: A, B y C, cada una con 3 diapositivas, caption, fuentes y afirmaciones) y `warnings`. Todo el texto en español.

