---
title: "Datové karty: co tvrdí zdroj a co z toho plyne"
description: "Jak čteme veřejná měření, proč u nich uvádíme konfiguraci, rozpětí a důvěryhodnost a kde jsou mezery."
last_verified: 2026-11-04
sidebar:
  order: 1
---

# Datové karty

Datová karta není naše měření. Je to záznam o tom, **co tvrdí zdroj**,
za jakých podmínek, jak je to důvěryhodné a co z toho plyne pro denní
použití.

> **Proč to takhle děláme:** nemáme laboratoř. Většinu zařízení fyzicky
> netestujeme. Naše hodnota je v tom, že data srovnáme, zkontrolujeme
> roofline a vysvětlíme rozpory. Podrobnosti v [metodice](/o-webu/metodika/).

## Co karta obsahuje

- **Co tvrdí zdroj** — konkrétní čísla a konfiguraci.
- **Kdo měřil** — výrobce, nezávislý test, komunita.
- **Důvěryhodnost** — vysoká / střední / nízká a proč.
- **Rozpory** — další zdroje a rozptyl.
- **Kontrolu roofline** — je číslo fyzikálně možné?
- **Interpretaci** — co z toho plyne pro chat, agenta a dlouhý kontext.
- **Co by změnilo závěr** — jaká data chybí.

## Hotové karty

- [Qwen3.8 Flash Next na Strix Halo 128 GB](/data/qwen3-8-flash-next-strix-halo/) —
  příklad rozptylu 41–79 tok/s a vlivu prefillu.

## Co ještě chybí

- DGX Spark: TTFT a prefill pro různé engine.
- RTX Spark mini: první veřejné měření.
- Všechna zařízení: 4+ souběžných uživatelů.

Celý seznam je v [Co nevíme](/zdroje/co-nevime/).
