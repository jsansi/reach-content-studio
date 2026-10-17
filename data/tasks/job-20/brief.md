# Encargo: generar un carrusel nuevo
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
- `public/assets/brands/btl/logo/btl-logo.svg` · brand_logo

## Iconos disponibles

`airline_seat_flat`, `checklist`, `do_not_touch`, `swipe_left`, `trending_up`

## Propiedades permitidas en `style`

font-size, font-weight, line-height, letter-spacing, max-width, width, height, top, left, right, bottom, margin-top, margin-bottom, padding-top, padding-bottom, gap

## Documentos adjuntos por el usuario

- `data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf` (btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf, 3076 KB)

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

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json
- data/uploads/pub-3/btlaesthetics-es-for-providers-emfemme-360-providers-2026-10-15-08_25_42.pdf

## Entrega

Devuelve el objeto JSON del esquema: `concept`, `content` (con exactamente 3 diapositivas), `claims` y `warnings`. Todo el texto en español.

