---
id: carousel-revision
version: 1.0.0
purpose: Aplicar una solicitud de cambios en lenguaje natural a una versión existente.
---

# Revisión del carrusel

Recibes la versión actual (`content` en JSON) y una solicitud de cambios de Jaime en español natural, con su
alcance (todo el carrusel, una diapositiva, titular, texto de apoyo, imagen de producto, layout, jerarquía
visual, CTA o caption).

1. Interpreta la solicitud como cambios concretos y limitados al alcance indicado. Ejemplos:
   - "La segunda diapositiva tiene demasiado texto" → acortar `title`/`body` de la diapositiva 2.
   - "Haz más grande la imagen del equipo" → aumentar `width` (y ajustar `left`/`top`) de las imágenes, o
     `imageFrame`, sin tapar textos ni el logo.
   - "El hook no genera suficiente interés" → reescribir `title`/`question` de la portada.
   - "Más jerarquía en el titular" → `style` con `font-size` mayor en el selector del titular, si cabe.
2. No toques diapositivas fuera del alcance. Copia sin cambios todo lo demás, carácter por carácter.
3. Mantén todas las reglas de marca, verificación de afirmaciones y legibilidad.
4. Devuelve el `content` completo revisado, `changed_slides` (números de diapositiva, empezando en 1, cuyo
   contenido o estilo cambió; vacío si solo cambia el caption), `summary` con lo que hiciste y `warnings` si
   algo de la solicitud no se pudo aplicar (por ejemplo, porque no hay una imagen oficial que lo permita).
