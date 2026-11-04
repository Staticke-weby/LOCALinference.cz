# Plán hledání dat a podkladů

*Živý seznam toho, co na webu chybí, kde to hledat a kdy to bude hotové.
Obor se rychle vyvíjí, takže se seznam průběžně doplňuje.*

## Jak to používat

- **Zařízení pod 128 GB nezařazujeme.** Qwen3.8 Flash Next je minimum
  a na menší stroj se nevejde v použitelné kvalitě.
- **P0** — blokuje důvěryhodné tvrzení nebo doporučení. Řešit první.
- **P1** — zlepší kvalitu, ale stránka funguje i bez toho.
- **P2** — průběžné sledování a údržba.
- Každá položka má **ID**, **co hledáme**, **proč**, **kde** a **stav**.
- Po nalezení: zapsat do `data/*.yaml`, přidat zdroj do `data/zdroje.yaml`,
  zapsat změnu do `data/zmeny.yaml`, aktualizovat `overeno` a odstranit
  `[DOPLNIT]` z textu.
- Když se objeví nový model nebo zařízení, založit novou položku a projít
  checklist na konci.

## P0 — chybí a brzdí závěry

| ID | Co hledáme | Proč | Kde hledat | Stav |
|---|---|---|---|---|
| D01 | RTX Spark mini: první veřejné měření Qwen3.8 FN (TTFT, prefill, decode, 128k) | stránka nemá žádné číslo | NVIDIA forum, llamaperf, Reddit, GitHub benchmarky | `[DOPLNIT]` |
| D02 | DGX Spark a Strix Halo: TTFT a prefill na jednotném promptu | reporty měří prefill různě | madeye, llamaperf, SMF, SparkLab, GitHub | `[DOPLNIT]` |
| D03 | Souběžnost 4+ na všech zařízeních: agregát a tok/s na stream | většina reportů je single-stream | vLLM/SGLang benchmarky, fóra, InferenceX | `[DOPLNIT]` |
| D04 | 128k a 262k kontext: rychlost i kvalita pro Qwen3.8 | maximum není provozní bod | llamaperf, MRCR/needle testy, komunitní reporty | `[DOPLNIT]` |
| D05 | Qwen3.8: podložené doporučení provozního kontextu | `doporuceny: null` | Qwen model card, vLLM recipe, nezávislé testy | `[DOPLNIT]` |
| D06 | Kvantizace u 4 hipfire měření na Strix Halu | bez kvantizace nelze číslo srovnat | llamaperf detail reportu | `[DOPLNIT]` |

## P1 — kvalita a použitelnost

| ID | Co hledáme | Proč | Kde hledat | Stav |
|---|---|---|---|---|
| D10 | České testy: shrnutí, extrakce, e-mail, kód, screenshot | anglické benchmarky nestačí | vlastní zadání, komunitní testy, OpenWork zkušenosti | `[DOPLNIT]` |
| D11 | Vision testy: dokumenty, OCR, tabulky, screenshoty | vision je výchozí, kvalita se liší | model cards, komunitní reporty, Reddit, GitHub | `[DOPLNIT]` |
| D12 | Hluk, příkon a teploty v zátěži | rozhoduje o použití v kanceláři | recenze, fóra, měření uživatelů | `[DOPLNIT]` |
| D13 | Tool calling a agentní úlohy | agenti jsou hlavní use case | model cards, benchmarky, komunitní testy | `[DOPLNIT]` |

## P1 — ceny a dostupnost

| ID | Co hledáme | Proč | Kde hledat | Stav |
|---|---|---|---|---|
| C01 | České ceny všech 128GB konfigurací | US listovka není česká cena | Alza, CZC, TS Bohemia, Mironet, OEM | průběžně |
| C02 | Ověřit Alza snapshot ručně | Alza blokuje roboty (403) | Alza podle objednacího kódu | průběžně |
| C03 | RTX Spark notebook 128: všechny OEM ceny | ceny se liší podle OEM | Microsoft, ASUS, HP, Lenovo, MSI, Dell | průběžně |
| C06 | Kurzy ČNB a ECB | přepočet cen | ČNB, ECB | denně |

## P2 — nové modely a zařízení

| ID | Co hledáme | Proč | Kde hledat | Stav |
|---|---|---|---|---|
| N01 | Nové Qwen modely (3.9, 4.x, Flash, MoE) | obor se rychle vyvíjí | qwen.ai/blog, HF Qwen | průběžně |
| N02 | Nové Gemma modely | konkurence pro 128 GB | Google AI blog, HF google | průběžně |
| N03 | Nové MoE s malými aktivními parametry | jádro katalogu | HF trending, llamaperf, InferenceX | průběžně |
| N04 | Nová zařízení s 128GB+ unified pamětí | rozšiřuje katalog | NVIDIA, AMD, OEM, Alza | průběžně |
| N05 | Nové runtime a kvantizace (vLLM, llama.cpp, MLX, ROCm) | mění čísla i dostupnost | GitHub releases, docs | průběžně |
| N06 | Modely vyžadující pool/offload | jen jako varování, ne katalog | HF, vLLM recipes | průběžně |

## P2 — provoz a zdroje

| ID | Co hledáme | Proč | Kde hledat | Stav |
|---|---|---|---|---|
| S01 | Nové zdroje a změny model cardů | hlídač má pokrýt klíčové zdroje | RSS, GitHub releases, HF, HTML | týdně |
| S02 | Link rot a změny URL | mrtvé odkazy snižují důvěru | `npm run check:zdroje` | týdně |
| S03 | Alza a další prodejce s 403 | ruční kontrola | `kontrola: manual` | týdně |
| S04 | Changelog a `overeno` | každá změna má datum | `data/zmeny.yaml` | průběžně |
| S05 | Kontaktní e-mail provozovatele | chybí v právních informacích | ESHOpino | `[DOPLNIT]` |
| S06 | Brand, GitHub organizace, analytics | blokuje publikaci | rozhodnutí provozovatele | `[DOPLNIT]` |

## Checklist pro nový model

1. Vejde se celý na jedno zařízení včetně KV cache pro 128k?
2. Je to MoE s malým počtem aktivních parametrů, nebo dense?
3. Má vision? Vyžaduje mmproj?
4. Jaké jsou kvantizace a jejich reálné velikosti?
5. Jaký je nativní a doporučený kontext?
6. Existuje měření na DGX Spark, RTX Spark nebo Strix Halu?
7. Je licence použitelná (Apache-2.0, MIT…)?
8. Nevyžaduje pool, tensor parallel nebo offload? Pokud ano, jen varování.
9. Má zdroj s datem a konfigurací?
10. Je v `data/zdroje.yaml` a má záznam v changelogu?

## Checklist pro nové zařízení

1. Má 128 GB a více unified paměti?
2. Je hotové (turnkey), ne skládačka?
3. Jaká je cena v USD a v ČR, s datem a zdrojem?
4. Jaká je propustnost paměti a reálný GPU pool?
5. Vejde se na něj Qwen3.8 s 128k?
6. Existuje veřejné měření, nebo je to `[DOPLNIT]`?
7. Je dostupné v ČR, nebo jen v US?
8. Má vlastní stránku a je v `data/zarizeni.yaml`?

## Kdy je položka hotová

- Hodnota je v `data/*.yaml` s `zdroj`, `overeno`, `typ` a `duveryhodnost`.
- Text na stránce ji používá a nemá `[DOPLNIT]`.
- Změna je v `data/zmeny.yaml`.
- Zdroj je v `data/zdroje.yaml` a `npm run check:zdroje` projde.
- `npm run check` a `npm run build` projdou bez varování.

## Kudy dál

- [Co nevíme](/zdroje/co-nevime/) — veřejný seznam mezer.
- [Zdroje](/zdroje/zdroje/) — registr a frekvence kontroly.
- [Metodika](/o-webu/metodika/) — jak data čteme.
- [Changelog](/zdroje/novinky/) — co se změnilo.
