<!-- kind: design_revise -->
# Tarea de REACH Content Studio · job-178

Tipo: **revisar una propuesta de diseño** · Publicación 7
(2026-10-24 · Ganador de rifa del Segundo Congreso Centroamericano de Cirugía Oral y Maxilofacial IAOMS / ALACIBU 2026)

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee `data/tasks/job-178/system.md`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee `data/tasks/job-178/brief.md`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en `data/tasks/job-178/result.json`: un único objeto JSON que cumpla `data/tasks/job-178/schema.json`.
5. Valida el resultado con `npm run task:check -- job-178` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No guardes imágenes en las versiones: la aplicación renderiza al importar y valida
   cada diapositiva (desbordes, solapes, contraste, zona del logo). `task:check` ya comprueba la estructura, los
   componentes, las props y que las imágenes estén en `data/tasks/job-178/assets.json`. Para ver el resultado renderizado antes de
   entregarlo, usa `npm run task:preview -- job-178` (PNG en `data/tasks/job-178/preview/`, con los avisos del validador).

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
