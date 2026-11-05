# Co ještě chybí dodělat

*Souhrn všech otevřených návrhů a mezer. Stav k 5. 11. 2026.*

Legenda: **P0** blokuje provoz nebo důvěryhodnost · **P1** zlepší web ·
**P2** průběžná údržba.

---

## 1. Infrastruktura a provoz

- [x] **Přepnout DNS u Vedos** — hotovo 5. 11. 2026, doména servíruje web.
- [ ] **Přidat secret `PUBLIKACE_DEPLOY_KEY`** do GitHubu — privátní
      SSH klíč deploy key s právem write na `LOCALinference.eu`.
      Deploy key nemá expiraci, na rozdíl od ročního PAT.
- [ ] **Umami:** nevylučovat lokální vývoj — skript se posílá i z
      `localhost`. Zvážit podmínku, aby se nenačítal mimo produkci.
- [ ] **Deploy občas visí.** Postup: zkontrolovat předchozí deployment,
      zrušit zaseknutý běh, spustit znovu; Attempt #2 může selhat kvůli
      zrušenému nasazení, Attempt #3 obvykle projde.

## 2. Chybějící stránky

- [x] **`zaciname/prostredi`** — co nainstalovat (Node, Python, Git,
      runtime). Plánováno ve vlně 1, dosud není.
- [x] **`vyber/stolni-vs-notebook`** — kde má GPU běžet a proč.
- [x] **`vyber/bezpecna-volba`** — minimum, které nezklame; co je zbytečné.
- [x] **`rychlost/kalkulacka`** — odhad doby odpovědi podle kontextu
      a výstupu; bez JS musí fungovat jako tabulka.
- [x] **Vysvětlivky, které na webu chybí:** Vulkan, RAG, agentní úlohy,
      vision, WSL2. Všechny se na webu používají, ale nemají stránku.
- [x] **Mac Studio a MacBook Pro** jako zařízení — odkaz na kategorii je připravený
      v `poznámkách`, chybí ceny, konfigurace a měření.
- [ ] **EN mutace** (`sites/eu`) — zdroj, build, doména, obsah.

## 3. Úpravy existujícího obsahu

- [x] **`[DOPLNIT]` v tabulkách** nahradit pomlčkou „—“ (např. hmotnost
      u DGX Sparku). Je to interní značka, na veřejné stránce působí divně.
- [ ] **Sekce „Co chybí“ v tématech** — zvážit, zda ji nechat veřejně.
      U homepage už jsme se shodli, že mezery nejsou prodejní argument.
- [ ] **Ověřit Ollama tag** pro Qwen3.8 Flash Next (model page ho uvádí
      jako experimentální).
- [ ] **Windows 11 na homepage** — zvážit přepínač nebo kartu „chci to
      jako počítač“; zatím to řeší až srovnání a téma.
- [ ] **Ceny:** doplnit českou cenu RTX Spark mini (zatím jen odhad).
- [x] **Ceny Maců:** Mac Studio 147 990–171 990 Kč, MacBook Pro 209 990–434 490 Kč (Alza, 4. 11. 2026).

## 4. Data a měření (registr mezer)

Konkrétní datové mezery už nejsou v tomto souboru. Vedou se v
[`data/chybi.yaml`](data/chybi.yaml) podle dávek a priorit; přehled
vygeneruje `npm run chybi`. Patří tam D01–D13 (TTFT, souběžnost,
kontext, čeština, vision, hluk, tool calling) i nové mezery
z generování.

- [ ] **Dávka 2** — katalogová data Qwen3.8 (D01–D08).
- [ ] **Dávka 3** — kvalita, čeština a provoz (D10–D13).
- [ ] **Dávka 1** — generování: časy, licence, slovník (G01–G07).

## 5. SEO a obsahový plán

- [ ] **Google Search Console** — napojit a začít sbírat dotazy.
- [ ] **Rozšiřovat `data/temata.yaml`** podle reálných dotazů; každé téma
      musí mít stránku a `stranky` odkazy.
- [ ] **Kontrolovat, že každý nový pojem má výklad** a je prolinkovaný
      (plugin `rehypeSlovnik`).

## 6. Rozhodnutí, která čekají na vás

- [ ] **Značka a titulek webu** — „Local Inference“ vs. český název.
- [ ] **Kontaktní e-mail pro veřejnost** — chybí v právních informacích.
- [ ] **Zda publikovat seznam mezer** (`/zdroje/co-nevime/`) jako
      marketingovou výhodu, nebo ho jen držet interně.

---

**Co je hotové:** katalog 4 zařízení, 25 OEM SKU, model, měření, návody,
témata, slovník s automatickým prolinkováním, sitemap, OG obrázky,
analytika, publikace přes GitHub Actions.
