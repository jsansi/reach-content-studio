// Art-direction bank (prompts/system/creative-directions.md). Each round of proposals gets three directions from
// different families, preferring the ones the brand has not used recently, so rounds do not repeat the same three
// looks. The app chooses; Jaime does not have to.
import path from 'node:path';
import { PROMPTS_DIR } from '../paths.ts';
import { loadPrompt, type PromptFile } from '../ai/prompts.ts';
import { recentDesigns } from './memory.ts';

export interface Direction {
  id: string;
  name: string;
  family: string;
  body: string;
}

export const BANK_FILE = () => path.join(PROMPTS_DIR, 'system', 'creative-directions.md');

export function parseBank(prompt: Pick<PromptFile, 'body'>): Direction[] {
  return prompt.body
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [head, ...rest] = block.split('\n');
      const m = head.match(/^(\S+) · (.+)$/);
      const fam = rest.find((l) => l.startsWith('Familia:'));
      if (!m || !fam) throw new Error(`Entrada mal formada en creative-directions.md: "${head}"`);
      return { id: m[1], name: m[2].trim(), family: fam.replace('Familia:', '').trim(), body: rest.filter((l) => l !== fam).join('\n').trim() };
    });
}

export const loadBank = () => parseBank(loadPrompt(BANK_FILE()));

// Proposals made before the bank existed only stored the name of the fixed A/B/C directions.
export function directionOf(d: { directionId: string | null; directionName: string }, bank: Direction[]): string | null {
  return d.directionId ?? bank.find((x) => x.name.toLowerCase() === d.directionName.toLowerCase())?.id ?? null;
}

// Three directions from three families. Never-used directions first, then the ones used longest ago; ties are
// broken at random so two rounds with the same history still differ. At most one "libre".
export function pickDirections(bank: Direction[], usedNewestFirst: string[], random: () => number = Math.random): Direction[] {
  const lastUse = new Map<string, number>();
  usedNewestFirst.forEach((id, i) => { if (!lastUse.has(id)) lastUse.set(id, i); });
  const score = (d: Direction) => (lastUse.has(d.id) ? lastUse.get(d.id)! : Number.MAX_SAFE_INTEGER);
  const ranked = bank.map((d) => ({ d, s: score(d), r: random() })).sort((a, b) => b.s - a.s || a.r - b.r).map((x) => x.d);
  const out: Direction[] = [];
  for (const d of ranked) {
    if (out.length === 3) break;
    if (out.some((x) => x.family === d.family)) continue;
    out.push(d);
  }
  for (const d of ranked) if (out.length < 3 && !out.includes(d)) out.push(d); // a bank with fewer than three families
  return out;
}

export function chooseDirections(brandId: string, random?: () => number): Direction[] {
  const bank = loadBank();
  const used = recentDesigns(brandId, 30).map((d) => directionOf(d, bank)).filter((x): x is string => !!x);
  return pickDirections(bank, used, random);
}

export const findDirections = (ids: string[]): Direction[] => {
  const bank = loadBank();
  return ids.map((id) => bank.find((d) => d.id === id)).filter((d): d is Direction => !!d);
};
