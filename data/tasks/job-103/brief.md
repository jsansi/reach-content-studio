# Encargo: revisar una propuesta de diseño
## Brief de la publicación

- Marca (cliente): BTL Estética El Salvador — firma en las piezas: "BTL El Salvador"
- Fecha de publicación: 2026-10-18
- Tema: Dia Mundial de la Menopausia
- Formato: Carrusel · 3 diapositiva(s) de 1080 × 1350 px
- Objetivo de marketing: Fecha conmemorativa
- Fecha límite de producción: 2026-10-18

## Instrucciones creativas del usuario

La estructura del carrusel tiene que empazar con un hook stop scrolling, el publico objetivo son las clinicas y los profesionales que ofrecen este servicio, no queremos que el hook sea generico, no queremos saturar de texto y queremos que la fecha y el reconocimiento del dia sea prominente pero que no ocupe todo el espacio de la slide. 

La 2da slide del carrusel queremos que refleje qué hace el equipo y cuáles son las ventajas que ofrece. Estas ventajas son para mostrarles a los pacientes qué ventajas tiene en comparación con otros productos. Esta slide debe contener imágenes del equipo, incluyendo las imágenes que aparecen en la página de btl. Adjuntaremos la imagen de la página porque no tenemos acceso a ella. 

La 3ra slide debe contener las ventajas para la clínica y el cta.

El contenido de todo el carrusel no tiene que verse corporativo y tiene que generar interés o enganchar al público para que quiera ver el contenido de todas las slides.
El contenido de todo el carrusel no debe ser solo un slide con fondo blanco, siempre debe de llevar un difumano o un fondo que se va pulido y trabajado. Tampoco queremos que las slides lleven un marco cuadrado definido, las slides deben de respirar.

Queremos explotar la creatividad al maximo! Puedes basarte en la estetica del archivo adjunto tambien.

## Preferencias editoriales activas (obligatorias)

- Nombrar siempre a la marca como "BTL El Salvador" en diapositivas, captions, textos alternativos y firmas. Nunca "BTL Medical" ni separar en divisiones médica/estética.
- CTA corto: "Solicita tu demo", sin flecha. Las demos se piden por mensaje directo con la palabra "DEMO".
- Escribir las cifras como "+100 posiciones", no "100+" ni "más de 100".
- Priorizar ventajas prácticas para la clínica o el profesional (personalizar protocolos, manos libres, nueva línea de servicio); dejar los detalles técnicos fuera o al mínimo.
- Caption de unos 500 caracteres: gancho con la palabra clave de la fecha, un párrafo de beneficio que nombre el producto, CTA por mensaje directo "DEMO" y unos 5 hashtags.
- Las piezas se ven sobre todo en el móvil: ningún texto por debajo de 30 px en el lienzo de 1080 px (incluye "Desliza…", etiquetas y pills), y peso regular en los textos pequeños.
- Este carrusel se asemeja mucho al diseño del último carrusel, asegurémonos de que haya variedad gráfica o nuevas propuestas de diseño siguiendo el lineamiento de la marca.
- Estilo de creatividad preferido (referencia: portada del Día Mundial de la Columna Vertebral, 16 oct 2026): una ilustración vectorial hecha en código del tema de la publicación, en trazo fino blanco con relleno celeste translúcido, la zona clave iluminada con brillo celeste y un halo suave, sobre el fondo azul oscuro de BTL; la ilustración comparte la slide con el texto, sin taparlo. Usar este recurso siempre que el tema lo permita (en temas de columna: SpineIllustration / ilustración "spine").

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

- `data/uploads/pub-3/Exion_360_PIC_Emfemme-360-Applicator-Tips_ENUS100.png` · upload · 1920×1292px
- `data/uploads/pub-3/Exion_ICON_32__Oval_ES100.png` · upload · 830×243px
- `data/uploads/pub-3/Exion_ICON_82__Oval_ES100.png` · upload · 830×243px
- `data/uploads/pub-3/Exion_ICON_123_Vaginal-Health-Improvement_ENUS100.png` · upload · 795×249px
- `data/uploads/pub-3/Exion_ICON_Oval_Emfemme-360_ENUS100.png` · upload · 1505×373px
- `data/uploads/pub-3/Exion_ICON_Vaginal-Rejuvenation_EN100.png` · upload · 2293×471px
- `data/uploads/pub-3/Exion_PIC_Circle-intimate_ENUS100.png` · upload · 2550×2550px
- `data/uploads/pub-3/Exion_PIC_Device-4880-Rotate-Clear-RF_EN100.png` · upload · 3840×5760px
- `data/uploads/pub-3/Exion_PIC_Device-Dark_EN100.png` · upload · 10276×15000px
- `data/uploads/pub-3/Exion_PIC_Device-top-view_5082_ENUS100.png` · upload · 2512×3861px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator_5262_ENUS100.png` · upload · 5760×3840px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator_5325_ENUS100.png` · upload · 5760×3840px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator-Energy_ENUS101.jpg` · upload · 1638×874px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator-V-24-Tip-5564_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator-V-30-Tip-5563_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator-V-Tip-5565_ENUS100.png` · upload · 3840×5760px
- `data/uploads/pub-3/Exion_PIC_Intimate-app_5375_ENUS100.png` · upload · 1920×2880px
- `data/uploads/pub-3/femme360.png` · upload · 792×612px
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
  Props: `src`: string (an asset path from the list); `alt`: string; `left`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `top`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `right`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `bottom`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `width`: number; `height`: number; `objectPosition`: CSS object-position; `blend`: "auto" | "multiply" | "normal"; `fade`: ("left" | "right" | "top" | "bottom")[] (those edges dissolve into the background: hides hard photo cuts; the file is not modified); `fadeSize`: number px (default 180); `caption`: { text: string, x: number, y: number }
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
- **Halo** (leaf) — Luminous ring (optionally with a soft glow) around or behind a subject; may bleed off the canvas. Repeat it across slides as a continuous motif.
  Props: `cx`: number (center x; may be < 0 or > 1080); `cy`: number; `r`: number; `thickness`: number 1–16 (default 3); `tone`: "sky" | "white" | "enterprise" | "secondary" (the product secondary color: only when the brief assigns one; graphics only, max 10 % of the slide); `glow`: number 0–1 (default 0.5); `opacity`: number 0–1
- **Curve** (leaf) — Smooth luminous line through 2–5 points. Points may lie outside the canvas: to continue it on the next slide, a point at x = 1080 + d here is x = d there (same y).
  Props: `points`: [[x, y], …] (2–5 points); `width`: number 1–12 (default 3); `tone`: "sky" | "white" | "enterprise" | "secondary" (the product secondary color: only when the brief assigns one; graphics only, max 10 % of the slide); `glow`: number 0–1 (default 0.4); `opacity`: number 0–1
- **LightBand** (leaf) — Soft Sky Blue → white light band (BTL carousel template); may cross the slide edge to link two slides. Text over it goes in a Region with tone "light".
  Props: `left`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `top`: number (px on the 1080 canvas) | "m" (2 U brand margin = 94 px); `width`: number; `height`: number; `from`: "left" | "right" (where the light is strongest); `fade`: ("left" | "right" | "top" | "bottom")[]; `opacity`: number 0–1
- **Rings** (leaf) — Concentric hairline circles framing a subject.
  Props: `cx`: number; `cy`: number; `radii`: number[]
- **SessionSquares** (leaf) — Unit chart: one square per unit; pair with a sourced figure.
  Props: `count`: number; `perRow`: number; `size`: number
- **Illustration** (leaf) — Topic illustration you draw yourself as SVG (anatomy, organ, joint, concept), schematic like SpineIllustration. Shapes only (path, circle, ellipse, rect, line, polyline, polygon, g, defs, linear/radialGradient, stop, clipPath, mask, filter with feGaussianBlur/feMerge), colours only #00508c #000a32 #96d2ff #ffffff or none; no text, images or links. Never draw BTL equipment. Place it in a Region like a photo; it may not pass behind text.
  Props: `svg`: string (inner SVG markup, ≤ 60 000 characters); `viewBox`: string, e.g. "0 0 400 600"; `width`: number; `height`: number; `title`: string (what it shows, Spanish)
- **BoneIllustration** (leaf) — Glowing stylised femur with spongy bone at both ends (bone-health/osteoporosis topics only, dark backgrounds). porous=true draws it sparse and broken.
  Props: `width`: number; `height`: number; `porous`: boolean
- **BoneDensity** (leaf) — Circular close-up of spongy bone: dense (healthy) or porous (osteoporosis), with an optional 30 px label. Pair two to compare (bone-health topics only; educational, not a clinical image).
  Props: `porous`: boolean; `size`: number; `label`: string
- **SpineIllustration** (leaf) — Glowing lateral spine (spine topics only, dark backgrounds).
  Props: `width`: number; `height`: number
- **SpineDiagram** (leaf) — Labeled lateral spine diagram (spine topics only).
  Props: `height`: number; `highlight`: ("cervical" | "thoracic" | "lumbar")[]; `labels`: boolean
- **VertebraRuler** (leaf) — 33-tick vertebra ruler (spine topics only).
  Props: `height`: number; `highlight`: ("cervical" | "thoracic" | "lumbar")[]; `labels`: boolean
- **DiscGlyph** (leaf) — Two-vertebra indication glyph (spine topics only).
  Props: `kind`: "hernia" | "lumbar" | "facet" | "degenerative"; `size`: number
- Optional `style` on any node, layout keys only: marginTop, marginBottom, marginLeft, maxWidth, alignSelf, flex.

**Color secundario: ninguno asignado** para el producto de esta publicación en la guía de redes sociales de BTL. No uses el tono `secondary`; usa `sky`, `white` o `enterprise`.

## Ilustraciones disponibles

Ilustraciones del sistema de diseño: `SpineIllustration`, `SpineDiagram`, `VertebraRuler`, `DiscGlyph` (columna) y `BoneIllustration`, `BoneDensity` (hueso, osteoporosis).
Biblioteca: todavía no hay ilustraciones guardadas de publicaciones aprobadas.

## Comentarios previos de Jaime en esta publicación (respétalos)

- 2026-10-15: "SLIDE 1 — ABRIR LA CONVERSACIÓN

Hook principal:
“¿Y si la salud íntima también tuviera espacio en tu consulta?”

Distribuye el texto con saltos de línea intencionales para que se lea rápidamente en móvil. La pregunta debe dominar la composición.

Incluye con buena visibilidad, en un nivel secundario:
“18 de octubre”
“Día Mundial de la Menopausia”

Cierre breve:
“Abrir la conversación es el primer paso →”

La portada debe generar curiosidad y conectar con el profesional, sin culpabilizarlo ni asumir que sus pacientes sienten vergüenza.

Retira de la portada la idea de que “la respuesta dura solo 8 minutos”. El hook debe hablar de la consulta y de la salud íntima.

SLIDE 2 — PRESENTAR UNA OPCIÓN CONCRETA

Titular sugerido:
“Hablemos de lo que puedes ofrecer.”

Presenta EMFEMME 360 claramente, con una imagen oficial del aplicador como protagonista. Puedes incorporar una segunda vista del equipo si ayuda a entender el producto y su correspondencia está documentada.

Explica de forma breve:
“Radiofrecuencia no invasiva con calentamiento en 360°.”

Selecciona un máximo de dos apoyos breves, respaldados por la documentación, por ejemplo:
• Aplicación interna y externa.
• Visualización de temperatura en tiempo real.

Prioriza explicar qué hace la tecnología y qué características resultan relevantes al conversar con una paciente. Evita convertir esta slide en una ficha técnica.

No presentes el producto como una solución general para la menopausia. Cualquier indicación clínica específica debe contar con respaldo y validación aplicables a esta publicación.

La transición debe llevar naturalmente a pensar en su incorporación a la consulta.

SLIDE 3 — COMPLETAR LA HISTORIA

Titular:
“Dale espacio en tu consulta.”

Conecta explícitamente con la pregunta de la portada.

Presenta hasta tres ventajas concretas para el profesional, con redacción breve y natural. Puedes trabajar sobre:
• Ampliar la oferta de servicios de salud íntima.
• Aplicación breve y técnica sencilla, según el fabricante.
• Control del tratamiento mediante visualización de temperatura.

Distribuye la información entre las slides 2 y 3 para evitar repetir los mismos argumentos.

Cierre:
“Conoce EMFEMME 360.”
“Agenda una demo con BTL El Salvador.”

Usa un único CTA principal. No prometas ingresos, rentabilidad ni captación de pacientes.

DIRECCIÓN VISUAL

• Crea una composición distinta para cada slide, manteniendo continuidad.
• Usa fondos trabajados con degradados suaves, luz y profundidad.
• Mantén contraste suficiente para leer cómodamente en móvil.
• Da protagonismo a la tipografía y a las imágenes oficiales.
• Deja espacio alrededor de los elementos.
• Evita marcos cuadrados, tarjetas repetitivas y largas filas de iconos.
• Introduce un recurso visual sutil que continúe entre slides: una curva, un halo o una transición de color.
• Conserva logos oficiales, proporciones y zonas de seguridad.
• Ajusta primero la cantidad de texto antes de reducir su tamaño.

PRECISIÓN DEL CONTENIDO

Distingue las descripciones del fabricante de las afirmaciones clínicas aprobadas. Conserva el estado real de validación del producto.

No uses porcentajes de resultados mientras existan discrepancias entre el PDF y las insignias adjuntas. Tampoco uses comparaciones como “el más corto del mercado” sin documentación suficiente.

Si conservas el dato de 8 minutos, verifica a qué aplicación y protocolo corresponde y exprésalo con precisión. No lo presentes como duración total de la consulta ni como tiempo para obtener resultados.

Revisa las imágenes del equipo completo: si aparece EXION, confirma su relación con EMFEMME 360 antes de utilizarlas. No alteres las marcas impresas para aparentar otro dispositivo.

CAPTION

Reescribe el caption para acompañar la historia, sin repetir todo el carrusel.

Abre con la conversación sobre salud íntima en consulta, vincúlala con la conmemoración y presenta brevemente EMFEMME 360. Termina invitando a escribir por mensaje directo para conocer el equipo o agendar una demo."
- 2026-10-15: "acabo de agregar femme360.pdf, puedes usar esa imagen en la primera slide. O tambien puedes usar algun icono que llame la atencion, la primera slide debe contener imagen"
- 2026-10-15: "El concepto del diseño en general me gusta, para la slide 1 me gustaria resaltar mas la fecha que se esta homenajeando, sin que opaque el hook, en la slide 2 me gustaria el logo de EMFEMMEy distintas visualizaciones del aplicador o el aplicador con los cabezales y quitar el tercer parrafo de texto y sustituirlo por la funcion que realiza el emfemme o que beneficio obtendria el paciente al aplicarselo, en la slide 3 son ventajas o posibilidades para la clinica usando iconografia para resaltar hasta 3 ventajas y cerrar con un solicita tu demo al final de la slide"
- 2026-10-15: "En la slide 1 hay que arreglar la jerarquización de los elementos y arreglarlo según funcione mejor

En la slide 2 hay que quitar el 360° en grande y solo usar el logo y las imágenes del aplicador y sus puntas o usar varias imágenes solo del equipo, también hay que arreglar la jerarquización de los textos y arreglar la descripción explicando qué resultado ofrece el aplicat EMFEMME de una manera que sea breve y facil de entender 

En la slide 3 se muestra como que la descripción la está subiendo otra persona que no sea BTL, tienes que hablar en primero personas porque nosotros somos BTL, también solo deja el "Solicita tu demo" sin la frase secundaria ni lo de BTL El Salvador"
- 2026-10-15: "En la slide 1 perdimos totalmente el concepto, el hook se robó todo el protagonismo y ahora casi no se ve la fecha a la que estamos conmemorando, puedes reordenar los elementos que están en toda la slide para darle jerarquización correcta y sea fácil de leer y comprender

En la slide 2 mejoró bastante la descripción pero no quiero tantos detalles técnicos, prefiero explicar el procedimiento y las ventajas de aplicarlo, las imágenes que has usado no tienen estructura visual, revisa cuáles imágenes de producto puede funcionar mejor para que se vea más llamativo el equipo

En la slide 3 el titular es demasiado similar al hook de la slide 1 hay que ajustarlo como "seduciendo" de manera breve y concisa porque es mejor para la clínica

Arregla también los textos de los íconos para deslizar a la siguiente slide"
- 2026-10-15: "Ahora la estructura de todo el carrusel se ve mucho mejor

En la slide 1 el 18 tiene mucho resaltado, prefiero la barra pequeña que diga todo junto "18 de octubre" sobre un color que lo resalte y al lado el día homenajeado, también el color del texto del hook creo que desentona con la paleta de color que se está usando

En la slide 2 creo que había una imagen del aplicador con las ondas visibles podemos usar esa, la descripción va mejorando pero lo que quiero es que diga que hace y que resultados se obtienen después de las aplicaciones, los beneficios para el paciente y que no se vea redundante con la información de la slide 3. Que no se vea tan corporativo es más como despertando el interés al posible comprador del equipo 

Cuida que la tipografía y sus colores tengan uniformidad para todo el carrusel"
- 2026-10-15: "Genial, me gusta como está, ahora lo único sería cambiar en la slide 1 lo de la fecha y el día, siento que ha perdido protagonismo y en un principio estamos homenajeando ese día, quiero que destaque un poco más sin que le robe protagonismo al hook o al resto de elementos gráficos de esa slide y también cambiar el texto para deslizar a la siguiente slide, tiene que capturar más la atención, generar curiosidad para ver la siguiente slide"
- 2026-10-15: "En todas las slides considera dejar el logo de BTL al lado derecho en lugar del lado izquierdo 

En la Slide 1 lo puedes reorganizar la fecha a la izquierda para que quede al mismo nivel del logo sin que pierda visibilidad, puede ser en dos líneas lo de "día de la menopausia" y darle más espacio a la imagen y al texto del hook para que no se vean tan unidos

En la slide 2 el logo de EMFEMME puede quedar a la misma altura del de BTL y así darle más espacio a la imagen del aplicador

También los textos de desliza no tienen que parecer textos independientes necesito frases cortas y breves como "desliza para descubrirlo" o algo por el estilo, no tiene que ser específicamente esa frase, es solo ejemplo"
- 2026-10-15: "Genial, ahora en la slide 2 el texto debajo del título hay que cambiarlo

En lugar de "Estimula la circulación y el colágeno de la zona íntima por dentro y por fuera" vamos a poner "Diseñado para apoyar el tratamiento de laxitud vaginal y disfunción sexual de manera no invasiva"

Y en lugar de "Para tu paciente un tratamiento no invasivo de la laxitud vaginal y la disfunción sexual" vamos a usar "Ayuda a mejorar tono del tejido, lubricación, sensibilidad y comodidad durante la vida íntima""
- 2026-10-15: "los textos descriptivos se ven demasiado compactados, arreglalo para que se lea de manera fácil, elige que opción es mejor por ejemplo cambiar tamaño de fuente o como se vería mejor"
- 2026-10-15: "En la slide 2, los párrafos descriptivos no están bien alineados y ocupan demasiado espacio de la slide, ajustalos buscando buena alineación y jerarquización para que no ocupen tanto espacio y que siempre sean legibles de leer, la imagen del aplicador la prefiero más centrada de lo que está ahora"
- 2026-10-17: "El título debe cambiar y en vez de tener 2 párrafos necesitamos solo 1. El título es: "Una nueva etapa". Su bienestar, siempre."

Y la descripción: "Una alternativa no invasiva para abordar la laxitud vaginal, con el bienestar de tu paciente en el centro""
- 2026-10-17: "puedes revisar el parrafo? despues de la coma abres una nueva linea pero el texto cabe en la misma segunda linea"

## Documentos adjuntos por el usuario

- `data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf` (btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf, 3076 KB)
- `data/uploads/pub-3/femme360.pdf` (femme360.pdf, 468 KB)

## Referencias editoriales

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json
- data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf
- data/uploads/pub-3/femme360.pdf

## Propuesta actual

```json
{
  "direction": "A",
  "direction_name": "Editorial minimalista",
  "concept": "El Día Mundial de la Menopausia abre la portada con una etiqueta de fecha clara y la pregunta la cierra; la segunda diapositiva despierta el interés con el aplicador y sus ondas y explica qué hace y qué obtiene la paciente; la tercera seduce a la clínica con tres ventajas y una sola llamada. Una tipografía y una paleta en todo el carrusel, y un hilo fino de luz al pie.",
  "differentiation": "Tipografía protagonista sobre fondos claros: el gancho domina la portada, la segunda muestra dos vistas oficiales del equipo y la tercera resume tres ventajas con iconos. Las imágenes acompañan; mucho espacio negativo.",
  "slides": [
    {
      "purpose": "Conmemorar: la fecha abre la diapositiva en grande; la foto acompaña y la pregunta cierra",
      "background": "light",
      "lightFrom": "bottom-left",
      "alt": "Fondo claro. Arriba: 18 de octubre, Día Mundial de la Menopausia. En el centro, fotografía de un profesional sosteniendo un aplicador de BTL junto a la cadera de una paciente recostada, que se disuelve en el fondo. Abajo: ¿Y si la salud íntima también tuviera espacio en tu consulta? Desliza para descubrirlo.",
      "nodes": [
        {
          "id": "img",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\": \"data/uploads/pub-3/femme360.png\", \"alt\": \"Profesional sosteniendo un aplicador de BTL junto a la cadera de una paciente recostada\", \"left\": 330, \"top\": 270, \"width\": 760, \"fade\": [\"left\", \"bottom\"], \"fadeSize\": 260}",
          "text": null
        },
        {
          "id": "line",
          "parent": null,
          "type": "Curve",
          "props": "{\"points\": [[-100, 1318], [700, 1296], [1620, 1314], [2500, 1294], [3340, 1316]], \"width\": 2, \"tone\": \"enterprise\", \"glow\": 0}",
          "text": null
        },
        {
          "id": "logo",
          "parent": null,
          "type": "BtlLogo",
          "props": "{\"placement\": \"top-right\"}",
          "text": null
        },
        {
          "id": "r0",
          "parent": null,
          "type": "Region",
          "props": "{\"top\": \"m\", \"left\": \"m\", \"gap\": 14}",
          "text": null
        },
        {
          "id": "dp",
          "parent": "r0",
          "type": "DatePill",
          "props": "{}",
          "text": "18 de octubre"
        },
        {
          "id": "do",
          "parent": "r0",
          "type": "Headline",
          "props": "{\"size\": \"s\", \"weight\": \"semibold\", \"tone\": \"strong\", \"as\": \"p\"}",
          "text": "Día Mundial\nde la Menopausia"
        },
        {
          "id": "r",
          "parent": null,
          "type": "Region",
          "props": "{\"top\": 890, \"right\": \"m\"}",
          "text": null
        },
        {
          "id": "h",
          "parent": "r",
          "type": "Headline",
          "props": "{\"size\": \"l\", \"weight\": \"light\", \"tone\": \"strong\", \"as\": \"h1\"}",
          "text": "¿Y si la salud íntima\ntambién tuviera espacio\nen tu consulta?"
        },
        {
          "id": "sw",
          "parent": null,
          "type": "SwipeCue",
          "props": "{}",
          "text": "Desliza para descubrirlo"
        }
      ]
    },
    {
      "purpose": "Presentar EMFEMME 360 con el aplicador como protagonista: una nueva etapa, el bienestar de la paciente y una alternativa no invasiva para la laxitud vaginal.",
      "background": "light",
      "lightFrom": "top-right",
      "alt": "Fondo claro con el logo de EMFEMME 360 y el aplicador con ondas de energía alrededor de la punta. Titular: \"Una nueva etapa. Su bienestar, siempre.\" Texto: \"Una alternativa no invasiva para abordar la laxitud vaginal, con el bienestar de tu paciente en el centro.\" Desliza, aún hay más.",
      "nodes": [
        {
          "id": "app",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\": \"data/uploads/pub-3/Exion_PIC_Emfemme-360-Applicator-Energy_ENUS101.jpg\", \"alt\": \"Aplicador de EMFEMME 360 con ondas de energía alrededor de la punta\", \"left\": 100, \"top\": 230, \"width\": 880}",
          "text": null
        },
        {
          "id": "line",
          "parent": null,
          "type": "Curve",
          "props": "{\"points\": [[-1180, 1318], [-380, 1296], [540, 1314], [1420, 1294], [2260, 1316]], \"width\": 2, \"tone\": \"enterprise\", \"glow\": 0}",
          "text": null
        },
        {
          "id": "logo",
          "parent": null,
          "type": "BtlLogo",
          "props": "{\"placement\": \"top-right\"}",
          "text": null
        },
        {
          "id": "r1",
          "parent": null,
          "type": "Region",
          "props": "{\"top\": \"m\", \"left\": \"m\"}",
          "text": null
        },
        {
          "id": "pl",
          "parent": "r1",
          "type": "ProductLogo",
          "props": "{\"src\": \"data/uploads/pub-3/Exion_ICON_Oval_Emfemme-360_ENUS100.png\", \"alt\": \"EMFEMME 360\", \"width\": 340}",
          "text": null
        },
        {
          "id": "r2",
          "parent": null,
          "type": "Region",
          "props": "{\"top\": 760, \"right\": \"m\", \"gap\": 40}",
          "text": null
        },
        {
          "id": "h",
          "parent": "r2",
          "type": "Headline",
          "props": "{\"size\": \"l\", \"weight\": \"light\", \"tone\": \"strong\", \"as\": \"h2\"}",
          "text": "Una nueva etapa.\nSu bienestar, siempre."
        },
        {
          "id": "p1",
          "parent": "r2",
          "type": "Stack",
          "props": "{\"direction\":\"column\",\"gap\":18,\"width\":820}",
          "text": null
        },
        {
          "id": "p1r",
          "parent": "p1",
          "type": "Rule",
          "props": "{\"length\":64,\"thickness\":3,\"emphasis\":\"strong\"}",
          "text": null
        },
        {
          "id": "b",
          "parent": "p1",
          "type": "Body",
          "props": "{\"size\":\"m\",\"tone\":\"base\"}",
          "text": "Una alternativa no invasiva para abordar la laxitud vaginal,\ncon el bienestar de tu paciente en el centro."
        },
        {
          "id": "sw",
          "parent": null,
          "type": "SwipeCue",
          "props": "{}",
          "text": "Desliza, aún hay más"
        }
      ]
    },
    {
      "purpose": "Completar la historia: ventajas para el profesional y una demo",
      "background": "light",
      "lightFrom": "top-right",
      "alt": "Fondo claro. Texto: Más para ofrecer, sin complicarte. Amplía tu oferta: suma una nueva línea de servicio de salud íntima. Breve y sencillo: técnica fácil, con la temperatura en tiempo real. Ambulatorio: se realiza sin anestesia, en la misma consulta. Solicita tu demo.",
      "nodes": [
        {
          "id": "line",
          "parent": null,
          "type": "Curve",
          "props": "{\"points\": [[-2260, 1318], [-1460, 1296], [-540, 1314], [340, 1294], [1180, 1316]], \"width\": 2, \"tone\": \"enterprise\", \"glow\": 0}",
          "text": null
        },
        {
          "id": "logo",
          "parent": null,
          "type": "BtlLogo",
          "props": "{\"placement\": \"top-right\"}",
          "text": null
        },
        {
          "id": "r",
          "parent": null,
          "type": "Region",
          "props": "{\"top\": 270, \"right\": \"m\", \"gap\": 40}",
          "text": null
        },
        {
          "id": "h",
          "parent": "r",
          "type": "Headline",
          "props": "{\"size\": \"l\", \"weight\": \"light\", \"tone\": \"strong\", \"as\": \"h2\"}",
          "text": "Más para ofrecer,\nsin complicarte."
        },
        {
          "id": "l",
          "parent": "r",
          "type": "IconList",
          "props": "{\"layout\": \"rows\", \"iconSize\": 84, \"items\": [{\"icon\": \"trending_up\", \"title\": \"Amplía tu oferta\", \"text\": \"Suma una nueva línea de servicio de salud íntima.\"}, {\"icon\": \"checklist\", \"title\": \"Breve y sencillo\", \"text\": \"Técnica fácil, con la temperatura en tiempo real.\"}, {\"icon\": \"airline_seat_flat\", \"title\": \"Ambulatorio\", \"text\": \"Se realiza sin anestesia, en la misma consulta.\"}]}",
          "text": null
        },
        {
          "id": "c",
          "parent": null,
          "type": "Region",
          "props": "{\"bottom\": \"m\", \"left\": \"m\"}",
          "text": null
        },
        {
          "id": "cta",
          "parent": "c",
          "type": "Headline",
          "props": "{\"size\": \"l\", \"weight\": \"semibold\", \"tone\": \"strong\", \"as\": \"p\"}",
          "text": "Solicita tu demo"
        }
      ]
    }
  ],
  "caption": "La salud íntima también puede tener espacio en tu consulta. Este 18 de octubre, Día Mundial de la Menopausia, es un buen momento para abrir esa conversación con tus pacientes.\n\nEMFEMME 360 está diseñado para apoyar el tratamiento de la laxitud vaginal y la disfunción sexual de manera no invasiva, con calor por radiofrecuencia en la zona íntima, por dentro y por fuera.\n\n¿Quieres conocer el equipo? Escríbenos \"DEMO\" por mensaje directo y agenda tu demo con BTL El Salvador.\n\n#DíaMundialDeLaMenopausia #SaludÍntima #EMFEMME360 #MedicinaEstética #BTLElSalvador",
  "sources": [
    "data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf (página oficial de BTL para proveedores)",
    "knowledge/products/btl_products.json (emfemme-360, key_features)",
    "knowledge/brand-guidelines/btl_corporate_identity.pdf (v2.3)",
    "knowledge/brand-guidelines/Social-Media-Guideline.pdf (v1.3, plantilla de carrusel)"
  ],
  "claims": [
    {
      "claim": "Una alternativa no invasiva para abordar la laxitud vaginal",
      "location": "diapositiva 2",
      "source": "data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf · ¿Qué es EMFEMME 360? (\"procedimiento de radiofrecuencia no invasivo para el tratamiento de la laxitud vaginal y la disfunción sexual\")",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Una nueva etapa. Su bienestar, siempre. / con el bienestar de tu paciente en el centro",
      "location": "diapositiva 2",
      "source": "Titular de la marca indicado por el usuario; frase general sobre la etapa de la menopausia y el enfoque de la consulta, sin resultado clínico atribuido al equipo",
      "approval": "general_statement"
    },
    {
      "claim": "Diseñado para apoyar el tratamiento de la laxitud vaginal y la disfunción sexual de manera no invasiva",
      "location": "caption",
      "source": "data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf · ¿Qué es EMFEMME 360? (\"procedimiento de radiofrecuencia no invasivo para el tratamiento de la laxitud vaginal y la disfunción sexual\")",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Lleva calor por radiofrecuencia a la zona íntima, por dentro y por fuera",
      "location": "caption",
      "source": "data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf · ¿Cómo funciona EMFEMME 360?; knowledge/products/btl_products.json · emfemme-360 · key_features 1 y 2",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Amplía tu oferta: suma una nueva línea de servicio de salud íntima",
      "location": "diapositiva 3",
      "source": "Preferencias editoriales de la marca (nueva línea de servicio; sin promesa de ingresos ni pacientes)",
      "approval": "general_statement"
    },
    {
      "claim": "Técnica fácil, con la temperatura en tiempo real",
      "location": "diapositiva 3",
      "source": "data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf · Beneficios: Breve y sencillo; Control de tratamiento destacado; knowledge/products/btl_products.json · emfemme-360 · key_features 3",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Se realiza sin anestesia, en la misma consulta (ambulatorio)",
      "location": "diapositiva 3",
      "source": "knowledge/products/btl_products.json · emfemme-360 · key_features 5 (ambulatorio y sin anestesia en el protocolo publicado)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Más para ofrecer, sin complicarte",
      "location": "diapositiva 3",
      "source": "Titular comercial; resume las ventajas documentadas de la diapositiva 3",
      "approval": "general_statement"
    },
    {
      "claim": "18 de octubre, Día Mundial de la Menopausia",
      "location": "diapositiva 1 y caption",
      "source": "Brief de la publicación (fecha y ocasión)",
      "approval": "general_statement"
    }
  ]
}
```

## Solicitud de cambios de Jaime

- Alcance: Una diapositiva (diapositiva 2)
- Solicitud: "puedes revisar el parrafo? despues de la coma abres una nueva linea pero el texto cabe en la misma segunda linea"

## Entrega

Devuelve el objeto JSON del esquema: `proposal` completa revisada (misma dirección), `summary`, `changed_slides` y `warnings`. Todo el texto en español.

