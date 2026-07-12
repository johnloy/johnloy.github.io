# johnloy.github.io

Personal resume site built with [JSON Resume](https://jsonresume.org/) and a custom Vite-built theme, deployed to GitHub Pages via GitHub Actions.

## How it works

1. Edit `resume.json` (and optionally `summary.txt` / `skills.md`, see [Content sources](#content-sources) below)
2. Customize the theme in `theme/` (a vendored fork of [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even))
3. Push changes to `main` that touch `resume.json`, `theme/**`, `scripts/**`, or the workflow file
4. GitHub Actions builds the theme, renders the HTML/PDF, and deploys the `public/` output to [https://johnloy.github.io](https://johnloy.github.io)

## Content sources

`resume.json` is the base source of truth and follows the [JSON Resume schema](https://jsonresume.org/schema). Two optional files let you edit long-form content without hand-editing JSON strings — `scripts/load-resume.mjs` reads them at build/dev time and overlays them onto the loaded resume if present:

- **`summary.txt`** — plain text, overrides `basics.summary`
- **`skills.md`** — a flat markdown list, overrides the `skills` array. Each line is `- name`, or `- name | level | keyword1, keyword2` if you want to group keywords under a named/leveled skill category. Currently this repo uses the simple one-name-per-line form, so each line renders as its own skill entry.

Both files are optional; if absent, `resume.json`'s own `basics.summary`/`skills` values are used unchanged.

## Theme

`theme/` is a local fork of `jsonresume-theme-even`, built independently from the root project (it has its own `node_modules` and `package.json`) and bundled by Vite into dual ESM/CJS output (`theme/dist/`):

- **`theme/components/*.js`** — one function per resume section, each returning an HTML string via [`@rbardini/html`](https://github.com/rbardini/html) tagged templates (e.g. `header.js`, `work.js`, `skills.js`). `resume.js` composes them all into the full document.
- **`theme/assets/page.css`** — colors (CSS custom properties, light/dark), typography scale, the CSS grid layout, and responsive/print styles.
- **`theme/assets/page.js`** — client-side JS (e.g. computing `<time-duration>` display).
- **`theme/utils/`** — markdown rendering and resume-metadata color processing helpers.

The rendered markup includes [schema.org microdata](https://schema.org/Person) (`itemscope`/`itemtype`/`itemprop`) throughout, so search engines and other machine consumers can parse the resume's structured data — basics, work/volunteer history, education, and skills are exposed as `Person` properties.

## Build scripts (`scripts/`)

- **`load-resume.mjs`** — shared resume-loading logic (reads `resume.json`, overlays `summary.txt`/`skills.md`); imported by both the production build and the dev server so they stay in sync.
- **`build.mjs`** — the production build. Loads the built theme from `theme/dist/`, renders the resume to HTML via [`resumed`](https://github.com/rbardini/resumed), formats it with Prettier, and writes `public/index.html` and `public/resume.json`. It then launches Puppeteer against that same rendered HTML to generate `public/resume.pdf`.
- **`preview.mjs`** — a lighter one-off render used by `npm run preview`: renders the resume with the already-built theme, writes `index.html` to the project root, and opens it in the default browser.

`vite.config.js` (root) powers `npm start`, a live dev server with hot reload: it renders the resume on every request via the theme's SSR module, and watches `resume.json`, `summary.txt`, `skills.md`, and `theme/**` (excluding `theme/dist/`) for changes, triggering a full page reload.

## Local development

Both the root project and the theme have their own `node_modules` — install both:

```bash
npm install
cd theme && npm install && cd ..
```

Then, depending on what you're doing:

```bash
npm start            # Live dev server with hot reload (theme + content changes)
npm run preview      # Full production-equivalent build, opens result in browser
npm run build        # Full build: theme + resume → public/ (HTML, PDF, JSON)
npm run build:theme  # Vite build of theme/ into theme/dist/ only
npm run build:resume # Render HTML + PDF from resume.json using the already-built theme
```

`build:theme` must be run at least once before `build:resume` alone will work, since it depends on `theme/dist/`.

## Project structure

```
├── resume.json               # Resume data (JSON Resume schema) — source of truth
├── summary.txt                # Optional: overrides basics.summary
├── skills.md                  # Optional: overrides skills array
├── vite.config.js             # Root dev server (npm start) — SSR render + hot reload
├── theme/                     # Local fork of jsonresume-theme-even (own node_modules)
│   ├── assets/
│   │   ├── page.css           # Layout, typography, colors, responsive/print styles
│   │   └── page.js            # Client-side JS (time-duration calculations)
│   ├── components/            # One HTML-template function per resume section
│   │   ├── header.js
│   │   ├── work.js
│   │   ├── education.js
│   │   ├── skills.js
│   │   └── ...
│   ├── utils/                 # Markdown rendering, color processing
│   ├── index.js                # Theme entry point
│   ├── dist/                  # Vite build output (gitignored, ESM + CJS)
│   └── vite.config.js         # Vite build config for the theme
├── scripts/
│   ├── load-resume.mjs        # Shared resume-loading logic (used by build + dev server)
│   ├── build.mjs               # Production build: HTML + resume.json + PDF → public/
│   └── preview.mjs             # Quick local render + open in browser
├── public/                     # Build output (gitignored) — deployed to GitHub Pages
└── .github/workflows/
    └── deploy.yml               # CI: builds and deploys public/ to GitHub Pages
```

## Customizing the theme

Key files to edit:

- **`theme/assets/page.css`** — colors (CSS custom properties), typography, layout, and responsive styles
- **`theme/components/*.js`** — HTML structure for each resume section (tagged template literals via `@rbardini/html`)
- **`theme/utils/colors.js`** — color scheme processing

After editing anything under `theme/`, run `npm run build:theme` before `npm run build:resume` (or just `npm run build`) — otherwise the HTML build will use the stale bundle in `theme/dist/`. `npm start` handles this automatically via hot reload.
