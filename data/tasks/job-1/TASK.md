# Tarea de REACH Content Studio · job-1

Tipo: **generar carrusel** · Publicación 2
(2026-10-18 · Dia Mundial de la Menopausia)

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-1/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-1/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-1/result.json`: un único objeto JSON que cumpla `data/tasks/job-1/schema.json`.
5. Valida el resultado con `npm run task:check -- job-1` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No renderices imágenes: la aplicación lo hace al importar.

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
