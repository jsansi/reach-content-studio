// Targeted retrieval for one publication: only the selected brand, the selected products, their excerpts and
// assets, the publication's own attachments and a few references. Never the whole catalog or every PDF.
import fs from 'node:fs';
import path from 'node:path';
import { availableIcons, LAYOUTS, STYLE_PROPS } from '../../studio/engine.js';
import { ROOT, abs, rel, versionDir } from '../paths.ts';
import * as repo from '../repo.ts';
import { officialUrl, productUrls, webExcerptPath } from './sources.ts';
import { coverHeadline } from '../design/memory.ts';
import { classicSlideTexts, designSlideTexts } from '../../shared/structure.ts';
import type { Product, ProductRef, Publication } from '../../shared/types.ts';
import type { BrandRow } from '../repo.ts';

export interface AssetInfo {
  path: string;
  kind: 'product_image' | 'product_logo' | 'brand_logo' | 'upload';
  product?: string;
  width?: number;
  height?: number;
}

export interface ProductContext {
  product: Product;
  approvedClaims: string[];
  excerpt: { path: string; text: string } | null;
  documentation: string | null;
  /** Reference links of the sheet (official BTL pages are read automatically; the rest are listed). */
  links: string[];
  /** Files of the sheet that are not read automatically (Office, video, …): listed as reference material. */
  otherFiles: ProductRef[];
}

/** A document the model reads: attached to the publication, or to the sheet of one of its products. */
export interface DocumentRef {
  filename: string;
  path: string;
  mime: string;
  size: number;
  product?: string; // product id when it comes from the product sheet
}

/** A past publication Jaime picked as a reference: its chosen (or latest) version, texts and slide images. */
export interface ChosenReference {
  id: number;
  date: string;
  topic: string;
  brand: string;
  status: string;
  version: number | null;
  style: string | null; // art direction of a design version
  slides: { n: number; text: string; image: string }[];
  caption: string | null;
}

export interface GenerationContext {
  publication: Publication;
  brand: BrandRow;
  guideline: { path: string; summaryPath: string; text: string };
  editorialPrompt: string;
  products: ProductContext[];
  assets: AssetInfo[];
  documents: DocumentRef[];
  references: { exemplar: { path: string; json: string } | null; folders: string[]; recent: string[]; chosen: ChosenReference[] };
  preferences: string[];
  icons: string[];
  layouts: string[];
  styleProps: string[];
  sources: string[];
  missing: { blocking: string[]; warnings: string[] };
}

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;
const DOC_EXT = /\.(pdf|md|txt)$/i;
const sheetFiles = (product: Product) => (product.refs ?? []).filter((r) => r.kind === 'file' && r.path && fs.existsSync(abs(r.path)));
const EXEMPLAR = 'content/spinal-decompression/dia-mundial-columna-2026.json';

// Pixel size from the file header (PNG and JPEG), so the model can place images without guessing.
export function imageSize(file: string): { width: number; height: number } | undefined {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return undefined;
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return undefined;
}

const walk = (dir: string): string[] =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]))
    : [];

export const loadBrief = (publicationId: number) => repo.getPublication(publicationId);

export function loadBrand(pub: Publication) {
  const brand = repo.getBrand(pub.brand_id);
  return {
    brand,
    guideline: { path: brand.guideline_path, summaryPath: brand.guideline_summary, text: fs.readFileSync(abs(brand.guideline_summary), 'utf8') },
    editorialPrompt: brand.editorial_prompt,
  };
}

export function loadProducts(pub: Publication): { products: ProductContext[]; warnings: string[]; blocking: string[] } {
  const warnings: string[] = [];
  const blocking: string[] = [];
  const docs = repo.listAttachments(pub.id).filter((a) => a.kind === 'document');
  const products = repo.getProducts(pub.product_ids).map((product) => {
    const d = product.data as any;
    const approvedClaims: string[] = Array.isArray(d.approved_claims) ? d.approved_claims : [];
    // Documentation excerpt: the curated one in knowledge/, else the text of the official web page (sources.ts).
    const excerptPath = `knowledge/products/${product.id}.md`;
    const webPath = webExcerptPath(product.id);
    const excerpt = fs.existsSync(abs(excerptPath)) ? { path: excerptPath, text: fs.readFileSync(abs(excerptPath), 'utf8') }
      : fs.existsSync(webPath) ? { path: rel(webPath), text: fs.readFileSync(webPath, 'utf8') } : null;
    const documentation = d.documentation && fs.existsSync(abs(d.documentation)) ? d.documentation : null;
    if (product.review_status === 'pending_review')
      warnings.push(`${product.name} está pendiente de revisión: se usará solo la información que registraste, sin afirmaciones técnicas.`);
    if (!approvedClaims.length) warnings.push(`${product.name} no tiene afirmaciones aprobadas (approved_claims vacío): ninguna frase se tratará como afirmación clínica aprobada.`);
    const files = sheetFiles(product);
    const sheetDocs = files.filter((f) => DOC_EXT.test(f.path!));
    const hasInfo = d.description || (d.key_features?.length ?? 0) > 0 || (d.indications?.length ?? 0) > 0 || excerpt || docs.length > 0 || sheetDocs.length > 0;
    if (!hasInfo) blocking.push(`Falta información de ${product.name}: pulsa "Ficha" junto al producto (en Brief) y añade una descripción, sus enlaces oficiales o su documentación (PDF), o adjunta el PDF en Archivos de la publicación.`);
    if (!d.description && !(d.key_features?.length) && !excerpt && (docs.length || sheetDocs.length))
      warnings.push(`${product.name} no tiene descripción: la información saldrá solo de los documentos (${[...sheetDocs.map((x) => x.filename), ...docs.map((x) => x.filename)].join(', ')}).`);
    if (!excerpt && documentation) warnings.push(`La documentación de ${product.name} (${documentation}) no tiene extracto de texto; solo se usará el catálogo.`);
    const links = productUrls(product);
    const otherFiles = files.filter((f) => !DOC_EXT.test(f.path!) && !IMAGE_EXT.test(f.path!));
    return { product, approvedClaims, excerpt, documentation, links, otherFiles };
  });
  return { products, warnings, blocking };
}

export function loadAssets(pub: Publication, products: ProductContext[]): { assets: AssetInfo[]; documents: DocumentRef[]; blocking: string[] } {
  const assets: AssetInfo[] = [];
  const blocking: string[] = [];
  const attachments = repo.listAttachments(pub.id).map((a) => repo.getAttachment(a.id));
  const uploads = attachments.filter((a) => a.kind === 'image');
  for (const { product } of products) {
    const dir = (product.data as any).assets_path as string | null;
    const files = dir ? walk(abs(dir)).filter((f) => IMAGE_EXT.test(f)) : [];
    for (const f of files)
      assets.push({ path: rel(f), kind: /\/logo\//.test(rel(f)) ? 'product_logo' : 'product_image', product: product.id, ...imageSize(f) });
    // Images attached to the product sheet count as official images; a file named "…logo…" is the product logo.
    const sheetImages = sheetFiles(product).filter((r) => IMAGE_EXT.test(r.path!));
    for (const r of sheetImages)
      assets.push({ path: r.path!, kind: /logo/i.test(r.filename ?? r.path!) ? 'product_logo' : 'product_image', product: product.id, ...imageSize(abs(r.path!)) });
    const hasPhoto = files.some((f) => !/\/logo\//.test(rel(f))) || sheetImages.some((r) => !/logo/i.test(r.filename ?? r.path!));
    if (!hasPhoto && !uploads.length)
      blocking.push(`Faltan imágenes oficiales de ${product.name}: no se encontraron en su página oficial ni en los PDF adjuntos. Adjunta al menos una imagen del equipo (PNG, JPG o WEBP) en la ficha del producto o en Archivos de la publicación, o añade su página oficial de BTL en la ficha.`);
  }
  for (const u of uploads) assets.push({ path: u.path, kind: 'upload', ...imageSize(abs(u.path)) });
  assets.push({ path: 'public/assets/brands/btl/logo/btl-logo.svg', kind: 'brand_logo' });
  const documents: DocumentRef[] = [
    ...products.flatMap(({ product }) => sheetFiles(product).filter((r) => DOC_EXT.test(r.path!))
      .map((r) => ({ filename: r.filename ?? path.basename(r.path!), path: r.path!, mime: r.mime ?? 'application/octet-stream', size: r.size ?? 0, product: product.id }))),
    ...attachments.filter((a) => a.kind === 'document').map((a) => ({ filename: a.filename, path: a.path, mime: a.mime, size: a.size })),
  ];
  return { assets, documents, blocking };
}

export function loadReferences(pub: Publication) {
  const refDir = path.join(ROOT, 'public/assets/brands/btl/references');
  const folders = fs.existsSync(refDir) ? fs.readdirSync(refDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  const recent = repo
    .listPublications({ brand: pub.brand_id })
    .filter((p) => p.id !== pub.id && p.current_version_id)
    .slice(-5)
    .map((p) => {
      const v = repo.getVersion(p.current_version_id!);
      const cover = v.design ? coverHeadline(v.design) : String((v.content.slides[0] as any)?.title ?? '').replace(/\n/g, ' ');
      return `${p.date} · ${p.topic} · portada: "${cover}"`;
    });
  const exemplar = fs.existsSync(abs(EXEMPLAR)) ? { path: EXEMPLAR, json: fs.readFileSync(abs(EXEMPLAR), 'utf8') } : null;
  const brands = Object.fromEntries(repo.listBrands().map((b) => [b.id, b.name]));
  const chosen: ChosenReference[] = (pub.reference_ids ?? []).flatMap((id) => {
    let ref: Publication;
    try {
      ref = repo.getPublication(id);
    } catch {
      return []; // deleted since it was picked
    }
    const versions = repo.listVersions(id);
    const v = versions.find((x) => x.id === ref.current_version_id) ?? versions[0];
    const dir = v ? versionDir(ref.id, v.number) : null;
    const slides = v
      ? v.slides.map((s, i) => ({
          n: i + 1,
          text: (v.design ? designSlideTexts(v.design.slides[i] ?? { nodes: [] }) : classicSlideTexts(v.content.slides[i])).replace(/\s*\n\s*/g, ' / ').slice(0, 400),
          image: rel(path.join(dir!, s.file)),
        }))
      : [];
    return [{ id: ref.id, date: ref.date, topic: ref.topic, brand: brands[ref.brand_id] ?? ref.brand_id, status: ref.status, version: v?.number ?? null, style: v?.design?.direction_name ?? null, slides, caption: v?.caption ?? null }];
  });
  return { exemplar, folders, recent, chosen };
}

export function buildContext(publicationId: number): GenerationContext {
  const publication = loadBrief(publicationId);
  const { brand, guideline, editorialPrompt } = loadBrand(publication);
  const p = loadProducts(publication);
  const a = loadAssets(publication, p.products);
  const references = loadReferences(publication);
  const sources = [
    guideline.path,
    'knowledge/products/btl_products.json',
    ...p.products.flatMap((x) => [x.excerpt?.path, x.documentation, ...x.links.map((u) => officialUrl(u)?.href)].filter(Boolean) as string[]),
    ...a.documents.map((d) => d.path),
  ];
  return {
    publication, brand, guideline, editorialPrompt, products: p.products, assets: a.assets, documents: a.documents, references,
    preferences: repo.activePreferences(publication.brand_id),
    icons: availableIcons(), layouts: LAYOUTS, styleProps: [...STYLE_PROPS],
    sources: [...new Set(sources)],
    missing: { blocking: [...p.blocking, ...a.blocking], warnings: p.warnings },
  };
}
