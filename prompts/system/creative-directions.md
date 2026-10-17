---
id: creative-directions
version: 1.0.0
purpose: Banco de direcciones de arte. La app elige tres por ronda de propuestas (familias distintas, las menos usadas recientemente por la marca) y las pasa en el encargo.
---

# Banco de direcciones de arte (sistema de diseño BTL)

Cada entrada es `## id · Nombre`, una línea `Familia:` y la descripción que recibe el modelo. La app
(`server/design/directions.ts`) elige tres de familias distintas, priorizando las que la marca no ha usado
recientemente, y como mucho una de la familia `libre`. Todas respetan el manual de BTL: colores, Noto Sans,
logo, márgenes, 30 px mínimos y reglas de afirmaciones. Al añadir o cambiar una entrada, sube `version`.

## editorial-minimalista · Editorial minimalista
Familia: tipografia
La tipografía es la protagonista. Mucho espacio negativo, composición asimétrica, una sola idea por diapositiva.
Numerales gigantes en peso fino (`BigNumber`), titulares grandes en Light, reglas finas (`Rule`), imagen pequeña
o recortada como acento, o ninguna. Fondos `white`/`light` con un golpe de `enterprise`. Un solo trazo fino
(`Curve`) como hilo. Jerarquía: tipografía → texto → imagen.

## poster-tipografico · Póster tipográfico
Familia: tipografia
Cada diapositiva es un cartel: un titular `display` o `xl` en SemiBold que ocupa casi todo el ancho, dos o tres
palabras por línea, con un contraste de escala extremo frente a un único `Body` `s`. Fondos plenos `enterprise`,
`blue` o `deep` que cambian de una diapositiva a otra como capítulos. Imagen mínima o ninguna; la ilustración del
tema, pequeña y precisa, como sello. Nada de módulos ni listas. Jerarquía: palabra → silencio → detalle.

## revista-editorial · Revista editorial
Familia: tipografia
Maquetación de revista científica de divulgación: `Eyebrow` con número de sección ("01 · Contexto"), columna de
texto estrecha (`maxWidth` 420–520) frente a una foto o ilustración grande en la otra mitad, pie de foto con
`caption` de `ProductImage` o `Footnote`, filetes horizontales que separan cabecera y cuerpo. Fondos `white`/`light`
y una diapositiva `deep` como contrapunto. Jerarquía: titular → imagen → columna → pie.

## tecnologia-premium · Tecnología médica premium
Familia: imagen
El equipo o el aplicador es el protagonista. Imagen grande, a sangre o enmarcada en un `Region` `surface="white"`,
con profundidad (`Glow` como luz de piso, `Rings` como marco, `Halo` detrás). Fondos `dark`/`deep`/`blue` con la
luz del degradado dirigida. Texto breve y elegante sobre zonas lisas, nunca encima del detalle de la foto.
Jerarquía: imagen → titular → datos.

## macro-detalle · Macro del detalle
Familia: imagen
Primerísimo plano: recorta la foto oficial para mostrar un detalle (la superficie del aplicador, la pantalla, el
anillo, una textura) con `height`, `width` grandes y `objectPosition`, saliendo del lienzo por uno o dos lados.
El producto completo solo aparece en la diapositiva siguiente, como revelación. Fondos `light`/`white` con la foto
fundida (`fade`); el texto vive en una franja limpia. No recortes el producto hasta hacerlo irreconocible en la
diapositiva donde se nombra. Jerarquía: detalle → intriga → revelación.

## objeto-centrado · Objeto en el centro
Familia: imagen
Composición simétrica y escultórica: el equipo o un aplicador aislado en el centro exacto, rodeado de `Rings`
concéntricos y un `Halo` amplio, sobre `dark` o `deep`. Titular corto arriba y una línea breve abajo, ambos
alineados a la izquierda pero cortos, para que el objeto respire. La ilustración del tema puede ocupar el mismo
centro en la portada y ceder el sitio al equipo después. Jerarquía: objeto → anillo de luz → palabra.

## cientifica-educativa · Científica y educativa
Familia: datos
Información visual y estructura modular (`ModuleGrid` + `Module` con filetes), datos con fuente (`Stat`,
`SessionSquares`, `NumberedList`), etiquetas, pasos, notas al pie. Fondos `white`/`light` con módulos `enterprise`
y una `LightBand` como soporte de los datos. Jerarquía: estructura → dato → explicación.

## dato-protagonista · Dato protagonista
Familia: datos
Una cifra documentada por diapositiva domina el lienzo (`BigNumber` 360–480 o `Stat` de 140–160), con una frase
que la explica y la fuente al pie. Si las fuentes no tienen cifras suficientes, usa conteos verificables (número
de aplicadores, canales, zonas, posiciones) o convierte una diapositiva en ilustración; nunca inventes cifras.
Ritmo: cifra → significado → siguiente cifra. Fondos alternos claros y oscuros.

## pantalla-dividida · Pantalla dividida
Familia: narrativa
Cada diapositiva se parte en dos mitades (vertical u horizontal) con un `Region` de `surface` frente al fondo:
pregunta/respuesta, rutina de la consulta/lo que cambia en la consulta, tema del día/papel de la clínica. Nunca
"antes/después" de pacientes ni resultados clínicos. La línea de corte puede desplazarse de una diapositiva a otra
para crear movimiento. Jerarquía: tensión → resolución.

## recorrido-continuo · Recorrido continuo
Familia: narrativa
Las tres diapositivas son un solo panorama: una `Curve` o una `LightBand` cruza todos los bordes y une hitos
numerados (01, 02, 03) o escenas de la consulta. Los elementos se cortan en el borde y continúan en la siguiente
(foto, halo, ilustración). Se lee como un paseo de izquierda a derecha. Jerarquía: recorrido → hito → texto.

## pregunta-respuesta · Conversación
Familia: narrativa
Cada diapositiva es un turno de conversación con el profesional: una pregunta enorme en Light (lo que se pregunta
un fisioterapeuta o el dueño de la clínica) y una respuesta breve y verificable. La última pregunta es la que se
responde con la demo. Mucho aire, ritmo de diálogo, la imagen como prueba visual de la respuesta. Jerarquía:
pregunta → respuesta → imagen.

## ilustracion-protagonista · Ilustración protagonista
Familia: ilustracion
La ilustración del tema (del sistema, de la biblioteca o una `Illustration` nueva) ocupa el 50–70 % de la portada
con brillo celeste y halo, como en la portada del Día Mundial de la Columna; el texto la rodea sin taparla. La
ilustración puede repetirse a otra escala o desde otro ángulo en las demás diapositivas, cediendo protagonismo al
equipo. Fondos `dark`/`deep`. Jerarquía: ilustración → gancho → equipo.

## plano-tecnico · Plano técnico
Familia: ilustracion
Estética de plano o lámina técnica: líneas finas `sky` sobre `deep`, `Rule` como cotas, `Eyebrow` como rótulos,
`ModuleGrid` abierto como retícula, ilustración esquemática del tema (anatomía o concepto, nunca el equipo) con
puntos señalados por etiquetas fuera del dibujo. Las fotos del equipo aparecen enmarcadas como lámina adjunta.
Jerarquía: esquema → rótulo → explicación.

## metafora-visual · Metáfora visual
Familia: ilustracion
Una metáfora visual dibujada con `Illustration` conecta el tema con la idea de la pieza (un mapa, una brújula,
raíces, un engranaje, un puente, una red): sencilla, de trazo luminoso y colores de marca. La metáfora es la
portada y vuelve como motivo pequeño en el cierre. Nunca dibujes el equipo ni sugieras resultados clínicos con la
metáfora. Jerarquía: metáfora → idea → prueba (foto oficial).

## libre · Propuesta libre
Familia: libre
Rompe la gramática habitual de las propuestas de la marca: la composición, el recorrido y la mezcla de recursos
son decisión tuya, siempre dentro del manual de BTL, los 30 px mínimos, el logo con su zona de seguridad y las
reglas de afirmaciones. Busca algo que no se haya visto en "Diseños anteriores" y explica en `differentiation`
qué riesgo creativo tomas.
