import { render } from 'resumed';
import { writeFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { resolve } from 'path';
import { execFile } from 'child_process';
import { loadResume } from './load-resume.mjs';

const themePath = resolve('theme/dist/index.js');
const theme = await import(pathToFileURL(themePath).href);

const resume = loadResume();
const html = await render(resume, theme);

writeFileSync('index.html', html);
console.log('✓ Rendered index.html');

execFile('open', ['index.html']);
