import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const sources = yaml.load(fs.readFileSync(path.join(root, 'data/zdroje.yaml'), 'utf8')) ?? [];
let errors = 0;
let warnings = 0;

function daysOld(date) {
  const d = new Date(`${date}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - d) / 86400000);
}

for (const source of sources) {
  try {
    const res = await fetch(source.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: {
        'user-agent': 'LocalInference-kontrola/0.1 (+https://www.localinference.cz)',
        accept: 'text/html,application/xhtml+xml,application/xml,application/json,text/plain,*/*',
      },
    });
    if (res.status >= 400) {
      console.error(`✗ ${source.id}: HTTP ${res.status} — ${source.url}`);
      errors++;
    } else {
      console.log(`✓ ${source.id}: ${res.status}`);
    }
  } catch (e) {
    console.error(`✗ ${source.id}: ${e.message} — ${source.url}`);
    errors++;
  }

  if (daysOld(source.posledni_kontrola) > 45) {
    console.warn(`! ${source.id}: poslední kontrola je starší než 45 dní (${source.posledni_kontrola})`);
    warnings++;
  }
}

console.log('');
if (errors === 0) console.log(`✓ Všechny zdroje odpovídají (${warnings} varování).`);
else console.error(`✗ ${errors} zdrojů selhalo, ${warnings} varování.`);

process.exit(errors === 0 ? 0 : 1);
