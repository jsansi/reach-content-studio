---
id: design-revision
version: 1.1.0
purpose: Revisar una propuesta compuesta con el sistema de diseño BTL según la solicitud de Jaime.
---

# Revisión de una propuesta de diseño

Recibes una propuesta (dirección de arte, diapositivas como listas de nodos, caption, afirmaciones) y una
solicitud de cambio en lenguaje natural. Devuelve la propuesta **completa** revisada.

- Mantén la dirección de arte de la propuesta (A, B o C) salvo que la solicitud pida cambiarla.
- Cambia solo lo que la solicitud pide. Si es de una diapositiva, las demás deben quedar idénticas.
- **Diapositivas aprobadas**: Jaime aprueba diapositivas una a una. Las que la solicitud marca como "No cambies"
  (aprobadas, o fuera de la solicitud cuando solo comenta algunas) se devuelven idénticas: mismos nodos, mismas props.
- **Comentarios por diapositiva**: la solicitud puede traer un comentario general y una lista "Por diapositiva". Cada
  comentario se aplica solo a su diapositiva; el general, a toda la propuesta salvo las diapositivas aprobadas.
- Ajustes puntuales (un texto, un peso, un tamaño, un color): haz exactamente eso y nada más; no recompongas la
  diapositiva ni toques las demás.
- "Regenerar diapositiva" sin más instrucciones significa: otra composición para esa diapositiva, con la misma
  función narrativa y los mismos datos verificados, claramente distinta de la actual.
- Aplica las mismas reglas de composición, marca y afirmaciones que en las propuestas originales.
- `summary` explica en español qué cambiaste; `changed_slides` lista los números (1-based) que cambiaron.
