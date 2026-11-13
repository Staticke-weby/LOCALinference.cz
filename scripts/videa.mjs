// Fronta YouTube videí: přehled, zápis do videa.md a kontrola dat.
// `--zapis` přepíše videa.md. `--kontrola` jen validuje a ukončí chybou.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const file = path.join(root, 'data/videa.yaml');
const videa = (fs.existsSync(file) ? yaml.load(fs.readFileSync(file, 'utf8')) : null) ?? [];

const STAVY = ['novy', 'prohlednuto', 'pouzito', 'zamitnuto'];
const ZAPIS = process.argv.includes('--zapis');
const KONTROLA = process.argv.includes('--kontrola');

const chyby = [];

if (!Array.isArray(videa)) chyby.push('soubor musí být seznam');

const ids = new Set();
for (const [i, v] of (Array.isArray(videa) ? videa : []).entries()) {
  const kde = `položka ${i + 1} (${v?.id ?? '?'})`;
  if (!v || typeof v !== 'object') {
    chyby.push(`${kde}: není objekt`);
    continue;
  }
  if (!/^[\w-]{11}$/.test(String(v.id ?? ''))) chyby.push(`${kde}: id není ID videa`);
  if (!String(v.url ?? '').includes(String(v.id ?? ''))) chyby.push(`${kde}: url neobsahuje id`);
  if (!String(v.nazev ?? '').trim()) chyby.push(`${kde}: chybí nazev`);
  if (!STAVY.includes(v.stav)) chyby.push(`${kde}: neznámý stav ${v.stav}`);
  if (v.kvalita != null && !(Number.isInteger(v.kvalita) && v.kvalita >= 1 && v.kvalita <= 5)) {
    chyby.push(`${kde}: kvalita musí být 1–5 nebo null`);
  }
  if (v.stav === 'zamitnuto' && !String(v.proc ?? '').trim()) chyby.push(`${kde}: zamitnuto musí mít proc`);
  if (ids.has(v.id)) chyby.push(`${kde}: duplicitní id`);
  ids.add(v.id);
}

const pocty = STAVY.map((s) => [s, videa.filter((v) => v?.stav === s).length]);
const fronta = videa
  .filter((v) => v?.stav === 'novy')
  .sort((a, b) => String(b.poprve ?? '').localeCompare(String(a.poprve ?? '')));

console.log(`Videa: ${videa.length}`);
for (const [s, n] of pocty) console.log(`  ${s}: ${n}`);
if (chyby.length) {
  console.log(`\nChyby: ${chyby.length}`);
  for (const c of chyby) console.log(`  ✗ ${c}`);
  process.exitCode = 1;
}

if (KONTROLA) {
  if (!chyby.length) console.log('\n✓ Fronta videí je v pořádku.');
} else if (fronta.length) {
  console.log('\nKe zhlédnutí:');
  for (const v of fronta.slice(0, 30)) {
    console.log(`  ${v.poprve ?? ''}  ${v.zarizeni ?? ''}  ${v.nazev}`);
    console.log(`              ${v.url}`);
  }
  if (fronta.length > 30) console.log(`  … a dalších ${fronta.length - 30}`);
}

if (ZAPIS) {
  const radek = (v) =>
    `| ${v.poprve ?? ''} | ${v.zarizeni ?? ''} | [${String(v.nazev).replace(/\|/g, '\\|')}](${v.url}) | ${v.kanal ?? ''} | ${v.stav} | ${v.kvalita ?? ''} | ${String(v.proc ?? '').replace(/\|/g, '\\|')} |`;
  const tabulka = (seznam) => [
    '| Poprvé | Zařízení | Video | Kanál | Stav | Kvalita | Proč |',
    '|---|---|---|---|---|---:|---|',
    ...seznam.map(radek),
  ];

  const lines = [
    '# YouTube fronta',
    '',
    `Stav: ${videa.length} videí — ${pocty.map(([s, n]) => `${s} ${n}`).join(', ')}.`,
    '',
    '## Ke zhlédnutí',
    '',
    ...(fronta.length ? tabulka(fronta) : ['Nic nového.']),
    '',
    '## Použité',
    '',
    ...(videa.some((v) => v.stav === 'pouzito')
      ? tabulka(videa.filter((v) => v.stav === 'pouzito'))
      : ['Zatím nic.']),
    '',
    '## Prohlédnuté bez přínosu',
    '',
    ...(videa.some((v) => v.stav === 'prohlednuto')
      ? tabulka(videa.filter((v) => v.stav === 'prohlednuto'))
      : ['Zatím nic.']),
    '',
    '## Zamítnuté',
    '',
    ...(videa.some((v) => v.stav === 'zamitnuto')
      ? tabulka(videa.filter((v) => v.stav === 'zamitnuto'))
      : ['Zatím nic.']),
    '',
  ];
  fs.writeFileSync(path.join(root, 'videa.md'), lines.join('\n'));
  console.log('\nZapsáno: videa.md');
}
