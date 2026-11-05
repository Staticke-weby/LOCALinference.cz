// Seznam kandidátů na rozšíření webu (data/objevy.yaml).
// Není to registr mezer: tady jsou věci, které ještě nejsou v katalogu,
// a teprve se rozhoduje, jestli na web patří.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const SOUBOR = path.join(ROOT, 'data/objevy.yaml');

const TYPY = new Set(['zarizeni', 'model', 'tema', 'zdroj', 'mereni']);
const STAVY = new Set(['novy', 'posuzuje-se', 'prevzato', 'zamitnuto']);

if (!fs.existsSync(SOUBOR)) {
  console.error('Chybí data/objevy.yaml');
  process.exit(1);
}

const data = yaml.load(fs.readFileSync(SOUBOR, 'utf8')) ?? {};
const polozky = Array.isArray(data.polozky) ? data.polozky : [];

const chyby = [];
const idy = new Set();
for (const p of polozky) {
  if (!p.id) chyby.push('položka bez id');
  else if (idy.has(p.id)) chyby.push(`duplicitní id ${p.id}`);
  else idy.add(p.id);

  if (!TYPY.has(p.typ)) chyby.push(`${p.id}: neznámý typ ${p.typ}`);
  if (!STAVY.has(p.stav)) chyby.push(`${p.id}: neznámý stav ${p.stav}`);
  for (const pole of ['datum', 'nazev', 'url', 'proc']) {
    if (!p[pole]) chyby.push(`${p.id}: chybí ${pole}`);
  }
  if (p.stav === 'zamitnuto' && !p.duvod) chyby.push(`${p.id}: zamítnuté musí mít důvod`);
}

if (chyby.length) {
  console.error('Chyby v data/objevy.yaml:');
  for (const c of chyby) console.error(`  ✗ ${c}`);
  process.exitCode = 1;
}

const stavy = [...STAVY].map((s) => [s, polozky.filter((p) => p.stav === s).length]);
const souhrn = stavy.filter(([, n]) => n > 0).map(([s, n]) => `${n} ${s}`).join(' · ');
console.log(`Kandidáti: ${polozky.length}${souhrn ? ` (${souhrn})` : ''}`);

for (const stav of STAVY) {
  const vStavu = polozky.filter((p) => p.stav === stav);
  if (!vStavu.length) continue;
  console.log(`\n${stav.toUpperCase()}`);
  for (const p of vStavu) {
    console.log(`  ${p.id}  [${p.typ}] ${p.nazev}`);
    console.log(`        ${p.url}`);
    if (p.proc) console.log(`        ${p.proc}`);
    if (p.duvod) console.log(`        zamítnuto: ${p.duvod}`);
  }
}
