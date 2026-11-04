# AGENTS.md — pravidla pro práci na projektu Local Inference

Tento projekt staví dva informační weby o **lokální AI na hotových zařízeních**:

- **localinference.cz** — česky, výchozí mutace.
- **localinference.eu** — anglicky, samostatné repo i doména.

Web není zpravodajský magazín ani recenzní server. Je to **živý průvodce a databáze**:
pro každé hotové zařízení ukazuje, které současné modely na něm poběží, jak rychle
a co od nich čtenář může čekat.

---

## 1. Vymezení obsahu — co na web patří a co ne

### Patří

- **Jen hotová zařízení se 128 GB a více unified paměti.** DGX Spark,
  RTX Spark mini/notebook, OEM boxy se Strix Halo. Nic, co si člověk
  skládá z komponent, a nic pod 128 GB.
- **Jediný model katalogu je Qwen3.8 Flash Next** na **128 GB**.
  Jiné modely nezařazujeme; zmínit je lze jen jako varování nebo
  vysvětlující srovnání, nikdy jako doporučení.
- **MoE modely** s malým počtem aktivních parametrů. Dense modely zmiňujeme
  jen jako varování („na této krabici to poběží 5 tok/s, to není použitelné“).
- **Jen modely, které se celé vejdou na jedno zařízení** — včetně KV cache
  a rozumného kontextu. Modely, které vyžadují pool, tensor parallel mezi
  boxy nebo offload do pomalejší paměti, do katalogu nezařazujeme.
- **Rychlost v praxi:** decode tok/s, TTFT, prefill, chování na dlouhém
  kontextu, souběžnost, spotřeba, hluk, cena.
- **Co od modelu čekat:** kvalita, čeština, práce s nástroji, vidění,
  kontext, licence, velikost vah, kde model nestačí.
- **Zdroje a vývoj v čase:** měření, změny cen, nové modely, nové verze
  runtime. Každý údaj má datum a odkaz.

### Nepatří

- Návody na stavbu PC, whitebox servery, racky a datacentrové GPU.
- Modely, které se na jedno zařízení nevejdou nebo vyžadují offload/pool.
- Trénink a fine-tuning modelů.
- Historické a jiné modely jako doporučení.
- Obecné AI novinky, které se netýkají lokálního provozu.
- Marketingové fráze, affiláty bez označení, „revoluce“ a „game-changer“.

---

## 2. Jazyk

### 2.1 Cílová skupina a tón

Píšeme pro **majitele firem, CTO, podnikatele a vedoucí IT**. Mají
rozpočet na zařízení a chtějí vědět, co od něj čekat — nejsou to
ML inženýři ani nadšenci do benchmarků.

- **Každá stránka začíná lidsky:** co to je, pro koho to je, co to
  stojí a co od toho čekat. Teprve potom tabulky a technické detaily.
- **Byznys před technikou:** piš o úlohách, času, penězích, rizicích,
  podpoře, prostoru a elektřině. Tok/s je důkaz, ne cíl.
- **Každý pojem vysvětli při prvním výskytu jednou větou.** Klidně
  přirovnáním. Čtenář nemá vědět, co je KV cache, dokud mu to neřekneme.
- **Odděluj vrstvy:** krátké shrnutí pro vedení, detaily pro technické
  čtenáře. Nikoho nepodceňuj, ale nikoho nenutí číst všechny tabulky.
- **Žádný marketing ani strašení.** Žádné „revoluce“, „game-changer“,
  „suverenita“. Konkrétní čísla, konkrétní limity.
- **Test:** majitel firmy, který nikdy nespustil model, má po prvním
  odstavci vědět, jestli ho to zajímá a co ho bude stát.

- Piš **česky, jasně a konkrétně**. Čtenář má být technicky zvídavý, ale
  nemusí být strojař. Každý odborný pojem při prvním výskytu vysvětli jednou větou.
- Krátké věty, činný rod, oslovování čtenáře („zjistíte“, „vyberte“).
- Technické názvy nech v originále: DGX Spark, RTX Spark, Strix Halo, vLLM,
  llama.cpp, MoE, TTFT, prefill, tok/s. Vysvětli je, ale nepřekládej.
- Čísla piš po česku: desetinná čárka, tisíce s mezerou (6 950 USD, 70 tok/s).
- Nepoužívej „suverenita“, „revoluce“, „unikátní řešení“, „game-changer“.
- Anglická mutace není doslovný překlad. Přizpůsob idiomaticky, ale fakta
  a data musí zůstat shodná.

---

## 3. Fakta, čísla a důvěryhodnost

Toto je nejdůležitější pravidlo projektu.

- **Vlastní měření neprovádíme.** Nemáme laboratoř a žádné zařízení
  fyzicky netestujeme. Web je
  **interpretace veřejných dat**: sbíráme měření od výrobců, nezávislých
  testů a komunity, normalizujeme podmínky, hledáme rozpory a vysvětlujeme,
  co z nich plyne. Nikdy netvrď, že číslo pochází z našeho testu.
- **Každé ověřitelné tvrzení má zdroj.** Nejen tabulka na konci stránky:
  u konkrétního čísla nebo tvrzení uveď odkaz přímo v textu nebo v poznámce
  pod tabulkou. Čtenář má mít možnost si tvrzení ověřit bez hledání.
- **Každé číslo má datum.** Cena, rychlost, paměť, spotřeba, dostupnost.
  Formát v datech: `overeno: 2026-11-04`, `zdroj: https://…`.
- **Rozlišuj typy údajů:**
  - `namereno` — měření **převzaté od zdroje**, ne naše. Vždy uveď
    `mereno_kym` (`vyrobce` / `nezavisle` / `komunita`), zařízení, model,
    kvantizaci, engine a jeho verzi, délku kontextu, souběžnost a další
    nastavení, které výsledek ovlivňuje (MTP, KV cache, flash attention).
  - `vypocet` — odvozené z **podložených vstupů** (roofline, kapacita).
    Uveď vzorec a zdroje vstupů. Nikdy to nevydávej za měření.
  - `vlastni` — nepoužíváme a neplánujeme; vlastní měření neprovádíme.
- **Neodhaduj.** Když pro tvrzení není zdroj, **hledej ho**. Když ho
  nenajdeš, napiš `[DOPLNIT: co]` nebo tvrzení vynech. Číslo „od oka“
  na web nepatří. Výjimka je `vypocet` z podložených vstupů, jasně označený
  jako výpočet, ne jako očekávaná realita.
- **Kvalita zdroje:** rozlišuj `oficialni` (výrobce, model card, dokumentace),
  `nezavisle` (nezávislé měření, benchmark), `komunita` (uživatelské měření,
  fórum) a `vypocet`. U výrobcem udávaných čísel to napiš.
- **Důvěryhodnost:** `vysoka` = 2+ nezávislé zdroje se shodou; `stredni` =
  jeden nezávislý nebo více komunitních; `nizka` = jediný komunitní nebo
  výrobcem udávaný údaj. Ke každému klíčovému číslu uveď `duveryhodnost`.
  Když 2+ zdroje nejsou, aktivně je hledej; nespoléhej na jeden.
- **Triangulace:** u klíčového čísla uveď, kolik zdrojů se shoduje a co
  z toho plyne. Jeden zdroj není důkaz, i když je oficiální.
- **Normalizace:** při srovnání ukazuj **raw** i podmínky, za kterých bylo
  číslo naměřeno. Normalizované číslo uváděj jen tehdy, když je to
  `vypocet` z podložených vstupů; jinak zůstaň u raw hodnot a popiš rozdíly.
- **Co nevíme:** chybějící data jsou veřejná. Každá stránka s čísly má
  sekci „Kde je nejistota“ nebo odkaz na `/zdroje/co-nevime/`.
- **Rozpory:** když se zdroje rozcházejí, ukaž **rozsah** a vysvětli, čím to
  je (kvantizace, engine, kontext, souběžnost, teplota). Nevybírej jen
  nejlepší číslo.
- **Plánovací číslo:** použij **spodní hranici naměřeného rozsahu** nebo
  konzervativní hodnotu, kterou umíš doložit. Neuveřejňuj vlastní odhad
  jako fakt. Uváděj, z čeho číslo vychází.
- **Roofline jako kontrola:** pokud naměřené číslo převyšuje teoretický
  roofline, ozna ho jako podezřelé nebo vysvětli, co ho zrychlilo (MTP, NPU,
  jiná kvantizace). Pokud je hluboko pod ním, vysvětli proč (jádra, teplota,
  bez MTP).
- **Interpretace je součást výstupu.** U každé tabulky musí být věta
  „co z toho plyne pro denní použití“, ne jen čísla.
- **Nikdy nevymýšlej fakta.** Když údaj chybí, napiš `[DOPLNIT: co]` a pokračuj.
- **Ceny:**
  - vždy s datem a zdrojem,
  - na české mutaci **vždy primárně CZK**. Známou českou cenu uveď první;
    když českou cenu neznáme, přepočítej z USD kurzem **ČNB** a výslovně
    označ **odhad**. USD patří do závorky: `162 990 Kč vč. DPH (6 950 USD)`.
  - u české maloobchodní ceny uveď, zda je **s DPH** nebo bez DPH,
  - na anglické mutaci **vždy primárně EUR**. Známou evropskou cenu uveď
    první; když ji neznáme, přepočítej z USD kurzem **ECB** a označ
    **estimate**. USD patří do závorky: `€6 200 (6 950 USD)`.
  - pořadí je vždy **místní měna → původní měna v závorce**, nikdy naopak.
  - s poznámkou „bez dopravy, přepočet je orientační“.
  - Kurzy drž v `data/kurzy.yaml`; nepřepočítávej ručně v textu.
- **Affiliate odkazy:** jen na **kategorii** prodejce, nikdy na konkrétní
  produkt — ten se mění a vyprodává. V URL jsou affiliate parametry a
  odkaz má `rel="sponsored"`. Vysvětlení je na `/o-webu/pravni/`, štítek
  u každého odkazu není potřeba. Provize nesmí ovlivnit hodnocení ani
  pořadí zařízení.
- **Ceny v tabulkách:** jen **koncová cena včetně DPH**. Sloupce „bez DPH“
  a „dostupnost“ neuváděj — čtenáře zajímá, co zaplatí.
- **Jen aktuální ceny.** Žádné „původně“, přeškrtnuté ceny, slevy ani
  historie zdražování. Vždy jedna cena k datu ověření; stará se nahradí.
- **Kontext:** maximální kontext není doporučený provozní bod. U každého
  modelu uváděj tři čísla: **nativní maximum**, **doporučený provozní kontext**
  a **reálně udržitelný kontext na daném zařízení**. Kvalita a rychlost jsou
  na kratším kontextu lepší; maximum je strop, ne cíl.
- **Vision:** u modelů předpokládej vision, pokud model card výslovně neříká
  jinak. Do dat zapisuj `vision: true` jako výchozí a výjimky označ.
- **Benchmark ≠ provoz.** Naměřené single-stream číslo je horní hranice.
  V provozu s frontou, logováním a souběžností počítej s 10–25 % méně.
- **Odlišuj výrobcem udávané a nezávisle naměřené.** Apple, NVIDIA a výrobci
  boxů měří rádi na nejlepší konfiguraci.

### Kanonické zdroje

| Co | Odkud |
|---|---|
| Qwen modely, model cards, benchmarky | `qwen.ai/blog`, Hugging Face `Qwen/*` |
| vLLM recepty a konfigurace | `recipes.vllm.ai` |
| SGLang recepty | `docs.sglang.io` |
| llama.cpp a komunitní měření | GitHub `ggml-org/llama.cpp`, `llamaperf` |
| Nezávislé inference benchmarky | `inferencex.semianalysis.com` |
| NVIDIA DGX Spark / Station | `nvidia.com`, dokumentace, GTC |
| NVIDIA RTX Spark | `nvidia.com`, Windows on Arm porting guide, OEM nabídky |
| vLLM na Windows ARM64 | GitHub `devjeonghwan/vllm-for-rtx-spark`, NVIDIA forum |
| AMD Strix Halo | `amd.com`, OEM stránky (GMKtec, Minisforum, HP…) |
| Ceny a dostupnost | oficiální obchody výrobců a OEM, s datem |
| Kurzy pro přepočet | ČNB (CZK), ECB (EUR), s datem |

Nový zdroj přidávej jen tehdy, když je jasné, **co z něj na web teče**
(konkrétní tabulka nebo stránka), a zapiš ho do `data/zdroje.yaml`.

### 3.1 Správa zdrojů a aktualizace

Web stojí na datech, která stárnou. Proto má každý zdroj a každý údaj
vlastní evidenci:

- **`data/zdroje.yaml`** — registr zdrojů. U každého: `id`, `nazev`, `url`,
  `typ` (`rss`, `github`, `hf`, `html`, `api`), `co_sledujeme`, `frekvence`,
  `priorita`, `posledni_kontrola`, `stav`.
- **`data/kurzy.yaml`** — kurzy ČNB a ECB s datem a zdrojem.
- **`data/mereni.yaml`** — každé měření s konfigurací (viz níže).
- **`data/zmeny.yaml`** — ručně psaný changelog: co se změnilo, kdy a které
  stránky se to týká.
- **`scripts/hlidac.mjs`** — pravidelná kontrola zdrojů. Umí RSS/Atom,
  GitHub releases, změny model card na Hugging Face a hash klíčové části
  HTML stránky. Porovná stav s `data/stav-zdroju.json`, vypíše report
  a případně založí issue. **Nikdy nemění obsah sám.**
- **Workflow `hlidac.yml`** — týdenní běh + ruční spuštění.
- **Aktualizační checklist:** ověřit cenu → ověřit model → ověřit měření →
  upravit data → aktualizovat `overeno` → zapsat do `zmeny.yaml` → build.

Pravidlo: **každý údaj má svého vlastníka a datum kontroly.** Když se zdroj
nedá ověřit, údaj se označí `[DOPLNIT]` nebo se z webu odstraní.

---

## 4. Šablony stránek

### Stránka zařízení

Povinné části:

0. Krátká věta „Toto jsou převzatá měření, ne naše“ (nebo odkaz na
   metodiku), pokud stránka obsahuje čísla od zdrojů.
1. H1 + jednořádkový verdikt („Nejlevnější cesta k 128 GB paměti“).
2. Rychlá fakta: paměť, propustnost, cena (CZK k datu, USD v závorce), forma, OS,
   software, příkon.
3. **Co na něm poběží** — tabulka modelů s kvantizací, kontextem, rychlostí,
   typem údaje (naměřeno / výpočet) a důvěryhodností.
4. **Jak rychle** — krátký a dlouhý kontext, TTFT, prefill, souběžnost.
5. **Kontext, který zařízení reálně udrží** — 32k / 128k / 262k a co to
   udělá se souběžností.
6. **Co od toho čekat** — pro koho ano, pro koho ne, kde je limit.
7. **Na co si dát pozor** — throttling, ROCm, uzavřený stack, cena paměti…
8. Zdroje + `last_verified`.

### Stránka modelu

0. Krátká věta „Toto jsou převzatá měření, ne naše“ (nebo odkaz na
   metodiku), pokud stránka obsahuje čísla od zdrojů.
1. H1 + pozice modelu („spodní hranice, která stačí na denní práci“).
2. Specifikace: celkové/aktivní parametry, **nativní maximum kontextu**,
   **doporučený provozní kontext**, modality (vision jako výchozí), licence,
   velikost vah při kvantizacích.
3. **Co umí** — benchmarky, čeština, nástroje, vidění, silné a slabé stránky.
4. **Kolik potřebuje paměti** — tabulka kvantizací a minimální zařízení.
5. **Jak rychle na zařízeních** — naměřeno vs. vypočteno, včetně konfigurace.
6. **Kontext: maximum není doporučení** — kde je kvalita nejlepší, co zvládne
   zařízení, kde se rozpadá souběžnost.
7. **Kde dává smysl a kde ne.**
8. Zdroje + `last_verified`.

### Stránka návodu

Pro každou platformu jeden návod „první spuštění“:

1. **Co budete potřebovat** — OS, ovladače, místo na disku, účet.
2. **Krok 1: první boot / aktualizace** — přesné příkazy nebo odkazy.
3. **Krok 2: ověření GPU** — `nvidia-smi`, `rocminfo` nebo ekvivalent.
4. **Krok 3: rychlý test** — menší model, ať uživatel do 30 minut vidí
   odpověď.
5. **Krok 4: plný Qwen3.8 Flash Next** — oficiální recept, varování
   na velikost a dobu načtení.
6. **Krok 5: připojení z jiného zařízení** — API, port, bezpečnost.
7. **Když to nefunguje** — tabulka příznaků a kontrol.
8. Zdroje + `last_verified`.

**Pravidla:** každý příkaz má zdroj (oficiální dokumentace především);
když je krok komunitní, označ to. Nikdy netvrď, že jsme postup testovali.
U více zařízení se stejným OS použij jeden návod a jen na něj odkaž.

### Datový list měření

Každý záznam musí mít:

- datum, zařízení, model,
- **kdo měřil** (`mereno_kym`: vyrobce / nezavisle / komunita / my),
- **důvěryhodnost** (`vysoka` / `stredni` / `nizka`) a proč,
- kvantizaci (NVFP4, FP8, GGUF Q4_K_M, MLX 4bit…),
- engine a verzi (vLLM 0.30, llama.cpp b1234, MLX…),
- kontext (délku promptu a kontextový strop),
- TTFT, prefill tok/s, decode tok/s, agregát a souběžnost,
- nastavení, které může výsledek ovlivnit: MTP, KV cache dtype,
  flash attention, chunked prefill, teplota, power limit,
- typ (`namereno` / `vypocet`; `vlastni` nepoužíváme) a zdroj,
- **rozptyl** nebo jiné zdroje se stejnou konfigurací,
- **interpretaci**: co z čísla plyne pro denní použití a kde je limit.

Když nastavení neznáme, napiš `[DOPLNIT]` — nikdy nevynechávej mlčky.
Když se zdroje rozcházejí, uveď oba a napiš, čím to je.

### Vysvětlující stránka

- Jeden pojem na stránku, jeden hledaný termín v H1.
- Vysvětlení od problému čtenáře, ne od definice.
- Konkrétní čísla a příklad na skutečném zařízení.
- Na konci „Kudy dál“ s 2–4 interními odkazy.

---

## 5. Technika

- Generátor: **Astro + Starlight** — stejná šablona jako OpenWork.cz.
  (11ty bylo zvažováno, ale záměr „stejná šablona jako OpenWork“ převážil.)
- **Node 22+** je potřeba pro build. **Python 3.12+** doporučujeme na
  pomocné skripty agenta, měření, zpracování dat a práci s modely
  (vLLM, llama.cpp, convertory). Není potřeba pro samotný běh webu.
- Výstup: čistě statický web, žádný JavaScript, který není nutný.
  Povolené výjimky: vyhledávání (Pagefind, součást Starlightu), filtr tabulek,
  kalkulačka — vše musí fungovat i bez JS, jen s omezenou funkcí.
- Obsah v Markdownu/MDX, data v YAML/JSON. Jeden zdroj pravdy pro každou entitu.
- Žádné webfonty ze zahraničních serverů; systémové písmo.
- Žádné rastrové obrázky jako dekorace. Grafika jen inline SVG, tabulky,
  nebo skutečný screenshot, pokud je nezbytný.
- Odkazy mimo web vždy `target="_blank"` + `rel="noopener noreferrer"`
  (v Markdownu řeší `rehype-external-links`).
- **Slovník je samostatná kategorie** `/slovnik/` se skupinami (výkon,
  software, paměť, provoz). Každý pojem má vlastní stránku. Pojmy se
  prolinkují automaticky: první výskyt na stránce dostane odkaz
  (plugin `rehypeSlovnik` v `astro.config.mjs`). Nikdo nesmí muset
  hádat, co zkratka znamená.
- **Menu má nejvýš 3–4 úrovně.** Slovník → skupina → pojem. Hlubší
  členění se řeší obsahem stránky, ne další úrovní menu.
- Každá stránka s proměnlivými údaji má frontmatter `last_verified`;
  šablona ho zobrazuje pod nadpisem (override `PageTitle`).
- Přístupnost: kontrast WCAG AA, ovladatelné klávesnicí, sémantické HTML.

### 5.1 Repozitáře a publikace

**Jedno zdrojové repo, dvě mutace ve složkách, dvě domény.**

- **Zdrojový repo `Staticke-weby/LOCALinference.cz`** — celý web: společná
  data, obsah i obě mutace v `sites/cz/` a (později) `sites/eu/`. Repo není
  skryté, zdroj je veřejný.
- **CZ:** workflow `nasazeni-cz.yml` postaví `sites/cz/dist` a pošle ho
  jako Pages artifact. Na web jde jen výstup, nikdy zdroj ani `node_modules`.
- **EN:** až vznikne `sites/eu`, workflow `nasazeni-eu.yml` postaví
  `sites/eu/dist` a pošle ho do `Staticke-weby/LOCALinference.eu`, odkud
  ho servíruje GitHub Pages. Zdroj EN zůstává tady; `.eu` repo je jen
  výstup. Vyžaduje secret `PUBLIKACE_TOKEN` (fine-grained PAT s právem
  Contents: Read and write na `.eu` repo).
- **Proč jedno repo:** data o zařízeních, cenách a měřeních jsou společná.
  Jeden zdroj pravdy znamená, že si CZ a EN nemohou začít odporovat.
- **Domény:** `www.localinference.cz` a `www.localinference.eu`, obě
  v Pages nastavení repa, které je publikuje.
- CZ je výchozí a vzniká první. EN se přidá po stabilizaci obsahu.

---

## 6. SEO

- Každá stránka: výstižný `title` s hledaným termínem, `description`,
  jeden H1, klíčová slova v podnadpisech.
- Hledané termíny: „lokální AI“, „lokální modely“, „AI na vlastním počítači“,
  „DGX Spark“, „Strix Halo“, „RTX Spark“, „kolik stojí lokální AI“,
  „Qwen3.8 Flash Next“, „128 GB unified paměť“,
  „jak rychle běží lokální model“.
- Interní prolinkování mezi zařízením, modelem a vysvětlením rychlosti.
- Žádné přeplňování klíčovými slovy na úkor čitelnosti.

---

## 7. Postup práce

1. **Nejdřív obsah, potom web.** Texty vznikají jako Markdown v
   `sites/cz/src/content/docs/`; šablony jsou v `obsah/_sablony/`.
   Web se staví z těchto souborů, ne z kopie.
2. Pracuj po stránkách, každou dotáhni do konce (text + data + zdroje).
3. Po každé větší dávce stručně shrň, co je hotové a co zbývá.
4. Nejednoznačnost řeš rozumně a zapiš do `poznamky-agenta.md`; neptej se
   na každou drobnost.
5. Hotovou stránku zkontroluj: fakta, datum, odkazy, čeština, build.

---

## 8. Otevřené otázky

- [DOPLNIT: značka a titulek webu — „Local Inference“ vs. český název]
- [x] GitHub organizace: **Staticke-weby** —
      `LOCALinference.cz` (zdroj + build) a `LOCALinference.eu` (EN, později).
      Publikace přes GitHub Actions artifact, ne přes commit do výstupní větve.
- [x] Provozovatel: **ESHOpino s.r.o.**, Roháčova 145/14, 130 00 Praha 3,
      IČO 03223485, DIČ CZ03223485 — viz `/o-webu/pravni/`.
- [DOPLNIT: kontaktní e-mail pro veřejnost]
- [x] Analytics: **Umami** (`https://navstevnost.pikapod.net/script.js`),
      bez cookies. CZ `data-website-id` =
      `0f31f779-c9bd-4e31-9745-19b8b425be0b`, EN =
      `94da2420-aa54-4b76-a614-ca06835a2138`. Skript je v `head`
      `astro.config.mjs`; EN ID se vloží při vzniku `sites/eu`.
- Vlastní měření: **ne** — data přebíráme a interpretujeme (viz `o-webu/metodika`).
