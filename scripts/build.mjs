import { render } from 'resumed';
import { writeFileSync, mkdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { resolve } from 'path';
import prettier from 'prettier';
import { loadResume } from './load-resume.mjs';

// Load the local theme from the built dist
const themePath = resolve('theme/dist/index.js');
const theme = await import(pathToFileURL(themePath).href);

const resume = loadResume();

// Render HTML (the theme's header component includes the PDF/JSON links;
// .resume-links is hidden via @media print so it's omitted from the PDF render below)
const html = await prettier.format(await render(resume, theme), {
  ...(await prettier.resolveConfig('index.html')),
  parser: 'html',
});

mkdirSync('public', { recursive: true });
writeFileSync('public/index.html', html);
console.log('✓ Built public/index.html');

writeFileSync('public/resume.json', JSON.stringify(resume, null, 2) + '\n');
console.log('✓ Built public/resume.json');

// Generate PDF using Puppeteer
const puppeteer = (await import('puppeteer')).default;
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();

await page.setContent(html, { waitUntil: 'networkidle0' });
// await page.emulateMediaType('print');

await page.pdf({
  path: 'public/resume.pdf',
  format: 'Letter',
  printBackground: true,
  scale: 1,
  // margin: {
  //   top: '0.4in',
  //   bottom: '0.4in',
  //   left: '0.4in',
  //   right: '0.4in',
  // },
});

await browser.close();
console.log('✓ Built public/resume.pdf');
