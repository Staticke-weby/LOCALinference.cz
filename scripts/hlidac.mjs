import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'js-yaml';

const root = process.cwd();
const sourcesFile = path.join(root, 'data/zdroje.yaml');
const stateFile = path.join(root, 'data/stav-zdroju.json');
const outDir = path.join(root, 'vystup');
const reportFile = path.join(outDir, 'hlidac-report.md');

const sources = yaml.load(fs.readFileSync(sourcesFile, 'utf8')) ?? [];
const state = fs.existsSync(stateFile)
  ? JSON.parse(fs.readFileSync(stateFile, 'utf8'))
  : {};

const report = [];
let changed = 0;
let errors = 0;

// Fronta videí: co už jsme viděli nebo zamítli. Hlídač do ní jen přidává.
const videaFile = path.join(root, 'data/videa.yaml');
const VIDEA_HLAVICKA = `# Fronta YouTube videí k zařízením.
# Hlídač sem automaticky přidává nová videa ze zdrojů recenze-youtube-*.
# \`stav\`: novy | prohlednuto | pouzito | zamitnuto
# \`kvalita\`: 1–5 (5 = nejlepší), nebo null dokud nehodnotíte
# \`proc\`: proč takový stav; u zamitnuto povinné
# \`zarizeni\`: id zařízení, ke kterému video patří
# Kontrola: npm run check:videa. Přehled: npm run videa, zápis: npm run videa:zapis

`;
let videa = (fs.existsSync(videaFile) ? yaml.load(fs.readFileSync(videaFile, 'utf8')) : null) ?? [];
if (!Array.isArray(videa)) videa = [];
let videaZmena = false;

const videoId = (url) => String(url).match(/[?&]v=([\w-]{11})/)?.[1] ?? '';

/** Odhad data publikace z relativního textu ("3mo ago") při zachycení. */
function vydanoDatum(text) {
  const d = stariDnu(text);
  if (d == null) return null;
  return new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
}

function zapisVidea() {
  if (!videaZmena) return;
  fs.writeFileSync(videaFile, VIDEA_HLAVICKA + yaml.dump(videa, { lineWidth: 160, noRefs: true }));
  videaZmena = false;
}

function hash(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Dekóduje základní entity, CDATA a JSON escapes z titulků. */
function decode(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** RSS 2.0 i Atom: vrací položky s titulkem a odkazem. */
function parseFeed(text) {
  const items = [];
  const blocks = [...text.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]);
  for (const block of blocks) {
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
    const linkRss = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? '';
    const linkAtom = block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? '';
    const datum =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ??
      block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ??
      '';
    const u = decode(linkRss || linkAtom);
    const t = decode(title);
    if (u && t) items.push({ t, u, d: decode(datum) });
  }
  return items;
}

/** Klíč pro porovnání: titulek bez diakritiky a interpunkce. */
function klic(i) {
  return i.t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .slice(0, 90);
}

/** YouTube nemá RSS pro hledání: přečte výsledky a vytáhne videa. */
function parseYouTubeSearch(html) {
  const items = [];
  const re = /"videoId":"([\w-]{11})"/g;
  let m;
  while ((m = re.exec(html)) && items.length < 40) {
    const okno = html.slice(m.index, m.index + 3000);
    const title = okno.match(/"title":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1];
    const published = okno.match(/"publishedTimeText":\{"simpleText":"([^"]+)"/)?.[1] ?? '';
    const kanal = okno.match(/"ownerText":\{"runs":\[\{"text":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '';
    const u = `https://www.youtube.com/watch?v=${m[1]}`;
    const t = title ? decode(title) : '';
    if (!t || items.some((x) => x.u === u)) continue;
    items.push({ t, u, d: decode(published), k: decode(kanal) });
  }
  return items;
}

/** Převede "2 days ago", "3mo ago" nebo "2w ago" na dny; jinak null. */
function stariDnu(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  const komp = t.match(/^(\d+)\s*(mo|y|w|d|h)\s+ago$/);
  if (komp) {
    const n = Number(komp[1]);
    const u = komp[2];
    if (u === 'h') return n / 24;
    if (u === 'd') return n;
    if (u === 'w') return n * 7;
    if (u === 'mo') return n * 30;
    return n * 365;
  }
  const m = t.match(/(\d+)\s*(hour|day|week|month|year|hodin|den|dní|dnem|dny|dnů|týden|týdnem|týdny|měsíc|mesíc|měsíci|rok|lety)/);
  if (!m) {
    if (/(hour|hodin)/.test(t)) return 0.1;
    if (/(day|dnem|den|dny)/.test(t)) return 1;
    if (/(week|týden|týdnem|týdny)/.test(t)) return 7;
    return null;
  }
  const n = Number(m[1]);
  const u = m[2];
  if (/hour|hodin/.test(u)) return n / 24;
  if (/day|den|dní|dnem|dny|dnů/.test(u)) return n;
  if (/week|týden|týdnem|týdny/.test(u)) return n * 7;
  if (/month|měsíc|mesíc|měsíci/.test(u)) return n * 30;
  return n * 365;
}

/** Ponechá jen videa z posledního týdne. */
function cerstve(items) {
  return items.filter((i) => {
    const d = stariDnu(i.d);
    return d != null && d <= 7;
  });
}

function filtr(source, items) {
  const slova = (source.filtr ?? []).map((s) => String(s).toLowerCase());
  if (!slova.length) return items;
  return items.filter((i) => slova.some((s) => i.t.toLowerCase().includes(s)));
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml,application/json,text/plain,*/*',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

/** Vrací podpis a u feedů i položky pro report novinek. */
async function signature(source) {
  const url = source.url;

  if (source.typ === 'github') {
    const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
    if (!m) throw new Error('nejde rozpoznat GitHub repo');
    const api = `https://api.github.com/repos/${m[1]}/${m[2]}/releases/latest`;
    const res = await fetch(api, {
      signal: AbortSignal.timeout(20000),
      headers: {
        'user-agent': 'LocalInference-hlidac/0.1',
        accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { authorization: 'Bearer ' + process.env.GITHUB_TOKEN } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      return { sig: `release:${data.tag_name}:${data.published_at ?? ''}`, items: [] };
    }
    const commits = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/commits?per_page=1`, {
      signal: AbortSignal.timeout(20000),
      headers: {
        'user-agent': 'LocalInference-hlidac/0.1',
        accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { authorization: 'Bearer ' + process.env.GITHUB_TOKEN } : {}),
      },
    });
    if (!commits.ok) throw new Error(`GitHub API ${commits.status}`);
    const data = await commits.json();
    return { sig: `commit:${data[0]?.sha ?? 'unknown'}`, items: [] };
  }

  if (source.typ === 'hf') {
    const m = url.match(/huggingface\.co\/([^/]+)\/([^/#?]+)/);
    if (!m) throw new Error('nejde rozpoznat Hugging Face model');
    const api = `https://huggingface.co/api/models/${m[1]}/${m[2]}`;
    const data = JSON.parse(await fetchText(api));
    return { sig: `hf:${data.sha ?? ''}:${data.lastModified ?? ''}`, items: [] };
  }

  if (source.typ === 'youtube') {
    const items = cerstve(filtr(source, parseYouTubeSearch(await fetchText(url)))).slice(0, 20);
    return { sig: `yt:${hash(items.map(klic).join('|') || 'prazdno')}`, items };
  }

  if (source.typ === 'rss') {
    const items = filtr(source, parseFeed(await fetchText(url))).slice(0, 20);
    return { sig: `rss:${hash(items.map(klic).join('|') || 'prazdno')}`, items };
  }

  const text = await fetchText(url);
  return { sig: `text:${hash(stripHtml(text).slice(0, 200000))}`, items: [] };
}

for (const source of sources) {
  const previous = state[source.id];
  if (source.kontrola === 'manual') {
    state[source.id] = {
      url: source.url,
      signature: previous?.signature ?? null,
      checkedAt: new Date().toISOString(),
      status: 'manual',
      items: previous?.items ?? [],
    };
    report.push({ source, status: 'manual', detail: 'ruční kontrola', nove: [] });
    console.log(`- ${source.id}: ruční kontrola`);
    continue;
  }
  try {
    const { sig, items } = await signature(source);

    const drivejsiSeen = Array.isArray(previous?.seen) ? previous.seen : null;
    const k = (i) => (source.typ === 'youtube' ? i.u : klic(i));
    const nove = drivejsiSeen ? items.filter((i) => !drivejsiSeen.includes(k(i))).slice(0, 10) : [];
    const seen = [...new Set([...(drivejsiSeen ?? []), ...items.map(k)])].slice(-300);

    // YouTube: nová videa zařaď do trvalé fronty, ať se nemusí procházet znovu.
    if (source.typ === 'youtube') {
      const znam = new Set(videa.map((v) => v.id));
      const dnes = new Date().toISOString().slice(0, 10);
      for (const i of items) {
        const id = videoId(i.u);
        if (!id || znam.has(id)) continue;
        videa.push({
          id,
          url: i.u,
          nazev: i.t,
          kanal: i.k ?? '',
          zarizeni: source.id.replace(/^recenze-youtube-/, ''),
          poprve: dnes,
          vydano: vydanoDatum(i.d),
          vydano_odhad: true,
          stav: 'novy',
          kvalita: null,
          proc: '',
        });
        znam.add(id);
        videaZmena = true;
        if (!nove.some((n) => n.u === i.u)) nove.push(i);
      }
    }

    state[source.id] = {
      url: source.url,
      signature: sig,
      checkedAt: new Date().toISOString(),
      status: !previous ? 'new' : nove.length ? 'changed' : 'ok',
      items: items.slice(0, 30),
      seen,
    };
    const stav = state[source.id].status;
    if (stav !== 'ok') changed++;
    report.push({
      source,
      status: stav,
      detail: stav === 'changed' ? `${nove.length} nových` : items.length ? `${items.length} položek` : sig,
      nove,
    });
    console.log(`${stav === 'ok' ? '·' : '!'} ${source.id}: ${stav}${nove.length ? ` (+${nove.length})` : ''}`);
  } catch (e) {
    errors++;
    state[source.id] = {
      url: source.url,
      signature: previous?.signature ?? null,
      checkedAt: new Date().toISOString(),
      status: 'error',
      error: String(e.message ?? e),
      items: previous?.items ?? [],
      seen: previous?.seen ?? [],
    };
    report.push({ source, status: 'error', detail: String(e.message ?? e), nove: [] });
    console.warn(`✗ ${source.id}: ${e.message}`);
  }
}

fs.mkdirSync(outDir, { recursive: true });
zapisVidea();
const currentIds = new Set(sources.map((s) => s.id));
const nextState = Object.fromEntries(Object.entries(state).filter(([id]) => currentIds.has(id)));
fs.writeFileSync(stateFile, JSON.stringify(nextState, null, 2) + '\n');

const novinky = report.flatMap((r) => r.nove.map((n) => ({ id: r.source.id, ...n })));

const lines = [
  '# Hlídač zdrojů',
  '',
  `Kontrola: ${new Date().toISOString()}`,
  `Zdroje: ${sources.length}, změny: ${changed}, chyby: ${errors}, nové položky: ${novinky.length}`,
  '',
  '| Zdroj | Stav | Detail |',
  '|---|---|---|',
  ...report.map((r) => `| ${r.source.id} | ${r.status} | ${String(r.detail).replace(/\|/g, '\\|')} |`),
];

if (novinky.length) {
  lines.push('', '## Nové položky', '');
  for (const n of novinky) {
    lines.push(`- **${n.id}**: [${n.t}](${n.u})${n.d ? ` — ${n.d}` : ''}`);
  }
}

lines.push('', '> Hlídač nic nemění. Změny se řeší ručně a zapisují do `data/zmeny.yaml`.');

fs.writeFileSync(reportFile, lines.join('\n'));

console.log(`\nReport: ${path.relative(root, reportFile)}`);
console.log(`Změny: ${changed}, chyby: ${errors}, nové: ${novinky.length}`);
