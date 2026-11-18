<!-- kind: generate -->
# Tarea de REACH Content Studio · job-200

Tipo: **generar carrusel** · Publicación 8
(2026-11-18 · Día Mundial de la Enfermedad Pulmonar Obstructiva Crónica (EPOC))

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-200/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-200/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-200/result.json`: un único objeto JSON que cumpla `data/tasks/job-200/schema.json`.
5. Valida el resultado con `npm run task:check -- job-200` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No guardes imágenes en las versiones: la aplicación renderiza al importar.
7. Usa los textos aprobados (`brief.md` → "Textos aprobados", también en `data/tasks/job-200/approved-copy.json`) tal como están:
   `task:check` comprueba que cada uno aparezca en su diapositiva.

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
