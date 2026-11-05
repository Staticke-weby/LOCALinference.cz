# Registr mezer

*Vygenerováno z `data/chybi.yaml`. Neupravuj ručně — měň YAML a spusť `npm run chybi:zapis`.*

**47 položek** · 15 otevreno · 2 ceka-na-vas · 15 prubezne · 15 hotovo · 34 markerů [DOPLNIT] na 13 stránkách.

## Souhrn podle dávek

| Dávka | Název | Otevřených |
|---|---|---|
| 1 | Generování: rychlosti, licence a slovník | 1 |
| 2 | Katalogová data Qwen3.8 | 6 |
| 3 | Kvalita, čeština a provoz | 3 |
| 4 | Ceny a dostupnost | 5 |
| 5 | Obsah a propojení | 4 |
| 6 | Infrastruktura a publikace | 4 |
| 7 | Průběžná údržba | 9 |

## Dávka 1 — Generování: rychlosti, licence a slovník

*Doplnit čísla, která na stránkách generování chybí, a uzavřít licenční otázky.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| G01 | RTX Spark: časy generování obrázků | P0 | hotovo | /generovani/obrazky/<br>/generovani/recepty/<br>/generovani/recepty/windows/<br>/generovani/recepty/index/ |
| G04 | Ověřit licence generativních modelů | P0 | hotovo | /generovani/<br>/generovani/licence/ |
| G02 | Mac: 3D a video | P1 | hotovo | /generovani/recepty/macos/<br>/generovani/3d/<br>/generovani/video/<br>/generovani/rozhybani-obrazku/<br>/generovani/uprava-obrazku/ |
| G03 | Strix Halo: video a 3D | P1 | hotovo | /generovani/video/<br>/generovani/uprava-videa/<br>/generovani/3d/<br>/generovani/rozhybani-obrazku/<br>/generovani/uprava-obrazku/<br>/generovani/recepty/dgx-os/ |
| G05 | Stránka Licence generativních modelů | P1 | hotovo | /generovani/licence/ |
| G06 | Co na zařízeních poběží z generativních modelů | P1 | hotovo | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-mini/<br>/zarizeni/mac-studio/<br>/zarizeni/macbook-pro/<br>/zarizeni/rtx-spark-notebook/ |
| G07 | Slovník: difuze, LoRA, PBR, TTS, inpainting | P1 | hotovo | /slovnik/software/<br>/slovnik/ |
| G08 | RTX Spark: video | P1 | hotovo | /generovani/video/<br>/generovani/uprava-videa/<br>/generovani/recepty/windows/<br>/generovani/recepty/index/ |
| G09 | Slovník: VRAM a STT | P1 | hotovo | /slovnik/software/<br>/slovnik/ |
| G10 | RTX Spark: 3D a Z-Image při 8 krocích | P1 | otevreno | /generovani/3d/<br>/generovani/recepty/windows/<br>/generovani/recepty/dgx-os/<br>/generovani/recepty/linux/ |

- **G10** — 3D na RTX Sparku nemá veřejné měření. Chybí i Z-Image-Turbo při 8 krocích; FLUX při 20 krocích změřený je. *Hledat:* NVIDIA forum, Reddit, YouTube, LocalAgentBoard

## Dávka 2 — Katalogová data Qwen3.8

*TTFT, prefill, souběžnost a dlouhý kontext na všech zařízeních.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| D01 | RTX Spark mini: první veřejné měření Qwen3.8 | P0 | otevreno | /zarizeni/rtx-spark-mini/<br>/zarizeni/rtx-spark-notebook/ |
| D02 | DGX Spark a Strix Halo: TTFT a prefill na jednotném promptu | P0 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/data/qwen3-8-flash-next-strix-halo/ |
| D03 | Souběžnost 4+ na všech zařízeních | P0 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-mini/<br>/zarizeni/rtx-spark-notebook/<br>/zarizeni/srovnani/<br>/temata/128gb-unified-memory/ |
| D05 | Podložené doporučení provozního kontextu | P0 | hotovo | /modely/qwen3-8-flash-next/<br>/zaciname/jak-cteme-data/ |
| D04 | 128k a 262k kontext: rychlost i kvalita | P1 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/modely/qwen3-8-flash-next/ |
| D06 | Kvantizace u čtyř měření na Strix Halu | P1 | otevreno | /data/qwen3-8-flash-next-strix-halo/<br>/zdroje/mereni/ |
| D08 | Windows ARM64 proti Linuxu na stejném modelu | P1 | otevreno | /zarizeni/rtx-spark-notebook/<br>/temata/lokalni-ai-na-windows-11/ |

- **D01** — Stránka nemá žádné číslo: TTFT, prefill, decode ani chování na 128k. *Hledat:* NVIDIA forum, llamaperf, Reddit, GitHub benchmarky
- **D02** — Reporty měří prefill různě, takže čísla nejdou srovnat. Chybí stejný prompt a stejná kvantizace. *Hledat:* madeye, llamaperf, SMF, SparkLab, GitHub
- **D03** — Většina reportů je single-stream. Chybí agregát a tok/s na jeden stream při čtyřech souběžných požadavcích. *Hledat:* vLLM a SGLang benchmarky, fóra, InferenceX
- **D04** — Maximum v datasheetu nic neříká o praxi. Chybí rychlost a kvalita na dlouhém kontextu pro Qwen3.8. *Hledat:* llamaperf, MRCR a needle testy, komunitní reporty
- **D06** — U čtyř záznamů v data/mereni.yaml je kvantizace [DOPLNIT]. Bez ní číslo nelze srovnat. *Hledat:* llamaperf detail reportu
- **D08** — Chybí srovnání Qwen3.8 Flash Next na RTX Sparku s Windows ARM64 a na DGX Sparku s Linuxem. *Hledat:* NVIDIA forum, komunitní měření, Reddit

## Dávka 3 — Kvalita, čeština a provoz

*Dosadit české testy, vision, tool calling a měření hluku.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| D10 | České testy: shrnutí, extrakce, e-mail, kód | P1 | otevreno | /modely/qwen3-8-flash-next/<br>/temata/lokalni-ai-a-cestina/ |
| D11 | Vision: dokumenty, OCR, tabulky, screenshoty | P1 | otevreno | /modely/qwen3-8-flash-next/<br>/zarizeni/srovnani/ |
| D12 | Hluk, příkon a teploty v zátěži | P1 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-notebook/<br>/zarizeni/macbook-pro/<br>/slovnik/provoz/power-limit/ |
| D13 | Tool calling a agentní úlohy | P1 | hotovo | /modely/qwen3-8-flash-next/<br>/temata/lokalni-ai-agenti/ |

- **D10** — Anglické benchmarky nestačí. Chybí české úlohy na Qwen3.8. *Hledat:* komunitní testy, OpenWork zkušenosti, veřejné české benchmarky
- **D11** — Vision je výchozí, ale kvalita se liší. Chybí reálné testy. *Hledat:* model cards, komunitní reporty, Reddit, GitHub
- **D12** — Chybí měření hluku, příkonu a teplot pro DGX Spark, Strix Halo a RTX notebooky. *Hledat:* recenze, fóra, měření uživatelů

## Dávka 4 — Ceny a dostupnost

*Aktuální české ceny všech konfigurací a kurzy.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| C01 | České ceny všech 128GB konfigurací | P1 | prubezne | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-notebook/<br>/vyber/rozpocet/ |
| C03 | RTX Spark notebook: všechny OEM ceny | P1 | prubezne | /zarizeni/rtx-spark-notebook/<br>/zarizeni/konfigurace/ |
| C04 | Česká cena RTX Spark mini | P1 | hotovo | /zarizeni/rtx-spark-mini/<br>/temata/cena-lokalni-ai/<br>/vyber/rozpocet/ |
| C02 | Ruční kontrola Alza snapshotu | P2 | prubezne | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-notebook/ |
| C06 | Kurzy ČNB a ECB | P2 | prubezne | /vyber/rozpocet/<br>/temata/cena-lokalni-ai/ |
| C07 | Dostupnost Maců 128 GB | P2 | prubezne | /zarizeni/mac-studio/<br>/zarizeni/macbook-pro/ |

- **C01** — Americká listovka není česká cena. U části konfigurací chybí česká cena nebo je jen odhad. *Hledat:* Alza, CZC, TS Bohemia, Mironet, OEM
- **C03** — Ceny se liší podle OEM. Chybí české ceny některých variant. *Hledat:* Microsoft, ASUS, HP, Lenovo, MSI, Dell, Alza
- **C02** — Alza blokuje roboty (403), ceny je potřeba ověřovat ručně v prohlížeči. *Hledat:* Alza podle objednacího kódu
- **C06** — Kurzy je potřeba pravidelně aktualizovat kvůli přepočtům. *Hledat:* ČNB, ECB
- **C07** — Mac 128 GB je „na cestě“ / předprodej. Chybí potvrzení, kdy bude skladem, aby se dalo psát „skladem“. *Hledat:* Apple CZ, Alza

## Dávka 5 — Obsah a propojení

*Stránky, které na webu chybí, a odkazy mezi nimi.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| O04 | Google Search Console | P1 | otevreno | /temata/ |
| O02 | Ověřit Ollama tag pro Qwen3.8 | P2 | hotovo | /modely/qwen3-8-flash-next/ |
| O03 | Windows 11 na homepage | P2 | otevreno | /index/<br>/temata/lokalni-ai-na-windows-11/ |
| O05 | Sekce „Co chybí“ v tématech | P2 | otevreno | /temata/<br>/zdroje/co-nevime/ |
| O06 | Témata pro generování | P2 | otevreno | /temata/<br>/generovani/ |

- **O04** — Search Console není napojená, takže témata nevycházejí z reálných dotazů. *Hledat:* Google Search Console
- **O03** — Chybí karta nebo přepínač „chci to jako počítač“; zatím to řeší až srovnání a téma. *Hledat:* interní návrh
- **O05** — Není rozhodnuté, jestli má být seznam mezer veřejný u každého tématu. *Hledat:* rozhodnutí provozovatele
- **O06** — V data/temata.yaml nejsou témata pro obrázky, video, audio a 3D. SEO rozcestník se soustředí jen na Qwen a zařízení. *Hledat:* Google Search Console, dotazy čtenářů

## Dávka 6 — Infrastruktura a publikace

*Doména, tokeny a věci, které čekají na provozovatele.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| I01 | Přepnout DNS u Vedos | P0 | hotovo | — |
| I02 | Secret PUBLIKACE_TOKEN | P0 | ceka-na-vas | — |
| I06 | Kontaktní e-mail pro veřejnost | P0 | ceka-na-vas | /o-webu/pravni/ |
| I03 | EN mutace sites/eu | P1 | otevreno | — |
| I04 | Umami se posílá i z localhostu | P2 | hotovo | — |
| I05 | Deploy občas visí | P2 | prubezne | — |

- **I02** — Bez fine-grained PAT s Contents: RW na LOCALinference.eu EN workflow nepublikuje. *Hledat:* GitHub nastavení repozitáře
- **I06** — V právních informacích chybí kontaktní e-mail. Blokuje dokončení /o-webu/pravni/. *Hledat:* ESHOpino
- **I03** — Anglická mutace nemá zdroj, build ani doménu. *Hledat:* interní práce
- **I05** — GitHub Pages deployment občas zůstane viset nebo se zruší. *Hledat:* GitHub Actions

## Dávka 7 — Průběžná údržba

*Sledování nových modelů, runtime a zdrojů.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| N01 | Nové verze Qwen3.8 Flash Next | P2 | prubezne | — |
| N02 | Nové kvantizace Qwen3.8 | P2 | prubezne | — |
| N03 | Nová podpora v runtime | P2 | prubezne | — |
| N04 | Nová zařízení se 128 GB+ | P2 | prubezne | — |
| N05 | Software okolo modelu | P2 | prubezne | — |
| S01 | Změny zdrojů a model cardů | P2 | prubezne | — |
| S02 | Link rot a změny URL | P2 | prubezne | — |
| S03 | Alza a další prodejci s 403 | P2 | prubezne | — |
| S04 | Changelog a overeno | P2 | prubezne | — |

- **N01** — Sledovat model card, blog a licenci jediného modelu katalogu. *Hledat:* qwen.ai/blog, Hugging Face Qwen
- **N02** — Sledovat NVFP4, GGUF, MLX a QAT; mění paměť i rychlost. *Hledat:* Hugging Face, Unsloth, Ollama
- **N03** — Sledovat vLLM, llama.cpp, SGLang a Ollama; mění čísla i dostupnost. *Hledat:* GitHub releases, dokumentace
- **N04** — Sledovat NVIDIA, AMD, OEM a Alza. *Hledat:* NVIDIA, AMD, OEM, Alza
- **N05** — Sledovat MTP, QSA, mmproj a tool parsery. *Hledat:* vLLM recipes, llama.cpp, Hugging Face
- **S01** — Hlídač má pokrýt klíčové zdroje; chybí kontrola, že nic nevypadlo. *Hledat:* RSS, GitHub releases, Hugging Face, HTML
- **S02** — Mrtvé odkazy snižují důvěru. *Hledat:* npm run check:zdroje
- **S03** — Automatická kontrola cen nefunguje, je potřeba ruční. *Hledat:* ruční kontrola v prohlížeči
- **S04** — Každá změna má mít datum a zápis v changelogu. *Hledat:* data/zmeny.yaml

## Markery [DOPLNIT] podle stránek

- `zarizeni/rtx-spark-mini` — 10×
- `zarizeni/dgx-spark` — 6×
- `zarizeni/rtx-spark-notebook` — 5×
- `modely/qwen3-8-flash-next` — 2×
- `slovnik/provoz/power-limit` — 2×
- `zarizeni/strix-halo` — 2×
- `generovani/recepty/dgx-os` — 1×
- `generovani/recepty/linux` — 1×
- `generovani/recepty/windows` — 1×
- `generovani/uprava-obrazku` — 1×
- `temata/128gb-unified-memory` — 1×
- `temata/cena-lokalni-ai` — 1×
- `zarizeni/srovnani` — 1×

## Data bez hodnot
- generativní modely bez rychlosti: 25/30
- generativní modely bez počtu parametrů: 4/30
- měření bez kvantizace: 4/21
