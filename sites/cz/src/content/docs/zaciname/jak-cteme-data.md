---
title: "Jak čteme data a měření"
description: "TTFT, prefill, decode, kontext a souběžnost. Jak čteme cizí měření, proč se rozcházejí a co znamenají pro denní použití."
last_verified: 2026-11-04
sidebar:
  label: Jak čteme data
  order: 3
---

Čísla o lokální AI nejsou srovnatelná, dokud neznáte podmínky. Stejný model
dá na stejném zařízení 27, 45 nebo 70 tok/s podle kvantizace, enginu, MTP
a délky kontextu. Tato stránka vysvětluje, co které číslo znamená a jak
si je ověřit.

> **Nemáme laboratoř.** Data přebíráme z veřejných měření. Naše je
> interpretace, kontrola roofline a vysvětlení rozporů. Podrobnosti v
> [metodice](/o-webu/metodika/).

## TTFT: čas do prvního tokenu u lokální AI

**TTFT** (time to first token) je doba od odeslání zadání po první znak
odpovědi. Je to nejdůležitější číslo pro pocit z interaktivní práce.

TTFT ovlivňuje:

- **prefill** — zpracování celého promptu,
- fronta a načtení modelu,
- první token generování.

U krátkého promptu může být TTFT pod sekundu. U 32k dokumentu klidně
desítky sekund. Proto nikdy neporovnávejte TTFT bez délky promptu.

## Prefill: jak dlouho trvá zpracování promptu

**Prefill** je rychlost, kterou model přečte a zpracuje váš prompt.
Měří se v tok/s vstupu. Je to jiná veličina než rychlost generování.

Příklad: prefill 1 200 tok/s znamená, že 32 000 tokenů trvá zhruba
27 sekund. To je celé TTFT, pokud není fronta. Prefill je často slabší
u malých zařízení než decode, a proto dlouhé dokumenty bolí víc než
dlouhé odpovědi.

## Decode: generování odpovědi

**Decode** je rychlost, kterou model vydává další tokeny. Měří se v tok/s
výstupu. Je to číslo, které většina lidí myslí, když se řekne „rychlost
modelu“.

Pro decode platí přibližně:

```
tok/s ≈ (propustnost paměti × efektivita) / (bajty na token)
bajty na token ≈ aktivní parametry × bajty na parametr
```

Více v [roofline](/rychlost/roofline/).

## Kontext u lokální AI: maximum, doporučení a realita

U každého modelu rozlišujeme tři čísla:

- **nativní maximum** — co model zvládne na papíře (např. 262k),
- **doporučený provozní kontext** — kde je rozumný kompromis kvality
  a rychlosti; často `[DOPLNIT]`, dokud pro něj není podložené doporučení,
- **reálný kontext na zařízení** — co se vejde do KV cache spolu
  s ostatními uživateli.

Maximum není doporučení. Dlouhý kontext snižuje rychlost a bere paměť
souběžným streamům. Jeden 200k request může vytlačit ostatní.

## Souběžnost: kolik lidí to obslouží

Souběžnost není totéž jako počet slotů v KV cache. Výrobce může uvést
16 slotů, ale provozní strop je nižší kvůli prefill interference, tail
latency a rezervě na výpadek.

Pro plánování platí:

- **chat** potřebuje zhruba 15–20 tok/s na stream,
- **agent** 5–10 tok/s,
- **batch** 1–2 tok/s,
- **TTFT** pro interaktivní práci pod 2 s.

Konkrétní čísla pro zařízení jsou `[DOPLNIT]`, dokud nejsou veřejná měření.

## Proč se čísla rozcházejí

Když dva zdroje tvrdí něco jiného, obvykle nejde o chybu. Rozdíl dělá:

- kvantizace (NVFP4 vs. GGUF Q4 vs. FP8),
- engine a jeho verze (vLLM, llama.cpp, SGLang),
- MTP a počet draft tokenů,
- KV cache (FP8, Q8_0, F16),
- délka kontextu a souběžnost,
- teplota a power limit,
- definice „tok/s“ (s TTFT, bez TTFT, po prefillu).

Proto u každého čísla uvádíme konfiguraci. Když chybí, je to `[DOPLNIT]`,
ne odhad.

## Důvěryhodnost měření lokální AI

- **vysoká** — 2+ nezávislé zdroje se shodou,
- **střední** — jeden nezávislý nebo více komunitních,
- **nízká** — jediný komunitní nebo výrobcem udávaný údaj.

Jeden zdroj není důkaz, ani když je oficiální. Výrobce měří na nejlepší
konfiguraci; komunita zase často bez jednotné metodiky.

## Jak si měřit doma

Pokud chcete vlastní číslo:

1. Zvolte pevný prompt a pevnou kvantizaci.
2. Změřte TTFT, prefill a decode zvlášť.
3. Uveďte engine, verzi, kontext, souběžnost a MTP.
4. Opakujte alespoň třikrát a berte medián.
5. Pro skripty použijte Python 3.12+ a oficiální nástroje
   (`llama-bench`, vLLM benchmark).

## Kudy dál

- [Roofline](/rychlost/roofline/) — vzorec a příklady.
- [Metodika](/o-webu/metodika/) — jak přebíráme a srovnáváme data.
- [Co nevíme](/zdroje/co-nevime/) — kde data chybí.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — konkrétní čísla.

## Zdroje

- [vLLM documentation](https://docs.vllm.ai/) — měření a konfigurace.
- [llama.cpp](https://github.com/ggml-org/llama.cpp) — `llama-bench`.
- [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) —
  specifikace.
- [llamaperf](https://llamaperf.com/gpu/strix-halo-128gb) — komunitní měření.

*Naposledy ověřeno: 4. 11. 2026.*
