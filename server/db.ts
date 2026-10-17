// SQLite storage (node:sqlite, built into Node 24). One file under DATA_DIR; schema migrations run on start.
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DATA_DIR } from './paths.ts';

const MIGRATIONS: string[] = [
  `
  CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE brands (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, signature TEXT NOT NULL, color TEXT NOT NULL,
    tokens TEXT NOT NULL, guideline_path TEXT NOT NULL, guideline_summary TEXT NOT NULL, editorial_prompt TEXT NOT NULL
  );
  CREATE TABLE products (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, data_json TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('catalog','user')),
    review_status TEXT NOT NULL CHECK (review_status IN ('catalog','pending_review','approved')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id TEXT NOT NULL REFERENCES brands(id),
    date TEXT NOT NULL, topic TEXT NOT NULL, format TEXT NOT NULL, objective TEXT NOT NULL,
    slide_count INTEGER NOT NULL DEFAULT 3, creative_instructions TEXT NOT NULL DEFAULT '', deadline TEXT,
    status TEXT NOT NULL DEFAULT 'planned', current_version_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX publications_date ON publications(date);
  CREATE TABLE publication_products (
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    PRIMARY KEY (publication_id, product_id)
  );
  CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('document','image')),
    filename TEXT NOT NULL, path TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    kind TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', stages_json TEXT NOT NULL,
    input_json TEXT NOT NULL DEFAULT '{}', error TEXT, outcome TEXT, task_dir TEXT, provider TEXT NOT NULL,
    revision_id INTEGER, prev_status TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), started_at TEXT, finished_at TEXT
  );
  CREATE TABLE versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    number INTEGER NOT NULL, origin TEXT NOT NULL, provider TEXT NOT NULL,
    content_json TEXT NOT NULL, caption TEXT NOT NULL, slides_json TEXT NOT NULL, validation_json TEXT NOT NULL,
    concept TEXT, prompt_versions_json TEXT, parent_version_id INTEGER, job_id INTEGER, notes TEXT, dir TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (publication_id, number)
  );
  CREATE TABLE source_refs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_id INTEGER NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('source','claim')),
    claim TEXT, location TEXT, source TEXT NOT NULL, approval TEXT
  );
  CREATE TABLE prompt_versions (
    prompt_id TEXT NOT NULL, version TEXT NOT NULL, sha256 TEXT NOT NULL, path TEXT NOT NULL,
    first_used_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (prompt_id, version, sha256)
  );
  CREATE TABLE revision_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    version_id INTEGER, target TEXT NOT NULL, slide_number INTEGER, instruction TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', result_version_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    version_id INTEGER, action TEXT NOT NULL, from_status TEXT, to_status TEXT, note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE editorial_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id TEXT REFERENCES brands(id), text TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `,
  // 2 · creative proposals composed with the BTL design system. Existing rows stay "carousel" versions.
  `
  ALTER TABLE versions ADD COLUMN kind TEXT NOT NULL DEFAULT 'carousel';
  ALTER TABLE versions ADD COLUMN direction TEXT;
  ALTER TABLE versions ADD COLUMN proposal_set INTEGER;
  ALTER TABLE versions ADD COLUMN proposal_status TEXT;
  `,
  // 3 · story (9:16) renders made when a version is approved.
  `
  ALTER TABLE versions ADD COLUMN story_json TEXT;
  `,
  // 4 · step 1 "Mensaje": short brief, text options proposed per slide, and the texts Jaime approved.
  `
  ALTER TABLE publications ADD COLUMN brief_json TEXT;
  ALTER TABLE publications ADD COLUMN approved_copy_json TEXT;
  CREATE TABLE copy_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    job_id INTEGER, slide INTEGER NOT NULL, option_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX copy_options_pub ON copy_options(publication_id);
  `,
];

fs.mkdirSync(DATA_DIR, { recursive: true });
export const db = new DatabaseSync(path.join(DATA_DIR, 'studio.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

const current = Number((db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version);
MIGRATIONS.slice(current).forEach((sql, i) => {
  db.exec('BEGIN');
  db.exec(sql);
  db.exec(`PRAGMA user_version = ${current + i + 1}`);
  db.exec('COMMIT');
});

export function tx<T>(fn: () => T): T {
  db.exec('BEGIN');
  try {
    const r = fn();
    db.exec('COMMIT');
    return r;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export const getMeta = (key: string) =>
  (db.prepare('SELECT value FROM meta WHERE key = ?').get(key) as { value: string } | undefined)?.value;
export const setMeta = (key: string, value: string) =>
  db.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
