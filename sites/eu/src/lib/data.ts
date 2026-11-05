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
  cena?: Cena;
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

export type GenerativniModel = {
  id: string;
  nazev: string;
  kategorie:
    | 'obrazky'
    | 'uprava-obrazku'
    | 'video'
    | 'uprava-videa'
    | 'rozhybani'
    | 'audio'
    | 'preklady'
    | '3d'
    | 'herni-prvky';
  vyrobce: string;
  licence: string;
  komercni: 'ano' | 'ne' | 'podminky';
  parametry_b?: number | null;
  naroky: string;
  runtime: string[];
  kvalita: string;
  rychlost?: string | null;
  zdroj: string;
  overeno: string | Date;
};

export type HistorieCen = {
  id: string;
  zaznamy: Array<{ datum: string | Date; cena_czk_s_dph: number; dostupnost?: string }>;
};

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

export type Tema = {
  id: string;
  nazev: string;
  hledany_vyraz: string;
  popis: string;
  priorita: 'vysoka' | 'stredni' | 'nizka';
  stav: 'hotovo' | 'rozpracovano' | 'ceka-na-data';
  stranky: string[];
  chybi?: string;
  overeno: string | Date;
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
    const ca = a.cena?.usd ?? a.cena?.od_usd ?? 0;
    const cb = b.cena?.usd ?? b.cena?.od_usd ?? 0;
    return ca - cb;
  });
}

export function getZarizeniById(id: string): Zarizeni | undefined {
  return getZarizeni().find((z) => z.id === id);
}

export type ZarizeniEn = {
  id: string;
  verdict: string;
  for_who: string;
  not_for: string;
  strengths: string[];
  weaknesses: string[];
};

export function getZarizeniEn(id: string): ZarizeniEn | undefined {
  const vse = load<ZarizeniEn[]>('en/zarizeni.yaml') ?? [];
  return vse.find((z) => z.id === id);
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

export function getTemata(): Tema[] {
  const poradi = { vysoka: 0, stredni: 1, nizka: 2 } as const;
  return (load<Tema[]>('temata.yaml') ?? []).sort(
    (a, b) => poradi[a.priorita] - poradi[b.priorita] || a.nazev.localeCompare(b.nazev, 'cs'),
  );
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

  // Cena nemusí být známá (např. nové zařízení bez české nabídky).
  if (!z.cena && !z.cena_czk) {
    return { czk: '—', usd: '', datum: '', zdroj: '', poznamka: '', jeOdhad: false, sDph: false };
  }

  const usdOd = z.cena?.usd ?? z.cena?.od_usd ?? 0;
  const usdDo = z.cena?.usd ?? z.cena?.do_usd ?? usdOd;
  const usd = z.cena
    ? usdOd === usdDo
      ? `${formatCislo(usdOd)} USD`
      : `${formatCislo(usdOd)}–${formatCislo(usdDo)} USD`
    : '';

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
    datum: formatDatum(z.cena!.overeno),
    zdroj: z.cena!.zdroj,
    poznamka: z.cena!.poznamka ?? '',
    jeOdhad: true,
    sDph: false,
  };
}

export function getGenerativniModely(kategorie?: GenerativniModel['kategorie']): GenerativniModel[] {
  const vse = load<GenerativniModel[]>('generativni-modely.yaml') ?? [];
  return kategorie ? vse.filter((m) => m.kategorie === kategorie) : vse;
}

export type GenerovaniZarizeni = {
  zarizeni: string;
  poznamka?: string;
  polozky: {
    uloha: string;
    model: string;
    konfigurace: string;
    cas: string;
    odkaz?: string;
  }[];
};

export function getGenerovaniNaZarizeni(id: string): GenerovaniZarizeni | undefined {
  const vse = load<GenerovaniZarizeni[]>('generovani-na-zarizeni.yaml') ?? [];
  return vse.find((z) => z.zarizeni === id);
}

export function getVsechnaGenerovaniNaZarizeni(): GenerovaniZarizeni[] {
  return load<GenerovaniZarizeni[]>('generovani-na-zarizeni.yaml') ?? [];
}

export function getHistorieCen(id: string): HistorieCen['zaznamy'] {
  const vse = load<HistorieCen[]>('historie-cen.yaml') ?? [];
  const z = vse.find((x) => x.id === id);
  if (!z) return [];
  return [...z.zaznamy].sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime(),
  );
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

/** Affiliate odkazy musí být označené rel="sponsored"; ostatní jen bezpečnostní rel. */
export function relOdkazu(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === 'alza.cz' || host.endsWith('.alza.cz')) {
      return 'sponsored noopener noreferrer';
    }
  } catch {
    // relativní nebo neplatná URL — žádné affiliate
  }
  return 'noopener noreferrer';
}
