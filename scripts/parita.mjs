// Parita CZ a EN obsahu.
// Porovná routy v sites/cz a sites/eu, vypíše chybějící EN stránky.
// `--strict` ukončí chybou, pokud něco chybí. `--zapis` zapíše data/preklady.yaml.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CZ = path.join(ROOT, 'sites/cz/src/content/docs');
const EN = path.join(ROOT, 'sites/eu/src/content/docs');
const STRICT = process.argv.includes('--strict');
const ZAPIS = process.argv.includes('--zapis');

const SEKCE = {
  zaciname: 'getting-started',
  zarizeni: 'devices',
  vyber: 'choosing',
  modely: 'models',
  generovani: 'generation',
  navody: 'guides',
  slovnik: 'dictionary',
  temata: 'topics',
  rychlost: 'speed',
  zdroje: 'sources',
  'o-webu': 'about',
  data: 'data',
};

const SLUGY = {
  'co-je-lokalni-ai': 'what-is-local-ai',
  'jak-to-funguje': 'how-it-works',
  'jak-cteme-data': 'how-we-read-data',
  prostredi: 'environment',
  'ai-boxy': 'ai-boxes',
  'ai-notebooky': 'ai-laptops',
  srovnani: 'compare',
  'proc-moe': 'why-moe',
  obrazky: 'images',
  'uprava-obrazku': 'image-editing',
  'uprava-videa': 'video-editing',
  'rozhybani-obrazku': 'image-to-video',
  preklady: 'translation',
  'herni-prvky': 'game-assets',
  licence: 'licensing',
  recepty: 'recipes',
  rozpocet: 'budget',
  'stolni-vs-notebook': 'desktop-vs-laptop',
  'kolik-uzivatelu': 'how-many-users',
  'bezpecna-volba': 'safe-choice',
  kvantizace: 'quantization',
  llamacpp: 'llamacpp',
  'kv-cache': 'kv-cache',
  'unified-memory': 'unified-memory',
  kontext: 'context',
  'propustnost-pameti': 'memory-bandwidth',
  soubeznost: 'concurrency',
  paralelizace: 'parallelism',
  'tok-s': 'tokens-per-second',
  ttft: 'ttft',
  prefill: 'prefill',
  decode: 'decode',
  tflops: 'tflops',
  roofline: 'roofline',
  kalkulacka: 'calculator',
  'power-limit': 'power-limit',
  throttling: 'throttling',
  difuze: 'diffusion',
  lora: 'lora',
  pbr: 'pbr',
  tts: 'tts',
  stt: 'stt',
  inpainting: 'inpainting',
  upscaling: 'upscaling',
  vision: 'vision',
  rag: 'rag',
  mtp: 'mtp',
  nvfp4: 'nvfp4',
  gguf: 'gguf',
  ollama: 'ollama',
  vulkan: 'vulkan',
  wsl2: 'wsl2',
  huggingface: 'huggingface',
  'agentni-ulohy': 'agentic-tasks',
  'lokalni-ai-pro-firmy': 'local-ai-for-business',
  'cena-lokalni-ai': 'cost-of-local-ai',
  '128gb-unified-memory': '128gb-unified-memory',
  'lokalni-ai-na-windows-11': 'local-ai-on-windows-11',
  'lokalni-ai-na-obrazky': 'local-ai-images',
  'lokalni-ai-na-video': 'local-ai-video',
  'lokalni-ai-na-audio': 'local-ai-audio',
  'lokalni-ai-na-3d': 'local-ai-3d',
  'pamet-agenta': 'agent-memory',
  'navrh-nastroju': 'tool-design',
  'model-routing': 'model-routing',
  observability: 'observability',
  'zalohy-a-obnova': 'backups-and-recovery',
  'kontext-engineering': 'context-engineering',
  'kvantizace-v-praxi': 'quantization-in-practice',
  'elektrina-hluk-teplo': 'electricity-noise-heat',
  'odmitani': 'refusals',
  'jak-abliterace-funguje': 'how-abliteration-works',
  'provoz-na-128-gb': 'running-on-128gb',
  'rizika-a-pravo': 'risks-and-law',
  'kdo-je-tvori': 'who-makes-them',
  'kde-provozovat-agenty': 'where-to-run-agents',
  'function-calling-v-praxi': 'function-calling',
  'mcp-v-praxi': 'mcp',
  'coding-agent': 'coding-agents',
  'office-automatizace': 'office-automation',
  'bezpecnost-agenta': 'agent-security',
  'nastroje': 'tools',
  'opencode-a-openchamber': 'opencode-and-openchamber',
  'jak-model-zvlada-cestinu': 'czech-language',
  'shrnuti-dokumentu': 'document-summaries',
  'extrakce-dat': 'data-extraction',
  'preklad-a-korektura': 'translation-and-proofreading',
  'hodnoceni-kvality': 'quality-evaluation',
  'pdf-a-skeny': 'pdf-and-scans',
  'embeddingy-v-praxi': 'embeddings-in-practice',
  'citace-a-hodnoceni': 'citations-and-evaluation',
  'opravneni-a-bezpecnost': 'permissions-and-security',
  'api-server': 'api-server',
  'monitoring': 'monitoring',
  'aktualizace': 'updates',
  'bezpecnost-provozu': 'security',
  'gdpr-a-ai-act': 'gdpr-and-ai-act',
  'reseni-problemu': 'troubleshooting',
  'sandbox-agentu': 'agent-sandbox',
  'pravo': 'law',
  'ucetnictvi': 'accounting',
  'vyroba': 'manufacturing',
  'vyvojari': 'developers',
  'embeddingy': 'embeddings',
  'orchestrace-agentu': 'agent-orchestration',
  'teplota-vzorkovani': 'sampling-temperature',
  'vektorova-databaze': 'vector-database',
  'pamet': 'memory',
  'vykon': 'performance',
  'provoz': 'operations',
  'agenti': 'agents',
  'abliterace': 'abliteration',
  'cestina': 'czech-and-documents',
  'praxe': 'practice',
  mereni: 'measurements',
  zdroje: 'sources',
  'co-nevime': 'what-we-dont-know',
  novinky: 'changelog',
  metodika: 'methodology',
  'jak-piseme': 'how-we-write',
  pravni: 'legal',
  faq: 'faq',
};

function projdi(dir) {
  if (!fs.existsSync(dir)) return [];
  const vysledek = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) vysledek.push(...projdi(p));
    else if (/\.(md|mdx)$/.test(e.name)) vysledek.push(p);
  }
  return vysledek;
}

function routa(dir, soubor) {
  let r = path.relative(dir, soubor).replaceAll('\\', '/').replace(/\.(md|mdx)$/, '');
  if (r.endsWith('/index')) r = r.slice(0, -'/index'.length);
  if (r === 'index') r = '';
  return r;
}

function enRouta(cz) {
  if (!cz) return '';
  const casti = cz.split('/');
  const sekce = SEKCE[casti[0]] ?? casti[0];
  const zbytek = casti.slice(1).map((s) => SLUGY[s] ?? s);
  return [sekce, ...zbytek].filter(Boolean).join('/');
}

const czSoubory = projdi(CZ);
const enSoubory = new Set(projdi(EN).map((f) => routa(EN, f)));
const maZarizeni = fs.existsSync(path.join(ROOT, 'sites/eu/src/pages/devices/[id].astro'));
const maSlovnik = fs.existsSync(path.join(ROOT, 'sites/eu/src/pages/dictionary/[group]/[slug].astro'));
const maTemata = fs.existsSync(path.join(ROOT, 'sites/eu/src/pages/topics/[slug].astro'));
const dynamickaZarizeni = new Set([
  'dgx-spark',
  'strix-halo',
  'gorgon-halo',
  'rtx-spark-mini',
  'rtx-spark-notebook',
  'mac-studio',
  'macbook-pro',
]);

const chybi = [];
const hotovo = [];

// Dynamické routy v EN nekryjí celý CZ obsah: témata a slovník jsou
// stuby z data/en/*.yaml. Parita proto počítá jen to, co v EN datech
// nebo souborech skutečně existuje.
function nactiEn(rel) {
  const p = path.join(ROOT, 'data/en', rel);
  if (!fs.existsSync(p)) return [];
  return yaml.load(fs.readFileSync(p, 'utf8')) ?? [];
}
const enTemata = new Set(nactiEn('temata.yaml').map((t) => t.slug));
const enSlovnik = new Set(nactiEn('slovnik.yaml').map((e) => `${e.group}/${e.slug}`));

for (const f of czSoubory) {
  const cz = routa(CZ, f);
  const en = enRouta(cz);
  const casti = cz.split('/');
  const posledni = casti[casti.length - 1];
  const ploche = `topics/${SLUGY[posledni] ?? posledni}`;
  const jeDynamicke =
    (maZarizeni && cz.startsWith('zarizeni/') && dynamickaZarizeni.has(casti[1])) ||
    (maSlovnik &&
      cz.startsWith('slovnik/') &&
      casti.length >= 3 &&
      enSlovnik.has(casti.slice(1).map((s) => SLUGY[s] ?? s).join('/'))) ||
    (maTemata &&
      cz.startsWith('temata/') &&
      casti.length >= 2 &&
      (enTemata.has(ploche.split('/')[1]) || enSoubory.has(ploche))) ||
    cz === '404';
  if (enSoubory.has(en) || jeDynamicke) hotovo.push({ cz, en });
  else chybi.push({ cz, en });
}

// Dynamické stránky konfigurací: 25 OEM variant.
const maKonfigurace = fs.existsSync(path.join(ROOT, 'sites/eu/src/pages/devices/configurations/[id].astro'));

const podleSekce = {};
for (const c of chybi) {
  const s = c.cz.split('/')[0] || 'root';
  podleSekce[s] = (podleSekce[s] ?? 0) + 1;
}

console.log(`CZ stránek: ${czSoubory.length}`);
console.log(`EN hotovo: ${hotovo.length}`);
console.log(`Chybí: ${chybi.length}`);
console.log(`Konfigurace: ${maKonfigurace ? 'hotovo (25)' : 'chybí'}`);
for (const [s, n] of Object.entries(podleSekce).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${s}: ${n}`);
}
if (chybi.length) {
  console.log('\nPrvních 25 chybějících:');
  for (const c of chybi.slice(0, 25)) console.log(`  ${c.cz || '(home)'} → ${c.en || '(home)'}`);
}

if (ZAPIS) {
  const data = [
    ...hotovo.map((h) => ({ cz: h.cz, en: h.en, stav: 'hotovo' })),
    ...chybi.map((h) => ({ cz: h.cz, en: h.en, stav: 'ceka' })),
    { cz: 'zarizeni/konfigurace/<id>', en: 'devices/configurations/<id>', stav: maKonfigurace ? 'hotovo' : 'ceka' },
  ];
  fs.writeFileSync(
    path.join(ROOT, 'data/preklady.yaml'),
    '# Stav překladu CZ → EN. Generuje npm run parita -- --zapis.\n' + yaml.dump(data, { noRefs: true }),
    'utf8',
  );
  console.log('\nZapsáno: data/preklady.yaml');
}

if (STRICT && chybi.length) process.exitCode = 1;
