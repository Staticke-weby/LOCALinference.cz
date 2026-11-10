# Plán rozšíření témat a slovníku

*Verze 1.0 — 10. listopadu 2026*

**Cíl:** dostat `/temata/` a `/slovnik/` na úroveň, kdy každá stránka obstojí jako samostatný, užitečný a dobře prolinkovaný zdroj — pro českého čtenáře i pro Google. Nejde o nafouknutí textu, ale o hloubku, konkrétní čísla, české příklady a jasné rozhodování.

---

## 0. Shrnutí

Web má **105 obsahových stránek a 44 649 slov**. Zařízení jsou zpracovaná dobře (900–1 600 slov), ale témata mají **173–408 slov** a slovník **202–366 slov**. Většina témat dnes jen opakuje stránku zařízení nebo modelu. To je největší obsahová rezerva.

Plán má čtyři vrstvy:

1. **Opravit prolinkování** — 9 strukturálních chyb, které odhalil nový audit.
2. **Přepsat tenká témata** na 1 200–2 200 slov podle jednotné šablony.
3. **Rozšířit slovník** ze 36 na 55–60 hesel a z 250 na 500–900 slov u klíčových pojmů.
4. **Přidat nové obsahové clustery** — praxe, čeština a dokumenty, RAG, agenti, provoz a bezpečnost.

Každá nová stránka musí projít stejnou branou: zdroje, datum, český příklad, rozhodovací tabulka, 4–6 interních odkazů a žádné `[DOPLNIT]` bez záznamu v registru mezer.

---

## 1. Výchozí stav a audit

### 1.1 Objem a hloubka

| Sekce | Stránek | Průměr slov | Poznámka |
|---|---:|---:|---|
| Zařízení | 10 | 900–1 600 | silné stránky, ceny, měření |
| Modely | 2 | 500–950 | Qwen3.8 a MoE |
| Návody | 5 | 400–900 | praktické, ale chybí troubleshooting |
| Témata | 13 | 173–408 | **hlavní dluh** |
| Slovník | 37 | 202–366 | definice bez hloubky |
| Generování | 16 | 200–800 | roztříštěné, chybí workflow |
| Výběr | 4 | 278–714 | rozhodovací stránky |
| Začínáme | 5 | 239–1 347 | dobrý základ |
| Data a zdroje | 6 | 174–451 | málo rozvinuté |

### 1.2 Nejtenčí témata

| Stránka | Slov | Problém |
|---|---:|---|
| `/temata/128gb-unified-memory/` | 173 | chybí matematika paměti a srovnání 64/128/192 GB |
| `/temata/qwen3-8-flash-next/` | 197 | opakuje model page, chybí úlohy a čeština |
| `/temata/strix-halo/` | 199 | opakuje device page, chybí rozhodnutí a TCO |
| `/temata/rtx-spark/` | 219 | chybí Windows ARM64, baterie, teplo |
| `/temata/dgx-spark/` | 226 | chybí software, cluster, TCO |
| `/temata/lokalni-ai-pro-firmy/` | 230 | chybí use cases, pilot, ROI, bezpečnost |
| `/temata/cena-lokalni-ai/` | 240 | chybí TCO, elektřina, cloud vs. local |
| `/temata/lokalni-ai-na-windows-11/` | 406 | chybí instalace, WSL2, CUDA, troubleshooting |
| `/temata/lokalni-ai-na-obrazky/` | 398 | chybí workflow, VRAM, čas, licence |
| `/temata/lokalni-ai-na-video/` | 408 | chybí délka klipu, čas, zvuk, licence |
| `/temata/lokalni-ai-na-audio/` | 378 | chybí STT/TTS, čeština, etika |
| `/temata/lokalni-ai-na-3d/` | 404 | chybí pipeline, PBR, GLB, licence |

### 1.3 Audit prolinkování

Nový nástroj `npm run check:prolinkovani` čte **hotové HTML**, ne jen Markdown, takže vidí i odkazy, které doplňuje `rehypeSlovnik`.

**Baseline k 10. 11. 2026:**

- 129 obsahových stránek v dist (3 staré OEM URL jsou redirecty, audit je přeskakuje).
- 12 témat, 36 slovních hesel.
- **Výchozí stav: 9 chyb.** Po dávce 0 (10. 11. 2026) je stav **0 chyb, 0 varování**:
  - `/temata/cena-lokalni-ai/` — doplněn model a dva pojmy.
  - `/temata/lokalni-ai-pro-firmy/` — doplněno zařízení a dva pojmy.
  - `/temata/lokalni-ai-na-windows-11/` — doplněn model, WSL2 a odkazy.
  - `/temata/qwen3-8-flash-next/` — doplněna tři zařízení.
  - `/temata/rtx-spark/` — doplněn model.
  - `/slovnik/software/upscaling/` — doplněn vstup z tématu obrázky.
  - `/slovnik/software/wsl2/` — doplněn vstup z tématu Windows.
- 0 stránek bez odchozího odkazu.
- Pouze homepage nemá vstupní odkaz z obsahu — to je v pořádku, je v navigaci.
- 25 konfigurací má 1 vstupní odkaz ze stránky zařízení — to je přijatelné, ale ideální je přidat odkaz i ze srovnání.

**Co to znamená:** web není rozbitý, ale měl slepá místa. Témata o zařízeních nevedla na model, obchodní témata nevedla na konkrétní stroj a dva pojmy ve slovníku neměly žádný vstup. Dávka 0 to opravila; nové stránky musí stejný standard udržet.

---

## 2. Redakční principy pro rozšíření

1. **Jeden záměr na stránku.** Téma „cena“ neodpovídá na „jak vybrat stroj“; to patří na stránku výběru.
2. **Odpověď v prvních dvou odstavcích.** Čtenář má vědět, jestli ho to zajímá, než začne scrollovat.
3. **Byznys před technikou.** U každého tématu: co to řeší, kolik to stojí, kde je limit, pro koho to není.
4. **Český příklad.** Ne „model potřebuje paměť“, ale „Qwen3.8 Flash Next má při NVFP4 váhy ~101 GB, na 128GB boxu zbývá ~27 GB na KV cache“.
5. **Žádná vlastní měření.** Pouze převzatá data se zdrojem, datem, konfigurací a důvěryhodností.
6. **Žádné vymyšlené číslo.** Když chybí, `[DOPLNIT: co]` a záznam v `data/chybi.yaml`.
7. **Žádná kanibalizace.** Stránka zařízení vlastní cenu a nákup; téma vlastní vysvětlení a rozhodnutí.
8. **Hloubka není délka.** Cílový počet slov je orientační; rozhoduje tabulka, výpočet, příklad a jasná odpověď.
9. **Čeština první, EN až po stabilizaci.** EN mutace se doplní po dokončení dávky, ne průběžně.

---

## 3. Obsahová architektura

### 3.1 Clustery

| Cluster | Pilíř | Stránky | Účel |
|---|---|---|---|
| Zařízení a cena | `/temata/128gb-unified-memory/` | 128 GB, cena, DGX, Strix, RTX, Windows, výběr | rozhodnout, co koupit a proč |
| Praxe | `/temata/lokalni-ai-pro-firmy/` | právo, účetnictví, výroba, zdravotnictví, školy, marketing, vývojáři, veřejná správa | co s tím dělat v práci |
| Čeština a dokumenty | nové `/temata/cestina/` | diakritika, shrnutí, extrakce, překlad, hodnocení | největší česká neznámá |
| RAG a dokumenty | nové `/temata/rag/` | PDF, chunking, embeddingy, citace, oprávnění | firemní dokumenty |
| Agenti | nové `/temata/agenti/` | tool calling, MCP, coding agent, office, sandbox | automatizace |
| Provoz a bezpečnost | nové `/temata/provoz/` | API, monitoring, updaty, prompt injection, GDPR/AI Act | malé týmy |
| Generování | `/temata/lokalni-ai-na-obrazky/` | obrázky, video, audio, 3D, recepty | kreativní práce |
| Slovník | `/slovnik/` | 55–60 hesel | podpůrná vrstva pro všechny clustery |

### 3.2 Pravidlo hub-and-spoke

Každý cluster má jeden pilíř (1 500–2 500 slov) a 5–8 dceřiných stránek (800–1 500 slov). Pilíř odkazuje na všechny dceřiné stránky; každá dceřiná stránka odkazuje zpět na pilíř a na 2–3 sourozence. Slovník je propojený s oběma směry.

---

## 4. Šablona tématu 2.0

Cíl: **1 200–2 200 slov** podle šíře tématu.

| # | Sekce | Rozsah | Co musí obsahovat |
|---|---|---:|---|
| 1 | H1 + verdikt | 40–60 slov | jednoznačná odpověď, ne úvod do děje |
| 2 | Rychlá odpověď | 3 odrážky | pro koho, co to stojí, kde je limit |
| 3 | Pro koho / pro koho ne | 80–120 slov | konkrétní situace, ne marketing |
| 4 | Jak to funguje | 200–300 slov | vysvětlení bez žargonu, první výskyt pojmu = odkaz |
| 5 | Co to umí a neumí | tabulka | 4–8 řádků, konkrétní čísla a konfigurace |
| 6 | Kolik to stojí | 150–250 slov | CZK k datu, provoz, elektřina, čas |
| 7 | Jak to běží na 128 GB | 200–300 slov | reálné hodnoty, ne datasheet |
| 8 | Kde je limit a co se pokazí | 150–250 slov | throttling, KV cache, fronta, licence |
| 9 | Rozhodovací tabulka | 100–200 slov | kdy A, kdy B, kdy C |
| 10 | Časté chyby | 100–150 slov | 3–5 chyb, které lidé dělají |
| 11 | Kudy dál | 4–6 odkazů | popisné kotvy, ne „zde“ |
| 12 | Zdroje | 5–10 položek | datum, typ, konfigurace |

**Povinné prvky:** alespoň jedna tabulka, jeden výpočet nebo diagram, jeden český příklad, jedno „kdy to nepoužívat“.

---

## 5. Šablona slovníku 2.0

Cíl: **500–900 slov** u klíčových pojmů, **350–500** u okrajových.

| # | Sekce | Co musí obsahovat |
|---|---|---|
| 1 | Definice | 1–2 věty, bez kruhového vysvětlení |
| 2 | Proč to existuje | jaký problém to řeší |
| 3 | Jak to potkáte na 128 GB | konkrétní číslo, zařízení, model |
| 4 | Číslo nebo tabulka | paměť, tok/s, TTFT, cena, kvantizace |
| 5 | Častý mýtus | co si lidé myslí a proč to není pravda |
| 6 | Kdy to nezáleží | aby čtenář neřešil detaily bez dopadu |
| 7 | Související pojmy | 3–5 odkazů s vysvětlením vztahu |
| 8 | Kudy dál | 1 téma + 1 zařízení/model + 1 návod |
| 9 | Zdroje | 2–4 odkazy s datem |

**Automatické prolinkování:** každý nový pojem se přidá do `TERMS` v `sites/cz/astro.config.mjs`. Pojem, který se na webu vyskytuje méně než na 3 stránkách, dostane explicitní odkazy v „Kudy dál“, ne jen automatiku.

---

## 6. Plán po stránkách: témata

### 6.1 Prioritní přehled

| Stránka | Nyní | Cíl | Priorita | Dávka |
|---|---:|---:|---|---|
| `/temata/128gb-unified-memory/` | 173 | 1 600 | P0 | 1 |
| `/temata/cena-lokalni-ai/` | 240 | 2 200 | P0 | 1 |
| `/temata/lokalni-ai-pro-firmy/` | 230 | 2 200 | P0 | 1 |
| `/temata/qwen3-8-flash-next/` | 197 | 1 800 | P0 | 1 |
| `/temata/strix-halo/` | 199 | 1 400 | P1 | 1 |
| `/temata/rtx-spark/` | 219 | 1 400 | P1 | 1 |
| `/temata/dgx-spark/` | 226 | 1 400 | P1 | 1 |
| `/temata/lokalni-ai-na-windows-11/` | 406 | 1 600 | P1 | 2 |
| `/temata/lokalni-ai-na-obrazky/` | 398 | 1 400 | P1 | 2 |
| `/temata/lokalni-ai-na-video/` | 408 | 1 400 | P1 | 2 |
| `/temata/lokalni-ai-na-audio/` | 378 | 1 200 | P2 | 2 |
| `/temata/lokalni-ai-na-3d/` | 404 | 1 200 | P2 | 2 |
| `/temata/` | 197 | 800 | P1 | 1 |

### 6.2 Detailní zadání

#### `/temata/128gb-unified-memory/` — 1 600 slov

**Hledaný záměr:** „128 GB unified memory“, „kolik paměti pro lokální AI“, „proč 128 GB“.

**Osnova:**

1. Proč 128 GB: Qwen3.8 Flash Next v NVFP4 má ~101 GB váhy; na 128 GB zbývá ~27 GB na KV cache, aktivace a systém.
2. Výpočet pro 8k / 32k / 128k / 262k kontext: tabulka KV cache, co se vejde a co ne.
3. 64 vs. 128 vs. 192 GB: co který práh umožní; 64 GB je pod minimum, 192 GB je prostor pro delší kontext, ne pro obří modely.
4. Co se do 128 GB vejde: Q38FN, menší modely, generativní modely; co ne (dense 70B, modely nad ~200B).
5. Mýty: „128 GB = 128 GB VRAM“, „více paměti = rychlejší“, „unified memory lze rozšířit“.
6. Kdy je 128 GB málo: 20+ uživatelů, 262k kontext, více modelů najednou.
7. Tabulka zařízení a jejich reálného využití.
8. Odkazy: model, srovnání zařízení, KV cache, kontext, kvantizace, roofline.

**Povinné odkazy:** `/modely/qwen3-8-flash-next/`, `/zarizeni/srovnani/`, `/slovnik/pamet/kv-cache/`, `/slovnik/pamet/kontext/`, `/slovnik/software/kvantizace/`, `/rychlost/roofline/`.

#### `/temata/cena-lokalni-ai/` — 2 200 slov

**Hledaný záměr:** „kolik stojí lokální AI“, „cena lokální AI“, „vyplatí se lokální AI“.

**Osnova:**

1. Pořizovací cena: tabulka všech zařízení v CZK vč. DPH k datu, USD v závorce.
2. TCO na 3 roky: elektřina (W × hodiny × cena kWh), servis, záruka, odepis, rezerva na upgrade.
3. Skryté náklady: SSD, zálohy, UPS, síť, místo, hluk, administrativa.
4. Cloud vs. local: cena za 1M tokenů, scénáře 1/5/20 uživatelů, break-even.
5. Kdy je lokální AI levnější a kdy ne: tabulka podle využití.
6. Jak ušetřit: menší stroj, 128 GB místo 192 GB, jeden stroj pro tým.
7. Kalkulačka a metodika výpočtu.
8. Odkazy: rozpočet, kalkulačka, zařízení, model, elektřina.

**Povinné odkazy:** `/vyber/rozpocet/`, `/rychlost/kalkulacka/`, `/zarizeni/srovnani/`, `/modely/qwen3-8-flash-next/`, `/slovnik/vykon/tok-s/`, `/slovnik/software/kvantizace/`.

#### `/temata/lokalni-ai-pro-firmy/` — 2 200 slov

**Hledaný záměr:** „lokální AI pro firmy“, „AI bez cloudu pro firmu“, „firemní AI na vlastním serveru“.

**Osnova:**

1. Kdy má smysl: citlivá data, offline, předvídatelné náklady, vlastní dokumenty.
2. Use-case matice: právo, účetnictví, výroba, zdravotnictví, školy, marketing, vývoj, veřejná správa; datová citlivost, objem, přínos.
3. Pilot za 4 týdny: proces, data, baseline, vyhodnocení, bezpečnost.
4. Make or buy: lokální box vs. cloud vs. dodavatel; lock-in.
5. ROI: příklad výpočtu s jasně označenými předpoklady.
6. Bezpečnost a právo: GDPR, AI Act, zaměstnanecká data, logy, retence.
7. Pořízení: otázky na dodavatele, záruka, servis, školení.
8. Kdy to nemá smysl: málo dat, krátký projekt, potřebujete frontier model.
9. Odkazy: RAG, agenti, provoz, zařízení, model.

**Povinné odkazy:** `/zarizeni/srovnani/`, `/modely/qwen3-8-flash-next/`, `/slovnik/software/rag/`, `/slovnik/software/agentni-ulohy/`, `/temata/rag/`, `/temata/provoz/`.

#### `/temata/qwen3-8-flash-next/` — 1 800 slov

**Hledaný záměr:** „Qwen3.8 Flash Next“, „Qwen3.8 Flash Next čeština“, „jak běží Qwen3.8“.

**Osnova:**

1. Proč tento model: 125B hlavní + 51B N-gram, 6B aktivních, MoE.
2. Architektura bez žargonu: QSA, Gated DeltaNet, MTP, N-gram embedding.
3. Co umí: text, kód, dokumenty, tool calling, vision; benchmarky s datem.
4. Čeština: co víme, co nevíme, jak si to otestovat.
5. Paměť a kvantizace: NVFP4, FP8, GGUF, MLX; co se vejde.
6. Kontext: 128k doporučený, 262k maximum, 1M s YaRN; co to udělá s KV cache.
7. Rychlost na zařízeních: DGX, Strix, RTX, Mac; rozpětí a konfigurace.
8. Limity: dlouhý kontext, souběžnost, halucinace, dense modely.
9. Licence: Qwen Community License 1.0.
10. Kdy sáhnout jinam: jen jako varování, ne doporučení.
11. Odkazy: model page, zařízení, měření, slovník.

**Povinné odkazy:** `/modely/qwen3-8-flash-next/`, `/zarizeni/srovnani/`, `/slovnik/software/mtp/`, `/slovnik/software/nvfp4/`, `/slovnik/pamet/kontext/`, `/zdroje/mereni/`.

#### `/temata/dgx-spark/` — 1 400 slov

**Osnova:** pro koho (CUDA, Linux, vLLM), co na něm běží, rychlost s konfigurací, 70 vs. 36,8 tok/s, software a updaty, spotřeba/hluk, TCO, DGX vs. RTX vs. Strix, clustery a limity.

**Povinné odkazy:** `/zarizeni/dgx-spark/`, `/modely/qwen3-8-flash-next/`, `/navody/dgx-spark/`, `/slovnik/software/cuda/`, `/slovnik/software/vllm/`, `/zarizeni/srovnani/`.

#### `/temata/strix-halo/` — 1 400 slov

**Osnova:** cena/výkon, ROCm a Vulkan, slabší prefill, Windows/Linux, OEM varianty a dostupnost, Q38FN rychlost, kontext, souběžnost, pro koho a pro koho ne, TCO, alternativy.

**Povinné odkazy:** `/zarizeni/strix-halo/`, `/modely/qwen3-8-flash-next/`, `/navody/strix-halo/`, `/slovnik/software/rocm/`, `/slovnik/vykon/prefill/`, `/zarizeni/srovnani/`.

#### `/temata/rtx-spark/` — 1 400 slov

**Osnova:** mini vs. notebook, Windows ARM64 a CUDA, baterie a teplo, Q38FN rychlost, zralost softwaru, cena, pro koho, TCO, alternativy.

**Povinné odkazy:** `/zarizeni/rtx-spark-mini/`, `/zarizeni/rtx-spark-notebook/`, `/modely/qwen3-8-flash-next/`, `/navody/rtx-spark/`, `/slovnik/software/cuda/`, `/slovnik/provoz/throttling/`.

#### `/temata/lokalni-ai-na-windows-11/` — 1 600 slov

**Osnova:** která zařízení, instalace, WSL2 vs. nativní Windows, CUDA, vLLM port, Ollama/llama.cpp, výkon, bezpečnost (Smart App Control, unsigned binaries), updaty, troubleshooting tabulka.

**Povinné odkazy:** `/zarizeni/rtx-spark-notebook/`, `/modely/qwen3-8-flash-next/`, `/navody/rtx-spark/`, `/slovnik/software/wsl2/`, `/slovnik/software/cuda/`, `/temata/provoz/`.

#### `/temata/lokalni-ai-na-obrazky/` — 1 400 slov

**Osnova:** modely (Z-Image, FLUX.2, Qwen-Image), workflow, VRAM a rozlišení, kroky a čas, licence, kvalita (ruce, text), dávkové zpracování, kdy je lepší cloud.

**Povinné odkazy:** `/generovani/obrazky/`, `/generovani/recepty/windows/`, `/slovnik/software/difuze/`, `/slovnik/software/inpainting/`, `/slovnik/software/upscaling/`, `/zarizeni/srovnani/`.

#### `/temata/lokalni-ai-na-video/` — 1 400 slov

**Osnova:** Wan/Hunyuan/LTX, délka klipu, rozlišení, čas, VRAM, zvuk, licence, workflow, kdy je lepší cloud.

**Povinné odkazy:** `/generovani/video/`, `/generovani/recepty/dgx-os/`, `/slovnik/software/difuze/`, `/slovnik/provoz/throttling/`, `/zarizeni/srovnani/`.

#### `/temata/lokalni-ai-na-audio/` — 1 200 slov

**Osnova:** STT a TTS, RTF, čeština, klonování hlasu, etika a licence, hardware, přesnost přepisu, kdy použít cloud.

**Povinné odkazy:** `/generovani/audio/`, `/slovnik/software/stt/`, `/slovnik/software/tts/`, `/generovani/licence/`, `/zarizeni/srovnani/`.

#### `/temata/lokalni-ai-na-3d/` — 1 200 slov

**Osnova:** image-to-3D, TRELLIS.2/Pixal3D/Hunyuan3D, PBR a GLB, čas, VRAM, licence, pipeline pro hry, kdy je lepší ruční práce.

**Povinné odkazy:** `/generovani/3d/`, `/slovnik/software/pbr/`, `/slovnik/software/lora/`, `/generovani/licence/`, `/zarizeni/srovnani/`.

#### `/temata/` — 800 slov

**Osnova:** mapa témat, doporučené pořadí čtení podle role (začátečník, firma, vývojář, kreativec), rozcestník podle problému („chci koupit“, „chci provozovat“, „chci tvořit“), novinky v tématech.

**Povinné odkazy:** všechny pilíře a klíčové stránky.

---

## 7. Plán po stránkách: slovník

### 7.1 Současný stav

36 hesel, 202–366 slov. Nejsou špatná, ale většina je jen definice. Chybí příklad na 128GB stroji, číslo, mýtus a vztahy.

### 7.2 Prioritní hesla

| Heslo | Nyní | Cíl | Co doplnit |
|---|---:|---:|---|
| `pamet/kontext` | 246 | 800 | tři čísla, KV cache, context rot, tabulka 8k/32k/128k/262k |
| `pamet/kv-cache` | 226 | 800 | výpočet pro Q38FN, kvantizace KV, souběžnost |
| `software/kvantizace` | 256 | 800 | NVFP4/FP8/GGUF/MLX, co ztratíte, tabulka |
| `vykon/tok-s` | 279 | 700 | token, decode vs. prefill, kdy číslo klame |
| `vykon/ttft` | 308 | 700 | prefill, fronta, kontext, tabulka |
| `vykon/prefill` | 323 | 700 | výpočet, Strix Halo, chunked prefill |
| `vykon/decode` | 324 | 700 | bandwidth, kvantizace, MTP |
| `pamet/unified-memory` | 300 | 700 | 128 GB příklad, VRAM vs. unified |
| `software/vllm` | 273 | 700 | kdy se vyplatí, MTP, OpenAI API |
| `software/rag` | 244 | 700 | pipeline, české dokumenty, citace |
| `software/llamacpp` | 283 | 600 | GGUF, Vulkan, MTP, limit jednoho uživatele |
| `software/nvfp4` | 285 | 600 | 101 GB, DGX Spark, kvalita |
| `software/mtp` | 248 | 600 | draft tokens, zrychlení, kdy nepomůže |
| `software/rocm` | 326 | 600 | Strix Halo, prefill, zralost |
| `software/cuda` | 350 | 600 | Windows ARM64, CUDA 13.4, co nefunguje |
| `provoz/throttling` | 289 | 600 | notebook vs. box, teplo, hluk |
| `provoz/power-limit` | 283 | 600 | W, tok/s, hluk, elektřina |
| `vykon/soubeznost` | 280 | 600 | KV cache, fronta, 4/8 streamů |
| `vykon/propustnost-pameti` | 262 | 600 | roofline, 273 GB/s, příklad |
| `pamet/vram` | 294 | 500 | unified vs. dedikovaná, 128 GB |

### 7.3 Nová hesla

| Skupina | Nové pojmy |
|---|---|
| Agenti | MCP, function calling, structured output, tool calling, sandbox, prompt injection |
| RAG | embeddingy, vektorová databáze, reranker, chunking, OCR, citace |
| Paměť | prefix caching, PagedAttention, RoPE/YaRN, context rot, KV cache kvantizace |
| Kvantizace | AWQ, GPTQ, EXL2, QAT, MLX 4bit, Q4_K_M |
| Výkon | throughput, latency, batch size, roofline |
| Provoz | API server, autentizace, monitoring, logy, zálohy |
| Modely | reasoning, distilled, dense vs. MoE, vision encoder, mmproj |
| Byznys | TCO, ROI, AI Act, GDPR, data residency |

**Cíl:** 55–60 hesel. Každé nové heslo musí mít zpětný odkaz z alespoň jednoho tématu nebo zařízení.

### 7.4 Diagramy

Inline SVG (bez rastrů):

1. KV cache v závislosti na kontextu.
2. Prefill vs. decode.
3. Roofline: bandwidth vs. výpočet.
4. MoE routing: 512 expertů, 10 aktivních.
5. RAG pipeline: dokument → chunk → embedding → retrieval → odpověď s citací.

---

## 8. Model prolinkování

### 8.1 Pravidla

| Stránka | Musí odkazovat na |
|---|---|
| Téma (textové) | 1–2 zařízení, 1 model, 4–6 pojmů, 2 související témata, 1 návod/data |
| Téma (generativní) | 1–2 zařízení, 3–5 pojmů, 1 recept, 1 licenční stránku |
| Slovník | 1 téma, 1 zařízení/model, 3 související pojmy, 1 návod |
| Zařízení | model, 3 pojmy, 2 témata, 1 návod, srovnání |
| Návod | zařízení, 2 pojmy, 1 téma, 1 troubleshooting |
| Generování | zařízení, 2 pojmy, 1 recept, licence |

### 8.2 Jak vypadají odkazy

- **Inline** při prvním výskytu pojmu, ne na konci odstavce.
- **Kudy dál** s 4–6 popisnými kotvami („jak se počítá KV cache“, ne „zde“).
- **Související pojmy** ve slovníku jako krátký seznam s jednou větou vztahu.
- **Žádné link farms** — 3 kvalitní odkazy jsou lepší než 15 nahodných.

### 8.3 Automatické prolinkování

`rehypeSlovnik` v `sites/cz/astro.config.mjs` odkazuje první výskyt termínu. Pro každý nový pojem:

1. Přidat do `TERMS` s regexem a URL.
2. Ověřit, že se nevkládá do nadpisů, kódu a existujících odkazů.
3. Ověřit, že pojem má alespoň 3 výskyty; jinak přidat explicitní odkazy.
4. Zkontrolovat, že se neodkazuje sám na sebe.

### 8.4 Ověření

Nový příkaz:

```bash
npm run check:prolinkovani
npm run check:prolinkovani:strict
```

Pravidla:

- každá stránka má ≥2 vstupní odkazy z obsahu (konfigurace ≥1, homepage výjimka),
- žádná stránka nemá 0 odchozích odkazů,
- textové téma má ≥3 pojmy, ≥1 zařízení, ≥1 model,
- generativní téma má ≥3 pojmy, ≥1 zařízení, ≥1 recept,
- každé slovo ve slovníku má ≥1 vstup z tématu/zařízení/návodu,
- index témat odkazuje na všechna témata.

**Stav:** výchozí baseline 9 chyb byl opraven v dávce 0 (10. 11. 2026). `check:prolinkovani` je nyní 0 chyb, 0 varování; `--strict` se zapne do CI.

---

## 9. SEO plán

### 9.1 Keyword mapa

| Stránka | Primární dotaz | Sekundární |
|---|---|---|
| 128 GB | 128 GB unified memory | kolik paměti pro lokální AI, proč 128 GB |
| cena | kolik stojí lokální AI | cena lokální AI, vyplatí se |
| pro firmy | lokální AI pro firmy | AI bez cloudu, firemní AI |
| Qwen | Qwen3.8 Flash Next | Qwen3.8 čeština, jak běží |
| DGX | DGX Spark cena | DGX Spark výkon, recenze |
| Strix | Strix Halo cena | Strix Halo lokální AI |
| RTX | RTX Spark cena | RTX Spark notebook/mini |
| Windows | lokální AI na Windows 11 | AI na Windows bez Linuxu |
| obrázky | lokální generování obrázků | AI obrázky na vlastním PC |
| video | lokální generování videa | AI video na 128 GB |
| audio | lokální přepis zvuku | TTS česky lokálně |
| 3D | image to 3D lokálně | 3D model z fotky |
| slovník | co je KV cache | co je tok/s, TTFT, kvantizace |

### 9.2 On-page

- Jeden H1, v prvních 60 slovech odpověď.
- `title` 50–60 znaků, `description` 110–155 znaků.
- Tabulka nebo výpočet v první polovině stránky.
- 2–4 konkrétní české příklady.
- FAQ 3–5 skutečných otázek (jen kde dává smysl).
- `last_verified` a zdroje.
- Interní odkazy s popisnými kotvami.

### 9.3 Důvěryhodnost

- Zdroj u čísla, ne jen na konci.
- Datum u ceny a měření.
- Rozlišení `naměřeno` / `výpočet` / `komunita`.
- Jasné „kde je limit“ a „pro koho to není“.
- Žádné marketingové fráze.

### 9.4 Co nedělat

- Neopakovat stejný text na tématu a stránce zařízení.
- Nevyrábět FAQ jen kvůli schématu.
- Nepřidávat klíčová slova do nadpisů násilím.
- Nepublikovat stránku bez zdrojů a data.
- Nedělat desítky krátkých stránek jen kvůli long-tailu.

### 9.5 Měření

- Google Search Console: impressions, CTR, průměrná pozice pro cílové dotazy.
- Interní odkazová hloubka: každá stránka do 3 kliků od homepage.
- Měsíční kontrola: které stránky mají 0 prokliků a proč.
- Cíl: do 6 měsíců mít u 20 cílových dotazů stabilní pozici v top 10; bez garance.

---

## 10. Výrobní postup a dávky

### Dávka 0 — základ (1 týden)

- [x] Opravit 9 chyb z `check:prolinkovani` (hotovo 10. 11. 2026).
- [ ] Přidat `check:prolinkovani` do dokumentace a později do CI.
- [ ] Schválit šablonu tématu a slovníku.
- [ ] Vytvořit obsahové briefy pro 6 prioritních témat.
- [ ] Doplnit chybějící odkazy na model/zařízení u témat.

### Dávka 1 — tenká témata (2–3 týdny)

- [ ] `/temata/128gb-unified-memory/` — 1 600 slov.
- [ ] `/temata/cena-lokalni-ai/` — 2 200 slov.
- [ ] `/temata/lokalni-ai-pro-firmy/` — 2 200 slov.
- [ ] `/temata/qwen3-8-flash-next/` — 1 800 slov.
- [ ] `/temata/strix-halo/`, `/temata/rtx-spark/`, `/temata/dgx-spark/` — 1 400 každá.
- [x] 10 hesel ve slovníku na 578–672 slov: `prefill`, `upscaling`, `ollama`, `vllm`, `huggingface`, `tflops`, `vram`, `kontext`, `nvfp4`, `cuda` (10. 11. 2026).
- [x] Konfigurační stránky Acemagic A10A, ASUS GX10 1TB/4TB a Acer RA110: vlastní titulek, popis, pro koho, silné stránky, slabiny a kdy nekupovat (10. 11. 2026).
- [ ] 5 nových hesel z oblasti agentů/RAG.
- [ ] 2 diagramy (KV cache, prefill/decode).

### Dávka 2 — nové clustery (3–4 týdny)

- [ ] `/temata/cestina/` + 5 dceřiných stránek.
- [ ] `/temata/rag/` + 5 dceřiných stránek.
- [ ] `/temata/agenti/` + 5 dceřiných stránek.
- [ ] `/temata/provoz/` + 5 dceřiných stránek.
- [ ] `/temata/praxe/` + 4 profese (právo, účetnictví, výroba, vývojáři).
- [ ] 10 dalších hesel ve slovníku.
- [ ] 3 diagramy (roofline, MoE, RAG).

### Dávka 3 — generování a doplnění (3–4 týdny)

- [ ] Obrázky, video, audio, 3D na 1 000–1 400 slov.
- [ ] Recepty na generování: chybějící kroky, časy, VRAM, licence.
- [ ] Zbývající hesla slovníku.
- [ ] Troubleshooting tabulky pro Windows, DGX OS, Strix Halo, macOS.
- [ ] FAQ a rozhodovací tabulky.

### Dávka 4 — důvěryhodnost a provoz (průběžně)

- [ ] `/data/` rozšířit na databázi měření s filtry a grafy.
- [ ] `/zdroje/` doplnit metodiku pro každý typ zdroje.
- [ ] `/provoz/` zapojit do menu a prolinkovat.
- [ ] Měsíční kontrola Search Console a interních odkazů.
- [ ] EN mutace po stabilizaci CZ.

**Odhad náročnosti:** téma 1–2 dny, klíčové heslo 0,5–1 den, nový cluster 3–5 dní. Celkem 6–10 týdnů podle tempa a dostupnosti zdrojů.

---

## 11. QA a definice hotové stránky

### 11.1 Před publikací

- [ ] Odpověď v prvních dvou odstavcích.
- [ ] Alespoň jedna tabulka nebo výpočet.
- [ ] Alespoň jeden český příklad.
- [ ] Sekce „Pro koho / pro koho ne“.
- [ ] Sekce „Kde je limit“.
- [ ] 4–6 interních odkazů s popisnými kotvami.
- [ ] 3+ zdroje s datem.
- [ ] Žádné `[DOPLNIT]` bez záznamu v `data/chybi.yaml`.
- [ ] `last_verified` aktuální.
- [ ] `title` a `description` v rozsahu.
- [ ] Build, `check`, `check:odkazy`, `check:prolinkovani`.
- [ ] Česká korektura.

### 11.2 Po publikaci

- [ ] Ověřit live URL.
- [ ] Zkontrolovat odkazy v prohlížeči.
- [ ] Zapsat změnu do `data/zmeny.yaml` (jen obsah, ne technika).
- [ ] Ověřit EN mutaci, pokud se mění shared data.
- [ ] Zkontrolovat Search Console po 4–6 týdnech.

### 11.3 Akceptační kritéria

- Žádná stránka není orphan.
- Žádné téma nemá 0 odkazů na model/zařízení podle typu.
- Žádné slovo ve slovníku nemá 0 vstupů.
- Všechny stránky mají `Kudy dál` a `Zdroje`.
- Všechny ceny a měření mají datum.
- `check:prolinkovani:strict` prochází.

---

## 12. Rizika a otevřená rozhodnutí

1. **České benchmarky chybí.** Nevymýšlet; použít veřejné testy, komunitní měření s konfigurací, nebo přiznat mezeru.
2. **AI Act a GDPR.** U firemních stránek je potřeba právní kontrola a jasné „není právní rada“.
3. **Kapacita.** 6–10 týdnů je realistické jen při soustředěné práci; jinak prioritizovat dávky 0–1.
4. **EN mutace.** Nejdřív CZ, EN až po stabilizaci, aby nevznikly dvě nekonzistentní verze.
5. **Affiliate neutralita.** Rozšíření nesmí změnit pořadí zařízení; odkazy jen na kategorii.
6. **Google.** Žádná garance pozic; cílem je užitečnost, originalita a důvěryhodnost.

---

## 13. Prvních 10 kroků

1. Opravit 9 chyb z baseline auditu (hotovo 10. 11. 2026).
2. Přepsat `/temata/128gb-unified-memory/`.
3. Přepsat `/temata/cena-lokalni-ai/`.
4. Přepsat `/temata/lokalni-ai-pro-firmy/`.
5. Přepsat `/temata/qwen3-8-flash-next/`.
6. Rozšířit 10 klíčových hesel slovníku (hotovo 10. 11. 2026: prefill, upscaling, ollama, vllm, huggingface, tflops, vram, kontext, nvfp4, cuda).
7. Přidat 5 nových hesel (MCP, function calling, embeddingy, vektorová DB, prompt injection).
8. Přidat 2 diagramy (KV cache, prefill/decode).
9. Spustit `check:prolinkovani:strict` a zapnout do CI.
10. Zapsat první dávku do changelogu a ověřit live.

---

## 14. Search Console — první data (10. 11. 2026)

Za první dny: **52 dotazů, 94 zobrazení, 1 proklik**. Na závěry je to málo, ale směr je jasný.

### 14.1 Co data říkají

| Typ dotazu | Příklady | Pozice | Co to znamená |
|---|---|---:|---|
| Produktové SKU | `acemagic a10a ryzen ai max+ 395`, `gx10-gg0003bn`, `ra110` | 2–10 | **konfigurační stránky jsou nejsilnější aktivum**; jediný klik vznikl tady |
| Slovníkové | `co je vram`, `upscaling`, `co je kontext`, `co je ollama`, `stt`, `nvfp4`, `cuda`, `prefill`, `hf token`, `vllm`, `llamacpp`, `wsl2`, `throttling`, `rocm`, `tflops` | 2–10 | stránky už rankují, ale jsou krátké a málo přesvědčivé; 0 % CTR |
| Cenové | `dgx spark cena`, `amd strix halo cena`, `rtx spark cena` | 5–10 | cena je na stránce, ale ne v první obrazovce ani ve snippetu |
| Mac | `128gb mac studio`, `mac studio 128gb`, `macbook pro 128 gb` | 9–11 | stránky Maců jsou tenké (483–517 slov) |
| Široké | `dgx spark`, `nvidia dgx spark`, `amd strix halo` | 23–54 | head termy jsou konkurenční; nehonit je přímo |
| Anglické | `ai box computer`, `do local ai models use tokens`, `rtx spark specifications` | 11–91 | příležitost pro EN mutaci, ne pro CZ prioritu |
| Brand | `local inference lab` | 74 | pravděpodobně jiný web; neřešit |

### 14.2 Prioritizace podle dat

Pořadí se mění: **slovník a konfigurace mají přednost před novými tématy.**

1. **Slovník s pozicí ≤10 a 0 % CTR:** `prefill` (2), `hf token`/`hugging` (4), `upscaling` (6,3), `ollama` (6), `vllm` (6), `tflops` (5), `nvfp4` (7,5), `cuda` (9), `llamacpp` (9), `wsl2` (9), `throttling` (8), `rocm` (9), `vram` (9,6), `kontext` (10,2), `stt` (9).
2. **Konfigurační stránky:** Acemagic A10A, ASUS GX10 1TB/4TB, Acer RA110. Přidat unikátní H1, cenu, dostupnost, „co na tom poběží“, FAQ a odkazy na zařízení.
3. **Cenové stránky zařízení:** DGX Spark, Strix Halo, RTX Spark, Mac Studio, MacBook Pro. Cena a dostupnost do první obrazovky, tabulka variant, FAQ.
4. **Široké head termy** až po posílení dlouhého ocasu a interních odkazů.

### 14.3 Rychlé úpravy pro CTR

- `title` začíná hledaným výrazem, ne „Co je…“.
- První odstavec odpovídá na dotaz jednou větou.
- Do první obrazovky cena, dostupnost nebo konkrétní číslo.
- Přidat české synonymum: VRAM = paměť grafické karty; STT = přepis řeči; upscaling = zvětšení obrázku; kontext = kontextové okno.
- FAQ 3–5 skutečných otázek, ne umělé.
- U zařízení zvážit `Product`/`Offer` strukturovaná data, jen pokud cena a dostupnost sedí.

### 14.4 Jak data vyhodnocovat

- Sledovat týdně, ale nevyvozovat závěry z 1–7 zobrazení.
- Zapisovat změny title/description a obsah do changelogu, aby se daly párovat s CTR.
- Po 4–6 týdnech vyhodnotit: které stránky se posunuly, které mají stále 0 % CTR, které dotazy přibyly.
- Cílem není optimalizovat na jeden dotaz, ale na téma a jeho dlouhý ocas.

---

*Tento plán je živý dokument. Po každé dávce se aktualizuje stav, odkazy a seznam mezer.*
