// Validates a Claude Code task result against its schema (and, for design proposals, against the BTL
// component catalog and the publication's image list): npm run task:check -- job-12
import fs from 'node:fs';
import path from 'node:path';
import { TASKS_DIR } from '../server/paths.ts';
import { RESULT_SCHEMAS } from '../server/ai/schemas.ts';
import { taskKind } from '../server/ai/claude-code.ts';
import { checkDesign } from '../server/design/render.ts';
import type { ProposalT } from '../shared/design.ts';
import { classicSlideTexts, designSlideTexts, missingApprovedTexts, type ApprovedCopy } from '../shared/structure.ts';

const name = process.argv[2];
if (!name) {
  console.error('Uso: npm run task:check -- job-N');
  process.exit(1);
}
const dir = path.join(TASKS_DIR, path.basename(name));
const file = path.join(dir, 'result.json');
if (!fs.existsSync(file)) {
  console.error(`No existe ${file}`);
  process.exit(1);
}
const kind = taskKind(dir);
const r = RESULT_SCHEMAS[kind].safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
if (!r.success) {
  console.error('✗ result.json no cumple el esquema:');
  for (const i of r.error.issues) console.error(`  - ${i.path.join('.')}: ${i.message}`);
  process.exit(2);
}
const data = r.data as any;
// Texts approved by Jaime in step 1 (written with the package): every one must appear in its slide.
const copyFile = path.join(dir, 'approved-copy.json');
const approved: ApprovedCopy | null = fs.existsSync(copyFile) ? JSON.parse(fs.readFileSync(copyFile, 'utf8')) : null;

if (kind === 'copy') {
  const brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8');
  const wanted = [...brief.matchAll(/^- Diapositiva (\d+) · .+?: \*\*(\d+) opciones\*\*/gm)].map((m) => ({ slide: Number(m[1]), n: Number(m[2]) }));
  const errors: string[] = [];
  for (const w of wanted) {
    const got = data.slides.find((s: any) => s.slide === w.slide)?.options.length ?? 0;
    if (got < w.n) errors.push(`Diapositiva ${w.slide}: se piden ${w.n} opciones y hay ${got}.`);
  }
  for (const s of data.slides) if (!wanted.some((w) => w.slide === s.slide)) errors.push(`Diapositiva ${s.slide}: no se pidieron opciones para ella.`);
  for (const s of data.slides)
    for (const [i, o] of s.options.entries()) {
      if (!o.headline.trim()) errors.push(`Diapositiva ${s.slide}, opción ${i + 1}: falta el texto principal.`);
      for (const p of o.points) if (p.title.length > 30 || p.text.length > 70) errors.push(`Diapositiva ${s.slide}, opción ${i + 1}: la ventaja "${p.title}" supera 30 / 70 caracteres.`);
    }
  const heads = data.slides.flatMap((s: any) => s.options.map((o: any) => o.headline.replace(/\s+/g, ' ').trim().toLowerCase()));
  if (new Set(heads).size !== heads.length) errors.push('Hay opciones repetidas.');
  if (errors.length) {
    console.error('✗ Problemas en las opciones:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(2);
  }
  console.log(`✓ ${name}: ${data.slides.map((s: any) => `diapositiva ${s.slide}: ${s.options.length} opciones`).join(', ')}. Listo para importar.`);
  process.exit(0);
}

if (kind === 'propose' || kind === 'design_revise') {
  const assetsFile = path.join(dir, 'assets.json');
  const allowed = new Set<string>(fs.existsSync(assetsFile) ? JSON.parse(fs.readFileSync(assetsFile, 'utf8')) : []);
  const brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8');
  const expected = Number(brief.match(/· (\d+) diapositiva/)?.[1] ?? 3);
  const proposals: ProposalT[] = kind === 'propose' ? data.proposals : [data.proposal];
  // The brief states the product's secondary color (or that there is none); older packages say nothing.
  const secondary = brief.match(/Color secundario del producto: (#[0-9a-fA-F]{6})/)?.[1] ?? (/Color secundario: ninguno asignado/.test(brief) ? null : undefined);
  const errors = proposals.flatMap((p) => checkDesign(p, allowed, expected, secondary).map((e) => `Propuesta ${p.direction}: ${e}`));
  if (kind === 'propose' && new Set(proposals.map((p) => p.direction)).size !== 3) errors.push('Se esperaban tres propuestas con direcciones A, B y C.');
  // Packages from prompt design-proposals ≥ 1.5.0 assign the directions and ask for the explored concepts first.
  if (kind === 'propose' && brief.includes('Direcciones de arte asignadas') && (data.concepts_explored?.length ?? 0) < 6)
    errors.push('Faltan los conceptos explorados: `concepts_explored` debe tener entre 6 y 8 ideas distintas.');
  // Design revisions: approved slides (and slides outside the request) must come back identical.
  const fixedFile = path.join(dir, 'fixed-slides.json');
  if (kind === 'design_revise' && fs.existsSync(fixedFile)) {
    const fixed: { slides: number[]; base: ProposalT } = JSON.parse(fs.readFileSync(fixedFile, 'utf8'));
    for (const n of fixed.slides)
      if (JSON.stringify(data.proposal.slides[n - 1]) !== JSON.stringify(fixed.base.slides[n - 1]))
        errors.push(`Diapositiva ${n}: no se puede cambiar (aprobada o fuera de la solicitud); devuélvela idéntica a fixed-slides.json.`);
  }
  if (kind === 'propose' && approved)
    for (const p of proposals) errors.push(...missingApprovedTexts(approved, p.slides.map(designSlideTexts)).map((m) => `Propuesta ${p.direction}: ${m}`));
  if (errors.length) {
    console.error('✗ Problemas de estructura:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(2);
  }
  if (kind === 'propose') {
    // Non-blocking: the same repetition check the app runs on import, against the brand's stored proposals.
    const pubId = Number(fs.readFileSync(path.join(dir, 'TASK.md'), 'utf8').match(/Publicación (\d+)/)?.[1]);
    try {
      const { getPublication } = await import('../server/repo.ts');
      const { recentDesigns, repetitionWarnings } = await import('../server/design/memory.ts');
      const warn = [...repetitionWarnings(proposals, recentDesigns(getPublication(pubId).brand_id)).values()].flat();
      for (const w of new Set(warn)) console.warn(`⚠ ${w}`);
    } catch (e) {
      console.warn(`⚠ No se pudo comparar con los diseños anteriores: ${(e as Error).message}`);
    }
  }
  console.log(`✓ ${name}: ${proposals.length} propuesta(s) · ${proposals.map((p) => `${p.direction} ${p.slides.length} diapositivas`).join(', ')}. Listo para importar (la app renderiza y valida al importar).`);
  process.exit(0);
}

if (kind === 'generate' && approved) {
  const m = missingApprovedTexts(approved, data.content.slides.map(classicSlideTexts));
  if (m.length) {
    console.error('✗ Textos aprobados que no aparecen tal cual:');
    for (const e of m) console.error(`  - ${e}`);
    process.exit(2);
  }
}
const missing = data.content.slides.flatMap((s: any) =>
  s.layout === 'product' ? [...(s.images ?? []).map((i: any) => i.src), s.image, s.productLogo].filter((p: unknown): p is string => !!p && !fs.existsSync(p as string)) : []
);
if (missing.length) {
  console.error(`✗ Imágenes inexistentes: ${missing.join(', ')}`);
  process.exit(2);
}
console.log(`✓ ${name}: ${data.content.slides.length} diapositivas, ${data.claims.length} afirmaciones registradas. Listo para importar.`);
