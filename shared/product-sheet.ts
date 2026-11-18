// Result of the "Completar con las fuentes" task: a draft of a product sheet written only from its sources.
import { z } from 'zod';

export const ProductSheetResult = z.object({
  category: z.string().nullable().describe('Product category in Spanish (e.g. "Ondas de choque focales"), or null if the sources do not say'),
  description: z.string().describe('2–4 sentences in Spanish for clinic owners and specialists: what the device is and what it lets the clinic do, only from the sources'),
  key_features: z.array(z.string()).describe('4–8 verifiable features in Spanish, one short sentence each (≤ 120 characters), each traceable to a source'),
  sources: z.array(z.string()).describe('Files and pages actually used'),
  warnings: z.array(z.string()).describe('Missing data, contradictions between sources, or anything Jaime should check (Spanish)'),
});
export type ProductSheetResultT = z.infer<typeof ProductSheetResult>;
