// Renders a carousel from an editorial content file to HTML + PNG.
// Usage: node studio/render.js content/spinal-decompression/dia-mundial-columna-2026.json
// The rendering itself lives in studio/engine.js, shared with the REACH Content Studio server.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, renderCarousel } from './engine.js';

const contentPath = process.argv[2];
if (!contentPath) {
  console.error('Usage: node studio/render.js <content.json>');
  process.exit(1);
}
const content = JSON.parse(fs.readFileSync(path.resolve(ROOT, contentPath), 'utf8'));
const outDir = path.resolve(ROOT, content.output);

const { slides, problems } = await renderCarousel({ content, outDir });
for (const s of slides)
  console.log(`${path.relative(ROOT, path.join(outDir, s.file))}  ${s.width}×${s.height}  ${(s.bytes / 1024).toFixed(0)} KB`);

if (problems.length) {
  console.log('\nLayout checks:\n' + problems.map((p) => `  ✗ slide ${p.slide}: ${p.message}`).join('\n'));
  process.exitCode = 2;
} else console.log('\nLayout checks passed.');
