// Result schema per AI request kind (shared by both providers and the task:check script).
import { GenerationResult, RevisionResult } from '../../shared/schema.ts';
import { DesignRevisionResult, ProposalsResult } from '../../shared/design.ts';
import { CopyResult } from '../../shared/structure.ts';

export const RESULT_SCHEMAS = {
  generate: GenerationResult,
  revise: RevisionResult,
  propose: ProposalsResult,
  design_revise: DesignRevisionResult,
  copy: CopyResult,
} as const;
export type AIKind = keyof typeof RESULT_SCHEMAS;
export const KIND_LABEL: Record<AIKind, string> = {
  generate: 'generar carrusel',
  revise: 'revisar carrusel',
  propose: 'tres propuestas creativas (sistema de diseño BTL)',
  design_revise: 'revisar una propuesta de diseño',
  copy: 'proponer textos para cada diapositiva (paso 1, Mensaje)',
};
