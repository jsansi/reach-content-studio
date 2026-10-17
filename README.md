# reach-content-studio

Assets, knowledge base and **REACH Content Studio**, the local app to plan, generate, review and export social
media carousels for BTL El Salvador.

## Run the app

Requires Node.js 24 or newer.

```
npm install
npx playwright install chromium
npm start
```

Open http://localhost:4600. Everything is saved in `data/` (database, generated images, uploads), so the calendar
and all versions are still there after closing the browser or restarting the computer. `data/` is committed to git,
so a clone or pull brings the calendar, versions and assets too.

### Windows (first time)

1. Install **Git for Windows** (https://git-scm.com), **Node.js 24 or newer** (https://nodejs.org) and
   **Claude Code** (for the manual tasks).
2. In PowerShell:
   ```
   git clone https://github.com/jsansi/reach-content-studio.git
   cd reach-content-studio
   npm install
   npx playwright install chromium
   npm test
   npm start
   ```
3. Open http://localhost:4600.

Day to day: stop the app (Ctrl+C), then `git pull` to receive changes, `npm install` if `package.json` changed, and
`npm start` again. To send your data back, stop the app first (so the database is closed), then commit and push.
Don't work on two computers at the same time: `data/studio.db` is one file and can't be merged.

- **Without an Anthropic API key** (default): "Generar contenido" prepares a task in `data/tasks/job-N/`. Run the
  command the app shows (`claude "Ejecuta la tarea…"`) in this folder, then click **Importar resultado**.
- **With an API key**: copy `.env.example` to `.env`, set `ANTHROPIC_API_KEY`, restart. Generation and change
  requests then run directly from the app.

Developer notes, architecture and rules: `CLAUDE.md`. Progress and decisions: `docs/PROGRESS.md`.

## Structure

```
reach-content-studio/
├── public/
│   └── assets/
│       ├── brands/
│       │   └── btl/
│       │       ├── logo/            # BTL logo files
│       │       └── references/      # Visual references for BTL content
│       └── products/
│           └── spinal-decompression/  # Product images and media
│
├── knowledge/
│   ├── brand-guidelines/
│   │   └── btl-corporate-identity.pdf  # BTL corporate identity manual
│   ├── products/
│   │   ├── btl_products.json           # Product catalog data
│   │   └── spinal-decompression.pdf    # Product documentation
│   └── editorial/                      # Editorial guidelines, tone of voice, content plans
│
└── README.md
```

## Conventions

- `public/assets/` holds visual files (images, logos, video) used in content.
- `knowledge/` holds reference material: brand guidelines, product data and editorial guidance.
- Add new brands under `public/assets/brands/<brand>/` and new products under `public/assets/products/<product>/`, and register products in `knowledge/products/btl_products.json`.

## Generating a carousel

```
npm install
npx playwright install chromium
npm run render -- content/spinal-decompression/dia-mundial-columna-2026.json
```

- `content/` — editorial copy (one JSON per post). Edit text here, not in code.
- `studio/brands/btl.js` — brand tokens from the corporate identity manual.
- `studio/layouts.js` — slide layouts (`commemoration`, `product`, `benefits`) and styles.
- `studio/render.js` — builds `slides.html`, exports 1080×1350 PNGs, `preview.html` and `textos.md` into the folder set in `output`, and checks for overlaps, overflow and the logo safe zone.

Assets: the BTL logo SVG was extracted from the manual (p. 4); icons are Material Symbols Sharp, weight 100 (as the manual specifies); fonts are Noto Sans (OFL).
