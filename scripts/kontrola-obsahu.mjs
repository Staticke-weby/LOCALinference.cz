import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const root = process.cwd();
const contentDir = path.join(root, 'sites/cz/src/content/docs');
const zarizeniFile = path.join(root, 'data/zarizeni.yaml');
let errors = 0;
let warnings = 0;

const datum = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '').slice(0, 10));

/** Nejnovější datum ověření u zařízení: záznam, US cena i CZK cena. */
const zarizeni = new Map();
for (const z of yaml.load(fs.readFileSync(zarizeniFile, 'utf8')) ?? []) {
  const data = [z.overeno, z.cena?.overeno, z.cena_czk?.overeno].map(datum).filter(Boolean).sort();
  zarizeni.set(z.id, data.at(-1) ?? null);
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`! ${msg}`);
  warnings++;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function routeFor(file) {
  let rel = path.relative(contentDir, file).replace(/\\/g, '/');
  rel = rel.replace(/\.(md|mdx)$/, '');
  rel = rel.replace(/\/index$/, '');
  if (rel === 'index') return '/';
  if (rel === '404') return '/404/';
  return `/${rel}/`;
}

const files = walk(contentDir);
const routes = new Set(files.map(routeFor));
const published = [];

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const raw = fs.readFileSync(file, 'utf8');
  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    fail(`${rel}: frontmatter se nenačetl — ${e.message}`);
    continue;
  }
  const data = parsed.data ?? {};
  const isDraft = data.status === 'draft' || data.draft === true;

  if (!data.title) fail(`${rel}: chybí title`);
  if (!data.description) fail(`${rel}: chybí description`);
  if (!data.last_verified) fail(`${rel}: chybí last_verified`);

  if (data.last_verified) {
    const d = data.last_verified instanceof Date ? data.last_verified.toISOString().slice(0, 10) : String(data.last_verified);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) fail(`${rel}: last_verified není YYYY-MM-DD`);
    else if (new Date(`${d}T00:00:00Z`) > new Date()) fail(`${rel}: last_verified je v budoucnosti`);
  }
  const strankaDatum = datum(data.last_verified);

  const body = parsed.content;
  if (/^\*Naposledy ověřeno:/m.test(body)) {
    fail(`${rel}: datum ověření patří jen do frontmatteru last_verified, ne do textu`);
  }
  if (/hust[ýáéíóúů]|husté|hustých/i.test(body)) fail(`${rel}: obsahuje „hustý model“ — používej „dense model“`);
  if (/11ty|eleventy/i.test(body)) warn(`${rel}: zmiňuje 11ty; projekt používá Astro + Starlight`);
  if (/\[DOPLNIT/.test(body) && data.status === 'hotovo') fail(`${rel}: status hotovo, ale obsahuje [DOPLNIT]`);

  for (const m of body.matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (target.startsWith('/_') || target.startsWith('/api/')) continue;
    if (!routes.has(target) && target !== '/') {
      warn(`${rel}: interní odkaz bez stránky — ${target}`);
    }
  }

  if (!isDraft && !/^##\s+Zdroje/m.test(body) && !/^##\s+Otevřené zdroje/m.test(body)) {
    if (!/index\.(md|mdx)$/.test(file)) warn(`${rel}: chybí sekce „## Zdroje“`);
  }

  // Stránka zařízení nesmí být starší než data, ze kterých čerpá.
  const zařízeníStranka = rel.match(/^sites\/cz\/src\/content\/docs\/zarizeni\/([\w-]+)\.mdx$/);
  if (zařízeníStranka && zarizeni.has(zařízeníStranka[1])) {
    const dataDatum = zarizeni.get(zařízeníStranka[1]);
    if (dataDatum && strankaDatum && strankaDatum < dataDatum) {
      fail(`${rel}: last_verified ${strankaDatum} je starší než data zařízení (${dataDatum}) — přepiš datum`);
    }
  }

  // Cena v textu musí být ověřená stejně nedávno jako zařízení, které cituje.
  if (/Kč/.test(body) && strankaDatum) {
    const citovana = new Set([...body.matchAll(/\(\/zarizeni\/([\w-]+)\/\)/g)].map((m) => m[1]));
    const nejnovejsi = [...citovana].map((id) => zarizeni.get(id)).filter(Boolean).sort().at(-1);
    if (nejnovejsi && strankaDatum < nejnovejsi) {
      warn(`${rel}: cena k ${strankaDatum}, ale citovaná zařízení jsou ověřená k ${nejnovejsi}`);
    }
  }

  if (/tok\/s/.test(body) && !/zdroj|source|\[.+\]\(https?:/i.test(body)) {
    warn(`${rel}: zmiňuje tok/s, ale neobsahuje odkaz na zdroj`);
  }

  published.push({ rel, isDraft, title: data.title });
}

console.log('');
console.log(`Obsah: ${files.length} souborů, ${routes.size} rout, ${published.filter((p) => !p.isDraft).length} publikovaných.`);
if (errors === 0) console.log(`✓ Obsah je v pořádku (${warnings} varování).`);
else console.error(`✗ ${errors} chyb, ${warnings} varování.`);

process.exit(errors === 0 ? 0 : 1);
