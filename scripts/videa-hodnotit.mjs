// Automatické hodnocení YouTube videí z popisu a titulků.
// Nehodnotí produkci ani názor; hledá, co video obsahuje: zařízení,
// čísla (tok/s, GB, W, dB), délku a dostupnost titulků.
// Zápis: `node scripts/videa-hodnotit.mjs` (jen položky se stavem novy).

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const file = path.join(process.cwd(), 'data/videa.yaml');
const HLAVICKA = fs
  .readFileSync(file, 'utf8')
  .split('\n')
  .filter((l) => l.startsWith('#'))
  .join('\n');
let videa = yaml.load(fs.readFileSync(file, 'utf8')) ?? [];

const ZARIZENI = {
  'dgx-spark': ['dgx spark', 'dgx'],
  'rtx-spark-mini': ['rtx spark', 'spark mini'],
  'rtx-spark-notebook': ['rtx spark', 'spark laptop', 'spark notebook'],
  'strix-halo': ['strix halo', 'ryzen ai max'],
  'gorgon-halo': ['gorgon halo', 'ryzen ai max+ pro 495', 'max+ pro 495'],
  'mac-studio': ['mac studio'],
  'macbook-pro': ['macbook pro'],
};

const CISLA = /(?<![\d:.,])(\d+(?:[.,]\d+)?)\s*(tok\/s|t\/s|token\/s|gb\/s|gb|w|dba|db|°c)(?![\w])/gi;
const KLIKBAIT = /(you won'?t believe|insane|mind.?blowing|shocking|game.?changer|must see|top \d+)/i;

function decode(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

async function stahni(url, timeout = 20000, pokus = 0) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9,cs;q=0.8',
    },
    signal: AbortSignal.timeout(timeout),
  });
  if (res.status === 429 && pokus < 3) {
    await new Promise((r) => setTimeout(r, 3000 * (pokus + 1)));
    return stahni(url, timeout, pokus + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function popisZHtml(html) {
  const popis = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '';
  const delka = Number(html.match(/"lengthSeconds":"(\d+)"/)?.[1] ?? 0);
  const vydano = html.match(/"publishDate":"(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
  const shlednuti = Number(html.match(/"viewCount":"(\d+)"/)?.[1] ?? 0);
  return { popis: decode(popis), delka, vydano, shlednuti };
}

async function titulky(html) {
  const m = html.match(/"captionTracks":\[\{"baseUrl":"((?:[^"\\]|\\.)*)"/);
  if (!m) return '';
  const url = decode(m[1]).replace(/\\\//g, '/');
  try {
    const xml = await stahni(url, 25000);
    return xml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return '';
  }
}

function popisVidea(desc) {
  const lines = String(desc)
    .split('\n')
    .map((s) => s.trim())
    .filter(
      (s) =>
        s &&
        !/^https?:/i.test(s) &&
        !/^[0-9]+:[0-9]{2}/.test(s) &&
        !/(amzn|geni\.us|link\.amazon|patreon|sponsor|affiliate|gear|checklist)/i.test(s),
    );
  const text = lines.join(' ').replace(/\s+/g, ' ').trim();
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(' ').slice(0, 280);
}

function nazorVidea(desc) {
  const sentences = String(desc).replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
  const klic =
    /(recommend|worth it|don'?t buy|do not buy|avoid|i returned|better than|worse than|verdict|doporučuji|nedoporučuji|nekupte|vyplatí|nevyplatí)/i;
  return sentences.find((s) => klic.test(s) && s.length < 320) ?? '';
}

function ohodnot(video, html, titulkyText) {
  const info = popisZHtml(html);
  const text = `${info.popis} ${titulkyText}`;
  const zarizeni = ZARIZENI[video.zarizeni] ?? [];
  const vTextu = zarizeni.some((z) => text.toLowerCase().includes(z));
  const cisla = [...new Set([...text.matchAll(CISLA)].map((m) => m[0].replace(/\s+/g, ' ').toLowerCase()))];
  const minut = Math.round(info.delka / 60);
  const klikbait = KLIKBAIT.test(video.nazev);
  const vNazvu = zarizeni.some((z) => video.nazev.toLowerCase().includes(z));

  let skore = 0;
  if (info.popis.length >= 250) skore += 1;
  if (titulkyText.length > 2000) skore += 1;
  if (vTextu) skore += 1;
  if (vNazvu) skore += 1;
  if (cisla.length >= 5) skore += 2;
  else if (cisla.length >= 2) skore += 1;
  if (info.delka >= 480) skore += 1;
  if (klikbait) skore -= 1;
  if (!info.popis && !titulkyText) skore = 0;
  if (!vTextu) skore = Math.min(skore, 3);

  const kvalita = Math.max(1, Math.min(5, skore));

  const casti = ['Automaticky z popisu a titulků.'];
  if (minut) casti.push(`Délka ${minut} min.`);
  if (cisla.length) casti.push(`Zmiňuje ${cisla.slice(0, 3).join(', ')}.`);
  if (vTextu) casti.push('Zařízení je v textu jmenované.');
  else casti.push('Zařízení v textu přímo nejmenuje.');
  if (klikbait) casti.push('Titulek je bulvární.');

  return {
    kvalita,
    stav: 'prohlednuto',
    auto: true,
    delka_s: info.delka || null,
    vydano: info.vydano ?? video.vydano ?? null,
    vydano_odhad: info.vydano ? false : (video.vydano_odhad ?? false),
    shlednuti: info.shlednuti || null,
    cisla,
    popis: popisVidea(info.popis),
    nazor: nazorVidea(info.popis),
    popis_auto: true,
    nazor_auto: true,
    proc: casti.join(' '),
  };
}

let zmen = 0;
const VSE = process.argv.includes('--vse');
for (const v of videa) {
  if (v.stav !== 'novy' && !(VSE && v.auto)) continue;
  try {
    const html = await stahni(v.url);
    const titulkyText = await titulky(html);
    const hodnoceni = ohodnot(v, html, titulkyText);
    if (v.popis && v.popis_auto === false) {
      delete hodnoceni.popis;
      delete hodnoceni.nazor;
      delete hodnoceni.popis_auto;
      delete hodnoceni.nazor_auto;
    }
    if (titulkyText.length > 500) {
      hodnoceni.proc += ' Titulky dostupné.';
      hodnoceni.titulky = true;
    } else {
      hodnoceni.proc += ' Titulky nedostupné nebo krátké.';
      hodnoceni.titulky = false;
    }
    Object.assign(v, hodnoceni);
    zmen++;
    console.log(`✓ ${v.id} ${v.kvalita}/5 ${v.nazev}`);
  } catch (e) {
    Object.assign(v, {
      stav: 'novy',
      auto: true,
      proc: `Načtení popisu se nepodařilo (${e.message}); zkusí se znovu při dalším běhu.`,
    });
    console.log(`✗ ${v.id} ${e.message}`);
    continue;
  }
  await new Promise((r) => setTimeout(r, 400));
}

fs.writeFileSync(file, HLAVICKA + '\n' + yaml.dump(videa, { lineWidth: 200, noRefs: true }));
console.log(`\nOhodnoceno: ${zmen}, celkem videí: ${videa.length}`);
