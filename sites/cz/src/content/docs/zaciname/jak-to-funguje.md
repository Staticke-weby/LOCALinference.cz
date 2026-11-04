---
title: "Jak funguje lokální AI: váhy, kvantizace a tokeny"
description: "Proč lokální model potřebuje 128 GB paměti, co dělá kvantizace a proč rychlost nezávisí na počtu parametrů. Vysvětlení bez magie."
last_verified: 2026-11-04
sidebar:
  order: 2
---

# Jak funguje lokální AI: váhy, kvantizace a tokeny

Lokální AI není aplikace, kterou nainstalujete a ona „nějak funguje“.
Je to soubor vah, program, který je načítá, a paměť, která je musí udržet.
Když pochopíte tyto tři věci, přestanou být čísla v tabulkách záhadou.

> **Odkud jsou čísla:** Nemáme vlastní laboratoř. Čísla přebíráme
> z veřejných měření, model cardů a dokumentace. U každého důležitého údaje
> je zdroj; naše je interpretace a výpočet, ne měření.

## Model jsou váhy

Když se řekne „model má 176 miliard parametrů“, znamená to, že v souboru
je 176 miliard čísel. Ta čísla se nazývají **váhy**. Určují, jak model
reaguje na vstup. Samotný soubor tedy není program — je to obrovská
natrénovaná tabulka.

Qwen3.8 Flash Next má 176 miliard parametrů celkem. Kdyby byl uložený
v plné přesnosti (16 bitů na parametr), vážil by přes 350 GB. To se na
běžné zařízení nevejde. Proto se používá kvantizace.

## Kvantizace: méně bitů, méně paměti

**Kvantizace** znamená, že se každé číslo uloží s menší přesností.
Místo 16 bitů třeba 4 bity. Model je pak menší a rychleji se čte z paměti,
ale může mírně ztratit kvalitu.

| Formát | Přibližně bitů na parametr | Velikost 176B modelu | Kde se používá |
|---|---|---|---|
| FP16 | 16 | ~352 GB | trénink, servery |
| FP8 | 8 | ~176 GB | NVIDIA, větší stroje |
| NVFP4 | ~4,25–4,5 | ~101 GB | DGX Spark, vLLM |
| GGUF Q4 | ~4,5 | ~90–100 GB | llama.cpp, Strix Halo |
| MLX 4bit | ~4 | ~88 GB | Mac Studio |

Čím nižší přesnost, tím menší paměť a často vyšší rychlost. Zároveň ale
roste riziko, že model začne dělat chyby v jemných úlohách. U 4bitové
kvantizace se kvalita obvykle pozná až na vašich datech, ne na marketingu.

**Praktické pravidlo:** 4bitová kvantizace je dnes standard pro lokální
provoz. 8bitová dává smysl tam, kde je paměti dost a záleží na každém
procentu kvality. 16bitová je pro lokální krabici většinou nesmysl.

## Proč se model musí vejít celý

Malá zařízení — DGX Spark, Strix Halo, Mac Studio — mají **unified paměť**.
Procesor a GPU sdílejí jeden velký bazén. Když se model do něj nevejde,
začne se část vah odkládat do pomalejší paměti nebo na disk. Rychlost
spadne řádově, často na jednotky tokenů za sekundu.

To je důvod, proč je 128 GB magická hranice. Qwen3.8 Flash Next potřebuje
kolem 101 GB na váhy. Zbývá zhruba 27 GB na KV cache a aktivace. Vejde se.
Na 64GB stroji se nevejde vůbec. Na 96GB Macu se vejde jen s malou rezervou
a krátkým kontextem.

## Dvě úzká hrdla: paměť a výpočet

Lokální inference má dva odlišné režimy:

1. **Prefill** — zpracování vstupu. Model musí přečíst celý prompt a spočítat
   pozornost. Tady rozhoduje **výpočetní výkon** (TFLOPS) a kvalita jader.
   Výsledkem je **TTFT** — čas do prvního tokenu.
2. **Decode** — generování odpovědi token po tokenu. Model při každém tokenu
   přečte všechny aktivní váhy. Tady rozhoduje **propustnost paměti** (GB/s).
   Výsledkem je **tok/s** — rychlost čtení.

Proto nestačí jedno číslo. Model může mít skvělé tok/s a přesto dlouho
čekat na první token, protože prompt byl dlouhý. A naopak: krátký prompt
odpoví rychle, ale dlouhé generování bude pomalé.

## Roofline: jediný vzorec, který to vysvětlí

Pro decode platí přibližně:

```
tok/s ≈ (propustnost paměti × efektivita) / (bajty přečtené na token)

bajty na token ≈ aktivní parametry × bajty na parametr
```

**Příklad: Qwen3.8 Flash Next na DGX Spark**

- 6 miliard aktivních parametrů, NVFP4 ≈ 4,25 bitů na parametr.
- 6 × 4,25 / 8 = **3,19 GB na token**.
- 273 GB/s / 3,19 GB = **85,6 tok/s teoreticky**.
- Qwen/NVIDIA uvádí kolem **70 tok/s** pro NVFP4 + MTP, tedy ~82 %
  roofline ([vLLM recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next)).
- Nezávislé měření na DGX Spark hlásí **36,8 tok/s** na próze a **45,8**
  na kódu, tedy 43–53 % roofline
  ([madeye](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)).

Rozdíl 36,8 vs. 70 není fyzika, ale konfigurace: jiný engine, jiné MTP,
jiný workload a jiná délka běhu. Přesně proto u každého čísla uvádíme
podmínky. Roofline říká, co je možné; měření říká, co z toho daný setup
skutečně dostane.

**Příklad: dense model se 70 miliardami parametrů**

- 70 miliard parametrů, 4 bity na parametr.
- 70 × 4 / 8 = **35 GB na token**.
- 273 GB/s / 35 GB = **7,8 tok/s teoreticky**.
- Reálně kolem **5 tok/s**
  ([llamaperf](https://llamaperf.com/gpu/strix-halo-128gb)).

Model se do paměti vejde, ale každý token vyžaduje přečtení celých 35 GB.
To je fyzikální limit, ne špatné nastavení. Proto jsou dnes na těchto
zařízeních zajímavé jen řídké MoE modely.

## Kontext: paměť navíc, která roste

**Kontext** je historie konverzace, kterou si model pamatuje. Ukládá se
do **KV cache**. Čím delší kontext, tím větší cache — a tím méně paměti
zbývá na další uživatele.

Na DGX Sparku zbývá po načtení Qwen3.8 Flash Next zhruba 27 GB. To stačí
na krátké kontexty a několik souběžných streamů. Jeden 200k tokenový
request ale vezme většinu paměti a ostatní vytlačí. Proto rychlost klesá
z 70 na 40 tok/s nad 128 tisíci tokeny
([Qwen blog](https://qwen.ai/blog?id=qwen3.8-flash-next)) — a proto je
potřeba dlouhý kontext plánovat zvlášť, ne jen „přidat uživatele“.

**Maximum není doporučení.** 262 tisíc tokenů je strop modelu, ne provozní
bod. Kvalita i rychlost jsou nejlepší na kratším kontextu. U těchto zařízení
je strop většinou 262k; pro náročný provoz s dlouhými dokumenty je zajímavé
pásmo 128k a výš, zatímco pod 128k se většinou bavíme o chatu a běžných
úlohách. Vždy proto uváděj, na kolika tocích bylo měření a jaká byla
souběžnost.

## Thinking: proč model „přemýšlí“ a co to dělá s rychlostí

Některé modely generují nejdřív skryté **reasoning tokeny** a teprve pak
viditelnou odpověď. Uživatel vidí „70 tok/s“, ale čeká třeba 20 sekund,
než se objeví první smysluplná věta.

Pro denní použití je proto důležitější **čas do dokončení úlohy**, ne
maximální tok/s. Agentní úloha, která potřebuje 5 000 reasoning tokenů,
je na 40 tok/s hotová za dvě minuty. Stejná úloha na 70 tok/s za minutu
a čtvrt. Rozdíl je znát, ale obojí je použitelné.

## Co z toho plyne pro výběr

- **128 GB** je dnes minimum pro Qwen3.8 Flash Next a denní práci.
- **MoE s malým počtem aktivních parametrů** je jediná cesta, jak na
  omezené propustnosti paměti dostat rozumnou kvalitu i rychlost.
- **4bitová kvantizace** je standard; kvalitu si ověřte na svých úlohách.
- **TTFT a prefill** sledujte stejně jako tok/s. Dlouhý prompt bolí víc
  než pomalé generování.
- **Kontext a souběžnost** se navzájem vytlačují. Jeden dlouhý request
  není totéž jako mnoho krátkých.

## Kudy dál

- [Proč jsou dnes zajímavé jen MoE modely](/zaciname/proc-moe/) — aktivní
  parametry a konec dense modelů na malých krabicích.
- [Jak čteme data a měření](/zaciname/jak-cteme-data/) — TTFT, prefill a souběžnost
  v praxi.
- [Roofline kalkulačka](/rychlost/roofline/) — spočítejte si výpočet pro
  svoje zařízení.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — referenční model
  a jeho skutečné nároky.

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) —
  architektura, parametry, kontext.
- [vLLM recipe: Qwen3.8 Flash Next](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next) —
  kvantizace a konfigurace.
- [NVIDIA DGX Spark](https://www.nvidia.com/) — 128 GB unified paměti,
  273 GB/s.
- [llamaperf: Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb) —
  reálná měření na 128GB APU.

*Naposledy ověřeno: 4. 11. 2026.*
