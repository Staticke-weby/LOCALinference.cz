---
title: "Co nevíme: mezery v datech o lokální AI"
description: "Veřejný seznam toho, co u lokálních modelů a zařízení chybí: TTFT, prefill, dlouhý kontext, souběžnost a české testy."
last_verified: 2026-11-05
sidebar:
  order: 2
---

Nemáme laboratoř, a tak je poctivé říct i to, co nevíme. Tato stránka je
veřejný seznam mezer. Zároveň je zadání pro komunitu: pokud máte některé
zařízení a chuť měřit, tady je přesně vidět, co by pomohlo.

> **Proč to zveřejňujeme:** web, který přizná mezery, je důvěryhodnější než
> web, který má na všechno jedno číslo. A čtenář vidí, kde je závěr pevný
> a kde stojí na výpočtu.

## Hlavní mezery v datech o lokální AI

| Oblast | Co chybí | Proč to vadí | Priorita |
|---|---|---|---|
| **DGX Spark** | TTFT a prefill pro Qwen3.8 Flash Next | bez nich nelze hodnotit interaktivní kvalitu | vysoká |
| **Strix Halo** | TTFT na jednotném promptu | prefill se v reportech měří různě | vysoká |
| **RTX Spark mini/notebook** | nezávislá měření | výrobcem udávaná čísla nestačí | střední |
| **Souběžnost 4+** | agregát a tok/s na stream | většina reportů je single-stream | vysoká |
| **Dlouhý kontext** | 128k, 262k | maximum v datasheetu nic neříká o praxi | vysoká |
| **Kvalita na 128k** | české a retrieval testy pro Qwen3.8 | benchmarky jsou anglické a značně závisí na úloze | vysoká |
| **Čeština** | srovnávací testy na českých úlohách | benchmarky v angličtině neřeknou vše | vysoká |
| **Vision** | reálné testy dokumentů a screenshotů | vision je výchozí, ale kvalita se liší | střední |
| **Hluk a příkon** | měření v zátěži | rozhoduje o použití v kanceláři/domácnosti | střední |
| **Generování obrázků** | časy na RTX Sparku a Macu, ověřené licence | bez toho nejde říct, co je rychlé a co komerčně bezpečné | vysoká |
| **Generování videa a 3D** | časy na Strix Halu a Macu | video jsou minuty, ne sekundy; čtenář to musí vědět předem | střední |
| **Ceny v ČR/EU** | dostupnost, DPH, doprava | americká cena není česká cena | střední |

## Co by změnilo závěr o lokální AI

U každé datové karty je sekce „Co by změnilo závěr“. Obecně platí:

- **Druhý nezávislý zdroj** se stejnou kvantizací a kontextem.
- **TTFT a prefill** na stejném promptu jako decode.
- **Měření při 4 souběžných** uživatelích, ne jen single-stream.
- **128k+ kontext** se stejnou kvantizací.
- **České úlohy** — shrnutí, extrakce, e-mail, kód, screenshot.

## Jak pomoct s daty o lokální AI

Pokud máte zařízení a chcete přispět měřením, pošlete:

- zařízení, model, kvantizaci,
- engine a verzi,
- kontext a souběžnost,
- TTFT, prefill, decode,
- nastavení (MTP, KV cache, flash attention),
- odkaz nebo raw log.

Bez těchto údajů měření nepřijmeme — nejsou to „drobnosti“, ale podmínka
srovnatelnosti. Podrobnosti jsou v [metodice](/o-webu/metodika/).

## Kudy dál

- [Metodika](/o-webu/metodika/) — jak data čteme a proč přiznáváme mezery.
- [Zdroje](/zdroje/zdroje/) — co sledujeme.
- [Jak čteme data](/zaciname/jak-cteme-data/) — TTFT, prefill a rozpětí.
- [Qwen3.8 Flash Next na Strix Halo](/data/qwen3-8-flash-next-strix-halo/) —
  příklad datové karty i s tím, co chybí.

## Zdroje

- [Metodika](/o-webu/metodika/)
- [Registr zdrojů](/zdroje/zdroje/)
- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)

*Naposledy ověřeno: 5. 11. 2026.*
