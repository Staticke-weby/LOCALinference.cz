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

- **Qwen3.8 Flash Next na DGX Spark:** 36,8–45,8 tok/s v nezávislém měření
  ([madeye](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)).
- **Qwen3.8 Flash Next na RTX Spark notebooku:** 70,44 tok/s v coding
  benchmarku ([forum](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530)).
- **Dense 70B na Strix Halo 128:** kolem 5 tok/s
  ([llamaperf](https://llamaperf.com/gpu/strix-halo-128gb)). To je celý
  důvod, proč se u těchto zařízení bavíme o MoE.

Čísla nejsou srovnatelná bez konfigurace: jiný engine, kvantizace a délka
běhu. Podrobnosti jsou v [metodice](/o-webu/metodika/).

## Kde MoE zaostává

- **Unie expertů při batchi** — čím víc tokenů současně, tím víc expertů
  se aktivuje a agregát roste méně, než by člověk čekal.
- **Režie routeru** — rozhodování, který expert, něco stojí.
- **Paměť navíc** — celkové parametry se musí vejít, i když se nečtou.
- **Kvalita** — MoE není automaticky lepší; záleží na tréninku a datech.

## Co z toho plyne pro nákup

- **128 GB** je minimum pro Qwen3.8 Flash Next.
- **Menší zařízení** do katalogu nezařazujeme.
- **Víc uživatelů** se řeší počtem boxů, ne 192GB strojem.
- **Dense modely** na těchto zařízeních nejsou rozumná volba.
- **Počet aktivních parametrů** je první číslo, které se u modelu díváte.

## Kudy dál

- [Jak to funguje](/zaciname/jak-to-funguje/) — váhy, kvantizace, roofline.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — referenční model.
- [Roofline](/rychlost/roofline/) — vzorec a příklady.

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [madeye — DGX Spark measurement](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)
- [llamaperf — Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb)
- [NVIDIA forum — native vLLM on RTX Spark](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530)

*Naposledy ověřeno: 4. 11. 2026.*
