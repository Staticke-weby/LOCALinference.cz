---
title: "Roofline: proč má lokální AI strop v tok/s"
description: "Jediný vzorec, který vysvětlí, proč Qwen3.8 Flash Next dá 40–70 tok/s a dense 70B jen 5. Včetně příkladů a mezí výpočtu."
last_verified: 2026-11-04
sidebar:
  label: Roofline
  order: 1
---

Rychlost generování není náhoda ani marketing. Je to hlavně fyzika paměti.
Model při každém tokenu přečte aktivní váhy. Čím víc jich je a čím pomalejší
paměť, tím méně tokenů za sekundu.

> **Toto je výpočet, ne měření.** Vstupy bereme z oficiálních specifikací
> a model cardů. Výsledek je strop, který vám řekne, jestli je naměřené
> číslo vůbec možné. Podrobnosti v [metodice](/o-webu/metodika/).

<figure style="margin:1.2rem 0">
  <svg style="width:100%;height:auto;max-width:760px" viewBox="0 0 760 260" role="img" aria-labelledby="roofline-diagram-title" xmlns="http://www.w3.org/2000/svg">
    <title id="roofline-diagram-title">Roofline: strop je daný propustností paměti a výpočtem</title>
    <line x1="70" y1="210" x2="720" y2="210" stroke="currentColor" stroke-width="1.5" />
    <line x1="70" y1="210" x2="70" y2="30" stroke="currentColor" stroke-width="1.5" />
    <text x="395" y="245" text-anchor="middle" fill="currentColor" font-size="13">náročnost na výpočet →</text>
    <text x="24" y="120" text-anchor="middle" fill="currentColor" font-size="13" transform="rotate(-90 24 120)">tok/s →</text>
    <path d="M70 180 L360 70 L700 70" fill="none" stroke="currentColor" stroke-width="3" />
    <line x1="360" y1="70" x2="360" y2="205" stroke="currentColor" stroke-dasharray="5 5" />
    <text x="230" y="150" fill="currentColor" font-size="13">decode: brzdí paměť</text>
    <text x="470" y="55" fill="currentColor" font-size="13">prefill: brzdí výpočet</text>
  </svg>
  <figcaption style="color:var(--sl-color-gray-3);font-size:var(--sl-text-sm);margin-top:0.35rem">Decode je vlevo (paměť), prefill vpravo (výpočet). Roofline ukazuje, kde je strop.</figcaption>
</figure>

## Roofline vzorec pro lokální AI

```
tok/s ≈ (propustnost paměti × efektivita) / (bajty přečtené na token)

bajty na token ≈ aktivní parametry × bajty na parametr
```

- **propustnost paměti** je v GB/s (DGX Spark 273, Strix Halo 256,
  RTX Spark notebook 300).
- **efektivita** je zlomek stropu, který engine reálně dosáhne.
  U dobré konfigurace 0,7–0,9; u slabší 0,3–0,5.
- **bajty na token** určuje počet aktivních parametrů a kvantizace.

## Příklad: Qwen3.8 Flash Next na DGX Spark

- 6 miliard aktivních parametrů,
- NVFP4 ≈ 4,25 bitů na parametr,
- `6 × 4,25 / 8 = 3,19 GB` na token,
- `273 / 3,19 = 85,6 tok/s` teoreticky.

Naměřená realita:

- Qwen/NVIDIA uvádí kolem **70 tok/s** (~82 % stropu)
  ([vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next)).
- Nezávislé měření hlásí **36,8 tok/s** na próze a **45,8** na kódu
  (~43–53 % stropu), protože jiný engine, MTP a workload
  ([madeye](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)).

Rozdíl není fyzika. Je to konfigurace. Roofline říká, co je možné; měření
říká, co daný setup skutečně dostane.

## Příklad: dense 70B na Strix Halo

- 70 miliard aktivních parametrů,
- 4 bity na parametr,
- `70 × 4 / 8 = 35 GB` na token,
- `256 / 35 = 7,3 tok/s` teoreticky,
- reálně kolem **5 tok/s**
  ([llamaperf](https://llamaperf.com/gpu/strix-halo-128gb)).

Model se do 128 GB vejde. Provozovat se nedá. To je celý důvod, proč se
u těchto zařízení bavíme o MoE.

## Jak roofline používat při výběru AI boxu

1. **Kontrola zdroje:** je naměřené číslo pod stropem? Pokud ne, je
   podezřelé, nebo běží jiná kvantizace či přídavné zrychlení.
2. **Odhad tam, kde měření chybí:** spočítej strop a vynásob efektivitou.
   Výsledek označ jako `vypocet`, nikdy jako `namereno`.
3. **Plánování:** ber spodní hranici naměřeného rozsahu, ne strop.
4. **Vysvětlení rozdílů:** když se zdroje rozcházejí, roofline pomůže
   určit, co je ještě možné a co už ne.

## Kde roofline u lokální AI nestačí

- **Prefill** je jiný režim — závisí na výpočtu, ne jen na bandwidth.
- **Kvalita** se z roofline nepozná.
- **Režie jader** a podpora modelu v enginu mohou strop výrazně snížit.
- **Teplota, power limit a throttling** nejsou ve vzorci.
- **Dlouhý kontext** snižuje rychlost kvůli KV cache a attention.

## Kudy dál

- [Jak čteme data](/zaciname/jak-cteme-data/) — TTFT, prefill, souběžnost.
- [Proč MoE](/modely/proc-moe/) — aktivní parametry v praxi.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — konkrétní čísla.
- [Co nevíme](/zdroje/co-nevime/) — kde měření chybí.

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next)
- [madeye — DGX Spark measurement](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)
- [llamaperf — Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb)
- [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)

*Naposledy ověřeno: 4. 11. 2026.*
