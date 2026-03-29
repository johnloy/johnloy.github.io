# johnloy.github.io

Personal resume site built with [JSON Resume](https://jsonresume.org/) and deployed to GitHub Pages via GitHub Actions.

## How it works

1. Edit `resume.json` following the [JSON Resume schema](https://jsonresume.org/schema)
2. Customize the theme in the `theme/` directory (forked from [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even))
3. Push changes to the `main` branch
4. A GitHub Actions workflow builds the theme, renders the HTML and PDF, and deploys to [https://johnloy.github.io](https://johnloy.github.io)

## Project structure

```
├── resume.json              # Resume data (JSON Resume schema)
├── theme/                   # Local fork of jsonresume-theme-even
│   ├── assets/
│   │   ├── page.css         # Main stylesheet — colors, layout, typography
│   │   └── page.js          # Client-side JS (time duration calculations)
│   ├── components/          # HTML template components for each resume section
│   │   ├── header.js
│   │   ├── work.js
│   │   ├── education.js
│   │   ├── skills.js
│   │   └── ...
│   ├── utils/               # Helper utilities (markdown, color processing)
│   ├── index.js             # Theme entry point
│   └── vite.config.js       # Vite build config for the theme
├── scripts/
│   └── build.mjs            # Build script (renders HTML + generates PDF)
└── .github/workflows/
    └── deploy.yml           # GitHub Actions CI/CD
```

## Local development

```bash
# Install dependencies
npm install
cd theme && npm install && cd ..

# Build and preview
npm run build
open public/index.html
```

## Customizing the theme

The theme source lives in `theme/`. Key files to edit:

- **`theme/assets/page.css`** — Colors (CSS custom properties), typography, layout, and responsive styles
- **`theme/components/*.js`** — HTML structure for each resume section (uses tagged template literals)
- **`theme/utils/colors.js`** — Color scheme processing

The theme uses [Vite](https://vitejs.dev/) to bundle the source into a single module. The build script in `scripts/build.mjs` loads the built theme and passes it to [`resumed`](https://github.com/rbardini/resumed) for rendering.
