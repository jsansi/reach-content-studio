// Thin client for the REACH Content Studio API. All persistence happens on the server (SQLite + files).
import type { Brand, EditorialPreference, Job, Product, Publication, PublicationDetail, Settings } from '../../shared/types.ts';
import type { CarouselContentT } from '../../shared/schema.ts';
import type { ApprovedSlide, QuickBrief } from '../../shared/structure.ts';
import type { NodeEdit } from '../../shared/design-edit.ts';

async function call<T>(method: string, url: string, body?: unknown, raw?: Blob | File): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: raw ? { 'content-type': raw.type || 'application/octet-stream' } : body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Error ${res.status}`);
  return data as T;
}

export interface PublicationInput {
  brand_id: string;
  date: string;
  topic: string;
  format: string;
  objective: string;
  slide_count: number;
  creative_instructions: string;
  deadline: string | null;
  product_ids: string[];
  brief: QuickBrief | null;
}

export const api = {
  settings: () => call<Settings & { statuses: Record<string, string> }>('GET', '/api/settings'),
  brands: () => call<Brand[]>('GET', '/api/brands'),
  products: () => call<Product[]>('GET', '/api/products'),
  createProduct: (p: { name: string; category?: string; description?: string; url?: string; features?: string[] }) => call<Product>('POST', '/api/products', p),
  updateProduct: (id: string, p: { category?: string; description?: string; url?: string; features?: string[] }) => call<Product>('PUT', `/api/products/${encodeURIComponent(id)}`, p),
  publications: (q: { from: string; to: string; brand?: string; status?: string }) =>
    call<Publication[]>('GET', `/api/publications?${new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][])}`),
  publication: (id: number) => call<PublicationDetail>('GET', `/api/publications/${id}`),
  createPublication: (p: PublicationInput) => call<Publication>('POST', '/api/publications', p),
  updatePublication: (id: number, p: Partial<PublicationInput>) => call<PublicationDetail>('PATCH', `/api/publications/${id}`, p),
  deletePublication: (id: number) => call<{ ok: true }>('DELETE', `/api/publications/${id}`),
  upload: (id: number, file: File) => call<PublicationDetail>('POST', `/api/publications/${id}/attachments?name=${encodeURIComponent(file.name)}`, undefined, file),
  deleteAttachment: (id: number) => call<PublicationDetail>('DELETE', `/api/attachments/${id}`),
  generate: (id: number, discardTask = false) => call<PublicationDetail>('POST', `/api/publications/${id}/generate`, { discard_task: discardTask }),
  proposals: (id: number, discardTask = false) => call<PublicationDetail>('POST', `/api/publications/${id}/proposals`, { discard_task: discardTask }),
  copy: (id: number, r: { slide: number | null; instruction: string; save_as_preference: boolean; discard_task?: boolean }) =>
    call<PublicationDetail>('POST', `/api/publications/${id}/copy`, r),
  approveCopy: (id: number, slides: Omit<ApprovedSlide, 'role'>[]) => call<PublicationDetail>('POST', `/api/publications/${id}/copy/approve`, { slides }),
  selectVersion: (versionId: number) => call<PublicationDetail>('POST', `/api/versions/${versionId}/select`),
  designRevision: (id: number, r: { version_id: number; slide_number: number | null; instruction: string; slide_comments?: { slide: number; text: string }[]; save_as_preference: boolean; discard_task?: boolean }) =>
    call<PublicationDetail>('POST', `/api/publications/${id}/design-revisions`, r),
  // Step 3 without AI (design proposals): approve slides one by one, edit texts, bring a slide from another version.
  lockSlide: (versionId: number, slide: number, locked: boolean) => call<PublicationDetail>('POST', `/api/versions/${versionId}/locks`, { slide, locked }),
  designEdit: (versionId: number, slide: number, edits: NodeEdit[]) => call<PublicationDetail>('POST', `/api/versions/${versionId}/design-edit`, { slide, edits }),
  replaceSlide: (versionId: number, slide: number, fromVersionId: number, fromSlide: number) =>
    call<PublicationDetail>('POST', `/api/versions/${versionId}/slides/${slide}/replace`, { from_version_id: fromVersionId, from_slide: fromSlide }),
  job: (id: number) => call<Job>('GET', `/api/jobs/${id}`),
  jobCommand: (id: number) => call<{ command: string; task_dir: string }>('GET', `/api/jobs/${id}/command`),
  importJob: (id: number) => call<PublicationDetail>('POST', `/api/jobs/${id}/import`),
  discardJob: (id: number) => call<PublicationDetail>('POST', `/api/jobs/${id}/discard`),
  retryJob: (id: number) => call<PublicationDetail>('POST', `/api/jobs/${id}/retry`),
  edit: (id: number, versionId: number, content: CarouselContentT) => call<PublicationDetail>('POST', `/api/publications/${id}/edit`, { version_id: versionId, content }),
  requestChanges: (id: number, r: { target: string; slide_number: number | null; instruction: string; save_as_preference: boolean; discard_task?: boolean }) =>
    call<PublicationDetail>('POST', `/api/publications/${id}/revisions`, r),
  stories: (versionId: number) => call<PublicationDetail>('POST', `/api/versions/${versionId}/stories`),
  approve: (id: number, versionId: number) => call<PublicationDetail>('POST', `/api/publications/${id}/approve`, { version_id: versionId }),
  setStatus: (id: number, to: string) => call<PublicationDetail>('POST', `/api/publications/${id}/status`, { to }),
  preferences: () => call<EditorialPreference[]>('GET', '/api/preferences'),
  addPreference: (brand_id: string | null, text: string) => call<EditorialPreference>('POST', '/api/preferences', { brand_id, text }),
  updatePreference: (id: number, f: { active?: boolean; text?: string }) => call<EditorialPreference[]>('PATCH', `/api/preferences/${id}`, f),
  deletePreference: (id: number) => call<EditorialPreference[]>('DELETE', `/api/preferences/${id}`),
};
