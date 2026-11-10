import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'sites/cz/dist');
const strict = process.argv.includes('--strict');

if (!fs.existsSync(dist)) {
  console.error('Chybí sites/cz/dist. Spusť nejdřív build.');
  process.exit(2);
}

function pageUrl(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const url = rel.replace(/index\.html$/, '');
  return `/${url.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
}

function mainHtml(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  return m ? m[0] : html;
}

const pages = new Map();
for (const entry of fs.readdirSync(dist, { recursive: true })) {
  if (!entry.endsWith('index.html')) continue;
  const file = path.join(dist, entry);
  const html = fs.readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/i.test(html)) continue;
  pages.set(pageUrl(file), file);
}

const outgoing = new Map();
const incoming = new Map();
for (const url of pages.keys()) {
  outgoing.set(url, new Set());
  incoming.set(url, new Set());
}

for (const [url, file] of pages) {
  const html = mainHtml(fs.readFileSync(file, 'utf8'));
  for (const m of html.matchAll(/href="(\/[^"#?]+)/g)) {
    let target = m[1];
    if (!target.endsWith('/')) target += '/';
    if (!pages.has(target) || target === url) continue;
    outgoing.get(url).add(target);
    incoming.get(target).add(url);
  }
}

const errors = [];
const warnings = [];

const isConfig = (u) => u.startsWith('/zarizeni/konfigurace/');
const isDictionary = (u) => u.startsWith('/slovnik/') && u !== '/slovnik/';
const isTopic = (u) => u.startsWith('/temata/') && u !== '/temata/';

for (const url of pages.keys()) {
  if (url === '/') continue;
  const min = isConfig(url) ? 1 : 2;
  const n = incoming.get(url).size;
  if (n < min) {
    errors.push(`${url}: ${n} vstupních odkazů z obsahu (minimum ${min})`);
  }
  if (outgoing.get(url).size === 0) {
    errors.push(`${url}: žádný odchozí interní odkaz v obsahu`);
  }
}

const textTopics = new Set([
  '/temata/128gb-unified-memory/',
  '/temata/cena-lokalni-ai/',
  '/temata/dgx-spark/',
  '/temata/lokalni-ai-pro-firmy/',
  '/temata/lokalni-ai-na-windows-11/',
  '/temata/qwen3-8-flash-next/',
  '/temata/rtx-spark/',
  '/temata/strix-halo/',
]);
const creativeTopics = new Set([
  '/temata/lokalni-ai-na-3d/',
  '/temata/lokalni-ai-na-audio/',
  '/temata/lokalni-ai-na-obrazky/',
  '/temata/lokalni-ai-na-video/',
]);

for (const url of [...textTopics, ...creativeTopics]) {
  if (!pages.has(url)) {
    errors.push(`${url}: stránka v dist chybí`);
    continue;
  }
  const links = outgoing.get(url);
  const slovnik = [...links].filter((x) => x.startsWith('/slovnik/')).length;
  const zarizeni = [...links].filter((x) => x.startsWith('/zarizeni/')).length;
  const modely = [...links].filter((x) => x.startsWith('/modely/')).length;
  const generovani = [...links].filter((x) => x.startsWith('/generovani/')).length;

  if (slovnik < 3) errors.push(`${url}: jen ${slovnik} odkazů na slovník (minimum 3)`);
  if (zarizeni < 1) errors.push(`${url}: žádný odkaz na zařízení`);
  if (textTopics.has(url) && modely < 1) errors.push(`${url}: žádný odkaz na model`);
  if (creativeTopics.has(url) && generovani < 1) errors.push(`${url}: žádný odkaz na generování/recept`);
}

for (const url of pages.keys()) {
  if (!isDictionary(url)) continue;
  const sources = [...incoming.get(url)].filter((x) => !x.startsWith('/slovnik/'));
  if (sources.length < 1) {
    errors.push(`${url}: žádný vstupní odkaz z tématu, zařízení nebo návodu`);
  }
}

// Topic index má odkazovat na všechna témata.
const indexLinks = outgoing.get('/temata/') ?? new Set();
for (const url of [...textTopics, ...creativeTopics]) {
  if (!indexLinks.has(url)) warnings.push(`/temata/: chybí odkaz na ${url}`);
}

const report = [
  `Stránek v dist: ${pages.size}`,
  `Témat: ${[...pages.keys()].filter(isTopic).length}`,
  `Slovníkových hesel: ${[...pages.keys()].filter(isDictionary).length}`,
  `Chyby: ${errors.length}`,
  `Varování: ${warnings.length}`,
  '',
];

if (errors.length) {
  report.push('CHYBY');
  for (const e of errors) report.push(`- ${e}`);
  report.push('');
}
if (warnings.length) {
  report.push('VAROVÁNÍ');
  for (const w of warnings) report.push(`- ${w}`);
  report.push('');
}

console.log(report.join('\n'));

if (strict && errors.length) process.exit(1);
