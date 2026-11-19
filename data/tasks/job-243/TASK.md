<!-- kind: copy -->
# Tarea de REACH Content Studio · job-243

Tipo: **proponer textos para cada diapositiva (paso 1, Mensaje)** · Publicación 9
(2026-11-19 · Día Internacional del Hombre - 19 de noviembre)

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-243/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-243/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-243/result.json`: un único objeto JSON que cumpla `data/tasks/job-243/schema.json`.
5. Valida el resultado con `npm run task:check -- job-243` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No guardes imágenes en las versiones: la aplicación renderiza al importar.
7. Solo textos: no compongas diapositivas ni elijas imágenes. Propón opciones realmente distintas entre sí y de las
   ya propuestas (`brief.md` → "Textos ya propuestos").

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
