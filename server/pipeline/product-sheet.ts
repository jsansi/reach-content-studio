// "Completar con las fuentes": drafts a product sheet (category, description, features) from the product's
// official BTL pages and the documents attached to its sheet. The draft is never saved by itself: Jaime reviews it in
// the sheet and saves. With an API key the draft comes back at once; without one (Claude Code mode) a task package is
// written to data/tasks/ficha-<product>/ and Jaime imports its result.json, as with the other manual steps.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { PROMPTS_DIR, TASKS_DIR, abs, rel } from '../paths.ts';
import * as repo from '../repo.ts';
import { getProvider } from '../ai/provider.ts';
import { claudeCommand } from '../ai/claude-code.ts';
import { loadPrompt } from '../ai/prompts.ts';
import { ProductSheetResult } from '../../shared/product-sheet.ts';
import { productUrls, refreshProductText } from './sources.ts';
import type { Product, ProductSheetDraft } from '../../shared/types.ts';

export const sheetTaskName = (productId: string) => `ficha-${productId.replace(/[^\w-]/g, '_')}`;
const taskDir = (productId: string) => path.join(TASKS_DIR, sheetTaskName(productId));
const DOC_EXT = /\.(pdf|md|txt)$/i;

export type SheetDraftState =
  | { status: 'ready'; draft: ProductSheetDraft; provider: string }
  | { status: 'waiting'; task: string; command: string }
  | { status: 'none' };

function sources(product: Product) {
  const docs = (product.refs ?? []).filter((r) => r.kind === 'file' && r.path && DOC_EXT.test(r.path) && fs.existsSync(abs(r.path)));
  return { docs, links: productUrls(product) };
}

function buildPrompt(product: Product, excerpt: string | null, fetchWarnings: string[]) {
  const file = loadPrompt(path.join(PROMPTS_DIR, 'system', 'product-sheet.md'));
  repo.recordPromptVersion(file.id, file.version, file.sha256, file.path);
  const { docs, links } = sources(product);
  const d = product.data as { category?: string; description?: string; key_features?: string[] };
  const user = [
    `# Encargo: ficha de ${product.name}`,
    '',
    `- Producto: ${product.name} (id: ${product.id})`,
    `- Clientes: ${product.brand_ids.length ? product.brand_ids.join(', ') : 'sin asignar'}`,
    d.category || d.description || d.key_features?.length
      ? `- Lo que Jaime ya escribió en la ficha (puedes mejorarlo, pero solo con las fuentes):\n  - Categoría: ${d.category || '—'}\n  - Descripción: ${d.description || '—'}\n  - Características: ${d.key_features?.length ? d.key_features.join(' · ') : '—'}`
      : '- La ficha aún no tiene descripción ni características.',
    '',
    '## Enlaces de referencia',
    links.length ? links.map((u) => `- ${u}`).join('\n') : 'Ninguno.',
    fetchWarnings.length ? `\nAvisos al leer los enlaces:\n${fetchWarnings.map((w) => `- ${w}`).join('\n')}` : '',
    '',
    '## Texto de las páginas oficiales',
    excerpt ? `Extraído en \`${excerpt}\`:\n\n${fs.readFileSync(abs(excerpt), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^(#{1,4}) /gm, '$1## ').trim()}` : 'No hay texto de páginas oficiales.',
    '',
    '## Documentos de la ficha',
    docs.length ? docs.map((f) => `- \`${f.path}\` (${f.filename})`).join('\n') : 'Ninguno.',
    '',
    '## Entrega',
    'Devuelve el objeto JSON del esquema: `category`, `description`, `key_features`, `sources` y `warnings`. Todo en español.',
  ].filter((x) => x !== '').join('\n');
  return { system: file.body, user, versions: { [file.id]: `${file.version}@${file.sha256.slice(0, 8)}` }, docs };
}

/** Starts a draft: returns it (API mode) or writes the Claude Code task package. */
export async function draftSheet(productId: string): Promise<SheetDraftState> {
  const product = repo.getProducts([productId])[0];
  if (!product) throw new repo.BadRequest('El producto no existe.');
  if (product.source === 'catalog') throw new repo.BadRequest('Los productos del catálogo ya tienen su descripción y características en el catálogo.');
  const fetched = await refreshProductText(product, true);
  const p = buildPrompt(product, fetched.path, fetched.warnings);
  if (!fetched.path && !p.docs.length)
    throw new repo.BadRequest('No hay fuentes que leer: añade a la ficha los enlaces oficiales de BTL (por ejemplo, la página en inglés y en español) o un PDF de documentación.');

  const provider = getProvider();
  if (provider.id === 'anthropic_api') {
    const documents = p.docs.map((f) => ({ filename: f.filename ?? path.basename(f.path!), path: f.path!, mime: f.mime ?? 'application/octet-stream', size: f.size ?? 0 }));
    const r = await provider.run({ kind: 'product_sheet', jobId: 0, prompt: p, context: { documents } as never });
    if (r.type !== 'result') throw new Error('La API no devolvió la ficha.');
    return { status: 'ready', draft: r.result as unknown as ProductSheetDraft, provider: r.provider };
  }

  const dir = taskDir(productId);
  fs.rmSync(path.join(dir, 'result.json'), { force: true });
  fs.mkdirSync(dir, { recursive: true });
  const r = rel(dir);
  fs.writeFileSync(path.join(dir, 'system.md'), p.system + '\n');
  fs.writeFileSync(path.join(dir, 'brief.md'), p.user + '\n');
  fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(z.toJSONSchema(ProductSheetResult), null, 2));
  fs.writeFileSync(path.join(dir, 'prompt-versions.json'), JSON.stringify(p.versions, null, 2));
  fs.writeFileSync(
    path.join(dir, 'TASK.md'),
    `<!-- kind: product_sheet -->
# Tarea de REACH Content Studio · ${sheetTaskName(productId)}

Tipo: **completar la ficha de un producto con sus fuentes** · ${product.name}

Esta tarea la prepara la aplicación porque no hay una clave de la API de Anthropic configurada.

## Qué hacer
1. Lee \`${r}/system.md\`: son tus instrucciones.
2. Lee \`${r}/brief.md\`: el producto, sus enlaces, el texto ya extraído de sus páginas oficiales y sus documentos.
3. Puedes abrir los documentos listados en \`brief.md\` y, si hace falta, las páginas oficiales de BTL de la lista. No
   consultes otras fuentes ni inventes datos.
4. Escribe la respuesta en \`${r}/result.json\`: un único objeto JSON que cumpla \`${r}/schema.json\`.
5. Valida el resultado con \`npm run task:check -- ${sheetTaskName(productId)}\` y corrige hasta que pase.
6. No modifiques otros archivos del repositorio: la ficha no se guarda sola.

Cuando termines, Jaime pulsará **"Importar"** en la ficha de ${product.name}, revisará el texto y lo guardará.
`
  );
  return { status: 'waiting', task: r, command: claudeCommand(r) };
}

/** State of the Claude Code draft task for a product (none · waiting for result.json · ready to review). */
export function readSheetDraft(productId: string): SheetDraftState {
  const dir = taskDir(productId);
  if (!fs.existsSync(path.join(dir, 'TASK.md'))) return { status: 'none' };
  const file = path.join(dir, 'result.json');
  if (!fs.existsSync(file)) return { status: 'waiting', task: rel(dir), command: claudeCommand(rel(dir)) };
  const parsed = ProductSheetResult.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (!parsed.success) throw new repo.BadRequest(`El resultado de ${rel(dir)} no cumple el esquema: ejecuta npm run task:check -- ${sheetTaskName(productId)}.`);
  return { status: 'ready', draft: parsed.data, provider: 'claude_code' };
}
