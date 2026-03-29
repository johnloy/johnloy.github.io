# johnloy.github.io

Personal resume site built with [JSON Resume](https://jsonresume.org/) and deployed to GitHub Pages via GitHub Actions.

## How it works

1. Edit `resume.json` following the [JSON Resume schema](https://jsonresume.org/schema)
2. Push changes to the `main` branch
3. A GitHub Actions workflow automatically builds the HTML using [`resumed`](https://github.com/rbardini/resumed) with the [`even`](https://github.com/rbardini/jsonresume-theme-even) theme
4. The built HTML is deployed to GitHub Pages at [https://johnloy.github.io](https://johnloy.github.io)

## Local development

Preview your resume locally:

```bash
npm install
npx resumed render resume.json --theme jsonresume-theme-even --output index.html
open index.html
```

## Changing the theme

To use a different theme, update the theme name in both the workflow file (`.github/workflows/deploy.yml`) and install command. Browse available themes at [jsonresume.org/themes](https://jsonresume.org/themes).
