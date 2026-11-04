---
title: "NÁZEV ZAŘÍZENÍ — krátký výstižek s hledaným termínem"
description: "Jedna až dvě věty: co zařízení je, pro koho a čím je zajímavé."
last_verified: 2026-11-04
typ: zarizeni
id: dgx-spark
---

# NÁZEV ZAŘÍZENÍ

**Jednořádkový verdikt.** Například: „Nejintegrovanější 128GB krabice —
po zdražení už ne nejlevnější.“

<aside class="tip">
**Pro koho:** …
**Pro koho ne:** …
**Minimum pro denní práci:** Qwen3.8 Flash Next (176B / 6B).
</aside>

## Rychlá fakta

| Parametr | Hodnota |
|---|---|
| Paměť | 128 GB unified |
| Propustnost paměti | 273 GB/s |
| Cena | 6 950 USD (2. 10. 2026) |
| Cena orientačně | ≈ 151 200 Kč (kurz ČNB 21,762 k 3. 11. 2026) |
| Forma | mini PC / desktop |
| OS | DGX OS, Ubuntu |
| Software | CUDA, vLLM, SGLang, llama.cpp |
| Příkon | [DOPLNIT] |

**Cena:** bez DPH a dopravy. Přepočet je orientační, kurz k uvedenému datu.
Zdroj ceny: [odkaz].

## Co na něm poběží

| Model | Kvantizace | Nastavení | Kontext | Rychlost | Typ | Zdroj |
|---|---|---|---|---|---|---|
| Qwen3.8 Flash Next | NVFP4 | MTP 3, KV FP8, vLLM | 32k | 70 tok/s | naměřeno | [data](/data/…) |
| Qwen3.8 Flash Next | NVFP4 | MTP 3, KV FP8, vLLM | 128k+ | 40 tok/s | naměřeno | [data](/data/…) |
| Qwen3.6 35B-A3B | NVFP4 | [DOPLNIT] | 32k | [DOPLNIT] | [DOPLNIT] | [zdroj](https://…) |
| Dense 70B | 4bit | llama.cpp | 8k | ~5 tok/s | naměřeno | [llamaperf](https://llamaperf.com/gpu/strix-halo-128gb) |

**Toto jsou převzatá měření, ne naše.** U každého řádku je zdroj; kde se
zdroje rozcházejí, uvádíme rozpětí a důvod. Naše je interpretace a zařazení
do tabulky, ne čísla.

**Co to znamená:** 70 tok/s je rychlost, kterou člověk pohodlně čte.
40 tok/s na dlouhém kontextu je stále použitelné pro agentní práci.
Dense 70B je na tomto stroji mrtvý — vejde se, ale provozovat se nedá.

## Jak rychle

| Režim | Krátký kontext | Dlouhý kontext (>128k) |
|---|---|---|
| Single-stream | 70 tok/s | 40 tok/s |
| TTFT | [DOPLNIT] | [DOPLNIT] |
| Prefill | [DOPLNIT] | [DOPLNIT] |
| Pohodlná souběžnost | [DOPLNIT] | [DOPLNIT] |
| Agregát při 4 souběžných | [DOPLNIT] | [DOPLNIT] |

**Konfigurace měření:** Qwen3.8 Flash Next, NVFP4, vLLM [verze], MTP 3,
KV cache FP8, kontext 32k/128k, souběžnost 1. V produkci s frontou
a logováním počítejte s 10–25 % méně.

## Kontext, který zařízení reálně udrží

| Kontext | Co se stane | Souběžnost |
|---|---|---|
| 32k | bezpečný provoz, nejlepší rychlost | [DOPLNIT] |
| 128k | dlouhé dokumenty, rychlost klesá | [DOPLNIT] |
| 262k | maximum modelu, KV cache na hraně | 1–2 |
| 1M | jen s YaRN, na tomto zařízení nepoužitelné | 0–1 |

Maximální kontext není doporučený provozní bod. Kvalita je obvykle lepší
na kratším kontextu a dlouhý kontext bere paměť ostatním.

## Co od toho čekat

- **Zvládne:** chat, psaní, kód, práci s dokumenty, shrnutí, překlady,
  agentní úlohy v délce hodin.
- **Nezvládne:** špičkovou kvalitu frontier modelů, 20 souběžných uživatelů,
  modely nad ~200B bez offloadu.
- **Nejlepší využití:** 1–4 lidé, kteří potřebují data u sebe a rychlou odpověď.
- **Kde narazí:** dlouhý kontext bere KV cache; jeden 200k request vytlačí
  ostatní. Řešení je vyhrazený long-context režim, ne vyšší priorita.

## Na co si dát pozor

- **Cena:** DGX Spark zdražil z 3 999 na 6 950 USD (10/2026). Za stejnou
  paměť a vyšší bandwidth existuje RTX Spark mini za 5 999 USD.
- **Uzavřený stack:** NVIDIA dodává CUDA, NIM a playbooky. Je to výhoda
  pro rychlý start, ale horší pro vyměnitelnost.
- **Souběžnost:** 16 slotů v KV cache není 16 spokojených uživatelů.
  Provozní strop jsou 4.
- **Napájení a hluk:** [DOPLNIT]

## Pro koho

| Situace | Doporučení |
|---|---|
| 1–4 lidé, citlivá data, CUDA | **Ano** |
| Chcete nejnižší cenu za 128 GB | Spíš Strix Halo |
| Chcete 200B+ model | Ne, potřebujete 192–256 GB |
| 20+ uživatelů | Ne, jiná třída nebo pool |

## Zdroje

- [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) —
  parametry, cena (k datu).
- [vLLM recipe: Qwen3.8 Flash Next](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next) —
  konfigurace a kvantizace.
- [llamaperf: Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb) —
  nezávislá měření.
- [DOPLNIT: konkrétní zdroj ceny k datu]

*Naposledy ověřeno: 4. 11. 2026.*
