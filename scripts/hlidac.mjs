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
      },
    });
    if (res.ok) {
      const data = await res.json();
      return `release:${data.tag_name}:${data.published_at ?? ''}`;
    }
    const commits = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/commits?per_page=1`, {
      signal: AbortSignal.timeout(20000),
      headers: {
        'user-agent': 'LocalInference-hlidac/0.1',
        accept: 'application/vnd.github+json',
      },
    });
    if (!commits.ok) throw new Error(`GitHub API ${commits.status}`);
    const data = await commits.json();
    return `commit:${data[0]?.sha ?? 'unknown'}`;
  }

  if (source.typ === 'hf') {
    const m = url.match(/huggingface\.co\/([^/]+)\/([^/#?]+)/);
    if (!m) throw new Error('nejde rozpoznat Hugging Face model');
    const api = `https://huggingface.co/api/models/${m[1]}/${m[2]}`;
    const data = JSON.parse(await fetchText(api));
    return `hf:${data.sha ?? ''}:${data.lastModified ?? ''}`;
  }

  if (source.typ === 'rss') {
    const text = await fetchText(url);
    const items = [...text.matchAll(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi)]
      .slice(0, 10)
      .map((x) => x[0].replace(/\s+/g, ' '));
    return `rss:${hash(items.join('|') || text.slice(0, 20000))}`;
  }

  const text = await fetchText(url);
  return `text:${hash(stripHtml(text).slice(0, 200000))}`;
}

for (const source of sources) {
  const previous = state[source.id];
  try {
    const sig = await signature(source);
    const status = !previous ? 'new' : previous.signature !== sig ? 'changed' : 'ok';
    if (status !== 'ok') changed++;
    state[source.id] = {
      url: source.url,
      signature: sig,
      checkedAt: new Date().toISOString(),
      status,
    };
    report.push({ source, status, detail: status === 'changed' ? `${previous.signature} → ${sig}` : sig });
    console.log(`${status === 'ok' ? '·' : '!'} ${source.id}: ${status}`);
  } catch (e) {
    errors++;
    state[source.id] = {
      url: source.url,
      signature: previous?.signature ?? null,
      checkedAt: new Date().toISOString(),
      status: 'error',
      error: String(e.message ?? e),
    };
    report.push({ source, status: 'error', detail: String(e.message ?? e) });
    console.warn(`✗ ${source.id}: ${e.message}`);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n');

const lines = [
  '# Hlídač zdrojů',
  '',
  `Kontrola: ${new Date().toISOString()}`,
  `Zdroje: ${sources.length}, změny: ${changed}, chyby: ${errors}`,
  '',
  '| Zdroj | Stav | Detail |',
  '|---|---|---|',
  ...report.map((r) => `| ${r.source.id} | ${r.status} | ${String(r.detail).replace(/\|/g, '\\|')} |`),
  '',
  '> Hlídač nic nemění. Změny se řeší ručně a zapisují do `data/zmeny.yaml`.',
];
fs.writeFileSync(reportFile, lines.join('\n'));

console.log(`\nReport: ${path.relative(root, reportFile)}`);
console.log(`Změny: ${changed}, chyby: ${errors}`);
