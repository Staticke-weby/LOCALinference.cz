# Local Inference — projektový plán

*Verze 0.1 · 4. listopadu 2026 · pracovní dokument*

---

## 1. Vize

**Local Inference je nezávislý průvodce lokální AI na hotových zařízeních.**

Neodpovídá na otázku „jaký model je nejlepší na světě“, ale na otázku, kterou si
člověk klade před nákupem:

> „Koupím tenhle stroj. Které modely na něm poběží, jak rychle a co od nich
> můžu čekat v denní práci?“

Web je **živý**: katalog zařízení, katalog modelů, tabulka měření a zdroje,
ze kterých se stav mění. Cílem není jednorázový článek, ale místo, kam se
čtenář vrací, když se mění ceny, modely nebo firmware.

### Dvě mutace

| Mutace | Doména | Jazyk | Repo |
|---|---|---|---|
| CZ | `localinference.cz` | čeština | samostatný repozitář |
| EN | `localinference.eu` | angličtina | samostatný repozitář |

Obě mutace sdílejí data a vizuální téma, ale mají vlastní obsah a vlastní
nasazení na GitHub Pages.

---

## 2. Pro koho

| Skupina | Co řeší | Co jí web dá |
|---|---|---|
| **Technický profesionál / homelab** | chce lokální model bez cloudu, řeší výkon a cenu | konkrétní tok/s, TTFT, kontext, spotřeba |
| **Malá firma / tým** | data nesmí opustit firmu, potřebuje sdílený stroj | kolik lidí zařízení obslouží, co to umí |
| **Profese s citlivými daty** | advokát, lékař, účetní, vývojář | kde data zůstávají, co doložit, limity |
| **Zvídavý uživatel** | slyšel o lokální AI, nechce naletět | vysvětlení bez hype, reálná očekávání |
| **Student / začátečník** | má omezený rozpočet | co je minimum, co je zbytečné |

**Primární čtenář** je technicky zdatný člověk, který zvažuje konkrétní nákup
nebo už nějaký stroj má a chce vědět, co na něm rozumně provozovat. Web může
být hluboký, ale nesmí být arogantní.

---

## 3. Redakční principy

1. **Nemáme laboratoř.** Většinu zařízení fyzicky netestujeme. Web je
   **interpretace veřejných dat**: sbíráme měření výrobců, nezávislých testů
   a komunity, normalizujeme podmínky, hledáme rozpory a vysvětlujeme, co
   z nich plyne. Nikdy netvrdíme, že číslo je z našeho testu.
2. **Jen hotová zařízení.** Žádné skládání PC, žádné whitebox servery.
   U hotového stroje rozhoduje firmware, ovladače, servis a záruka.
3. **Jen současné modely.** Spodní hranice je **Qwen3.8 Flash Next**.
   Historické modely se neukazují jako doporučení — čtenáře by zklamaly.
4. **MoE, ne dense.** Na těchto zařízeních rozhoduje počet **aktivních**
   parametrů a propustnost paměti. Dense modely jsou jen varovný příklad.
5. **Jen to, co se vejde celé.** Model musí na jedno zařízení vejít včetně
   KV cache a rozumného kontextu. Pool, tensor parallel mezi boxy a offload
   do pomalejší paměti do katalogu nepatří.
5. **Rychlost v souvislostech.** Nestačí „70 tok/s“. Záleží na délce kontextu,
   TTFT, prefillu, souběžnosti a na tom, zda model „přemýšlí“.
6. **Naměřeno vs. vypočteno.** Každý údaj má typ, datum, zdroj
   a důvěryhodnost. „Naměřeno“ znamená naměřeno zdrojem, ne námi.
   Vlastní odhad nepoužíváme; když zdroj chybí, `[DOPLNIT]`.
7. **Rozpory se nezakrývají.** Když se zdroje rozcházejí, ukážeme rozsah
   a vysvětlíme, čím to je. Nevybíráme nejlepší číslo.
8. **Plánovací číslo, ne reklamní.** Pro rozhodování používáme konzervativní
   číslo s rezervou, oddělené od špičkového single-stream maxima.
9. **Roofline jako kontrola.** Výpočet slouží k ověření, zda je převzaté
   měření vůbec fyzikálně možné, a k výpočtu tam, kde měření chybí;
   výsledek je vždy označen `vypocet`, nikdy `namereno`.
10. **Ceny s datem a v místní měně.** CZ: USD + CZK (ČNB), EN: USD + EUR
    (ECB). Přepočet je orientační, bez DPH a dopravy.
11. **Kontext: maximum není doporučení.** Sledujeme nativní maximum,
    doporučený provozní kontext a reálně udržitelný kontext na zařízení.
12. **Vision je výchozí.** U modelů předpokládáme vision, pokud model card
    neříká jinak.
13. **Poctivost o kompromisech.** Lokální AI není pro každého. Kde je cloud
    levnější nebo lepší, řekneme to.
14. **Žádná závislost na prodejcích.** Doporučení podle hodnoty, ne provize.
15. **Živá data.** Registr zdrojů, hlídač, changelog a datum poslední
    kontroly u každého údaje.

---

## 4. Struktura webu

```
/                               Úvod: rozhodovací rozcestník
│
├── /zaciname/                  Lokální AI od nuly
│   ├── co-je-lokalni-ai        Co to je, co to umí, co to neumí
│   ├── jak-to-funguje          Váhy, kvantizace, paměť, tok/s
│   ├── proc-moe                Aktivní parametry, proč dense na krabici nejede
│   ├── jak-cteme-data          Jak čteme cizí měření, roofline a rozpětí
│   ├── prostredi               Node, Python, Git a runtime pro modely
│   └── slovnik                 Pojmy bez balastu
│
├── /zarizeni/                  Katalog hotových zařízení (128 GB)
│   ├── dgx-spark               128 GB, 273 GB/s, 6 950 USD
│   ├── dgx-spark-oem           15 GB10 OEM variant, české ceny
│   ├── rtx-spark-mini          128 GB, 300 GB/s, 5 999 USD
│   ├── rtx-spark-notebook      128 GB, 300 GB/s, 5 899–6 999 USD
│   ├── strix-halo              128 GB, 256 GB/s, 3 449–5 349 USD
│   ├── strix-halo-oem          3 české 128GB konfigurace, od 119 990 Kč
│   └── srovnani                Velká matice Parametr × Zařízení
│
├── /modely/                    Katalog současných modelů
│   └── qwen3-8-flash-next      Minimum pro denní práci na 128 GB (176B / 6B)
│
├── /rychlost/                  Jak rychle to poběží
│   ├── roofline                Jediný vzorec, který to vysvětlí
│   ├── ttft-a-prefill          Proč první token trvá dlouho
│   ├── kontext                 Dlouhý kontext = méně streamů
│   └── kalkulacka              Odhad doby odpovědi (progressive enhancement)
│
├── /vyber/                     Rozhodovací průvodce
│   ├── rozpocet                Do 4 000 / 4–8 tis. / 10 tis.+ USD
│   ├── stolni-vs-notebook      Kde má GPU běžet
│   ├── kolik-uzivatelu         Kolik lidí jeden stroj obslouží
│   └── bezpecna-volba          Co je minimum a co je už zbytečné
│
├── /zdroje/                    Data a vývoj v čase
│   ├── mereni                  Tabulka měření s datem a konfigurací
│   ├── data/<id>               Datová karta: zdroj, podmínky, interpretace
│   ├── zdroje                  Co sledujeme a proč
│   ├── co-nevime               Veřejný seznam mezer v datech
│   └── novinky                 Changelog: nové modely, ceny, verze
│
└── /o-webu/                    Kdo, jak a proč
    ├── proc-tento-web
    ├── metodika                Nemáme laboratoř; jak čteme data
    ├── jak-piseme
    └── pravni
```

### Poznámky ke struktuře

- **Zařízení a modely jsou two-dimenzionální jádro.** Stránky zařízení
  odpovídají „co na tom poběží“, stránky modelů „kde to poběží“. Odkazují
  na sebe navzájem.
- **Rychlost je samostatná sekce**, protože bez pochopení roofline a kontextu
  čísla v tabulkách nic neznamenají.
- **Výběr** je vstupní brána pro člověka, který ještě neví, co chce.
- **Zdroje** nejsou příloha, ale důkaz důvěryhodnosti. Každá stránka má
  `last_verified` a odkaz na měření.

---

## 5. Datový model

Jeden zdroj pravdy pro každou entitu. Stránky se generují z dat, ne z ručně
přepisovaných tabulek.

### 5.1 Zařízení (`data/zarizeni.yaml`)

```yaml
- id: dgx-spark
  nazev: NVIDIA DGX Spark
  vyrobce: NVIDIA
  kategorie: mini-pc          # mini-pc | notebook | desktop | station
  pamet_gb: 128
  pamet_typ: unified
  bandwidth_gbs: 273
  cena:
    usd: 6950
    overeno: 2026-10-02
    zdroj: https://…
    poznamka: bez DPH a dopravy
  cpu: GB10 Grace Blackwell
  gpu: Blackwell
  os: [DGX OS, Ubuntu]
  software: [CUDA, vLLM, SGLang, llama.cpp]
  prikon_w: null
  hmotnost_kg: null
  prodejce: [NVIDIA, Acer, ASUS, Dell, HP, MSI]
  silne: [CUDA, enterprise management, clustering]
  slabe: [cena po zdražení, uzavřený stack]
  zdroje: [https://…]
  overeno: 2026-11-04
```

Cena se na webu zobrazuje jako `6 950 USD` + `≈ 151 200 Kč` (CZ) nebo
`≈ 6 217 EUR` (EN). Přepočet se bere z `data/kurzy.yaml`, ne ručně.

### 5.2 Modely (`data/modely.yaml`)

```yaml
- id: qwen3-8-flash-next
  nazev: Qwen3.8 Flash Next
  vyrobce: Qwen
  architektura: MoE
  parametry_celkem_b: 176
  parametry_aktivni_b: 6
  kontext:
    max: 262144                # nativní maximum
    max_rozsireni: 1000000     # YaRN, pokud výrobce uvádí
    doporuceny: 131072         # provozní bod, kde je kvalita/rychlost nejlepší
    poznamka: maximum není doporučený provozní bod
  vision: true                 # výchozí předpoklad
  modality: [text, obraz]
  licence: Apache-2.0
  kvantizace:
    - {nazev: NVFP4, vahy_gb: 101, engine: vLLM}
    - {nazev: MLX 4bit, vahy_gb: 88, engine: MLX}
    - {nazev: GGUF Q4_K_M, vahy_gb: 95, engine: llama.cpp}
  role: minimum                # minimum | vyssi | special
  stav: doporuceny             # doporuceny | pod-hranici | jen-pro-velke
  zdroje: [https://…]
  overeno: 2026-11-04
```

### 5.3 Měření (`data/mereni.yaml`)

```yaml
- id: 2026-10-15-dgx-spark-qwen38-nvfp4
  datum: 2026-10-15
  zarizeni: dgx-spark
  model: qwen3-8-flash-next
  kvantizace: NVFP4
  engine: vLLM
  engine_verze: "0.30.0"
  kontext: 32000
  kontext_strop: 262144
  ttft_ms: null
  prefill_toks: null
  decode_toks: 70
  agregat_toks: null
  soubeznost: 1
  nastaveni:
    mtp: true
    mtp_draft_tokens: 3
    kv_cache: fp8
    flash_attention: true
    chunked_prefill: true
    teplota: null
    power_limit_w: null
  typ: namereno              # namereno | vypocet | vlastni
  mereno_kym: nezavisle      # vyrobce | nezavisle | komunita | my
  zdroj_typ: nezavisle       # oficialni | nezavisle | komunita | vypocet
  duveryhodnost: stredni     # vysoka | stredni | nizka
  rozptyl:
    min: 60
    max: 79
    jine_zdroje: [https://…]
  normalizace: "single-stream, kontext 32k, bez fronty"
  interpretace: "Pro denní práci použitelné; na 4 souběžné uživatele
    počítej s ~20 tok/s na stream."
  zdroj: https://…
  poznamka: "MTP zapnuto; stejná kvantizace jako v [jiný zdroj]."
```

### 5.4 Zdroje (`data/zdroje.yaml`)

```yaml
- id: qwen-blog
  nazev: Qwen blog
  url: https://qwen.ai/blog
  typ: html                  # rss | github | hf | html | api
  co_sledujeme: [nove-modely, benchmarky]
  frekvence: tydne
  priorita: vysoka           # vysoka | stredni | nizka
  duveryhodnost: vysoka      # vysoka | stredni | nizka
  posledni_kontrola: 2026-11-04
  stav: ok                   # ok | novinka | chyba
  poznamka: "Nové modely a benchmarky; výkonnostní tvrzení ověřovat jinde."
```

### 5.5 Kurzy (`data/kurzy.yaml`)

```yaml
- datum: 2026-11-03
  usd_czk: 21.762
  eur_czk: 24.340
  usd_eur: 1.1179
  zdroje:
    - https://www.cnb.cz/…/daily.txt
    - https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
```

### 5.6 Změny (`data/zmeny.yaml`)

```yaml
- datum: 2026-11-04
  typ: cena                 # cena | model | mereni | zdroj | obsah
  titulek: "DGX Spark zdražil na 6 950 USD"
  co_se_zmenilo: …
  dotcene_stranky: [zarizeni/dgx-spark, vyber/rozpocet]
  zdroj: https://…
```

### 5.7 Pravidla

### 5.5 Pravidla

- ID jsou stabilní, malá písmena, bez diakritiky.
- Cizí klíče (`zarizeni`, `model`) musí existovat; kontroluje skript.
- Každý záznam má `overeno` a alespoň jeden `zdroj`.
- Když údaj chybí, je `null`, ne vymyšlené číslo.
- Tabulky na webu se generují z těchto dat; ruční tabulka v Markdownu
  je výjimka, ne pravidlo.

---

## 6. Technická architektura

### 6.1 Generátor

**Astro 7 + Starlight 0.41**, čistý statický výstup. Stejný základ jako OpenWork.cz.

| Vrstva | Řešení |
|---|---|
| Obsah | Markdown/MDX + frontmatter v `src/content/docs/` |
| Data | YAML v `data/` (společná pro obě mutace) |
| Šablony | Starlight + override komponent v `src/components/` |
| Styl | jeden `custom.css` s CSS proměnnými Starlightu |
| Vyhledávání | Pagefind (součást Starlightu) |
| Zvýraznění kódu | Shiki (součást Astro) |
| Build | `npm run build` → `dist/` |
| Kontrola | `npm run check` — odkazy, frontmatter, cizí klíče, data |

### 6.2 Vzhled

Starlight bereme tak, jak je — stejně jako OpenWork.cz. Nejsou potřeba
vlastní layouty ani ruční sidebar:

- levý sidebar s tematickými skupinami (autogenerate ze složek),
- pravý obsah stránky (TOC),
- horní lišta s názvem, přepínačem tématu a hledáním,
- tmavý a světlý režim,
- karty, tabulky, `Aside` bloky (tip / note / caution),
- responzivní sidebar na mobilu.

Vlastní je jen:

- **barva značky** a systémové písmo v `custom.css`,
- **override `PageTitle`** kvůli `last_verified`,
- **override `Footer`** kvůli větě o nezávislosti,
- **override `Hero`** na úvodní stránce,
- případné komponenty pro karty zařízení a tabulky z YAML.

**Důležité:** barvu značky zvolíme vlastní, ne kopii OpenWork. Struktura
a chování šablony jsou stejné, identita webu ne.

### 6.3 Co je potřeba postavit

1. `astro.config.mjs` — `site`, Starlight, sidebar, `rehype-external-links`,
   meta pro sdílení.
2. `src/content.config.ts` — kolekce obsahu a validace frontmatteru.
3. `src/components/` — `PageTitle`, `Footer`, `Hero`, karty, tabulky.
4. `src/styles/custom.css` — barvy, písmo, tabulky, karty.
5. `data/` — YAML pro zařízení, modely, měření, zdroje a kurzy.
6. `src/lib/` — načtení dat, filtry, výpočty (roofline, souběžnost),
   přepočet cen přes `data/kurzy.yaml` (`cena.ts` s `Intl.NumberFormat`
   pro cs-CZ a en-GB).
7. `scripts/kontrola-obsahu.mjs` — odkazy, frontmatter, cizí klíče, data.
8. `scripts/hlidac.mjs` — kontrola zdrojů, report, changelog.
9. `public/` — `CNAME`, `favicon.svg`, `robots.txt`, `og.png`.
10. GitHub Actions — build, publikace do cílového repa, týdenní hlídač.
10. Pagefind je součástí Starlightu, není potřeba instalovat.

### 6.4 Repozitáře a nasazení

**Zvolený model: jeden zdrojový repo + dva publikační.**

```
localinference/                 # zdrojový repo
  data/                         # společná data (YAML)
  sites/
    cz/                         # Astro + Starlight, český web
      src/content/docs/         # české stránky
      src/components/           # override komponenty
      src/styles/custom.css
      public/CNAME              # localinference.cz
    en/                         # anglický web (později)
  packages/theme/               # volitelně sdílené komponenty a CSS
  .github/workflows/
    nasazeni-cz.yml
    nasazeni-en.yml
```

- Workflow sestaví `sites/cz` a publikuje `dist/` do repa
  `localinference.cz` (větev `gh-pages`) přes deploy klíč.
- Totéž pro EN do `localinference.eu`.
- Cílové repy obsahují jen `CNAME` a historii nasazení, ne zdrojový kód.
- Pro první verzi stačí `sites/cz`; EN se přidá po stabilizaci obsahu.

**Alternativa, pokud by cross-repo publikace vadila:** dva samostatné repy
se sdíleným tématem a daty jako git submoduly. Každý se nasazuje sám.

### 6.5 GitHub Pages

- Cílový repo: Pages → „Deploy from a branch“ → `gh-pages` → `/ (root)`.
- Vlastní doména v `public/CNAME`, HTTPS vynucené.
- `robots.txt` + `sitemap-index.xml` (Astro je generuje).
- Žádný build na klientu.

---

## 7. Obsahový plán

Podrobný plán po vlnách je v [`plan-obsahu.md`](plan-obsahu.md).

Zkráceně:

| Vlna | Co | Výstup |
|---|---|---|
| 0 | Pravidla, plán, šablony | `AGENTS.md`, `plan-*.md`, `obsah/_sablona-*` |
| 1 | Jádro vysvětlení | 6 stránek `zaciname/` + `rychlost/` |
| 2 | Zařízení | katalog + 7 detailů + srovnání |
| 3 | Modely | katalog + 5–6 detailů + srovnání |
| 4 | Výběr a kalkulačka | 3–4 stránky + progresivní kalkulačka |
| 5 | Zdroje a měření | tabulky, changelog, hlídač |
| 6 | EN mutace | překlad/adaptace + druhé repo |
| 7 | Astro + Starlight stavba | šablona, build, nasazení |

**Pořadí je závazné v tom, že obsah předchází kód.** Vlny 1–5 vznikají jako
Markdown v `sites/cz/src/content/docs/`. Teprve pak se staví web.

---

## 8. Rizika a jak je řešit

| Riziko | Dopad | Řešení |
|---|---|---|
| Data rychle stárnou | web ztrácí důvěru | `last_verified`, hlídač zdrojů, měsíční revize |
| Nemáme vlastní měření | tabulky jsou jen převzatá data | jasně označit `namereno` (zdroj) / `vypocet`, uvádět rozpětí a důvěryhodnost; neodhadovat |
| Málo nezávislých měření | jeden zdroj může být outlier | hledat 2+ zdroje, roofline kontrola, komunitní měření, transparentní konflikt |
| Vlastní komponenty a datové tabulky chtějí čas | zpoždění startu | nejdřív obsah, pak šablona; minimum na startu |
| Dvě mutace se rozejdou | nekonzistentní data | společná data, kontrolní skript, společný changelog |
| Příliš mnoho stránek | kvalita klesá | 12–15 klíčových stránek, zbytek až po ověření zájmu |
| Zavádějící čísla | ztráta kredibility | typ údaje, kontext, konfigurace, zdroj, důvěryhodnost |
| Hardware je drahý a mění se | čtenář váhá | rozhodovací stránky podle rozpočtu a použití |

---

## 9. Otevřená rozhodnutí

1. **Generátor:** ✅ rozhodnuto — **Astro + Starlight**, stejná šablona jako
   OpenWork.cz. 11ty bylo zvažováno, ale nepoužije se.
2. **Repozitáře:** ✅ rozhodnuto — **jeden zdrojový repo + dva publikační**
   (`localinference.cz`, `localinference.eu`).
3. **EN mutace:** ✅ rozhodnuto — **CZ první, EN po stabilizaci obsahu**.
4. **Značka:** „Local Inference“, nebo český název?
5. **Analytics:** vůbec, a pokud ano, jaká?
6. **Vlastní měření:** ✅ pracujeme **bez vlastního fyzického testování**.
   Data přebíráme a interpretujeme; případné vlastní měření je bonus,
   ne předpoklad projektu.

---

## 10. První krok

Napsat obsahové jádro jako Markdown:

1. `sites/cz/src/content/docs/zaciname/co-je-lokalni-ai.md`
2. `sites/cz/src/content/docs/zaciname/jak-to-funguje.md`
3. `sites/cz/src/content/docs/rychlost/roofline.md`
4. `sites/cz/src/content/docs/modely/qwen3-8-flash-next.md`
5. `sites/cz/src/content/docs/zarizeni/dgx-spark.md`
6. `sites/cz/src/content/docs/o-webu/metodika.md`
7. `sites/cz/src/content/docs/data/qwen3-8-flash-next-strix-halo.md`

Tyto stránky stanoví tón, hloubku a datové konvence. Podle nich se pak
postaví zbytek katalogu a teprve potom Astro + Starlight šablona.

---

## 11. Nápady, které stojí za to

Seřazeno podle dopadu na důvěryhodnost a užitečnost.

### 11.1 Datové karty (evidence cards)

Každé klíčové číslo dostane stabilní URL `/data/<id>/` s:

- **co tvrdí zdroj** a za jakých podmínek (kvantizace, engine, kontext,
  MTP, KV cache, souběžnost, teplota),
- **kdo měřil** a jak důvěryhodný zdroj je,
- **rozptyl** proti dalším zdrojům a vysvětlení rozdílů,
- **naši interpretaci**: co z toho plyne pro denní použití,
- **kontrolu roofline**: je číslo fyzikálně možné?
- odkaz na zdroj a případně raw log nebo příkaz k reprodukci.

**Proč:** nemáme laboratoř, ale můžeme být nejlepší v tom, jak data
srovnáváme, normalizujeme a vysvětlujeme. To je při nedostatku vlastních
měření přesně ta přidaná hodnota.

### 11.2 Česká golden set

Malá sada skutečných úloh, na které se modely testují:

- shrnutí české smlouvy,
- extrakce tabulky z dokumentu,
- e-mail nebo úřední dopis,
- vysvětlení kódu,
- práce s screenshotem,
- česká gramatika a terminologie.

Výsledky: prošlo / neprošlo / ruční poznámka. Zveřejnit prompt a příklad.
**Proč:** „co od modelu čekat“ nejde odpovědět jen z MMLU. Tohle je
největší obsahová mezera a zároveň nejsilnější diferenciátor. Bez vlastního
hardwaru ji lze pojmout jako **otevřenou metodiku**, kterou mohou spustit
čtenáři nebo komunita na svých strojích.

### 11.3 Kontextová příčka

Pro každé zařízení a model sbírat 8k / 32k / 128k / 262k, pokud existují
veřejná měření; chybějící dopočítat roofline z podložených specifikací
a označit `vypocet` — primárně ale vždy hledat zdroj:

- TTFT, prefill, decode,
- kolik souběžných streamů se vejde,
- kde začne padat kvalita.

Výsledek zobrazit jako „použitelnost pro chat / agenta / dávku“.
**Proč:** maximum v datasheetu nic neříká o tom, co zařízení reálně udrží.
I bez vlastního měření lze ukázat, kde se čísla rozcházejí a proč.

**Roofline obálka:** pro každou kombinaci zařízení × model spočítej teoretické
minimum a maximum (bandwidth / bajty na token × efektivita 40–90 %) a do
toho zakresli naměřené body. Odlehlé hodnoty ihned ukážou, kde je měření
podezřelé nebo kde chybí vysvětlení (MTP, NPU, jiná kvantizace).

### 11.4 Historie cen a TCO

- Cenová historie zařízení (graf + tabulka s datem a zdrojem).
- Kalkulačka: hardware + elektřina + odpis + správa vs. cloud API.
- „Kdy se to zaplatí“ pro konkrétní objem tokenů.

**Proč:** ceny se hýbou a rozhodnutí je ekonomické, ne emocionální.

### 11.5 Veřejný dashboard zdrojů

Stránka `/zdroje/` s tabulkou:

- zdroj, co sleduje, frekvence,
- poslední kontrola, stav (ok / novinka / chyba),
- poslední změna a odkaz na changelog.

**Proč:** důvěryhodnost se nedá tvrdit, musí být vidět. Zároveň je to
interní nástroj pro aktualizaci.

### 11.6 Recepty pro nasazení

Pro každé zařízení konkrétní příkazy:

- vLLM (NVIDIA), llama.cpp (ROCm/Vulkan), MLX (Mac),
- verze, kvantizace, kontext, MTP, KV cache,
- očekávaná čísla a časté chyby.

**Proč:** čtenář chce vědět, jak to rozjet, ne jen kolik to stojí.

### 11.7 „Nekupovat“

Seznam zařízení a modelů, které na webu nedoporučujeme, s důvodem:

- model se nevejde nebo běží pod 10 tok/s,
- zařízení má slabou podporu nebo zavřený stack,
- cena nedává smysl proti alternativě.

**Proč:** odmítnutí buduje důvěru víc než další doporučení.

### 11.8 Datové snapshoty a citace

- Každý build může uložit snapshot dat (`data/snapshots/2026-11-04/`).
- Stránka „verze dat“ s odkazem na snapshot.
- Možnost citovat: „Local Inference, data k 4. 11. 2026“.

**Proč:** čtenář a novinář potřebují vědět, k jakému datu se číslo vztahuje.

### 11.9 Štítky důvěryhodnosti

U každého čísla malý štítek:

- `naměřeno` (kdo, kdy, konfigurace),
- `výrobce` (oficiální tvrzení),
- `výpočet` (roofline z podložených vstupů).

**Proč:** zabrání tomu, aby se výpočet tvářil jako měření. Když zdroj
chybí, štítek není `odhad`, ale `[DOPLNIT]`.

### 11.10 Komunitní měření s moderací

Bez vlastního hardwaru je komunita **hlavní způsob, jak data rozšiřovat**.
Formulář nebo PR šablona pro zaslání měření. Povinné položky: zařízení,
model, kvantizace, engine + verze, kontext, souběžnost, čísla, zdroj
a potvrzení, že jde o vlastní měření. Moderace před zveřejněním.

**Proč:** dat je málo a vlastní měření je drahé. Komunita může pomoct,
ale jen s jednotným minimem kvality. Každé zaslané měření projde kontrolou
roofline a označením důvěryhodnosti.

