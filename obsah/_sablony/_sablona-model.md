---
title: "NÁZEV MODELU — co od něj čekat a kde poběží"
description: "Jedna až dvě věty: velikost, aktivní parametry, kontext, pro koho."
last_verified: 2026-11-04
typ: model
id: qwen3-8-flash-next
---

# NÁZEV MODELU

**Jednořádkový verdikt.** Například: „Spodní hranice, která dnes stačí
na denní práci — a referenční bod pro všechna ostatní srovnání.“

<aside class="tip">
**Role:** minimum pro denní práci.
**Celkem / aktivních:** 176B / 6B.
**Kontext:** 262k nativně; doporučený provozní kontext [DOPLNIT: podložené doporučení].
**Minimální zařízení:** 128 GB unified paměti.
</aside>

## Specifikace

| Parametr | Hodnota |
|---|---|
| Architektura | MoE, 512 expertů, 10 routed + 1 shared |
| Celkové parametry | 176B (125B hlavní + 51B N-gram + 4B MTP) |
| Aktivní parametry | 6B na token |
| Nativní maximum kontextu | 262 144 |
| Rozšíření | 1 000 000 s YaRN |
| Doporučený provozní kontext | [DOPLNIT] |
| Reálně na zařízeních | 128k–262k podle paměti |
| Modality | text + vision (výchozí) |
| Licence | Apache-2.0 |
| Váhy 4bit | ~101 GB (NVFP4) |
| Doporučené zařízení | DGX Spark, RTX Spark, Strix Halo, Mac Studio |

## Co umí

- **Obecné úkoly:** MMLU 90,4, MMLU-Pro [DOPLNIT], SuperGPQA [DOPLNIT].
- **Kód:** SWE-bench Pro 62,5, DeepSWE 1.1 58,7, multilingual 81,0.
- **Čeština:** [DOPLNIT: vlastní test nebo komunitní zkušenost]
- **Nástroje:** tool calling, reasoning parser, agentní smyčky.
- **Vision:** text + obrázky; dokumenty, screenshoty, tabulky.
  Pokud model card neříká jinak, vision považujeme za součást modelu.
- **Silné stránky:** kvalita na úrovni větších modelů při 6B aktivních;
  malá KV cache díky GDN; dlouhý kontext.
- **Slabé stránky:** 51B N-gram tabulka zabírá paměť; na 96GB Macu
  zbývá málo na KV cache; kvalita na nejtěžší reasoning nestačí na frontier.

## Kolik potřebuje paměti

| Kvantizace | Váhy | Minimální zařízení | Poznámka |
|---|---|---|---|
| NVFP4 | ~101 GB | 128 GB | 27 GB na KV cache |
| FP8 | ~176 GB | 192 GB+ | rychlejší převod, více paměti |
| MLX 4bit | ~88 GB | 96 GB Mac | málo KV cache, krátký kontext |
| GGUF Q4 | ~90 GB | 128 GB | llama.cpp, nižší rychlost |

## Jak rychle na zařízeních

| Zařízení | Kvantizace | Engine + nastavení | Krátký kontext | Dlouhý kontext | Typ | Zdroj |
|---|---|---|---|---|---|---|
| DGX Spark 128 | NVFP4 | vLLM, MTP 3, KV FP8 | 70 tok/s | 40 tok/s | naměřeno | [data](/data/…) |
| Strix Halo 128 | GGUF Q4 | llama.cpp, MTP, kontext 96k | 40–79 tok/s | ~32 tok/s | naměřeno | [llamaperf](https://llamaperf.com/gpu/strix-halo-128gb) |
| Mac Studio 96 | MLX 4bit | MLX, [DOPLNIT] | 180–280 tok/s | [DOPLNIT] | naměřeno | [zdroj](https://…) |
| DGX Station GB300 | NVFP4 | vLLM, MTP3 | 354,6 tok/s | [DOPLNIT] | naměřeno | [data](/data/…) |
| Gorgon Halo 192 | NVFP4 | [DOPLNIT] | [DOPLNIT] | [DOPLNIT] | [DOPLNIT] | [zdroj](https://…) |

**Toto jsou převzatá měření, ne naše.** U každého čísla je zdroj,
konfigurace a důvěryhodnost. Rozpětí uvádíme tam, kde se zdroje rozcházejí.

**Proč je Mac tak rychlý:** 1,2 TB/s vs. 273 GB/s. Není to lepší model,
je to jiná třída paměti. Zaplatíte ale více za GB paměti.

**Konfigurace:** u každého čísla musí být kvantizace, engine a verze,
kontext, souběžnost a zapnuté optimalizace (MTP, KV cache, flash attention).
Bez toho číslo nic neznamená.

## Kontext: maximum není doporučení

| Kontext | Kvalita | Rychlost | Souběžnost | K čemu |
|---|---|---|---|---|
| 8k–32k | nejlepší | nejvyšší | vysoká | chat, běžné úkoly |
| 128k | dobrá | střední | [DOPLNIT] | dlouhé dokumenty, agenti |
| 262k | klesá | nízká | 1–2 | maximum, jen když je potřeba |
| 1M (YaRN) | [DOPLNIT] | [DOPLNIT] | 0–1 | na těchto zařízeních spíš teoretické |

**Pravidlo:** maximum je strop, ne cíl. Pro seriózní práci s dlouhými
dokumenty je zajímavé pásmo 128k+; pod 128k se většinou bavíme o chatu
a běžných úlohách, ne o náročném agentním provozu. Vždy uváděj, na kolika
tocích je měření a jaká byla souběžnost.

## Kde dává smysl

- **Denní práce jednoho až čtyř lidí:** ano, 128GB stroj.
- **Agentní úlohy s dlouhým kontextem:** ano, ale počítejte 40 tok/s.
- **Dávkové zpracování:** ano, agregát roste mírně.
- **20+ uživatelů:** ne, potřebujete DGX Station nebo pool.
- **Nejlepší kvalita bez kompromisů:** ne, sáhněte po větším modelu,
  který se na zařízení vejde, nebo po cloudu.

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Qwen blog](https://qwen.ai/blog?id=qwen3.8-flash-next)
- [vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next)
- [SGLang cookbook](https://docs.sglang.io/cookbook/autoregressive/Qwen/Qwen3.8-Flash-Next)

*Naposledy ověřeno: 4. 11. 2026.*
