import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { dgxSparkOem, generativniModel, historieCen, kurz, mereni, model, rtxMiniOem, rtxNotebookOem, strixHaloOem, tema, zdroj, zarizeni, zmena } from './schema.mjs';

const root = process.cwd();
const dataDir = path.join(root, 'data');
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

function readYaml(name) {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) {
    fail(`chybí ${path.relative(root, file)}`);
    return null;
  }
  try {
    return yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    fail(`${name}: YAML se nenačetl — ${e.message}`);
    return null;
  }
}

function validate(name, schema, value) {
  if (!Array.isArray(value)) {
    fail(`${name}: očekávám seznam`);
    return [];
  }
  const out = [];
  value.forEach((item, i) => {
    const parsed = schema.safeParse(item);
    if (!parsed.success) {
      const id = item?.id ?? `#${i + 1}`;
      for (const issue of parsed.error.issues) {
        fail(`${name} / ${id}: ${issue.path.join('.')} — ${issue.message}`);
      }
    } else {
      out.push(parsed.data);
    }
  });
  return out;
}

function checkDuplicates(name, items) {
  const ids = items.map((x) => x.id).filter(Boolean);
  if (ids.length === 0) return;
  const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dup.length) fail(`${name}: duplicitní id — ${dup.join(', ')}`);
}

function checkUrls(label, urls) {
  for (const u of urls ?? []) {
    try {
      new URL(u);
    } catch {
      fail(`${label}: neplatná URL ${u}`);
    }
  }
}

function isFuture(date) {
  return new Date(`${date}T00:00:00Z`) > new Date();
}

function daysOld(date) {
  const d = new Date(`${date}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - d) / 86400000);
}

const zarizeniData = readYaml('zarizeni.yaml');
const dgxSparkOemData = readYaml('dgx-spark-oem.yaml');
const rtxNotebookOemData = readYaml('rtx-spark-notebook-oem.yaml');
const rtxMiniOemData = readYaml('rtx-spark-mini-oem.yaml');
const strixHaloOemData = readYaml('strix-halo-oem.yaml');
const temataData = readYaml('temata.yaml');
const historieData = readYaml('historie-cen.yaml');
const generativniData = readYaml('generativni-modely.yaml');
const modelyData = readYaml('modely.yaml');
const mereniData = readYaml('mereni.yaml');
const zdrojeData = readYaml('zdroje.yaml');
const kurzyData = readYaml('kurzy.yaml');
const zmenyData = readYaml('zmeny.yaml');

const zarizeniList = validate('data/zarizeni.yaml', zarizeni, zarizeniData);
const dgxSparkOemList = validate('data/dgx-spark-oem.yaml', dgxSparkOem, dgxSparkOemData);
const rtxNotebookOemList = validate('data/rtx-spark-notebook-oem.yaml', rtxNotebookOem, rtxNotebookOemData);
const rtxMiniOemList = validate('data/rtx-spark-mini-oem.yaml', rtxMiniOem, rtxMiniOemData);
const strixHaloOemList = validate('data/strix-halo-oem.yaml', strixHaloOem, strixHaloOemData);
const temataList = validate('data/temata.yaml', tema, temataData);
const historieList = validate('data/historie-cen.yaml', historieCen, historieData);
const generativniList = validate('data/generativni-modely.yaml', generativniModel, generativniData);
const modelyList = validate('data/modely.yaml', model, modelyData);
const mereniList = validate('data/mereni.yaml', mereni, mereniData);
const zdrojeList = validate('data/zdroje.yaml', zdroj, zdrojeData);
const kurzyList = validate('data/kurzy.yaml', kurz, kurzyData);
const zmenyList = validate('data/zmeny.yaml', zmena, zmenyData);

checkDuplicates('data/zarizeni.yaml', zarizeniList);
checkDuplicates('data/dgx-spark-oem.yaml', dgxSparkOemList);
checkDuplicates('data/rtx-spark-notebook-oem.yaml', rtxNotebookOemList);
checkDuplicates('data/rtx-spark-mini-oem.yaml', rtxMiniOemList);
checkDuplicates('data/strix-halo-oem.yaml', strixHaloOemList);
checkDuplicates('data/temata.yaml', temataList);
checkDuplicates('data/historie-cen.yaml', historieList);
checkDuplicates('data/generativni-modely.yaml', generativniList);
checkDuplicates('data/modely.yaml', modelyList);
checkDuplicates('data/mereni.yaml', mereniList);
checkDuplicates('data/zdroje.yaml', zdrojeList);
checkDuplicates('data/zmeny.yaml', zmenyList);

const zarizeniIds = new Set(zarizeniList.map((x) => x.id));
const modelIds = new Set(modelyList.map((x) => x.id));

for (const o of dgxSparkOemList) {
  if (o.pamet_gb !== 128) warn(`data/dgx-spark-oem.yaml / ${o.id}: GB10 stroj má obvykle 128 GB`);
  const pomer = o.cena_czk_s_dph / o.cena_czk_bez_dph;
  if (pomer < 1.15 || pomer > 1.25) warn(`data/dgx-spark-oem.yaml / ${o.id}: poměr ceny s/bez DPH je ${pomer.toFixed(3)}`);
}

for (const o of strixHaloOemList) {
  if (o.pamet_gb !== 128) warn(`data/strix-halo-oem.yaml / ${o.id}: Strix Halo má obvykle 128 GB`);
  if (o.cena_czk_s_dph != null && o.cena_czk_bez_dph != null) {
    const pomer = o.cena_czk_s_dph / o.cena_czk_bez_dph;
    if (pomer < 1.15 || pomer > 1.25) warn(`data/strix-halo-oem.yaml / ${o.id}: poměr ceny s/bez DPH je ${pomer.toFixed(3)}`);
  }
}

for (const o of rtxMiniOemList) {
  if (o.pamet_gb !== 128) warn(`data/rtx-spark-mini-oem.yaml / ${o.id}: RTX Spark mini zařazujeme jen ve 128 GB`);
  if (o.cena_czk_s_dph != null && o.cena_czk_bez_dph != null) {
    const pomer = o.cena_czk_s_dph / o.cena_czk_bez_dph;
    if (pomer < 1.15 || pomer > 1.25) warn(`data/rtx-spark-mini-oem.yaml / ${o.id}: poměr ceny s/bez DPH je ${pomer.toFixed(3)}`);
  }
}

for (const o of rtxNotebookOemList) {
  if (o.pamet_gb !== 128) warn(`data/rtx-spark-notebook-oem.yaml / ${o.id}: RTX Spark notebook má obvykle 128 GB`);
  if (o.cena_czk_s_dph != null && o.cena_czk_bez_dph != null) {
    const pomer = o.cena_czk_s_dph / o.cena_czk_bez_dph;
    if (pomer < 1.15 || pomer > 1.25) warn(`data/rtx-spark-notebook-oem.yaml / ${o.id}: poměr ceny s/bez DPH je ${pomer.toFixed(3)}`);
  }
}

// Bez objednacího kódu se cena na Alze nedá dohledat ani ověřit.
for (const [name, items] of [
  ['data/dgx-spark-oem.yaml', dgxSparkOemList],
  ['data/rtx-spark-notebook-oem.yaml', rtxNotebookOemList],
  ['data/rtx-spark-mini-oem.yaml', rtxMiniOemList],
  ['data/strix-halo-oem.yaml', strixHaloOemList],
]) {
  for (const o of items) {
    if (!String(o.objednaci_kod ?? '').trim()) {
      fail(`${name} / ${o.id}: chybí objednaci_kod — cena by se nedala ověřit`);
    }
  }
}

// Alza: affiliate parametr patří na kategorii, nikdy na produktovou stránku.
const alzaUrl = (u) => {
  try {
    const url = new URL(u);
    return url.hostname === 'alza.cz' || url.hostname.endsWith('.alza.cz');
  } catch {
    return false;
  }
};
const alzaZaznamy = [];
for (const z of zarizeniList) {
  if (z.cena?.zdroj) alzaZaznamy.push([`data/zarizeni.yaml / ${z.id} (cena)`, z.cena.zdroj]);
  if (z.cena_czk?.zdroj) alzaZaznamy.push([`data/zarizeni.yaml / ${z.id} (cena_czk)`, z.cena_czk.zdroj]);
  for (const u of z.zdroje ?? []) alzaZaznamy.push([`data/zarizeni.yaml / ${z.id} (zdroje)`, u]);
}
for (const [name, items] of [
  ['data/dgx-spark-oem.yaml', dgxSparkOemList],
  ['data/rtx-spark-notebook-oem.yaml', rtxNotebookOemList],
  ['data/rtx-spark-mini-oem.yaml', rtxMiniOemList],
  ['data/strix-halo-oem.yaml', strixHaloOemList],
]) {
  for (const o of items) {
    if (o.url) alzaZaznamy.push([`${name} / ${o.id} (url)`, o.url]);
    if (o.zdroj) alzaZaznamy.push([`${name} / ${o.id} (zdroj)`, o.zdroj]);
  }
}
for (const z of zdrojeList) alzaZaznamy.push([`data/zdroje.yaml / ${z.id}`, z.url]);
for (const [kde, u] of alzaZaznamy) {
  if (!alzaUrl(u)) continue;
  if (/[?&]idp=/.test(u)) {
    fail(`${kde}: affiliate parametr v datech — affiliate odkazy patří jen na /kde-koupit/`);
  }
}

// Rozsah od/do musí odpovídat pojmenovaným konfiguracím, jinak se rozejde s textem.
for (const z of zarizeniList) {
  const k = z.konfigurace;
  if (!k?.length) continue;
  if (!z.cena_czk) {
    fail(`data/zarizeni.yaml / ${z.id}: má konfigurace, ale chybí cena_czk`);
    continue;
  }
  const ceny = k.map((x) => x.cena_czk_s_dph);
  const min = Math.min(...ceny);
  const max = Math.max(...ceny);
  if (z.cena_czk.od !== min) {
    fail(`data/zarizeni.yaml / ${z.id}: cena_czk.od ${z.cena_czk.od} neodpovídá nejlevnější konfiguraci ${min}`);
  }
  if ((z.cena_czk.do ?? z.cena_czk.od) !== max) {
    fail(`data/zarizeni.yaml / ${z.id}: cena_czk.do ${z.cena_czk.do} neodpovídá nejdražší konfiguraci ${max}`);
  }
}

for (const m of mereniList) {
  if (!zarizeniIds.has(m.zarizeni)) fail(`data/mereni.yaml / ${m.id}: neznámé zařízení ${m.zarizeni}`);
  if (!modelIds.has(m.model)) fail(`data/mereni.yaml / ${m.id}: neznámý model ${m.model}`);
  if (m.typ === 'namereno' && (!m.zdroj || !m.mereno_kym)) {
    fail(`data/mereni.yaml / ${m.id}: naměřené číslo musí mít zdroj a mereno_kym`);
  }
  if (m.typ === 'namereno' && m.decode_toks == null && m.prefill_toks == null && m.ttft_ms == null && m.agregat_toks == null) {
    warn(`data/mereni.yaml / ${m.id}: naměřený záznam nemá ani decode, prefill, TTFT ani agregát`);
  }
  if (m.typ === 'vypocet' && !m.normalizace) {
    warn(`data/mereni.yaml / ${m.id}: výpočet by měl mít poznámku, z čeho vychází`);
  }
}

for (const [name, items] of [
  ['data/zarizeni.yaml', zarizeniList],
  ['data/dgx-spark-oem.yaml', dgxSparkOemList],
  ['data/rtx-spark-notebook-oem.yaml', rtxNotebookOemList],
  ['data/rtx-spark-mini-oem.yaml', rtxMiniOemList],
  ['data/strix-halo-oem.yaml', strixHaloOemList],
  ['data/temata.yaml', temataList],
  ['data/modely.yaml', modelyList],
  ['data/mereni.yaml', mereniList],
  ['data/zdroje.yaml', zdrojeList],
  ['data/zmeny.yaml', zmenyList],
]) {
  for (const item of items) {
    if (item.overeno && isFuture(item.overeno)) fail(`${name} / ${item.id}: overeno je v budoucnosti`);
    if (item.overeno && daysOld(item.overeno) > 365) warn(`${name} / ${item.id}: overeno je starší než rok`);
    if (item.zdroj) checkUrls(`${name} / ${item.id}`, [item.zdroj]);
    if (item.zdroje) checkUrls(`${name} / ${item.id}`, item.zdroje);
  }
}

for (const [name, items] of [
  ['data/zarizeni.yaml', zarizeniList],
  ['data/modely.yaml', modelyList],
  ['data/zdroje.yaml', zdrojeList],
]) {
  for (const item of items) {
    if (item.posledni_kontrola && daysOld(item.posledni_kontrola) > 45) {
      warn(`${name} / ${item.id}: poslední kontrola je starší než 45 dní`);
    }
  }
}

const latestKurz = kurzyList.sort((a, b) => b.datum.localeCompare(a.datum))[0];
if (!latestKurz) fail('data/kurzy.yaml: chybí kurz');
else if (daysOld(latestKurz.datum) > 14) warn(`data/kurzy.yaml: nejnovější kurz je starší než 14 dní (${latestKurz.datum})`);

const registered = new Set(zdrojeList.map((z) => z.url));
const referenced = new Set();
for (const z of zarizeniList) for (const u of z.zdroje) referenced.add(u);
for (const o of dgxSparkOemList) referenced.add(o.zdroj);
for (const o of rtxNotebookOemList) referenced.add(o.zdroj);
for (const o of rtxMiniOemList) referenced.add(o.zdroj);
for (const o of strixHaloOemList) referenced.add(o.zdroj);
for (const m of modelyList) for (const u of m.zdroje) referenced.add(u);
for (const m of mereniList) referenced.add(m.zdroj);
for (const u of referenced) {
  if (u.startsWith('https://localinference.cz') || u.startsWith('https://www.localinference.cz')) continue;
  if (!registered.has(u)) warn(`zdroj není v registru data/zdroje.yaml: ${u}`);
}

console.log('');
console.log(`Data: ${zarizeniList.length} zařízení, ${dgxSparkOemList.length} GB10 OEM SKU, ${rtxNotebookOemList.length} RTX notebook OEM SKU, ${rtxMiniOemList.length} RTX mini OEM SKU, ${strixHaloOemList.length} Strix Halo OEM SKU, ${modelyList.length} modelů, ${mereniList.length} měření, ${zdrojeList.length} zdrojů, ${temataList.length} témat, ${historieList.length} historií cen, ${generativniList.length} generativních modelů, ${zmenyList.length} změn.`);
if (errors === 0) console.log(`✓ Data jsou v pořádku (${warnings} varování).`);
else console.error(`✗ ${errors} chyb, ${warnings} varování.`);

process.exit(errors === 0 ? 0 : 1);
