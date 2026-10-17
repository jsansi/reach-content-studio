# Encargo: revisar un carrusel existente
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

## Iconos disponibles

`accessibility_new`, `airline_seat_flat`, `checklist`, `do_not_touch`, `patient_list`, `shield_person`, `swipe_left`, `trending_up`

## Propiedades permitidas en `style`

font-size, font-weight, line-height, letter-spacing, max-width, width, height, top, left, right, bottom, margin-top, margin-bottom, padding-top, padding-bottom, gap

## Documentos adjuntos por el usuario

- `data/uploads/pub-5/screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf` (screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf, 9098 KB)

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
- 2026-10-16 · Día Mundial de la Columna Vertebral · BTL Spinal Decompression · portada: "Ninguna espalda es igual."
- 2026-10-19 · Día Internacional de la Lucha contra el Cáncer de Mama · portada: "Día Internacional de la **Lucha** **contra el Cáncer de Mama**"

Carpetas de referencias visuales en public/assets/brands/btl/references: dia_de_la_artritis, dia_de_la_belleza, dia_mundial_sin_tabaco, dia_nacional_del_cardiologo

## Fuentes consultables

- knowledge/brand-guidelines/btl_corporate_identity.pdf
- knowledge/products/btl_products.json
- data/web/magnetotherapy.md
- https://www.btlnet.es/magnetotherapy
- data/uploads/pub-5/screencapture-btlnet-es-magnetotherapy-2026-10-16-11_10_19.pdf

## Versión actual

```json
{
  "brand": "BTL El Salvador",
  "date": "2026-10-20",
  "occasion": "Día Mundial de la Osteoporosis",
  "product": "magnetotherapy",
  "audience": "Fisioterapeutas, médicos rehabilitadores, clínicas y centros de rehabilitación",
  "slides": [
    {
      "layout": "commemoration",
      "datePill": "20 de octubre",
      "eyebrow": "Día Mundial de\nla Osteoporosis",
      "title": "Cuando el hueso\nse vuelve frágil,\n**la consulta se\nvuelve clave.**",
      "rule": true,
      "question": "¿Qué puede ofrecer tu consulta\nde rehabilitación?",
      "swipe": "Desliza para descubrirlo",
      "illustration": "bone",
      "alt": "Portada sobre fondo azul oscuro. Etiqueta: \"20 de octubre\". \"Día Mundial de la Osteoporosis\". Titular: \"Cuando el hueso se vuelve frágil, la consulta se vuelve clave.\", con \"la consulta se vuelve clave\" en negrita, y una línea fina celeste debajo Pregunta: \"¿Qué puede ofrecer tu consulta de rehabilitación?\" A la derecha, un fémur dibujado en línea blanca con hueso esponjoso poroso que brilla en celeste. Logo de BTL arriba a la derecha y \"Desliza para descubrirlo\".",
      "style": [
        {
          "selector": ".c-title",
          "property": "font-size",
          "value": "84px"
        },
        {
          "selector": ".c-title",
          "property": "font-weight",
          "value": "300"
        },
        {
          "selector": ".c-question",
          "property": "font-size",
          "value": "40px"
        },
        {
          "selector": ".c-question",
          "property": "margin-top",
          "value": "36px"
        }
      ]
    },
    {
      "layout": "hero",
      "theme": "light",
      "image": "data/uploads/pub-5/web-magnetotherapy-03.jpg",
      "imageAlt": "Paciente recostada en la camilla con el aplicador de anillo de BTL Magnetotherapy en las piernas",
      "imageFrame": {
        "left": 40,
        "top": 130,
        "width": 1000,
        "fadeBottom": 150
      },
      "extraImages": [
        {
          "image": "data/uploads/pub-5/web-magnetotherapy-02.jpg",
          "imageAlt": "Paciente sentada con el aplicador de disco de BTL Magnetotherapy bajo el antebrazo",
          "imageFrame": {
            "left": -90,
            "top": 50,
            "width": 600,
            "fadeTop": 40,
            "fadeBottom": 100,
            "fadeRight": 170
          }
        }
      ],
      "title": "BTL\n**Magnetotherapy**",
      "body": "La respuesta para tratar\n**distintas zonas del cuerpo.**\nCon 8 aplicadores en un solo equipo.",
      "rule": true,
      "swipe": "Tu ventaja",
      "alt": "Fondo claro. Foto principal grande, de lado a lado: una paciente recostada en la camilla con el aplicador de anillo de BTL Magnetotherapy en las piernas. Arriba a la izquierda, fundida en el fondo, una paciente sentada con el aplicador de disco bajo el antebrazo. Titular grande: \"BTL Magnetotherapy\", con \"Magnetotherapy\" en negrita. Una línea fina azul. Texto: \"La respuesta para tratar distintas zonas del cuerpo. Con 8 aplicadores en un solo equipo.\", con \"distintas zonas del cuerpo\" resaltado en azul. Logo de BTL arriba a la derecha y \"Tu ventaja\".",
      "style": [
        {
          "selector": ".h-title",
          "property": "font-size",
          "value": "84px"
        },
        {
          "selector": ".h-title",
          "property": "font-weight",
          "value": "300"
        },
        {
          "selector": ".h-title",
          "property": "letter-spacing",
          "value": "-1.5px"
        },
        {
          "selector": ".h-body",
          "property": "font-size",
          "value": "40px"
        },
        {
          "selector": ".h-body",
          "property": "line-height",
          "value": "1.25"
        }
      ]
    },
    {
      "layout": "benefits",
      "title": "**Tu ventaja:** tratar más zonas\ncon un solo equipo.",
      "rule": true,
      "benefits": [
        {
          "icon": "accessibility_new",
          "title": "Protocolos por zona",
          "text": "Selección intuitiva según el área anatómica."
        },
        {
          "icon": "patient_list",
          "title": "Pacientes en orden",
          "text": "Base de datos de pacientes en el mismo equipo."
        },
        {
          "icon": "shield_person",
          "title": "Terapeuta protegido",
          "text": "Con FMF, no queda expuesto al campo magnético."
        }
      ],
      "cta": "Solicita tu demo",
      "ctaBand": "glow",
      "alt": "Fondo claro. Titular: \"Tu ventaja: tratar más zonas con un solo equipo.\", con \"Tu ventaja:\" en negrita. Tres ventajas con iconos: figura del cuerpo, \"Protocolos por zona: selección intuitiva según el área anatómica.\"; lista de pacientes, \"Pacientes en orden: base de datos de pacientes en el mismo equipo.\"; escudo con persona, \"Terapeuta protegido: con FMF, no queda expuesto al campo magnético.\" Franja inferior azul: \"Solicita tu demo\". Logo de BTL arriba a la derecha.",
      "style": [
        {
          "selector": ".b-title",
          "property": "width",
          "value": "892px"
        },
        {
          "selector": ".b-title",
          "property": "font-size",
          "value": "66px"
        },
        {
          "selector": ".b-title",
          "property": "font-weight",
          "value": "300"
        },
        {
          "selector": ".b-title",
          "property": "top",
          "value": "270px"
        },
        {
          "selector": ".b-list",
          "property": "top",
          "value": "520px"
        },
        {
          "selector": ".b-item",
          "property": "padding-top",
          "value": "46px"
        },
        {
          "selector": ".b-item",
          "property": "padding-bottom",
          "value": "46px"
        },
        {
          "selector": ".b-cta",
          "property": "height",
          "value": "160px"
        },
        {
          "selector": ".b-cta-text",
          "property": "font-size",
          "value": "56px"
        }
      ]
    }
  ],
  "caption": "Cuando el hueso se vuelve frágil, la consulta se vuelve clave. Hoy, 20 de octubre, es el Día Mundial de la Osteoporosis: ¿qué puede ofrecer tu consulta de rehabilitación?\n\nBTL Magnetotherapy: la respuesta para tratar distintas zonas del cuerpo, con 8 aplicadores en un solo equipo. Y lo que gana tu clínica: protocolos por zona, base de datos de pacientes y tecnología FMF, para que el terapeuta no quede expuesto al campo magnético.\n\nEscríbenos \"DEMO\" por mensaje directo y solicita tu demo con BTL El Salvador.\n\n#DíaMundialDeLaOsteoporosis #Osteoporosis #Fisioterapia #Magnetoterapia #BTLElSalvador",
  "sources": [
    "data/web/magnetotherapy.md",
    "https://www.btlnet.es/magnetotherapy",
    "knowledge/brand-guidelines/btl-corporate-identity.md",
    "data/uploads/pub-5/BTL-4000-5000_Magnet_PIC_* (fotos oficiales de los aplicadores)",
    "data/uploads/pub-5/web-magnetotherapy-02.jpg y -03.jpg (fotos oficiales con pacientes, página de BTL)"
  ],
  "claims": [
    {
      "claim": "20 de octubre · Día Mundial de la Osteoporosis",
      "location": "diapositiva 1 y caption",
      "source": "brief.md · Brief de la publicación (fecha y ocasión)",
      "approval": "general_statement"
    },
    {
      "claim": "Cuando el hueso se vuelve frágil, la consulta se vuelve clave.",
      "location": "diapositiva 1 y caption",
      "source": "Gancho indicado por el usuario (job-106): frase general sobre la osteoporosis y el papel de la consulta, no atribuida al producto",
      "approval": "general_statement"
    },
    {
      "claim": "Fémur con hueso esponjoso poroso (ilustración del tema, sin rótulos)",
      "location": "diapositiva 1",
      "source": "Ilustración \"bone\" del renderizador, el mismo dibujo que BoneIllustration del sistema de diseño (v25); ilustra el tema, no un resultado del equipo",
      "approval": "general_statement"
    },
    {
      "claim": "hasta 4 canales",
      "location": "caption",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (conexión de hasta 4 canales)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Aplicador de disco y aplicador de anillo en uso (fotos oficiales)",
      "location": "diapositiva 2",
      "source": "data/web/magnetotherapy.md · lista de aplicadores (\"Aplicador de un solo disco\", \"Aplicador de anillos\"); fotos oficiales web-magnetotherapy-02 y -03",
      "approval": "manufacturer_description"
    },
    {
      "claim": "La respuesta para tratar distintas zonas del cuerpo. Con 8 aplicadores en un solo equipo.",
      "location": "diapositiva 2",
      "source": "data/web/magnetotherapy.md · \"¡Siempre tienes una opción!\" (Elige entre 8 aplicadores de magnetoterapia diferentes que permiten el tratamiento de cualquier parte del cuerpo)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Protocolos por zona: selección intuitiva según el área anatómica.",
      "location": "diapositiva 3",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (selección intuitiva de protocolos según las áreas anatómicas del cuerpo)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Pacientes en orden: base de datos de pacientes en el mismo equipo.",
      "location": "diapositiva 3",
      "source": "data/web/magnetotherapy.md · \"Beneficios de la magnetoterapia\" (una base de datos de pacientes)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Terapeuta protegido: con FMF, no queda expuesto al campo magnético.",
      "location": "diapositiva 3",
      "source": "data/web/magnetotherapy.md · Preguntas frecuentes, \"¿Qué tiene de especial la máquina de magnetoterapia BTL?\" (FMF filtra el campo magnético del lado del operador; el terapeuta no está expuesto)",
      "approval": "manufacturer_description"
    },
    {
      "claim": "Tu ventaja: tratar más zonas con un solo equipo.",
      "location": "diapositiva 3",
      "source": "data/web/magnetotherapy.md · \"¡Siempre tienes una opción!\" (8 aplicadores que permiten el tratamiento de cualquier parte del cuerpo) y \"Beneficios de la magnetoterapia\" (un dispositivo con conexión de hasta 4 canales); titular indicado por el usuario",
      "approval": "manufacturer_description"
    }
  ]
}
```

## Solicitud de cambios de Jaime

- Alcance: Una diapositiva (diapositiva 2)
- Solicitud: "Ajusta únicamente la **diapositiva 2**.

La composición general, la estructura y los textos aprobados deben mantenerse, pero necesitamos corregir el tratamiento visual de las fotografías.

### Cambio solicitado
- **Mueve el difuminado / degradado / overlay hacia la derecha**.
- Actualmente el tratamiento visual está afectando demasiado la visibilidad de la persona en la imagen.
- Queremos que **la figura humana se vea con mayor claridad**, especialmente el cuerpo y la interacción con el aplicador.
- El difuminado debe seguir ayudando a integrar la composición, pero **sin cubrir ni debilitar visualmente a la paciente**.

### Objetivo
- Mejorar la visibilidad de la persona.
- Mantener el protagonismo de la escena clínica.
- Lograr un mejor balance entre texto e imagen.
- Evitar que el recurso gráfico interfiera con la lectura visual de la fotografía.

### Dirección de arte
- Mantén el estilo premium, médico-tecnológico y coherente con el resto del carrusel.
- Conserva la integración limpia entre imagen y texto.
- Usa el difuminado únicamente como recurso de apoyo, no como elemento que opaque al sujeto principal.
- Si hace falta, ajusta también la intensidad del difuminado para que la transición se sienta más natural.

**Importante:** No cambies los textos aprobados ni la estructura de la diapositiva. Solo corrige la ubicación y el comportamiento del difuminado para que la persona se vea mejor."

## Entrega

Devuelve el objeto JSON del esquema: `concept`, `content` completo revisado, `claims`, `warnings`, `summary` y `changed_slides`. Todo el texto en español.

