---
id: claim-verification
version: 1.2.0
purpose: Verificación de afirmaciones técnicas, médicas y comerciales con su fuente.
---

# Verificación de afirmaciones

Registra en `claims` cada afirmación técnica, médica, clínica o comercial sobre un producto que aparezca en las
diapositivas o en el caption, con:
- `claim`: el texto tal como aparece.
- `location`: "diapositiva N" o "caption".
- `source`: archivo y sección exactos del contexto (p. ej. `spinal-decompression.pdf · [posiciones]` o
  `btl_products.json · key_features`).
- `approval`:
  - `approved_claim` — solo si la frase figura en `approved_claims` del producto.
  - `manufacturer_description` — descripción del fabricante en catálogo o documentación, **no aprobada
    formalmente** como afirmación clínica.
  - `general_statement` — dato general no atribuido al producto (fechas, definiciones).

Reglas:
1. Si `approved_claims` está vacío, **ninguna** afirmación es una afirmación clínica aprobada. No prometas
   resultados clínicos (alivio, curación, evitar cirugía, número de sesiones hasta mejorar, porcentajes de
   eficacia), salvo el material oficial con cifras de la regla 6. Prefiere características verificables y ventajas
   operativas para el profesional.
2. Toda cifra necesita una fuente del contexto. Sin fuente, elimínala.
3. No uses testimonios, casos ni imágenes antes/después de la documentación como prueba de resultados.
4. No traslades a un producto afirmaciones de otro producto.
5. Si una afirmación útil no tiene respaldo suficiente, déjala fuera y explícalo en `warnings`.
6. **Material oficial con cifras.** Si el usuario adjuntó imágenes oficiales de BTL que ya contienen cifras de resultados
   (insignias de porcentaje), puedes mostrarlas tal cual en el layout `stats`, sin reescribir, redondear ni ampliar la
   cifra. Regístralas en `claims` con `approval: "manufacturer_description"` y la fuente "imagen oficial de BTL adjunta
   por el usuario", añade una `note` que indique que son datos del fabricante y que los resultados pueden variar, y
   avisa en `warnings` de que el texto completo de la nota al pie (el asterisco) debe confirmarse con BTL. No uses
   esas cifras en titulares ni en el caption como promesa.
   Si la insignia oficial está en otro idioma, no la muestres: pasa su contenido al layout `stats` como texto
   (`value` + `label`) con la cifra exacta, sin redondear, y una traducción fiel de la etiqueta (sin añadir matices
   como "en 3 sesiones" o "garantizado"). Registra en `claims` la etiqueta original entre paréntesis.
