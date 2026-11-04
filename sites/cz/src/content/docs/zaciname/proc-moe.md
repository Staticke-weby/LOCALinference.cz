---
title: "Proč jsou dnes zajímavé jen MoE modely"
description: "Dense model se 70B na malé krabici běží ~5 tok/s. MoE se 6B aktivních dá 40–70 tok/s. Vysvětlení, proč rozhodují aktivní parametry."
last_verified: 2026-11-04
sidebar:
  order: 4
---

# Proč jsou dnes zajímavé jen MoE modely

Na hotovém zařízení s 128 GB paměti se vejde i dense model se 70 miliardami
parametrů. Jenže se vejde a **běží kolem 5 tok/s** — což není denní práce.
Rozhoduje počet **aktivních** parametrů, ne celkových.

> **Toto jsou převzatá data, ne naše měření.** Čísla pocházejí z veřejných
> měření; konfigurace je u zdrojů. Podrobnosti v [metodice](/o-webu/metodika/).

## Dense model: každý token projde vším

**Dense model** používá při každém tokenu všechny parametry. Když má
70 miliard parametrů v 4bitové kvantizaci, znamená to zhruba 35 GB
přečtených z paměti na každý token.

Na zařízení s propustností 273 GB/s je teoretický strop
`273 / 35 = 7,8 tok/s`. Reálně se dostanete na ~5 tok/s. Model se do
paměti vejde, ale provozovat se nedá.

## MoE: router vybere několik expertů

**MoE** (Mixture of Experts) má mnoho expertů, ale na každý token aktivuje
jen několik z nich. Celkové parametry určují kapacitu a paměť; aktivní
parametry určují rychlost.

Qwen3.8 Flash Next má 176 miliard parametrů celkem, ale jen **6 miliard
aktivních** na token. Na DGX Spark to je kolem 70 tok/s podle Qwen/NVIDIA
a 36,8–45,8 tok/s v nezávislém měření
([madeye](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)).

## Srovnání

| Model | Celkem / aktivních | Zařízení | Rychlost | Zdroj |
|---|---|---|---|---|
| Qwen3.8 Flash Next | 176B / 6B | DGX Spark | 36,8–45,8 tok/s | [madeye](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/) |
| Qwen3.8 Flash Next | 176B / 6B | RTX Spark notebook | 70,44 tok/s (coding) | [forum](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530) |
| gpt-oss-120B | 117B / ~5B | DGX Spark | ~38,6 tok/s | podklad provozovatele |
| Dense 70B | 70B / 70B | Strix Halo 128 | ~5 tok/s | [llamaperf](https://llamaperf.com/gpu/strix-halo-128gb) |

**Pozor:** gpt-oss-120B je starší model a v katalogu není jako doporučení.
Je tu jen jako srovnání, proč stejná velikost nestačí.

## Kde MoE zaostává

- **Unie expertů při batchi** — čím víc tokenů současně, tím víc expertů
  se aktivuje a agregát roste méně, než by člověk čekal.
- **Režie routeru** — rozhodování, který expert, něco stojí.
- **Paměť navíc** — celkové parametry se musí vejít, i když se nečtou.
- **Kvalita** — MoE není automaticky lepší; záleží na tréninku a datech.

## Co z toho plyne pro nákup

- **128 GB** je minimum pro Qwen3.8 Flash Next.
- **192 GB** dá víc prostoru pro KV cache a souběžnost.
- **Dense modely** na těchto zařízeních nejsou rozumná volba, pokud
  neběží na Macu s vysokou bandwidth.
- **Počet aktivních parametrů** je první číslo, které se u modelu díváte.

## Kudy dál

- [Jak to funguje](/zaciname/jak-to-funguje/) — váhy, kvantizace, roofline.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — referenční model.
- [Roofline](/rychlost/roofline/) — vzorec a příklady.
- [Výběr podle rozpočtu](/vyber/rozpocet/) — co za co dostanete.

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [madeye — DGX Spark measurement](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)
- [llamaperf — Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb)
- [NVIDIA forum — native vLLM on RTX Spark](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530)

*Naposledy ověřeno: 4. 11. 2026.*
