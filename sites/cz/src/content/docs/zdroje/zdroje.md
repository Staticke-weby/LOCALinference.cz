---
title: "Zdroje: odkud bereme data"
description: "Registr zdrojů pro lokální AI: model cards, nezávislá měření, komunitní reporty a oficiální specifikace. Co sledujeme a proč."
last_verified: 2026-11-04
sidebar:
  order: 1
---

# Zdroje

Web stojí na veřejných datech. Tato stránka ukazuje, odkud je bereme, jakou
mají váhu a co z nich na web teče. Úplný registr je v `data/zdroje.yaml`
a v interním hlídači.

## Klíčové zdroje

| Zdroj | Co z něj bereme | Váha |
|---|---|---|
| [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) | parametry, kontext, licence, vision | oficiální |
| [Qwen blog](https://qwen.ai/blog) | architektura, benchmarky, vydání | oficiální |
| [vLLM Recipes](https://recipes.vllm.ai/) | konfigurace, kvantizace, DGX Spark | oficiální |
| [SGLang Cookbook](https://docs.sglang.io/cookbook/) | konfigurace, MTP, long context | oficiální |
| [madeye — DGX Spark](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/) | nezávislé měření, TTFT, prefill | komunita |
| [CORSAIR — DGX Spark](https://www.corsair.com/us/en/explorer/corsair-pro/software/qwen38-flash-next-dgx-spark-tutorial/) | llama.cpp měření | komunita |
| [llamaperf — Strix Halo](https://llamaperf.com/gpu/strix-halo-128gb) | komunitní měření, konfigurace | komunita |
| [NVIDIA forum — vLLM na RTX Spark](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530) | nativní Windows ARM64 port, měření | komunita |
| [NVIDIA RTX Spark porting guide](https://docs.nvidia.com/rtx-spark/rtx-spark-porting-guide/latest/overview.html) | 128 GB, 300 GB/s, 45–80 W | oficiální |
| [ČNB — kurzy](https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt) | přepočet na Kč | oficiální |
| [ECB — kurzy](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml) | přepočet na EUR | oficiální |

## Jak zdroje hodnotíme

- **oficiální** — výrobce, model card, dokumentace. Dobré na specifikace
  a ceny, opatrně u výkonnostních tvrzení.
- **nezávislý** — benchmark nebo laboratorní test. Nejcennější, ale bývá
  na jiném hardware, než prodáváme.
- **komunita** — uživatelské měření. Reálné konfigurace, ale různá kvalita.
- **výpočet** — roofline z podložených vstupů. Není to měření.

## Co sledujeme

- nové modely a model cards,
- ceny a dostupnost zařízení,
- vydání vLLM, SGLang a llama.cpp,
- nová měření na llamaperf a InferenceX,
- změny oficiálních specifikací.

Hlídač běží týdně a nikdy nemění obsah sám. Navrhne změnu, člověk ji
schválí a zapíše do changelogu.

## Co ještě chybí

- Přímé odkazy na konkrétní vlákna u některých komunitních měření.
- Více nezávislých zdrojů pro RTX Spark notebook.
- Pravidelná kontrola cen v ČR a EU.
- Vlastní české testy — zatím je nemáme.

Celý seznam je v [Co nevíme](/zdroje/co-nevime/).

## Zdroje

- [Qwen3.8 Flash Next — model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Qwen blog](https://qwen.ai/blog)
- [vLLM Recipes](https://recipes.vllm.ai/)
- [SGLang Cookbook](https://docs.sglang.io/cookbook/)
- [madeye — DGX Spark](https://madeye.github.io/qwen38-flash-next-on-dgx-spark/)
- [CORSAIR — DGX Spark](https://www.corsair.com/us/en/explorer/corsair-pro/software/qwen38-flash-next-dgx-spark-tutorial/)
- [llamaperf — Strix Halo](https://llamaperf.com/gpu/strix-halo-128gb)
- [NVIDIA forum — vLLM na RTX Spark](https://forums.developer.nvidia.com/t/native-vllm-on-rtx-spark-windows-arm64-2x-faster-than-nvidias-llama-cpp-recipe/387530)
- [NVIDIA RTX Spark porting guide](https://docs.nvidia.com/rtx-spark/rtx-spark-porting-guide/latest/overview.html)

*Naposledy ověřeno: 4. 11. 2026.*
