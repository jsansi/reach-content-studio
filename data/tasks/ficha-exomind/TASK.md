<!-- kind: product_sheet -->
# Tarea de REACH Content Studio · ficha-exomind

Tipo: **completar la ficha de un producto con sus fuentes** · EXOMIND

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/ficha-exomind/system.md`: son tus instrucciones.
2. Lee `data/tasks/ficha-exomind/brief.md`: el producto, sus enlaces, el texto ya extraído de sus páginas oficiales y sus documentos.
3. Puedes abrir los documentos listados en `brief.md` y, si hace falta, las páginas oficiales de BTL de la lista. No
   consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/ficha-exomind/result.json`: un único objeto JSON que cumpla `data/tasks/ficha-exomind/schema.json`.
5. Valida el resultado con `npm run task:check -- ficha-exomind` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio: la ficha no se guarda sola.

Cuando termines, Jaime pulsará **"Importar"** en la ficha de EXOMIND, revisará el texto y lo guardará.
