import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const contentDir = path.join(root, 'sites/cz/src/content/docs');
let errors = 0;
let warnings = 0;

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
  const isDraft = data.status === 'draft';

  if (!data.title) fail(`${rel}: chybí title`);
  if (!data.description) fail(`${rel}: chybí description`);
  if (!data.last_verified) fail(`${rel}: chybí last_verified`);

  if (data.last_verified) {
    const d = data.last_verified instanceof Date ? data.last_verified.toISOString().slice(0, 10) : String(data.last_verified);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) fail(`${rel}: last_verified není YYYY-MM-DD`);
    else if (new Date(`${d}T00:00:00Z`) > new Date()) fail(`${rel}: last_verified je v budoucnosti`);
  }

  const body = parsed.content;
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
