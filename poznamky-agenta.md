# Poznámky agenta

*Průběžný záznam rozhodnutí, otevřených otázek a věcí k ověření.*

---

## 2026-11-04 — provozovatel a měření

- **Provozovatel:** ESHOpino s.r.o., Roháčova 145/14, 130 00 Praha 3,
  IČO 03223485, DIČ CZ03223485 — stejný jako OpenWork.cz. Doplňno do
  `/o-webu/pravni/`, `jak-piseme.md`, footeru a JSON-LD.
- **Vlastní měření neprovádíme a neplánujeme.** Pracujeme jen s daty,
  ke kterým dohledáme zdroj. Validace odmítne `typ: vlastni`
  i `mereno_kym: my`.
- Kontaktní e-mail pro veřejnost zůstává `[DOPLNIT]`.

---

## 2026-11-04 — backlog hledání dat

- Nový `plan-dat.md`: P0/P1/P2 seznam toho, co chybí, kde to hledat
  a kdy je položka hotová. Zahrnuje měření, české ceny, nové modely
  a zařízení, české/vision testy a údržbu zdrojů.
- Do OpenChamber jsou založené todos pro hlavní oblasti; detail
  a zdroje jsou v `plan-dat.md`.
- Backlog se doplňuje při každém novém modelu nebo zařízení.

---

## 2026-11-04 — konfigurace 64 GB+

Rozšíření katalogu na **všechny konfigurace s 64 GB a více** unified paměti:

- Nový `data/konfigurace.yaml` (8 konfigurací) a stránka
  `/zarizeni/konfigurace/`. Každá konfigurace má cenu, datum, zdroj
  a seznam modelů, které se vejdou včetně KV cache pro 128k.
- **Gemma 4 26B A4B** přidána jako doporučený model pro 64 GB
  (25,2B / 3,8B, 256k, Apache-2.0, Q4_K_M ~17 GB vah).
- **Qwen3.6 35B-A3B** změněn z „pod hranicí“ na doporučený pro 64 GB.
  Na 128 GB zůstává Qwen3.8 Flash Next minimum.
- Ceny 64GB variant: DGX Spark od 4 999 USD, RTX Spark notebook od
  4 299,99 USD, Strix Halo od 1 959 USD. RTX Spark mini 64 GB cena
  `[DOPLNIT]`.
- Rychlosti Gemmy 4: 69,9 tok/s na DGX Spark (Q4_K_M, llama.cpp),
  78 tok/s na Strix Halo (UD-Q4_K_XL), ~53 tok/s při 128k (LM Studio).
  NVFP4 ve vLLM bez draftu je ~31,5 tok/s — vysvětleno jako rozdíl enginu.
- **KV cache Qwen3.6** je malá díky lineární attention (30 z 40 vrstev).
  Odhad ~24–25 GB při 128k je označený jako výpočet, ne měření.
- **Qwen3.6 vision** není součástí hlavního GGUF: vyžaduje samostatný
  mmproj (~579 MB Q6_K, ~861 MB BF16). Bez něj je model text-only;
  do paměťového rozpočtu se připočítá ~0,6 GB.

---

## 2026-11-04 — české ceny GB10 OEM

Uživatel dodal nabídku Alza.cz s **15 GB10 stroji** (ASUS, Lenovo, HP,
Dell, GIGABYTE, Acer, PNY, NVIDIA). Založen `data/dgx-spark-oem.yaml`
a stránka `/zarizeni/dgx-spark-oem/`.

- Ceny jsou **včetně i bez DPH**, z nabídky ze 4. 11. 2026. Jsou to
  maloobchodní ceny, ne US listovky; nepřepočítáváme je na USD.
- Všechny mají 128 GB, GB10 a DGX OS; liší se úložištěm, chlazením,
  zárukou a dostupností.
- Alza blokuje roboty (HTTP 403), proto mají zdroje `kontrola: manual`
  a `check:zdroje` je přeskočí s poznámkou. Ceny se ověřují ručně.
- **Pozor na rozpor:** živé Alza stránky mohou mít jiné ceny než tento
  snapshot (během psaní se lišily u NVIDIA a ASUS). Web uvádí datum
  snapshotu a čtenář si má cenu ověřit před nákupem.
- Cluster dvou strojů (až 405B) je mimo katalog: vyžaduje pool, ne
  jedno zařízení.

---

## 2026-11-04 — české ceny Strix Halo

Další nabídka Alza.cz: **Acemagic A10A** a **Acer Veriton RA110**,
Ryzen AI Max+ 395, 128GB, 2TB, Windows 11 Pro, za **119 990 Kč vč. DPH**
(99 165 Kč bez DPH). Založen `data/strix-halo-oem.yaml` a stránka
`/zarizeni/strix-halo-oem/`.

- Je to **o 43 000 Kč méně** než nejlevnější GB10 OEM (ASUS GX10 1TB
  za 162 990 Kč). Pro českého kupce je to nejlevnější 128GB box.
- Nejde o stejný stack: x86 + ROCm/Vulkan vs. Arm + CUDA/DGX OS.
  Prefill a zralost ovladačů jsou slabší.
- AMD Ryzen AI Halo je v nabídce bez ceny a nedostupný; „SSD 2 GB“
  je téměř jistě překlep, očekáváme 2 TB.
- Ceny jsou snapshot; Alza blokuje roboty, zdroje mají `kontrola: manual`.

---

## 2026-11-04 — zpětná vazba k obsahu

Zadání doplněno o redakční pravidla:

- **„hustý model“ se nepoužívá** — všude je **dense model**.
- **Zdroj u každého tvrzení**, ne jen na konci stránky. U čísel inline odkaz
  nebo poznámka pod tabulkou.
- **Ceny:** vždy datum, původní USD, na CZ přepočet na CZK (ČNB), na EN na EUR
  (ECB), s poznámkou „orientační, bez DPH a dopravy“.
- **Správa zdrojů:** registr `data/zdroje.yaml`, hlídač, changelog
  `data/zmeny.yaml`, týdenní workflow, ruční schválení změn.
- **Měření:** vždy kvantizace, engine + verze, kontext, souběžnost a nastavení
  (MTP, KV cache, flash attention). Bez toho číslo nic neznamená.
- **Kontext:** nativní maximum není doporučený provozní bod. Sledovat
  maximum, doporučený kontext a reálně udržitelný kontext na zařízení.
  U těchto strojů je strop většinou 262k; seriózní dlouhý provoz je 128k+.
- **Vision:** u modelů se předpokládá vision, pokud model card neříká jinak.
- **Python:** pro skripty agenta, měření a práci s daty doporučovat Python 3.12+.

Upraveno: `AGENTS.md`, `plan-projektu.md`, `plan-obsahu.md`, obě šablony,
`obsah/zaciname/co-je-lokalni-ai.md`, `obsah/zaciname/jak-to-funguje.md`.
Přidáno: `data/zdroje.yaml`, `data/kurzy.yaml`.

---

## 2026-11-04 — RTX Spark notebook a nativní vLLM

Uživatel upozornil, že RTX Spark už má pod Windows nativní vLLM bez WSL.
Ověřeno:

- komunitní port `devjeonghwan/vllm-for-rtx-spark`, vLLM 0.32.0, Windows
  ARM64, bez WSL, podpora Qwen3.8-Flash-Next-FP4-Local;
- 27. 10. 2026: 53,2 tok/s (SPEED-Bench coding);
- 31. 10. 2026: 70,44 tok/s vs. 35,37 tok/s s NVIDIA llama.cpp recipe;
- MTP, CUDA graphs, až 16 souběžných requestů;
- oficiální vLLM Windows stále nepodporuje, jde o komunitní early preview.

Upraveno: `obsah/zarizeni/rtx-spark-notebook.md`, `data/zarizeni.yaml`,
`data/zdroje.yaml`. Původní tvrzení „vLLM ne“ odstraněno.

---

## 2026-11-04 — vše podložené

Další zpřísnění: **když pro tvrzení není zdroj, neodhadovat.** Platí:

- `odhad` jako typ čísla se ruší. Zůstává `namereno` (zdroj), `vypocet`
  (z podložených vstupů) a `vlastni` (dnes nepoužíváme).
- Když zdroj chybí, hledej ho; když ho nenajdeš, `[DOPLNIT]` nebo tvrzení
  vynech.
- RTX Spark notebook: veřejné měření Qwen3.8 FN k 14. 10. 2026 neexistuje,
  proto v tabulce nejsou tok/s. Odstraněny i roofline odhady a nesourceované
  ceny; cena je 5 899–6 499 USD za 128GB konfigurace.
- DGX Spark: doplněn konflikt mezi Qwen/NVIDIA (~70 tok/s) a nezávislým
  měřením (36,8–45,8 tok/s); vysvětleno jako rozdíl konfigurace.
- Data card Strix Halo: plánovací čísla změněna na spodní hranici reportů
  (41/32), normalizační odhady odstraněny.

---

## 2026-11-04 — bez vlastního hardwaru

Zásadní omezení: **většinu zařízení nelze fyzicky otestovat.** Web proto
není benchmark laboratoř, ale **interpretace veřejných dat**.

Z toho plyne:

- `namereno` znamená **naměřeno zdrojem**, ne námi. V datech je `mereno_kym`
  a `důvěryhodnost`.
- Každé číslo má **rozpětí**, pokud se zdroje rozcházejí, a vysvětlení proč.
- **Roofline** slouží jako kontrola fyzikální možnosti a doplnění mezer,
  ne jako náhrada měření.
- Pro rozhodování se používá **plánovací číslo** s rezervou, ne špička.
- „Measurement cards“ se mění na **datové karty**: co tvrdí zdroj, za jakých
  podmínek, jak je to důvěryhodné, co z toho plyne a co by závěr změnilo.
- Komunitní měření je důležitější než dřív; musí mít jednotné minimum
  a moderaci.
- Přidána stránka `o-webu/metodika`, která celý přístup vysvětluje.

Upraveno: `AGENTS.md`, `plan-projektu.md`, `plan-obsahu.md`,
`aktualizace.md`, `README.md`, šablony, první dvě stránky.

---

## 2026-11-04 — první průchod

### Co jsem udělal

- Prošel jsem podklad `lokalni-ai-eu-ai-act.md` (enterprise analýza:
  AI Act, hardware, architektura, ekonomika).
- Prošel jsem šablonu OpenWork.cz (Astro + Starlight, sidebar, data YAML,
  `last_verified`, kontrola obsahu).
- Založil jsem `AGENTS.md`, `plan-projektu.md`, `plan-obsahu.md`,
  dvě obsahové šablony a první dvě vzorové stránky
  (`obsah/zaciname/co-je-lokalni-ai.md`, `obsah/zaciname/jak-to-funguje.md`).

### Rozhodnutí uživatele (4. 11. 2026)

- **Generátor: Astro + Starlight**, stejná šablona jako OpenWork.cz.
  11ty se nepoužije. Důvod: priorita je stejný vzhled a hotové komponenty
  (sidebar, TOC, hledání, tmavý režim), ne lehkost 11ty.
- **Repozitáře: jeden zdrojový repo + dva publikační**
  (`localinference.cz`, `localinference.eu`).
- **EN mutace: CZ první, EN po stabilizaci obsahu.**

### Rozhodnutí, která jsem udělal sám

1. **Web je primárně o zařízeních a modelech, ne o AI Actu.** Podklad je
   enterprise analýza; web ji použije jako zdroj tvrdých dat (hardware,
   roofline, měření), ale nebude kopírovat regulatorní část. AI Act / GDPR
   může být okrajová stránka pro firmy, ne jádro.
2. **Minimum je Qwen3.8 Flash Next.** Modely pod ním jsou jen referenční
   srovnání, nikdy doporučení.
3. **Jen MoE.** Dense modely se objeví jen jako varování („vejde se,
   ale 5 tok/s není použitelné“).
4. **Typy čísel:** `namereno` (zdroj), `vypocet`; vlastní odhad se
   nepoužívá, chybějící data jsou `[DOPLNIT]`. Každé s datem a zdrojem.
5. **Obsah před kódem.** Nejprve Markdown v `obsah/`, Astro + Starlight
   až po schválení.
6. **CZ první, EN po stabilizaci.** EN mutace je samostatný repo a doména,
   ale nemusí vzniknout ve stejný den.

### Co je potřeba potvrdit

- [ ] **Značka:** „Local Inference“, nebo český název?
- [ ] **Bude provozovatel měřit na vlastních zařízeních?** Pokud ano, je to
      nejsilnější obsahový diferenciátor a má smysl mu přizpůsobit strukturu.
- [ ] **Barva značky:** vlastní identita, ne kopie OpenWork. Návrh přijde
      s první verzí šablony.

### Co ověřit před psaním

- [ ] Přesné ceny a dostupnost všech zařízení k 11/2026 (DGX Spark, RTX Spark
      mini/notebook, Strix Halo OEM).
- [ ] Model cards a benchmarky: Qwen3.8 Flash Next, Qwen3.6 35B-A3B,
      Nemotron 3.5 Super.
- [ ] Česká kvalita jednotlivých modelů — vlastní test nebo důvěryhodný zdroj.
- [ ] TTFT a prefill pro konkrétní zařízení (v podkladu jsou hlavně decode tok/s).
- [ ] U každého modelu nativní maximum, doporučený provozní kontext a reálný
      kontext na zařízení.
- [ ] U každého modelu ověřit vision; výjimky označit.
- [ ] Spotřeba, hluk a teploty u mini PC a notebooků.
- [ ] Licence a podmínky použití vah (Apache-2.0, vlastní licence…).
- [ ] Přepočty cen k datu: CZK (ČNB) a EUR (ECB); zdroj a datum u každé ceny.

### Poznámka k podkladu

Podklad je silný v hardwaru, roofline a ekonomice. Slabší je v „co od modelu
čekat“ — chybí mu benchmarky kvality a české testy. Ty bude potřeba doplnit
z model cards a vlastního měření. Regulatorní část je pro web okrajová;
použije se jen tam, kde se dotýká provozu (data, logy, odpovědnost).
