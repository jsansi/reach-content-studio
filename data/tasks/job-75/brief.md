# Encargo: revisar un carrusel existente
## Brief de la publicación

- Marca (cliente): BTL Medical El Salvador — firma en las piezas: "BTL El Salvador"
- Fecha de publicación: 2026-10-16
- Tema: Día Mundial de la Columna Vertebral · BTL Spinal Decompression
- Formato: Carrusel · 3 diapositiva(s) de 1080 × 1350 px
- Objetivo de marketing: Fecha conmemorativa

## Instrucciones creativas del usuario

Audiencia: Fisioterapeutas, médicos rehabilitadores, clínicas y centros de rehabilitación. Carrusel original de la prueba de concepto (opción A).

## Preferencias editoriales activas (obligatorias)

- Nombrar siempre a la marca como "BTL El Salvador" en diapositivas, captions, textos alternativos y firmas. Nunca "BTL Medical" ni separar en divisiones médica/estética.
- CTA corto: "Solicita tu demo", sin flecha. Las demos se piden por mensaje directo con la palabra "DEMO".
- Escribir las cifras como "+100 posiciones", no "100+" ni "más de 100".
- Priorizar ventajas prácticas para la clínica o el profesional (personalizar protocolos, manos libres, nueva línea de servicio); dejar los detalles técnicos fuera o al mínimo.
- Caption de unos 500 caracteres: gancho con la palabra clave de la fecha, un párrafo de beneficio que nombre el producto, CTA por mensaje directo "DEMO" y unos 5 hashtags.
- Las piezas se ven sobre todo en el móvil: ningún texto por debajo de 30 px en el lienzo de 1080 px (incluye "Desliza…", etiquetas y pills), y peso regular en los textos pequeños.

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

### BTL Spinal Decompression (id: spinal-decompression)
- Estado: catálogo
- approved_claims: [] (vacío: ninguna afirmación clínica aprobada)
- Documentación original: knowledge/products/spinal-decompression.pdf
- Registro del catálogo (btl_products.json):
```json
{
  "id": "spinal-decompression",
  "name": "BTL Spinal Decompression",
  "category": "Robotic spinal decompression",
  "url": "https://www.btlnet.es/spinal-decompression",
  "audience": [
    "clinics",
    "physiotherapists"
  ],
  "indications": [
    "Disc herniation",
    "Chronic low back pain",
    "Radiating pain (sciatica, radiculopathy)",
    "Back pain in surgical candidates or patients not helped by medication or epidural steroid injections"
  ],
  "key_features": [
    "Over 100 treatment positions",
    "Robotic forces with hand-like precision",
    "Hands-free therapy for the whole back"
  ],
  "treatment_protocol": "Around 10 sessions, 1-2 times per week, individualized",
  "assets_path": "public/assets/products/spinal-decompression",
  "documentation": "knowledge/products/spinal-decompression.pdf"
}
```
- Extractos de la documentación (knowledge/products/spinal-decompression.md):

### BTL Spinal Decompression — extractos de la documentación oficial

Transcripción literal (en español, tal como aparece en la web oficial) para recuperación dirigida.
Cada bloque indica la sección de la página de la que procede. Citar como
`spinal-decompression.pdf · <sección>`.

> **Estado de aprobación.** Ninguna de estas frases figura como `approved_claims` en
> `btl_products.json`. Son descripciones del fabricante, **no afirmaciones clínicas aprobadas
> formalmente** para BTL El Salvador. Las frases sobre resultados clínicos (marcadas ⚠) no deben
> usarse como promesa de resultado en piezas de redes sin aprobación expresa.

#### [hero] Cabecera
- Logo de producto "SPINAL DECOMPRESSION" (activo: `public/assets/products/spinal-decompression/logo/spinal-decompression-logo-white.png`).
- Titular: "Alternativa No Invasiva a la Cirugía Lumbar". ⚠ (comparación con cirugía)
- CTA web: "Solicite una demostración".

#### [intro] Dispositivo de descompresión vertebral
- "BTL Descompresión vertebral ofrece una solución … no invasiva al dolor lumbar."
- "Al tratar los problemas de la columna con una tecnología de descompresión avanzada y precisa, este enfoque proporciona alivio del dolor sin los riesgos ni el tiempo de recuperación asociados con la cirugía de columna." ⚠

#### [iconos] Tres ventajas destacadas
- "Alternativa no invasiva a la cirugía vertebral" ⚠
- "Más de 100 posiciones de tratamiento únicas" → en copy de BTL El Salvador se escribe "+100 posiciones".
- "Tratamientos suaves y precisos"

#### [alternativa] Una alternativa no invasiva a la cirugía de columna
- "Proporciona una descompresión controlada para favorecer la reabsorción de las hernias discales, aliviar la presión sobre las raíces nerviosas y restaurar la correcta alineación de la columna." ⚠
- "El resultado es un alivio significativo del dolor y, en muchos casos, ayuda a los pacientes a evitar la cirugía de columna." ⚠
- Imágenes de resonancia "Slipped disc C5-C6. Before / After BTL Spinal Decompression" (zona **cervical**). ⚠ No reutilizar como prueba de resultado.

#### [posiciones] Más de 100 posiciones únicas de tratamiento
- "Introduce un avanzado enfoque de segmentación específica al ofrecer el mayor número de posiciones de tratamiento únicas del mercado: más de 100."
- "Brinda una flexibilidad inigualable para abordar eficazmente dolores de espalda de distintos orígenes."

#### [precision] Tratamientos suaves y precisos
- "Utiliza fuerzas de descompresión robóticas, controladas por máquina, con una precisión similar a la de las manos."
- "Permite a los profesionales de la salud potenciar la efectividad de la terapia manual … garantizando una experiencia cómoda y segura para el paciente."

#### [negocio] Crea una nueva fuente de ingresos para tu consulta
- Iconos: "Terapia manos libres", "Trata eficazmente toda la espalda", "Resultados más allá de la terapia manual" ⚠.
- CTA web: "Contacta con ventas".

#### [indicaciones] El tratamiento de primera elección para el dolor de espalda
- **Hernia discal:** "Estira suavemente la columna, aliviando la presión sobre los discos y las raíces nerviosas. Esto ayuda a retraer los discos abultados o herniados, aliviando el dolor y favoreciendo la recuperación." ⚠
- **Dolor lumbar crónico:** "Puede tratar con precisión el dolor crónico en la columna lumbar … Descarga las estructuras neurales y libera los tejidos blandos de la columna en posiciones analgésicas ajustables a la condición de cada paciente."

#### [testimonios] Escucha a tus compañeros
- Tres testimonios de profesionales (Costa Rica, Uzbekistán, Chequia). Mencionan uso en columna **cervical y lumbar**.
- **No reutilizar testimonios** ni atribuirlos a clínicas de El Salvador.

#### [faq] Preguntas frecuentes
- "Tratamiento no invasivo diseñado para aliviar la presión sobre la columna y reducir el dolor causado por hernias o protrusiones discales, enfermedad degenerativa del disco, síndrome facetario, espasmos musculares y otros problemas de columna."
- "Aplica fuerzas de tracción controladas y dirigidas a las vértebras en ciclos programados, aumentando el espacio entre los discos, mejorando la circulación sanguínea, favoreciendo la rehidratación y ayudando a realinear las vértebras." ⚠
- Eficacia: "Muchos pacientes experimentan un alivio significativo después de la primera sesión…" ⚠ (no usar).
- Protocolo: "Normalmente se recomiendan unas 10 sesiones, programadas de 1 a 2 veces por semana. El plan específico dependerá de la condición y la evolución de cada paciente."

#### [legal] Pie de página
- "Los resultados y la experiencia del paciente pueden variar. Consulte con su médico si este procedimiento es adecuado para usted. No todos los productos e indicaciones están aprobados en todos los países."

#### Zonas tratables
Lumbar **y** cervical (sección [alternativa]: imágenes C5-C6; [testimonios]). En copy de producto decir
"zona lumbar y cervical" o "toda la columna", no solo "espalda".

## Imágenes y logos disponibles (usa solo estas rutas)

- `public/assets/products/spinal-decompression/aplicacion-dolor-lumbar-cronico.jpg` · product_image · spinal-decompression · 540×360px
- `public/assets/products/spinal-decompression/logo/spinal-decompression-logo-white.png` · product_logo · spinal-decompression · 400×68px
- `public/assets/products/spinal-decompression/posiciones/flexion-pelvica.png` · product_image · spinal-decompression · 767×385px
- `public/assets/products/spinal-decompression/posiciones/roof-prono.png` · product_image · spinal-decompression · 623×387px
- `public/assets/products/spinal-decompression/posiciones/semiincorporada-inclinada.png` · product_image · spinal-decompression · 688×367px
- `public/assets/products/spinal-decompression/spinal-decompression.jpg` · product_image · spinal-decompression · 1920×1080px
- `public/assets/brands/btl/logo/btl-logo.svg` · brand_logo

## Iconos disponibles

`airline_seat_flat`, `checklist`, `do_not_touch`, `swipe_left`, `trending_up`

## Propiedades permitidas en `style`

font-size, font-weight, line-height, letter-spacing, max-width, width, height, top, left, right, bottom, margin-top, margin-bottom, padding-top, padding-bottom, gap

## Documentos adjuntos por el usuario

Ninguno.

## Referencias editoriales

Ejemplo aprobado del formato y el tono (content/spinal-decompression/dia-mundial-columna-2026.json); no copies sus textos:

```json
{
  "id": "dia-mundial-columna-2026",
  "brand": "BTL El Salvador",
  "date": "2026-10-16",
  "occasion": "Día Mundial de la Columna Vertebral",
  "product": "spinal-decompression",
  "audience": "Fisioterapeutas, médicos rehabilitadores, clínicas y centros de rehabilitación",
  "output": "output/spinal-decompression",
  "slides": [
    {
      "layout": "commemoration",
      "datePill": "16 de octubre",
      "eyebrow": "Día Mundial de la\nColumna Vertebral",
      "title": "Ninguna\nespalda\nes igual.",
      "question": "¿Por qué tratarlas en la misma posición?",
      "swipe": "Desliza para ver la respuesta",
      "alt": "Ilustración de la columna vertebral en vista lateral con los discos lumbares resaltados en azul. Texto: 16 de octubre, Día Mundial de la Columna Vertebral. Ninguna espalda es igual. ¿Por qué tratarlas en la misma posición?"
    },
    {
      "layout": "product",
      "images": [
        {
          "src": "public/assets/products/spinal-decompression/posiciones/semiincorporada-inclinada.png",
          "alt": "Paciente en posición semiincorporada sobre BTL Spinal Decompression",
          "label": "Semiincorporada",
          "left": 30,
          "top": 250,
          "width": 640,
          "label_x": 60,
          "label_y": 350
        },
        {
          "src": "public/assets/products/spinal-decompression/posiciones/flexion-pelvica.png",
          "alt": "Paciente en supino con flexión pélvica sobre BTL Spinal Decompression",
          "label": "Flexión pélvica",
          "left": 700,
          "top": 225,
          "width": 340,
          "label_x": 20,
          "label_y": 175
        },
        {
          "src": "public/assets/products/spinal-decompression/posiciones/roof-prono.png",
          "alt": "Paciente en prono sobre BTL Spinal Decompression",
          "label": "Prono",
          "left": 720,
          "top": 465,
          "width": 290,
          "label_x": 0,
          "label_y": 185
        }
      ],
      "productLogo": "public/assets/products/spinal-decompression/logo/spinal-decompression-logo-white.png",
      "eyebrow": "BTL Spinal Decompression",
      "title": "Descompresión que se adapta a cada paciente",
      "stat": {
        "value": "+100",
        "label": "posiciones de tratamiento"
      },
      "body": "Ajustas el ángulo para enfocar el segmento exacto que necesitas tratar.",
      "swipe": "Desliza y descubre sus ventajas",
      "alt": "Tres posiciones de tratamiento en la camilla BTL Spinal Decompression: semiincorporada, flexión pélvica y prono. Texto: Descompresión que se adapta a cada paciente. +100 posiciones de tratamiento. Ajustas el ángulo para enfocar el segmento exacto que necesitas tratar."
    },
    {
      "layout": "benefits",
      "title": "Más posibilidades para tu clínica",
      "benefits": [
        {
          "icon": "do_not_touch",
          "title": "Terapia manos libres",
          "text": "El equipo aplica la descompresión; tú supervisas y ajustas."
        },
        {
          "icon": "airline_seat_flat",
          "title": "Trata toda la columna",
          "text": "Zona lumbar y cervical en un solo equipo."
        },
        {
          "icon": "trending_up",
          "title": "Una nueva línea de servicio",
          "text": "Una nueva fuente de ingresos para tu consulta."
        }
      ],
      "cta": "Solicita tu demo",
      "signature": "BTL El Salvador",
      "alt": "Tres ventajas de BTL Spinal Decompression para clínicas de fisioterapia y rehabilitación: terapia manos libres, trata toda la columna y una nueva línea de servicio. Solicita tu demo con BTL El Salvador."
    }
  ],
  "caption": "Este 16 de octubre, Día Mundial de la Columna Vertebral, piensa en tu paciente con ciática que ya probó medicamentos e infiltraciones. ¿Qué más le ofreces?\n\nBTL Spinal Decompression es descompresión vertebral no invasiva para hernia discal, lumbalgia crónica y dolor irradiado como la ciática o la radiculopatía. Aplica fuerzas robóticas con la precisión de unas manos, en unas 10 sesiones de 1 a 2 por semana, según cada caso.\n\n¿Tienes una clínica de fisioterapia o rehabilitación en El Salvador? Escríbenos \"DEMO\" por mensaje directo y agendamos tu demo.",
  "sources": [
    "knowledge/products/spinal-decompression.pdf (página oficial btlnet.es/spinal-decompression)",
    "knowledge/products/btl_products.json (indicaciones, fuerzas robóticas, protocolo de ~10 sesiones)",
    "knowledge/brand-guidelines/btl_corporate_identity.pdf (v2.3, 20.01.2025)"
  ]
}

```

Publicaciones recientes de la marca (evita repetir ganchos):
- 2026-10-19 · Día Internacional de la Lucha contra el Cáncer de Mama · portada: "Día Internacional de la **Lucha** **contra el Cáncer de Mama**"

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json
- knowledge/products/spinal-decompression.md
- knowledge/products/spinal-decompression.pdf

## Versión actual

```json
{
  "brand": "BTL El Salvador",
  "date": "2026-10-16",
  "occasion": "Día Mundial de la Columna Vertebral",
  "product": "spinal-decompression",
  "audience": "Fisioterapeutas, médicos rehabilitadores, clínicas y centros de rehabilitación",
  "slides": [
    {
      "layout": "commemoration",
      "datePill": "16 de octubre",
      "eyebrow": "Día Mundial de la\nColumna Vertebral",
      "title": "Ninguna\nespalda\nes igual.",
      "question": "¿Por qué tratarlas en la misma posición?",
      "swipe": "Desliza para ver la respuesta",
      "alt": "Ilustración de la columna vertebral en vista lateral con los discos lumbares resaltados en azul. Texto: 16 de octubre, Día Mundial de la Columna Vertebral. Ninguna espalda es igual. ¿Por qué tratarlas en la misma posición?"
    },
    {
      "layout": "product",
      "images": [
        {
          "src": "public/assets/products/spinal-decompression/posiciones/semiincorporada-inclinada.png",
          "alt": "Paciente en posición semiincorporada sobre BTL Spinal Decompression",
          "label": "Semiincorporada",
          "left": 30,
          "top": 250,
          "width": 640,
          "label_x": 60,
          "label_y": 350
        },
        {
          "src": "public/assets/products/spinal-decompression/posiciones/flexion-pelvica.png",
          "alt": "Paciente en supino con flexión pélvica sobre BTL Spinal Decompression",
          "label": "Flexión pélvica",
          "left": 700,
          "top": 225,
          "width": 340,
          "label_x": 20,
          "label_y": 175
        },
        {
          "src": "public/assets/products/spinal-decompression/posiciones/roof-prono.png",
          "alt": "Paciente en prono sobre BTL Spinal Decompression",
          "label": "Prono",
          "left": 720,
          "top": 465,
          "width": 290,
          "label_x": 0,
          "label_y": 185
        }
      ],
      "productLogo": "public/assets/products/spinal-decompression/logo/spinal-decompression-logo-white.png",
      "eyebrow": "BTL Spinal Decompression",
      "title": "Descompresión que se adapta a cada paciente",
      "stat": {
        "value": "+100",
        "label": "posiciones de tratamiento"
      },
      "body": "Ajustas el ángulo para enfocar el segmento exacto que necesitas tratar.",
      "swipe": "Desliza y descubre sus ventajas",
      "alt": "Tres posiciones de tratamiento en la camilla BTL Spinal Decompression: semiincorporada, flexión pélvica y prono. Texto: Descompresión que se adapta a cada paciente. +100 posiciones de tratamiento. Ajustas el ángulo para enfocar el segmento exacto que necesitas tratar."
    },
    {
      "layout": "benefits",
      "title": "Más posibilidades para tu clínica",
      "benefits": [
        {
          "icon": "do_not_touch",
          "title": "Terapia manos libres",
          "text": "El equipo aplica la descompresión; tú supervisas y ajustas."
        },
        {
          "icon": "airline_seat_flat",
          "title": "Trata toda la columna",
          "text": "Zona lumbar y cervical en un solo equipo."
        },
        {
          "icon": "trending_up",
          "title": "Una nueva línea de servicio",
          "text": "Una nueva fuente de ingresos para tu consulta."
        }
      ],
      "cta": "Solicita tu demo",
      "alt": "Tres ventajas de BTL Spinal Decompression para clínicas de fisioterapia y rehabilitación: terapia manos libres, trata toda la columna y una nueva línea de servicio. Solicita tu demo.",
      "style": [
        {
          "selector": ".b-cta",
          "property": "height",
          "value": "160px"
        }
      ]
    }
  ],
  "caption": "Este 16 de octubre, Día Mundial de la Columna Vertebral, piensa en tu paciente con ciática que ya probó medicamentos e infiltraciones. ¿Qué más le ofreces?\n\nBTL Spinal Decompression es descompresión vertebral no invasiva para hernia discal, lumbalgia crónica y dolor irradiado como la ciática o la radiculopatía. Aplica fuerzas robóticas con la precisión de unas manos, en unas 10 sesiones de 1 a 2 por semana, según cada caso.\n\n¿Tienes una clínica de fisioterapia o rehabilitación en El Salvador? Escríbenos \"DEMO\" por mensaje directo y agendamos tu demo.",
  "sources": [
    "knowledge/products/spinal-decompression.pdf (página oficial btlnet.es/spinal-decompression)",
    "knowledge/products/btl_products.json (indicaciones, fuerzas robóticas, protocolo de ~10 sesiones)",
    "knowledge/brand-guidelines/btl_corporate_identity.pdf (v2.3, 20.01.2025)"
  ]
}
```

## Solicitud de cambios de Jaime

- Alcance: Todo el carrusel
- Solicitud: "para la slide 3, la franja de fondo que va en la parte de "solicita tu demo" puedes hacerla del mismo color azul con efecto iluminado de la slide 1 y 2"

## Entrega

Devuelve el objeto JSON del esquema: `concept`, `content` completo revisado, `claims`, `warnings`, `summary` y `changed_slides`. Todo el texto en español.

