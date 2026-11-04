# Co ještě chybí dodělat

*Souhrn všech otevřených návrhů a mezer. Stav k 4. 11. 2026.*

Legenda: **P0** blokuje provoz nebo důvěryhodnost · **P1** zlepší web ·
**P2** průběžná údržba.

---

## 1. Infrastruktura a provoz

- [ ] **Přepnout DNS u Vedos** — `www` CNAME na `staticke-weby.github.io`,
      apex A na `185.199.108–111.153`. Pak v Pages zapnout *Enforce HTTPS*.
      Do té doby web na doméně neběží, i když je build zelený.
- [ ] **Přidat secret `PUBLIKACE_TOKEN`** do GitHubu (fine-grained PAT,
      Contents: RW na `LOCALinference.eu`). Bez něj EN workflow nepublikuje.
- [ ] **Umami:** nevylučovat lokální vývoj — skript se posílá i z
      `localhost`. Zvážit podmínku, aby se nenačítal mimo produkci.
- [ ] **Deploy občas visí.** Postup: zkontrolovat předchozí deployment,
      zrušit zaseknutý běh, spustit znovu; Attempt #2 může selhat kvůli
      zrušenému nasazení, Attempt #3 obvykle projde.

## 2. Chybějící stránky

- [ ] **`zaciname/prostredi`** — co nainstalovat (Node, Python, Git,
      runtime). Plánováno ve vlně 1, dosud není.
- [ ] **`vyber/stolni-vs-notebook`** — kde má GPU běžet a proč.
- [ ] **`vyber/bezpecna-volba`** — minimum, které nezklame; co je zbytečné.
- [ ] **`rychlost/kalkulacka`** — odhad doby odpovědi podle kontextu
      a výstupu; bez JS musí fungovat jako tabulka.
- [ ] **Vysvětlivky, které na webu chybí:** Vulkan, RAG, agentní úlohy,
      vision, WSL2. Všechny se na webu používají, ale nemají stránku.
- [ ] **Mac Studio** jako zařízení — odkaz na kategorii je připravený
      v `poznámkách`, chybí ceny, konfigurace a měření.
- [ ] **EN mutace** (`sites/eu`) — zdroj, build, doména, obsah.

## 3. Úpravy existujícího obsahu

- [ ] **`[DOPLNIT]` v tabulkách** nahradit pomlčkou „—“ (např. hmotnost
      u DGX Sparku). Je to interní značka, na veřejné stránce působí divně.
- [ ] **Sekce „Co chybí“ v tématech** — zvážit, zda ji nechat veřejně.
      U homepage už jsme se shodli, že mezery nejsou prodejní argument.
- [ ] **Ověřit Ollama tag** pro Qwen3.8 Flash Next (model page ho uvádí
      jako experimentální).
- [ ] **Windows 11 na homepage** — zvážit přepínač nebo kartu „chci to
      jako počítač“; zatím to řeší až srovnání a téma.
- [ ] **Ceny:** doplnit českou cenu RTX Spark mini (zatím jen odhad).

## 4. Data a měření (z `plan-dat.md`)

- [ ] **D01** RTX Spark mini: první veřejné měření Qwen3.8 FN.
- [ ] **D02** DGX Spark a Strix Halo: TTFT a prefill na jednotném promptu.
- [ ] **D03** Souběžnost 4+ na všech zařízeních.
- [ ] **D04** 128k a 262k kontext: rychlost i kvalita.
- [ ] **D05** Podložené doporučení provozního kontextu.
- [ ] **D06** Kvantizace u čtyř měření na Strix Halu.
- [ ] **D10** České testy: shrnutí, extrakce, e-mail, kód, screenshot.
- [ ] **D11** Vision testy: dokumenty, OCR, tabulky.
- [ ] **D12** Hluk, příkon a teploty v zátěži.
- [ ] **D13** Tool calling a agentní úlohy.

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
