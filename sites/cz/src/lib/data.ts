import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const DATA_DIR =
  [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), '../../data'),
    path.resolve(fileURLToPath(new URL('../../../../data/', import.meta.url))),
  ].find((p) => fs.existsSync(path.join(p, 'zarizeni.yaml'))) ?? path.resolve(process.cwd(), 'data');

export type Cena = {
  usd?: number;
  od_usd?: number;
  do_usd?: number;
  overeno: string | Date;
  zdroj: string;
  poznamka?: string;
};

export type Zarizeni = {
  id: string;
  nazev: string;
  vyrobce: string;
  kategorie: 'mini-pc' | 'notebook' | 'desktop' | 'station';
  stranka?: string;
  pamet_gb: number;
  pamet_typ: string;
  bandwidth_gbs: number;
  bandwidth_pozn?: string;
  cena: Cena;
  cena_czk?: {
    od: number;
    do?: number;
    s_dph: boolean;
    overeno: string | Date;
    zdroj: string;
    poznamka?: string;
  };
  cpu: string;
  gpu: string;
  os: string[];
  software: string[];
  prikon_w: number | null;
  prikon_pozn?: string;
  hmotnost_kg: number | null;
  prodejce: string[];
  silne: string[];
  slabe: string[];
  zdroje: string[];
  overeno: string | Date;
};

export type Model = {
  id: string;
  nazev: string;
  vyrobce: string;
  architektura: 'MoE' | 'dense';
  parametry_celkem_b: number;
  parametry_aktivni_b: number;
  kontext: {
    max: number | null;
    max_rozsireni?: number | null;
    doporuceny: number | null;
    poznamka?: string;
  };
  vision: boolean;
  vision_projektor?: {
    nazev: string;
    velikost_gb: number;
    engine: string | null;
    poznamka?: string;
  };
  modality: string[];
  licence: string;
  kvantizace: { nazev: string; vahy_gb: number | null; engine: string | null }[];
  role: 'minimum' | 'vyssi' | 'special';
  stav: 'doporuceny' | 'pod-hranici' | 'jen-pro-velke' | 'referencni';
  stranka?: string;
  zdroje: string[];
  overeno: string | Date;
};

export type DgxSparkOem = {
  id: string;
  nazev: string;
  vyrobce: string;
  pamet_gb: number;
  uloziste_gb: number;
  cena_czk_s_dph: number;
  cena_czk_bez_dph: number;
  puvodni_cena_czk?: number | null;
  sleva_procent?: number | null;
  dostupnost: string;
  prodejce: string;
  objednaci_kod?: string;
  zdroj: string;
  overeno: string | Date;
  poznamka?: string;
};

export type StrixHaloOem = {
  id: string;
  nazev: string;
  vyrobce: string;
  pamet_gb: number;
  uloziste_gb: number;
  cena_czk_s_dph: number | null;
  cena_czk_bez_dph: number | null;
  dostupnost: string;
  prodejce: string;
  objednaci_kod?: string;
  zdroj: string;
  overeno: string | Date;
  poznamka?: string;
};

export type RtxNotebookOem = StrixHaloOem;

export type Mereni = {
  id: string;
  datum: string | Date;
  zarizeni: string;
  model: string;
  kvantizace: string;
  engine: string;
  engine_verze: string | null;
  kontext: number | null;
  kontext_strop: number | null;
  ttft_ms: number | null;
  prefill_toks: number | null;
  decode_toks: number | null;
  agregat_toks: number | null;
  soubeznost: number;
  rozptyl?: { min: number; max: number; jine_zdroje: string[] };
  nastaveni: Record<string, unknown>;
  typ: 'namereno' | 'vypocet';
  mereno_kym: 'vyrobce' | 'nezavisle' | 'komunita';
  duveryhodnost: 'vysoka' | 'stredni' | 'nizka';
  normalizace?: string;
  interpretace?: string;
  zdroj: string;
  poznamka?: string;
};

export type Zdroj = {
  id: string;
  nazev: string;
  url: string;
  typ: string;
  co_sledujeme: string[];
  frekvence: string;
  priorita: string;
  kontrola?: 'auto' | 'manual';
  posledni_kontrola: string | Date;
  stav: string;
  poznamka?: string;
};

export type Kurz = {
  datum: string | Date;
  usd_czk: number;
  eur_czk: number;
  usd_eur: number;
  zdroje: string[];
  poznamka?: string;
};

export type Zmena = {
  datum: string | Date;
  typ: string;
  titulek: string;
  co_se_zmenilo: string;
  dotcene_stranky: string[];
  zdroj: string;
};

function load<T>(name: string): T {
  const file = path.join(DATA_DIR, name);
  return parseYaml(fs.readFileSync(file, 'utf8')) as T;
}

export function isoDate(value: string | Date): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

export function formatDatum(value: string | Date): string {
  const d = new Date(`${isoDate(value)}T00:00:00Z`);
  return new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatCislo(value: number): string {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(value);
}

export function getZarizeni(): Zarizeni[] {
  return (load<Zarizeni[]>('zarizeni.yaml') ?? []).sort((a, b) => {
    const ca = a.cena.usd ?? a.cena.od_usd ?? 0;
    const cb = b.cena.usd ?? b.cena.od_usd ?? 0;
    return ca - cb;
  });
}

export function getZarizeniById(id: string): Zarizeni | undefined {
  return getZarizeni().find((z) => z.id === id);
}

export function getDgxSparkOem(): DgxSparkOem[] {
  return (load<DgxSparkOem[]>('dgx-spark-oem.yaml') ?? []).sort(
    (a, b) => a.cena_czk_s_dph - b.cena_czk_s_dph || b.uloziste_gb - a.uloziste_gb,
  );
}

export function getStrixHaloOem(): StrixHaloOem[] {
  return (load<StrixHaloOem[]>('strix-halo-oem.yaml') ?? []).sort(
    (a, b) =>
      (a.cena_czk_s_dph ?? Number.POSITIVE_INFINITY) - (b.cena_czk_s_dph ?? Number.POSITIVE_INFINITY) ||
      b.uloziste_gb - a.uloziste_gb,
  );
}

export function getRtxNotebookOem(): RtxNotebookOem[] {
  return (load<RtxNotebookOem[]>('rtx-spark-notebook-oem.yaml') ?? []).sort(
    (a, b) =>
      (a.cena_czk_s_dph ?? Number.POSITIVE_INFINITY) - (b.cena_czk_s_dph ?? Number.POSITIVE_INFINITY) ||
      b.uloziste_gb - a.uloziste_gb,
  );
}

export function formatKc(value: number): string {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value);
}

export function getModely(): Model[] {
  return load<Model[]>('modely.yaml') ?? [];
}

export function getModelById(id: string): Model | undefined {
  return getModely().find((m) => m.id === id);
}

export function getMereni(filter: { zarizeni?: string; model?: string } = {}): Mereni[] {
  return (load<Mereni[]>('mereni.yaml') ?? [])
    .filter((m) => (!filter.zarizeni || m.zarizeni === filter.zarizeni) && (!filter.model || m.model === filter.model))
    .sort((a, b) => isoDate(b.datum).localeCompare(isoDate(a.datum)));
}

export function getZdroje(): Zdroj[] {
  return (load<Zdroj[]>('zdroje.yaml') ?? []).sort((a, b) => a.nazev.localeCompare(b.nazev, 'cs'));
}

export function getZmeny(): Zmena[] {
  return (load<Zmena[]>('zmeny.yaml') ?? []).sort((a, b) => isoDate(b.datum).localeCompare(isoDate(a.datum)));
}

export function getKurz(): Kurz {
  const kurzy = load<Kurz[]>('kurzy.yaml') ?? [];
  return kurzy.sort((a, b) => isoDate(b.datum).localeCompare(isoDate(a.datum)))[0];
}

export function cenaText(z: Zarizeni): {
  czk: string;
  usd: string;
  datum: string;
  zdroj: string;
  poznamka: string;
  jeOdhad: boolean;
  sDph: boolean;
} {
  const kurz = getKurz();
  const usdOd = z.cena.usd ?? z.cena.od_usd ?? 0;
  const usdDo = z.cena.usd ?? z.cena.do_usd ?? usdOd;
  const usd = usdOd === usdDo ? `${formatCislo(usdOd)} USD` : `${formatCislo(usdOd)}–${formatCislo(usdDo)} USD`;

  if (z.cena_czk) {
    const od = z.cena_czk.od;
    const doCeny = z.cena_czk.do ?? od;
    const czk =
      od === doCeny
        ? `${formatKc(od)} Kč`
        : `${formatKc(od)}–${formatKc(doCeny)} Kč`;
    return {
      czk,
      usd,
      datum: formatDatum(z.cena_czk.overeno),
      zdroj: z.cena_czk.zdroj,
      poznamka: z.cena_czk.poznamka ?? '',
      jeOdhad: false,
      sDph: z.cena_czk.s_dph,
    };
  }

  const czkOd = Math.round(usdOd * kurz.usd_czk);
  const czkDo = Math.round(usdDo * kurz.usd_czk);
  const czk =
    czkOd === czkDo
      ? `≈ ${formatKc(czkOd)} Kč`
      : `≈ ${formatKc(czkOd)}–${formatKc(czkDo)} Kč`;
  return {
    czk,
    usd,
    datum: formatDatum(z.cena.overeno),
    zdroj: z.cena.zdroj,
    poznamka: z.cena.poznamka ?? '',
    jeOdhad: true,
    sDph: false,
  };
}

export function nazevZarizeni(id: string): string {
  return getZarizeniById(id)?.nazev ?? id;
}

export function nazevModelu(id: string): string {
  return getModelById(id)?.nazev ?? id;
}

export function mereniRychlost(m: Mereni): string {
  if (m.rozptyl) return `${formatCislo(m.rozptyl.min)}–${formatCislo(m.rozptyl.max)} tok/s`;
  if (m.decode_toks != null) return `${formatCislo(m.decode_toks)} tok/s`;
  if (m.agregat_toks != null) return `${formatCislo(m.agregat_toks)} tok/s (agregát)`;
  return '—';
}

export function typLabel(typ: Mereni['typ']): string {
  return typ === 'namereno' ? 'naměřeno' : 'výpočet';
}

export function duveryhodnostLabel(d: Mereni['duveryhodnost']): string {
  return d === 'vysoka' ? 'vysoká' : d === 'stredni' ? 'střední' : 'nízká';
}

export function merenoKymLabel(k: Mereni['mereno_kym']): string {
  return k === 'vyrobce' ? 'výrobce' : k === 'nezavisle' ? 'nezávislý' : 'komunita';
}
