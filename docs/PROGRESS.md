# REACH Content Studio — development progress

Last update: 2026-10-17 (three-step process)

## Starting point (POC, kept intact)

- `studio/render.js` + `studio/layouts.js` + `studio/brands/btl.js`: deterministic renderer (Playwright) that turned
  `content/spinal-decompression/dia-mundial-columna-2026.json` into the World Spine Day carousel
  (`output/spinal-decompression/`), with layout checks.
- `studio/render-option.js`, `studio/compare.js` and `output/spinal-decompression/opcion-b|c`: alternative options
  (B, C) and comparison page. Untouched.

## Completed

### Milestone 1 — persistent calendar and publication creation
- SQLite (`node:sqlite`) with migrations; data in `data/` (committed to git since 2026-10-18 so it travels between computers), survives restarts.
- Monthly calendar (Monday start), previous/next/today, filters by brand and status, cards with topic, brand,
  format and status, drag-and-drop rescheduling, mobile agenda view.
- Publication form: brand, date, topic, format, objective (required); products from `btl_products.json`,
  slide count (default 3), creative instructions, supporting documents, images, production deadline (optional).
- "Registrar producto" creates a user product with `pending_review` status.
- "Guardar en el calendario" only saves; "Generar contenido" is a separate action.

### Milestone 2 — renderer integration
- `studio/engine.js` extracted from `render.js`; `render.js` is now a thin CLI. Output verified byte-identical
  (PNG, slides.html, preview.html, textos.md) and covered by an integration test.
- Backward-compatible layout options: `illustration: 'none'` cover, optional `datePill`/`eyebrow`/`question`,
  optional `stat`/`body`, optional CTA band, per-slide `style` overrides (whitelisted), partial re-render.
- Extra check: text clipped at the canvas edge. Messages translated to Spanish in the app.
- World Spine Day imported as publication 1 / version 1 by copying the POC PNGs (not regenerated).

### Milestone 3 — viewer and downloads
- Slides grid with lightbox, version selector (current + previous), caption with copy, validation, sources,
  claims with approval level, concept, prompt versions.
- Per-slide PNG download and full ZIP (PNGs + caption.txt), named `REACH_Cliente_Tipo_AAAA-MM-DD_v01…`.

### Milestone 4 — revisions, versions and approval
- Direct text editing (no AI) → new version, only changed slides re-rendered.
- Natural-language change requests with scope (carousel, slide, headline, supporting text, product image,
  layout, visual hierarchy, CTA, caption) and optional "save as preference".
- Status workflow with history; explicit approval of the current version only; manual scheduled/published.

### Milestone 5 — AI provider abstraction
- `AIProvider` interface; `AnthropicProvider` (structured outputs via zod) and `ClaudeCodeProvider`
  (task packages + `task:check` + import). Mode shown in the top bar.
- Versioned prompt files + loader; prompt versions recorded per generation and in `prompt_versions` table.
- Targeted retrieval with page/section-referenced excerpts (`knowledge/products/spinal-decompression.md`,
  `knowledge/brand-guidelines/btl-corporate-identity.md`).

### Validation performed (2026-10-14)
API end-to-end on a scratch data folder: create → restart → still there → generate (task package) → Claude Code
result written and imported → 3 slides rendered and validated → direct edit (1 slide re-rendered) → change
request via task package → revision imported (1 slide re-rendered) → v1/v2/v3 history → PNG and ZIP downloads →
approval rules → restart → all persisted. Missing-information path (product without images) fails with a clear
message and succeeds on retry after uploading an image. UI checked at 1440 px and 390 px (no horizontal
overflow, no console errors). `npm test`: 10/10 passing.

### Layouts v2 (2026-10-14)
- Six new layouts: `hero`, `statement`, `stats` (official figure badges or text numbers + footnote), `split`,
  `steps`, `cta`; dark/light/blue themes. Original three unchanged (POC still byte-identical, tested).
- New check: hero image running under the headline. Asset existence checked for every layout.
- Prompts bumped: carousel-content 1.1.0 (layouts, variety), claim-verification 1.1.0 (official BTL figure
  images allowed as supplied, with footnote), creative-direction 1.1.0 (curiosity hooks).
- `content/layout-gallery.json` renders a sample of each layout; `tests/layouts.test.ts` covers them.

### Creative proposals with the BTL design system (2026-10-14)
- **Publication page → "Propuestas creativas"** (opened from the calendar): one `propose` job asks the AI for three
  proposals of the same carousel — A editorial minimalism, B premium medical technology, C scientific/educational.
  Each slide is a flat list of `design-system/btl` primitives (`shared/design.ts`), not a fixed layout, so
  composition, hierarchy, image prominence and negative space vary. Allowed components and props:
  `design-system/btl/catalog.mjs` (no raw colors/CSS). Prompts: `design-proposals` 1.1.1, `design-revision` 1.0.0.
- **Render + validate** (`server/design/render.ts`): server-side React with the real components → 1080×1350 PNGs →
  `design-system/btl/validate.mjs` (shared with `npm run check:ds`): text < 30 px, typeface, brand colors, overflow,
  split words, overlaps, canvas bounds, contrast against real pixels, text over busy photo areas, one logo / 2 U /
  plain safe zone / logo contrast, images that fail to load; image bleed reported as a note. Safe auto-fix: step text
  down a size (up to 3 passes). Anything left → "Revisión manual", never shown as passed.
  Claim / brand-copy checks (`buildDesignValidation`) are stored separately (`validation.claim_checks`).
- **Review**: three proposals side by side (`ProposalsPanel`), choose one (`POST /api/versions/:id/select`; nothing
  is auto-chosen), change requests in natural language or "Regenerar" one slide (`design_revise`; other slides are
  restored from the base and copied, not re-rendered), compare any two versions in the viewer, approve, PNG/ZIP + caption.
  Revising an unchosen proposal does not choose it. Every proposal and revision is a version (rounds kept).
- **Storage**: migration 2 adds `versions.kind/direction/proposal_set/proposal_status`; design versions keep the
  proposal in `content_json` (`Version.design`). Existing carousel versions are untouched.
- **Claude Code mode**: the task package also writes `assets.json`; `npm run task:check` validates design results
  (schema, catalog, props, images) before import. `npm run build` now builds the design system first (`build:ds`).
- **Claude Design**: the app cannot invoke it. The available integration (design-sync) only reads/writes the
  design-system project files; it cannot generate, retrieve, edit or export designs, so proposals are rendered locally
  with the same components. Project: "BTL El Salvador · Slides".
- **First real run (pub-2, 18 Oct, EMFEMME 360)**: proposals v5 (A), v6 (B), v7 (C) all passed; QA revisions of C
  (v8 flagged for manual review — footnote collision, correctly not auto-passed; v9 single-slide, flagged; v10 passes).
  Not chosen or approved: that is Jaime's decision. Tests: `tests/proposals.test.ts` (end to end); 14/14 passing.

### Decor for light and continuity (2026-10-15)

- Jaime asked for more creative slides (worked backgrounds, a visual motif that continues between slides, no
  square photo frames) and for tools beyond plain HTML. Answer given: Claude Design cannot generate images and the
  app cannot drive it; no generative image model is available (it would be a paid external service and brand rules
  forbid inventing equipment, patients or results). So the design system gained code-drawn decor instead:
  `Halo`, `Curve`, `LightBand` and `ProductImage` `fade`, with previews (`check:ds` 79/79) and the
  `design-proposals` prompt 1.2.0 (continuity across slides, photos without frames, decor never behind text).
- New source: `knowledge/brand-guidelines/Social-Media-Guideline.pdf` (BTL Aesthetics v1.3): carousel template
  with circles and a light panel that crosses slides; secondary colors per product (pp. 7–8), graphics only,
  ≤ 10 %. EMFEMME 360 is not listed, so it gets no secondary color (to confirm with BTL; it runs on the EXION
  platform, whose color is #ffb0d4, but EXION must not be named). Brand prompt `btl-estetica-el-salvador` 1.2.0.
- Validator: `decor_text` (curve/halo behind text, by diffing the slide with and without decor) and
  `secondary_area` (pixels near the secondary color > 10 %). Tests: `tests/design-decor.test.ts`; 18/18 passing.
- Not done: the Claude Design project was not re-synced with the new primitives (the upload approval was declined on 2026-10-15; build and grades are ready locally).
- Creative proposals also for single images (2026-10-15): API/UI allow `single_image`; `design-proposals` 1.3.0 explains
  one-slide pieces (no swipe, homage without CTA when there is no product). Test in `tests/proposals.test.ts`.
- Classic layouts (2026-10-15): `imageFrame` (hero, split, cta) accepts `height` + `focusY` (crop without distortion)
  and `fadeTop` / `fadeBottom` (CSS mask; the file is untouched), so a light photo can sit under a logo on the plain
  gradient. `carousel-content` prompt 1.2.0; test in `tests/layouts.test.ts`; POC slides still byte-identical.
- Hero `align: "center"` (2026-10-15): centred text, an exception to manual p. 19 that Jaime chose for the 19 Oct post;
  the prompt allows it only on explicit request. Note: a result that uses new layout fields must be imported after
  restarting the server (v17 of pub-4 was imported with the old renderer and lost the photo crop/fades).
- Product info gaps (2026-10-16): an attached document now counts as product information; user-registered products can be
  completed later ("Completar ficha", PUT /api/products/:id; catalog products stay read-only).
- Official sources (2026-10-16, `server/pipeline/sources.ts`): BTL product page text + photos, PDF photo extraction
  (dependency-free: JPEG passthrough, Flate → PNG; page captures segmented in Chromium). Tried on pub-5
  (BTL Magnetotherapy): 8 clean applicator/device photos from btlnet.es; the page-capture PDF gave 4 blocks, 2 of them
  other products (catalogue, combined unit) — the model/Jaime must pick.
- Illustrations in every task (2026-10-16): `Illustration` primitive (model-drawn SVG, validated), mandatory topic
  illustration per proposal, library saved on approval and offered in later briefs. Classic `generate` carousels are not
  covered (their layouts have no illustration slot besides the spine); creative proposals are the path.
- Bone illustrations (2026-10-16): `BoneIllustration` (glowing femur, `porous`) and `BoneDensity` (healthy vs porous
  spongy bone with label), code-drawn like the spine, for bone-health/osteoporosis topics; previews validated (83/83).
- Stories on approval (2026-10-16): `studio/story.js` + `story` job; 1080 × 1920 (Jaime wrote "1080 × 1900, 9:16":
  9:16 at 1080 wide is 1920, the Instagram story size; change STORY_H if 1900 is really wanted). Tried on the current
  versions of pub-1 (classic), pub-3 (design) and pub-4 (hero): all pass. DB backup:
  data/backups/studio-before-stories-2026-10-16.db.
- Hero title `**words**` → SemiBold (2026-10-15), same exception policy as `align`. Server restarted 15:41 on the new code.

### Creative variety: rotating art directions and visual memory (2026-10-16)
- Problem: every round produced the same three looks (fixed A editorial / B premium / C scientific directions, and
  the brief only remembered past cover hooks, not past designs).
- **Direction bank** `prompts/system/creative-directions.md` (15 directions in 6 families: tipografia, imagen,
  datos, narrativa, ilustracion, libre). `server/design/directions.ts` picks three from different families, least
  recently used by the brand first, random ties, at most one `libre`; the app chooses (no UI choice). Ids are kept in
  the job input (so a Claude Code import knows each slot) and as `direction_id` in the stored design; revisions keep it.
- **Visual memory** `server/design/memory.ts`: each past proposal summarised as background + key components per
  slide + cover hook. The brief lists the brand's latest 9 ("Diseños anteriores"). On import (and in `task:check`,
  non-blocking) proposals ≥ 80 % similar to a past one or to each other get a "Diseño repetido" note.
- **Diverge first**: optional `concepts_explored` (6–8 ideas) in `ProposalsResult`, required by `task:check` for new
  packages; prompt `design-proposals` 1.5.0 (assigned directions, explore → choose → compose → compare, never start
  from previous results). TASK.md for proposals and CLAUDE.md forbid copying earlier `result.json` files.
- "Publicaciones recientes" now shows the real cover hook of design versions (was empty).

### Classic cover with the femur (2026-10-17)
- `commemoration` accepts `illustration: "bone"`: the same porous femur as the design system's `BoneIllustration`
  (ported to `boneSVG` in `studio/layouts.js`, same seeded trabeculae), on the right, with a 640 px text column.
  Spine and none paths untouched (POC still byte-identical). Schema enum, prompt `carousel-content` 1.3.0 and a
  layout test updated. Requested by Jaime for the osteoporosis classic carousel (job-110).

### Hero with two photos and side fades (2026-10-17)
- `hero` accepts `extraImages` (up to 2 more `{ image, imageAlt, imageFrame }`, same headline check) and every v2
  `imageFrame` accepts `fadeLeft` / `fadeRight` (intersected with top/bottom fades via `mask-composite`). Top/bottom-only
  output unchanged. Prompt `carousel-content` 1.4.0 and a layout test. Requested for the osteoporosis slide 2 (job-118):
  two official photos of patients using the equipment.

### Hero accents on request (2026-10-17)
- `hero` accepts `rule: true` (thin corporate accent rule between headline and body) and `**phrase**` in `body`
  (SemiBold + accent colour). Both are exceptions to manual p. 19, used only on explicit request and noted in warnings.
  Prompt `carousel-content` 1.5.0 and a layout test. Requested for the osteoporosis slide 2 (job-128).

### Server exits on SIGTERM / SIGINT during renders (2026-10-17)
- Playwright installs SIGTERM/SIGINT handlers while a browser is open; they close the browser but don't exit, so a
  server stopped during a render (e.g. the story job right after approval, or Ctrl+C on `npm start`) kept running and
  the integration test hung. `server/index.ts` now exits explicitly on both signals; interrupted jobs are marked
  failed on the next start, as before.

### Three more icons (2026-10-17)
- `accessibility_new` (body zones), `patient_list` (patient database) and `shield_person` (therapist protection), official
  Material Symbols Sharp weight 100 (`@material-symbols/svg-100` 0.27.0, the same source as the existing five: `checklist`
  is byte-identical). Added to `public/assets/icons` (classic layouts read the folder) and to the design system
  (`context.ts`, `parts.tsx`, `slides.tsx`, `catalog.mjs`; rebuilt with `npm run build:ds`).

### Benefits title breaks and optional signature (2026-10-17)
- `benefits` title now renders `\n` and `**words**` (SemiBold, only on request); the CTA band's `signature` line is
  only drawn when present. POC output unchanged (title has neither, signature present). Prompt `carousel-content` 1.6.0.

### Shared accent system across classic layouts (2026-10-17)
- `commemoration` and `benefits` accept `rule: true` (the same 96×4 accent rule as `hero`, drawn under the headline:
  sky on dark, Enterprise Blue on light) and the cover title accepts `**words**` in SemiBold. Used to unify the
  osteoporosis carousel (job-136). POC unchanged. Prompt `carousel-content` 1.7.0.

### Light hero with the light from the right (2026-10-17)
- `hero` (light theme) accepts `lightFrom: "right"`: the sky gradient enters from the top-right corner instead of the
  top-left, so it does not tint people photographed on the left (job-138). Prompt `carousel-content` 1.8.0 and a test.

### Three-step process: texts first, then style (2026-10-17)
- Why: the World Osteoporosis Day carousel (pub 5) took 8 proposal rounds, 14 change requests and 28 imports: text,
  style and image changed together in every round, so nothing could be kept, and the clinic angle arrived late.
- Fixed structure in `shared/structure.ts` (hook · equipo · ventajas para la clínica + CTA), sent in every brief and
  shown in the form; the creative instructions no longer need to describe it. Prompts: creative-direction 1.2.0,
  design-proposals 1.6.0, carousel-content 1.9.0, new copy-options 1.0.0.
- Short brief in the publication form (audience with a per-brand default, main advantage for the clinic, tone, what to
  avoid), migration 4 (`brief_json`).
- Step 1 "Mensaje" (`copy` job, `CopyStep.tsx`): options per slide, "+ Más opciones" per slide with a comment (and
  "guardar como preferencia"), pick/edit, "Aprobar textos". Step 2 (proposals / classic) is enabled after approval and
  must use the approved texts (task:check blocks; import notes). Stepper on the publication page.
- Two learned preferences seeded once (`seed.preferences.2`): the hook connects with the clinic's advantage; never
  claim a device treats a disease the official source doesn't mention.
- Not done: combining parts of two proposals in one click (use "Solicitar cambios" on the chosen one); visual-tweak panel
  and API mode (discussed, not requested).
- Tests: unit (structure + approved-text matching) and `tests/proposals.test.ts` (options → more for one slide →
  approve → proposals checked against the texts); 36/36 passing, POC byte-identical.

### Step 3 without AI: approve slides, adjust texts, move slides, comment per slide (2026-10-18)
- Why: the Día Mundial del Ictus carousel (pub 6) took ~12 design rounds (v4 → v16), most of them exact tweaks (remove
  bold, white text, smaller CTA, swap a description) or "keep slides 2–5 as they are" / "bring back slide 1 of v13".
- **Aprobar diapositiva** per slide (`design.locked_slides`, inherited); revisions can't change approved slides (restored
  on import, `fixed-slides.json` + task:check in the package).
- **Ajustar textos** (`design_edit` job, `shared/design-edit.ts`, `SlideEditor.tsx`): text, weight, size, tone; only the
  slide is re-rendered and validated, no AI round.
- **Traer de otra versión**: drag & drop (or pick + "Usar aquí") of a slide from any design version, with a preview modal.
- **Comentarios por diapositiva** in "Solicitar cambios" (general + per slide; uncommented slides stay fixed).
- `npm run task:preview -- job-N`: renders a design task's result.json to `data/tasks/job-N/preview/` with the validator's
  notes, so Claude Code can verify visually before Jaime imports (CLAUDE.md updated).
- Preferences learned on pub 6 (`seed.preferences.3`): two-weight headlines; "Desliza" bottom right; the only closing
  CTA is "Solicita tu demo" (regular, no pill, no signature/"Escríbenos DEMO" on the slide; DEMO stays in the caption);
  every device mentioned shown with its official photo and normally its product logo. Left out on purpose: "no
  decorations" (sometimes wanted) and a fixed name/description treatment (depends on the piece).
- Tests: unit (design edits) and an e2e in `tests/proposals.test.ts` (lock → edit → replace → per-slide comments →
  task:check blocks a locked slide → import restores it); 38/38 passing, POC byte-identical.

## Architectural decisions

| Decision | Why |
|---|---|
| Node 24 type stripping, no server build | Zero-config TS backend; fewer moving parts for a local tool. |
| `node:sqlite` instead of better-sqlite3 | No native build; synchronous API keeps job/duplicate checks simple. |
| Plain `node:http` router, own ZIP writer | Few routes; avoids dependencies for one feature each. |
| Hash routing in the SPA | Works from the same static server without rewrite rules. |
| Versions stored as folders `media/pub-N/vNN` | Stable identifiers; files easy to back up or move to object storage. |
| Version created only in the final stage | A failed job cannot corrupt existing versions. |
| Claude Code task packages when no API key | No paid service required; manual step is explicit, never simulated. |
| Text excerpts of PDFs in `knowledge/` | Product PDF is image-only (web capture); excerpts make retrieval targeted and citable. |
| User-created products only in SQLite | `btl_products.json` stays the curated catalog; new products await review. |
| One brand signature "BTL El Salvador" | Client feedback: never "BTL Medical" in published copy. |

## Pending / known limitations

- **Anthropic API mode not exercised live**: code compiles and the schema is accepted by the SDK helper, but no
  request was sent during development (no key configured). First real run should be watched.
- Five icons only; the new layouts avoid icons, but `benefits` still depends on them.
- No product data or official assets for BTL Estética yet; the manual's per-product secondary colour is not applied.
- `knowledge/products/*.md` excerpts must be written by hand for new product PDFs (no PDF text extraction).
- Visual references in `public/assets/brands/btl/references/` are listed by name only (not analysed).
- Changes to an approved publication require "Revocar aprobación" first.
- Single local user; no authentication, cloud hosting, Metricool, auto-publishing or video (out of scope).
- Deleting an attachment keeps the file on disk (versions may reference it).
- Text inside images (BTL figure badges, product wordmarks) cannot be measured by the validator; the prompt asks for
  badges ≥ 640 px wide, but legibility of image text still needs a human look.
- Proposals are carousel-only; "Editar textos" (no AI) is not available for design versions yet — use "Solicitar cambios".
- EMFEMME 360 is a user product pending review whose record cites a third-party clinic page, not BTL documentation.
