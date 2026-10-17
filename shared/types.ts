// Types and labels shared by the API server and the web app.
import type { CarouselContentT, ClaimT } from './schema.ts';
import type { DesignContentT } from './design.ts';
import type { ApprovedCopy, QuickBrief, StoredCopyOption } from './structure.ts';

export const STATUSES = ['planned', 'generating', 'ready_for_review', 'changes_requested', 'approved', 'scheduled', 'published'] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  planned: 'Planificada',
  generating: 'Generando',
  ready_for_review: 'Lista para revisión',
  changes_requested: 'Cambios solicitados',
  approved: 'Aprobada',
  scheduled: 'Programada',
  published: 'Publicada',
};

// Manual transitions Jaime can trigger from the UI. "approved" has its own endpoint (explicit approval of a version);
// "generating" and "ready_for_review" are set only by jobs.
export const MANUAL_TRANSITIONS: Partial<Record<Status, Status[]>> = {
  approved: ['scheduled', 'published', 'ready_for_review'],
  scheduled: ['published', 'approved'],
  published: ['scheduled'],
};

export const FORMATS = { carousel: 'Carrusel', single_image: 'Imagen única', story: 'Historia', reel: 'Reel' } as const;
export type Format = keyof typeof FORMATS;
export const GENERATABLE_FORMATS: Format[] = ['carousel', 'single_image'];

export const OBJECTIVES = [
  'Generar solicitudes de demo',
  'Reconocimiento de marca',
  'Educar a la audiencia',
  'Lanzamiento o presentación de producto',
  'Fecha conmemorativa',
  'Interacción con la comunidad',
];

export const REVISION_TARGETS = {
  carousel: 'Todo el carrusel',
  slide: 'Una diapositiva',
  headline: 'Titular',
  supporting_text: 'Texto de apoyo',
  product_image: 'Imagen del producto',
  layout: 'Layout',
  hierarchy: 'Jerarquía visual',
  cta: 'CTA',
  caption: 'Caption',
} as const;
export type RevisionTarget = keyof typeof REVISION_TARGETS;

export type JobKind = 'generate' | 'import' | 'revise' | 'edit' | 'propose' | 'design_revise' | 'design_edit' | 'story' | 'copy';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type StageStatus = 'pending' | 'running' | 'done' | 'skipped' | 'waiting' | 'failed';
export interface Stage {
  key: string;
  label: string;
  status: StageStatus;
  detail?: string;
}

export interface Brand {
  id: string;
  name: string;
  signature: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  category: string | null;
  source: 'catalog' | 'user';
  review_status: 'catalog' | 'pending_review' | 'approved';
  data: Record<string, unknown>;
  created_at: string;
}

export interface Attachment {
  id: number;
  publication_id: number;
  kind: 'document' | 'image';
  filename: string;
  path: string;
  size: number;
  created_at: string;
}

export interface Publication {
  id: number;
  brand_id: string;
  date: string;
  topic: string;
  format: Format;
  objective: string;
  slide_count: number;
  creative_instructions: string;
  deadline: string | null;
  status: Status;
  current_version_id: number | null;
  product_ids: string[];
  brief: QuickBrief | null; // short brief (audience, angle, tone, what to avoid); null on publications made before it
  approved_copy: ApprovedCopy | null; // step 1 "Mensaje": the texts approved for every slide
  created_at: string;
  updated_at: string;
}

export interface SlideFile {
  index: number;
  file: string;
  width: number;
  height: number;
  bytes: number;
  rendered: boolean; // false = copied unchanged from the previous version
}

export interface Validation {
  status: 'passed' | 'warnings' | 'not_run';
  problems: string[];
  notes: string[];
  // Design-system proposals only: visual checks per slide, automatic corrections applied, and the separate
  // claim / brand-copy verification (kept apart from the geometric checks).
  design?: { status: 'passed' | 'needs_review'; slides: string[][]; autofixes: string[] };
  claim_checks?: { problems: string[]; notes: string[] };
}

export interface Version {
  id: number;
  publication_id: number;
  number: number;
  // 'carousel': studio/engine.js layouts (content). 'design': design-system proposal (design; content is a stub
  // with alt texts and caption so generic viewers keep working).
  kind: 'carousel' | 'design';
  design: DesignContentT | null;
  direction: 'A' | 'B' | 'C' | null;
  proposal_set: number | null; // id of the job that produced the set of three proposals
  proposal_status: 'proposed' | 'selected' | 'not_selected' | null;
  origin: 'import' | 'generation' | 'manual_edit' | 'revision' | 'proposal';
  provider: string;
  content: CarouselContentT;
  caption: string;
  slides: SlideFile[];
  validation: Validation;
  sources: string[];
  claims: ClaimT[];
  concept: string | null;
  prompt_versions: Record<string, string> | null;
  parent_version_id: number | null;
  job_id: number | null;
  notes: string | null;
  dir: string; // URL prefix where the files are served, e.g. /media/pub-1/v01
  created_at: string;
  // Story (9:16) versions, rendered when the version is approved; files under `${dir}/historias/`.
  story: StoryRender | null;
}

export interface StoryRender {
  slides: { index: number; file: string; width: number; height: number; bytes: number }[];
  problems: string[]; // Spanish, per slide
  created_at: string;
}

export interface Job {
  id: number;
  publication_id: number;
  kind: JobKind;
  status: JobStatus;
  stages: Stage[];
  error: string | null;
  outcome: 'version' | 'copy' | 'task_package' | 'discarded' | null;
  task_dir: string | null;
  task_ready: boolean; // result.json present in the task package
  provider: string;
  revision_id: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface RevisionRequest {
  id: number;
  publication_id: number;
  version_id: number | null;
  target: RevisionTarget;
  slide_number: number | null;
  instruction: string;
  status: 'open' | 'in_progress' | 'awaiting_claude_code' | 'applied' | 'failed';
  result_version_id: number | null;
  created_at: string;
}

export interface HistoryEvent {
  id: number;
  publication_id: number;
  version_id: number | null;
  action: string;
  from_status: Status | null;
  to_status: Status | null;
  note: string | null;
  created_at: string;
}

export interface EditorialPreference {
  id: number;
  brand_id: string | null;
  text: string;
  active: boolean;
  created_at: string;
}

export interface PublicationDetail {
  publication: Publication;
  brand: Brand;
  products: Product[];
  attachments: Attachment[];
  versions: Version[];
  jobs: Job[];
  revisions: RevisionRequest[];
  history: HistoryEvent[];
  copy_options: StoredCopyOption[]; // step 1: every text option proposed, newest first
}

export interface Settings {
  ai_mode: 'anthropic_api' | 'claude_code';
  model: string | null;
  data_dir: string;
}
