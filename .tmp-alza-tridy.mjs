import fs from 'node:fs';
import path from 'node:path';

const dist = 'sites/cz/dist';
const files = [];
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name === 'index.html') files.push(f);
  });
walk(dist);

const kategorie = (u) => (/-d\d+\.htm/.test(u) ? 'produkt' : 'kategorie');
const tridy = { cta: 0, zdroj: 0, zdrojeSekce: 0, nabidka: 0, changelog: 0 };
const stranky = new Map();

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const cesta = f.replace(dist, '').replace(/\\/g, '/').replace('/index.html', '') || '/';
  const matches = [...html.matchAll(/<a\s[^>]*href="([^"]*alza\.cz[^"]*)"[^>]*>([\s\S]{0,200}?)<\/a>/g)];
  for (const m of matches) {
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    const pred = html.slice(Math.max(0, m.index - 400), m.index);
    let trida;
    if (/class="li-alza/.test(pred)) trida = 'cta';
    else if (/^zdroj/.test(text)) trida = 'zdroj';
    else if (/changelog|novinky/i.test(cesta)) trida = 'changelog';
    else if (/^Nabídka prodejce/.test(text)) trida = 'nabidka';
    else trida = 'zdrojeSekce';
    tridy[trida]++;
    if (!stranky.has(trida)) stranky.set(trida, new Set());
    stranky.get(trida).add(cesta);
  }
}
console.log('Rozdělení odkazů na Alzu:');
for (const [k, v] of Object.entries(tridy)) {
  console.log(`  ${k.padEnd(12)} ${String(v).padStart(3)} odkazů na ${stranky.get(k)?.size ?? 0} stránkách`);
}
console.log('  celkem       ' + String(Object.values(tridy).reduce((a, b) => a + b, 0)).padStart(3));
