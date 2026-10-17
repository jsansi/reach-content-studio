# design-sync notes — BTL El Salvador · Slides

Project: https://claude.ai/design/p/28235767-e13b-423b-a739-f5fc2c8272bc (pinned in config.json).

## How this repo syncs
- The design system is the local package `design-system/btl/` (not published to npm). Build it first:
  `node design-system/btl/build.mjs` (esbuild bundle + tsc d.ts + generated `dist/btl.css` + fonts).
- Converter: `--node-modules ./node_modules --entry ./design-system/btl/dist/index.js --out ./ds-bundle`.
- Our own slide validator (overflow, overlap, contrast vs real pixels, 30 px floor, logo safe zone):
  `node design-system/btl/scripts/check.mjs [--overview]` — run it before every sync; it must report 0 issues.
- Previews live in `.design-sync/previews/*.tsx` and double as the validator's stories.
- Group per component comes from category-only stubs in `design-system/btl/docs/<Name>.md`.
- Brand guideline shipped to the agent: `design-system/btl/guidelines/btl-brand-rules.md` (`guidelinesGlob`).
- Every card uses `cardMode: column` — previews are scaled slides (~390 px wide) and overflow grid cells.

## Gotchas
- Prop types must be structural in source: named interfaces (`ImageFrame`, `IconItem`…) and the
  `IconName` alias inside object literals came through unresolved in the emitted .d.ts. Props now inline
  those shapes; keep it that way when adding props.
- `Region` defaults `left` to the brand margin unless `right` + `width` are both set.
- `Slide scale` wraps the canvas in `[data-btl-scaler]`; white/light scaled slides get a faint inset frame
  (mockups only). The validator unscales and removes the frame before measuring.
- `blue` background defaults its light to bottom-left so the Sky Blue glow never sits under the white logo.

## Known render warns
- None after the column override.

## Re-sync risks
- Brand tokens are read from `studio/brands/btl.js` at build time; a change there changes every slide.
- The six official product photos are embedded as data URLs (~1 MB of `_ds_bundle.js`); replacing a file in
  `public/assets/products/spinal-decompression/` changes the bundle and the image-bearing previews.
- `SpineIllustration` renders `spineSVG` from `studio/layouts.js`; editing that function changes the art.
- Preview copy cites manufacturer descriptions (≈10 sesiones, indicaciones) — not `approved_claims`.
- Grades were made on the absolute rubric by the syncing agent plus the scripted check; no human review
  of the Claude Design pane happened in this run.
