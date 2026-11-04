# Plán obsahu — Local Inference

*Verze 0.1 · 4. listopadu 2026*

Pořadí je podle hodnoty pro čtenáře a podle toho, co je potřeba mít hotové,
než se postaví web. Platí zásada: **obsah nejdřív jako Markdown, web až potom.**

Legenda: ✅ hotovo · 🟡 rozpracováno · ⬜ nezačato · 🔒 čeká na data

> **Poznámka k cestám:** hotový obsah je v `sites/cz/src/content/docs/`,
> šablony v `obsah/_sablony/`. `obsah/` už není místo pro hotové stránky.

---

## Průřezová pravidla

- **Jeden hledaný termín na stránku** — promítni ho do `title`, `description`,
  H1 a jednoho až dvou podnadpisů.
- **Každý údaj:** hodnota + datum + zdroj + typ (`namereno` / `vypocet`).
  Když zdroj chybí, `[DOPLNIT]` — neodhaduj.
- **Zdroj u tvrzení, ne jen na konci stránky.** U čísel a konkrétních tvrzení
  odkaz přímo v textu nebo pod tabulkou.
- **Každá stránka:** 2–4 interní odkazy, `last_verified`, zdroje na konci.
- **Žádné historické modely jako doporučení.** Minimum je Qwen3.8 Flash Next.
- **Žádné dense modely jako doporučení.** Jen jako varování s čísly.
- **Čísla v kontextu:** nikdy „70 tok/s“ bez délky kontextu, kvantizace,
  enginu a nastavení. Nikdy „cena“ bez data.
- **Ceny:** originál v USD, datum, na CZ přepočet na CZK (ČNB), na EN na EUR
  (ECB), s poznámkou „orientační, bez DPH a dopravy“.
- **Měření:** vždy kvantizace, engine + verze, kontext, souběžnost a zapnuté
  optimalizace (MTP, KV cache, flash attention). Když něco nevíme, `[DOPLNIT]`.
- **Kontext:** uváděj nativní maximum, doporučený provozní kontext a reálně
  udržitelný kontext na zařízení. Maximum není doporučení.
- **Vision:** u modelů předpokládej vision, pokud model card neříká jinak.
- **Python:** pro skripty agenta, měření a práci s daty doporučuj Python 3.12+.

### Definice hotové stránky

1. Text projde kontrolou češtiny a logiky (krátké věty, pojmy vysvětlené).
2. Všechna čísla mají zdroj, datum, typ a důvěryhodnost; zdroj je u tvrzení,
   ne jen na konci.
3. U převzatých čísel je jasné, že nejsou naše (věta nebo odkaz na metodiku).
4. Ceny mají datum, původní měnu a přepočet na CZK/EUR.
5. Měření mají kvantizaci, engine, kontext, souběžnost a nastavení.
6. Kde se zdroje rozcházejí, je vidět rozpětí a vysvětlení.
7. `title`, `description`, H1 a interní odkazy sedí.
8. Tabulky odpovídají YAML datům (nebo jsou ruční s vysvětlením proč).
9. Záznam v `poznamky-agenta.md`: co chybí, co ověřit.

---

## Vlna 0 — základy projektu ✅

- ✅ `AGENTS.md` — pravidla jazyka, faktů, šablon a techniky.
- ✅ `plan-projektu.md` — vize, struktura, datový model, fáze.
- ✅ `plan-obsahu.md` — tento dokument.
- ✅ `obsah/_sablona-zarizeni.md` — šablona stránky zařízení.
- ✅ `obsah/_sablona-model.md` — šablona stránky modelu.
- ✅ `obsah/_sablona-mereni.md` — šablona záznamu měření.
- ✅ `data/zdroje.yaml` — registr zdrojů.
- ✅ `data/kurzy.yaml` — kurzy ČNB/ECB pro přepočet cen.
- 🟡 `data/zarizeni.yaml` — 4 malá 128GB zařízení (DGX Spark, RTX Spark mini/notebook, Strix Halo).
- ⬜ `data/modely.yaml`, `data/mereni.yaml`.

---

## Vlna 1 — jádro vysvětlení (6 stránek)

Tón a hloubka webu. Tyto stránky musí být hotové dřív než katalog.

| # | Stránka | Hlavní sdělení | Klíčová slova | Stav |
|---|---|---|---|---|
| 1 | `zaciname/co-je-lokalni-ai` | Co lokální AI je, co umí, co ne, pro koho má smysl | lokální AI, AI na vlastním počítači | ✅ |
| 2 | `zaciname/jak-to-funguje` | Váhy, kvantizace, paměť, tok/s — bez magie | jak funguje lokální AI, kvantizace modelu | ✅ |
| 3 | `zaciname/proc-moe` | Rozhodují aktivní parametry, ne celkové | MoE model, aktivní parametry | ⬜ |
| 4 | `zaciname/jak-cteme-data` | Jak čteme cizí měření, roofline, rozpětí a důvěryhodnost | jak číst tok/s, TTFT, benchmark | ⬜ |
| 5 | `zaciname/slovnik` | Pojmy bez balastu, abecedně | slovník lokální AI | ⬜ |
| 6 | `zaciname/prostredi` | Co nainstalovat: Node, Python, Git, runtime | Python pro AI skripty, vLLM, llama.cpp | ⬜ |

### 1. Co je lokální AI

**Cíl:** uvést čtenáře do tématu a nastavit poctivá očekávání.

Osnova:

- Co znamená „lokální“: model běží na vašem stroji, ne v cizím cloudu.
- Co to přináší: data zůstávají, funguje offline, žádné poplatky za token.
- Co to stojí: hardware, elektřina, hluk, správa, pomalejší než cloud.
- Co dnes zvládne: text, kód, dokumenty, obrázky; čeština ano, ale ne dokonale.
- Co nezvládne: nejlepší frontier modely, obrovský kontext, mnoho uživatelů.
- Kdy se to vyplatí a kdy ne (3 situace ano, 3 ne).
- Minimum pro denní práci: Qwen3.8 Flash Next na 128GB stroji.
- Odkazy: jak-to-funguje, proc-moe, výběr.

**Tón:** žádný hype. „Lokální AI je dnes použitelná, ale není to náhrada cloudu
za každou cenu.“

### 2. Jak to funguje

**Cíl:** vysvětlit, proč rychlost závisí na paměti, ne na počtu parametrů.

Osnova:

- Model = soubor vah (stovky GB) + program, který je čte.
- Kvantizace: 16 bitů → 8 → 4 bity; co se ztrácí a co ne.
- Unified paměť u malých zařízení; proč se model musí vejít celý.
- Propustnost paměti (GB/s) vs. výpočet (TFLOPS): dvě různé věci.
- Decode = čtení vah per token; proto tok/s ≈ bandwidth / bajty na token.
- Prefill = zpracování promptu; proto TTFT roste s délkou vstupu.
- Kontext = pracovní paměť navíc; dlouhý kontext bere souběžnost.
- Konkrétní příklad: Qwen3.8 Flash Next na DGX Spark (6B aktivních, 70 tok/s).
- Odkazy: proc-moe, roofline, jak-cteme-data.

### 3. Proč MoE

**Cíl:** vysvětlit, proč dense 70B na krabici nejede a proč MoE ano.

Osnova:

- Dense model: každý token projde všemi parametry.
- MoE: router vybere několik expertů; aktivních je jen zlomek.
- Celkové parametry = kapacita a paměť; aktivní = rychlost.
- Příklad: Qwen3.8 Flash Next 176B celkem, 6B aktivních → 70 tok/s.
- Příklad: gpt-oss-120B 117B / 5B → 38,6 tok/s (horší jádra, bez MTP).
- Dense 70B → ~5 tok/s; do paměti se vejde, provozovat ne.
- Kde MoE zaostává: unie expertů při batchi, režie routeru, paměť navíc.
- Co z toho plyne pro nákup: 128 GB je minimum, 192 GB více souběžnosti.
- Odkazy: jak-to-funguje, roofline, modely.

### 4. Jak čteme data a měření

**Cíl:** dát čtenáři nástroj, jak cizí čísla číst, srovnávat a ověřit —
a být transparentní, že nemáme vlastní laboratoř.

Osnova:

- **Odkud data jsou:** výrobce, nezávislý test, komunita. Každý má jinou
  váhu a jiné podmínky.
- **TTFT** (time to first token): jak dlouho čekáte na první znak.
- **Prefill**: zpracování vstupu; ovlivňuje TTFT, ne decode.
- **Decode**: generování dalších tokenů; ovlivněno bandwidth.
- **tok/s**: single-stream vs. agregát; vždy uveď kontext a souběžnost.
- **Kontext**: 8k / 32k / 128k / 262k; proč rychlost klesá.
- **Thinking**: model generuje skryté tokeny; „viditelná“ rychlost klame.
- **Použitelnost**: chat 15–20 tok/s, agent 5–10, batch 1–2; TTFT < 2 s.
- **Proč se čísla rozcházejí:** kvantizace, engine, MTP, KV cache, teplota,
  souběžnost, jiná definice „tok/s“.
- **Normalizovaná tabulka:** raw vs. stejná kvantizace, kontext a souběžnost.
- **Roofline kontrola:** je číslo fyzikálně možné? Kde je strop?
- **Plánovací číslo:** konzervativní hodnota s rezervou 10–25 %.
- **Benchmark ≠ provoz:** fronta, logování, middleware.
- **Důvěryhodnost:** kolik nezávislých zdrojů se shoduje.
- Volitelně: jak si měřit doma (llama.cpp, vLLM, pevný prompt).
- Odkazy: roofline, kontext, kalkulačka, zdroje.

### 5. Slovník

Pojmy: aktivní parametry, agregát, bandwidth, dense, decode, GGUF, KV cache,
kvantizace, llama.cpp, MLX, MoE, NVFP4, prefill, roofline, souběžnost, tok/s,
TTFT, unified memory, vLLM, váhy.

### 6. Prostředí pro práci s modely

**Cíl:** dát čtenáři minimální funkční prostředí, ne instalaci všeho.

- **Node 22+** — jen pro build webu, ne pro běh modelu.
- **Python 3.12+** — pro skripty agenta, měření, zpracování dat a nástroje
  kolem modelů (vLLM, konvertory, huggingface-cli). Doporučit virtuální
  prostředí (`python -m venv`).
- **Git** — verze konfigurací a měřicích skriptů.
- **Runtime podle zařízení:** vLLM (NVIDIA/Linux), llama.cpp (CPU, Vulkan,
  ROCm, Mac), MLX (Apple Silicon).
- **Windows:** na RTX Spark existuje nativní komunitní port vLLM
  (`devjeonghwan/vllm-for-rtx-spark`); jinde je pro vLLM praktické WSL2.
  llama.cpp a Ollama fungují nativně.
- **Bezpečnost:** modely a skripty stahovat z oficiálních zdrojů, ověřovat
  hash, nespoléhat na neznámé „one-click“ instalátory.

---

## Vlna 2 — zařízení (katalog + 7 detailů + srovnání)

| Stránka | Verdikt | Stav |
|---|---|---|
| `zarizeni/dgx-spark` | Nejintegrovanější 128GB krabice, po zdražení drahá | ⬜ |
| `zarizeni/dgx-spark-oem` | 15 OEM variant GB10 s českými cenami | 🟡 |
| `zarizeni/rtx-spark-mini` | Stejná paměť, vyšší bandwidth, nižší cena než DGX Spark | ⬜ |
| `zarizeni/rtx-spark-notebook` | Dedikovaný výkon na cesty, ale throttling a auditujelnost | 🟡 |
| `zarizeni/strix-halo` | Nejlevnější cesta k 64/128 GB, ROCm je druhá liga | ⬜ |
| `zarizeni/strix-halo-oem` | 3 české 128GB Strix Halo konfigurace | 🟡 |
| `zarizeni/konfigurace` | Kompletní seznam 64GB+ konfigurací a modelů pro 128k | 🟡 |
| `zarizeni/srovnani` | Velká matice všech parametrů | ⬜ |

**Šablona:** viz `AGENTS.md`, sekce 4. Každá stránka musí mít tabulku
„co na něm poběží“ s modelem, kvantizací, kontextem a tok/s.

**Data:** `data/zarizeni.yaml` + `data/mereni.yaml`.

---

## Vlna 3 — modely (katalog + 5–6 detailů + srovnání)

| Stránka | Pozice | Stav |
|---|---|---|
| `modely/qwen3-8-flash-next` | Minimum pro denní práci na 128 GB; referenční bod | ⬜ |
| `modely/qwen3-6-35b-a3b` | Rychlý model pro 64 GB, kvalitou pod Qwen3.8 | ⬜ |
| `modely/gemma-4-26b-a4b` | Nejlepší kvalita na 64GB boxu, 256k kontext | 🟡 |
| `modely/srovnani` | Model × zařízení × rychlost | ⬜ |

**Pravidlo:** na 128 GB je minimum Qwen3.8 Flash Next. Na 64 GB jsou
doporučené Qwen3.6-35B-A3B a Gemma 4 26B A4B v Q4; oba musí mít
doložený 128k kontext.

**Modely, které se nevejdou na jedno zařízení, nezařazujeme.** GLM-5.3
Flash (320B/18B) a GLM-5.3 (465 GB) proto v katalogu nejsou; vyžadují
pool, offload nebo jinou třídu stroje.

**U každého modelu:** vision je výchozí předpoklad (výjimku označ), uváděj
nativní maximum kontextu, doporučený provozní kontext a reálně udržitelný
kontext na zařízení. Každé rychlostní číslo má kvantizaci, engine a nastavení.

---

## Vlna 4 — výběr a kalkulačka

| Stránka | Účel | Stav |
|---|---|---|
| `vyber/rozpocet` | Do 4 000 / 4–8 tis. / 10 tis.+ USD | ⬜ |
| `vyber/stolni-vs-notebook` | Kde má GPU běžet a proč | ⬜ |
| `vyber/kolik-uzivatelu` | Kolik lidí jeden stroj obslouží | ⬜ |
| `vyber/bezpecna-volba` | Minimum, které nezklame; co je zbytečné | ⬜ |
| `rychlost/kalkulacka` | Odhad doby odpovědi podle kontextu a výstupu | ⬜ |

**Kalkulačka:** čistě klientská, progresivní. Bez JS zobrazí tabulku
předpočítaných scénářů. S JS umožní zvolit zařízení, model, délku promptu,
výstupu a thinking; spočítá TTFT, decode a celkový čas.

---

## Vlna 5 — zdroje a měření

| Stránka | Účel | Stav |
|---|---|---|
| `zdroje/mereni` | Tabulka všech měření s datem, konfigurací, zdrojem | ⬜ |
| `data/<id>` | Datová karta: zdroj, podmínky, rozpětí, interpretace | ✅ (vzor: Qwen3.8 FN na Strix Halo) |
| `zdroje/zdroje` | Co sledujeme, proč, jak často | ⬜ |
| `zdroje/co-nevime` | Veřejný seznam mezer: chybí TTFT, 128k+, souběžnost | ✅ |
| `zdroje/novinky` | Changelog: nové modely, ceny, verze | ✅ |
| `o-webu/metodika` | Nemáme laboratoř; jak čteme, srovnáváme a interpretujeme data | ✅ |
| `scripts/hlidac.mjs` | Kontrola zdrojů proti uloženému stavu | ⬜ |

**Hlídač:** kontroluje model cards, ceníky, vydání vLLM/SGLang/llama.cpp
a stránky výrobců. Výstup: report „co je nového“ + návrh na aktualizaci.
Nesnaží se automaticky měnit obsah.

**Detailní podoba správy zdrojů:**

- `data/zdroje.yaml` — registr: URL, typ (`rss` / `github` / `hf` / `html` /
  `api`), co sledujeme, frekvence, priorita, poslední kontrola, stav.
- `data/stav-zdroju.json` — poslední známý stav (hash, datum vydání, verze).
- `scripts/hlidac.mjs` — fetch + diff + report. U HTML porovná hash
  vybrané části, u GitHubu vydání, u Hugging Face `lastModified`.
- `data/zmeny.yaml` — ruční changelog. Hlídač navrhne, člověk schválí.
- `zdroje/zdroje` — veřejná tabulka: co sledujeme, proč, kdy naposledy.
- `zdroje/novinky` — changelog s dopadem na stránky.
- Workflow běží týdně a při ručním spuštění; při novince založí issue.
- **Ceny:** hlídat cenu + datum + kurz; při změně kurzu přepočítat CZ/EN.
- **Měření:** nové měření = nový záznam, nikdy nepřepisovat starý; stránka
  ukáže poslední a případně historii.

### Metodika (`o-webu/metodika`)

Povinná stránka, protože web nestaví na vlastním testování:

- **Nemáme laboratoř.** Většinu zařízení fyzicky netestujeme.
- **Odkud data jsou:** výrobce, nezávislý test, komunita, výpočet.
- **Jak normalizujeme:** kvantizace, engine, kontext, souběžnost, MTP.
- **Roofline kontrola:** proč je číslo nad stropem podezřelé.
- **Typy čísel:** `naměřeno` (zdroj), `vypocet` (z podložených vstupů).
  Vlastní odhad nepoužíváme; když zdroj chybí, `[DOPLNIT]`.
- **Důvěryhodnost:** vysoká / střední / nízká a co to znamená.
- **Rozpory:** proč ukazujeme rozpětí, ne jedno číslo.
- **Plánovací číslo:** proč je konzervativní hodnota užitečnější než špička.
- **Jak nahlásit chybu:** odkaz na issue / e-mail.

### Co nevíme (`zdroje/co-nevime`)

Veřejný seznam mezer, ne schovaná poznámka:

- která zařízení nemají žádné veřejné měření,
- kde chybí TTFT a prefill,
- kde chybí 128k+ a 256k kontext,
- kde chybí souběžnost 4+,
- které modely nemají české testy,
- co by se muselo změřit, aby se závěr změnil.

Každá položka má prioritu a odkaz na zdroj, který chybí. Zároveň je to
zadání pro komunitu a argument pro transparentnost.

---

## Vlna 6 — EN mutace

- Překlad/adaptace všech hotových stránek do angličtiny.
- Stejná data, jiný text. Ne doslovný překlad.
- Vlastní repo, vlastní doména, vlastní build.
- Společný changelog a stejná metodika.

**Rozhodnuto:** CZ první, EN po schválení jádra (vlny 1–3). EN používá
stejná data, ale ceny přepočítává na EUR kurzem ECB.

---

## Vlna 7 — Astro + Starlight stavba

Teprve po schválení obsahu.

1. `astro.config.mjs`, package.json, struktura `sites/cz`.
2. Starlight sidebar, override `PageTitle`, `Footer`, `Hero`.
3. CSS téma (světlý/tmavý režim, barvy, typografie).
4. Kolekce ze zařízení a modelů, generování tabulek z YAML.
5. Pagefind (součást Starlightu), sitemap, robots, 404.
6. Kontrolní skript (`npm run check`).
7. GitHub Actions + publikace do `localinference.cz`.
8. EN build do `localinference.eu`.

---

## Pořadí psaní — první dávka

1. ✅ `obsah/zaciname/co-je-lokalni-ai.md`
2. ✅ `obsah/zaciname/jak-to-funguje.md`
3. `obsah/zaciname/proc-moe.md`
4. `obsah/zaciname/jak-cteme-data.md`
5. `obsah/rychlost/roofline.md`
6. `obsah/modely/qwen3-8-flash-next.md`
7. `obsah/zarizeni/dgx-spark.md`

Tyto stránky stanoví tón, datové konvence a šablony. Po jejich schválení
jde zbytek rychleji.

---

## Otevřené otázky

- [DOPLNIT: přesný název a titulek webu]
- [DOPLNIT: zda má web mít diskusi / newsletter / kontaktní formulář]
- Vlastní měření: **ne** — pracujeme s veřejnými daty a interpretací.
