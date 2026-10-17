// Visual memory of past creative proposals, so a new round can avoid repeating them. Every design version is
// summarised from its node list (no AI): background and key components per slide plus the cover headline.
// The summaries go into the brief ("Diseños anteriores") and drive the similarity warnings after import.
import * as repo from '../repo.ts';
import type { DesignContentT, DesignSlideT } from '../../shared/design.ts';

// Layout and text components say little about the visual structure; the rest (images, illustrations, decor,
// data components) is what makes two proposals look alike.
const STRUCTURAL = new Set(['Region', 'Stack', 'Module', 'Headline', 'Body', 'Eyebrow', 'Footnote', 'BtlLogo', 'SwipeCue', 'DatePill', 'DateLine', 'CtaBlock']);

export interface SlideSignature {
  background: string;
  parts: string[];
}

export interface PastDesign {
  versionId: number;
  publicationId: number;
  label: string;
  directionId: string | null;
  directionName: string;
  signature: SlideSignature[];
  description: string;
}

export function slideSignature(s: DesignSlideT): SlideSignature {
  const parts = s.nodes.filter((n) => !STRUCTURAL.has(n.type)).map((n) => n.type);
  const logo = s.nodes.find((n) => n.type === 'BtlLogo');
  const placement = logo ? (JSON.parse(logo.props || '{}').placement ?? 'top-right') : 'none';
  return { background: s.background, parts: [...new Set(parts), `logo:${placement}`] };
}

export const designSignature = (d: Pick<DesignContentT, 'slides'>) => d.slides.map(slideSignature);

export function coverHeadline(d: Pick<DesignContentT, 'slides'>): string {
  const h = d.slides[0]?.nodes.find((n) => n.type === 'Headline' && n.text);
  return (h?.text ?? '').replace(/\s*\n\s*/g, ' ').trim();
}

// 0–1: same background counts 0.3, the shared key components (Jaccard) 0.7, averaged over the slides.
export function similarity(a: SlideSignature[], b: SlideSignature[]): number {
  const n = Math.max(a.length, b.length);
  if (!n) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i], y = b[i];
    if (!x || !y) continue;
    const sx = new Set(x.parts), sy = new Set(y.parts);
    const inter = [...sx].filter((p) => sy.has(p)).length;
    const union = new Set([...sx, ...sy]).size;
    sum += (x.background === y.background ? 0.3 : 0) + 0.7 * (union ? inter / union : 1);
  }
  return sum / n;
}

export function describeDesign(d: Pick<DesignContentT, 'slides'>): string {
  const slides = designSignature(d).map((s, i) => `diap. ${i + 1} ${s.background}: ${s.parts.filter((p) => !p.startsWith('logo:')).join(', ') || 'solo texto'}`);
  const hook = coverHeadline(d);
  return `${slides.join(' · ')}${hook ? ` · gancho: «${hook}»` : ''}`;
}

// The brand's latest proposals (first round of each set, newest first), including earlier rounds of this publication.
export function recentDesigns(brandId: string, limit = 9): PastDesign[] {
  const pubs = repo.listPublications({ brand: brandId });
  const out: (PastDesign & { created: string })[] = [];
  for (const p of pubs)
    for (const v of repo.listVersions(p.id))
      if (v.kind === 'design' && v.design && v.origin === 'proposal')
        out.push({
          versionId: v.id, publicationId: p.id, created: v.created_at,
          label: `${p.date} · ${p.topic} · v${v.number} · ${v.design.direction_name}`,
          directionId: v.design.direction_id ?? null, directionName: v.design.direction_name,
          signature: designSignature(v.design), description: describeDesign(v.design),
        });
  return out.sort((a, b) => b.created.localeCompare(a.created) || b.versionId - a.versionId).slice(0, limit).map(({ created, ...d }) => d);
}

// Warnings for proposals that repeat a past design or each other (threshold tuned for 3-slide carousels).
export const SIMILAR = 0.8;
export function repetitionWarnings(proposals: { direction: string; slides: DesignSlideT[] }[], past: PastDesign[]): Map<string, string[]> {
  const out = new Map(proposals.map((p) => [p.direction, [] as string[]]));
  const sigs = proposals.map((p) => ({ dir: p.direction, sig: designSignature(p) }));
  for (const { dir, sig } of sigs) {
    const worst = past.map((d) => ({ d, s: similarity(sig, d.signature) })).sort((a, b) => b.s - a.s)[0];
    if (worst && worst.s >= SIMILAR)
      out.get(dir)!.push(`Diseño repetido: la propuesta ${dir} se parece en un ${Math.round(worst.s * 100)} % a una anterior (${worst.d.label}). Pide cambios o vuelve a generar las propuestas.`);
    for (const o of sigs)
      if (o.dir > dir && similarity(sig, o.sig) >= SIMILAR)
        for (const k of [dir, o.dir]) out.get(k)!.push(`Las propuestas ${dir} y ${o.dir} comparten casi la misma estructura (${Math.round(similarity(sig, o.sig) * 100)} %).`);
  }
  return out;
}
