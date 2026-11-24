<!-- kind: propose -->
# Tarea de REACH Content Studio · job-414

Tipo: **tres propuestas creativas (sistema de diseño BTL)** · Publicación 11
(2026-11-30 · 30 de noviembre - Día Internacional de la Lucha contra los Trastornos de la Conducta Alimentaria)

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-414/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-414/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-414/result.json`: un único objeto JSON que cumpla `data/tasks/job-414/schema.json`.
5. Valida el resultado con `npm run task:check -- job-414` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No guardes imágenes en las versiones: la aplicación renderiza al importar y valida
   cada diapositiva (desbordes, solapes, contraste, zona del logo). `task:check` ya comprueba la estructura, los
   componentes, las props y que las imágenes estén en `data/tasks/job-414/assets.json`. Para ver el resultado renderizado antes de
   entregarlo, usa `npm run task:preview -- job-414` (PNG en `data/tasks/job-414/preview/`, con los avisos del validador).
7. Crea las propuestas desde cero con las direcciones asignadas en `brief.md`: no copies ni adaptes resultados de
   otras tareas (`data/tasks/*/result.json`) ni versiones guardadas, aunque sean de la misma publicación.
8. Usa los textos aprobados (`brief.md` → "Textos aprobados", también en `data/tasks/job-414/approved-copy.json`) tal como están:
   `task:check` comprueba que cada uno aparezca en su diapositiva.

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
