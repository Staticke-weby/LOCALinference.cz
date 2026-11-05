# Registr mezer: co hledat a v jakém pořadí

*Postup pro doplňování dat. Samotný seznam mezer je v
[`data/chybi.yaml`](data/chybi.yaml); přehled se generuje do
[`chybi.md`](chybi.md). Stav k 5. 11. 2026.*

## Kde co je

| Soubor | Co obsahuje |
|---|---|
| `data/chybi.yaml` | **Jediný zdroj pravdy**: co chybí, kde, proč, kde hledat, priorita, stav a dávka |
| `chybi.md` | Vygenerovaný přehled pro člověka; needituje se ručně |
| `data/temata.yaml` | Témata a jejich `chybi` — zadání pro obsah, ne pro data |
| `data/zmeny.yaml` | Co se už změnilo |
| `/zdroje/co-nevime/` | Veřejný výběr mezer, ne interní backlog |

## Jak se to používá

- **Dávka** je téma, které se řeší najednou (např. „Generování:
  rychlosti a licence“). Uvnitř dávky se jde od **P0** k **P2**.
- **P0** — blokuje důvěryhodné tvrzení nebo doporučení.
- **P1** — zlepší kvalitu, ale stránka funguje i bez toho.
- **P2** — průběžná údržba a sledování.
- **Stav**: `otevreno` → `hleda-se` → `hotovo`; `ceka-na-vas` znamená,
  že je potřeba rozhodnutí provozovatele; `prubezne` je opakovaná kontrola.

## Příkazy

```bash
npm run chybi          # přehled podle dávek a stavu
npm run chybi:zapis    # přepíše chybi.md
npm run check:chybi    # validace registru; spadne na neevidovaný [DOPLNIT]
```

`npm run check` teď registr kontroluje taky. Když někdo přidá do
článku `[DOPLNIT]` a nezaloží položku, build se zastaví. To je záměr:
seznam mezer nemá tiše růst.

## Postup u jedné položky

1. Otevřít `data/chybi.yaml`, najít ID a přečíst `co_chybi` a `hledat`.
2. Dohledat veřejný zdroj. Vlastní měření neděláme.
3. Zapsat hodnotu do `data/*.yaml` včetně `zdroj`, `overeno`, `typ`
   a `duveryhodnost`.
4. Upravit text stránky a odstranit `[DOPLNIT]`.
5. Přidat zdroj do `data/zdroje.yaml`, pokud v něm ještě není.
6. Zapsat změnu do `data/zmeny.yaml`.
7. V registru přepnout `stav: hotovo` a doplnit `zdroj` a `overeno`.
8. Spustit `npm run chybi:zapis`, `npm run check` a build.

Když se zdroj nenajde, položka zůstane `hleda-se` a v textu zůstane
`[DOPLNIT]`. Nikdy se nedosazuje odhad.

## Checklist pro nový model

1. Vejde se celý na jedno zařízení včetně KV cache pro 128k?
2. Je to MoE s malým počtem aktivních parametrů, nebo dense?
3. Má vision? Vyžaduje mmproj?
4. Jaké jsou kvantizace a jejich reálné velikosti?
5. Jaký je nativní a doporučený kontext?
6. Existuje měření na DGX Spark, RTX Spark nebo Strix Halu?
7. Je licence použitelná (Apache-2.0, MIT…)?
8. Nevyžaduje pool, tensor parallel nebo offload? Pokud ano, jen varování.
9. Má zdroj s datem a konfigurací?
10. Je v `data/zdroje.yaml` a má záznam v changelogu?

## Checklist pro nové zařízení

1. Má 128 GB a více unified paměti?
2. Je hotové (turnkey), ne skládačka?
3. Jaká je cena v USD a v ČR, s datem a zdrojem?
4. Jaká je propustnost paměti a reálný GPU pool?
5. Vejde se na něj Qwen3.8 s 128k?
6. Existuje veřejné měření, nebo je to `[DOPLNIT]`?
7. Je dostupné v ČR, nebo jen v US?
8. Má vlastní stránku a je v `data/zarizeni.yaml`?

## Kdy je položka hotová

- Hodnota je v `data/*.yaml` s `zdroj`, `overeno`, `typ` a `duveryhodnost`.
- Text na stránce ji používá a nemá `[DOPLNIT]`.
- Změna je v `data/zmeny.yaml`.
- Zdroj je v `data/zdroje.yaml` a `npm run check:zdroje` projde.
- `npm run check` a build projdou bez varování.
- V registru je `stav: hotovo`.

## Kudy dál

- [Co nevíme](/zdroje/co-nevime/) — veřejný seznam mezer.
- [Zdroje](/zdroje/zdroje/) — registr a frekvence kontroly.
- [Metodika](/o-webu/metodika/) — jak data čteme.
- [Changelog](/zdroje/novinky/) — co se změnilo.
