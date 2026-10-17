# REACH Content Studio

Internal, local-first app of the REACH agency (El Salvador) to plan, generate, review, revise and export social
media carousels for two clients: **BTL Medical El Salvador** and **BTL Estética El Salvador**. Primary user: Jaime,
social media manager, who works only through the web UI (Spanish) — no prompts, no code.

Progress, decisions and pending work: `docs/PROGRESS.md`.

## Commands

```
npm install && npx playwright install chromium   # once
npm start            # build the web app + serve everything at http://localhost:4600
npm run dev          # API on :4600 (auto-restart) + Vite on :5173 (hot reload)
npm test             # unit + integration tests (~5 s, renders with Playwright)
npm run typecheck    # tsc over server, shared, web, scripts
npm run render -- content/spinal-decompression/dia-mundial-columna-2026.json   # original POC CLI
npm run build:ds     # build design-system/btl (needed to render creative proposals; part of npm run build)
npm run check:ds     # validate every design-system preview with design-system/btl/validate.mjs
npm run tasks:list   # Claude Code task packages without result.json
npm run task:check -- job-N                      # validate a task's result.json against the schema
npm run task:preview -- job-N                    # design tasks: render result.json to data/tasks/job-N/preview/ + validator notes
```

Node ≥ 24 is required: the server is TypeScript run directly with Node's type stripping (no build step), and it
uses the built-in `node:sqlite` and `zlib.crc32`. Consequences: imports need the `.ts` extension, and only
erasable TS syntax is allowed (no enums, no constructor parameter properties).

## Architecture

```
web/            React + TypeScript UI (Vite). Hash routes: #/ calendar, #/p/:id publication, #/preferencias
server/         Node HTTP API (no framework)
  index.ts        routes, static files, downloads (PNG, ZIP)
  db.ts           SQLite schema + migrations (PRAGMA user_version)
  repo.ts         data access (rows → shared types)
  seed.ts         brands, catalog sync, default preferences, POC import
  pipeline/       context.ts (targeted retrieval) · jobs.ts (job queue + stages) · validate.ts
  ai/             provider.ts (interface) · anthropic.ts · claude-code.ts (task packages) · prompts.ts (loader)
  zip.ts          minimal ZIP writer
shared/         schema.ts (zod carousel/result schema) · types.ts (statuses, labels, DTOs)
studio/         carousel renderer — engine.js (shared), render.js (POC CLI), layouts.js, brands/btl.js
prompts/        version-controlled prompts: system/*.md (general) and brands/*.md (per-brand editorial)
knowledge/      brand guideline + product catalog/PDFs + text excerpts used for retrieval
public/assets/  logos, product images, fonts, icons, visual references
content/, output/  POC inputs and outputs (keep; output/spinal-decompression is the source of V1)
data/           (committed so the calendar travels between computers; WAL/SHM files and task previews ignored) studio.db, media/pub-N/vNN/, uploads/pub-N/, tasks/job-N/
```

Layers stay separate: UI → HTTP API → repo (SQLite) / pipeline → AI provider interface / renderer. The pipeline
never imports a vendor SDK; only `server/ai/anthropic.ts` does.

## Carousel generation pipeline (server/pipeline/jobs.ts)

Stages recorded per job (real stages, no invented percentages): brief → brand → brand guideline → product →
product documentation → official images/logos → editorial references → **content (AI)** → layouts → render →
validate → persist.

- **Targeted retrieval** (`context.ts`): only the selected brand, the selected products (catalog record +
  `knowledge/products/<id>.md` excerpt), their asset folders, the publication's own attachments, one approved
  exemplar and the last 5 publications of the brand. Never the whole catalog or all PDFs.
- **Official sources** (`sources.ts`, stage "Fuentes oficiales"): the product's BTL page (its `url`, or a link in its
  description; BTL domains only) → visible text cached 7 days in `data/web/<product>.md` (used as the documentation
  excerpt when `knowledge/products/<id>.md` is missing) and, for products without an official image folder, its large
  photos added once per publication as `web-…` attachments. If the publication still has no image, photos inside its
  PDFs are extracted (page captures are cut into photo blocks) as `pdf-…` attachments. Jaime can delete any of them.
  `REACH_OFFLINE=1` disables web requests (tests).
- **Missing essentials stop the job** with an actionable Spanish message (e.g. product without official images
  and no uploaded image; product with no information). Jaime adds files and clicks Reintentar.
- **Render**: `studio/engine.js` (`renderCarousel`) → 1080×1350 PNGs + checks (overflow, overlaps, logo safe zone,
  text < 30 px, text clipped at the canvas edge, PNG size). Revisions/edits pass `only` + `reuseFrom` so unchanged
  slides are copied from the previous version, not re-rendered.
- **Validate** (`validate.ts`): renderer problems translated to Spanish + brand naming, claim approval and
  preference checks. A version is saved even with problems (status `warnings`) so Jaime can see and fix them.
- **Persist**: only the last stage inserts a version; a failed job never alters existing versions.
- Job kinds: `generate`, `revise` (AI change request), `import` (Claude Code result), `edit` (direct text edit,
  no AI), `propose` (three design-system proposals A/B/C), `design_revise` (change one proposal or regenerate one
  slide), `design_edit` (step 3 without AI: edit texts of one slide, or bring a slide from another version), `copy`
  (step 1 text options) and `story`. One active job per publication (409 otherwise); jobs interrupted by a server stop are marked failed.

## Three-step process (step 1 "Mensaje" before the visual proposals)

Every carousel follows a **fixed structure** (`shared/structure.ts` → `narrative()`): with a product, 1 hook · 2 equipo
(middle slides of a longer carousel) · last ventajas para la clínica + "Solicita tu demo"; without a product, hook ·
desarrollo · cierre; a single image is one `pieza`. The brief always includes it ("Estructura del carrusel"), so Jaime
never has to explain it. Publications also carry a short brief (`publications.brief_json`: audience, main advantage
for the clinic = the angle, tone, what to avoid; migration 4).
1. **Mensaje** (`copy` job, prompt `copy-options`): text-only options per slide (8 hooks, 4 for the others; or more for
   one slide with Jaime's comment, optionally saved as a preference) → table `copy_options`. Jaime picks/edits one per
   slide and approves (`POST /api/publications/:id/copy/approve` → `publications.approved_copy_json`). A copy job
   creates no version and restores the status. Changing format or slide count clears the approved texts.
2. **Estilo**: `propose` / `generate` are enabled in the UI only after approval; the brief lists "Textos aprobados" and
   the package has `approved-copy.json`. `task:check` blocks a result whose slides don't contain every approved text
   (`missingApprovedTexts`: case, line breaks, `**` and a final period are ignored; alt texts don't count); on import
   a mismatch is a "Texto aprobado modificado" note.
3. **Ajustes** on the chosen (current) design proposal, in the viewer (`CarouselViewer` `actions`):
   - **Aprobar diapositiva** (`POST /api/versions/:id/locks`) → `design.locked_slides`; inherited by every derived version.
     Revisions restore locked slides from the base (warning "está aprobada; se mantuvo sin cambios"), the task package
     has `fixed-slides.json` and `task:check` blocks a result that changes them.
   - **Ajustar textos** without AI (`SlideEditor.tsx`, `POST /api/versions/:id/design-edit`, `shared/design-edit.ts`): text,
     weight, size step and tone (strong/base/accent) of Headline/Body/Eyebrow/Footnote/DatePill/SwipeCue and the CTA title.
   - **Traer de otra versión**: drag a slide from any design version of the publication onto a slide (or pick + "Usar
     aquí") → `POST /api/versions/:id/slides/:n/replace`; the slide's claims travel with it.
   - **Comentar** per slide (`DesignChanges.tsx`): general comment + one per slide; with only per-slide comments, the
     other slides are fixed (`slides_allowed` in the job input). Prompt design-revision 1.1.0.
   Each adjustment is a `design_edit` job: new version (origin `manual_edit`, provider `manual`), only that slide re-rendered.

## Creative proposals (design system)

`propose` / `design_revise` produce `kind: 'design'` versions: each slide is a flat node list of
`design-system/btl` primitives (`shared/design.ts`, allowed props in `design-system/btl/catalog.mjs`), rendered by
`server/design/render.ts` with the real components and checked by `design-system/btl/validate.mjs` (auto-fix by
stepping text down; otherwise flagged "Revisión manual"). Claim/brand checks are stored apart from visual checks.
Proposals are never auto-chosen (`POST /api/versions/:id/select`); revising an unchosen proposal doesn't choose it.
**Variety**: the three art directions are not fixed. `server/design/directions.ts` picks three from the bank in
`prompts/system/creative-directions.md` (different families, least recently used by the brand, random ties, at most one
`libre`) and stores their ids in the job input; slot A/B/C keeps its `direction_id` in the stored design.
`server/design/memory.ts` summarises past proposals (background + key components per slide + cover hook); the brief
lists the brand's latest ones under "Diseños anteriores", and proposals ≥ 80 % similar to one of them (or to each
other) get a "Diseño repetido" warning. The model lists 6–8 `concepts_explored` before composing (task:check requires it).
Claude Design cannot be called from the app (design-sync only syncs the design-system files).
Topic illustrations are part of every proposal (prompt `design-proposals` ≥ 1.4.0): a built-in one (spine, bone), one
from the library, or a new `Illustration` (inner SVG drawn by the model; `design-system/btl/illustration.mjs` allows
shapes and brand colours only — no text, images, links or scripts; ids are scoped per instance). Approving a design
version saves its illustrations to `data/illustrations/<slug>.json` (`server/design/library.ts`); the brief lists them
in "Ilustraciones disponibles" for reuse.
Decor for light and continuity: `Halo`, `Curve` (points may lie outside the canvas so a line continues on the next
slide: shift x by 1080 per slide), `LightBand` (a surface; text may sit on it) and `ProductImage` `fade` (CSS mask;
the file is untouched). The validator flags a curve/halo behind text (`decor_text`). Product secondary colors
(BTL Social Media Guideline pp. 7–8) live in `SECONDARY_COLORS` in `catalog.mjs`; the renderer passes the color to
`Slide` only when the publication's product has one (EMFEMME 360 has none), and the validator measures ≤ 10 %
(`secondary_area`). The model never sets colors directly. No generative image model is used: every visual is code
(HTML/CSS/SVG) rendered to PNG, plus official photos.

## AI integration

`getProvider()` picks the mode: `REACH_AI_MODE`, else `anthropic_api` if `ANTHROPIC_API_KEY` is set, else
`claude_code`.

- **anthropic_api**: `client.beta.messages.parse` with `betaZodOutputFormat(GenerationResult|RevisionResult)`,
  model `ANTHROPIC_MODEL` (default `claude-opus-5-5`), adaptive thinking, effort `high`, server-side
  `fallbacks: 'default'`. PDFs attached to the publication (≤ 8 MB) go as document blocks.
- **claude_code** (no key): the content step writes `data/tasks/job-N/` (TASK.md, system.md, brief.md,
  schema.json, prompt-versions.json). This is a **manual step** shown as such in the UI ("Paso manual
  pendiente"). Never simulate an AI answer or claim autonomous generation in this mode.

**When asked to run a REACH task** (e.g. "Ejecuta la tarea … data/tasks/job-N/TASK.md" or "procesa las tareas
pendientes"): run `npm run tasks:list`, then for each task read TASK.md, system.md and brief.md, write
`result.json` that matches schema.json using only the sources listed (design tasks: only images in assets.json),
run `npm run task:check -- job-N` until it passes, and do not edit other files or store images in versions. For
design tasks, check the rendered result with `npm run task:preview -- job-N` (Jaime usually asks to verify it visually)
and fix what it flags before finishing. Jaime then clicks
"Importar resultado". For proposal tasks, compose from scratch with the directions assigned in brief.md: never copy or
adapt another task's result.json or a stored version (even of the same publication), and treat task:check's
"Diseño repetido" warnings as something to fix.

Prompts: `prompts/system/*.md` (creative-direction, carousel-content, caption, brand-compliance,
claim-verification, carousel-revision, copy-options) + `prompts/brands/<brand>.md`. Each has front matter `id`, `version`,
`purpose`. Bump `version` when changing a prompt; every version stores `prompt_versions` (`id → version@sha8`).

## Brand compliance & editorial rules (must hold for any generated content)

- In published copy the brand is **"BTL El Salvador"** for both clients. "BTL Medical/Estética El Salvador" are
  internal client names in REACH only.
- CTA "Solicita tu demo"; demos requested by DM with the word "DEMO". Numbers as "+100". Benefits for the
  clinic over technical specs. Captions ≈ 500 characters with ~5 hashtags.
- Min. 30 px text on the 1080 canvas (incl. "Desliza…"); regular weight for small text.
- BTL Corporate Identity v2.3 (summary: `knowledge/brand-guidelines/btl-corporate-identity.md`): logo safe
  zone 1 U, 2 U from edges, left-aligned sentence case, Noto Sans, Material Symbols Sharp weight 100 icons.
- **Claims**: `approved_claims` empty/missing ⇒ nothing is a formally approved clinical claim. Every
  technical/medical claim is stored with its source and approval level. Never fabricate equipment, features,
  outcomes, testimonials, contacts. Spinal Decompression treats lumbar **and** cervical zones.
- Reusable rules live in the `editorial_preferences` table (UI: Preferencias), separate from per-post comments.
- The app's own UI uses the REACH identity (`REACH_Manual_de_Marca.pdf`: Sora/Inter, #102630, #A6F1D9,
  #F5F5F0, #178F79, #83979C). Never mix it with BTL branding in slides.

## Data & storage

SQLite tables: brands, products (catalog synced from `btl_products.json` + user-created `pending_review`),
publications (+ brief_json, approved_copy_json), copy_options, publication_products, attachments, jobs, versions, source_refs (sources + claims per version),
prompt_versions, revision_requests, history (status changes, approvals), editorial_preferences, meta.
Files: `data/media/pub-<id>/v<NN>/slide-0N.png` (+ content.json, caption.txt, slides.html, textos.md).
Paths in the DB are repo-relative. The browser never stores source-of-truth data (sessionStorage only keeps
the calendar month/filters). For a future cloud move: swap `db.ts`/`repo.ts` for a hosted DB and `paths.ts`
media/uploads for object storage; the API contract stays.

## Stories (9:16)

Approving a version enqueues a `story` job (it never changes the publication status): `studio/story.js` takes the
version's rendered `slides.html` (classic or design) and re-lays each slide out on 1080 × 1920 — text and logo keep
their size and move into the story safe band (250 px top and bottom), blocks are spread over the band, photos/bands/decor
touching an edge grow into the extra height (object-fit cover), "Desliza" cues are removed. Checks: text inside the
canvas and safe band, no overlaps. Files in `data/media/pub-N/vNN/historias/story-0N.png`, `versions.story_json`
(migration 3), included in the ZIP under `historias/`; "Volver a generar" = POST /api/versions/:id/stories.

## Statuses

planned → generating → ready_for_review ⇄ changes_requested → approved → scheduled → published.
`approved` only via explicit POST /approve on the current version. Scheduled/published are manual tracking
states; there is no external publishing (no Metricool, no auto-posting) by design.

## Testing requirements

Run `npm test` and `npm run typecheck` after changes. Any change to `studio/` must keep the POC slides
byte-identical (integration test compares MD5 with `output/spinal-decompression/slide-0N.png`). Check new
layouts at 1080×1350 with the renderer checks passing.

## Layouts

`studio/layouts.js`: `commemoration` (`illustration`: `spine` | `bone` | `none`; `bone` = the design system's porous
femur, ported as `boneSVG`, with a 640 px text column), `product`, `benefits` (original POC, fixed backgrounds — must stay
byte-identical) and `hero`, `statement`, `stats`, `split`, `steps`, `cta` (v2, `theme` dark/light/blue).
Schema in `shared/schema.ts`, documentation for the model in `prompts/system/carousel-content.md`, sample of
every layout in `content/layout-gallery.json` → `npm run render -- content/layout-gallery.json`
(`output/layout-gallery/`). Adding a layout means updating all four plus `EditTexts.tsx` and the tests.

## Known limitations

See `docs/PROGRESS.md` → Pending / limitations. Main ones: text inside images isn't validated; 8 icons (Material Symbols Sharp 100, `public/assets/icons`, mirrored in `design-system/btl/src/context.ts` and `catalog.mjs`); no product data for BTL Estética in the
repo catalog yet; Anthropic API mode is implemented but was not exercised against the live API in development.
