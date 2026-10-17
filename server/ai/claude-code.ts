// Local prototype mode: no API key. Writes a self-contained task package that Claude Code executes; the
// result (result.json) is validated and imported by the app. This step is manual and is shown as such in the UI.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { KIND_LABEL, RESULT_SCHEMAS, type AIKind } from './schemas.ts';
import { TASKS_DIR, rel } from '../paths.ts';
import type { AIProvider, AIRequest, AIResponse } from './provider.ts';

export const taskName = (jobId: number) => `job-${jobId}`;
export const claudeCommand = (dir: string) => `claude "Ejecuta la tarea de REACH Content Studio descrita en ${dir}/TASK.md"`;

export class ClaudeCodeProvider implements AIProvider {
  readonly id = 'claude_code' as const;
  readonly label = 'Claude Code (paso manual)';
  readonly model = null;

  async run(req: AIRequest): Promise<AIResponse> {
    const dir = path.join(TASKS_DIR, taskName(req.jobId));
    fs.mkdirSync(dir, { recursive: true });
    const schema = RESULT_SCHEMAS[req.kind];
    if (req.allowedImages) fs.writeFileSync(path.join(dir, 'assets.json'), JSON.stringify(req.allowedImages, null, 2));
    if (req.approvedCopy) fs.writeFileSync(path.join(dir, 'approved-copy.json'), JSON.stringify(req.approvedCopy, null, 2));
    if (req.fixedSlides) fs.writeFileSync(path.join(dir, 'fixed-slides.json'), JSON.stringify(req.fixedSlides, null, 2));
    const r = rel(dir);
    fs.writeFileSync(path.join(dir, 'system.md'), req.prompt.system + '\n');
    fs.writeFileSync(path.join(dir, 'brief.md'), req.prompt.user + '\n');
    fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(z.toJSONSchema(schema), null, 2));
    fs.writeFileSync(path.join(dir, 'prompt-versions.json'), JSON.stringify(req.prompt.versions, null, 2));
    fs.writeFileSync(
      path.join(dir, 'TASK.md'),
      `<!-- kind: ${req.kind} -->
# Tarea de REACH Content Studio · ${taskName(req.jobId)}

Tipo: **${KIND_LABEL[req.kind]}** · Publicación ${req.context.publication.id}
(${req.context.publication.date} · ${req.context.publication.topic})

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee \`${r}/system.md\`: son tus instrucciones (rol, reglas de marca, verificación de afirmaciones).
2. Lee \`${r}/brief.md\`: brief, contexto de marca y producto, activos disponibles y referencias.
3. Si necesitas confirmar una afirmación, puedes abrir los archivos y las páginas oficiales de BTL listados en "Fuentes consultables".
   No consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en \`${r}/result.json\`: un único objeto JSON que cumpla \`${r}/schema.json\`.
5. Valida el resultado con \`npm run task:check -- ${taskName(req.jobId)}\` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio. No guardes imágenes en las versiones: la aplicación renderiza al importar${req.kind === 'propose' || req.kind === 'design_revise' ? ` y valida
   cada diapositiva (desbordes, solapes, contraste, zona del logo). \`task:check\` ya comprueba la estructura, los
   componentes, las props y que las imágenes estén en \`${r}/assets.json\`. Para ver el resultado renderizado antes de
   entregarlo, usa \`npm run task:preview -- ${taskName(req.jobId)}\` (PNG en \`${r}/preview/\`, con los avisos del validador)` : ''}.${req.kind === 'propose' ? `
7. Crea las propuestas desde cero con las direcciones asignadas en \`brief.md\`: no copies ni adaptes resultados de
   otras tareas (\`data/tasks/*/result.json\`) ni versiones guardadas, aunque sean de la misma publicación.` : ''}${req.approvedCopy ? `
${req.kind === 'propose' ? 8 : 7}. Usa los textos aprobados (\`brief.md\` → "Textos aprobados", también en \`${r}/approved-copy.json\`) tal como están:
   \`task:check\` comprueba que cada uno aparezca en su diapositiva.` : ''}${req.fixedSlides ? `
7. No cambies las diapositivas ${req.fixedSlides.slides.join(', ')} (Jaime las aprobó o no están en la solicitud): deben quedar idénticas
   a \`${r}/fixed-slides.json\`. \`task:check\` lo comprueba.` : ''}${req.kind === 'copy' ? `
7. Solo textos: no compongas diapositivas ni elijas imágenes. Propón opciones realmente distintas entre sí y de las
   ya propuestas (\`brief.md\` → "Textos ya propuestos").` : ''}

Cuando termines, Jaime pulsará **"Importar resultado"** en la publicación.
`
    );
    return { type: 'task_package', dir: r, provider: this.id };
  }
}

export const taskKind = (dir: string): AIKind => {
  const head = fs.readFileSync(path.join(TASKS_DIR, path.basename(dir), 'TASK.md'), 'utf8');
  const m = head.match(/<!-- kind: (\w+) -->/);
  if (m && m[1] in RESULT_SCHEMAS) return m[1] as AIKind;
  return head.includes('revisar carrusel') ? 'revise' : 'generate'; // packages written before kinds were recorded
};

export function readTaskResult<K extends AIKind>(dir: string, kind: K) {
  const file = path.join(TASKS_DIR, path.basename(dir), 'result.json');
  if (!fs.existsSync(file)) throw new Error(`Todavía no existe ${rel(file)}. Ejecuta la tarea en Claude Code antes de importar.`);
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    throw new Error(`${rel(file)} no es un JSON válido.`);
  }
  const parsed = (RESULT_SCHEMAS[kind] as (typeof RESULT_SCHEMAS)[K]).safeParse(data);
  if (!parsed.success)
    throw new Error(`El resultado no cumple el esquema:\n${parsed.error.issues.slice(0, 8).map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n')}`);
  return parsed.data as import('zod').infer<(typeof RESULT_SCHEMAS)[K]>;
}
