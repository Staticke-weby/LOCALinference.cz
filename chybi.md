# Registr mezer

*Vygenerováno z `data/chybi.yaml`. Neupravuj ručně — měň YAML a spusť `npm run chybi:zapis`.*

**54 položek** · 8 otevreno · 4 hleda-se · 1 ceka-na-vas · 19 prubezne · 22 hotovo · 33 markerů [DOPLNIT] na 13 stránkách.

## Souhrn podle dávek

| Dávka | Název | Otevřených |
|---|---|---|
| 1 | Generování: rychlosti, licence a slovník | 2 |
| 2 | Katalogová data Qwen3.8 | 6 |
| 3 | Kvalita, čeština a provoz | 2 |
| 4 | Ceny a dostupnost | 5 |
| 5 | Obsah a propojení | 2 |
| 6 | Infrastruktura a publikace | 2 |
| 7 | Průběžná údržba | 9 |
| 8 | Abliterace a bezpečnost | 3 |
| 9 | Zkušenosti a recenze | 1 |

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
| G11 | Časy úprav obrázků: inpainting a outpainting | P2 | otevreno | /generovani/uprava-obrazku/ |

- **G10** — 3D na RTX Spark nemá veřejné měření. Chybí i Z-Image-Turbo při 8 krocích; FLUX při 20 krocích změřený je. *Hledat:* NVIDIA forum, Reddit, YouTube, LocalAgentBoard
- **G11** — Veřejné časy úprav obrázků na zařízeních — inpainting, outpainting a přebarvení. Stránka zatím jen říká, že úprava je pomalejší než generování. *Hledat:* kyuz0 toolboxes, ComfyUI benchmarky, Reddit r/StableDiffusion, YouTube

## Dávka 2 — Katalogová data Qwen3.8

*TTFT, prefill, souběžnost a dlouhý kontext na všech zařízeních.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| D01 | RTX Spark mini: první veřejné měření Qwen3.8 | P0 | hleda-se | /zarizeni/rtx-spark-mini/<br>/zarizeni/rtx-spark-notebook/<br>/temata/rtx-spark/ |
| D02 | DGX Spark a Strix Halo: TTFT a prefill na jednotném promptu | P0 | hleda-se | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/data/qwen3-8-flash-next-strix-halo/ |
| D03 | Souběžnost 4+ na všech zařízeních | P0 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-mini/<br>/zarizeni/rtx-spark-notebook/<br>/zarizeni/srovnani/<br>/temata/128gb-unified-memory/ |
| D05 | Podložené doporučení provozního kontextu | P0 | hotovo | /modely/qwen3-8-flash-next/<br>/zaciname/jak-cteme-data/ |
| D04 | 128k a 262k kontext: rychlost i kvalita | P1 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/modely/qwen3-8-flash-next/ |
| D06 | Kvantizace u čtyř měření na Strix Halo | P1 | hleda-se | /data/qwen3-8-flash-next-strix-halo/<br>/zdroje/mereni/ |
| D08 | Windows ARM64 proti Linuxu na stejném modelu | P1 | hotovo | /zarizeni/rtx-spark-notebook/<br>/temata/lokalni-ai-na-windows-11/ |
| Z06 | Gorgon Halo 192 GB: chybí nezávislé měření | P1 | prubezne | /zarizeni/gorgon-halo/<br>/zarizeni/srovnani/ |

- **D01** — Stránka nemá žádné číslo: TTFT, prefill, decode ani chování na 128k. *Hledat:* NVIDIA forum, llamaperf, Reddit, GitHub benchmarky
- **D02** — DGX Spark je hotový: TTFT 201–236 ms (krátké prompty) a prefill 1 825 tok/s na 32 791tokovém dokumentu (madeye, 10. 9. 2026). Chybí TTFT u Strix Halo — prefill tam je 770–2 372 tok/s podle enginu — a TTFT i prefill u RTX Spark mini a notebooku. Pořád chybí stejný prompt napříč zařízeními. *Hledat:* madeye, llamaperf, SMF, SparkLab, GitHub
- **D03** — DGX Spark má 4 souběžné prompty 100,2 tok/s agregát a 6 streamů 91,9 tok/s, oboje na krátkých promptech. Chybí 4+ souběžně na Strix Halo, RTX Spark a Macu a kdekoli na dlouhém kontextu. *Hledat:* vLLM a SGLang benchmarky, fóra, InferenceX
- **D04** — Maximum v datasheetu nic neříká o praxi. Chybí rychlost a kvalita na dlouhém kontextu pro Qwen3.8. *Hledat:* llamaperf, MRCR a needle testy, komunitní reporty
- **D06** — U čtyř záznamů v data/mereni.yaml je kvantizace [DOPLNIT]. Bez ní číslo nelze srovnat. *Hledat:* llamaperf detail reportu
- **Z06** — Nemáme nezávislý test Qwen3.8 Flash Next ani větších modelů na Ryzen AI Max+ PRO 495. První komunitní test existuje, ale je sporný: 19–20 tok/s na krátkém promptu, 4,6 tok/s na 249K. Jiní uživatelé hlásí 50–65 tok/s a konfiguraci zpochybňují. *Hledat:* Phoronix, Local LLM Benchmarks, Reddit r/LocalLLaMA, recenze 495

## Dávka 3 — Kvalita, čeština a provoz

*Dosadit české testy, vision, tool calling a měření hluku.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| D10 | České testy: shrnutí, extrakce, e-mail, kód | P1 | hleda-se | /modely/qwen3-8-flash-next/<br>/temata/lokalni-ai-a-cestina/ |
| D11 | Vision: dokumenty, OCR, tabulky, screenshoty | P1 | hotovo | /modely/qwen3-8-flash-next/<br>/zarizeni/srovnani/ |
| D12 | Hluk, příkon a teploty v zátěži | P1 | prubezne | /zarizeni/dgx-spark/<br>/zarizeni/strix-halo/<br>/zarizeni/rtx-spark-notebook/<br>/zarizeni/macbook-pro/<br>/slovnik/provoz/power-limit/ |
| D13 | Tool calling a agentní úlohy | P1 | hotovo | /modely/qwen3-8-flash-next/<br>/temata/lokalni-ai-agenti/ |

- **D10** — Anglické benchmarky nestačí. Chybí české úlohy na Qwen3.8. *Hledat:* komunitní testy, OpenWork zkušenosti, veřejné české benchmarky
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
- **C02** — Alza blokuje fetch/HEAD (403), ceny je potřeba ověřovat ručně. OpenChamber browser kategorie i produkty načte. *Hledat:* Alza podle objednacího kódu
- **C06** — Kurzy je potřeba pravidelně aktualizovat kvůli přepočtům. *Hledat:* ČNB, ECB
- **C07** — Mac 128 GB je „na cestě“ / předprodej. Chybí potvrzení, kdy bude skladem, aby se dalo psát „skladem“. *Hledat:* Apple CZ, Alza

## Dávka 5 — Obsah a propojení

*Stránky, které na webu chybí, a odkazy mezi nimi.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| O04 | Google Search Console | P1 | hotovo | /temata/ |
| O02 | Ověřit Ollama tag pro Qwen3.8 | P2 | hotovo | /modely/qwen3-8-flash-next/ |
| O03 | Windows 11 na homepage | P2 | otevreno | /index/<br>/temata/lokalni-ai-na-windows-11/ |
| O05 | Sekce „Co chybí“ v tématech | P2 | otevreno | /temata/<br>/zdroje/co-nevime/ |
| O06 | Témata pro generování | P2 | hotovo | /temata/<br>/generovani/ |

- **O03** — Chybí karta nebo přepínač „chci to jako počítač“; zatím to řeší až srovnání a téma. *Hledat:* interní návrh
- **O05** — Není rozhodnuté, jestli má být seznam mezer veřejný u každého tématu. *Hledat:* rozhodnutí provozovatele

## Dávka 6 — Infrastruktura a publikace

*Doména, tokeny a věci, které čekají na provozovatele.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| I01 | Přepnout DNS u Vedos | P0 | hotovo | — |
| I02 | EN Pages a workflow v .eu | P0 | ceka-na-vas | — |
| I06 | Kontaktní e-mail pro veřejnost | P0 | hotovo | /o-webu/pravni/ |
| I03 | EN mutace sites/eu | P1 | hotovo | — |
| I04 | Umami se posílá i z localhostu | P2 | hotovo | — |
| I05 | Deploy občas visí | P2 | prubezne | — |

- **I02** — Workflow deploy.yml v .eu repu je hotový. Zbývá zapnout Pages (GitHub Actions) a nastavit custom domain www.localinference.eu včetně DNS. *Hledat:* GitHub .eu repo → Settings → Pages; DNS u registrátora
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
- **S03** — Automatická kontrola cen nefunguje (403), je potřeba ruční přes OpenChamber browser. *Hledat:* ruční kontrola v OpenChamber browseru
- **S04** — Každá změna má mít datum a zápis v changelogu. *Hledat:* data/zmeny.yaml

## Dávka 8 — Abliterace a bezpečnost

*Doložit paritu abliterovaného modelu, českou sadu odmítání a chování PLE z SSD.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| A01 | Abliterovaný Qwen3.8: nezávislá parita NVFP4 | P0 | prubezne | /temata/abliterace/provoz-na-128-gb/<br>/modely/qwen3-8-flash-next-abliterated/ |
| A04 | Česká sada pro měření odmítání | P1 | otevreno | /temata/abliterace/odmitani/<br>/temata/abliterace/provoz-na-128-gb/ |
| A05 | Vliv PLE z SSD na TTFT a decode | P1 | prubezne | /temata/abliterace/provoz-na-128-gb/ |
| A06 | PLE z SSD na RTX Spark | P1 | hotovo | /temata/abliterace/provoz-na-128-gb/<br>/modely/qwen3-8-flash-next-abliterated/ |

- **A01** — Parita abliterovaného NVFP4 proti NVIDIA FP4-Local je doložená jen měřením vydavatelů (DevelopingDad, lflare). Chybí nezávislý test na stejném zařízení a se stejnou konfigurací. *Hledat:* nezavisle benchmarky, DGX Spark, llamaperf, Hugging Face discussions
- **A04** — Nemáme veřejnou českou sadu 50 benigních a 50 škodlivých promptů se scorerem, takže čísla odmítání nejdou srovnat v češtině. *Hledat:* české safety benchmarky, akademické sady, OWASP
- **A05** — Chybí měření, jak se projeví n-gramy z SSD při 8k, 32k, 128k a 262k kontextu na 128GB boxu. *Hledat:* NVMe io_uring, vLLM PLE offload, DGX Spark

## Dávka 9 — Zkušenosti a recenze

*Doplnit nezávislá měření k nové sekci Zkušenosti a recenze u zařízení.*

| ID | Co chybí | Priorita | Stav | Stránky |
|---|---|---|---|---|
| Z01 | Zkušenosti a recenze: chybějící nezávislá měření | P1 | otevreno | /zarizeni/dgx-spark/<br>/zarizeni/rtx-spark-mini/<br>/zarizeni/rtx-spark-notebook/<br>/zarizeni/strix-halo/<br>/zarizeni/mac-studio/<br>/zarizeni/macbook-pro/<br>/zarizeni/gorgon-halo/ |

- **Z01** — Sekce Zkušenosti a recenze má u každého zařízení veřejné recenze a reporty majitelů, ale chybí nezávislé měření Qwen3.8 na RTX Spark mini a notebooku, na 128GB Mac Studiu a na 192GB Gorgon Halo při 128k a 262k kontextu. U Strix Halo chybí dB pro konkrétní OEM boxy. *Hledat:* Notebookcheck, Tom's Hardware, Level1Techs, Reddit r/LocalLLaMA, Hugging Face benchmark datasety

## Markery [DOPLNIT] podle stránek

- `zarizeni/rtx-spark-mini` — 10×
- `zarizeni/rtx-spark-notebook` — 5×
- `zarizeni/dgx-spark` — 3×
- `zarizeni/gorgon-halo` — 3×
- `modely/qwen3-8-flash-next` — 2×
- `slovnik/provoz/power-limit` — 2×
- `zarizeni/strix-halo` — 2×
- `generovani/recepty/dgx-os` — 1×
- `generovani/recepty/linux` — 1×
- `generovani/recepty/windows` — 1×
- `generovani/uprava-obrazku` — 1×
- `temata/rtx-spark` — 1×
- `zarizeni/srovnani` — 1×

## Data bez hodnot
- generativní modely bez rychlosti: 25/30
- generativní modely bez počtu parametrů: 4/30
- měření bez kvantizace: 4/23
