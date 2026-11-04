---
title: "Data: MODEL na ZAŘÍZENÍ (KVANTIZACE, KONTEXT)"
description: "Co tvrdí zdroj, za jakých podmínek a co z toho plyne pro denní použití."
last_verified: 2026-11-04
typ: data
id: 2026-11-10-dgx-spark-qwen38-nvfp4
---

# Data: Qwen3.8 Flash Next na DGX Spark

> **Toto není naše měření.** Číslo přebíráme od zdroje. Naše práce je
> převzít konfiguraci, zkontrolovat roofline, porovnat s dalšími zdroji
> a vysvětlit, co z toho plyne.

**Jednořádkový souhrn.** Například: „70 tok/s single-stream při 32k kontextu;
40 tok/s nad 128k. NVFP4, vLLM, MTP 3. Střední důvěryhodnost — jeden zdroj.“

## Co tvrdí zdroj

| Parametr | Hodnota |
|---|---|
| Datum měření | 10. 11. 2026 |
| Kdo měřil | nezávislý test / komunita / výrobce |
| Zařízení | DGX Spark 128 GB |
| Model | Qwen3.8 Flash Next (176B / 6B) |
| Kvantizace | NVFP4 |
| Engine | vLLM 0.30.0 |
| Kontext | 32 000 tokenů (strop 262 144) |
| Souběžnost | 1 |
| MTP | zapnuto, 3 draft tokeny |
| KV cache | FP8 |
| Flash attention | zapnuto |
| Chunked prefill | zapnuto |
| Teplota | [DOPLNIT] |
| Power limit | [DOPLNIT] |

## Výsledky

| Metrika | Hodnota | Poznámka |
|---|---|---|
| TTFT | [DOPLNIT] ms | první token |
| Prefill | [DOPLNIT] tok/s | zpracování promptu |
| Decode | 70 tok/s | single-stream |
| Agregát | [DOPLNIT] | při souběžnosti |
| Decode nad 128k | 40 tok/s | dlouhý kontext |

## Důvěryhodnost a rozpory

| Co | Hodnota |
|---|---|
| Důvěryhodnost | střední |
| Počet zdrojů | 1 |
| Jiné zdroje | [odkaz], [odkaz] |
| Rozpětí | 60–79 tok/s (jiné konfigurace) |
| Proč se liší | kvantizace, MTP, KV cache, teplota, kontext |

**Kontrola roofline:** 6B aktivních × 4,25 bitů / 8 = 3,19 GB na token.
273 GB/s / 3,19 GB = ~85,6 tok/s teoreticky. Naměřených 70 tok/s je ~82 %
roofline — číslo je fyzikálně možné a konzistentní.

## Naše interpretace

- 70 tok/s je rychlost, kterou člověk pohodlně čte.
- 40 tok/s nad 128k je použitelné pro agentní práci, ale ne pro 4 souběžné
  uživatele s dlouhým kontextem.
- Pro plánování použij **40 tok/s**, ne 70. Špička je pro krátký kontext.
- TTFT a prefill chybí; bez nich nelze hodnotit interaktivní kvalitu.

## Co by změnilo závěr

- Další nezávislý zdroj se stejnou kvantizací a kontextem.
- Měření TTFT a prefillu.
- Jiná verze vLLM nebo jiné MTP nastavení.
- Měření při 4 souběžných uživatelích.

## Reprodukce

```bash
# [DOPLNIT: přesný příkaz, verze, model, kvantizace]
vllm serve Qwen/Qwen3.8-Flash-Next-NVFP4 \
  --max-model-len 32768 \
  --enable-prefix-caching \
  --speculative-config '{"method":"mtp","num_speculative_tokens":3}'
```

## Zdroje

- [Zdroj měření](https://…) — konfigurace a čísla.
- [Model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) — specifikace.
- [vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next) — doporučená
  konfigurace.

*Naposledy ověřeno: 4. 11. 2026.*
