// Registr mezer: spojí ruční seznam v data/chybi.yaml s markery [DOPLNIT]
// v obsahu a s prázdnými hodnotami v datech. Slouží k dávkovému řešení.
//
//   npm run chybi          vypíše přehled podle dávek
//   npm run chybi:zapis    zapíše chybi.md
//   npm run chybi -- --kontrola   jen validace (pro CI)

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'sites/cz/src/content/docs');
const REGISTR = path.join(ROOT, 'data/chybi.yaml');
const VYSTUP = path.join(ROOT, 'chybi.md');

const STAVY = new Set(['otevreno', 'hleda-se', 'ceka-na-vas', 'prubezne', 'hotovo']);
const PRIORITY = new Set(['P0', 'P1', 'P2']);
const POVINNE = ['id', 'oblast', 'titulek', 'co_chybi', 'kde', 'priorita', 'stav', 'davka'];

const args = new Set(process.argv.slice(2));
const jenKontrola = args.has('--kontrola');
const zapsat = args.has('--zapis');

function nactiYaml(cesta) {
  return yaml.load(fs.readFileSync(cesta, 'utf8'));
}

function projdiAdresar(dir) {
  const vysledek = [];
  for (const polozka of fs.readdirSync(dir, { withFileTypes: true })) {
    const cesta = path.join(dir, polozka.name);
    if (polozka.isDirectory()) vysledek.push(...projdiAdresar(cesta));
    else if (/\.(md|mdx)$/.test(polozka.name)) vysledek.push(cesta);
  }
  return vysledek;
}

function klicStranky(rel) {
  let klic = rel.replaceAll('\\', '/').replace(/\.(md|mdx)$/, '');
  if (klic.endsWith('/index')) klic = klic.slice(0, -'/index'.length);
  return klic;
}

// --- registr -------------------------------------------------------------

const chyby = [];
const varovani = [];

if (!fs.existsSync(REGISTR)) {
  console.error('Chybí data/chybi.yaml');
  process.exit(1);
}

const registr = nactiYaml(REGISTR) ?? {};
const polozky = Array.isArray(registr.polozky) ? registr.polozky : [];
const davky = Array.isArray(registr.davky) ? registr.davky : [];
const ignorovat = new Set(registr.ignorovat_stranky ?? []);

const videne = new Set();
for (const p of polozky) {
  for (const pole of POVINNE) {
    if (p[pole] === undefined || p[pole] === null || p[pole] === '') {
      chyby.push(`${p.id ?? '(bez id)'}: chybí pole ${pole}`);
    }
  }
  if (p.id && videne.has(p.id)) chyby.push(`Duplicitní ID ${p.id}`);
  if (p.id) videne.add(p.id);
  if (!PRIORITY.has(p.priorita)) chyby.push(`${p.id}: neznámá priorita ${p.priorita}`);
  if (!STAVY.has(p.stav)) chyby.push(`${p.id}: neznámý stav ${p.stav}`);
  if (!Array.isArray(p.kde)) chyby.push(`${p.id}: kde musí být seznam`);
  if (p.davka && !davky.some((d) => d.id === p.davka)) {
    chyby.push(`${p.id}: dávka ${p.davka} není v seznamu dávek`);
  }
}

// --- markery v obsahu ----------------------------------------------------

const markery = [];
for (const soubor of projdiAdresar(DOCS)) {
  const rel = path.relative(DOCS, soubor).replaceAll('\\', '/');
  const stranka = klicStranky(rel);
  if (ignorovat.has(stranka)) continue;

  const radky = fs.readFileSync(soubor, 'utf8').split(/\r?\n/);
  radky.forEach((radek, i) => {
    const re = /\[DOPLNIT[^\]]*\]/g;
    let m;
    while ((m = re.exec(radek)) !== null) {
      markery.push({ stranka, soubor: rel, radek: i + 1, text: m[0], kontext: radek.trim() });
    }
  });
}

const markeryPodleStranky = new Map();
for (const m of markery) {
  markeryPodleStranky.set(m.stranka, (markeryPodleStranky.get(m.stranka) ?? 0) + 1);
}

const pokryte = new Set();
for (const p of polozky) {
  for (const kde of p.kde ?? []) pokryte.add(kde);
}
const nezapsane = [...markeryPodleStranky.keys()].filter((s) => !pokryte.has(s)).sort();

const bezMarkeru = [];
for (const p of polozky) {
  if (!p.kde?.length) continue;
  const pocet = p.kde.reduce((soucet, s) => soucet + (markeryPodleStranky.get(s) ?? 0), 0);
  if (p.stav === 'hotovo' && pocet > 0) bezMarkeru.push({ ...p, pocet });
}

// --- prázdné hodnoty v datech -------------------------------------------

const dataZavad = [];
try {
  const generativni = nactiYaml(path.join(ROOT, 'data/generativni-modely.yaml')) ?? [];
  const bezRychlosti = generativni.filter((m) => m.rychlost == null);
  const bezParametru = generativni.filter((m) => m.parametry_b == null);
  dataZavad.push(`generativní modely bez rychlosti: ${bezRychlosti.length}/${generativni.length}`);
  dataZavad.push(`generativní modely bez počtu parametrů: ${bezParametru.length}/${generativni.length}`);
} catch {
  varovani.push('data/generativni-modely.yaml se nepodařilo načíst');
}

try {
  const modely = nactiYaml(path.join(ROOT, 'data/modely.yaml')) ?? [];
  const bezKontextu = modely.filter((m) => m.kontext?.doporuceny == null);
  if (bezKontextu.length) dataZavad.push(`modely bez doporučeného kontextu: ${bezKontextu.length}`);
} catch {
  varovani.push('data/modely.yaml se nepodařilo načíst');
}

try {
  const mereni = nactiYaml(path.join(ROOT, 'data/mereni.yaml')) ?? [];
  const bezKvantizace = mereni.filter((m) => String(m.kvantizace ?? '').includes('DOPLNIT'));
  if (bezKvantizace.length) dataZavad.push(`měření bez kvantizace: ${bezKvantizace.length}/${mereni.length}`);
} catch {
  varovani.push('data/mereni.yaml se nepodařilo načíst');
}

// --- výstup --------------------------------------------------------------

const stavy = [...STAVY].map((s) => [s, polozky.filter((p) => p.stav === s).length]);
const souhrn = stavy
  .filter(([, n]) => n > 0)
  .map(([s, n]) => `${n} ${s}`)
  .join(' · ');

if (chyby.length) {
  console.error('Chyby v registru:');
  for (const c of chyby) console.error(`  ✗ ${c}`);
} else {
  console.log(`Registr mezer: ${polozky.length} položek (${souhrn})`);
}

if (varovani.length) {
  for (const v of varovani) console.warn(`  ! ${v}`);
}

if (!jenKontrola) {
  for (const davka of davky) {
    const vDavce = polozky
      .filter((p) => p.davka === davka.id && p.stav !== 'hotovo')
      .sort((a, b) => a.priorita.localeCompare(b.priorita) || a.id.localeCompare(b.id));
    if (!vDavce.length) continue;

    console.log(`\nDÁVKA ${davka.id} — ${davka.nazev}`);
    console.log(`  ${davka.cil}`);
    for (const p of vDavce) {
      const stranky = (p.kde ?? []).length ? ` · ${p.kde.length} str.` : '';
      console.log(`  ${p.priorita}  ${p.id.padEnd(4)} ${p.titulek} — ${p.stav}${stranky}`);
    }
  }

  console.log(`\nMarkery [DOPLNIT]: ${markery.length} na ${markeryPodleStranky.size} stránkách`);
  if (markeryPodleStranky.size) {
    console.log('Podle stránek:');
    for (const [s, n] of [...markeryPodleStranky.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
      console.log(`  ${String(n).padStart(2)}× ${s}`);
    }
  }
  if (nezapsane.length) {
    console.log('Nezapsané stránky s [DOPLNIT]:');
    for (const s of nezapsane) console.log(`  ? ${s} (${markeryPodleStranky.get(s)}×)`);
  }
  for (const p of bezMarkeru) console.log(`  ! ${p.id}: stav hotovo, ale ${p.pocet}× [DOPLNIT]`);
  if (dataZavad.length) {
    console.log('Data bez hodnot:');
    for (const d of dataZavad) console.log(`  · ${d}`);
  }
}

if (zapsat) {
  const radek = (p) =>
    `| ${p.id} | ${p.titulek} | ${p.priorita} | ${p.stav} | ${p.kde?.length ? p.kde.map((k) => `/${k}/`).join('<br>') : '—'} |`;

  const casti = [];
  casti.push('# Registr mezer');
  casti.push('');
  casti.push('*Vygenerováno z `data/chybi.yaml`. Neupravuj ručně — měň YAML a spusť `npm run chybi:zapis`.*');
  casti.push('');
  casti.push(`**${polozky.length} položek** · ${souhrn} · ${markery.length} markerů [DOPLNIT] na ${markeryPodleStranky.size} stránkách.`);
  casti.push('');
  casti.push('## Souhrn podle dávek');
  casti.push('');
  casti.push('| Dávka | Název | Otevřených |');
  casti.push('|---|---|---|');
  for (const d of davky) {
    const n = polozky.filter((p) => p.davka === d.id && p.stav !== 'hotovo').length;
    casti.push(`| ${d.id} | ${d.nazev} | ${n} |`);
  }

  for (const d of davky) {
    const vDavce = polozky
      .filter((p) => p.davka === d.id)
      .sort((a, b) => a.priorita.localeCompare(b.priorita) || a.id.localeCompare(b.id));
    if (!vDavce.length) continue;
    casti.push('');
    casti.push(`## Dávka ${d.id} — ${d.nazev}`);
    casti.push('');
    casti.push(`*${d.cil}*`);
    casti.push('');
    casti.push('| ID | Co chybí | Priorita | Stav | Stránky |');
    casti.push('|---|---|---|---|---|');
    for (const p of vDavce) casti.push(radek(p));
    casti.push('');
    for (const p of vDavce) {
      if (p.stav === 'hotovo') continue;
      casti.push(`- **${p.id}** — ${p.co_chybi} *Hledat:* ${p.hledat ?? '—'}`);
    }
  }

  if (markeryPodleStranky.size) {
    casti.push('');
    casti.push('## Markery [DOPLNIT] podle stránek');
    casti.push('');
    for (const [s, n] of [...markeryPodleStranky.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
      casti.push(`- \`${s}\` — ${n}×`);
    }
  }

  if (nezapsane.length) {
    casti.push('');
    casti.push('## Nezapsané stránky s [DOPLNIT]');
    for (const s of nezapsane) casti.push(`- /${s}/ (${markeryPodleStranky.get(s)}×)`);
  }

  if (dataZavad.length) {
    casti.push('');
    casti.push('## Data bez hodnot');
    for (const d of dataZavad) casti.push(`- ${d}`);
  }

  casti.push('');
  fs.writeFileSync(VYSTUP, casti.join('\n'), 'utf8');
  console.log(`\nZapsáno: ${path.relative(ROOT, VYSTUP)}`);
}

if (chyby.length || nezapsane.length) process.exitCode = 1;
