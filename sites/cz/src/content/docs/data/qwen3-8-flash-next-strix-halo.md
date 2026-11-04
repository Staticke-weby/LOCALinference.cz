---
title: "Qwen3.8 Flash Next na Strix Halo 128 GB: co říkají měření"
description: "Přehled veřejných měření Qwen3.8 Flash Next na Strix Halo 128 GB: decode 41–79 tok/s, prefill 0,8–2,4 tis. tok/s a TTFT na dlouhém kontextu."
last_verified: 2026-11-04
typ: data
id: qwen3-8-flash-next-strix-halo
sidebar:
  order: 1
---

# Qwen3.8 Flash Next na Strix Halo 128 GB

**Souhrn:** Na krátkém kontextu se veřejná měření pohybují mezi **41 a 79
tok/s** podle kvantizace, enginu a MTP. Pro plánování použij **spodní hranici
41 tok/s** na krátkém a **32 tok/s** na dlouhém kontextu. Prefill je
**0,8–2,4 tis. tok/s** a s délkou promptu klesá: 32k prompt znamená
**16–40 s** před prvním tokenem, 128k prompt **67–166 s**. Na 128k+ kontextu
decode klesá na **~32–42 tok/s**.

> **Toto není naše měření.** Čísla pocházejí z veřejných komunitních reportů
> na llamaperf.com. Naše je jejich srovnání, kontrola roofline a interpretace.

## Co tvrdí zdroje

| Zdroj | Kvantizace | Engine | Kontext | Decode | Prefill | Poznámka |
|---|---|---|---|---|---|---|
| llamaperf (report A) | UD-IQ4_XS, 93,7 GB | llama.cpp HIP, MTP 3 | 95,6k | 41,0 tok/s | 1 183 tok/s | Q8_0 KV, 96GB carve |
| llamaperf (report B) | UD-Q4_K_XL, 108,6 GB | Gufo / Halowin, MTP | 262k | 54–79 tok/s | 1 556 tok/s | Windows 11, 96GB carve |
| llamaperf (report C) | AWQ W4A16 | vLLM fork, MTP 2 | 5,6k | 43,0 tok/s | 1 539 tok/s | n-gram streamován z disku |
| llamaperf (report D) | UD-IQ4_XS | Strata | 128k | 46–53 tok/s | 770 tok/s | mini PC |
| llamaperf (report E) | UD-Q4_K_XL | Gufo, 7 draft tokenů | 262k | ~60 tok/s | [DOPLNIT] | ASUS ProArt PX13 |
| llamaperf (report F) | UD-Q4_K_XL | Gufo, 2 sessions | 262k | ~40 tok/s | [DOPLNIT] | 2× 262k, 98,5 GB KV |
| llamaperf (report G) | [DOPLNIT] | hipfire | 8k / 32k / 128k / 256k | 51,3 / 41,8 / 42,1 / 35,6 | 2 372 (16k) | NPU + iGPU prefill |

**Pozor:** všechny reporty jsou od uživatelů na stejné platformě
(llamaperf), ale s jiným softwarem, kvantizací a nastavením. Nejsou to
nezávislé laboratorní testy.

## Důvěryhodnost

| Co | Hodnota |
|---|---|
| Důvěryhodnost | **střední** |
| Proč | více komunitních reportů, ale chybí jednotná metodika |
| Rozpětí krátký kontext | 41–79 tok/s |
| Rozpětí dlouhý kontext | ~32–42 tok/s |
| Prefill | 0,8–2,4 tis. tok/s; s délkou promptu klesá |

## Normalizace

Raw čísla se nedají srovnávat přímo: jiná kvantizace, jiný engine, jiný
kontext. Tabulka proto ukazuje, **co je jinak**, ne naše přepočty.

| Co | Raw decode | Podmínky | Co z toho plyne |
|---|---|---|---|
| Report A | 41 tok/s | IQ4_XS, 95,6k, MTP 3 | konzervativní, dlouhý kontext |
| Report B | 54–79 tok/s | Q4_K_XL, 262k, MTP | horní hranice je špička |
| Report C | 43 tok/s | AWQ, 5,6k, MTP 2 | jiný engine, krátký kontext |
| **Konzervativní volba** | **41 / 32** | spodní hranice reportů | pro plánování, ne odhad |

**Proč:** bez podmínek by se srovnávalo jablko s hruškou. Rozdíl 41 vs. 79
není jen hardware, ale hlavně nastavení. Kde nemáme stejnou konfiguraci,
neuvádíme přepočet — jen raw hodnotu a podmínky.

## Kontrola roofline

Strix Halo 128 GB má propustnost paměti **256 GB/s**. Qwen3.8 Flash Next
aktivuje 6B parametrů; při 4,25 bitů na parametr je to **3,19 GB na token**.

```
256 GB/s / 3,19 GB = ~80 tok/s teoreticky
41–79 tok/s naměřeno = 51–99 % roofline
```

- **41 tok/s** je hluboko pod stropem — dává smysl u llama.cpp bez plné
  optimalizace, na dlouhém kontextu nebo s nižší efektivitou jader.
- **79 tok/s** je naopak blízko stropu — dává smysl jen s MTP, dobrou
  kvantizací a krátkým kontextem.
- **~60 tok/s** naměřil jeden report (E); je to jeden setup, ne univerzální
  střed.

## Co z toho plyne pro denní použití

| Prompt | Realistický prefill | TTFT jen z prefillu |
|---|---|---|
| 8k | 1,2–2,4 tis. tok/s | 3–7 s |
| 32k | 0,8–2,0 tis. tok/s | 16–40 s |
| 128k | 0,77–1,9 tis. tok/s | 67–166 s |
| 256k | ~1,6 tis. tok/s | ~160 s |

**Pozor:** prefill není konstanta. S délkou promptu klesá a číslo 2,4 tis.
tok/s je z 16k promptu; na 32k a výš ho nelze použít. TTFT v tabulce je
**výpočet z prefillu**, ne měření; skutečný TTFT navíc obsahuje frontu,
načtení a první token.

- **Chat:** 40–50 tok/s je pohodlné čtení. Bez problému.
- **Agent:** 40 tok/s na krátkém kontextu je dobré; na 128k počítejte ~35–42.
- **Dlouhé dokumenty:** 32k prompt znamená 16–40 s před prvním tokenem;
  128k prompt 67–166 s. Prefix caching pomáhá, ale první dotaz je pomalý.
- **Souběžnost:** při 3–4 konverzacích agregát roste (55–60 tok/s), ale
  na stream klesá. Výpočet: 55–60 / 3–4 = **14–20 tok/s na stream**.
- **Plánovací číslo:** **41 tok/s krátký, 32 tok/s dlouhý** — spodní
  hranice naměřených reportů. Nižší číslo pro dlouhý kontext není rozpor:
  je to jiný režim. Špičku 79 tok/s nepoužívejte pro kapacitní plánování.

## Kde je nejistota

- Chybí TTFT pro většinu reportů. Prefill je jen část cesty k prvnímu tokenu.
- Reporty nemají jednotný prompt; „decode“ může být měřen po různém prefillu.
- Teplota, power limit a chlazení nejsou většinou uvedené.
- Různé verze llama.cpp/Gufo/vLLM mění výsledek i o desítky procent.

## Co by změnilo závěr

- Nezávislý test se stejnou kvantizací a kontextem.
- Měření TTFT a prefillu na stejném promptu.
- Více reportů pro 128k+ kontext.
- Měření při 4 souběžných uživatelích.

## Zdroje

- [llamaperf — Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb) —
  komunitní reporty, konfigurace a čísla.
- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) —
  parametry a kontext.
- [vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next) —
  konfigurace pro NVIDIA; pro Strix Halo se liší.
- [llm-kube — Qwen3.8 Flash Next na Strix Halo](https://llmkube.com/docs/labs/qwen38-flash-next-gufo-on-strix-halo) —
  konkrétní laboratorní setup.

*Naposledy ověřeno: 4. 11. 2026.*
