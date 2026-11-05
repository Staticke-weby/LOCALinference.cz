# Local Inference

Nezávislý průvodce lokální AI na hotových zařízeních.

- **localinference.cz** — česky
- **localinference.eu** — anglicky (později)

Web odpovídá na otázku: *„Koupím tenhle stroj. Které modely na něm poběží,
jak rychle a co od nich mám čekat v denní práci?“*

**Vlastní měření neprovádíme.** Nemáme laboratoř a žádné zařízení fyzicky netestujeme. Web je
interpretace veřejných měření, model cardů a dokumentace: data srovnáváme,
kontrolujeme roofline, hledáme rozpory a vysvětlujeme, co z nich plyne.
Nikdy netvrdíme, že číslo je z našeho testu.

## Stav projektu

Data, kontrola a build jsou hotové. Obsah se doplňuje po stránkách.

| Co | Kde |
|---|---|
| Pravidla projektu | [`AGENTS.md`](AGENTS.md) |
| Vize, struktura, datový model, fáze | [`plan-projektu.md`](plan-projektu.md) |
| Obsah po vlnách a zadání stránek | [`plan-obsahu.md`](plan-obsahu.md) |
| Postup aktualizace dat a zdrojů | [`aktualizace.md`](aktualizace.md) |
| Rozhodnutí a otevřené otázky | [`poznamky-agenta.md`](poznamky-agenta.md) |
| Plán hledání dat a podkladů | [`plan-dat.md`](plan-dat.md) |
| Obsahové šablony | [`obsah/_sablony/`](obsah/_sablony/) |
| Data (zařízení, GB10 OEM ceny, modely, měření, zdroje, kurzy) | [`data/`](data/) |
| Web (Astro + Starlight) | [`sites/cz/`](sites/cz/) |
| Kontrolní a hlídač skripty | [`scripts/`](scripts/) |

## Rychlý start

```bash
npm install
npm run check          # data + obsah + registr mezer
npm run chybi          # co chybí, podle dávek a priorit
npm run objevy         # kandidáti na rozšíření webu
npm run dev            # web na http://localhost:4321
npm run build          # kontrola + build do sites/cz/dist
```

Hlídač zdrojů:

```bash
npm run hlidac         # aktualizuje data/stav-zdroju.json a vystup/hlidac-report.md
npm run check:zdroje   # ověří, že URL odpovídají
```

## Nasazení

Web se staví na GitHub Actions a publikuje přes GitHub Pages. Do repa
patří celý zdroj, na web jde jen výstup.

| Co | Kde |
|---|---|
| Zdroj: data, obsah, obě mutace | `Staticke-weby/LOCALinference.cz` |
| CZ build a nasazení | `.github/workflows/nasazeni-cz.yml` → Pages tohoto repa |
| EN build a nasazení | `.github/workflows/nasazeni-eu.yml` → `Staticke-weby/LOCALinference.eu` (až vznikne `sites/eu`) |

DNS u registrátora (platí pro obě domény):

| Doména | Typ | Hodnota |
|---|---|---|
| `www.localinference.cz` | CNAME | `staticke-weby.github.io` |
| `localinference.cz` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |

Po přepnutí DNS zapnout v **Settings → Pages** volbu *Enforce HTTPS*.
Dokud DNS míří jinam, web na doméně neběží, i když je build zelený.

### Měření návštěvnosti

Umami, bez cookies, skript v `head` souboru `astro.config.mjs`:

| Mutace | `data-website-id` |
|---|---|
| CZ | `0f31f779-c9bd-4e31-9745-19b8b425be0b` |
| EN | `94da2420-aa54-4b76-a614-ca06835a2138` |

## Hotové stránky

- [`sites/cz/src/content/docs/zaciname/co-je-lokalni-ai.mdx`](sites/cz/src/content/docs/zaciname/co-je-lokalni-ai.mdx)
- [`sites/cz/src/content/docs/zaciname/jak-to-funguje.md`](sites/cz/src/content/docs/zaciname/jak-to-funguje.md)
- [`sites/cz/src/content/docs/zaciname/jak-cteme-data.md`](sites/cz/src/content/docs/zaciname/jak-cteme-data.md)
- [`sites/cz/src/content/docs/zaciname/proc-moe.md`](sites/cz/src/content/docs/zaciname/proc-moe.md)
- [`sites/cz/src/content/docs/rychlost/roofline.md`](sites/cz/src/content/docs/rychlost/roofline.md)
- [`sites/cz/src/content/docs/vyber/rozpocet.mdx`](sites/cz/src/content/docs/vyber/rozpocet.mdx)
- [`sites/cz/src/content/docs/zarizeni/dgx-spark.mdx`](sites/cz/src/content/docs/zarizeni/dgx-spark.mdx)
- [`sites/cz/src/content/docs/zarizeni/rtx-spark-notebook.mdx`](sites/cz/src/content/docs/zarizeni/rtx-spark-notebook.mdx)
- [`sites/cz/src/content/docs/modely/qwen3-8-flash-next.mdx`](sites/cz/src/content/docs/modely/qwen3-8-flash-next.mdx)
- [`sites/cz/src/content/docs/data/qwen3-8-flash-next-strix-halo.mdx`](sites/cz/src/content/docs/data/qwen3-8-flash-next-strix-halo.mdx)
- [`sites/cz/src/content/docs/o-webu/metodika.mdx`](sites/cz/src/content/docs/o-webu/metodika.mdx)
- [`sites/cz/src/content/docs/o-webu/jak-piseme.md`](sites/cz/src/content/docs/o-webu/jak-piseme.md)
- [`sites/cz/src/content/docs/zdroje/zdroje.mdx`](sites/cz/src/content/docs/zdroje/zdroje.mdx)
- [`sites/cz/src/content/docs/zdroje/novinky.mdx`](sites/cz/src/content/docs/zdroje/novinky.mdx)
- [`sites/cz/src/content/docs/zdroje/co-nevime.md`](sites/cz/src/content/docs/zdroje/co-nevime.md)

## Základní pravidla

- Jen **hotová zařízení**, žádné skládání PC.
- **Jediný model katalogu je Qwen3.8 Flash Next** na 128 GB. Jiné modely nezařazujeme.
- Model se musí **celý vejít na jedno zařízení**; pool nebo offload nezařazujeme.
- Qwen3.8 Flash Next je **MoE**; dense modely jen jako varování.
- Každé číslo má **zdroj, datum, typ** (`naměřeno` = převzato od zdroje /
  `výpočet`), a **důvěryhodnost**. Když zdroj chybí, `[DOPLNIT]`.
- **Neodhadujeme.** Vlastní odhad není číslo.
- Kde se zdroje rozcházejí, ukazujeme **rozpětí** a důvod, ne jen nejlepší číslo.
- Ceny: na CZ mutaci primárně **CZK** (ČNB), na EN primárně **EUR** (ECB);
  USD vždy v závorce za místní cenou.
- Měření vždy s **kvantizací, enginem, kontextem a nastavením**.
- **Maximum kontextu není doporučení**; sledujeme i reálný provozní kontext.
- U modelů předpokládáme **vision**, pokud model card neříká jinak.
- Pro skripty agenta doporučujeme **Python 3.12+**.

## Technika

Astro 7 + Starlight, statický výstup, GitHub Pages. Repozitář obsahuje
celý zdrojový web, na Pages jde jen výstup ze `sites/cz/dist`. EN mutace
bude mít vlastní repo se stejným principem.
