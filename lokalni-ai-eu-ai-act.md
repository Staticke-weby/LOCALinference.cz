# Lokální AI v Evropě: AI Act, hardware a provozní model

> **Podkladová analýza pro rozhodování.**
> Stav k 3. listopadu 2026. Dokument shrnuje regulatorní rámec, tržní situaci,
> hardwarové možnosti a především architektonické a obchodní důsledky pro firmu,
> která zvažuje provoz vlastní inference.

---

## Obsah

1. [Shrnutí pro rozhodování](#1-shrnutí-pro-rozhodování)
2. [Metodika a meze platnosti](#2-metodika-a-meze-platnosti)
   - [2.1 Jak dokument číst](#21-jak-dokument-číst)
3. [Regulatorní rámec](#3-regulatorní-rámec)
4. [Co lokální nasazení řeší a co ne](#4-co-lokální-nasazení-řeší-a-co-ne)
5. [Evropský trh](#5-evropský-trh)
6. [Hardware](#6-hardware)
7. [Architektura](#7-architektura)
8. [Hybrid s EU API](#8-hybrid-s-eu-api)
9. [Ekonomika](#9-ekonomika)
10. [Trh služeb](#10-trh-služeb)
11. [Referenční architektura](#11-referenční-architektura)
12. [Zaváděcí plán](#12-zaváděcí-plán)
13. [Compliance evidence pack](#13-compliance-evidence-pack)
14. [Rizika a protiargumenty](#14-rizika-a-protiargumenty)
15. [Slovník](#15-slovník)
16. [Zdroje](#16-zdroje)
17. [Historie revizí](#17-historie-revizí)

---

## 1. Shrnutí pro rozhodování

**Šest tezí, o které se dokument opírá.**

1. **AI Act se neptá, kde model běží, ale k čemu systém slouží a kdo je v řetězci.**
   Lokální nasazení není výjimka z regulace. Řeší jiné, často palčivější problémy:
   rezidenci dat, přenosy do třetích zemí, stabilitu verze modelu, utajení.

2. **Velká vlna povinností pro high-risk systémy byla odložena.**
   Digitální omnibus (Regulation (EU) 2026/1744) posunul samostatné high-risk
   systémy na **2. 12. 2027** a high-risk AI ve fyzických produktech na **2. 8. 2028**.
   Co platí a vymáhá se už nyní: GPAI povinnosti (donucování od 2. 8. 2026),
   transparentnost podle čl. 50 a nové zákazy od 2. 12. 2026.

3. **Evropa je v AI vrstvou inference a integrace, ne tréninku frontier modelů.**
   Mistral je jediná laboratoř s reálnou ambicí, Aleph Alpha se posunula
   k suverénnímu enterprise softwaru. Hodnota se soustředí do suverénních cloudů,
   regionálních endpointů a provozní vrstvy — ne do vlastních modelů.

4. **DGX Spark a Strix Halo se budou nasazovat ve velkém, ale jako vrstva, ne náhrada cloudu.**
   Rozhodující parametry jsou 128–192 GB unified paměti za 3,4–7,3 tis. USD
   a enterprise manageability. Limitujícím faktorem je propustnost paměti
   (256–273 GB/s): řídký MoE se 6B aktivních dá **70 tok/s** na začátku kontextu
   a **40 tok/s nad 128k** (Qwen3.8-Flash-Next na DGX Spark, NVFP4 + MTP,
   82–86 % roofline), dense 70B jen ~5 tok/s. Souběžnost agregát nezvyšuje
   a je omezená KV cache. Slot ceiling je ~16, ale **provozní strop jsou
   4 souběžní uživatelé na node** — zbytek je rezerva na prefill interference,
   long-context a failover. Fronta a priorita patří do gatewaye, ne do model
   serveru, jinak vzniká prioritní inverze napříč poolem.
   Třetí třída je **Mac Studio M5 Ultra** (1,2 TB/s, 96–512 GB): 3× levnější
   bandwidth než DGX Spark, ale 1,8× dražší paměť — nejlepší tam, kde PC box
   narazí na strop kapacity, ne tam, kde jde o mnoho uživatelů.
   Čtvrtá třída je **DGX Station GB300** (~95 tis. USD, 252 GB HBM3e @ 7,1 TB/s
   + 496 GB LPDDR5X, 20 PFLOPS FP4): throughput stroj pro 20–40 uživatelů.
   Pozor — 748 GB není 748 GB rychlé paměti; nad 252 GB spadne bandwidth
   18× a model se „zploští“.
   **Celý dokument je omezen na hotové krabice. Žádné skládání hardware.**
   A jedna změna, která převrací srovnání: **DGX Spark zdražil z 3 999
   na 6 950 USD** (10/2026), zatímco RTX Spark notebook i mini mají stejných
   128 GB, **300 GB/s** a stojí 5–6 tis. USD. Pro osobní práci je notebook
   ekonomicky obhajitelný; pro sdílenou, batchovou a auditovatelnou zátěž
   ne. Viz 6.10.
   **Ale správné rozhodnutí není ani jedno:** oddělit klientské zařízení
   (tenký notebook bez GPU) od výpočtu (mini PC / VM). Notebook bez inference
   je o 4 000 USD levnější na uživatele, netopí, nehlučí a vydrží celý den.
   GPU patří tam, kde běží pořád. Viz 6.12.

5. **Krabice má být vyměnitelný inference node, ne platforma.**
   Architektonicky správné je držet oddělené vrstvy: inference node, agent host,
   control plane, data. Cena za tuto lhostejnost se platí politikou — třídami
   služby, verzním kontraktem a datovou hranicí — ne hardwarem.

6. **V praxi to bude vždy hybrid s EU API.**
   Ne jako kompromis, ale jako řízená politika routingu mezi čtyřmi tiery.
   Router a evidence jsou produkt; krabice je komodita.

> **Jedna věta:** Regulace se odložila, ale nezmizela — jen se přesunula
> do doby, kdy už budete mít nasazeno. Hardware zlevňuje a commoditizuje,
> takže hodnota se stěhuje do control plane. Kdo prodává krabice, prohraje;
> kdo provozuje a dokladuje, vyhraje.

### 1.1 Rozhodovací list

Patnáct rozhodnutí, která dokument řeší, s odpovědí na jednom místě.
Každé má odůvodnění v uvedené sekci.

| # | Otázka | Odpověď | Sekce |
|---|---|---|---|
| 1 | Má smysl on-prem vůbec? | Ano pro citlivá a vytížená data; jinak EU API | 9.4 |
| 2 | Jaký standardní stack? | Linux + vLLM; NVIDIA pro plnou sadu funkcí | 6.7 |
| 3 | Hardware do 4 uživatelů? | Strix Halo nebo RTX Spark mini | 6.9 |
| 4 | Hardware nad 192 GB? | Mac Studio, ale jako karanténní uzel | 6.6 |
| 5 | 20+ uživatelů nebo high-risk? | DGX Station GB300 | 6.8 |
| 6 | Kde běží agent? | Per-user VM, **ne** notebook a **ne** inference node | 6.12 |
| 7 | Kde běží inference? | V poolu, ne na klientských zařízeních | 6.12 |
| 8 | Kolik uživatelů na node? | **4**, ne 16 (16 je jen KV slot ceiling) | 7.5 |
| 9 | Kde je fronta? | V gatewayi, ne v nodech | 7.6 |
| 10 | Jak prioritizovat? | 3 třídy + backfilling + aging + deadline | 7.6 |
| 11 | Kolik gatewayů? | 1 do 3 nodů; 2 až když pool přežije ztrátu nodu | 11.5 |
| 12 | UPS? | Ano — šetří reload modelu, ne minuty | 11.6 |
| 13 | Kam logy? | Streamovat mimo box, retence 6 měsíců | 11.6 |
| 14 | Notebooky? | Max 10 bez registru verzí a telemetrie | 6.11 |
| 15 | Kdy high-risk dokumentace? | Do 2. 12. 2027, průběžně | 12 |
| 16 | Jak škálovat? | Out pro lidi, up pro modely; pool, ne fleet | 9.5 |
| 17 | Kdo rozhoduje o EU API? | Gateway, po klasifikaci dat; nikdy tichá eskalace | 8.7 |
| 18 | Jak obnovit po kompromitaci? | Redeploy z manifestu, ne čištění | 11.7 |

**Tři věci, které se v praxi rozhodnou špatně nejčastěji:** počet uživatelů
na node (8), umístění agenta (6) a odklad evidence (15). Všechny tři jsou
drahé na opravu později.

---

## 2. Metodika a meze platnosti

**Označení v textu:**

| Značka | Význam |
|---|---|
| **[fakt]** | Doložitelné tvrzení s uvedeným zdrojem a datem |
| **[odhad]** | Kvalifikovaný odhad autora, nikoli měření |
| **[názor]** | Argumentační pozice, která má být napadnutelná |

**Meze:**

- **Není to právní rada.** Regulatorní část je výklad veřejně dostupných textů
  a komentářů; konkrétní kvalifikace systému vyžaduje právní posouzení.
- **Tržní čísla jsou převzatá.** Ceny hardware a podíly trhu pocházejí z uvedených
  zdrojů k datu publikace a v segmentu DRAM se hýbou po kvartálech.
- **Predikce jsou označené.** Rozdělení trhu služeb v sekci 10 je odhad, ne data.
- **Právní stav se může změnit.** Zbývající část digitálního omnibusu
  (GDPR, Data Act, ePrivacy, NIS2) je ke dni psaní stále v legislativním procesu;
  očekávaná shoda v první polovině 2027.

**Rozsah: jen hotová zařízení.**

Dokument se zabývá výhradně **turnkey appliances** — DGX Spark, DGX Station,
OEM boxy se Strix/Gorgon Halo, Mac Studio. Neřeší skládání PC z komponent,
whitebox servery ani vlastní clustering.

Důvod je praktický, ne ideologický: u AI uzlu rozhoduje o použitelnosti
firmware, ovladače, servis, záruka a lifecycle — ne spec sheet. To dostanete
jen od celku, který někdo postavil, otestoval a podepsal. Ušetřené tisíce
na komponentech se vrátí jako týdny ladění ovladačů a jako mezera
v evidenci, kterou u high-risk systému nedoženete.

**Co dokument neřeší:**

| Téma | Proč ne |
|---|---|
| Trénink a fine-tuning modelů | Dokument je o inferenci; trénink má jiné nároky a jiné právo |
| Vývoj vlastních modelů | Mimo rozsah; předpokládá se použití hotových vah |
| Datacentrové GPU, racky, kapacina | Jiná cenová a organizační liga |
| Konkrétní právní kvalifikace | Vyžaduje právní posouzení konkrétního systému |
| Výběrové řízení a RFP | Dokument dává kritéria, ne dodavatele |
| Integrace do konkrétních aplikací | Závisí na systému, který firma provozuje |

### 2.1 Jak dokument číst

Je dlouhý záměrně, ale málokdo ho potřebuje celý. Tři cesty:

| Čtenář | Co číst | Proč |
|---|---|---|
| **Rozhodovatel** | 1, 9, 10 | Rozhodovací list, ekonomika, trh služeb |
| **Architekt** | 6, 7, 8, 11 | Hardware, vrstvy, routing, referenční architektura |
| **Compliance / DPO** | 3, 4, 13 | Rámec, co on-prem neřeší, evidence pack |
| **Provoz / IT** | 6.11, 6.12, 11.5, 11.6 | Notebooky, klient vs. výpočet, gateway, výpadky |

Sekce 14 (rizika a protiargumenty) je určena všem — obsahuje tři nejsilnější
námitky proti vlastním závěrům dokumentu.

---

## 3. Regulatorní rámec

### 3.1 Časová osa

| Datum | Co platí | Praktický dopad |
|---|---|---|
| 1. 8. 2024 | AI Act (Regulation (EU) 2024/1689) vstupuje v platnost | Rámec existuje, povinnosti nabíhají postupně |
| 2. 2. 2025 | Zákazy nepřípustných praktik (čl. 5) | Zakázané use case, ne technická povinnost |
| 2. 8. 2025 | Povinnosti pro GPAI modely | Dokumentace modelu, copyright policy, shrnutí trénovacích dat |
| 24. 7. 2026 | Omnibus vyhlášen v Official Journal (Reg. (EU) 2026/1744) | Právní jistota o nových datech |
| 27. 7. 2026 | Omnibus vstupuje v platnost | Nové termíny účinné |
| 2. 8. 2026 | **Donucovací pravomoci AI Office pro GPAI**; transparentnost (čl. 50) vymahatelná | Pokuty do 3 % obratu; reálné riziko pro dodavatele modelů |
| 2. 12. 2026 | Nové zákazy (nudifikace, CSAM); lhůta na značení AI obsahu pro systémy uvedené na trh před 8/2026 | Poslední „rychlá“ povinnost, kterou je třeba stihnout |
| 2. 12. 2027 | **High-risk samostatné systémy (Annex III)** | Nábor, úvěry, vzdělávání, kritická infrastruktura, migrace |
| 2. 8. 2028 | **High-risk AI ve fyzických produktech (Annex I)** | Stroje, hračky, výtahy, zdravotnické prostředky |

**Klíčové číslo:** odklad high-risk povinností není „zrušení“. Harmonizované
standardy, na kterých má shoda stát, jsou zpožděné — a proto je dodržení
v prosinci 2027 bude obtížnější, ne snadnější. Kdo má dokumentaci hotovou,
projde. Kdo začne v listopadu 2027, bude mít drahý problém.

### 3.2 Role v řetězci — nejčastější a nejdražší chyba

Rozhodující otázka není „kde to běží“, ale **kdo jste**.

| Role | Kdy vzniká | Co z toho plyne |
|---|---|---|
| **Provider** | Uvádíte systém na trh pod svým jménem, nebo ho podstatně modifikujete pro high-risk účel | Plná dokumentace (Annex IV), conformity assessment, CE, registrace |
| **Deployer** | Systém používáte pro svůj provoz | Čl. 26: použití dle návodu, lidský dohled, logy, monitoring |
| **Distributor / importér** | Přeprodáváte | Ověření shody, informační povinnosti |
| **Poskytovatel GPAI** | Trénujete nebo podstatně modifikujete foundation model | Čl. 53+: dokumentace, copyright, shrnutí dat, systémová rizika |

**Praktický scénář, který lidi překvapí:** koupíte DGX Spark, nasadíte
open-weight model, používáte ho interně → jste *deployer*. Ale když model
doladíte, dáte mu svoje jméno a zabudujete do high-risk produktu, stáváte se
podle **čl. 25** *providerem* — s plnou dokumentací. To je častá a drahá chyba.

### 3.3 Povinnosti deployera u high-risk systémů

Podle čl. 26, s účinností od 2. 12. 2027:

- použít systém v souladu s návodem k použití,
- zajistit **lidský dohled** kompetentními osobami (a mít pro to proceduru, ne jen školení),
- zajistit, aby vstupní data byla relevantní a dostatečně reprezentativní,
- **uchovávat logy alespoň 6 měsíců** (není-li jiná unijní nebo národní úprava delší),
- monitorovat provoz a hlásit vážné incidenty,
- informovat pracovníky a dotčené osoby,
- spolupracovat s dozorovým orgánem.

Pro **veřejné orgány** a soukromé subjekty poskytující veřejné služby,
stejně jako pro deployery v úvěrování a pojišťovnictví, navíc **FRIA**
(čl. 27) — posouzení dopadů na základní práva.

### 3.4 GPAI: co se týká vás jako zákazníka

Povinnosti nese **poskytovatel modelu**, ne vy. Ale vy jako deployer
potřebujete mít k dispozici:

- dokumentaci modelu a informace o jeho schopnostech a limitech,
- informace o trénovacích datech v rozsahu, který poskytovatel zveřejňuje,
- shrnutí autorskoprávní politiky,
- u modelů se systémovým rizikem informace o evaluacích a mitigacích.

**Praktický test:** pokud vám dodavatel není schopen dodat ani kartu modelu
s identifikací verze, je to signál, že vaše evidence pro případný high-risk
use case nevznikne. To je důvod odmítnout dodavatele dřív, než kvůli tomu
vznikne problém.

**Donucování:** od 2. 8. 2026 může AI Office žádat dokumenty, přístup k modelu
pro evaluaci, nařídit mitigaci a uložit pokutu do 3 % celosvětového obratu
nebo požadovat stažení modelu z trhu. Procedurální pravidla stanoví
Implementing Regulation (EU) 2026/1755 (účinná od 10. 8. 2026).

### 3.5 Transparentnost (čl. 50)

Vymahatelná od 2. 8. 2026. Týká se vás i při čistě interním nasazení:

- **chatbot** musí být identifikovatelný jako AI,
- **syntetický obsah** musí být označen (strojově čitelná metadata tam, kde je to technicky možné),
- **deepfake** musí být označen,
- **emotion recognition** a **biometric categorization** musí být oznámeny dotčeným osobám.

Pro systémy uvedené na trh před 2. 8. 2026 platí lhůta na značení do 2. 12. 2026.

### 3.6 Vztah ke GDPR — co je reálně palčivější

Pro většinu firem není dnes hlavní constraint AI Act, ale GDPR:

- **DPIA** (čl. 35) u zpracování s vysokým rizikem — typicky rozsáhlé profilování, citlivé kategorie, systematické monitorování.
- **Přeshraniční přenosy** (kapitola V) — každé volání cloudového API je potenciálně přenos.
- **Minimalizace a retence** — prompt logy jsou osobní údaje, pokud obsahují osobní údaje.
- **Transparentnost** (čl. 13–14) — lidé mají vědět, že proti nim běží automatizované rozhodování.
- **Zpracovatelská smlouva** — dodavatel inference je procesor, ne správce.

**Lokální inference odstraní otázku přeshraničního přenosu. Neodstraní DPIA.**
To je nejčastější záměna v marketingových materiálech dodavatelů.

### 3.7 Co odklad znamená prakticky

| Co dělat hned | Co může počkat do 2027 |
|---|---|
| Inventář AI systémů a mapování rolí | Conformity assessment |
| Evidence verzí modelů a evaluací | Notifikovaná osoba |
| Transparentnost (čl. 50) | Kompletní Annex IV dokumentace |
| GPAI dokumentace od dodavatelů | Post-market monitoring plán v plném rozsahu |
| DPIA pro citlivé use case | Registrace v databázi EU |
| Smluvní doložky (změna modelu, exit, váhy) | FRIA, pokud nejste veřejný orgán |

---

## 4. Co lokální nasazení řeší a co ne

| Požadavek | Řeší on-prem? | Poznámka |
|---|---|---|
| Rezidence dat, přenosy do třetích zemí | **Ano, zásadně** | Nejsilnější argument — silnější než AI Act |
| Klasifikace rizika a účelu systému | Ne | Rozhoduje use case, ne hosting |
| Lidský dohled (čl. 26) | Ne | Proces, ne hardware |
| Logování a dohledatelnost | **Ano, lépe** | Logy máte u sebe, retence je vaše věc |
| Dokumentace a posouzení shody | Ne | Naopak — část břemene přebíráte |
| Reprodukovatelnost verze modelu | **Ano, klíčové** | Cloud vám model vymění; pro validaci potřebujete zmrazenou verzi |
| Kybernetická bezpečnost | **Ne, zhoršuje** | Patchování, správa přístupů, provenance vah je teď na vás |
| Monitoring po uvedení na trh | Ne | Proces, který musí existovat i u krabice |

**Dva momenty, které se podceňují:**

1. **Zmrazená verze.** U cloudového API vám dodavatel mění model bez oznámení.
   U high-risk systému potřebujete doložit, že jste validovali konkrétní verzi.
   To je věcný, ne ideologický důvod pro on-prem v regulovaném prostředí.

2. **Provenance vah.** Odkud máte model? Kdo ho kvantizoval? Byl nějak modifikován?
   U high-risk systému je to součást dokumentace. „Stáhl jsem to z Hugging Face“
   není odpověď, která obstojí.

---

## 5. Evropský trh

### 5.1 Modelová vrstva

**[fakt]** Mistral je jediná evropská laboratoř s reálnou ambicí na general-purpose
modely. V srpnu 2026 ohlásila:

- **regionální endpointy** (volba EU / US pro inference) v obecné dostupnosti,
- dlouhodobé kapacitní závazky v Evropě, cíl **1 GW suverénní kapacity do 2030**,
- infrastrukturu GB200 / GB300 / B300, lokalita ve Švédsku (EcoDataCenter),
- partnerství se SAP (srpen 2026) a Cloudera (září 2026) pro nasazení
  v podnikovém a suverénním prostředí.

**[fakt]** Aleph Alpha po investici ~500 mil. EUR (SAP, Bosch, Schwarz Group)
odešla z frontier závodu a přeorientovala se na suverénní enterprise software
(Pharia, on-prem, air-gapped).

**[odhad]** Evropská modelová vrstva tedy nebude konkurovat nejlepším globálním
modelům. Bude dodávat: (a) modely „dost dobré“ pro většinu podnikových úloh,
(b) suverenitu provozu, (c) integraci do podnikových systémů.

### 5.2 Inference a suverénní cloud

**[fakt]** Vznikla vrstva poskytovatelů, kteří nevyvíjejí modely, ale provozují
open-weight modely v EU:

| Poskytovatel | Země | Charakteristika |
|---|---|---|
| STACKIT (Schwarz Group) | DE | BSI, Gaia-X |
| IONOS AI Model Hub | DE | BSI C5, Gaia-X |
| OVHcloud AI Endpoints | FR | SecNumCloud / ANSSI, ZDR |
| T-Systems / Telekom | DE | suverénní T-Cloud |
| Infercom | LU/DE | Mnichov, ISO 27001, zero data retention, on-prem racks |
| SAP Generative AI Hub | DE | enterprise, převážně proprietary modely |

**[názor]** Tohle je nejzajímavější evropská vrstva — a je téměř neviditelná
v mediálním obrazu „Evropa v AI prohrává“. Pro firmu, která potřebuje
provozovat open-weight model s EU rezidencí, je to dnes nejrychlejší cesta.

**Pozor na jednu věc:** regionální endpoint ≠ žádné přenosy mimo region.
I u regionálních endpointů bývají omezené, „zabezpečené“ přenosy k sub-procesorům.
Je to uvedeno i v trust dokumentaci Mistralu. Vždy čtěte DPA, ne marketing.

### 5.3 Compute

**[fakt]** Evropa buduje kapacitu, ale z nízké základny: Mistral cílí na 1 GW
do 2030, národní AI factory programy přes EuroHPC, komerční datacentra
ve Švédsku a Finsku. Ve srovnání s globálními hyperscalery jde o jednotky
procent kapacity.

**[odhad]** Pro podnikovou praxi to znamená: dostupnost EU inference postupně
poroste a cena bude klesat, ale frontier modely budou v EU dostupné
se zpožděním a za prémii. To je další argument pro hybridní architekturu —
ne jako dočasné řešení, ale jako trvalý rys.

### 5.4 Kde Evropa reálně stojí

| Vrstva | Pozice Evropy | Trend |
|---|---|---|
| Frontier modely | Slabá (Mistral, s odstupem) | Spíše se prohlubuje |
| Open-weight modely | Střední (Mistral, Aleph Alpha) | Stabilní |
| Suverénní inference | **Silná** | Roste |
| Regulace | První mover | Exportní standard |
| Enterprise integrace | Silná (SAP, Capgemini, integrátoři) | Roste |
| Hardware | Slabá (žádný evropský výrobce čipů) | Beze změny |

**Důsledek:** Evropská konkurenční výhoda není v modelech, ale v **důvěryhodném
provozu a doložitelnosti**. To je přesně to, co AI Act vyžaduje — a co zbytek
světa bude muset dohánět.

---

## 6. Hardware

### 6.1 NVIDIA DGX Spark

**[fakt]** GB10 Grace Blackwell, 128 GB unified paměti, 273 GB/s, uvedeno
v prodeji v říjnu 2025 za 3 999 USD.

**Pozor na cenu — ta se výrazně změnila:**

| Datum | Model | Cena |
|---|---|---|
| Říjen 2025 | DGX Spark 128 GB (uvedení) | 3 999 USD |
| Únor 2026 | DGX Spark 128 GB | 4 699 USD |
| 2. 10. 2026 | DGX Spark 128 GB | **6 950 USD** |
| 23. 10. 2026 | DGX Spark 64 GB (partneři) | od 4 999 USD |

Nárůst o 74 % za rok, svázaný s cenami pamětí. To mění ekonomiku celého
segmentu — a je to důvod, proč čísla v tomto dokumentu vždy uvádějí datum.

Vývoj během 2026:

| Datum | Co se stalo |
|---|---|
| Leden 2026 | CES: rozšíření playbooků, NVIDIA AI Enterprise support pro GB10 systémy |
| Únor–březen 2026 | Nasazení ve vysokém školství, scaling agentních workloadů |
| Červen 2026 | RTX Spark pro Windows PC (až 1 PFLOPS, 128 GB), NemoClaw blueprint, OpenShell pro Windows |
| 2. 10. 2026 | **DGX Spark 64 GB** — dostupný od Aceru, ASUS, Dellu, Gigabyte, HP, MSI; NVIDIA Sync Cluster Assistant |
| 21. 10. 2026 | GTC Berlín: **enterprise manageability** — integrace s Absolute, Splunk, Fleet, Microsoft Intune, Perforce Puppet, Chef, Tanium |
| Prosinec 2026 | **DGX Station for Windows** od OEM partnerů |

**[názor]** Ty integrace s Intune/Tanium jsou nejdůležitější oznámení z celého
roku. Znamenají, že NVIDIA myslí „flotilu“, ne „jednoho vývojáře“ — a zároveň
přiznává, že bez fleet managementu je krabice v podniku neudržitelná.

**Pozor na pozicování.** DGX Spark se prodává jako „complete platform for local
autonomous agents“ — NemoClaw, OpenShell, playbooky, vlastní modelová rodina
Nemotron. To je **záměrně provázaný stack**. Pokud chcete architekturu
„krabice jako vyměnitelný inference node“, jdete proti směru, kterým tenhle
produkt míří.

### 6.2 AMD Strix Halo / Gorgon Halo

**[fakt]** Ryzen AI Max+ 395 (Strix Halo): 16× Zen 5, Radeon 8060S (40 CU),
až 128 GB LPDDR5X-8000 (~256 GB/s), 50 TOPS NPU, ~60 TFLOPS FP16.
x86 architektura, tedy bez emulace.

**[fakt]** Ceny 128GB systémů (září 2026):

| Systém | Cena |
|---|---|
| Framework Desktop | 3 449 USD |
| GMKtec EVO-X2 | 3 649 USD |
| Minisforum MS-S1 Max | 3 799 USD |
| AMD Ryzen AI Halo (developer box) | 3 999 USD |
| Beelink GTR9 Pro | 4 349 USD |
| HP Z2 Mini G1a | 5 349–7 406 USD |

**[fakt]** **Gorgon Halo** (Ryzen AI Max+ PRO 495): až **192 GB** LPDDR5X-8533
(~273 GB/s), 55 TOPS, 61 TFLOPS, jen PRO SKU s enterprise managementem,
dodávky od Q3 2026 (HP, Lenovo, ASUS). Ceny 7 099–7 299 USD.
Umožňuje modely do ~300B parametrů na jednom SoC.

### 6.3 Srovnání a co z něj plyne

| Parametr | DGX Spark | Strix Halo 128GB | Gorgon Halo 192GB |
|---|---|---|---|
| Paměť | 128 GB | 128 GB | 192 GB |
| Propustnost | ~273 GB/s | ~256 GB/s | ~273 GB/s |
| Software | CUDA, kompletní NVIDIA stack | ROCm, Vulkan, llama.cpp | ROCm, PRO management |
| Cena | **6 950 USD** (128 GB, 10/2026) | 3 449–4 349 USD | 7 099–7 299 USD |
| Výhoda | prefill, ekosystém, clustering (200 Gb/s) | cena, otevřenost, x86 | kapacita |
| Nevýhoda | uzavřený stack, cena | slabší prefill, síť | cena, dostupnost |

**Naměřené hodnoty (podzim 2026):**

| Model | Celkem / aktivních | DGX Spark | Strix Halo 128GB |
|---|---|---|---|
| **Qwen3.8-Flash-Next** | 176B / **6B** | **70 / 40 tok/s** (krátký / >128k) | ~60 tok/s |
| gpt-oss-120B | 117B / ~5B | ~38,6 tok/s | 31–34 tok/s |
| 30B-A3B | 30B / 3B | — | 72–75 tok/s |
| 7–8B dense | 7–8B | — | 46–53 tok/s |
| 70B dense | 70B | — | ~5 tok/s |

**Zásadní pozorování:** rozhoduje počet **aktivních** parametrů, ne celkových.
Qwen3.8-Flash-Next má 176B celkem — tedy víc než gpt-oss-120B — a přesto je
na DGX Spark téměř dvakrát rychlejší. Je to ultra-řídký MoE: 125B hlavní model
+ 51B N-gram embedding + 4B MTP, 512 expertů, 10 routed + 1 shared,
**6B aktivních na token**, nativní kontext 262k (rozšiřitelný na 1M).
Tři ze čtyř vrstev používají Gated DeltaNet (lineární attention), což drží
KV cache malý — a to je vedlejší důvod, proč zvládne víc souběžných streamů.

**Naměřeno na DGX Spark (NVFP4, MTP zapnuto, vLLM):**

| Délka kontextu | Throughput |
|---|---|
| začátek kontextu (do ~32k) | **70 tok/s** |
| nad 128k | **40 tok/s** |
| maximum modelu | 262k (rozšiřitelné na 1M) |

Pokles o ~43 % není chyba měření — je to fyzika, viz 6.4.
Souběžnost se navíc neodvozuje z pevného čísla, ale **z volné paměti
a konfigurace konkrétního zařízení**: čím delší kontext, tím méně streamů
se do KV cache vejde. „16 souběžných“ je tedy hodnota pro krátký kontext
na 128GB stroji, ne univerzální parametr.

**Rozpočet paměti (NVFP4, 128GB box):**

| Položka | Velikost | Poznámka |
|---|---|---|
| Hlavní model 125B | ~70 GB | čte se per token |
| N-gram embedding 51B | ~29 GB | adresuje se deterministicky, **nečte se per token** |
| MTP hlava 4B | ~2 GB | spekulativní dekódování |
| **Váhy celkem** | **~101 GB** | |
| **Zbývá na KV cache + aktivace** | **~27 GB** | určuje strop souběžnosti |

Tohle je jádro celého návrhu Qwen3.8-Flash-Next: 51B parametrů zabírá paměť,
ale ne bandwidth. Proto se model vejde do 128GB a přesto jede na 82–86 %
roofline. A proto je souběžnost **funkcí volné paměti**, ne parametrem
v datasheetu.

**Důsledek pro 192GB tier (Gorgon Halo):** stejný model, ale ~91 GB volných
pro KV cache místo 27 GB. To je víc než trojnásobná kapacita souběžnosti
na dlouhém kontextu — a hlavní věcný argument pro 192GB variantu, který
není o rychlosti, ale o tom, kolik dlouhých kontextů udržíte naráz.

### 6.4 Roofline: jediný vzorec, který to celé vysvětluje

```
tok/s ≈ (propustnost paměti × efektivita) / (bajty přečtené na token)

bajty/token ≈ aktivní_parametry × bajty_na_parametr
```

**Příklad A — Qwen3.8-Flash-Next na DGX Spark (NVFP4, ~4,25–4,5 bit/param
včetně block scales):**

```
6e9 × 4,25 / 8            = 3,19 GB na token
6e9 × 4,50 / 8            = 3,38 GB na token
273 GB/s / 3,19–3,38 GB   = 81–86 tok/s teoreticky
70 tok/s naměřeno         = 82–86 % roofline
70 × 3,19–3,38 GB         = 223–236 GB/s skutečného provozu paměti
```

82–86 % je výborné číslo. Znamená to, že jádro (vLLM + tento model) skutečně
tlačí 82–86 % špičkové propustnosti — víc se z toho hardwaru dostat nedá.
(51B N-gram embedding se navíc adresuje deterministicky a do per-token
matmul budgetu nevstupuje, takže se dá držet v hostitelské paměti.)

**Příklad B — gpt-oss-120B na stejném stroji (MXFP4):**

```
5,1e9 × 4,25 / 8          = 2,71 GB na token
273 GB/s / 2,71 GB        = 100,7 tok/s teoreticky
38,6 tok/s naměřeno       = 38 % roofline
```

**Rozdíl 38 % vs. 82 % není hardware — jsou to jádra a architektura.**
Expert routing u 128-expertového modelu s top-4 zvětšuje unii expertů
v každém kroku, starší kernels na GB10 nejsou optimální a chybí MTP
(spekulativní dekódování). Proto je „kolik tok/s dá krabice“ špatná otázka;
správná je „kolik dá pro **tento model s tímto jádrem**“.

**Čtyři důsledky:**

1. **Dense modely jsou na tomto hardware mrtvé.** Dense 70B: 37 GB/token
   → 7,3 tok/s teoreticky, ~5 naměřeno. Do paměti se vejde, provozovat se nedá.
2. **MoE s malým počtem aktivních parametrů je jediná rozumná cesta.**
   6B aktivních je sweet spot pro 128GB krabici v roce 2026.
3. **Lineární attention (GDN) a sparse attention snižují KV cache**, takže
   zvyšují strop souběžnosti — ne jen tok/s. To je často důležitější parametr.
4. **MTP / spekulativní dekódování** umí přidat 1,5–2× tok/s „zdarma“.
   Pokud ho vLLM nezapne, měříte o třetinu nižší číslo, než hardware umí.

**Závislost na délce kontextu: 70 → 40 tok/s nad 128k.**

Tři příčiny, všechny fyzikální:

1. **KV cache reads.** I se sparse attention (QSA vybírá 512-blokové jednotky
   s rozpočtem ~2 048 tokenů) se na každý token čte rostoucí objem historie.
   GDN vrstvy jsou v tomhle ohledu konstantní, QSA vrstvy ne.
2. **Indexer overhead.** QSA musí nejdřív vybrat, které bloky číst — a ten
   výběr sám stojí práci úměrnou délce kontextu.
3. **MTP acceptance rate klesá** s délkou kontextu, takže spekulativní
   zrychlení slábne. Model, který na začátku kontextu přijme většinu draft
   tokenů, jich na 200k přijme výrazně méně.

**Plánovací pravidlo:** pro agentní zátěž počítejte se **40 tok/s**, ne 70.
Agenti typicky pracují s dlouhým kontextem (RAG korpus, historie volání
nástrojů, kód). Kdo plánuje kapacitu na 70, předimenzuje nodů o ~75 %.

A ještě jeden důsledek, který je snadno přehlédnutelný: **jeden request
s 260k kontextem dokáže spotřebovat většinu paměti nodu.** To není problém
propustnosti, ale koexistence — dlouhý request vytlačí ostatní z KV cache.
Řešení je vyhrazený „long-context lane“, ne vyšší priorita.

**[odhad]** Do roku 2028 se poměr změní jen částečně: LPDDR6 a nástupci
(Medusa Halo třída) přinesou vyšší bandwidth, ale HBM v datacentru zůstane
řádově jinde. Krabice nikdy nebude server — ale s řídkými MoE se k němu
přiblíží víc, než by naznačoval poměr GB/s.

### 6.5 Vendor lock — rozhodnutí, které se dělá při nákupu

| Architektura | Doporučený hardware | Proč |
|---|---|---|
| Krabice jako platforma (agent + model + nástroje) | DGX Spark | Integrace je výhoda, lock je přijatelný |
| Krabice jako vyměnitelný inference node | Strix Halo / Gorgon (OEM box) | Neutrálnější základ, vyměnitelnost je cíl |

**[názor]** Je to nepříjemný důsledek: kdo chce opravdovou vyměnitelnost,
musí si koupit méně integrovaný **hotový** box a integraci udělat na úrovni
softwaru (vlastní serving stack, vlastní registry verzí). Kdo si koupí
integrovaný stack, dostane rychlejší start a nižší vyměnitelnost.
To není chyba produktu, to je obchodní model. Skládat hardware z komponent
však nedoporučuji — ušetřené peníze se vrátí jako provozní dluh.

### 6.6 Apple Silicon: Mac Studio M5 Ultra (96 / 256 / 512 GB)

**[fakt]** M5 Ultra: 30/36 CPU jader, 64/80 GPU jader, 32jádrový Neural
Engine, **1,2 TB/s** propustnost paměti, 96 GB základ, konfigurovatelné
na 256 nebo 512 GB. (M5 Max je jiný čip: do 128 GB, 460–614 GB/s.)

**Ceny (říjen 2026):** M5 Ultra od 5 499 USD; 256 GB ≈ 10 799 USD;
512 GB **22 299 USD** — a jen s nejvyšší konfigurací CPU/GPU.

| Stroj | Paměť | Bandwidth | Cena | $ / GB/s | $ / GB |
|---|---|---|---|---|---|
| Strix Halo 128 | 128 GB | 256 GB/s | 3 449 | 13,5 | 26,9 |
| DGX Spark | 128 GB | 273 GB/s | **6 950** | 25,5 | 54,3 |
| **RTX Spark laptop 128** | 128 GB | **300 GB/s** | **5 899** | **19,7** | 46,1 |
| **RTX Spark mini 128** | 128 GB | 300 GB/s | 5 999 | 20,0 | 46,9 |
| Gorgon Halo | 192 GB | 273 GB/s | 7 099 | 26,0 | 37,0 |
| **Mac Studio M5 Ultra** | **96 GB** | **1 200 GB/s** | **5 499** | **4,6** | 57,3 |
| Mac Studio M5 Ultra | 256 GB | 1 200 GB/s | ~10 799 | 9,0 | 42,2 |
| Mac Studio M5 Ultra | 512 GB | 1 200 GB/s | 22 299 | 18,6 | 43,6 |

**Klíčové čtení: Mac je 3× levnější na GB/s, ale 1,8× dražší na GB paměti.**
Nejde o to, kdo je „lepší“ — jde o to, kterou veličinu potřebujete.

**Roofline (4,5 bit/param):**

| Model | Bajty/token | Mac 1,2 TB/s | DGX Spark 273 GB/s |
|---|---|---|---|
| Qwen3.8-Flash-Next (6B akt.) | 3,4 GB | 356 teoreticky / **180–280 reálně** | 81 / naměřeno **70** |
| Dense 70B | 39,4 GB | 30 / **20–25** | 6,9 / naměřeno ~5 |
| Dense 400B | 225 GB | 5,3 | **nevejde se** |

**Co to mění:**

1. **Dense modely přestávají být mrtvé.** 70B dense na Macu ~20–25 tok/s
   je použitelné; na 128GB PC boxu je to ~5 tok/s, tedy nepoužitelné.
2. **256/512 GB otevírá modely, které se na PC box nevejdou vůbec.**
   To není optimalizace, to je jiná kategorie úloh.
3. **Long context je levnější.** KV cache se do velké paměti vejde, takže
   souběžnost není tak svázaná jako u 128GB stroje s 27 GB volnými.

**Cluster: nová kategorie „privátní frontier“.**

**[fakt]** MLX + RDMA over Thunderbolt 5 (JACCL, topologie ring/mesh,
`mlx.launch`). Apple v říjnu 2026 předvedl **4× Mac Studio 512 GB** běžící
téměř bilionparametrový model Muse Spark Open na **36+ tok/s** při 8k kontextu.

To znamená: model, který jinde potřebuje datacentrum, běží na čtyřech
strojích pod stolem — za ~89 tis. USD včetně propojení. Pro firmu, která
chce frontier-class model bez cloudu a bez NVIDIA datacentra, je to dnes
jediná realistická cesta na jednom místě.

**Kde to v architektuře sedí:**

| Konfigurace | Rola | Proč |
|---|---|---|
| 96 GB | **T1 high-bandwidth** | nejrychlejší odpověď pro model, který se vejde |
| 256 GB | **T1-long** | 200–300B modely, víc long-context streamů |
| 512 GB / cluster | **T1.5 „local frontier“** | modely, které jinde na jednom místě nespustíte |

**Co to rozbíjí — a je to důležitější než parametry:**

1. **Homogenita poolu.** MLX 4-bit ≠ NVFP4. Jiná numerika, jiné výstupy.
   Pro evidenci je to **jiný model**, ne jiná replika. Nelze mezi nimi
   load-balancovat bez nové validace — což je přesně problém z 7.4.
2. **Serving stack.** MLX LM server nemá zralost vLLM (continuous batching,
   prefix caching, kvantizace KV cache). Souběžnost bude nižší, než
   bandwidth slibuje. Single-stream je skvělý, víceuživatelský provoz ne.
3. **Ops.** macOS, žádné IPMI / out-of-band, security updaty s rebootem,
   MDM (Jamf, Intune) ano — ale spravuje konfiguraci, ne GPU workloady.
   Bez ECC paměti.
4. **Cena paměti.** 512 GB za 22 299 USD je 43 USD/GB. Pro velký pool
   neobhájitelné; pro jeden stroj s unikátní úlohou ano.

**Rozhodovací pravidla:**

| Potřeba | Volba |
|---|---|
| Nejrychlejší odpověď na model do 96–128 GB | **Mac 96 GB** |
| Co nejvíc paměti za peníze | PC box (26–37 USD/GB) |
| Model nad 200B na jednom stroji | **Mac 256/512 GB** |
| CUDA ekosystém, vLLM, všechny kvantizace | PC + NVIDIA |
| Homogenní pool a jednoduchý ops | PC boxy |
| Frontier-class model on-prem bez datacentra | **4× Mac 512 GB** |

**[názor]** Mac Studio je nejzajímavější tam, kde PC boxy narazí na zeď
paměti — a nejméně zajímavý tam, kde jde o mnoho souběžných uživatelů.
Nekupujte ho jako „lepší DGX Spark“; kupujte ho jako jinou třídu uzlu.

### 6.7 Proč zůstat u Linuxu + vLLM

**Standard je Linux + vLLM. Mac je karanténa, ne platforma.**

**Argumenty pro vLLM:**

1. **Serving stack je produkt.** Continuous batching, prefix caching, KV cache
   dtype, chunked prefill, spekulativní dekódování, preemption, per-tenant
   limity — přesně to, z čeho je postavený provoz v 7.5 a 7.6. MLX LM server
   to v té zralosti nemá.
2. **Konfigurovatelnost = řiditelnost.** Když nemůžete nastavit `max-num-seqs`,
   `kv-cache-dtype` a scheduling policy, nemůžete vynutit SLO ani cenu.
   „Otevřeno ke konfiguraci“ není comfort feature, je to předpoklad provozu.
3. **Day-0 podpora modelů.** Nové architektury mají vLLM recepty při vydání
   (Qwen3.8-Flash-Next měl recept v den vydání). MLX často čeká na konverzi
   a kvantizovaný checkpoint.
4. **Jeden ops povrch.** Jeden OS, jeden monitoring, jeden runbook, jedna
   sada incidentních postupů. Dva stacky znamenají dvojnásobek provozní práce.
5. **Otevřenost a audit.** Apache-2.0, multi-vendor, chování lze vysvětlit
   a změnit. Pro high-risk evidenci je to věcný argument, ne ideologický.

**Korekce k „první vlaštovce“:**

1,2 TB/s není generační skok, ale **šířka paměťové sběrnice**: M5 Ultra jede
na 1024-bit LPDDR5X, PC SoC (Strix Halo, GB10) na 256-bit. Rozdíl je 4×
v šířce, ne v technologii. Nová generace PC čipů na 256-bit se k tomu
nedostane — realisticky přijde 512-bit a ~512 GB/s kolem roku 2028.
Mezera se tedy **zmenší, ale nezmizí** — a v pásmu nad 192 GB paměti nemá
PC do roku 2027–2028 co nabídnout vůbec.

**Rozhodnutí je asymetrické — a to je celý argument:**

| Scénář | Když vsadíte na Linux + vLLM | Když vsadíte na Mac |
|---|---|---|
| Mezera se zavře (váš předpoklad) | Nic neztratíte | Investice do slepé uličky |
| Mezera zůstane (můj odhad) | Máte standard a jeden specialty node | Máte uzavřený stack bez vLLM ekosystému |

**Cena omylu je nízká v jednom směru a vysoká v druhém.** Proto: standard
Linux + vLLM, Mac jako **karanténní třída uzlu** za stejným gatewayem —
vlastní model ID, vlastní SLO, žádné load-balancování mezi pooly.

**Vzor nasazení:**

| Vrstva | Standard | Karanténa |
|---|---|---|
| OS + serving | Linux + vLLM | macOS + MLX |
| Modely | NVFP4/FP8, verzované | MLX 4-bit, **jiné model ID** |
| Routing | pool, sdílená fronta | vyhrazený lane, vlastní kvóta |
| Ops | standardní runbook | samostatný, minimální |
| Rozsah | vše, co se vejde do 128–192 GB | jen to, co se nevejde nebo potřebuje >1 TB/s |

**Co to znamená pro nákup:** „Linux + vLLM“ není na všech čipech stejný
zážitek. Na ROCm/gfx1151 (Strix Halo) je vLLM druhá liga proti CUDA —
funguje, ale bez některých optimalizací. Kdo chce plnou sadu funkcí
(FP8 KV cache, expert parallel, spekulativní dekódování), skončí u NVIDIA.
To je věcný konflikt s cenovým argumentem pro Strix Halo a je dobré ho
pojmenovat, ne obejít.

### 6.8 DGX Station GB300: co to je a jak pojede

**[fakt]** GB300 Grace Blackwell Ultra Desktop Superchip:

| Komponenta | Parametr |
|---|---|
| GPU | 1× Blackwell Ultra, **252 GB HBM3e @ 7,1 TB/s** |
| CPU | Grace 72 jader (Neoverse V2), **496 GB LPDDR5X @ 396 GB/s** |
| Koherentní paměť celkem | **748 GB** |
| Propojení CPU–GPU | NVLink-C2C, 900 GB/s |
| Výkon | 20 PFLOPS FP4 |
| Síť | ConnectX-8, 800 Gb/s; 2× QSFP112 |
| Příkon | 1 600 W, doporučená jednofázová 200 V |
| Software | Ubuntu 24.04 + NVIDIA AI Enterprise, NIM |
| Izolace | MIG až 7 instancí |
| Škálování | 2 stanice → 1,4 TB, 40 PFLOPS |

**Cena:** 91–125 tis. USD podle OEM (Supermicro 92 887, MSI 96 995).
Dodávky od března 2026 (Dell), ASUS od června; Windows varianta Q4 2026.

**Zásadní věc: 748 GB není 748 GB rychlé paměti.**

| Vrstva | Kapacita | Bandwidth | Co tam patří |
|---|---|---|---|
| HBM3e (GPU) | 252 GB | **7 100 GB/s** | váhy a aktivace čtené per token |
| LPDDR5X (CPU) | 496 GB | **396 GB/s** | zbytek, offload |

Model, který se vejde do 252 GB, jede na plné rychlosti. Model, který
přeteče, spadne na ~396 GB/s — tedy **18× pomaleji** — a agregát se zploští
brzy. Naměřeno: offloadovaný GLM-5.3 (465 GB) dává 44–46 tok/s při C1
a jen 126 při C16.

**Naměřeno (nezávislé testy, podzim 2026):**

| Model | Konfigurace | C1 | Agregát |
|---|---|---|---|
| Qwen3.8-Flash-Next (6B akt.) | NVFP4, MTP3 | **354,6 tok/s** | 2 927,8 |
| Nemotron 3.5 Super (120B/12B) | — | 524 | 7 282 (C64) |
| GLM-5.3-Flash (320B/18B) | NVFP4 | 126,3 | 1 005 (C64) |
| GLM-5.3 (465 GB, overflow) | NVFP4 | 44–46 | 188 (C16) |
| Qwen3.6-35B-A3B | — | — | 26 000+ (C512) |

**Klíčový rozdíl proti malým krabicím: je to throughput stroj, ne latency stroj.**

| | Malá krabice (Spark, Strix, Mac) | DGX Station |
|---|---|---|
| Single-stream | blízko roofline (70–350 tok/s) | 17–30 % roofline (355 tok/s) |
| Souběžnost | agregát téměř nezvedá | agregát roste **téměř lineárně** |
| Limituje | bandwidth | compute a scheduling |
| Model max | 128–192 GB | ~400B v HBM, ~1T s offloadem |

Z toho plyne něco, co se snadno přehlédne: **354 tok/s při C1 není limit,
je to začátek.** Při C64 jde agregát do tisíců. Malá krabice naopak
u 70 tok/s skončila.

**Kdy dává smysl:**

- model, který se nevejde do 192 GB (200–400B),
- 20+ souběžných uživatelů, ne čtyři,
- potřeba MIG izolace, ECC, BMC/IPMI, enterprise support a lifecycle,
- high-risk provoz, kde potřebujete záruku a doložitelný servis.

**Kdy ne:**

- 4–8 uživatelů a model do 128 GB → 8–12× dražší než Spark za stejný výkon,
- model nad 252 GB → propadne na LPDDR a zmizí důvod kupovat GB300,
- rozpočet pod 100 tis. USD, nebo bez 200V přívodu a chlazení.

**Ekonomika [odhad]:**

| Metrika | DGX Spark | DGX Station |
|---|---|---|
| Cena | 4 000 | ~95 000 |
| Single-stream | 70 tok/s | 355 tok/s |
| $ / (tok/s) single | **57** | 268 |
| Model v rychlé paměti | ~200B (4bit) | ~400B |
| Pohodlných uživatelů | 4 | 20–40 |
| $ / uživatel | 1 000 | 2 400–4 750 |

Station je 4,7× dražší za tok/s, ale dá 5–10× víc uživatelů a 2× větší model.
Není to lepší krabice — je to jiná úloha.

### 6.9 Matice hotových zařízení

| Zařízení | Paměť | Bandwidth | Cena | Nejlepší pro | Omezení |
|---|---|---|---|---|---|
| **DGX Spark 128** | 128 GB | 273 GB/s | **6 950** | 1–4 uživatelé, enterprise mgmt | po zdražení drahý |
| **RTX Spark mini 128** | 128 GB | **300 GB/s** | 5 999 | pool, 1–4 uživatelé, CUDA | Windows, nové |
| **RTX Spark notebook 128** | 128 GB | 300 GB/s | 5 109–6 999 | dedikovaný výkon, práce na cestě | spí, throttluje, bez auditu |
| **Strix Halo 128** (OEM) | 128 GB | 256 GB/s | 3 449–5 349 | cena/paměť, x86 | ROCm druhá liga |
| **Gorgon Halo 192** (OEM) | 192 GB | 273 GB/s | ~7 099 | 200B modely, long context | nové, méně otestované |
| **Mac Studio 96** | 96 GB | 1 200 GB/s | 5 499 | nejrychlejší single-stream | MLX, jiná model ID |
| **Mac Studio 256** | 256 GB | 1 200 GB/s | ~10 799 | velké modely, dense | cena paměti |
| **Mac Studio 512** | 512 GB | 1 200 GB/s | 22 299 | 400B+, lokální frontier | cena, ops |
| **DGX Station GB300** | 252 + 496 GB | 7 100 / 396 GB/s | 91–125 tis. | 20+ uživatelů, 400B | cena, 1,6 kW, 200 V |

**Tři pravidla pro výběr z matice:**

1. **Do 4 uživatelů a model do 128 GB** → DGX Spark nebo Strix Halo.
   Rozhoduje cena a to, zda potřebujete CUDA.
2. **Model nad 192 GB, nebo potřeba >1 TB/s na jednom streamu** → Mac Studio.
   Karanténní uzel, ne standard.
3. **20+ uživatelů, nebo high-risk s nárokem na servis** → DGX Station.
   Pod 100 tis. USD se do něj nevejdete a nemá to smysl.

### 6.10 Notebook vs. pool: ekonomika

**Jednotkové ceny (říjen 2026):**

| Zařízení | Paměť | Bandwidth | Cena | $/GB/s |
|---|---|---|---|---|
| Strix Halo 128 (OEM) | 128 GB | 256 GB/s | 3 449 | 13,5 |
| **RTX Spark notebook 128** | 128 GB | **300 GB/s** | **5 109–6 999** | 17–23 |
| **RTX Spark mini 128** | 128 GB | 300 GB/s | 5 999 | 20,0 |
| DGX Spark 128 | 128 GB | 273 GB/s | **6 950** | 25,5 |
| Gorgon Halo 192 | 192 GB | 273 GB/s | 7 099 | 26,0 |

**Zásadní fakt:** RTX Spark notebook má **300 GB/s** — tedy o 10 % víc než
DGX Spark (273 GB/s) — a přesto je levnější. Stejný model, stejná rychlost,
jiná forma. Kdo dnes kupuje DGX Spark za 6 950, kupuje pomalejší stroj
za víc peněz, jen proto, že je to „server“.

**Scénář: 50 uživatelů, 3 roky.**

| | A: notebook každému | B: běžný notebook + pool |
|---|---|---|
| Hardware | 50 × 5 500 = **275 000** | 50 × 1 500 + 5 × 5 999 = **105 000** |
| Gateway + UPS | 0 | 1 600 |
| Provoz (0,2–0,25 FTE) | 50 000–75 000 | 75 000 |
| **Celkem 3 roky** | **325 000–350 000** | **181 600** |
| Tok/s na uživatele | **70 (dedikovaně)** | ~19 (sdíleně, ve špičce) |
| Souběžnost | 50 | 20 |
| $ / (tok/s) kapacity | 78 | 93 |

**A je ~1,8× dražší, ale dá 3,7× rychlejší odpověď na uživatele.** Na jednotku
kapacity je přitom levnější — protože nesdílíte.

**Korekce původního odhadu:** v první verzi této tabulky bylo u notebooků
„provoz ~0“. To je špatně. Notebooky **nejsou bezúdržbové** — jen jinak
náročné. Viz 6.11.

**Kde notebook vyhrává:**

- **Dedikovaný výkon.** Žádná fronta, žádná prefill interference, žádný
  noisy neighbour. To je kvalitativní rozdíl, ne 10 %.
- **Baterie je UPS zdarma.** Odpovídá na otázku z 11.6: notebook výpadek
  přežije, protože ji má integrovanou. Žádný rack, žádné chlazení, žádný
  200V okruh.
- **Data neopustí zařízení.** Pro určitou třídu práce (vlastní drafty, kód
  na stroji) je to striktně lepší než sdílený endpoint.
- **Ops se smrskne na MDM**, které firma už má.

**Kde notebook prohrává — a jsou to strukturální věci, ne preference:**

| Problém | Proč |
|---|---|
| **Utilizace** | 50 notebooků × 24 min inference denně = 1,7 %. Pool dělá totéž za 3,3 h na 5 strojích |
| **Batch přes noc** | Notebook usne, agent umře. Není to chyba konfigurace |
| **Audit** | Logy žijí na 50 discích. „Který model a s jakými daty“ nezjistíte |
| **Sdílení** | Kolega na dovolené = jeho kapacita neexistuje |
| **TDP 45–80 W** | Sustained inference throttluje; mini má 140 W |
| **Long context** | Jeden 200k request vezme celou paměť a stroj je nepoužitelný pro člověka |

**Rozhodovací pravidlo:**

| Podmínka | Volba |
|---|---|
| Práce je osobní, interaktivní, do ~1 h generování denně | **notebook** |
| Batch, přes noc, sdílené úlohy | pool |
| Potřebujete doložit, který model a s jakými daty | pool |
| Uživatel je heavy (agentní smyčky celý den) | **notebook** |
| Uživatel je occasional (pár dotazů denně) | pool |
| Chcete začít a nemáte data o poptávce | **notebooky první** |
| Nemáte registry verzí ani telemetrii | **max 10 notebooků** |

**A ten poslední řádek je nejdůležitější.** Notebooky jsou nejlevnější způsob,
jak zjistit, co lidé skutečně dělají — tedy přesně to, co v 7.7 chybí.
Kupte 5–10 notebooků, změřte poptávku, a podle ní dimenzujte pool.
Neinvestujete naslepo a notebooky se neztratí: stanou se T1 vrstvou
pro heavy uživatele.

**Praktický důsledek pro nákup poolu:** pokud stavíte pool, kupujte
**RTX Spark mini za 5 999**, ne DGX Spark za 6 950. Stejná paměť, vyšší
bandwidth, nižší cena. DGX Spark zůstává smysluplný jen tam, kde potřebujete
jeho enterprise manageability a 200 Gb/s clustering — ne jako „levný node“,
protože levný už není.

### 6.11 Co obnáší správa notebooků

Tohle je nejčastější omyl v „notebook každému“ kalkulaci: **že odpadne
provoz.** Neodpadne. Přestěhuje se z jednoho místa na padesát — a na místo,
kde pro AI neexistují zralé nástroje.

**Co je potřeba na každém zařízení nastavit a udržovat:**

| # | Co | Proč to není jednorázové |
|---|---|---|
| 1 | **Volba modelu a kvantizace** | 40–100 GB na zařízení; model se mění po měsících |
| 2 | **Distribuce vah** | 50 × 60 GB = 3 TB na update; nesmí jít přes internet |
| 3 | **Runtime** | Windows/Arm: llama.cpp, Ollama, LM Studio — ne vLLM |
| 4 | **Power a thermal profil** | 45–80 W; na baterii throttluje, na AC ne |
| 5 | **Sleep a wake lock** | agent nesmí usnout uprostřed běhu |
| 6 | **Délka kontextu a KV cache** | Windows si bere část paměti, zbytek se dělí |
| 7 | **Update policy** | Windows, ovladače, model — každý mění chování |
| 8 | **Telemetrie a evidence** | který model verze běžel, s jakými daty |

**Zásadní mezera: neexistuje Intune pro verze modelů.** Na konfiguraci OS
má firma dvacet let nástrojů (Intune, Jamf, Puppet). Na otázku „která
kvantizovaná verze modelu je na kterém zařízení“ nemá nic. Musíte si to
postavit: registry s hashem modelu, agent, který hlásí stav, a centrální
log.

**A tenhle kus práce je stejný jako u poolu.** Gateway u poolu řeší
„který model běží kde a s jakou kapacitou“; fleet u notebooků řeší
„který model je na kterém zařízení“. Je to **tatáž úloha** — registr verzí
plus telemetrie.

**Důsledek pro architekturu:** control plane není volitelný v žádném
ze dvou modelů. Rozdíl je jen v tom, co řídí:

| | Pool | Notebooky |
|---|---|---|
| Co control plane dělá | routing, fronta, KV účetnictví | distribuce, konfigurace, evidence |
| Zralost nástrojů | střední (vLLM, gatewaye) | **nízká** (nic na verze modelů) |
| Kdo to umí | platform engineer | IT admin + kus vývoje |
| Charakter práce | specializovaná | komoditní, ale roztroušená |

**Kdo to dělá:** u poolu platform engineer (~120 tis. USD/rok), u notebooků
IT administrátor (~70 tis. USD/rok). Peníze jsou podobné, dostupnost lidí
ne — a to je věcný argument, který se v TCO tabulkách neobjeví.

**Dvě věci, které se u notebooků zhoršují s počtem:**

1. **Divergence.** Po roce máte 50 mírně odlišných konfigurací. „Který model
   vyrobil tenhle výstup“ bez telemetrie nezjistíte. U poolu je stav
   deterministický, u notebooku ne.
2. **Distribuční vlna.** Update modelu = 3 TB přes 50 zařízení. Bez lokálního
   cache serveru to je týden a síť v plamenech.

**Praktické pravidlo:** do 10 notebooků to jde spravovat ručně a je to
nejlepší způsob, jak získat data. **Nad 20 už bez registru a telemetrie
ne.** A ten registr se staví jednou — poslouží pak i poolu.

**A ještě jedna věc, která se přehlíží:** na Windows/Arm neplatí standard
„Linux + vLLM“ ze 6.7. Runtime je jiný, kvantizace jiná, chování jiné.
Znamená to **jiné model ID** a jinou validaci — přesně jako u Mac Studia.
Notebook tedy není „menší pool node“, je to další karanténní třída.

### 6.12 Klient versus výpočet: rozhodnutí, které to celé řeší

Celá debata „notebook, nebo pool“ je špatně položená, dokud se nemíchají
dvě věci: **kde člověk pracuje** a **kde běží inference**. Jsou to nezávislá
rozhodnutí a oddělení je levnější než kterákoli jednotná varianta.

| Vrstva | Kde běží | Co to je |
|---|---|---|
| **Interakce** | notebook, tenký klient | UI, editor, chat, agent host |
| **Výpočet** | mini PC / VM / pool | inference node |
| **Stav** | per-user VM nebo kontejner | session, nástroje, oprávnění |
| **Control plane** | gateway | routing, kvóty, evidence |

**Notebook bez inference je výrazně levnější:**

| | Tenký notebook | AI notebook 128 GB |
|---|---|---|
| Cena | 1 200–1 800 | 5 109–6 999 |
| Rozdíl na uživatele | — | **+4 000** |
| Pro 50 uživatelů | 75 000 | **275 000** |
| Fan při zátěži | tichý | 40–45 dBA trvale |
| Výdrž na baterii při 60 W | celý den | **~1,6 h** (99 Wh) |

**Tři věcné důvody, proč inference na notebooku nedává smysl pro většinu:**

1. **Tepelný rozpočet.** 45–80 W v tenkém šasi znamená trvale běžící ventilátor,
   povrch 45–50 °C a zrychlenou degradaci baterie. Notebook je navržený
   na bursty, ne na osm hodin 70 tok/s.
2. **Baterie to nevyřeší.** 99 Wh při 60 W = 1,6 hodiny. Delší agentní úloha
   znamená být na kabelu — čímž mizí hlavní výhoda notebooku.
3. **Ověřitelnost.** U centrálního nodu víte, co běží, v jaké verzi a s jakou
   kvantizací. U 50 notebooků to víte jen tehdy, když máte registry
   a telemetrii (6.11). „Počítá to, co má“ je u centrály vlastnost,
   u fleetu projekt.

**Kde tedy běží agent — tři varianty:**

| Varianta | Výhody | Nevýhody |
|---|---|---|
| Na notebooku | nejnižší latence, funguje offline | přestane běžet po zavření víka |
| **Na per-user VM/kontejneru** | práce pokračuje, izolace, audit | lifecycle 50 VM, cena ~20–40 USD/měs |
| Na inference nodu | jednoduché | **špatné** — stav se váže na compute, drain zabíjí práci |

**Doporučení: agent na per-user VM, inference na pool, notebook jako UI.**
Notebook se zavře a úloha dobíhá. Inference se škáluje nezávisle. A protože
je notebook jen klient, stačí mu 16 GB RAM a běžný procesor.

**Čtyři varianty v číslech (50 uživatelů, 3 roky):**

| Varianta | Hardware | Provoz | Celkem |
|---|---|---|---|
| **A** AI notebook každému | 275 000 | 50–75 000 | 325–350 000 |
| **B** tenký notebook + pool | 105 000 | 75 000 | 181 600 |
| **C** A pro 10 heavy + B pro 40 | 125 000 | 75 000 | 201 600 |
| **D** tenký + per-user VM + pool | 75 000 + 30 000 VM | 90 000 | 196 600 |

**B je nejlevnější. C je nejlepší kompromis**, pokud víte, kdo jsou
heavy uživatelé — a to je přesně důvod, proč má smysl začít měřením
na 5–10 noteboocích.

**A klíčové pravidlo, které z toho plyne:** *nedávejte GPU tam, kde sedí
člověk.* Dejte ho tam, kde může běžet pořád, v deterministickém prostředí
a pod dohledem. Notebook ať zůstane levný, tichý a nahraditelný — tedy
přesně to, co od klienta chcete.

---

## 7. Architektura

### 7.1 Čtyři vrstvy

| Vrstva | Co tam patří | Proč právě tam |
|---|---|---|
| **Inference node** | váhy, tokenizer, chat template, serving (vLLM / llama.cpp), KV cache, embedding a rerank modely | bandwidth-bound, bezstavové, obnovuje se s hardwarem |
| **Agent host** | orkestrace, nástroje, session state, credentials broker, policy engine | stavové, mění se týdně, drží oprávnění |

**Poznámka k agent hostu:** nemusí to být notebook. U úloh, které mají běžet
déle než do zavření víka, patří agent na **per-user VM nebo kontejner**.
Notebook pak zůstává jen UI. Viz 6.12.
| **Control plane** | routing, identita, kvóty, registry verzí, logy, evaluace | musí přežít výměnu obou předchozích |
| **Data** | korpus, vektorový index, DLP klasifikace | vlastněno firmou, leží nad oběma vrstvami |

**Princip:** krabice nemá vědět, kdo se připojuje. Kontrakt je API, identita
a kvóta. Všechno ostatní je v control plane.

### 7.2 Krabice jako utility

Správný mentální model není „AI appliance“, ale **síťová služba** — jako
databázový server, tisková fronta nebo DNS resolver.

Důsledky:

- **Unit nasazení je node v poolu**, ne stroj. Nepojmenovaný, health-checkovaný,
  kdykoli vypnutelný. Krávy, ne mazlíčci.
- **Škálování je změna kapacity**, ne změna aplikace.
- **Klient nesmí znát topologii.** Pokud míří na IP adresu, architektura nefunguje.

> **Test vyměnitelnosti:** Umím node vyprázdnit (drain) a klienti se sami
> připojí jinam, bez změny konfigurace?
> Ano → architektura funguje. Ne → máte jen oddělené krabice se skrytou vazbou.

### 7.3 Cena lhostejnosti

Lhostejnost ke klientovi není zdarma. Kupuje se třemi věcmi, které leží
**mimo krabici**:

| Co musí existovat jinde | Co se stane bez toho |
|---|---|
| **Třídy služby** — prioritní fronty, per-user kvóty, limity kontextu, zvláštní pruh pro interaktivní vs. batch | „Nezajímá mě, kdo se připojuje“ se změní na „vyhrává ten, kdo posílá nejvíc requestů“. Agent s 20krokovou smyčkou vyhladoví firmu. |
| **Verzní kontrakt** — aliasy (`default`, `fast`, `code`), deprekační okna, identita modelu v každém logu | Čím víc nezávislých klientů, tím horší výměna. Box se stane nevyměnitelným právě proto, že na jeho chování visí všichni. |
| **Datová hranice** — auth per uživatel (ne sdílený klíč), retence promptů, izolace tenantů | Sdílený endpoint je sběrný bod. Data z laptopů se slévají na jeden host s logy. Koncentrace rizika, ne jeho snížení. |

### 7.4 Kde se „vyměnitelnost“ láme

**1. Model identity není totéž co endpoint.**
OpenAI-kompatibilní API je nutná, ale slabá podmínka. Vyměnitelnost drží jen když
pinujete i **váhy, kvantizaci, chat template a tokenizer**. Špatný template nebo
jiná kvantizace vyrobí výstup, který vypadá dobře a je horší — a to se nepozná
z HTTP 200. Nejčastější tichá regrese při migraci.

**2. Embedding space se nedá swapnout, jen přeindexovat.**
Výměna embedding modelu invaliduje celý vektorový index. Nejde o konfiguraci,
ale o plný reindex. Důvod, proč držet embeddingy na samostatném, déle stabilním
nodu než generativní model.

**3. Prefix cache chce affinitu.**
Když requesty z jedné agentní session padají na různé repliky, ztrácíte KV cache
reuse a prefill se násobí. Řešení není „nedecouplovat“, ale **consistent hashing
/ session affinity v gatewayi**.

**Pozitivní zpráva:** samotný síťový hop vás nezabije. Při TTFT 200–800 ms
dominuje prefill, ne 0,3 ms RTT na LAN. Decoupling je proveditelný — chce
10/25GbE a rozumný gateway, ne 1GbE a round-robin.

### 7.5 Kapacitní model

**Vzorec:**

```
pohodlná souběžnost ≈ agregovaný throughput / per-user potřebný throughput
```

**Prahové hodnoty podle typu zátěže [odhad]:**

| Zátěž | Potřebný tok/s na stream | Proč |
|---|---|---|
| Interaktivní chat | 15–20 | člověk čte tokeny |
| Agentní smyčka | 5–10 | člověk nečte, čeká na výsledek kroku |
| Batch / klasifikace | 1–2 | nikdo nečeká |
| Diktování, titulky | 30+ | musí stíhat řeč |

**Souběžnost nezvyšuje agregát.** To je nejdůležitější a nejvíc přehlížené
pravidlo u bandwidth-bound zařízení:

- váhy se čtou **jednou za krok** bez ohledu na batch,
- ale MoE routing zvětšuje **unii expertů** napříč tokeny v batchi,
- a KV cache roste s batchí i s kontextem.

Výsledek: agregovaný throughput roste jen mírně (naměřeno např. 70 → ~85–100
při 16 souběžných), **ne** úměrně batchi. Z toho plyne, že strop souběžnosti
daný pamětí (KV cache) není totéž jako počet spokojených uživatelů.

**Příklad: DGX Spark + Qwen3.8-Flash-Next (NVFP4, MTP on)**

| Metrika | Krátký kontext | Dlouhý (>128k) |
|---|---|---|
| **Slot ceiling (KV cache)** | ~16 | ~2–4 |
| **Provozní strop (design point)** | **4** | **2** |
| Single-stream | 70 tok/s | 40 tok/s |
| Agregát při 4 souběžných | ~75–85 [odhad] | ~50–55 [odhad] |
| Na stream při 4 souběžných | ~19–21 tok/s | ~13 tok/s |
| Na stream při plném slot ceiling | 5–6 tok/s | 8–12 tok/s |

**Rozdíl mezi 16 a 4 je záměrná rezerva.** Šestnáct je počet slotů v KV cache;
čtyři je provozní strop, protože:

- **prefill interference** — dlouhý prompt na jednom streamu zvyšuje TTFT
  všem ostatním (batch se recomponuje, chunked prefill),
- **rozptyl kontextu** — jeden 200k request spotřebuje víc slotů, než říká
  jeho počet,
- **tail latence** — o vnímané kvalitě rozhoduje p99, ne průměr,
- **rezerva na failover** — když node vypadne, jeho 4 uživatelé se musí
  vejít jinam.

**Dva režimy, které se chovají opačně:**

| | Krátký kontext | Dlouhý kontext |
|---|---|---|
| Co limituje | propustnost paměti | **kapacita KV cache** |
| Souběžnost | vysoká | nízká |
| Na stream | horší | lepší |
| Plánovací číslo | 70 tok/s | **40 tok/s** |

Takže věta „strop 16 není 16 spokojených uživatelů“ platí **jen pro krátký
kontext**. Na dlouhém je to opačně: node obslouží málo streamů, ale každý
použitelně.

**Důsledek pro router:** musí znát **očekávanou délku kontextu před** volbou
souběžnosti. Jinak pustí 16 dlouhých requestů na node, který jich unese 3,
a všechny se rozpadnou na paměť. To je noisy-neighbour na úrovni paměti,
ne CPU — a nejde vyřešit prioritou, jen oddělením.

**Modelováno pro 50 uživatelů** (špička 25 % současně ≈ 13 concurrent):

```
nodes = ceil(peak_concurrent / operational_slots_per_node) + 1 spare
```

| Režim | Sloty na node | Nodů |
|---|---|---|
| Krátký kontext, smíšená zátěž | 4 | ceil(13/4) + 1 = **5** |
| Dlouhý kontext (>128k) | 2 | ceil(13/2) + 1 = **8** |

**Pravidlo:** dlouhý kontext znamená **téměř dvojnásobek nodů** při stejné
zátěži. Spare node se do kapacity nepočítá — je to rezerva na výpadek,
ne na provoz.

Agentní provoz je navíc burstový, takže oversubskripce 2–3× je realistická —
ale jen s frontou a timeouty. Pro **50 uživatelů** tedy neplatí „jedna krabice“,
ale **pool a router**.

**Doporučení: vyhrazený long-context lane.** Jeden request s 260k kontextem
spotřebuje většinu paměti nodu a vytlačí ostatní z KV cache. Řešení není
vyšší priorita, ale **oddělená třída služby**: long-context requesty jdou
na vyhrazený node (nebo na T2), i když by se „vešly“. V praxi to znamená
dva aliasy (`default` a `default-long`) se stejným modelem, ale jiným
pool a jinými limity.

To je dobře: přesně to nutí postavit abstrakci poolu od začátku, i když pool má
jednoho člena. Abstrakci, kterou nepostavíte dřív, než ji potřebujete,
nikdy nedostanete.

**Pozor na benchmark ≠ produkci.** Naměřených 70 tok/s je single-stream
na čerstvém vLLM bez fronty, bez gatewaye, bez logování a bez souběžné zátěže.
V produkci s middlewarem, auditním logem a frontou počítejte s 10–25 % méně.
Číslo, které má smysl plánovat, je **agregát při očekávané souběžnosti
a očekávané délce kontextu**, ne single-stream maximum.

### 7.6 Fronta, priorita a admission control

**Fronta patří do gatewaye, ne do model serveru.**

Když má každý node vlastní frontu, vzniká **prioritní inverze**: nízkoprioritní
request obsadí slot na nodu B, zatímco vysokoprioritní čeká na nodu A.
Globální prioritu nelze vynutit lokálně — každý node vidí jen svoji frontu.

Správně: gateway drží **jednu frontu**, zná kapacitu každého nodu (volné sloty
podle kontextu) a dispatchuje jen to, co se vejde. Tím zároveň řeší drain:
přestane posílat na node, který se vyprazdňuje.

**Třídy služby a politika [návrh]:**

| Třída | Kdo čeká | Cílový SLO | Politika |
|---|---|---|---|
| **A — interaktivní** | člověk | TTFT < 2 s | rezervované sloty, striktní priorita |
| **B — agentní** | stroj | krok do 5 s | vážená fair queue, per-user limit 1–2 |
| **C — batch** | nikdo | do hodin | preemptivní, běží ve zbytcích |

**Šest pravidel, která se vyplatí mít od začátku:**

1. **Admission control na tokeny, ne na requesty.** Rozhoduje token budget
   (prompt + max_tokens), ne počet požadavků. Jeden 200k prompt = dvacet malých.
2. **max_tokens per třída.** Bez stropu na výstup nelze odhadnout, jak dlouho
   request zabere slot, a plánování přestane fungovat.
3. **Per-user concurrency cap 1–2.** Jinak jeden agent s 20 tool cally
   zablokuje frontu pro člověka, který čeká 3 sekundy.
4. **Aging.** Batch nesmí vyhladovět; po definované době ve frontě se jeho
   priorita zvedá. Bez toho jsou nejnižší třídy trvale mrtvé.
5. **Deadline místo nekonečné fronty.** Agent, který se do 10 s nezačne,
   dostane 429 a retry — lepší než uživatel čekající 40 s v domnění, že to visí.
6. **Fail-fast pro člověka.** Interaktivní request, který nemůže začít do 2 s,
   se má odmítnout s vysvětlením. Tiché zařazení do fronty je horší UI
   než chyba.

**Proč priorita nestačí na dlouhý kontext.** Dlouhý request nejde „odložit
na později“ — buď má slot, nebo nemá. Proto long-context lane (7.5) a priorita
jsou dvě různé věci: priorita řeší **pořadí**, lane řeší **koexistenci**.

**Co měřit:**

| Metrika | Proč |
|---|---|
| TTFT p50 / p95 / p99 per třída | vlastní SLO, ne průměr |
| Doba ve frontě per třída | odhalí vyhladovění |
| Podíl odmítnutých (429) | kapacitní signál, ne chyba |
| Vytížení slotů (obsazené / provozní strop) | > 80 % znamená přidat node |
| Podíl dlouhých requestů | prediktor kapacity |

### 7.7 Co ještě není změřené

Tabulka rozlišuje **změřené** (má být fakt), **odvozené** (vypočtené z fyziky)
a **hypotézy** (čekají na test). Dokud test neproběhne, berte hypotézy jako
pracovní předpoklad, ne jako plán.

**Měřicí plán:**

| # | Co měřit | Jak | Co to rozhodne |
|---|---|---|---|
| 1 | **Kvalita NVFP4** | golden set, NVFP4 vs. FP8 | Pokud kvalita na vašich úlohách padá, je celá kapacitní matematika irelevantní |
| 2 | **KV cache na kontext** | vLLM log `GPU KV cache size`, `--max-model-len 262144` | Skutečný počet slotů pro 128k / 262k; opraví odhad 2–4 |
| 3 | **Batch křivka** | concurrency 1 / 2 / 4 / 8 / 16, agregát i per-stream | Kde je koleno; potvrdí nebo vyvrátí provozní strop 4 |
| 4 | **Prefill interference** | 1× 100k prompt + 3 dekódující streamy, měřit TTFT ostatních | Velikost rezervy nad provozní strop |
| 5 | **MTP acceptance vs. kontext** | vLLM spec-decode metriky na 8k / 64k / 200k | Potvrdí příčinu 70 → 40 tok/s |
| 6 | **Produkční overhead** | gateway + logování + fronta proti čistému vLLM | Reálný propad proti 70 tok/s (odhad 10–25 %) |
| 7 | **Failover** | drain node za provozu, měřit re-queue a TTFT | Kolik rezervy je potřeba na výpadek |
| 8 | **Kalibrace admission control** | 429 rate proti arrival rate | Kde nastavit limity tříd |

**Proč v tomto pořadí:** kvalita jde první. Pokud NVFP4 na vašich úlohách
degraduje výstup, nemá smysl řešit, jestli node unese 4 nebo 5 uživatelů —
stejně tak byste mohli provozovat FP8 na třetinové rychlosti s jinou
kapacitní matematikou. Teprve když je kvalita přijatelná, má cenu měřit
kapacitu.

**Stav tvrzení v tomto dokumentu:**

| Tvrzení | Stav |
|---|---|
| 70 tok/s při krátkém kontextu | **změřené** (NVFP4, MTP on, vLLM) |
| 40 tok/s nad 128k | **změřené** |
| 6B aktivních, 176B celkem, 262k kontext | **fakt** (model card) |
| Roofline 81–86 tok/s | **odvozené** z 273 GB/s a 4,25–4,5 bit/param |
| Slot ceiling ~16 | **změřené pro krátký kontext**, ne univerzální |
| Provozní strop 4 | **hypotéza** — čeká na test 3 a 4 |
| 27 GB volných pro KV cache | **odvozené** z rozpočtu paměti |
| 2–4 sloty nad 128k | **hypotéza** — čeká na test 2 |
| 5 / 8 nodů pro 50 uživatelů | **hypotéza** — závisí na testech 2–4 |
| Podíl dlouhých requestů 2–3× kapacita | **odhad** — závisí na testu 8 |
| Mac 1,2 TB/s, 96–512 GB, 22 299 USD za 512 GB | **fakt** (Apple, říjen 2026) |
| Mac roofline 180–280 tok/s na 6B aktivních | **odvozené** — čeká na měření s MLX |
| 4× Mac 512 GB → 1T model @ 36 tok/s | **změřené Applem**, ne námi; nezávisle neověřeno |
| DGX Station 252 GB HBM / 748 GB, ~95 tis. USD | **fakt** (NVIDIA, OEM ceníky) |
| DGX Station 355 tok/s (Qwen, C1), 2 928 agregát | **změřené** (nezávislé testy) |
| DGX Station offload nad 252 GB → ~396 GB/s | **změřené** (44–46 tok/s na 465GB modelu) |

**Otevřené rozhodnutí: „úsporný vLLM“ vs. plnohodnotný NVIDIA stack.**

Tohle je poslední věc, která láme cenu celého poolu, a v dokumentu zatím
není rozhodnutá:

| | Úsporný (Strix / Gorgon) | Plnohodnotný (NVIDIA) |
|---|---|---|
| Cena za GB paměti | 27–37 USD | 31–40 USD |
| vLLM | ROCm, druhá liga | první liga |
| FP8 KV cache, expert parallel, spec decode | částečně | vše |
| Day-0 podpora nových modelů | většinou | vše |
| Firmware a servis | OEM | NVIDIA + OEM |
| Riziko | chybějící optimalizace | cena |

Rozhodnutí závisí na tom, zda je pro vás „úsporný vLLM“ přijatelný.
Pokud ano, pool je o 20–30 % levnější. Pokud ne, standard znamená NVIDIA
a cena je daná. Tohle je otázka pro test 6 (produkční overhead) a pro
srovnání na konkrétním modelu — ne pro tabulku.

**Pravidlo pro další úpravy dokumentu:** číslo, které projde testem, se
přesune z hypotéz do změřených a dostane datum měření a konfiguraci
(model, kvantizace, kontext, počet streamů). Číslo bez těchto údajů
není výsledek — je to anekdota.

---

## 8. Hybrid s EU API

### 8.1 Není to kompromis, je to jiná architektura

Čistě lokální stack narazí na kvalitu, čistě cloudový na data. Hybrid není
„mezi“ — je to **řízená politika routingu**. Klient stále neví, odkud odpověď
přišla, protože kontrakt zůstává stejný.

### 8.2 Čtyři tiery

| Tier | Kde | Co tam typicky patří | Routing |
|---|---|---|---|
| **T0** | lokálně, malý model (7–30B) | klasifikace, extrakce, routing, embedding, rerank, krátká shrnutí | vždy lokálně — je to i DLP filtr |
| **T1** | lokální pool, 100–200B | interní RAG, kód, dokumenty, agentní smyčky | default pro schválené datové třídy |
| **T2** | EU suverénní API | těžký reasoning, dlouhý kontext, málo časté úlohy s vysokou hodnotou | jen s klasifikací „smí do EU regionu“ |
| **T3** | globální frontier | veřejná data, benchmarky | výjimka, obvykle zakázáno |

**T0 je nejzajímavější řádek.** Malý lokální model, který rozhodne, kam request
patří, je zároveň nejlevnější komponenta a nejúčinnější policy enforcement point.
Když klasifikaci udělá stroj před odesláním, nemusíte spoléhat na to, že uživatel
zaškrtne správné políčko.

### 8.3 DLP musí být na routeru, ne v PDF

Jakmile stejný klient může poslat cokoli, politika „smlouvy neopouští firmu“
přestane platit v okamžiku, kdy někdo vloží úryvek do chatu.

Požadavky:

- klasifikace **per request** (tenant, session, obsah),
- router má právo request odmítnout nebo degradovat na lokální tier,
- klasifikační model běží lokálně a je verzovaný,
- falešně negativní klasifikace je incident, ne anomálie — měřte ji.

### 8.4 Verzní past se obrací

Minule jsme říkali, že on-prem drží verzi modelu, což je pro validaci klíčové.
U API to neplatí — dodavatel model vyřadí a vy nemáte páku.

**Pravidlo: pinujte to, co je kritické, pronajímejte dlouhý chvost.**

| Use case | Kde | Proč |
|---|---|---|
| High-risk, validovaný, auditovaný | lokálně | potřebujete váhy a zmrazenou verzi |
| Vysoký objem, citlivá data | lokálně | cena, rezidence |
| Těžký reasoning, nízká frekvence | T2 (EU API) | kvalita, cena za token je nízká při malém objemu |
| Explorační práce, benchmarky | T2/T3 | riziko je malé, kvalita rozhoduje |

Pozor: to je **opačně**, než se to často dělá („důležité dáme do cloudu, protože
je tam nejlepší model“).

### 8.5 „EU API“ není binární

Checklist před podpisem:

- Kdo je právnická osoba, kdo vlastní, kdo má přístup k infrastruktuře?
- Kde přesně běží inference — a je to smluvně garantované, ne „region preference“?
- Jací sub-procesoři a za jakých podmínek (článek v DPA, ne web)?
- Retence: nulová, nebo „nulová s výjimkou abuse monitoringu“?
- Co se stane při ukončení smlouvy — dostanu logy a evaluační data?
- Je model verzovaně pinovatelný, nebo „latest“ s tichými změnami?

Bez toho je „EU API“ geografická nálepka a v DPIA neprojde.

### 8.6 Fallback a normalizace

Hybrid znamená dva failure domény a dvě cost curves. Gateway musí umět:

| Situace | Reakce |
|---|---|
| Lokální node down | fallback na API — **ale jen po datové kontrole** |
| API down / rate limit | fronta, nebo degradace na lokální tier s oznámením |
| API vrátí jiný formát tool callu | normalizace na jednotný kontrakt |
| API odmítne (refusal) | definovaná politika: eskalace, nebo vysvětlení uživateli |
| API zdraží | routing policy musí být změnitelná bez deploymentu |

**Normalizační kontrakt** je podceňovaná část: jiné modely mají jiný formát
tool callů, jiné limity kontextu, jiné chování při odmítnutí. Bez normalizace
se „vyměnitelnost“ rozpadne na první změně dodavatele.

### 8.7 Rozhodovací posloupnost: kdo rozhoduje o EU API

**Ano — gateway rozhoduje i o tom, zda request půjde do EU API.** Je to
totéž místo, které vybírá lokální node: jeden komponent, dvě úrovně volby
(„kam v poolu“ a „zda vůbec do poolu“). Rozdíl je jen v tom, že druhá volba
je **právní, ne kapacitní** — a proto má pevné pořadí.

**Pořadí je závazné, ne doporučené:**

```
1. Autentizace           → kdo, tenant, třída, kvóta
2. Klasifikace dat       → smí ven? (T0, lokálně)
3. Klasifikace úlohy     → interaktivní / agent / batch
4. Volba tieru           → T1 lokálně | T2 EU API
5. Kapacita              → vejde se? jinak fronta
6. Dispatch              → node nebo API
7. Log rozhodnutí        → důvodový kód
```

**Invariant:** krok 2 nesmí být přepsán krokem 4. Pokud klasifikace řekne
„nesmí ven“, volba tieru na tom nic nemění — request se buď vyřídí lokálně,
nebo čeká, nebo selže. Nikdy neodejde.

**Rozhodovací matice:**

| Datová třída | Úloha | Pool volný | Rozhodnutí |
|---|---|---|---|
| Citlivá (nesmí ven) | jakákoli | ano | lokálně |
| Citlivá | jakákoli | ne | **fronta, nikdy T2** |
| EU-ok | těžký reasoning | — | T2 |
| EU-ok | rutinní | ano | lokálně (levnější) |
| Veřejná | jakákoli | — | T2/T3 povoleno |
| Citlivá | — | — | T3 **zakázáno vždy** |

**Dvě pravidla, která zabraňují nejčastější chybě:**

1. **Žádná tichá eskalace z lokálu do cloudu.** „Lokální model odpověděl
   špatně, zkusme API“ je přesně ten mechanismus, kterým uniknou data.
   Eskalace je **nový request** s vlastní klasifikací, ne retry s stejným
   payloadem.
2. **Výpadek nodu není důvod poslat data ven.** Když lokální pool spadne,
   citlivé requesty čekají nebo selžou. Dostupnost není nadřazená rezidenci —
   a v dokumentaci to musí být napsané, ne domyšlené.

**Důvodový kód u každého rozhodnutí** je jediný způsob, jak doložit, že
politika držela: `local_capacity`, `local_sufficient`, `eu_api_by_policy`,
`eu_api_insufficient_local`, `denied_data_class`, `queued_capacity`.
Bez kódu máte log odpovědí, ale ne log rozhodnutí — a to je přesně ta část,
kterou by úřad chtěl vidět.

**Pozor na terminologii při nákupu.** „EU AI router API“ můžou být dvě různé
věci: (a) **váš** gateway, který routuje, a (b) **produkt** typu LiteLLM
nebo OpenRouter jako služba. Pokud mezi gateway a EU API postavíte cizí
router, máte **dva control plane** a politika se dá obejít tím, že někdo
volá router přímo. Buď router vlastníte, nebo nesmí být v cestě.

---

## 9. Ekonomika

### 9.1 Dvě cost curves

| | Lokálně | API |
|---|---|---|
| Charakter | capex + provoz | opex per token |
| Marginální náklad tokenu | ~0 | reálný |
| Riziko | utilization (nevyužitá krabice) | cena a dostupnost |
| Škálování | skokové (koupit node) | plynulé |
| Ukotvení | high utilization, citlivá data | spiky, dlouhý chvost |

**[odhad]** Krabice za 6 950 USD při vytížení 10 % je dražší než API.
Ekonomika funguje jen při vysokém, trvalém vytížení — což je další důvod,
proč má být node v poolu a ne pod stolem.

### 9.2 Rozhoduje eval, ne kvóta

Nejčastější chyba je routing podle ceny („dokud nedojde kredit, lokálně“)
nebo podle zvyku („vždycky nejlepší model“). Správné pravidlo je
**kvalitativní práh**: posílej dál, jen když lokální model na dané třídě úloh
nestačí.

To se nedá vědět bez **golden setu** — pár stovek reálných úloh s ověřenými
odpověďmi, na kterých měříte, jestli T1 zvládne to, co posíláte do T2.

Je to nudná práce, kterou skoro nikdo nedělá, a přitom je to jediná věc, která
z hybridu dělá řiditelný systém místo hádání. Zároveň je to nejlepší obrana
v rozpočtové diskuzi: „T2 stojí tolik, protože bychom jinak ztratili 8 %
přesnosti na těchto úlohách“ je argument, který obstojí.

### 9.3 Alokace nákladů

Bez per-user identity nemáte ani kvóty, ani showback. Požadavek:

- token per uživatel (OIDC), ne sdílený API klíč,
- log nákladu per request (tier, model, tokeny),
- měsíční report per tým,
- kvóta jako policy, ne jako fakturační překvapení.

### 9.4 Kdy dává lokální node smysl

**Ano, když platí alespoň tři:**

- data nesmí opustit firmu (nebo jen do EU regionu),
- vytížení je trvalé a vysoké,
- latence nebo dostupnost jsou kritické,
- objem tokenů je takový, že API je dražší než odpis hardware,
- potřebujete zmrazenou verzi modelu pro validaci.

**Ne, když platí většina:**

- uživatelů je málo a používají to občas,
- potřebujete nejlepší možný model,
- nemáte kdo by to provozoval,
- data nejsou citlivá.

### 9.5 Škálování a chyba prognózy

**Využití AI se nedá dopředu otestovat.** Závisí na kvalitě modelu (která se
mění), na integraci do workflow (která ještě neexistuje) a na chování
early adopterů (kteří nejsou reprezentativní vzorek). Každá prognóza
poptávky je proto špatná — otázka je jen, jak drahá bude chyba.

**Pool dělá chybu levnou. Fleet ji dělá drahou.**

| Chyba prognózy o 20 uživatelů | Pool | Fleet notebooků |
|---|---|---|
| Hardware | 5 nodů = **30 000** | 20 notebooků = **110 000** |
| Granularita | node obslouží 4 uživatele, sdíleně | zařízení obslouží 1 osobu |
| Reversibilita | node lze přesunout, prodat, použít na batch | notebook je přidělený člověku |
| Kdo nese důsledek | služba | konkrétní zaměstnanec |

**Rozdíl je 3,7× při stejné chybě.** A to je celý argument pro pool:
ne že by byl levnější na jednotku, ale že **špatný odhad se dá opravit**.

#### Čtyři osy škálování

| Osa | Co se mění | Mechanika | Cena za krok |
|---|---|---|---|
| **Scale out** | počet nodů | přidat identický node, router si ho vezme | ~6 000 |
| **Scale up** | třída nodu | 128 → 192 → 252+496 GB | 7 000–95 000 |
| **Scale across** | burst do cloudu | T2 EU API pro špičky | per token |
| **Scale down** | ubrat | node se vypne nebo přesune | 0 |

**Scale out a scale up nejsou totéž a neřeší totéž:**

- **Scale out** řeší **počet uživatelů a souběžnost.** Je lineární, levný
  a vratný. Přidání nodu nezlepší kvalitu ani nezvětší model.
- **Scale up** řeší **velikost modelu a délku kontextu.** Je skokový a drahý.
  Nejde dělat po malých krocích — 128 GB se nedá dokoupit po 16 GB.
- **Scale across** řeší **špičky**, ale jen pro data, která smí do EU regionu.

**Praktické pravidlo: škálujte out pro lidi, up pro modely.** Kdo si plete
tyhle dvě osy, kupuje zbytečně velké nody na málo uživatelů nebo málo nodů
na velký model.

#### Kde má scale out tvrdý strop

Horizontální škálování pro **propustnost** je snadné: přidáte node a router
rozdělí práci. Horizontální škálování pro **větší model** je něco jiného —
vyžaduje tensor parallelism, a ten potřebuje rychlé propojení:

| Platforma | Propojení | TP reálné? |
|---|---|---|
| DGX Spark | 200 Gb/s ConnectX-7 | ano, 2–4 nody |
| Mac Studio | TB5 + RDMA (JACCL) | ano, 4 nody (Apple měřil 1T model) |
| Běžný mini PC | 1–2,5 GbE | **ne** — síť je 100× pomalejší než paměť |

Z toho plyne něco nepříjemného pro „levný pool“: **levné boxy se dají
škálovat na počet uživatelů, ale ne na větší model.** Kdo chce růst
modelem, musí na dražší třídu nebo na propojenou dvojici.

#### Co musí platit, aby pool skutečně škáloval

Elasticita není vlastnost hardwaru, je to vlastnost návrhu. Bez těchto
pěti věcí přidání nodu nepomůže:

1. **Node je bezstavový.** Žádná session, žádná data na lokálním disku,
   které by chyběly po výměně.
2. **Model ID je v registru**, ne v konfiguraci nodu. Nový node naskočí
   se stejnou verzí jako ostatní.
3. **Drain je rutina**, ne incident (11.5).
4. **Router je capacity-aware**, ne round-robin (11.5).
5. **Kvóty a fronta jsou centrální**, jinak nový node jen přidá další
   místo, kde se dá vyhladovět.

Když tohle platí, je přidání nodu práce na hodinu. Když ne, je to projekt.

#### A proč se to netýká notebooků

Notebook nemá ani jednu osu:

- **scale out** = koupit další notebook konkrétnímu člověku,
- **scale up** = vyměnit mu zařízení,
- **scale down** = vzít mu ho,
- **scale across** = neexistuje.

Kapacita je svázaná s osobou, ne s poptávkou. A protože poptávka je
nepředvídatelná, je to nejdražší možné svázání.

**Závěr:** nepotřebujete lepší prognózu. Potřebujete architekturu, kde
je chybná prognóza levná. Pool to je; fleet není. A proto je správné
začít malým poolem s instrumentací a růst podle naměřených dat — ne
rozdělit zařízení podle odhadu.


---

## 10. Trh služeb

### 10.1 Tři modely, které budou koexistovat

| Model | Kdo kupuje | Za co platí | Marže | Kdo to reálně dělá |
|---|---|---|---|---|
| **DIY / samostatná správa** | Organizace s vlastním platform týmem — banky, telco, tech firmy, výzkum | Capex + interní lidé | — | Oni sami; kupují jen governance tooling |
| **Managed appliance („AI MPS“)** | Mid-market, veřejná správa, regulované obory bez MLOps | Měsíční paušál, leasing, per-seat | Tenká, pohlcena OEM financováním | OEM nebo regionální integrátor |
| **Bezpečnostní služba** | CISO, DPO, vedení rizika | Rozšíření existující SOC/DLP/SSE smlouvy | Vysoká, recurrent | MSSP nebo integrátor s bezpečnostní kompetencí |

**[odhad]** Rozložení spendu do roku 2029: bezpečnostní služba 45–55 %,
DIY 25–30 %, managed appliance 20–25 %. DIY je mediálně nejviditelnější,
protože ho dělají firmy, o kterých se píše — ale není to většina trhu.

### 10.2 Kopírovací analogie: kde sedí a kde ne

**Sedí na vrstvě provozu.** Managed print funguje, protože splňuje čtyři podmínky:
zařízení je komodita, výstup je standardizovaný, telemetrie je triviální
a **stránka je jednotka, na které se obě strany shodnou**. Přesně tak se dnes
prodává HPE Private Cloud AI s financováním, Lenovo Hybrid AI Advantage nebo
Dell Managed Services for AI (od Q1 2027): pronájem, remote monitoring,
break/fix, správa updatů.

**Nesedí na vrstvě hodnoty.** Tři důvody:

1. **Token není stránka.** Stránka je kvalitativně invariantní. Token ne —
   kvalita závisí na modelu, kvantizaci, promptu, kontextu, RAG korpusu.
   Per-token fakturace bez definice kvality je nefunkční; per-seat model
   zabije pár těžkých uživatelů.
2. **Krabice není drop-in.** Kopírka dělá jednu věc. AI box sedí uvnitř perimetru,
   sahá na identitu, klasifikaci dat, DLP a logy. Není to tisková flotila,
   je to nová třída endpointu.
3. **Životní cyklus je rychlý a právně relevantní.** Firmware kopírky je stabilní
   roky. Model se mění po měsících a u high-risk systému je změna modelu změna,
   kterou musíte re-validovat.

**A jeden strukturální rozdíl:** u kopírek je zařízení moat (Xerox, Canon,
Ricoh), proto si drží servis. Tady je zařízení GB10 nebo Strix Halo SoC, kterou
si koupíte od šesti OEM za stejnou cenu. **Moat se musí přesunout jinam.**

### 10.3 Bezpečnostní rámování vyhrává

Protože je to jediné rámování, kde zákazník **nemůže porovnávat cenu**.
„Krabice za 6 950 USD“ je srovnatelná nabídka, kterou procurement rozsekne
za týden. „Snížíme riziko úniku dat do AI a udržíme evidenci pro čl. 30 a 35
aktuální“ se porovnává mnohem hůř — a je to **trvalý závazek**, ne jednorázový
prodej.

Druhý důvod je rozpočtová linie:

| Kde to skončí | Jak se prodává | Výsledek |
|---|---|---|
| IT capex | soutěž na cenu krabice | prohrajete |
| Security opex | rozšíření existující smlouvy | vyhrajete |

Trh to už ukazuje: Palo Alto prodává AI Access Security jako součást SSE,
Cisco AI Defense + AI-aware SASE + Zero Trust pro agenty, Field Effect přidává
AI usage monitoring přímo do MDR (podle jejich dat mělo 93 % organizací AI
zavedenou vědomě i nevědomě a 26 % používalo alespoň šest AI aplikací),
Check Point dává MSP multi-tenant AI security, Pax8 Agent Gateway.
BlueVoyant spustil agentní security operations, Cyera získala 600 mil. USD
při valuaci 12 mld. USD.

**A klíčový datový bod pro „router je produkt“:** Stripe koupil OpenRouter
za 7,1 mld. USD. Trh ocenil routing, ne hardware.

### 10.4 Kde je past: odpovědnost

Bezpečnostní rámování má háček. **Přebíráte odpovědnost — ale ne tu, kterou
si myslíte.**

MSSP se nemůže stát *providerem* podle AI Act; to zůstává zákazníkovi.
Reálná hranice smlouvy je proto stejná jako u managed SOC:

> **Vy provozujete infrastrukturu a generujete evidenci.
> Zákazník rozhoduje a nese roli.**

Kdo to v nabídce slije do „jsme za vaši AI compliant“, prodá jednou a podruhé
už ne, protože první incident tu větu vyvrátí.

### 10.5 Co OEM pohltí a co ne

| Vrstva | Kdo to nakonec dělá | Marže |
|---|---|---|
| Hardware, financování, break/fix | OEM (HPE, Dell, Lenovo) | tenká |
| Fleet management, monitoring | OEM + Intune/Tanium/Splunk | tenká |
| Serving layer, úpravy | integrátor / zákazník | střední |
| Routing, identity, kvóty | specializovaný software | střední |
| Compliance evidence, audit | integrátor / MSSP | **vysoká** |
| Vztah a odpovědnost | integrátor / MSSP | **vysoká** |

**Co zůstane nezávislým hráčům:** to, co OEM produktizovat nemůže — konkrétní
data zákazníka, vztah a compliance spis na míru.

### 10.6 Co by predikci změnilo

**[názor]** Kdyby se objevila standardizovaná, přenositelná evidence shody
(něco jako „AI model card + log schéma“ jako průmyslový standard, ne poradenský
výstup), governance by šla produktizovat do softwaru. Marže by spadla a byznys
by se posunul zpět k modelu „krabice + paušál“ — tedy ke kopírce.

Sledujte proto: standardizační aktivity (CEN-CENELEC, ISO/IEC 42001),
aktivity AI Office k harmonizovaným standardům, a to, zda se objeví
„compliance as code“ pro AI Act.

---

## 11. Referenční architektura

### 11.1 Schéma

```
                        ┌─────────────────────────────┐
   Notebooky, minipcy   │  Agent host / aplikace      │
   (libovolný klient)   │  orkestrace, nástroje,      │
                        │  session state, broker      │
                        └──────────────┬──────────────┘
                                       │  OpenAI-kompatibilní API
                                       │  OIDC token per uživatel
                        ┌──────────────▼──────────────┐
                        │        AI GATEWAY           │
                        │  • klasifikace (T0)         │
                        │  • routing policy           │
                        │  • kvóty a fronty           │
                        │  • aliasy modelů            │
                        │  • log rozhodnutí           │
                        │  • normalizace výstupů      │
                        └───┬──────────┬──────────┬───┘
                            │          │          │
                 ┌──────────▼──┐  ┌────▼─────┐  ┌─▼──────────────┐
                 │ Lokální pool│  │ EU API   │  │ Globální API   │
                 │ T0 + T1     │  │ T2       │  │ T3 (výjimka)   │
                 │ 4–10 nodů   │  │ sovereign│  │ veřejná data   │
                 └─────────────┘  └──────────┘  └────────────────┘
                            │
                 ┌──────────▼──────────────────────┐
                 │ Control plane (mimo data path)  │
                 │ registry verzí • evaluace       │
                 │ cost allocation • audit         │
                 └─────────────────────────────────┘
```

### 11.2 Komponenty

| Komponenta | Požadavek | Poznámka |
|---|---|---|
| Gateway | OpenAI-kompatibilní, routing, kvóty | LiteLLM, Kong AI Gateway, Envoy AI Gateway |
| Serving | vLLM (NVIDIA), llama.cpp / vLLM-ROCm (AMD) | verzovaný, s health checky |
| Identita | OIDC/SAML, token per uživatel | ne sdílený API klíč |
| Registry verzí | váhy + kvantizace + template + tokenizer | součást logu každého requestu |
| Evaluace | golden set, regresní běh při změně | braní release |
| Observability | latency, tok/s, fronta, refusal rate, cost | per tier |
| DLP | klasifikace před routingem | lokální model, verzovaný |
| Audit | log rozhodnutí, ne jen odpovědí | retence dle čl. 26 |
| Kontextová politika | limity per tier, vyhrazený long-context lane | jinak jeden 260k request vytlačí ostatní z KV cache |

### 11.3 Co postavit hned, i s jedním nodem

1. **Service endpoint, ne IP.** DNS jméno, retry s backoffem, idempotentní requesty.
2. **Klíč per uživatel**, ne per aplikace.
3. **Aliasy modelů** + záznam skutečné verze do každého logu.
4. **Dvě třídy služby** — interaktivní a batch. Stačí fronta a timeout.
5. **Drain procedura** napsaná dřív, než ji poprvé potřebujete.

Deset řádků, které rozhodnou, jestli je výměna rutina, nebo incident.

### 11.4 Pět testů, jestli je decoupling reálný

1. Vyměním box bez zastavení agenta? (drain + failover)
2. Vím, která verze vah, kvantizace a template běžela u každého logu?
3. Přežije výměna embedding modelu bez přeindexování, nebo mám reindex naplánovaný?
4. Mám session affinity, nebo mi swap rozbije prefix cache?
5. Umí kdokoli kromě autora zjistit, proč model odpověděl jinak než včera?
6. Znám throughput při **128k kontextu**, ne jen na začátku? (70 vs. 40 tok/s)
7. Umím prioritizovat **napříč poolem**, ne jen v rámci jednoho nodu?

> Pokud je odpověď na všech pět ano, máte architekturu.
> Pokud ne, máte oddělené krabice se skrytou vazbou — což je horší než
> přiznané spojení, protože to nikdo neřídí.

### 11.5 Gateway a load balancing

#### Model: node není server, node je rozpočet

**Rozsah tohoto oddílu:** jen volba **v rámci poolu**. Rozhodnutí, zda request
půjde do EU API, má vlastní, závazné pořadí — viz 8.7. Obě volby dělá tentýž
gateway, ale druhá je právní, ne kapacitní.

Nejužitečnější mentální model: **každý node je rozpočet KV tokenů a gateway
je účetní.** Node nedeklaruje „kolik zvládne požadavků“ — deklaruje, kolik
kontextových tokenů ještě udrží v KV cache. Gateway o každém requestu ví,
kolik tokenů zabere, a odečítá.

To je celý rozdíl proti klasickému load balanceru. Ten počítá spojení;
tenhle počítá **paměť, kterou request zablokuje na celou dobu svého běhu**.
Request s 200k kontextem není „jeden požadavek“ — je to dvacet malých.

Konkrétně:

```
kapacita_nodu   = volné KV tokeny (z vLLM metrik, v tokenech)
cena_requestu   = prompt_tokens + min(max_tokens, zbývající_kvóta)
volno           = kapacita_nodu − Σ rezervací běžících requestů
```

Dispatch je možný, jen když `volno ≥ cena_requestu`. Rezervace se uvolní
až po dokončení streamu — ne po odeslání posledního tokenu, ale po uzavření
spojení.

#### Život requestu, krok za krokem

1. **Autentizace.** OIDC token → uživatel, tenant, třída (A/B/C), kvóta.
   Bez per-user identity nemá smysl nic dalšího.
2. **Tokenizace.** Prompt se přepočítá na tokeny. 100k znaků ≈ 10–50 ms CPU.
   Klientskému číslu se nevěří — podhodnocený count je způsob, jak obejít kvótu.
3. **Cena.** `prompt + max_tokens`, tedy nejhorší případ. Ne odhad výstupu:
   odhad se dá obejít tím, že model „omylem“ generuje dlouho.
4. **Kvóta.** Per-user tokeny/min a max souběžných streamů (1–2). Tohle
   zastaví jednoho agenta s dvaceti tool cally, aby zablokoval frontu.
5. **Příliš velký request.** Pokud `cena > kapacita kteréhokoli nodu`,
   request se **odmítne hned** (413/422), nezařadí se do fronty. Fronta,
   která nikdy nedojde, je horší než chyba.
6. **Rezervace a výběr nodu.** Viz níže.
7. **Dispatch.** Request jde na node s deadline. Node může odmítnout, pokud
   se kapacita mezitím změnila — pak jeden retry, potom chyba.
8. **Stream.** Gateway drží spojení otevřené minuty a propouští SSE.
   Proto je „počet spojení“ roven „počet souběžných streamů“, ne RPS.
9. **Uvolnění.** Rezervace se vrátí, log dokončení se zapíše, metriky
   se aktualizují.

#### Výběr nodu: proč round-robin nefunguje

Čtyři kandidátní strategie a co dělají špatně:

| Strategie | Co ignoruje | Důsledek |
|---|---|---|
| Round-robin | kontext i volnou KV cache | pošle 200k request na node, který má 20k volných |
| Least connections | velikost requestu | tři malé requesty vypadají stejně jako jeden obří |
| Consistent hashing | kapacitu | perfektní prefix cache, ale node se přeplní |
| **Capacity-aware** | nic z toho | správně, ale samo o sobě rozbíjí afinitu |

**Doporučený vzor: capacity-aware + power of two choices + affinita.**

1. Pokud má session preferovaný node (kde leží její prefix cache) **a ten má
   místo**, jdi tam. Affinita má přednost, protože recyklace prefix cache
   ušetří prefill — a prefill je dražší než síťový hop.
2. Jinak vyber **dva náhodné nody** a pošli na ten s větším `volno`.
   Není potřeba znát všechny: dva stačí, protože pravděpodobnost, že vybereš
   plný node, klesá kvadraticky.
3. Affinita **vyprší** po definované nečinnosti (např. 5–15 min). Držet ji
   věčně znamená, že se session přilepí k nodu, který je zrovna plný.

#### Fronta: backfilling je nutný

Naivní prioritní fronta má chybu, která se projeví hned první den: **velký
request na čele blokuje všechny za sebou.** Pokud první v řadě chce 200k
kontextu a žádný node ho teď neunese, malé requesty za ním čekají zbytečně.

Řešení je **backfilling**: gateway prochází frontu a dispatchuje první
request, který se do volné kapacity vejde, i když není první v pořadí.

```
fronta (priorita, čas):
  A1  200k  ← nevejde se
  A2   8k   ← vejde se → dispatch
  B1  40k   ← vejde se → dispatch
  A3  120k  ← nevejde se
```

Bez backfillu stojí celá fronta na A1. S ním se propustnost zvýší řádově
a velký request se dostane, až se uvolní místo.

**Aging:** request, který ve frontě čeká déle než X sekund, si zvedne
prioritu. Bez toho batch navždy vyhladoví.
**Deadline:** request, který se do Y sekund nezačne, dostane 429 s `Retry-After`.
Agent to zvládne; člověk aspoň ví, že to není rozbité.

#### Affinita versus kapacita: konflikt, který se nedá vyřešit, jen řídit

Prefix cache je vázaná na konkrétní node. Kapacita je také vázaná na konkrétní
node. Když se obě omezení střetnou, musíte rozhodnout, co je dražší:

- **Ztráta prefix cache** = znovu se prefilluje celý prompt. U 100k kontextu
  to je sekundy.
- **Ztráta kapacity** = request čeká ve frontě. Také sekundy, ale pro všechny.

Praktické pravidlo: **drž afinitu, dokud je node pod 80 % provozního stropu;
nad ním ji obětuj.** Prefix cache je optimalizace, kapacita je dostupnost.

#### Co musí přežít výpadek gatewaye

| Stav | Kde | Proč |
|---|---|---|
| Rezervace kapacity | Redis/Valkey **až od fáze 3** | jinak dva gatewaye pustí dvojnásobek |
| Fronta | Redis (volitelně) | jinak se při failoveru ztratí |
| Kvóty a spotřeba | Redis (od fáze 3) | musí být společné pro oba gatewaye |
| Prefix-cache affinita | in-memory | ztráta je přijatelná, jen to zpomalí |
| Logy | disk → NAS | durability, retence 6 měsíců |

**Do fáze 3 držte stav v paměti jednoho gatewaye.** Sdílený store je
komplexita, která se vyplatí až ve chvíli, kdy existuje druhý gateway.

Fronta v paměti je přijatelná varianta, **pokud** jsou requesty idempotentní
a deadline krátké. U agenta ano. U člověka, který čeká 30 s, ne.

#### Poruchy, scénář po scénáři

| Co selže | Co se stane | Co musí fungovat |
|---|---|---|
| Node | in-flight requesty padnou, node se vyřadí z poolu | klient retryuje, rezervace se uvolní |
| Node zpomalí (throttling) | roste latence, ne chyby | health check na p95, ne jen na 200 OK |
| Gateway | VIP přejde na druhý | rezervace a kvóty v Redis |
| Síť mezi gatewayem a nodem | dispatch timeout | krátký timeout, ne 60 s |
| Oba gatewaye (split brain) | dvojí admission, overcommit | lease v Redis, nebo tolerance |

**Health check musí být na kapacitu, ne na život.** Node, který odpovídá
200 OK, ale má plnou KV cache, je pro routing mrtvý. Kontrolujte
`volno ≥ minimum` a p95 latenci, ne jen TCP port.

#### Kdy duplikovat a kdy jen obnovit

**Duplikace nemá smysl dřív, než pool přežije ztrátu nodu.** Když máte
jeden inference node, HA gateway vám dostupnost nedá — node je jediný bod
selhání a gateway je při jeho výpadku stejně k ničemu. Duplikovat vrstvu,
která není tou poslední, je práce bez efektu.

Zásada: **duplikuj tu vrstvu, která zůstane jediným SPOF po odstranění
těch ostatních.** Ne dřív.

| Fáze | Nody | Gateway | Dominantní výpadek | Co řešit |
|---|---|---|---|---|
| **1** | 1 | 1, obnovitelný do 5 min | **reload modelu** (minuty) | config jako kód, image, lokální cache vah |
| **2** | 2–4 | 1 + studená záloha | node | záložní node, warm standby |
| **3** | 5+ | 2× aktivní/standby + Redis | **gateway** | VRRP, sdílený stav, split-brain |

**Co je při malém počtu nodů opravdu drahé: reload modelu, ne gateway.**
Restart gatewaye jsou sekundy. Načtení 100 GB vah z disku jsou minuty
až desítky minut — a to je skutečný outage, který uživatele bolí. Kdo
v malém poolu řeší HA gatewaye a nemá lokální cache vah, optimalizuje
špatnou věc.

**Levý mezistupeň, který se vyplatí hned: obnovitelnost místo redundance.**

- konfigurace v Gitu, ne na disku,
- gateway jako kontejner nebo jednoduchý balíček,
- jeden příkaz na obnovu, otestovaný,
- logy od prvního requestu mimo hostitele.

To nestojí nic a zkracuje výpadek z hodin na minuty. Redundance pak
počká na chvíli, kdy pool unese ztrátu nodu.

**Kdy je čas na druhou krabici — tři konkrétní spouštěče:**

1. **Pool má ≥ 3 nody** a ztráta jednoho neznamená výpadek. Od té chvíle
   je gateway poslední SPOF.
2. **Fronta přežívá přes noc.** Agentní batch, který běží hodiny, nesmí
   přijít o frontu restartem. To už není „pár uživatelů zkusí znovu“.
3. **Náklady na hodinový výpadek převýší cenu krabice za 400 USD.**
   U interního nástroje pro čtyři lidi to nenastane. U procesu, který drží
   provoz, ano.

**Do té doby:** jeden gateway, ale navržený tak, aby se dal nahradit.
To je jiná disciplína než HA a je řádově levnější.

#### Velikost gatewaye

| Parametr | Hodnota | Poznámka |
|---|---|---|
| CPU | 4–8 jader | tokenizace, ne proxy |
| RAM | 8–16 GB | fronta + kvóty + cache |
| Disk | 64–256 GB | logy na NAS, ne na lokál |
| Síť | 1–2,5 GbE | data jsou malá |
| Software | Debian + gateway + (Redis/Valkey až ve fázi 3) | |
| Cena | 150–400 USD | nebo 1 VM na stávajícím clusteru |

**Přenos dat je zanedbatelný:** 1 000 tok/s × ~4 B = 4 kB/s, 100k prompt
≈ 400 kB. Gateway neprotlačuje váhy, jen tokeny. Proto je 1 GbE dost
a 4 jádra stačí.

#### Co nedělat

- **Gateway na inference nodu.** Vrací prioritní inverzi a drain bere
  control plane s sebou. Výjimka je jen vyhrazený kontrolní node.
- **Hardwarový LB, který nerozumí tokenům.** Rozhoduje podle spojení
  a zničí kapacitní plán.
- **Round-robin „protože to stačí“.** Stačí do prvního dlouhého kontextu.
- **HA gatewaye dřív než HA poolu.** Duplikujete vrstvu, která není
  poslední SPOF.
- **Jeden gateway bez možnosti obnovy.** To není „malé a jednoduché“,
  to je neopravitelné.

#### Kdy Kubernetes a kdy ne

Do osmi nodů je Kubernetes víc práce než užitku: vlastní control plane,
jeho upgrady, a stejně potřebujete modelový gateway. Pokud ale firma už
Kubernetes provozuje, je rozumné zůstat tam — **Gateway API Inference
Extension** (InferencePool, endpoint picker) řeší přesně tuhle úlohu:
výběr endpointu podle KV cache a afinity prefixu. Pak je gatewaye méně
vlastního kódu a víc standardu.

### 11.6 Napájení, výpadek a obnova

#### Skutečný outage není gateway, je to reload modelu

Celá tato sekce vychází z jednoho čísla, které je potřeba změřit jako první:
**jak dlouho trvá, než je node po startu schopen obsloužit první request.**

| Fáze startu | Co se děje | Typický čas |
|---|---|---|
| Boot OS | | 30–60 s |
| Start služby | kontejner, ovladače | 10–30 s |
| **Načtení vah** | 100 GB z NVMe | **2–10 min** |
| CUDA graph capture | vLLM kompilace | 1–5 min |
| První request | alokace KV cache | sekundy |

Součet je **RTO celého řešení** a je řádově delší než cokoli, co řeší
gateway. Proto má smysl investovat do napájení dřív než do HA: UPS,
která vydrží 10 minut, promění šestiminutový výpadek na nulový — a ušetří
přesně ten reload, který je nejdražší.

#### UPS: co kupovat

Tři věci, které rozhodují, a jedna, která se vyplatí:

1. **Čistá sinusoida (pure sine wave).** Aktivní PFC zdroje v těchto
   strojích na modifikovanou sinusoidu reagují vypnutím nebo bzučením.
   Nešetřete tady.
2. **Komunikace (USB nebo sériový port) + NUT.** UPS bez signalizace
   je jen prodlužovací kabel s baterií — nedozvíte se, že běžíte na baterii,
   a nedojde k řízenému vypnutí.
3. **Reálný výkon ve wattech, ne VA.** Levné UPS udávají VA při účiníku
   0,6–0,7. Pro tyhle zdroje počítejte `W ≈ VA × 0,6`.

**Dimenzování:**

```
potřebná Wh ≈ výkon_zátěže_W × požadované_minuty / 60 / 0,85
doba_běhu_min ≈ Wh_baterie × 0,85 / výkon_zátěže_W × 60
```

| Sestava | Příkon | UPS pro 10 min |
|---|---|---|
| 1× DGX Spark + gateway + switch | ~400 W | 1 000 VA |
| 4× DGX Spark | ~1 200 W | 2 200 VA |
| 1× DGX Station | 1 600 W | 3 000 VA, 200 V okruh |

**Pozor u DGX Station:** 1,6 kW není UPS, to je elektroinstalace.
Vyžaduje samostatný okruh, ideálně 200 V, a chlazení. Kdo to plánuje
do kanceláře, plánuje rekonstrukci.

#### Řízené vypnutí: pořadí je důležité

Při přechodu na baterii se nespouští „vypni všechno“, ale sekvence:

1. **Gateway přestane přijímat** nové requesty (503 s `Retry-After`).
   Fronta se zahodí nebo uloží — rozhodnutí z 11.5.
2. **Nody dokončí in-flight** requesty, max 60 s. Pak `nvidia-smi` ukáže
   klid a je bezpečné vypnout.
3. **Zápis logů a metrik** — flush, ideálně už průběžně mimo box.
4. **Shutdown nodů**, potom **gatewaye** (aby mohl zaznamenat, co se stalo).
5. **UPS se vypne** podle nastavení (většina to umí po vybití).

Bez řízeného vypnutí hrozí: nedojevené logy, poškozený vLLM/Triton
compile cache, a v horším případě filesystem. Ne proto, že by AI byla
křehká, ale protože 100 GB zápisů během reloadu nemá rád tvrdý reset.

#### Studený start: brány, ne naděje

Po obnovení napájení se **nestartuje všechno naráz.** Důvody jsou dva:
inrush proud (může shodit UPS nebo jistič) a thundering herd na disk.

**Pořadí:**

```
1. Síť, switch
2. Nody — po 30–60 s, ne paralelně
3. Brána 1: health endpoint 200
4. Brána 2: model naložený (/v1/models odpovídá očekávané verzi)
5. Brána 3: warm-up request, TTFT < 2 s
6. Brána 4: 30 s stabilního zdraví
7. Gateway začne přijímat
```

**Váhy na lokální NVMe, ne na síťovém NAS.** Čtyři nody, které po výpadku
současně tahají 100 GB z jednoho NAS, vytvoří recovery storm, který
výpadek prodlouží na dvojnásobek. Model cache patří na lokální disk;
NAS je pro logy a archiv.

**Warm-up není kosmetika.** První request po startu platí za alokaci
KV cache a někdy za dobu kompilace. Bez warm-upu dostane první uživatel
TTFT v desítkách sekund a bude si myslet, že je to rozbité.

#### Co se po tvrdém vypnutí rozbije

| Co | Příznak | Oprava |
|---|---|---|
| vLLM / Triton compile cache | pád při startu, podivné chyby kernelů | smazat `~/.cache/vllm`, `~/.cache/triton` |
| Nedopsané logy | mezera v evidenci | streamovat logy mimo box (syslog/OTLP) |
| Redis AOF (od fáze 3) | nekonzistentní fronta | `redis-check-aof`, nebo zahodit frontu |
| Soubory modelů | vzácně poškozené | checksum při startu, re-download |
| Filesystem | read-only remount | fsck při bootu, nepoužívat `noauto` |

**Compliance vazba:** pokud jsou logy evidenci pro čl. 26, výpadek je
nesmí ztratit. To znamená logy **průběžně odesílat mimo hostitele**
(ne jen zapisovat na lokální disk) — jinak při výpadku napájení zmizí
přesně ta část, kterou by úřad chtěl vidět. Tohle je spojení mezi DR
a AI Act, které se v plánech obnovy běžně vynechává.

#### RTO a RPO: co měřit a co slíbit

| Parametr | Význam | Realistická hodnota |
|---|---|---|
| **RTO** | za jak dlouho je služba použitelná | 5–15 min (dominuje reload modelu) |
| **RPO — logy** | kolik evidence můžeme ztratit | **0** (stream mimo box) |
| **RPO — fronta** | kolik requestů zmizí | přijatelné, klienti retryují |
| **RTO — gateway** | | sekundy až minuty |
| **MTTR** | střední doba opravy | měřit, ne hádat |

**RTO se nedá slíbit, dokud se nezměří.** Proto je cold start drill
povinná součást, ne bonus.

#### Testovací drill

Jednou za kvartál, mimo pracovní dobu:

- [ ] Vytáhnout napájení ze zdi (ne jen vypnout UPS)
- [ ] Změřit, kdy UPS přešla na baterii a kdy přišel signál
- [ ] Zkontrolovat, že gateway přestal přijímat do 5 s
- [ ] Zkontrolovat, že nody dokončily in-flight do 60 s
- [ ] Po startu změřit čas do prvního úspěšného requestu (= RTO)
- [ ] Ověřit, že logy za období výpadku existují a jsou čitelné
- [ ] Zapsat výsledek do dokumentace s datem

**Bez drillu je plán obnovy hypotéza.** A v den skutečného výpadku
zjistíte, že UPS nekomunikuje, protože ji nikdo netestoval od instalace.

### 11.7 Infrastruktura jako kód: obnova z čistého stavu

Princip, který zastřešuje 11.5 a 11.6: **infrastruktura je popsána
deklarativně, nasazuje se nahrazením, nikdy se neopravuje na místě,
a obnova z čistého stavu je rutina — ne krizový scénář.**

Čtyři vlastnosti, které z toho plynou:

| Vlastnost | Co znamená | Co nahrazuje |
|---|---|---|
| **Immutable** | Node se nikdy nepatchuje za provozu; vymění se za nový | „Zlatý“ server, který nikdo nechce restartovat |
| **Declarative** | Stav je v manifestu, ne v hlavách | Runbook ve Wordu |
| **Replace, not patch** | Změna = nový manifest, ne zásah do běžícího | Ruční konfigurace, která se nikdy nedostane do Gitu |
| **Tested recovery** | RTO/RPO změřené drillingem, ne odhadnuté | DR plán, který leží v šuplíku |

**Pro AI je tenhle princip cennější než pro běžný web**, protože:
konfigurace se rozjíždí tiše (kvantizace, template, příznaky serveru),
modely se mění často, a váhy jsou dodavatelský řetězec, který může být
kompromitován. Immutable redeploy z registry s kontrolními součty je
jediná obrana, která je zároveň rychlá.

#### Co je artefakt u AI nodu

| Artefakt | Proč musí být verzovaný |
|---|---|
| OS image | ovladače, firmware, jádro |
| Runtime (vLLM/llama.cpp) | verze mění chování a výkon |
| **Digest vah** (SHA-256) | jiná kvantizace = jiný model |
| Chat template | špatný template tiše degraduje výstup |
| Server flags | `max-num-seqs`, `kv-cache-dtype`, MTP — vše mění výsledek |
| Konfigurační hash | důkaz, že node běží to, co má |
| Gateway policy | routing, kvóty, klasifikace |

Manifest je pak něco jako:

```yaml
node_class: t1-spark
os: dgx-os-7.2
runtime: vllm-0.31.0
model: qwen3.8-flash-next-nvfp4
weights_sha256: "3f9a…"
template: qwen3-coder
flags:
  max_model_len: 262144
  max_num_seqs: 16
  kv_cache_dtype: fp8
  speculative: mtp3
gateway_policy: default-v4
```

**Deploy = nahrazení podle manifestu. Rollback = předchozí manifest.
Drain = součást manifestu, ne ruční zásah.**

#### Tři tření, která webová IaC nezná

1. **Váhy jsou stav, ne artefakt.** 100 GB se nedá „rychle rebuildnout“
   z Dockerfile. Proto registry s digesty, lokální cache a možnost
   ověřit checksum při bootu — jinak „čistý stav“ znamená tři hodiny
   stahování.
2. **Hardwarová přenositelnost není numerická přenositelnost.** Tentýž model
   na CUDA, ROCm a MLX dává jiné výstupy. Přesun na jiný hardware je
   **nová validace**, ne `kubectl apply`. Přenositelnost je reálná
   na úrovni routingu, slabá na úrovni čísel.
3. **Evidence není IaC.** Manifest popíše, co má běžet — ne co skutečně
   běželo. Logy rozhodnutí (8.7) a verzí musí žít mimo manifest
   a přežít jeho výměnu.

#### Disaster recovery: tři úrovně, tři ceny

| Úroveň | Co je připravené | RTO | Cena |
|---|---|---|---|
| **Cold** | manifest + registry + smlouva na kapacitu | hodiny | nízká |
| **Warm** | záložní hardware, vypnutý, image připravený | 15–60 min | střední |
| **Hot** | běžící replika | sekundy–minuty | vysoká |

**Pro inferenci je cold úroveň legitimní.** Data jsou z velké části
bezstavová, RTO dominuje reload modelu (11.6), a ten je stejně dlouhý
na obou lokalitách. Co musí být připravené předem, je **manifest,
registry a ověřená cesta, jak dostat kapacitu** — ne teplá replika.

**Pozor na jednu past:** „přesuneme se do cloudu“ není DR plán, pokud
tam ten model neběžel a nebyl validovaný. Během incidentu se image
nestaví.

#### Co to nenahrazuje

- **Patchování.** Záchranná síť není prevence. Immutable redeploy znamená,
  že patch je nový manifest — ne že se patchovat nemusí.
- **Monitoring.** Rychlá obnova je k ničemu, když se o výpadku dozvíte
  od uživatelů.
- **Lidské rozhodnutí.** Manifest nepozná, že dneska nemá smysl obnovovat
  do primární lokality.
- **Cenu.** Čistý stav je levný na práci a drahý na hardware, pokud
  ho chcete teplý.

**A jedna věta, která to shrnuje:** infrastruktura v oddělené lokalitě
nenahrazuje patchování — je to záchranná síť. Dovoluje týmu pracovat
dál s vědomím, že provoz je krytý.

---

## 12. Zaváděcí plán

### Fáze 0 — do 1 měsíce: rozhodnutí a inventář

- [ ] Inventář AI systémů a use case (i stínových)
- [ ] Mapování rolí: provider / deployer / GPAI
- [ ] Rozdělení dat do tří tříd (nikdy neopustí / EU region / globálně)
- [ ] Rozhodnutí, zda vůbec on-prem (viz 9.4)

### Fáze 1 — 1–3 měsíce: pilot

- [ ] Jeden node, jedna třída služeb, jeden use case
- [ ] Gateway s per-user identitou a kvótami
- [ ] Globální fronta s alespoň dvěma třídami (interaktivní / batch)
- [ ] Golden set (100–300 úloh) a baseline
- [ ] Instrumentace použití: tokeny per uživatel, délka kontextu, denní objem
  (to je vstup pro 9.5 — bez něj se pool dimenzuje odhadem)
- [ ] Log verzí modelu od prvního requestu- [ ] Drain test — vypnout node v pracovní době
- [ ] Měření throughputu na třech délkách kontextu (8k / 64k / 200k)

### Fáze 2 — 3–6 měsíců: provoz

- [ ] Druhý node nebo EU API jako fallback
- [ ] Routing policy se dvěma tiery (T1 lokálně, T2 pro vybrané)
- [ ] Long-context lane a limity kontextu per tier
- [ ] DLP klasifikace před routingem
- [ ] Cost allocation per tým
- [ ] Transparentnost čl. 50 (chatbot, označení obsahu) do 2. 12. 2026

### Fáze 3 — 6–12 měsíců: governance

- [ ] Evidence pack (sekce 13) průběžně udržovaný
- [ ] Regresní evaluace jako release gate
- [ ] Smluvní revize: změna modelu, exit, váhy, sub-procesoři
- [ ] Scénář výpadku API i nodu, otestovaný
- [ ] UPS + řízené vypnutí (11.6), otestované vytažením ze zdi
- [ ] Cold start drill: změřené RTO do prvního requestu
- [ ] Rozhodnutí o managed službě vs. DIY pro další roky

### Fáze 4 — do 2. 12. 2027

- [ ] Klasifikace, zda některý systém je high-risk
- [ ] Pokud ano: Annex IV dokumentace, lidský dohled, FRIA (je-li relevantní)
- [ ] Interní audit proti harmonizovaným standardům (pokud existují)
- [ ] Plán reakce na dozorový orgán

**Poznámka k načasování:** harmonizované standardy budou v prosinci 2027
pravděpodobně stále neúplné. Kdo má dokumentaci hotovou, projde. Kdo začne
v listopadu 2027, bude mít drahý problém.

---

## 13. Compliance evidence pack

Minimální sada, kterou by firma měla mít průběžně, bez ohledu na to, zda
dnes spadá do high-risk:

| Dokument | Proč | Kdo vlastní |
|---|---|---|
| Inventář AI systémů | Základ všeho; první dotaz úřadu | AI lead / DPO |
| Mapa rolí (provider/deployer) | Určuje rozsah povinností | Právní |
| Karta každého modelu (verze, kvantizace, template, původ vah) | Reprodukovatelnost, incidenty | Platform |
| Výsledky evaluací a golden set | Důkaz přiměřenosti | Platform / QA |
| Log rozhodnutí routeru | Důkaz, že datová politika držela | Platform |
| Procedura lidského dohledu | Čl. 26 | Provoz |
| Záznam o transparentnosti (čl. 50) | Vymahatelné od 2. 8. 2026 | Produkt |
| DPIA pro citlivé use case | GDPR čl. 35 | DPO |
| Seznam sub-procesorů a DPA | Kapitola V GDPR | Právní |
| Smluvní doložky: změna modelu, exit, váhy | Kontinuita a exit | Právní |
| Školení a AI literacy | Čl. 4 (zjednodušeno omnibusem, ale trvá) | HR / AI lead |
| Incidentní runbook pro AI | Reakce, hlášení | Security |

**Test kvality evidence:** představte si, že za tři roky odejde celý tým
a přijde nový. Pozná z dokumentace, který model běžel, proč, s jakými daty
a kdo rozhodl? Pokud ne, evidence neexistuje — jen se o ní mluví.

---

## 14. Rizika a protiargumenty

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|---|---|---|---|
| Hardware commoditizuje rychleji, než se investice vrátí | Střední | Střední | Kupovat jako node, ne platformu; leasing |
| Model se zlepší natolik, že lokální tier ztratí smysl | Střední | Střední | Routing policy měnitelná bez deploymentu |
| DRAM ceny zdraží segment | Vysoká | Nízký–střední | Neuzavírat cenu na rok dopředu |
| EU API zdraží nebo omezí přístup | Střední | Vysoký | Dva dodavatelé, lokální fallback |
| Regulace se změní (další odklad / zpřísnění) | Střední | Střední | Evidence průběžně, ne projektově |
| Klasifikace dat selže (false negative) | Vysoká | Vysoký | Měřit, testovat, human-in-the-loop pro T2 |
| Benchmark ≠ produkce (single-stream vs. agregát) | Vysoká | Střední | Plánovat podle agregátu při očekávané souběžnosti, měřit s middlewarem |
| Long-context request monopolizuje node | Vysoká | Vysoký | Vyhrazený long-context lane, limity kontextu per tier |
| Heterogenní pool (Mac + PC) rozbíjí identitu modelu | Střední | Vysoký | Oddělené pooly, jiná model ID, žádné cross-pool load-balancování |
| Tvrdý výpadek napájení poškodí cache nebo logy | Střední | Vysoký | UPS + řízené vypnutí, logy streamované mimo box |
| Model reload po výpadku prodlouží RTO | Vysoká | Střední | Lokální NVMe cache, warm-up, změřený RTO |
| Model se v produkci chová jinak než v benchmarku (jiná kvantizace, template, MTP off) | Vysoká | Střední | Verzovat váhy + kvantizaci + template + příznaky serveru |
| Fleet notebooků bez registru verzí (nevíte, co kde běží) | Vysoká | Vysoký | Registry + telemetrie agenta **před** škálováním nad 10 zařízení |
| Agent host na nespravovaném zařízení | Vysoká | Vysoký | Broker, krátkodobé tokeny, fleet management |
| Vendor lock na integrovaný stack | Střední | Střední | Volba hardwaru podle architektury (6.5) |

**Tři nejsilnější protiargumenty proti celé tezi:**

1. **„Modely se zmenšují.“** Pokud bude za dva roky 30B model stačit na 95 %
   úloh a poběží na notebooku, celá kategorie krabic se zmenší na okraj.
   *Odpověď:* to je argument pro tenkou vrstvu a control plane, ne proti nim —
   ale je to reálné riziko pro byznys postavený na prodeji hardware.
2. **„Hyperscale zlevní a vyřeší suverenitu.“** Pokud EU regiony budou levné,
   dostupné a s čistými DPA, lokální inference ztratí hlavní argument.
   *Odpověď:* částečně pravda; proto se hodnota přesouvá do evidence a routingu,
   ne do provozu železa.
3. **„Nikdo to nebude spravovat, protože to nikdo neumí.“** Nedostatek
   kompetencí je reálný a brzdí adopci víc než cena.
   *Odpověď:* to je právě ten byznys — ale je to služba s lidmi, ne produkt
   s marží 80 %.

---

## 15. Slovník

| Pojem | Význam |
|---|---|
| **GPAI** | General-Purpose AI model — model s obecným určením (LLM a pod.) |
| **Deployer** | Ten, kdo AI systém používá pro svůj provoz (čl. 26) |
| **Provider** | Ten, kdo systém uvádí na trh nebo podstatně modifikuje (čl. 25) |
| **FRIA** | Fundamental Rights Impact Assessment (čl. 27) |
| **DPIA** | Data Protection Impact Assessment (GDPR čl. 35) |
| **High-risk** | Kategorie dle Annex I / Annex III; od 12/2027 a 8/2028 |
| **Tier** | Vrstva routing policy (T0–T3) v tomto dokumentu |
| **Node** | Jeden inference stroj v poolu |
| **Drain** | Řízené vyprázdnění nodu před výměnou |
| **Prefix cache** | Reuse KV cache pro sdílený začátek promptu |
| **Quantization** | Zmenšení vah (Q4, Q8…) — mění chování modelu |
| **Chat template** | Formát konverzace; špatný template tiše degraduje výstup |
| **Alias modelu** | Logické jméno (`default`, `fast`) mapované na konkrétní verzi |
| **Aktivní parametry** | Kolik parametrů model skutečně čte na jeden token (u MoE zlomek celku) |
| **Roofline** | Teoretický strop tok/s = propustnost paměti / bajty na token |
| **MTP** | Multi-Token Prediction — spekulativní dekódování, +1,5–2× tok/s |
| **GDN** | Gated DeltaNet, lineární attention; drží malou KV cache |
| **KV cache** | Paměť konverzace; určuje strop souběžnosti, roste s kontextem |
| **Golden set** | Sada úloh s ověřenými odpověďmi pro měření kvality |
| **Slot ceiling** | Technický strop souběžnosti daný KV cache (např. 16) |
| **Provozní strop** | Kolik souběžných uživatelů reálně pustíte (např. 4) |
| **Admission control** | Rozhodnutí, zda request vůbec přijmout, podle volné kapacity |
| **Aging** | Zvyšování priority requestu, který dlouho čeká ve frontě |
| **Prioritní inverze** | Nízkoprioritní práce blokuje vysokoprioritní kvůli lokální frontě |
| **RTO** | Recovery Time Objective — za jak dlouho je služba použitelná |
| **RPO** | Recovery Point Objective — kolik dat můžeme ztratit |
| **NUT** | Network UPS Tools — komunikace s UPS a řízené vypnutí |
| **Cold start** | Start po úplném výpadku, včetně načtení vah |
| **Warm-up** | První umělý request, který inicializuje KV cache a kompilaci |
| **MSSP** | Managed Security Service Provider |
| **MPS** | Managed Print Services — referenční model v sekci 10.2 |

---

## 16. Zdroje

### Regulace

- Regulation (EU) 2024/1689 (AI Act) — EUR-Lex, CELEX 32023R1230
- Regulation (EU) 2026/1744 (Digital Omnibus on AI) — OJ L, 24. 7. 2026
- European Commission: *AI Omnibus enters into force*, 27. 7. 2026
- European Commission: *AI Act — Shaping Europe's digital future* (aktualizace 31. 7. 2026)
- AI Act Service Desk: FAQ, governance & enforcement, GPAI
- Commission Implementing Regulation (EU) 2026/1755 — procedurální pravidla GPAI
- European Parliament: Legislative Train — Digital Omnibus on AI
- White & Case: *EU AI Omnibus enters into force*, 4. 8. 2026
- Taylor Wessing: *GPAI obligations under the EU AI Act*, 19. 8. 2026
- Wilson Sonsini: *EU AI Act Enforcement Phase Begins*, 3. 8. 2026
- Heuking: *AI Omnibus 2026 — Trilogue Agreement*, 29. 6. 2026

### Hardware

- NVIDIA: *DGX Spark 64 GB Gives Developers More Ways to Build and Scale Local AI*, 2. 10. 2026
- NVIDIA: *Bringing the Spark to Europe*, GTC Berlín, 21. 10. 2026
- NVIDIA: *DGX Spark and DGX Station Power the Latest Open-Source and Frontier Models*, 5. 1. 2026
- NVIDIA: DGX Spark User Guide — System Overview
- AMD: Ryzen AI Halo produktová stránka (specifikace, 192 GB PRO 495)
- The Register: *AMD's Ryzen AI Halo makes local AI look easy, but at $4K…*, 6. 7. 2026
- Presenc AI: *AMD Strix Halo Local LLM Benchmarks*, říjen 2026
- ComputingForGeeks: *Best Ryzen AI Max+ 395 Mini PC*, 2. 10. 2026
- The Robotics Media: *AMD Ryzen AI Max PRO 400: 192GB Strix Halo*, 5. 6. 2026 (akt. 1. 11. 2026)
- Apple: *Mac Studio — Technical Specifications* (M5 Ultra, 1,2 TB/s, 96/256/512 GB)
- Macworld: *Apple announces the M5 Ultra Mac Studio with up to 512GB of RAM*, 25. 8. 2026
- TechRepublic: *Apple's 512GB Mac Studio Now Costs $22,299*, 30. 10. 2026
- Apple Machine Learning Research: *Local and Distributed Large LLM Inference with MLX and RDMA on Mac Studio*, 15. 10. 2026
- Apple Developer: *Explore distributed inference and training with MLX* (WWDC26, JACCL)
- NVIDIA: *DGX Station — datasheet* (GB300, 748 GB, 252 GB HBM3e @ 7,1 TB/s), 8/2026
- NVIDIA: *RTX Spark PCs Available Today*, 16. 10. 2026 (128 GB, 1 PFLOPS, od 2 599 USD)
- NVIDIA: *RTX Spark N1X Laptop & Desktop Specifications* (300 GB/s, 45–140 W)
- Tom's Hardware: *Nvidia RTX Spark devices are now officially on sale*, 16. 10. 2026
- MiniPC Blogs: *NVIDIA Price Backlash — DGX Spark from $3,999 to $6,950*, 16. 10. 2026
- WindowsForum: *Nvidia RTX Spark Laptops: 128GB Memory and Windows on Arm Trade-Offs*, 29. 10. 2026
- NVIDIA: *DGX Station for Windows* (Q4 2026)
- NVIDIA: *Local AI Inference Recipes — DGX Station*
- TechRadar: *Nvidia GB300 DGX station goes on sale for almost $91,100*, 1. 9. 2026
- ServeTheHome / StorageReview: *DGX Station GB300 Cluster — Two Towers, Two 400G DACs*, 10/2026
- Newegg Insider: *What a DGX Station Is Actually Good For*, 28. 10. 2026
- GitHub: *catid/dgx_station_benchmarks* (reprodukovatelné sady, od 8/2026)

### Modely a měření

- Qwen: *Qwen3.8-Flash-Next: A New Architecture, Towards Ultimate Cost-Efficiency*, 3. 8. 2026
- Qwen3.8-Flash-Next model card — Hugging Face (125B + 51B N-gram + 4B MTP, 6B aktivních, 262k kontext)
- vLLM Recipes: Qwen3.8-Flash-Next (FP8 / NVFP4 konfigurace, DGX Station GB300)
- SGLang Cookbook: Qwen3.8-Flash-Next (176B / 6B, GDN + QSA hybrid)
- llamaperf: Strix Halo 128GB — naměřené hodnoty pro Qwen3.8-Flash-Next, gpt-oss-120B, 30B-A3B
- Alibaba Cloud Community: *Qwen3.8-Flash-Next*, 27. 8. 2026

### Trh a služby

- Mistral AI: *In-region inference, open models, and new European infrastructure*, 11. 8. 2026
- Mistral AI: *AI Cloud for training and inference at scale*
- SAP: *SAP and Mistral AI — Building Europe's Sovereign AI Future*, 11. 8. 2026
- Cloudera: *Cloudera and Mistral Partner*, 10. 9. 2026
- EU Alternative: *The State of European AI: Models, Inference, Apps*, 18. 8. 2026
- Benchmark Heaven: EU sovereign cloud & data residency
- Mordor Intelligence: *Managed AI Infrastructure Operations Services Market*, 27. 10. 2026
- SmarterMSP: *Managed AI inference becomes the next big services market*, 20. 8. 2026
- MSSP Alert: *Could AI governance be MSSPs' next revenue stream?*, 12. 6. 2026
- Palo Alto Networks: AI Access Security, Enterprise DLP
- Cisco: *Reimagines Security for the Agentic Workforce*, 23. 3. 2026
- Cisco: *Redefines Security for the Agentic Era*, 10. 2. 2026
- Iternal: *Best Turnkey AI Servers & AI Appliances 2026*

### Architektura

- LLM Machines: On-prem AI appliance architecture
- Locai Labs: *On-Prem AI Appliance — complete guide*, 26. 6. 2026
- LLM.co: On-premise LLM deployment
- Go.AI: On-Prem LLM deployment (Go1)

---

*Dokument vznikl jako syntéza analytické diskuze k tématu lokální AI v Evropě,
AI Act a provozního modelu. Není právní radou. Čísla označená [odhad] jsou
kvalifikované odhady, nikoli měření.*

---

## 17. Historie revizí

Dokument vznikal v diskuzi a několik tvrzení se v jejím průběhu změnilo.
Záznam je tu proto, aby bylo vidět, co bylo opraveno a proč — a aby se
staré číslo nevrátilo jako fakt.

| Revize | Co se změnilo | Důvod |
|---|---|---|
| **v1** | Základní rámec: AI Act, trh, hardware, architektura, služby | První syntéza |
| **v2** | Roofline model místo tabulky „model → tok/s“ | Rozhoduje počet **aktivních** parametrů a kvalita jader, ne celkové parametry |
| **v3** | Slot ceiling 16 vs. **provozní strop 4**; 70 → 40 tok/s nad 128k | Naměřená data na DGX Spark (NVFP4, MTP on, vLLM) |
| **v4** | **DGX Spark 3 999 → 6 950 USD**; přidán RTX Spark notebook a mini | Zdroj: ceníky 10/2026, +74 % za rok kvůli pamětem |
| **v5** | Mac Studio jako třetí třída + karanténní vzor | 1,2 TB/s, ale jiná numerika a jiný stack |
| **v6** | DGX Station: 748 GB není 748 GB rychlé paměti | 252 GB HBM3e @ 7,1 TB/s vs. 496 GB LPDDR5X @ 396 GB/s |
| **v7** | Fronta a priorita do gatewaye; HA gatewaye až od fáze 3 | Duplikovat vrstvu, která není poslední SPOF, nemá efekt |
| **v8** | UPS a obnova jako samostatná sekce | RTO dominuje reload modelu, ne gateway |
| **v9** | Notebooky **nejsou** bezúdržbové (6.11) | Oprava: „ops se smrskne na MDM“ bylo špatně |
| **v10** | Klient vs. výpočet (6.12) | Oddělení interakce a výpočtu je levnější než obě jednotné varianty |
| **v11** | Škálování a chyba prognózy (9.5) | Poptávka je nepředvídatelná; pool dělá chybu 3,7× levnější a vratnou |
| **v12** | Rozhodovací posloupnost pro EU API (8.7) | Tier routing je právní rozhodnutí, ne kapacitní; klasifikace dat má přednost |
| **v13** | Infrastruktura jako kód a obnova z čistého stavu (11.7) | Immutable redeploy jako záchranná síť; tři AI-specifická tření |

**Co zůstalo nezměněné od začátku:** regulační rámec a jeho data, rozlišení
provider/deployer, tvrzení že lokální nasazení neřeší shodu, a závěr že
hodnota se přesouvá do control plane.

**Co je stále hypotéza:** provozní strop 4, počet slotů nad 128k kontextem,
kapacitní model pro 50 uživatelů a rozdělení trhu služeb. Viz 7.7.
