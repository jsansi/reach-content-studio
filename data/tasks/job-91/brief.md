# Encargo: tres propuestas creativas de un carrusel
## Brief de la publicación

- Marca (cliente): BTL Medical El Salvador — firma en las piezas: "BTL El Salvador"
- Fecha de publicación: 2026-10-20
- Tema: Día Mundial de la Osteoporosis
- Formato: Carrusel · 3 diapositiva(s) de 1080 × 1350 px
- Objetivo de marketing: Fecha conmemorativa

## Instrucciones creativas del usuario

Para el día mundial de la osteoporosis la intención es la misma que con las fechas anteriores que hemos trabajado, crear en la slide 1 un hook que sea stop scrolling en primer plano y mostrando la fecha en segundo plano con una imagen que capte la atención del público, la slide 2 debe llevar el logo del equipo e imágenes del equipo y describir ventajas del uso del equipo y en al slide 3 las ventajas que conlleva para las clínicas tener este equipo con un CTA al final que diga "Solicita tu Demo". 

No debemos saturar de texto las slides y hay que darle jerarquía a los elementos en cada una de las slides, las 3 slides tienen que tener una especie de storyline que haga querer continuar deslizando hasta la última slide y despertar el interés del público objetivo

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

## Direcciones de arte asignadas a esta ronda (elegidas por la app)

La app rota un banco de direcciones para no repetir las de rondas anteriores. Propuesta A = primera, B = segunda, C = tercera; usa estos nombres en `direction_name`.

### A · Póster tipográfico

Cada diapositiva es un cartel: un titular `display` o `xl` en SemiBold que ocupa casi todo el ancho, dos o tres
palabras por línea, con un contraste de escala extremo frente a un único `Body` `s`. Fondos plenos `enterprise`,
`blue` o `deep` que cambian de una diapositiva a otra como capítulos. Imagen mínima o ninguna; la ilustración del
tema, pequeña y precisa, como sello. Nada de módulos ni listas. Jerarquía: palabra → silencio → detalle.

### B · Conversación

Cada diapositiva es un turno de conversación con el profesional: una pregunta enorme en Light (lo que se pregunta
un fisioterapeuta o el dueño de la clínica) y una respuesta breve y verificable. La última pregunta es la que se
responde con la demo. Mucho aire, ritmo de diálogo, la imagen como prueba visual de la respuesta. Jerarquía:
pregunta → respuesta → imagen.

### C · Metáfora visual

Una metáfora visual dibujada con `Illustration` conecta el tema con la idea de la pieza (un mapa, una brújula,
raíces, un engranaje, un puente, una red): sencilla, de trazo luminoso y colores de marca. La metáfora es la
portada y vuelve como motivo pequeño en el cierre. Nunca dibujes el equipo ni sugieras resultados clínicos con la
metáfora. Jerarquía: metáfora → idea → prueba (foto oficial).

## Diseños anteriores de la marca (no repitas estas estructuras ni estos ganchos)

Resumen de cada diseño: fondo y componentes clave por diapositiva, y el gancho de la portada. Una propuesta que repita uno de estos esquemas (mismos fondos y mismos componentes protagonistas en las mismas diapositivas) se marca como "Diseño repetido".

- 2026-10-20 · Día Mundial de la Osteoporosis · v18 · Ilustración protagonista: diap. 1 dark: Halo, Illustration · diap. 2 deep: Illustration, ProductImage · diap. 3 deep: Illustration · gancho: «El centro del cuerpo también tiene su día.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v17 · Recorrido continuo: diap. 1 deep: Curve, Halo, Illustration · diap. 2 deep: Curve, Halo, ProductImage · diap. 3 deep: Curve, Halo · gancho: «Del hueso a tu consulta hay tres pasos.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v16 · Revista editorial: diap. 1 deep: Rule, Illustration · diap. 2 white: ProductImage, Rule · diap. 3 light: Rule · gancho: «Hoy el hueso es portada.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v15 · Dato protagonista: diap. 1 dark: Illustration, BigNumber · diap. 2 light: ProductImage, BigNumber · diap. 3 deep: BigNumber, Rule · gancho: «Tres cifras para tu consulta.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v14 · Macro del detalle: diap. 1 deep: Illustration · diap. 2 white: ProductImage · diap. 3 light: ProductImage · gancho: «Un hueso poroso, de cerca.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v13 · Propuesta libre: diap. 1 blue: Illustration · diap. 2 blue: Illustration, ProductImage · diap. 3 blue: Illustration · gancho: «Este hueso no cabe en una sola imagen.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v12 · Objeto en el centro: diap. 1 dark: Rings, Halo, Illustration · diap. 2 light: Rings, ProductImage · diap. 3 deep: Halo, BigNumber · gancho: «Hoy, el hueso al centro.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v11 · Pantalla dividida: diap. 1 deep: Halo, BoneDensity · diap. 2 deep: ProductImage · diap. 3 deep: Rule · gancho: «Toda sesión tiene dos lados.»
- 2026-10-20 · Día Mundial de la Osteoporosis · v10 · Plano técnico: diap. 1 deep: Rule, Illustration · diap. 2 deep: Rule, ProductImage · diap. 3 deep: Rule, ModuleGrid · gancho: «Cada zona del esqueleto pide un plan distinto.»

## Comentarios previos de Jaime en esta publicación (respétalos)

Ninguno.

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

## Entrega

Devuelve el objeto JSON del esquema: `proposals` (exactamente tres: A, B y C, cada una con 3 diapositivas, caption, fuentes y afirmaciones) y `warnings`. Todo el texto en español.

