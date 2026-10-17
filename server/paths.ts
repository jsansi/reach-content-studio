// Filesystem locations. DATA_DIR holds everything the app writes (database, generated media, uploads,
// Claude Code task packages); it can be moved with REACH_DATA_DIR. Paths stored in the database are
// relative to ROOT when they live inside the repo, so the data folder can be backed up as a unit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Local secrets and settings (ANTHROPIC_API_KEY, REACH_DATA_DIR, PORT) live in .env, which git ignores.
if (fs.existsSync(path.join(ROOT, '.env'))) process.loadEnvFile(path.join(ROOT, '.env'));
export const DATA_DIR = path.resolve(ROOT, process.env.REACH_DATA_DIR || 'data');
export const MEDIA_DIR = path.join(DATA_DIR, 'media');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const TASKS_DIR = path.join(DATA_DIR, 'tasks');
export const PROMPTS_DIR = path.join(ROOT, 'prompts');
export const WEB_DIST = path.join(ROOT, 'web', 'dist');

// Repo-relative path when possible (what the renderer and the task packages expect).
export const rel = (abs: string) => {
  const r = path.relative(ROOT, abs);
  return r.startsWith('..') ? abs : r.split(path.sep).join('/');
};
export const abs = (p: string) => path.resolve(ROOT, p);

export const versionDir = (publicationId: number, number: number) =>
  path.join(MEDIA_DIR, `pub-${publicationId}`, `v${String(number).padStart(2, '0')}`);
export const versionUrl = (publicationId: number, number: number) =>
  `/media/pub-${publicationId}/v${String(number).padStart(2, '0')}`;
