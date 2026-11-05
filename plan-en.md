# EN verze: plán

*Rozhodnutí: **CZ je zdroj pravdy**, EN je jeho replikovaná mutace.
Menší textové rozdíly nevadí. Prioritou je **snadné nasazení**.*

## Nasazení: pull model bez cross-repo tokenu

Tohle je nejjednodušší varianta, která nepotřebuje PAT ani deploy key:

- Zdroj EN (`sites/eu`) zůstává v repu `LOCALinference.cz`.
- Repo `LOCALinference.eu` obsahuje **jen workflow a CNAME**, žádný zdroj.
- Workflow v `.eu` si při buildu stáhne **veřejný** repo `.cz`, postaví
  `sites/eu` a nasadí výstup na vlastní GitHub Pages.
- Spouští se **denně** a ručně. Žádný secret, žádný cross-repo push.
- Když je potřeba okamžité nasazení, lze přidat `repository_dispatch`
  z `.cz`; to je volitelné a není podmínkou.

```yaml
# .github/workflows/deploy.yml v repu LOCALinference.eu
name: Build EN from CZ source
on:
  schedule:
    - cron: '0 4 * * *'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          repository: Staticke-weby/LOCALinference.cz
          path: src
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: src/package-lock.json
      - run: npm ci
        working-directory: src
      - run: npm ci
        working-directory: src/sites/eu
      - run: npm run build
        working-directory: src/sites/eu
      - uses: actions/upload-pages-artifact@v4
        with:
          path: src/sites/eu/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

**Proč takhle:** jeden zdroj pravdy, žádný roční token, každý web
publikuje své vlastní Actions. Cena je zpoždění do 24 hodin a nutnost
mít repo `.cz` veřejné (což je).

## Co se replikuje

Cílem je **plná parita obsahu**, ne výběr:

| Sekce | CZ | EN |
|---|---:|---:|
| Úvod a Start | 7 | 7 |
| Zařízení | 9 | 9 |
| Konfigurace OEM | 25 | 25 |
| Výběr | 4 | 4 |
| Model | 2 | 2 |
| Generování | 16 | 16 |
| Návody | 5 | 5 |
| Slovník | 37 | 37 |
| Témata | 13 | 13 |
| Rychlost | 2 | 2 |
| Zdroje | 4 | 4 |
| O webu | 3 | 3 |
| Data | 2 | 2 |
| **Celkem** | **129** | **129** |

Menší rozdíly v textu jsou v pořádku. Chybějící stránka nebo jiné
číslo není rozdíl, ale chyba.

## Architektura

- `sites/eu/` — samostatný Astro + Starlight web, doména
  `www.localinference.eu`.
- `data/` zůstává jeden zdroj pravdy pro čísla, ceny, měření a licence.
- Texty jsou v `sites/eu/src/content/docs/`.
- Prezentační komponenty se přesunou do `shared/components/` a dostanou
  text přes props nebo lokalizační slovník. CZ i EN používají stejný
  komponent.
- `translationKey` ve frontmatteru spojuje CZ a EN stránku.
- Jazyk se přepíná v hlavičce; odkaz vede na protějšek.

## EN slugy

| CZ | EN |
|---|---|
| `/` | `/` |
| `/zaciname/` | `/getting-started/` |
| `/zarizeni/` | `/devices/` |
| `/zarizeni/srovnani/` | `/devices/compare/` |
| `/zarizeni/konfigurace/<id>/` | `/devices/configurations/<id>/` |
| `/vyber/` | `/choosing/` |
| `/modely/` | `/models/` |
| `/generovani/` | `/generation/` |
| `/generovani/obrazky/` | `/generation/images/` |
| `/generovani/uprava-obrazku/` | `/generation/image-editing/` |
| `/generovani/video/` | `/generation/video/` |
| `/generovani/uprava-videa/` | `/generation/video-editing/` |
| `/generovani/rozhybani-obrazku/` | `/generation/image-to-video/` |
| `/generovani/audio/` | `/generation/audio/` |
| `/generovani/preklady/` | `/generation/translation/` |
| `/generovani/3d/` | `/generation/3d/` |
| `/generovani/herni-prvky/` | `/generation/game-assets/` |
| `/generovani/licence/` | `/generation/licensing/` |
| `/generovani/recepty/` | `/generation/recipes/` |
| `/navody/` | `/guides/` |
| `/slovnik/` | `/dictionary/` |
| `/slovnik/vykon/` | `/dictionary/performance/` |
| `/slovnik/software/` | `/dictionary/software/` |
| `/slovnik/pamet/` | `/dictionary/memory/` |
| `/slovnik/provoz/` | `/dictionary/operations/` |
| `/temata/` | `/topics/` |
| `/rychlost/` | `/speed/` |
| `/zdroje/` | `/sources/` |
| `/o-webu/` | `/about/` |
| `/data/` | `/data/` |

Konkrétní slugy se překládají podle obsahu:
`co-je-lokalni-ai` → `what-is-local-ai`,
`jak-cteme-data` → `how-we-read-data`,
`lokalni-ai-na-obrazky` → `local-ai-images`.

## Pravidla obsahu

- **Všechna čísla, tabulky a varování z CZ zůstávají.** EN nesmí být
  zkrácená verze.
- **Ceny pouze USD** jako list price, bez DPH a dopravy. Žádné české
  ceny, dostupnost ani odkazy na prodejce.
- **Žádné affiliate odkazy.** EN nemá „Kde koupit“.
- **Překlad není kopie.** Titulky a vysvětlení se píšou pro mezinárodní
  čtenáře; čísla a zdroje zůstávají.
- **Česká specifika se adaptují, ne mažou.** Stránka o českých cenách
  se v EN vede jako „US list prices“; české testy jako „Czech and
  multilingual“.
- **Každá stránka má `last_verified`, zdroje a interní odkazy.**
- **Žádný strojový překlad bez redakce.**

## Fáze

### Fáze 0 — infrastruktura

- `sites/eu` scaffold, Starlight, styl, hlavička, footer.
- Společná datová vrstva a komponenty.
- Jazykový přepínač, `hreflang`, canonical, sitemap, robots.
- `npm run parita` a `data/preklady.yaml`.
- Umami EN ID.
- Workflow v `.eu` (pull model), Pages, DNS.

### Fáze 1 — zařízení a model (48 stránek)

- Home, Start, Výběr.
- 9 stránek zařízení + 25 konfigurací.
- Model Qwen3.8 Flash Next, data o Strix Halu.

### Fáze 2 — generování a návody (21 stránek)

- 16 stránek generování včetně receptů a licencí.
- 5 návodů pro DGX, Strix, RTX a Mac.

### Fáze 3 — slovník, témata, zdroje (56 stránek)

- 37 hesel slovníku.
- 13 témat.
- Zdroje, měření, changelog, o webu, právní, FAQ.

### Fáze 4 — SEO a publikace

- Vlastní Search Console, keyword clusters.
- `llms.txt`, RSS changelogu.
- Kontrola `hreflang` a překladových párů.

## Parita

`data/preklady.yaml` eviduje:

```yaml
- cz: zarizeni/dgx-spark
  en: devices/dgx-spark
  stav: hotovo
  last_verified: 2026-11-05
```

`npm run parita` porovná CZ a EN routy. Když CZ stránka nemá EN
protějšek, vypíše ji. V CI to může být varování, ne blok — mírný
rozdíl je povolený, chybějící stránka ne.

## Definition of done

- 129/129 rout, žádná chybějící stránka.
- Všechny tabulky a měření z CZ jsou i v EN.
- Žádný `[DOPLNIT]` navíc oproti CZ.
- Interní odkazy a `hreflang` sedí.
- Build a kontrola odkazů projdou.
- Ceny jsou USD, žádní prodejci, žádné affiliate.

## Blokery

- Kontaktní e-mail pro právní stránky.
- Vlastní Search Console pro EN.
- Pages a DNS v `.eu` repu.

*Stav k 5. 11. 2026. Plán se plní po dávkách; CZ zůstává zdrojem
pravdy a EN se z něj replikuje.*
