# Local Inference

Nezávislý průvodce lokální AI na hotových zařízeních.

- **localinference.cz** — česky
- **localinference.eu** — anglicky (později)

Web odpovídá na otázku: *„Koupím tenhle stroj. Které modely na něm poběží,
jak rychle a co od nich mám čekat v denní práci?“*

**Nemáme vlastní laboratoř.** Většinu zařízení fyzicky netestujeme. Web je
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
| Obsahové šablony | [`obsah/_sablony/`](obsah/_sablony/) |
| Data (zařízení, modely, měření, zdroje, kurzy) | [`data/`](data/) |
| Web (Astro + Starlight) | [`sites/cz/`](sites/cz/) |
| Kontrolní a hlídač skripty | [`scripts/`](scripts/) |

## Rychlý start

```bash
npm install
npm run check          # data + obsah
npm run dev            # web na http://localhost:4321
npm run build          # kontrola + build do sites/cz/dist
```

Hlídač zdrojů:

```bash
npm run hlidac         # aktualizuje data/stav-zdroju.json a vystup/hlidac-report.md
npm run check:zdroje   # ověří, že URL odpovídají
```

## Hotové stránky

- [`sites/cz/src/content/docs/zaciname/co-je-lokalni-ai.md`](sites/cz/src/content/docs/zaciname/co-je-lokalni-ai.md)
- [`sites/cz/src/content/docs/zaciname/jak-to-funguje.md`](sites/cz/src/content/docs/zaciname/jak-to-funguje.md)
- [`sites/cz/src/content/docs/zaciname/jak-cteme-data.md`](sites/cz/src/content/docs/zaciname/jak-cteme-data.md)
- [`sites/cz/src/content/docs/zaciname/proc-moe.md`](sites/cz/src/content/docs/zaciname/proc-moe.md)
- [`sites/cz/src/content/docs/rychlost/roofline.md`](sites/cz/src/content/docs/rychlost/roofline.md)
- [`sites/cz/src/content/docs/zarizeni/dgx-spark.md`](sites/cz/src/content/docs/zarizeni/dgx-spark.md)
- [`sites/cz/src/content/docs/zarizeni/rtx-spark-notebook.md`](sites/cz/src/content/docs/zarizeni/rtx-spark-notebook.md)
- [`sites/cz/src/content/docs/modely/qwen3-8-flash-next.md`](sites/cz/src/content/docs/modely/qwen3-8-flash-next.md)
- [`sites/cz/src/content/docs/data/qwen3-8-flash-next-strix-halo.md`](sites/cz/src/content/docs/data/qwen3-8-flash-next-strix-halo.md)
- [`sites/cz/src/content/docs/o-webu/metodika.md`](sites/cz/src/content/docs/o-webu/metodika.md)
- [`sites/cz/src/content/docs/o-webu/jak-piseme.md`](sites/cz/src/content/docs/o-webu/jak-piseme.md)
- [`sites/cz/src/content/docs/zdroje/zdroje.md`](sites/cz/src/content/docs/zdroje/zdroje.md)
- [`sites/cz/src/content/docs/zdroje/co-nevime.md`](sites/cz/src/content/docs/zdroje/co-nevime.md)

## Základní pravidla

- Jen **hotová zařízení**, žádné skládání PC.
- Jen **současné modely**; minimum je **Qwen3.8 Flash Next**.
- Jen **MoE** modely jako doporučení; dense jen jako varování.
- Každé číslo má **zdroj, datum, typ** (`naměřeno` = převzato od zdroje /
  `výpočet`), a **důvěryhodnost**. Když zdroj chybí, `[DOPLNIT]`.
- **Neodhadujeme.** Vlastní odhad není číslo.
- Kde se zdroje rozcházejí, ukazujeme **rozpětí** a důvod, ne jen nejlepší číslo.
- Ceny v USD + přepočet na **CZK** (ČNB) nebo **EUR** (ECB).
- Měření vždy s **kvantizací, enginem, kontextem a nastavením**.
- **Maximum kontextu není doporučení**; sledujeme i reálný provozní kontext.
- U modelů předpokládáme **vision**, pokud model card neříká jinak.
- Pro skripty agenta doporučujeme **Python 3.12+**.

## Technika

Astro 7 + Starlight, statický výstup, GitHub Pages. Jeden zdrojový repo,
dva publikační repozitáře. CZ je výchozí; EN vznikne po stabilizaci obsahu.
