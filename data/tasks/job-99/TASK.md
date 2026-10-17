<!-- kind: design_revise -->
# Tarea de REACH Content Studio · job-99

Tipo: **revisar una propuesta de diseño** · Publicación 5
(2026-10-20 · Día Mundial de la Osteoporosis)

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-99/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-99/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-99/result.json`: un único objeto JSON que cumpla `data/tasks/job-99/schema.json`.
5. Valida el resultado con `npm run task:check -- job-99` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No renderices imágenes: la aplicación lo hace al importar y valida
   cada diapositiva (desbordes, solapes, contraste, zona del logo). `task:check` ya comprueba la estructura, los
   componentes, las props y que las imágenes estén en `data/tasks/job-99/assets.json`.

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
