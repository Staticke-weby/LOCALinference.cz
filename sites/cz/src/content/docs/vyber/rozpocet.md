---
title: "Výběr podle rozpočtu: co dostanete za 4, 7 a 10 tisíc dolarů"
description: "Přehled hotových zařízení podle ceny a toho, co reálně zvládnou. Bez odhadů, s datem a zdrojem u každé ceny."
last_verified: 2026-11-04
sidebar:
  order: 1
---

# Výběr podle rozpočtu

Ceny jsou bez DPH a dopravy, k uvedenému datu. Přepočet na Kč je orientační
kurzem ČNB 21,762 k 3. 11. 2026.

| Zařízení | Paměť | Cena USD | Orientačně Kč | Pro koho |
|---|---|---|---|---|
| Strix Halo 128 GB (OEM) | 128 GB | 3 449–5 349 | 75 100–116 400 | nejlevnější cesta k 128 GB |
| RTX Spark notebook 128 GB | 128 GB | 5 899–6 499 | 128 400–141 400 | práce na cestě, jeden člověk |
| RTX Spark mini 128 GB | 128 GB | 5 999 | 130 600 | malý pool, CUDA |
| DGX Spark 128 GB | 128 GB | 6 950 | 151 200 | CUDA, enterprise management |
| Mac Studio M5 Ultra | 96–512 GB | 5 499–22 299 | 119 700–485 300 | vysoká bandwidth, MLX |
| Gorgon Halo 192 GB | 192 GB | 7 099–7 299 | 154 500–158 800 | 200B modely, long context |
| DGX Station GB300 | 748 GB | 91 000–125 000 | 1 980 000–2 720 000 | 20+ uživatelů |

**Ceny:** bez DPH a dopravy, k datu uvedenému u zařízení. Zdroje:
[NVIDIA](https://www.nvidia.com/en-us/products/workstations/dgx-spark/),
[Apple](https://www.apple.com/mac-studio/),
[BetterClaw](https://www.betterclaw.io/blog/rtx-spark-vs-dgx-spark),
[Tom's Hardware](https://www.tomshardware.com/laptops/nvidia-rtx-spark-devices-are-now-officially-on-sale-secure-the-surface-laptop-ultra-or-other-rtx-spark-laptops-here-starting-at-usd2-599-where-to-buy-pricing-and-availability-revealed-on-several-models).

## Do 5 000 USD: Strix Halo

Nejlevnější cesta k 128 GB. Vejde se na Qwen3.8 Flash Next, ale prefill
je slabší a ROCm není tak zralý jako CUDA. Pro jednoho až čtyři lidi,
kteří chtějí data u sebe a nepotřebují nejrychlejší první token.

## Kolem 6 000 USD: RTX Spark

Notebook nebo mini se stejnou pamětí a 300 GB/s. Notebook vyhraje na
cestách, mini na stálém provozu. Oba mají CUDA a nově i komunitní nativní
vLLM port pro Windows ARM64. Konkrétní měření jsou zatím jen pro coding
benchmark, ne pro dlouhý kontext.

## Kolem 7 000 USD: DGX Spark

Nejintegrovanější 128GB krabice s CUDA a enterprise managementem. Po
zdražení už není nejlevnější. Dává smysl tam, kde potřebujete NVIDIA stack,
clustering nebo správu flotily — ne jako „levný node“.

## 10 000 USD a výš: Mac Studio

1,2 TB/s a 96–512 GB. Nejrychlejší single-stream a největší modely na
jednom stole, ale MLX místo vLLM a drahá paměť. Pro lidi, kteří potřebují
bandwidth nebo modely nad 192 GB, ne pro mnoho souběžných uživatelů.

## 90 000 USD a výš: DGX Station

Throughput stroj pro 20–40 uživatelů, 252 GB HBM3e a MIG izolaci. Pro
firmu, která provozuje high-risk systém nebo potřebuje servis a záruku.
Pro domácnost nesmysl.

## Co je minimum

**128 GB unified paměti** a model Qwen3.8 Flash Next. Cokoli menšího
nezvládne model v použitelné kvantizaci. Cokoli většího je o kompromisech,
ne o magii.

## Kudy dál

- [RTX Spark notebook](/zarizeni/rtx-spark-notebook/) — první detail.
- [Qwen3.8 Flash Next](/modely/qwen3-8-flash-next/) — referenční model.
- [Jak čteme data](/zaciname/jak-cteme-data/) — proč cena není všechno.
- [Co nevíme](/zdroje/co-nevime/) — kde chybí měření.

## Zdroje

- [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [NVIDIA RTX Spark](https://www.nvidia.com/en-us/products/rtx-spark/)
- [Apple Mac Studio](https://www.apple.com/mac-studio/)
- [llamaperf — Strix Halo 128GB](https://llamaperf.com/gpu/strix-halo-128gb)
- [BetterClaw — RTX Spark vs DGX Spark](https://www.betterclaw.io/blog/rtx-spark-vs-dgx-spark)

*Naposledy ověřeno: 4. 11. 2026.*
