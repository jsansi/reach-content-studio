// Library of topic illustrations: every Illustration used in an approved version is saved here, so later
// publications can reuse it (listed in the brief) instead of drawing it again.
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, rel } from '../paths.ts';
import type { Version } from '../../shared/types.ts';

export const LIBRARY_DIR = path.join(DATA_DIR, 'illustrations');
export interface LibraryItem { title: string; viewBox: string; svg: string; topic: string; date: string; publication_id: number; version: number }

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'ilustracion';

/** Saves the Illustration nodes of an approved design version. Returns the files written. */
export function saveIllustrations(v: Version, topic: string, date: string): string[] {
  if (v.kind !== 'design' || !v.design) return [];
  const out: string[] = [];
  for (const s of v.design.slides)
    for (const n of s.nodes) {
      if (n.type !== 'Illustration') continue;
      const p = JSON.parse(n.props || '{}');
      if (typeof p.svg !== 'string' || typeof p.viewBox !== 'string') continue;
      const title = String(p.title || topic);
      fs.mkdirSync(LIBRARY_DIR, { recursive: true });
      const file = path.join(LIBRARY_DIR, `${slug(title)}.json`);
      const item: LibraryItem = { title, viewBox: p.viewBox, svg: p.svg, topic, date, publication_id: v.publication_id, version: v.number };
      fs.writeFileSync(file, JSON.stringify(item, null, 2));
      out.push(rel(file));
    }
  return out;
}

export function listLibrary(): (LibraryItem & { path: string })[] {
  if (!fs.existsSync(LIBRARY_DIR)) return [];
  return fs.readdirSync(LIBRARY_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => ({ ...(JSON.parse(fs.readFileSync(path.join(LIBRARY_DIR, f), 'utf8')) as LibraryItem), path: rel(path.join(LIBRARY_DIR, f)) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Brief section: built-in illustrations plus the saved ones (the most recent inline, the rest by path). */
export function libraryMarkdown(): string {
  const items = listLibrary();
  const lines = [
    'Ilustraciones del sistema de diseño: `SpineIllustration`, `SpineDiagram`, `VertebraRuler`, `DiscGlyph` (columna) y `BoneIllustration`, `BoneDensity` (hueso, osteoporosis).',
  ];
  if (!items.length) lines.push('Biblioteca: todavía no hay ilustraciones guardadas de publicaciones aprobadas.');
  else {
    lines.push('Biblioteca (ilustraciones de publicaciones aprobadas; reutilízalas con `Illustration` copiando `svg` y `viewBox`):');
    items.forEach((it, i) => {
      lines.push(`- **${it.title}** · ${it.topic} · ${it.date} · \`${it.path}\``);
      if (i < 4 && it.svg.length <= 12000) lines.push(`  viewBox \`${it.viewBox}\` · svg: \`${it.svg.replace(/\s+/g, ' ')}\``);
    });
  }
  return lines.join('\n');
}
