import { z } from 'zod';

// YAML může datum načíst jako Date; sjednotíme na ISO řetězec YYYY-MM-DD.
export const datum = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'očekávám datum YYYY-MM-DD'));

const url = z.string().url('očekávám platnou URL');
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'id: malá písmena, číslice a pomlčky');

export const cena = z
  .object({
    usd: z.number().positive().optional(),
    od_usd: z.number().positive().optional(),
    do_usd: z.number().positive().optional(),
    overeno: datum,
    zdroj: url,
    poznamka: z.string().optional(),
  })
  .refine((v) => v.usd != null || (v.od_usd != null && v.do_usd != null), {
    message: 'cena musí mít usd, nebo od_usd + do_usd',
  })
  .refine((v) => v.od_usd == null || v.do_usd == null || v.od_usd <= v.do_usd, {
    message: 'od_usd musí být <= do_usd',
  });

export const zarizeni = z.object({
  id,
  nazev: z.string().min(2),
  vyrobce: z.string().min(1),
  kategorie: z.enum(['mini-pc', 'notebook', 'desktop', 'station']),
  stranka: z.string().optional(),
  pamet_gb: z.number().positive(),
  pamet_typ: z.string().min(1),
  bandwidth_gbs: z.number().positive(),
  bandwidth_pozn: z.string().optional(),
  cena,
  cena_czk: z
    .object({
      od: z.number().positive(),
      do: z.number().positive().optional(),
      s_dph: z.boolean().default(true),
      overeno: datum,
      zdroj: url,
      poznamka: z.string().optional(),
    })
    .refine((v) => v.do == null || v.od <= v.do, { message: 'od musí být <= do' })
    .optional(),
  cpu: z.string().min(1),
  gpu: z.string().min(1),
  os: z.array(z.string().min(1)).min(1),
  software: z.array(z.string().min(1)).min(1),
  prikon_w: z.number().positive().nullable(),
  prikon_pozn: z.string().optional(),
  hmotnost_kg: z.number().positive().nullable(),
  prodejce: z.array(z.string().min(1)).default([]),
  silne: z.array(z.string().min(1)).default([]),
  slabe: z.array(z.string().min(1)).default([]),
  zdroje: z.array(url).min(1),
  overeno: datum,
});

export const dgxSparkOem = z
  .object({
    id,
    nazev: z.string().min(2),
    vyrobce: z.string().min(1),
    pamet_gb: z.number().positive(),
    uloziste_gb: z.number().positive(),
    cena_czk_s_dph: z.number().positive(),
    cena_czk_bez_dph: z.number().positive(),
    puvodni_cena_czk: z.number().positive().nullable().optional(),
    sleva_procent: z.number().min(0).max(100).nullable().optional(),
    dostupnost: z.string().min(1),
    prodejce: z.string().min(1),
    objednaci_kod: z.string().optional(),
    zdroj: url,
    overeno: datum,
    poznamka: z.string().optional(),
  })
  .refine((v) => v.cena_czk_bez_dph < v.cena_czk_s_dph, {
    message: 'cena bez DPH musí být nižší než cena s DPH',
  });

export const strixHaloOem = z
  .object({
    id,
    nazev: z.string().min(2),
    vyrobce: z.string().min(1),
    pamet_gb: z.number().positive(),
    uloziste_gb: z.number().positive(),
    cena_czk_s_dph: z.number().positive().nullable(),
    cena_czk_bez_dph: z.number().positive().nullable(),
    dostupnost: z.string().min(1),
    prodejce: z.string().min(1),
    objednaci_kod: z.string().optional(),
    zdroj: url,
    overeno: datum,
    poznamka: z.string().optional(),
  })
  .refine(
    (v) =>
      (v.cena_czk_s_dph == null && v.cena_czk_bez_dph == null) ||
      (v.cena_czk_s_dph != null && v.cena_czk_bez_dph != null && v.cena_czk_bez_dph < v.cena_czk_s_dph),
    { message: 'ceny musí být obě, nebo žádná; cena bez DPH musí být nižší než s DPH' },
  );

export const rtxNotebookOem = strixHaloOem;

export const model = z.object({
  id,
  nazev: z.string().min(2),
  vyrobce: z.string().min(1),
  architektura: z.enum(['MoE', 'dense']),
  parametry_celkem_b: z.number().positive(),
  parametry_aktivni_b: z.number().positive(),
  kontext: z.object({
    max: z.number().positive().nullable(),
    max_rozsireni: z.number().positive().nullable().optional(),
    doporuceny: z.number().positive().nullable(),
    poznamka: z.string().optional(),
  }),
  vision: z.boolean(),
  vision_projektor: z
    .object({
      nazev: z.string().min(1),
      velikost_gb: z.number().positive(),
      engine: z.string().min(1).nullable(),
      poznamka: z.string().optional(),
    })
    .optional(),
  modality: z.array(z.string().min(1)).min(1),
  licence: z.string().min(1),
  kvantizace: z
    .array(
      z.object({
        nazev: z.string().min(1),
        vahy_gb: z.number().positive().nullable(),
        engine: z.string().min(1).nullable(),
      }),
    )
    .default([]),
  role: z.enum(['minimum', 'vyssi', 'special']),
  stav: z.enum(['doporuceny', 'pod-hranici', 'jen-pro-velke', 'referencni']),
  stranka: z.string().optional(),
  zdroje: z.array(url).min(1),
  overeno: datum,
});

export const mereni = z.object({
  id,
  datum,
  zarizeni: id,
  model: id,
  kvantizace: z.string().min(1),
  engine: z.string().min(1),
  engine_verze: z.string().nullable(),
  kontext: z.number().positive().nullable(),
  kontext_strop: z.number().positive().nullable(),
  ttft_ms: z.number().nonnegative().nullable(),
  prefill_toks: z.number().nonnegative().nullable(),
  decode_toks: z.number().nonnegative().nullable(),
  agregat_toks: z.number().nonnegative().nullable(),
  soubeznost: z.number().positive(),
  rozptyl: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      jine_zdroje: z.array(url).default([]),
    })
    .optional(),
  nastaveni: z
    .object({
      mtp: z.boolean().nullable().optional(),
      mtp_draft_tokens: z.number().nonnegative().nullable().optional(),
      kv_cache: z.string().nullable().optional(),
      flash_attention: z.boolean().nullable().optional(),
      chunked_prefill: z.boolean().nullable().optional(),
      teplota: z.number().nullable().optional(),
      power_limit_w: z.number().nullable().optional(),
    })
    .default({}),
  typ: z.enum(['namereno', 'vypocet']),
  mereno_kym: z.enum(['vyrobce', 'nezavisle', 'komunita']),
  duveryhodnost: z.enum(['vysoka', 'stredni', 'nizka']),
  normalizace: z.string().optional(),
  interpretace: z.string().optional(),
  zdroj: url,
  poznamka: z.string().optional(),
});

export const zdroj = z.object({
  id,
  nazev: z.string().min(2),
  url,
  typ: z.enum(['rss', 'github', 'hf', 'html', 'api']),
  co_sledujeme: z.array(z.string().min(1)).min(1),
  frekvence: z.enum(['denne', 'tydne', 'mesicne', 'ctvrtletne']),
  priorita: z.enum(['vysoka', 'stredni', 'nizka']),
  duveryhodnost: z.enum(['vysoka', 'stredni', 'nizka']).optional(),
  kontrola: z.enum(['auto', 'manual']).default('auto'),
  posledni_kontrola: datum,
  stav: z.enum(['ok', 'novinka', 'chyba']),
  poznamka: z.string().optional(),
});

export const kurz = z.object({
  datum,
  usd_czk: z.number().positive(),
  eur_czk: z.number().positive(),
  usd_eur: z.number().positive(),
  zdroje: z.array(url).min(1),
  poznamka: z.string().optional(),
});

export const zmena = z.object({
  datum,
  typ: z.enum(['cena', 'model', 'mereni', 'zdroj', 'obsah']),
  titulek: z.string().min(3),
  co_se_zmenilo: z.string().min(3),
  dotcene_stranky: z.array(z.string().min(1)).default([]),
  zdroj: url,
});
