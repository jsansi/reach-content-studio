// Renders design-system proposals (shared/design.ts) to 1080×1350 PNGs with the real BTL components
// (design-system/btl/dist), validates every slide with design-system/btl/validate.mjs and applies a few safe
// automatic corrections (stepping text down a size). Anything still failing is flagged for manual review.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium } from 'playwright';
import * as DS from '../../design-system/btl/dist/index.js';
import { CATALOG, STYLE_KEYS } from '../../design-system/btl/catalog.mjs';
import { validateSlide } from '../../design-system/btl/validate.mjs';
import { checkIllustrationSvg } from '../../design-system/btl/illustration.mjs';
import { ROOT, abs } from '../paths.ts';
import type { DesignNodeT, DesignSlideT, ProposalT } from '../../shared/design.ts';

const W = 1080;
const H = 1350;
const DS_CSS = path.join(ROOT, 'design-system/btl/dist/btl.css');
const IMAGE_PROPS = ['src'];
const CATALOG_ANY = CATALOG as Record<string, { role: 'container' | 'text' | 'leaf'; props: Record<string, string> }>;
// The package's .d.ts re-exports are extensionless (bundler style), so look components up by name.
const LIB = DS as unknown as Record<string, React.ComponentType<any>>;

export const slideFile = (i: number) => `slide-${String(i + 1).padStart(2, '0')}.png`;

// ---------- structural check (before rendering; also used by task:check) ----------
// secondary: the product's secondary color, null when it has none ("secondary" tone not allowed), undefined = not checked.
export function checkDesign(p: Pick<ProposalT, 'slides'>, allowedImages: Set<string>, expectedSlides: number, secondary?: string | null): string[] {
  const errors: string[] = [];
  if (!fs.existsSync(DS_CSS)) errors.push('El sistema de diseño no está compilado: ejecuta "npm run build:ds".');
  if (p.slides.length !== expectedSlides) errors.push(`Se esperaban ${expectedSlides} diapositivas y hay ${p.slides.length}.`);
  p.slides.forEach((s, si) => {
    const where = `Diapositiva ${si + 1}`;
    const ids = new Map(s.nodes.map((n) => [n.id, n]));
    if (ids.size !== s.nodes.length) errors.push(`${where}: hay ids de nodo repetidos.`);
    if (s.nodes.filter((n) => n.type === 'BtlLogo').length !== 1) errors.push(`${where}: debe haber exactamente un BtlLogo.`);
    for (const n of s.nodes) {
      const c = CATALOG_ANY[n.type];
      const at = `${where}, nodo ${n.id} (${n.type})`;
      if (!c) {
        errors.push(`${at}: componente desconocido.`);
        continue;
      }
      if (n.parent !== null) {
        const parent = ids.get(n.parent);
        if (!parent) errors.push(`${at}: el padre "${n.parent}" no existe.`);
        else if (CATALOG_ANY[parent.type]?.role !== 'container') errors.push(`${at}: el padre ${parent.type} no admite hijos.`);
        else if (n.type === 'Module' && parent.type !== 'ModuleGrid') errors.push(`${at}: un Module debe estar dentro de un ModuleGrid.`);
      }
      if (c.role === 'text' && !n.text?.trim()) errors.push(`${at}: falta el texto.`);
      if (c.role !== 'text' && n.text) errors.push(`${at}: este componente no lleva texto (usa sus props).`);
      let props: Record<string, unknown>;
      try {
        props = JSON.parse(n.props || '{}');
        if (!props || typeof props !== 'object' || Array.isArray(props)) throw new Error();
      } catch {
        errors.push(`${at}: props no es un objeto JSON válido.`);
        continue;
      }
      for (const k of Object.keys(props)) {
        if (k === 'style') {
          const bad = Object.keys(props.style as object).filter((x) => !STYLE_KEYS.includes(x));
          if (bad.length) errors.push(`${at}: style solo admite ${STYLE_KEYS.join(', ')} (no ${bad.join(', ')}).`);
        } else if (!(k in c.props)) errors.push(`${at}: prop no permitida "${k}".`);
      }
      if (n.type === 'Illustration') for (const e of checkIllustrationSvg(props.svg)) errors.push(`${at}: ${e}`);
      for (const k of IMAGE_PROPS) {
        const src = props[k];
        if (src === undefined) continue;
        if (typeof src !== 'string' || !allowedImages.has(src)) errors.push(`${at}: la imagen "${String(src)}" no está en la lista de activos de la publicación.`);
        else if (!fs.existsSync(abs(src))) errors.push(`${at}: no existe el archivo ${src}.`);
      }
      if ((n.type === 'ProductImage' || n.type === 'ProductLogo') && typeof props.src !== 'string') errors.push(`${at}: falta src.`);
      if (secondary === null && props.tone === 'secondary') errors.push(`${at}: el producto no tiene color secundario asignado; usa "sky", "white" o "enterprise".`);
      if (n.type === 'Curve' && (!Array.isArray(props.points) || props.points.length < 2 || props.points.length > 5 || !props.points.every((q) => Array.isArray(q) && q.length === 2 && q.every((v) => typeof v === 'number'))))
        errors.push(`${at}: points debe ser una lista de 2 a 5 puntos [x, y].`);
    }
    if (!s.nodes.some((n) => n.parent === null)) errors.push(`${where}: no tiene elementos.`);
  });
  return errors;
}

// ---------- spec → React → HTML ----------
function element(slide: DesignSlideT, n: DesignNodeT): React.ReactElement {
  const props: Record<string, unknown> = JSON.parse(n.props || '{}');
  if (typeof props.src === 'string') props.src = pathToFileURL(abs(props.src)).href;
  const Comp = LIB[n.type];
  const kids = slide.nodes.filter((c) => c.parent === n.id).map((c) => element(slide, c));
  const children = CATALOG_ANY[n.type].role === 'text' ? n.text : kids.length ? kids : undefined;
  return React.createElement(Comp, { key: n.id, ...props }, children);
}

export function slideMarkup(slide: DesignSlideT, secondary: string | null = null): string {
  const roots = slide.nodes.filter((n) => n.parent === null).map((n) => element(slide, n));
  return renderToStaticMarkup(
    React.createElement(LIB.Slide, { background: slide.background, ...(slide.lightFrom ? { lightFrom: slide.lightFrom } : {}), ...(secondary ? { secondary } : {}), alt: slide.alt }, ...roots)
  );
}

const page = (slides: DesignSlideT[], secondary: string | null) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Propuesta</title>
<link rel="stylesheet" href="${pathToFileURL(DS_CSS).href}">
<style>body{margin:0;background:#e9edf2}.s{margin:0 0 40px;width:${W}px;height:${H}px}</style></head>
<body>${slides.map((s, i) => `<div class="s" id="slide-${i + 1}">${slideMarkup(s, secondary)}</div>`).join('\n')}</body></html>`;

// ---------- issues → Spanish ----------
type Issue = { kind: string; message: string; label?: string; other?: string };
export function issueEs(i: Issue): string {
  const t = i.label ? ` («${i.label}»)` : '';
  switch (i.kind) {
    case 'min_text': return `texto menor de 30 px${t}`;
    case 'typeface': return `texto fuera de Noto Sans${t}`;
    case 'color': return `color de texto fuera de la paleta BTL${t}`;
    case 'outside': return `texto fuera del lienzo${t}`;
    case 'overflow': return `texto desbordado de su caja${t}`;
    case 'word_break': return `palabra cortada entre líneas (${i.message.match(/\("(.*)"\)/)?.[1] ?? ''})${t}`;
    case 'overlap': return `textos superpuestos («${i.label}» y «${i.other}»)`;
    case 'image': return i.message.replace('image did not load', 'imagen que no carga');
    case 'busy': return `texto sobre una zona de la foto con mucho detalle${t}`;
    case 'contrast': return `contraste insuficiente ${i.message.match(/[\d.]+:1/)?.[0] ?? ''} (mínimo ${i.message.match(/needs ([\d.]+:1)/)?.[1] ?? ''})${t}`;
    case 'logo_zone': return i.label ? `texto dentro de la zona de seguridad del logo${t}` : 'la zona de seguridad del logo no es un fondo liso';
    case 'logo':
      if (/exactly one/.test(i.message)) return 'debe haber exactamente un logo BTL';
      if (/2 U/.test(i.message)) return 'logo a menos de 2 U del borde';
      return `contraste del logo insuficiente ${i.message.match(/[\d.]+:1/)?.[0] ?? ''}`;
    case 'decor_text': return `una curva o un halo pasa por detrás del texto${t}`;
    case 'secondary_area': return `el color secundario del producto ocupa ${i.message.match(/([\d.]+)%/)?.[1] ?? ''} % de la diapositiva (máximo 10 %)`;
    case 'image_crop': return i.message.replace(/(\d+)% of an image falls outside the canvas: (.*)/, '$1 % de la imagen queda fuera del lienzo ($2)');
    default: return i.message;
  }
}

// ---------- automatic corrections ----------
const HEADLINE_STEPS = ['display', 'xl', 'l', 'm', 's'];
const BODY_STEPS = ['l', 'm', 's'];
const norm = (s: string) => s.trim().replace(/\s+/g, ' ').slice(0, 40);

// Shrinks the text node an issue points at. Returns a description of the fix, or null if nothing safe applies.
function shrink(slide: DesignSlideT, label: string): string | null {
  const n = slide.nodes.find((x) => x.text && norm(x.text) === label) ??
    slide.nodes.find((x) => { try { const p = JSON.parse(x.props); return norm(String(p.value ?? p.title ?? '')) === label; } catch { return false; } });
  if (!n) return null;
  const p = JSON.parse(n.props || '{}');
  if (n.type === 'Headline') {
    const i = HEADLINE_STEPS.indexOf(p.size ?? 'm');
    if (i < 0 || i >= HEADLINE_STEPS.length - 1) return null;
    p.size = HEADLINE_STEPS[i + 1];
  } else if (n.type === 'Body') {
    const i = BODY_STEPS.indexOf(p.size ?? 'm');
    if (i < 0 || i >= BODY_STEPS.length - 1) return null;
    p.size = BODY_STEPS[i + 1];
  } else if (n.type === 'BigNumber' || n.type === 'Stat' || n.type === 'CtaBlock') {
    const min = n.type === 'BigNumber' ? 120 : n.type === 'Stat' ? 52 : 48;
    const cur = Number(p.size ?? (n.type === 'BigNumber' ? 300 : n.type === 'Stat' ? 92 : 60));
    if (cur <= min) return null;
    p.size = Math.max(min, Math.round(cur * 0.85));
  } else return null;
  n.props = JSON.stringify(p);
  return `${n.type} «${label}» → ${p.size}`;
}

export interface RenderedProposal {
  slides: { index: number; file: string; width: number; height: number; bytes: number; rendered: boolean }[];
  issues: string[][]; // per slide, Spanish
  notes: string[];
  autofixes: string[];
  proposal: ProposalT; // possibly corrected
}

// Renders all slides (or only `only`, copying the rest from reuseFrom), validates and auto-corrects.
export async function renderProposal(p: ProposalT, outDir: string, opts: { only?: number[] | null; reuseFrom?: string | null; secondary?: string | null } = {}): Promise<RenderedProposal> {
  fs.mkdirSync(outDir, { recursive: true });
  const proposal: ProposalT = JSON.parse(JSON.stringify(p));
  const targets = opts.only ?? proposal.slides.map((_, i) => i);
  const autofixes: string[] = [];
  const browser = await chromium.launch();
  try {
    const pg = await browser.newPage({ viewport: { width: 1200, height: H + 80 }, deviceScaleFactor: 1 });
    let found: Issue[][] = [];
    let notes: Issue[][] = [];
    for (let pass = 0; pass < 4; pass++) {
      fs.writeFileSync(path.join(outDir, 'slides.html'), page(proposal.slides, opts.secondary ?? null));
      await pg.goto(pathToFileURL(path.join(outDir, 'slides.html')).href, { waitUntil: 'load' });
      await pg.evaluate(() => document.fonts.ready);
      found = [];
      notes = [];
      for (let i = 0; i < proposal.slides.length; i++) {
        if (!targets.includes(i)) {
          found.push([]);
          notes.push([]);
          continue;
        }
        const el = (await pg.$(`#slide-${i + 1} [data-btl-slide]`))!;
        const r = await validateSlide(pg, el);
        found.push(r.issues);
        notes.push(r.notes);
      }
      // Safe correction: step down the size of text that overflows, leaves the canvas or collides.
      let fixed = false;
      found.forEach((list, i) => {
        const tried = new Set<string>();
        for (const iss of list) {
          if (!['overflow', 'outside', 'overlap', 'logo_zone', 'word_break'].includes(iss.kind) || !iss.label || tried.has(iss.label)) continue;
          tried.add(iss.label);
          const f = shrink(proposal.slides[i], iss.label) ?? (iss.other ? shrink(proposal.slides[i], iss.other) : null);
          if (f) {
            autofixes.push(`Diapositiva ${i + 1}: ${f}`);
            fixed = true;
          }
        }
      });
      if (!fixed) break;
    }
    const slides = [];
    for (let i = 0; i < proposal.slides.length; i++) {
      const file = slideFile(i);
      if (targets.includes(i) || !opts.reuseFrom) {
        const el = (await pg.$(`#slide-${i + 1} [data-btl-slide]`))!;
        await el.screenshot({ path: path.join(outDir, file) });
      } else fs.copyFileSync(path.join(opts.reuseFrom, file), path.join(outDir, file));
      const buf = fs.readFileSync(path.join(outDir, file));
      slides.push({ index: i, file, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length, rendered: targets.includes(i) || !opts.reuseFrom });
    }
    for (const s of slides) if (s.width !== W || s.height !== H) found[s.index].push({ kind: 'size', message: `PNG de ${s.width}×${s.height}, se esperaba ${W}×${H}` });
    return {
      slides,
      issues: found.map((l) => [...new Set(l.map(issueEs))]),
      notes: notes.flatMap((l, i) => [...new Set(l.map(issueEs))].map((m) => `Diapositiva ${i + 1}: ${m}`)),
      autofixes,
      proposal,
    };
  } finally {
    await browser.close();
  }
}
