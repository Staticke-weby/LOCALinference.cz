// Kontrola interních odkazů v hotovém buildu.
// Projde sites/cz/dist/**/*.html a ověří, že každý interní href má cíl.
// Spouštět po buildu: `node scripts/kontrola-odkazu.mjs`.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'sites/cz/dist');

if (!fs.existsSync(DIST)) {
  console.error('Chybí sites/cz/dist — nejdřív spusťte build.');
  process.exit(1);
}

function projdi(dir) {
  const soubory = [];
  for (const polozka of fs.readdirSync(dir, { withFileTypes: true })) {
    const cesta = path.join(dir, polozka.name);
    if (polozka.isDirectory()) soubory.push(...projdi(cesta));
    else if (polozka.name.endsWith('.html')) soubory.push(cesta);
  }
  return soubory;
}

function existuje(cesta) {
  const bezHash = cesta.split('#')[0].split('?')[0];
  if (!bezHash.startsWith('/')) return true;
  const cil = path.join(DIST, decodeURIComponent(bezHash));
  if (fs.existsSync(cil) && fs.statSync(cil).isFile()) return true;
  if (fs.existsSync(path.join(cil, 'index.html'))) return true;
  if (fs.existsSync(`${cil}.html`)) return true;
  return false;
}

const chyby = [];
for (const soubor of projdi(DIST)) {
  const html = fs.readFileSync(soubor, 'utf8');
  const stranka = `/${path.relative(DIST, soubor).replaceAll('\\', '/')}`;
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (href.startsWith('/_astro/') || href.startsWith('/pagefind/')) continue;
    if (!existuje(href)) chyby.push(`${stranka} → ${href}`);
  }
}

if (chyby.length) {
  console.error(`Nalezeno ${chyby.length} neplatných interních odkazů:`);
  for (const c of chyby) console.error(`  ✗ ${c}`);
  process.exitCode = 1;
} else {
  console.log('Interní odkazy: vše sedí.');
}
