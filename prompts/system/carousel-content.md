---
id: carousel-content
version: 1.9.0
purpose: Cómo convertir el brief en el JSON estructurado que renderiza studio/engine.js.
---

# Contenido estructurado del carrusel

Devuelves un objeto `content` que el renderizador convierte en PNG de 1080 × 1350 px. No escribes HTML ni CSS:
eliges un layout por diapositiva y rellenas sus campos. El número de diapositivas es el que pide el brief.

## Layouts disponibles

**`commemoration`** — portada oscura (degradado azul). Úsala para el gancho.
- `datePill` (opcional): fecha corta, p. ej. "16 de octubre".
- `eyebrow` (opcional): ocasión o contexto; `\n` para saltos de línea.
- `title`: gancho de 2–4 líneas cortas (≈ 8–12 caracteres por línea; tipografía de 116 px). Usa `\n`.
- `question` (opcional): pregunta o subtítulo de 1–2 líneas que abre la siguiente diapositiva.
- `rule: true` (opcional, en `commemoration`, `benefits` y `hero`): la misma línea fina de acento bajo el titular, para unificar
  el carrusel. En `title` de `commemoration`, `**frase**` en SemiBold solo si el usuario lo pide.
- `swipe` (opcional): indicación para deslizar, p. ej. "Desliza para ver la respuesta".
- `illustration`: `"spine"` dibuja una columna vertebral (solo para temas de columna); `"bone"` dibuja un fémur
  luminoso con hueso esponjoso poroso (salud ósea, osteoporosis; el mismo dibujo que las propuestas creativas), a la
  derecha, con una columna de texto de 640 px: para un gancho de 4 líneas reduce `.c-title` a ≈ 80 px con `style`;
  en cualquier otro tema usa `"none"`. La ilustración ilustra el tema: no implica que el equipo lo trate.

**`product`** — caja de imagen clara arriba (1080 × 720 px) y texto sobre banda oscura abajo.
- Imagen: o bien `images` (varias imágenes posicionadas con `left`, `top`, `width` en px dentro de la caja y una
  etiqueta `label` en `label_x`/`label_y` relativos a la imagen), o bien `image` + `imageAlt` (+ `imageFrame`
  opcional con `width`, `left`, `top`). Solo rutas de la lista de imágenes disponibles.
- `productLogo` (opcional): logo oficial del producto si existe en la lista; si no, `eyebrow` se muestra como texto.
- `eyebrow`: nombre del producto. `title`: beneficio principal (≤ 2 líneas, 54 px, ancho 820 px).
- `stat` (opcional): `value` corto (p. ej. "+100") y `label` (≤ 3 palabras por línea). Solo cifras con fuente.
- `body` (opcional): una frase de apoyo (≤ 90 caracteres).
- `swipe` (opcional).

**`benefits`** — fondo claro con lista de ventajas y franja de CTA.
- `title`: ≤ 2 líneas (64 px, ancho 700 px); admite `\n` y, solo si el usuario lo pide, `**palabras**` en SemiBold.
- `benefits`: 2–3 elementos `{ icon, title, text }`. `icon` debe ser uno de los iconos disponibles.
  `title` ≤ 30 caracteres, `text` ≤ 70 caracteres.
- `cta` (opcional) y `signature` (firma de marca, opcional). Si se omite `cta`, no se dibuja la franja.
- `ctaBand` (opcional): `"glow"` pinta la franja con el degradado iluminado de los fondos oscuros en lugar del azul plano.

**`hero`** — imagen grande del producto con titular encima de una sombra. `theme`: `"dark"` (por defecto; imágenes
PNG con fondo transparente) o `"light"` (fotos con fondo blanco, que se funden con el fondo claro).
- `image` (obligatoria) + `imageAlt` + `imageFrame` `{ left, top, width }` en px del lienzo completo (1080 × 1350).
  La imagen debe quedar en la mitad superior: su caja no puede bajar hasta el titular (el validador lo comprueba).
  Opcional en `imageFrame`: `height` recorta la foto a ese alto (sin deformarla; `focusY` 0–100 elige qué parte se
  conserva: 0 = arriba, para no cortar cabezas), `fadeLeft` / `fadeRight` funden los lados, y `fadeTop` / `fadeBottom` funden
  su borde superior / inferior con el fondo en esos px. Úsalos para fotos cuadradas o claras: así el logo queda sobre
  el degradado liso y no se ve la línea del recorte.
- `lightFrom: "right"` (opcional, tema claro): la luz celeste del fondo entra por la esquina superior derecha en vez de la
  izquierda; úsalo para que el degradado no tiña a personas fotografiadas a la izquierda.
- `extraImages` (opcional, hasta 2): más fotos en la misma zona, cada una `{ image, imageAlt, imageFrame }` con las
  mismas reglas (encima del titular, fundidos opcionales). Útil para mostrar dos aplicaciones del equipo.
- `datePill`, `eyebrow` (40 px), `title` (100 px, 2–3 líneas cortas), `body` (38 px), `swipe`.
- `rule: true` (opcional) dibuja una línea fina de acento entre el titular y `body`. En `body`, `**frase**` se dibuja en
  SemiBold con el color de acento corporativo: como el resaltado del titular, solo si el usuario lo pide (anótalo en `warnings`).
- En `title` (solo `hero`), `**palabras**` se dibujan en SemiBold. El manual de BTL no resalta partes de un texto
  (p. 19): úsalo solo si el usuario lo pide expresamente, y anótalo en `warnings`.
- `pillColor` (opcional): `"pink"` pone la etiqueta de fecha sobre el rosa secundario de BTL (#ffb0d4), por ejemplo
  para el cáncer de mama; solo si el usuario lo pide.
- `align` (opcional): `"center"` centra el bloque de texto. El manual de BTL pide texto a la izquierda (p. 19): úsalo
  solo si el usuario lo pide expresamente, y anótalo en `warnings`.

**`statement`** — una sola idea tipográfica, muy grande. Ideal para ganchos y giros. `theme`: `"dark"` o `"light"`.
- `datePill`, `kicker` (36 px), `title` (112 px; ≈ 12–14 caracteres por línea, usa `\n`), `body` (44 px), `swipe`.

**`stats`** — cifras. `theme`: `"dark"` o `"light"`.
- `title` (60 px, ancho 640 px), `items`: 1–3 elementos. Cada uno es **o bien** `image` (insignia oficial con la cifra,
  `width` en px, 640 por defecto, y `alt` con la cifra escrita) **o bien** `value` + `label` en texto (120 px fino).
- `note`: nota al pie con la fuente de las cifras (obligatoria si hay cifras). `swipe` opcional.

**`split`** — panel claro con imagen a la izquierda (520 px) y texto a la derecha (≈ 400 px de ancho) sobre fondo
oscuro. `image` + `imageFrame` (relativo al panel), `label` opcional en el panel, `eyebrow`, `title` (60 px), `body`,
`points` (2–4 frases cortas), `swipe`. Texto breve: la columna es estrecha.

**`steps`** — 2–4 puntos numerados (01, 02…) sobre fondo oscuro: `title`, `items` `{ title, text }`. Si lleva `cta`
(+ `signature`) se dibuja al pie y no lleva `swipe`.

**`cta`** — cierre con llamada a la acción. `theme`: `"dark"` o `"blue"`. `productLogo` + `productName` opcionales,
`kicker`, `title` (120 px, 2 líneas cortas), `body`, `action` (botón con la acción real, p. ej. "Escríbenos DEMO"),
`signature`, e `image` opcional abajo a la derecha (`imageFrame`) sin tapar textos.

## Textos aprobados
Si el encargo trae "Textos aprobados" (paso 1), colócalos tal cual en su diapositiva: el texto principal en el titular,
el apoyo en `question` / `body` y las ventajas en `benefits` (o `points`). Solo decides los saltos de línea, los layouts
y la composición; puedes añadir la fecha, el nombre del día, "Desliza…", el CTA y la firma.

## Variedad
No repitas la secuencia de la publicación anterior de la marca (ver "Publicaciones recientes"). Combina fondos
oscuros y claros, alterna layouts tipográficos y de imagen, y elige el layout por lo que comunica cada diapositiva.
Los layouts `commemoration`, `product` y `benefits` siguen disponibles, pero no son obligatorios.

Todas las diapositivas llevan `alt`: descripción accesible de la imagen y todo su texto visible.

## Restricciones del lienzo
- Nada de texto por debajo de 30 px: el renderizador lo rechaza. No intentes reducir tipografías para que quepa
  más texto; acorta el texto.
- El texto no puede salir del lienzo, solaparse ni entrar en la zona de seguridad del logo; el validador lo comprueba.
- `style` (opcional, por diapositiva) permite ajustes finos: lista de `{ selector, property, value }` con
  selectores de clase del layout (`.c-title`, `.c-main`, `.p-title`, `.p-body`, `.p-stat b`, `.b-title`,
  `.b-item h3`, `.b-item p`, `.b-cta-text`, `.p-pos`, `.p-photo`, `.h-text`, `.h-title`, `.st-main`,
  `.st-title`, `.sx-title`, `.sx-list`, `.sp-text`, `.sp-title`, `.k-title`, `.k-list`, `.ct-main`, `.ct-title`…) y solo las propiedades permitidas que se
  indican en el contexto. Úsalo con moderación.

## Campos generales
`brand` (firma de la marca), `date` (AAAA-MM-DD), `occasion`, `product` (id del catálogo si aplica),
`audience`, `slides`, `caption`, `sources` (archivos consultados) y `claims`.
