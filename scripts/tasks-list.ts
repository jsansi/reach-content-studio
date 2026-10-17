// Lists Claude Code task packages that still have no result.json.
import fs from 'node:fs';
import path from 'node:path';
import { TASKS_DIR, rel } from '../server/paths.ts';

const dirs = fs.existsSync(TASKS_DIR) ? fs.readdirSync(TASKS_DIR).filter((d) => fs.existsSync(path.join(TASKS_DIR, d, 'TASK.md'))) : [];
const pending = dirs.filter((d) => !fs.existsSync(path.join(TASKS_DIR, d, 'result.json')));
if (!pending.length) console.log('No hay tareas pendientes.');
for (const d of pending) console.log(`${rel(path.join(TASKS_DIR, d, 'TASK.md'))}`);
