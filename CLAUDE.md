# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal resume site (johnloy.github.io) built with JSON Resume + a custom Vite-built theme. Outputs static HTML and a PDF to `public/`, which GitHub Actions deploys to GitHub Pages.

## Build commands

```sh
npm run build          # Full build: theme + resume render
npm run build:theme    # Vite build of theme/ into theme/dist/
npm run build:resume   # Render HTML + PDF from resume.json using built theme
npm run preview        # Full build + open result in browser (preferred for local testing)
```

Both `npm install` (root) and `cd theme && npm install` must be run before building — the theme has its own `node_modules`.

## Key architecture notes

- `resume.json` is the source of truth for all content. Everything else is presentation.
- `theme/` is a vendored fork of `jsonresume-theme-even`, built by Vite into library format (ESM + CJS). Edit theme files here, not in `node_modules`.
- `public/` is gitignored but is the deployment artifact — created by `scripts/build.mjs` at build time.
- CI (`deploy.yml`) only triggers on changes to `resume.json`, `theme/**`, `scripts/**`, or the workflow file itself.

## Gotchas

- PDF and HTML have different render paths: `scripts/build.mjs` injects a PDF download link into the HTML but renders a clean copy (without the link) to PDF.
- Puppeteer runs with `--no-sandbox --disable-setuid-sandbox` — required in CI and sometimes locally depending on OS config.
- The theme Vite config outputs dual ESM/CJS (`theme/dist/`). After editing `theme/`, always run `npm run build:theme` before `npm run build:resume` or the HTML will use the stale bundle.

## Workflow

- For larger changes, propose a plan and wait for approval before implementing.
