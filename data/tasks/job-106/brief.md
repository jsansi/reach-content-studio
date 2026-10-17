# Encargo: revisar una propuesta de diseño
## Brief de la publicación

- Marca (cliente): BTL Medical El Salvador — firma en las piezas: "BTL El Salvador"
- Fecha de publicación: 2026-10-20
- Tema: Día Mundial de la Osteoporosis
- Formato: Carrusel · 3 diapositiva(s) de 1080 × 1350 px
- Objetivo de marketing: Fecha conmemorativa

## Instrucciones creativas del usuario

Para el día mundial de la osteoporosis la intención es la misma que con las fechas anteriores que hemos trabajado, crear en la slide 1 un hook que sea stop scrolling en primer plano y mostrando la fecha en segundo plano con una imagen que capte la atención del público, la slide 2 debe llevar el logo del equipo e imágenes del equipo y describir ventajas del uso del equipo y en al slide 3 las ventajas que conlleva para las clínicas tener este equipo con un CTA al final que diga "Solicita tu Demo". 

No debemos saturar de texto las slides y hay que darle jerarquía a los elementos en cada una de las slides, las 3 slides tienen que tener una especie de storyline que haga querer continuar deslizando hasta la última slide y despertar el interés del público objetivo narrando una historia logica y con objetivo

## Preferencias editoriales activas (obligatorias)

- Nombrar siempre a la marca como "BTL El Salvador" en diapositivas, captions, textos alternativos y firmas. Nunca "BTL Medical" ni separar en divisiones médica/estética.
- CTA corto: "Solicita tu demo", sin flecha. Las demos se piden por mensaje directo con la palabra "DEMO".
- Escribir las cifras como "+100 posiciones", no "100+" ni "más de 100".
- Priorizar ventajas prácticas para la clínica o el profesional (personalizar protocolos, manos libres, nueva línea de servicio); dejar los detalles técnicos fuera o al mínimo.
- Caption de unos 500 caracteres: gancho con la palabra clave de la fecha, un párrafo de beneficio que nombre el producto, CTA por mensaje directo "DEMO" y unos 5 hashtags.
- Las piezas se ven sobre todo en el móvil: ningún texto por debajo de 30 px en el lienzo de 1080 px (incluye "Desliza…", etiquetas y pills), y peso regular en los textos pequeños.
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

### BTL Magnetotherapy (id: magnetotherapy)
- Estado: creado por el usuario, PENDIENTE DE REVISIÓN
- approved_claims: [] (vacío: ninguna afirmación clínica aprobada)
- Registro del catálogo (btl_products.json):
```json
{
  "id": "magnetotherapy",
  "name": "BTL Magnetotherapy",
  "category": "Medical",
  "url": "https://www.btlnet.es/magnetotherapy",
  "description": "Los equipos de magnetoterapia de BTL Medical (principalmente representados por las series BTL-4000 Smart & Premium y BTL-4920) están catalogados como sistemas de fisioterapia avanzada de nivel profesional.\nA continuación, se detalla la ficha técnica completa, parámetros operativos y características de hardware del sistema:\n\n⚙️ Especificaciones Técnicas Principales\n\n• Canales Independientes: Hasta 4 canales de salida según el modelo (Premium o Smart), lo que permite conectar múltiples aplicadores o tratar a dos pacientes de forma simultánea con diferentes programas.\n• Inducción Máxima de Pulso: Hasta 128 mT (militislas), equivalentes a 1,280 Gauss. Esta alta potencia garantiza una profundidad terapéutica idónea en tejidos profundos como la cadera y el fémur.\n• Rango de Frecuencia: Configurable entre 0 y 166 Hz, modulable según el objetivo clínico (analgésico, trófico, antiinflamatorio).\n• Tipos de Ondas (Tecnología PMF): Modulación de campos magnéticos pulsados en formas de onda rectangulares, sinusoidales, triangulares y exponenciales, además de la capacidad de alternar o combinar campos estáticos y pulsados.\n\n🛡️ Innovaciones Tecnológicas Destacadas\n\n1. Tecnología FMF™ (Focused Magnetic Field): Es la patente de blindaje magnético de BTL. Desplaza y enfoca las líneas del campo magnético exclusivamente hacia el lado del paciente, bloqueando la emisión en el lado posterior del aplicador. Esto protege al fisioterapeuta de la radiación residual constante y optimiza el consumo energético de la clínica.\n2. Enciclopedia Clínica e Interfaz Inteligente: El equipo incluye pantallas táctiles a color (de 4.3\" en versiones Smart o 7\" en versiones Premium) con una base de datos integrada que contiene protocolos preconfigurados clasificados por áreas anatómicas y patologías (como osteoporosis, fracturas, artrosis o tendinitis).\n\nBTL Medical ofrecen equipos profesionales con 8 aplicadores especializados (que se dividen en solenoides cilíndricos tipo túnel para el esqueleto axial/pelvis, y placas de discos y multidiscos flexibles para el esqueleto apendicular y la columna). Estos dispositivos incorporan la tecnología patentada FMF™ (Focused Magnetic Field), un sistema de blindaje que orienta el 100% de las líneas del campo magnético pulsado (CEMP) directamente hacia el tejido diana del paciente, lo que maximiza la profundidad terapéutica, reduce los tiempos de sesión y elimina la dispersión de radiación electromagnética residual hacia el operador o el entorno clínico.\n\n",
  "key_features": [],
  "approved_claims": [],
  "assets_path": null,
  "documentation": null
}
```
- Extractos de la documentación (data/web/magnetotherapy.md):

### BTL Magnetotherapy · página oficial (www.btlnet.es, consultada 2026-10-16)

Página de inicio
Magnetoterapia
Magnetoterapia
Soluciones esenciales para un mejor efecto analgésico y la regeneración de los tejidos
tipos de aplicadores de magnetoterapia
hasta 4 canales
tecnología FMF
¡Siempre tienes una opción!
¡Elige entre 8 aplicadores de magnetoterapia diferentes que permiten el tratamiento de cualquier parte del cuerpo! Los aplicadores están equipados con la exclusiva tecnología FMF que bloquea el campo magnético del lado del  aplicador hacia el operador.
Beneficios de la magnetoterapia
Todos los beneficios de la magnetoterapia se incluyen en un dispositivo premium que ofrece conexión de hasta 4 canales, una selección intuitiva de protocolos según las áreas anatómicas del cuerpo, una base de datos de pacientes y una pantalla táctil a color de 7´´.
Solicite cotización
Aplicador de doble disco
Aplicador de un solo disco
Camilla con aplicador de magnetoterapia
Aplicador de anillos
Aplicador de solenoide grande y pequeño
Sencillo, doble y multidisco
¡Todos los productos de Rehabilitación en un solo catálogo!
¡Obtenga especificaciones de productos, una lista de modelos disponibles y fichas de datos!
Descarga el catálogo
Unidades Combinadas
BTL ofrece más de 20 combinaciones de sistemas de fisioterapia que cubren la electroterapia multicanal, tanto el ultrasonido sin operador como el tradicional, la terapia con láser de bajo nivel y la magnetoterapia.
Descubre todo
Preguntas frecuentes
¿Para qué se usa la magnetoterapia?
Se sabe que la magnetoterapia mejora la circulación sanguínea. Por lo tanto, este método tradicional sigue siendo popular en el tratamiento de trastornos degenerativos de las articulaciones.
¿Qué tiene de especial la máquina de magnetoterapia BTL?
La magnetoterapia BTL está equipada con la exclusiva tecnología FMF que filtra el campo magnético del lado del operador del aplicador. Mientras el paciente se beneficia de la magnetoterapia durante el tratamiento, el terapeuta no está expuesto al campo magnético.
¿Qué parámetros son importantes en un dispositivo de magnetoterapia?
Los parámetros más importantes son: intensidad del campo magnético, rango de frecuencia, tipo de pulso y tiempo total de terapia.
¿Cuáles son los efectos secundarios de la magnetoterapia?
La magnetoterapia no tiene efectos secundarios.

## Imágenes y logos disponibles (usa solo estas rutas)

- `data/uploads/pub-5/web-magnetotherapy-01.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-02.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-03.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-04.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-05.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-06.jpg` · upload · 1000×600px
- `data/uploads/pub-5/web-magnetotherapy-07.jpg` · upload · 657×595px
- `data/uploads/pub-5/web-magnetotherapy-08.jpg` · upload · 657×595px
- `data/uploads/pub-5/BTL-4000_Premium_Combi_PIC_unit-troley-VacII_EUL.jpg` · upload · 961×1420px
- `data/uploads/pub-5/BTL-4000_Premium_Electro_PIC_unit.jpg` · upload · 1420×945px
- `data/uploads/pub-5/BTL-4000_Premium_Electro_unit_VacII_trolley.jpg` · upload · 945×1420px
- `data/uploads/pub-5/BTL-4000_Premium_Laser_PIC_unit.jpg` · upload · 1420×945px
- `data/uploads/pub-5/BTL-4000_Smart_Premium_PIC_Image-unit_high-key.jpg` · upload · 1420×1068px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Applicator-ring.jpg` · upload · 1420×1294px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_couch-with-solenoid.jpg` · upload · 1420×1028px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Disc-applicator.jpg` · upload · 1420×1238px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Double-disc-applicator.jpg` · upload · 1420×1117px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Multi-disc-applicator.jpg` · upload · 1420×798px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Solenoid-30-and-60cm.jpg` · upload · 1420×945px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Solenoid-30cm.jpg` · upload · 1420×1386px
- `data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Solenoid-60cm.jpg` · upload · 1420×1211px
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

- 2026-10-16: "Puedes invertir colores para jugar con fondos azules en lugar de blancos, tambien en la segunda slide necesito que se vean visualizaciones de los aplicadores y que todo el carrusel tenga un storyline sin sonar redundante, recuerda que hay que saber hacer la transicion de la fecha homenajeada a la vinculacion con el equipo"
- 2026-10-16: "Necesito que la segunda slide le dé continuidad a la slide 1, que en la segunda imagen se vean imagenes de los distintos aplicadores y en la tercera una lista con bulletpoint usando iconografía para resaltar las ventajas a los pacientes"
- 2026-10-16: "Recuerda que el tema en la slide 1 no es el hueso, es la osteoporosis y como la magnetoterapia de BTL puede ayudar a tratarla en la slide 2 y en la slide 3 las ventajas que una clínica tenga este equipo"
- 2026-10-17: "Quiero que el hook tenga este texto:  "Cuando el hueso se vuelve frágil, la consulta se vuelve clave.""

## Documentos adjuntos por el usuario

- `data/uploads/pub-5/screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf` (screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf, 9098 KB)

## Referencias editoriales

Publicaciones recientes de la marca (evita repetir ganchos):
- 2026-10-16 · Día Mundial de la Columna Vertebral · BTL Spinal Decompression · portada: "Ninguna espalda es igual."
- 2026-10-19 · Día Internacional de la Lucha contra el Cáncer de Mama · portada: "Día Internacional de la **Lucha** **contra el Cáncer de Mama**"

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json
- data/web/magnetotherapy.md
- https://www.btlnet.es/magnetotherapy
- data/uploads/pub-5/screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf

## Propuesta actual

```json
{
  "direction": "B",
  "direction_name": "Tecnología médica premium",
  "concept": "Del tema del día a la clínica: hoy hablamos de osteoporosis, la enfermedad que vuelve los huesos más frágiles (hueso denso frente a hueso con osteoporosis), y la pregunta es qué puede ofrecer tu consulta de rehabilitación (1); la respuesta es la magnetoterapia de BTL, con aplicadores para cada zona del cuerpo (2); y lo que gana la clínica con el equipo (3). Objetivo: pedir la demo.",
  "differentiation": "Se mantiene la composición elegida: mitad superior clara con la imagen protagonista, franja azul profunda abajo con el texto y un anillo fino que cruza de la portada a la segunda diapositiva; cierre en azul profundo con un anillo de luz en la esquina. Cambian la imagen de la portada (muestras de hueso), los aplicadores de la segunda y la lista con iconos del cierre.",
  "slides": [
    {
      "purpose": "Homenaje con el tema correcto: la osteoporosis (hueso denso frente a hueso con osteoporosis, definición general) y la pregunta que lleva a la consulta.",
      "background": "light",
      "lightFrom": "top-left",
      "alt": "Mitad superior clara con dos círculos de hueso esponjoso dibujados en línea: \"Hueso denso\" y \"Hueso con osteoporosis\", con un anillo fino que continúa en la siguiente diapositiva. Abajo, sobre azul profundo: \"20 de octubre · Día Mundial de la Osteoporosis\", \"Hoy hablamos de osteoporosis.\" y \"La enfermedad que vuelve los huesos más frágiles. ¿Qué puede ofrecer tu consulta de rehabilitación?\" Logo de BTL arriba a la derecha y \"Desliza\".",
      "nodes": [
        {
          "id": "halo",
          "parent": null,
          "type": "Halo",
          "props": "{\"cx\": 1080, \"cy\": 470, \"r\": 300, \"thickness\": 2, \"tone\": \"enterprise\", \"glow\": 0.25}",
          "text": null
        },
        {
          "id": "rd",
          "parent": null,
          "type": "Region",
          "props": "{\"top\":300,\"left\":\"m\",\"right\":\"m\"}",
          "text": null
        },
        {
          "id": "row",
          "parent": "rd",
          "type": "Stack",
          "props": "{\"direction\":\"row\",\"gap\":60}",
          "text": null
        },
        {
          "id": "bd1",
          "parent": "row",
          "type": "BoneDensity",
          "props": "{\"porous\":false,\"size\":300,\"label\":\"Hueso denso\"}",
          "text": null
        },
        {
          "id": "bd2",
          "parent": "row",
          "type": "BoneDensity",
          "props": "{\"porous\":true,\"size\":300,\"label\":\"Hueso con osteoporosis\"}",
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
          "id": "band",
          "parent": null,
          "type": "Region",
          "props": "{\"left\":0,\"width\":1080,\"top\":720,\"height\":630,\"surface\":\"deep\",\"padding\":\"m\",\"gap\":18,\"align\":\"start\"}",
          "text": null
        },
        {
          "id": "p",
          "parent": "band",
          "type": "DatePill",
          "props": "{}",
          "text": "20 de octubre · Día Mundial de la Osteoporosis"
        },
        {
          "id": "h",
          "parent": "band",
          "type": "Headline",
          "props": "{\"size\":\"l\",\"weight\":\"semibold\",\"tone\":\"base\",\"as\":\"h1\"}",
          "text": "Hoy hablamos\nde osteoporosis."
        },
        {
          "id": "b",
          "parent": "band",
          "type": "Body",
          "props": "{\"size\":\"s\",\"weight\":\"regular\"}",
          "text": "La enfermedad que vuelve los huesos más frágiles.\n¿Qué puede ofrecer tu consulta de rehabilitación?"
        },
        {
          "id": "sw",
          "parent": "band",
          "type": "SwipeCue",
          "props": "{\"placement\":\"inline\"}",
          "text": "Desliza"
        }
      ]
    },
    {
      "purpose": "Respuesta a la pregunta de la portada: la magnetoterapia de BTL, con cuatro de sus aplicadores a la vista; el anillo de luz continúa desde la portada.",
      "background": "light",
      "lightFrom": "top-right",
      "alt": "Mitad superior clara con las fotos oficiales de cuatro aplicadores de BTL Magnetotherapy: los solenoides de 30 y 60 cm, el aplicador de anillo, el multidisco y el doble disco; el anillo fino de la portada continúa por la izquierda. Abajo, sobre azul profundo: \"BTL Magnetotherapy\", \"Magnetoterapia para cada zona.\" y \"8 aplicadores para tratar cualquier parte del cuerpo, con hasta 4 canales en un solo equipo.\" Logo de BTL arriba a la derecha y \"Desliza\".",
      "nodes": [
        {
          "id": "halo",
          "parent": null,
          "type": "Halo",
          "props": "{\"cx\": 0, \"cy\": 470, \"r\": 300, \"thickness\": 2, \"tone\": \"enterprise\", \"glow\": 0.25}",
          "text": null
        },
        {
          "id": "i1",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\":\"data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Solenoid-30-and-60cm.jpg\",\"alt\":\"Aplicadores solenoides de 30 y 60 cm de BTL Magnetotherapy\",\"left\":80,\"top\":205,\"width\":380}",
          "text": null
        },
        {
          "id": "i2",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\":\"data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Applicator-ring.jpg\",\"alt\":\"Aplicador de anillo de BTL Magnetotherapy\",\"left\":620,\"top\":210,\"width\":280}",
          "text": null
        },
        {
          "id": "i3",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\":\"data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Multi-disc-applicator.jpg\",\"alt\":\"Aplicador multidisco de BTL Magnetotherapy\",\"left\":80,\"top\":478,\"width\":420}",
          "text": null
        },
        {
          "id": "i4",
          "parent": null,
          "type": "ProductImage",
          "props": "{\"src\":\"data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_Double-disc-applicator.jpg\",\"alt\":\"Aplicador de doble disco de BTL Magnetotherapy\",\"left\":600,\"top\":478,\"width\":300}",
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
          "id": "band",
          "parent": null,
          "type": "Region",
          "props": "{\"left\":0,\"width\":1080,\"top\":720,\"height\":630,\"surface\":\"deep\",\"padding\":\"m\",\"gap\":18,\"align\":\"start\"}",
          "text": null
        },
        {
          "id": "e",
          "parent": "band",
          "type": "Eyebrow",
          "props": "{\"size\":36,\"weight\":\"semibold\"}",
          "text": "BTL Magnetotherapy"
        },
        {
          "id": "h",
          "parent": "band",
          "type": "Headline",
          "props": "{\"size\":\"m\",\"tone\":\"base\",\"as\":\"h2\"}",
          "text": "Magnetoterapia\npara cada zona."
        },
        {
          "id": "b",
          "parent": "band",
          "type": "Body",
          "props": "{\"size\":\"s\",\"weight\":\"regular\"}",
          "text": "8 aplicadores para tratar cualquier parte del cuerpo,\ncon hasta 4 canales en un solo equipo."
        },
        {
          "id": "sw",
          "parent": "band",
          "type": "SwipeCue",
          "props": "{\"placement\":\"inline\"}",
          "text": "Desliza"
        }
      ]
    },
    {
      "purpose": "Ventajas de tener el equipo para la clínica, en lista con iconos, y CTA \"Solicita tu demo\".",
      "background": "deep",
      "lightFrom": null,
      "alt": "Fondo azul profundo con un anillo de luz en la esquina inferior derecha. Titular: \"Lo que gana tu clínica.\" Lista con iconos: \"Protocolos por zona: selección intuitiva en una pantalla táctil de 7″.\", \"Pacientes en orden: base de datos de pacientes en el mismo equipo.\" y \"Terapeuta protegido: con FMF, no queda expuesto al campo magnético.\" Abajo: \"Solicita tu demo. Escríbenos DEMO por mensaje directo. BTL El Salvador.\" Logo de BTL arriba a la derecha.",
      "nodes": [
        {
          "id": "halo",
          "parent": null,
          "type": "Halo",
          "props": "{\"cx\":960,\"cy\":1300,\"r\":260,\"thickness\":2,\"tone\":\"sky\",\"glow\":0.6}",
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
          "props": "{\"top\":270,\"right\":\"m\",\"gap\":40}",
          "text": null
        },
        {
          "id": "h",
          "parent": "r",
          "type": "Headline",
          "props": "{\"size\":\"xl\",\"tone\":\"base\",\"as\":\"h2\"}",
          "text": "Lo que gana\ntu clínica."
        },
        {
          "id": "l",
          "parent": "r",
          "type": "IconList",
          "props": "{\"layout\":\"rows\",\"iconSize\":84,\"items\":[{\"icon\":\"checklist\",\"title\":\"Protocolos por zona\",\"text\":\"Selección intuitiva en una pantalla táctil de 7″.\"},{\"icon\":\"trending_up\",\"title\":\"Pacientes en orden\",\"text\":\"Base de datos de pacientes en el mismo equipo.\"},{\"icon\":\"do_not_touch\",\"title\":\"Terapeuta protegido\",\"text\":\"Con FMF, no queda expuesto al campo magnético.\"}]}",
          "text": null
        },
        {
          "id": "c",
          "parent": null,
          "type": "Region",
          "props": "{\"bottom\": \"m\", \"left\": \"m\", \"width\": 560}",
          "text": null
        },
        {
          "id": "cta",
          "parent": "c",
          "type": "CtaBlock",
          "props": "{\"variant\": \"stacked\", \"size\": 64}",
          "text": null
        }
      ]
    }
  ],
  "caption": "Hoy, 20 de octubre, es el Día Mundial de la Osteoporosis, la enfermedad que vuelve los huesos más frágiles. ¿Y qué puede ofrecer tu consulta de rehabilitación?\n\nBTL Magnetotherapy suma magnetoterapia para cada zona: 8 aplicadores para tratar cualquier parte del cuerpo y hasta 4 canales en un solo equipo. Para tu clínica: protocolos por área anatómica en una pantalla táctil de 7″, base de datos de pacientes y tecnología FMF, para que el terapeuta no quede expuesto al campo magnético.\n\nEscríbenos \"DEMO\" por mensaje directo y solicita tu demo con BTL El Salvador.\n\n#DíaMundialDeLaOsteoporosis #Osteoporosis #Fisioterapia #Magnetoterapia #BTLElSalvador",
  "sources": [
    "data/web/magnetotherapy.md",
    "https://www.btlnet.es/magnetotherapy",
    "knowledge/brand-guidelines/btl-corporate-identity.md",
    "data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_* (fotos oficiales de los aplicadores)"
  ],
  "claims": [
    {
      "claim": "20 de octubre · Día Mundial de la Osteoporosis",
      "location": "diapositiva 1 y caption",
      "source": "brief.md · Brief de la publicación (fecha y ocasión)",
      "approval": "general_statement"
    },
    {
      "claim": "La osteoporosis: la enfermedad que vuelve los huesos más frágiles. Hueso denso / Hueso con osteoporosis (ilustración educativa).",
      "location": "diapositiva 1 y caption",
      "source": "Definición general de la enfermedad del tema del día, no atribuida al producto; ilustración BoneDensity del sistema de diseño (educativa, no imagen clínica)",
      "approval": "general_statement"
    },
    {
      "claim": "Magnetoterapia para cada zona. 8 aplicadores para tratar cualquier parte del cuerpo",
      "location": "diapositiva 2 y caption",
      "source": "data/web/magnetotherapy.md · \"¡Siempre tienes una opción!\" (Elige entre 8 aplicadores de magnetoterapia diferentes que permiten el tratamiento de cualquier parte del cuerpo)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Solenoides de 30 y 60 cm · anillo · multidisco · doble disco (fotos oficiales)",
      "location": "diapositiva 2",
      "source": "data/web/magnetotherapy.md · lista de aplicadores (\"Aplicador de anillos\", \"Aplicador de solenoide grande y pequeño\", \"Sencillo, doble y multidisco\", \"Aplicador de doble disco\") y fotos oficiales BTL-4000-5000_Magnet_PIC",
      "approval": "manufacturer_description"
    },
    {
      "claim": "con hasta 4 canales en un solo equipo",
      "location": "diapositiva 2 y caption",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (conexión de hasta 4 canales)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Protocolos por zona: selección intuitiva en una pantalla táctil de 7″.",
      "location": "diapositiva 3 y caption",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (selección intuitiva de protocolos según las áreas anatómicas del cuerpo; pantalla táctil a color de 7´´)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Pacientes en orden: base de datos de pacientes en el mismo equipo.",
      "location": "diapositiva 3 y caption",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (una base de datos de pacientes)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Terapeuta protegido: con FMF, no queda expuesto al campo magnético.",
      "location": "diapositiva 3 y caption",
      "source": "data/web/magnetotherapy.md · Preguntas frecuentes, \"¿Qué tiene de especial la máquina de magnetoterapia BTL?\" (FMF filtra el campo magnético del lado del operador; el terapeuta no está expuesto)",
      "approval": "manufacturer_description"
    }
  ]
}
```

## Solicitud de cambios de Jaime

- Alcance: Toda la propuesta
- Solicitud: "Quiero que el hook tenga este texto:  "Cuando el hueso se vuelve frágil, la consulta se vuelve clave.""

## Entrega

Devuelve el objeto JSON del esquema: `proposal` completa revisada (misma dirección), `summary`, `changed_slides` y `warnings`. Todo el texto en español.

