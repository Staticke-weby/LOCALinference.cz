import { getPreklady } from './data';

const CZ = 'https://www.localinference.cz';
const EN = 'https://www.localinference.eu';

const DICT_GROUP: Record<string, string> = {
  performance: 'vykon',
  software: 'software',
  memory: 'pamet',
  operations: 'provoz',
};
const DICT_GROUP_REV: Record<string, string> = {
  vykon: 'performance',
  software: 'software',
  pamet: 'memory',
  provoz: 'operations',
};

const DICT: Record<string, string> = {
  ttft: 'ttft',
  prefill: 'prefill',
  decode: 'decode',
  'tokens-per-second': 'tok-s',
  concurrency: 'soubeznost',
  parallelism: 'paralelizace',
  'memory-bandwidth': 'propustnost-pameti',
  tflops: 'tflops',
  cuda: 'cuda',
  rocm: 'rocm',
  vllm: 'vllm',
  llamacpp: 'llamacpp',
  quantization: 'kvantizace',
  gguf: 'gguf',
  huggingface: 'huggingface',
  nvfp4: 'nvfp4',
  mtp: 'mtp',
  ollama: 'ollama',
  vulkan: 'vulkan',
  wsl2: 'wsl2',
  rag: 'rag',
  vision: 'vision',
  'agentic-tasks': 'agentni-ulohy',
  diffusion: 'difuze',
  lora: 'lora',
  pbr: 'pbr',
  tts: 'tts',
  stt: 'stt',
  inpainting: 'inpainting',
  upscaling: 'upscaling',
  context: 'kontext',
  'kv-cache': 'kv-cache',
  'unified-memory': 'unified-memory',
  vram: 'vram',
  'power-limit': 'power-limit',
  throttling: 'throttling',
};
const DICT_REV = Object.fromEntries(Object.entries(DICT).map(([en, cz]) => [cz, en]));

const TOPIC: Record<string, string> = {
  'local-ai-for-business': 'lokalni-ai-pro-firmy',
  'cost-of-local-ai': 'cena-lokalni-ai',
  'dgx-spark': 'dgx-spark',
  'strix-halo': 'strix-halo',
  'rtx-spark': 'rtx-spark',
  'qwen3-8-flash-next': 'qwen3-8-flash-next',
  '128gb-unified-memory': '128gb-unified-memory',
  'local-ai-on-windows-11': 'lokalni-ai-na-windows-11',
  'local-ai-images': 'lokalni-ai-na-obrazky',
  'local-ai-video': 'lokalni-ai-na-video',
  'local-ai-audio': 'lokalni-ai-na-audio',
  'local-ai-3d': 'lokalni-ai-na-3d',
};
const TOPIC_REV = Object.fromEntries(Object.entries(TOPIC).map(([en, cz]) => [cz, en]));

const ZARIZENI = new Set([
  'dgx-spark',
  'strix-halo',
  'gorgon-halo',
  'rtx-spark-mini',
  'rtx-spark-notebook',
  'mac-studio',
  'macbook-pro',
]);

function cesta(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

function dvojice(cz: string, en: string) {
  return { cs: cz, en };
}

export function jazykOdkaz(pathname: string): { cs: string; en: string } {
  const p = cesta(pathname);

  if (p.startsWith('/devices/configurations/')) {
    const id = p.split('/')[3];
    return dvojice(`${CZ}/zarizeni/konfigurace/${id}/`, `${EN}/devices/configurations/${id}/`);
  }
  if (p.startsWith('/zarizeni/konfigurace/')) {
    const id = p.split('/')[3];
    return dvojice(`${CZ}/zarizeni/konfigurace/${id}/`, `${EN}/devices/configurations/${id}/`);
  }

  const zarizeniEn = p.match(/^\/devices\/([^/]+)$/);
  if (zarizeniEn && ZARIZENI.has(zarizeniEn[1])) {
    return dvojice(`${CZ}/zarizeni/${zarizeniEn[1]}/`, `${EN}/devices/${zarizeniEn[1]}/`);
  }
  const zarizeniCz = p.match(/^\/zarizeni\/([^/]+)$/);
  if (zarizeniCz && ZARIZENI.has(zarizeniCz[1])) {
    return dvojice(`${CZ}/zarizeni/${zarizeniCz[1]}/`, `${EN}/devices/${zarizeniCz[1]}/`);
  }

  const slovnikEn = p.match(/^\/dictionary\/([^/]+)\/([^/]+)$/);
  if (slovnikEn) {
    const g = DICT_GROUP[slovnikEn[1]] ?? slovnikEn[1];
    const s = DICT[slovnikEn[2]] ?? slovnikEn[2];
    return dvojice(`${CZ}/slovnik/${g}/${s}/`, `${EN}/dictionary/${slovnikEn[1]}/${slovnikEn[2]}/`);
  }
  const slovnikCz = p.match(/^\/slovnik\/([^/]+)\/([^/]+)$/);
  if (slovnikCz) {
    const g = DICT_GROUP_REV[slovnikCz[1]] ?? slovnikCz[1];
    const s = DICT_REV[slovnikCz[2]] ?? slovnikCz[2];
    return dvojice(`${CZ}/slovnik/${slovnikCz[1]}/${slovnikCz[2]}/`, `${EN}/dictionary/${g}/${s}/`);
  }

  const temaEn = p.match(/^\/topics\/([^/]+)$/);
  if (temaEn) {
    const cz = TOPIC[temaEn[1]] ?? temaEn[1];
    return dvojice(`${CZ}/temata/${cz}/`, `${EN}/topics/${temaEn[1]}/`);
  }
  const temaCz = p.match(/^\/temata\/([^/]+)$/);
  if (temaCz) {
    const en = TOPIC_REV[temaCz[1]] ?? temaCz[1];
    return dvojice(`${CZ}/temata/${temaCz[1]}/`, `${EN}/topics/${en}/`);
  }

  const bez = p.replace(/^\//, '');
  const pair = getPreklady().find((x) => x.cz === bez || x.en === bez);
  if (pair) {
    return dvojice(
      pair.cz ? `${CZ}/${pair.cz}/` : `${CZ}/`,
      pair.en ? `${EN}/${pair.en}/` : `${EN}/`,
    );
  }

  return dvojice(`${CZ}${p}/`, `${EN}${p}/`);
}
