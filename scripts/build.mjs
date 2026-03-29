import { render } from 'resumed';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

// Load the local theme from the built dist
const themePath = resolve('theme/dist/index.js');
const theme = await import(pathToFileURL(themePath).href);

const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));

// Render HTML
let html = await render(resume, theme);

// Inject a PDF download link into the masthead section
const pdfLink = `
      <p style="margin-top: 1em;">
        <a href="/resume.pdf" style="
          display: inline-flex;
          align-items: center;
          gap: 0.4em;
          padding: 0.5em 1.2em;
          border: 1px solid var(--color-accent);
          border-radius: 0.3em;
          font-size: var(--scale0);
          color: var(--color-accent);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        " onmouseover="this.style.background='var(--color-accent)';this.style.color='var(--color-background)'"
           onmouseout="this.style.background='transparent';this.style.color='var(--color-accent)'"
        ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download PDF</a>
      </p>`;

// Insert the PDF link right before the closing </header> tag (end of masthead)
html = html.replace('</header>', pdfLink + '\n    </header>');

mkdirSync('public', { recursive: true });
writeFileSync('public/index.html', html);
console.log('✓ Built public/index.html');

// Generate PDF using Puppeteer
const puppeteer = (await import('puppeteer')).default;
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();

// Render a clean version of the HTML (without the PDF link) for the PDF
const cleanHtml = await render(resume, theme);
await page.setContent(cleanHtml, { waitUntil: 'networkidle0' });
await page.emulateMediaType('screen');

await page.pdf({
  path: 'public/resume.pdf',
  format: 'Letter',
  printBackground: true,
  margin: {
    top: '0.4in',
    bottom: '0.4in',
    left: '0.4in',
    right: '0.4in',
  },
});

await browser.close();
console.log('✓ Built public/resume.pdf');
