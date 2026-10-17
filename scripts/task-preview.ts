// Renders a Claude Code design task's result.json to PNG so it can be checked visually before Jaime imports it:
// npm run task:preview -- job-12  →  data/tasks/job-12/preview/<A|B|C>/slide-0N.png + the validator's notes.
// Nothing is stored as a version: the app renders and validates again on import.
import fs from 'node:fs';
import path from 'node:path';
import { TASKS_DIR } from '../server/paths.ts';
import { RESULT_SCHEMAS } from '../server/ai/schemas.ts';
import { taskKind } from '../server/ai/claude-code.ts';
import { renderProposal } from '../server/design/render.ts';
import type { ProposalT } from '../shared/design.ts';

const name = process.argv[2];
if (!name) {
  console.error('Uso: npm run task:preview -- job-N');
  process.exit(1);
}
const dir = path.join(TASKS_DIR, path.basename(name));
const kind = taskKind(dir);
if (kind !== 'propose' && kind !== 'design_revise') {
  console.error('Solo las tareas de propuestas creativas y de revisión de diseño tienen vista previa.');
  process.exit(1);
}
const parsed = RESULT_SCHEMAS[kind].safeParse(JSON.parse(fs.readFileSync(path.join(dir, 'result.json'), 'utf8')));
if (!parsed.success) {
  console.error('✗ result.json no cumple el esquema: ejecuta primero npm run task:check');
  process.exit(2);
}
const data = parsed.data as { proposals?: ProposalT[]; proposal?: ProposalT };
const proposals = kind === 'propose' ? data.proposals! : [data.proposal!];
const brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8');
const secondary = brief.match(/Color secundario del producto: (#[0-9a-fA-F]{6})/)?.[1] ?? null;
const out = path.join(dir, 'preview');
fs.rmSync(out, { recursive: true, force: true });
let problems = 0;
for (const p of proposals) {
  const target = path.join(out, p.direction);
  const r = await renderProposal(p, target, { secondary });
  console.log(`Propuesta ${p.direction} → ${path.relative(process.cwd(), target)}/`);
  r.issues.forEach((list, i) => {
    problems += list.length;
    console.log(`  ${list.length ? '✗' : '✓'} diapositiva ${i + 1}${list.length ? `: ${list.join(' · ')}` : ''}`);
  });
  for (const f of r.autofixes) console.log(`  · corrección automática: ${f}`);
  for (const n of r.notes) console.log(`  · ${n}`);
}
process.exit(problems ? 2 : 0);
