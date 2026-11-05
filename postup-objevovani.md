# Jak hledat nové věci a obohacovat web

*Postup pro objevování nových zařízení, modelů a témat. Není to totéž jako
[registr mezer](data/chybi.yaml): ten řeší, co na webu chybí. Tady jde o to,
co na webu ještě vůbec není.*

## Dva seznamy, které se nepletou

| Seznam | Otázka | Příklad |
|---|---|---|
| `data/objevy.yaml` | Máme to vůbec zařadit? | Nový 128GB box, nový model, nové téma |
| `data/chybi.yaml` | Co u zařazeného chybí? | Chybí cena, čas, licence, měření |

Kandidát se nejdřív zapíše do **objevů**. Teprve když projde filtrem a
rozhodneme se ho zařadit, vznikne z něj stránka nebo položka v katalogu.
A když je zařazený, ale chybí mu data, založí se položka v **registru mezer**.

## Kde hledat

| Zdroj | Co z něj teče | Frekvence |
|---|---|---|
| [Hugging Face trending](https://huggingface.co/models?sort=trending) | nové modely, licence, model cards | týdně |
| [Qwen blog](https://qwen.ai/blog) a Qwen na HF | nové verze jediného modelu katalogu | týdně |
| [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) | komunitní měření, zkušenosti, varování | týdně |
| GitHub trending a releases | runtime (vLLM, llama.cpp, ComfyUI), nástroje | týdně |
| NVIDIA, AMD, OEM stránky | nová zařízení se 128 GB+ | měsíčně |
| Alza, CZC, Mironet | české ceny a dostupnost | týdně |
| [llamaperf](https://llamaperf.com/), [InferenceX](https://inferencex.semianalysis.com/), [LocalAgentBoard](https://localagentboard.com/) | nezávislá měření | měsíčně |
| Google Search Console | dotazy, na které web neodpovídá | měsíčně |
| Diskuze, e-maily, dotazy čtenářů | témata a nejasnosti | průběžně |

Nový zdroj se do této tabulky přidá jen tehdy, když je jasné, **co z něj
na web teče**. Zároveň se zapíše do `data/zdroje.yaml`.

## Rytmus

- **Týdně 30 minut** — projít trending, Qwen blog, r/LocalLLaMA a releases.
  Cílem je zachytit kandidáty, ne je hned zpracovat.
- **Měsíčně 60 minut** — OEM stránky, české ceny, nová měření, Search Console.
  Zapsat změny a rozhodnout, co jde do další dávky.
- **Čtvrtletně** — projít `data/objevy.yaml`, zahodit staré kandidáty a
  zkontrolovat, jestli některý zdroj nevyschl nebo nezměnil URL.

## Týdenní rutina

1. Otevřít pět zdrojů z tabulky výše.
2. Každý nápad, který vypadá jako rozšíření webu, zapsat do `data/objevy.yaml`
   jako `stav: novy`. Neposuzovat hned.
3. U každého kandidáta vyplnit `typ`, `nazev`, `url`, `proc`.
4. Projít staré `novy` a `posuzuje-se`; co je starší než měsíc, rozhodnout.
5. Spustit `npm run objevy` a zkontrolovat, že seznam dává smysl.
6. Až po triage založit položku v `data/chybi.yaml` nebo stránku.

## Filtr: co na web patří

Tvrdá pravidla z `AGENTS.md`:

- **Jen hotová zařízení se 128 GB a více unified paměti.** Žádné whiteboxy,
  racky ani modely na dvou boxech.
- **Model katalogu je jen Qwen3.8 Flash Next.** Jiné LLM jen jako varování
  nebo srovnání, nikdy jako doporučení.
- **Generativní modely** mají vlastní databázi a vlastní pravidla (licence,
  nároky, rychlost).
- **Musí se vejít na jedno zařízení** včetně KV cache a rozumného kontextu.
- **Každé tvrzení má veřejný zdroj s datem.** Vlastní měření neděláme.

Když kandidát některé pravidlo nesplňuje, patří do `zamitnuto` s důvodem.
Ne do šuplíku.

## Čtyři otázky triage

1. **Patří to na web?** Projde filtrem výše?
2. **Je to nové?** Nemáme to už v katalogu, v tématech nebo v registru?
3. **Dá se to doložit?** Existuje veřejný zdroj, ideálně dva?
4. **Má to pro čtenáře hodnotu?** Pomůže mu vybrat, spustit nebo pochopit?

Když je odpověď na první tři „ano“ a na čtvrtou „nevím“, je to téma pro
provozovatele, ne pro automatické zařazení.

## Rozhodovací strom

```
Nový nápad
  ├─ zařízení ≥128 GB, turnkey? ── ne → zamítnout
  │     └─ ano → nová OEM varianta nebo stránka zařízení
  ├─ LLM? ── ano → je to Qwen3.8 Flash Next? ── ne → jen varování
  │     └─ ano → nová verze nebo kvantizace
  ├─ generativní model? ── ano → data/generativni-modely.yaml + licence
  ├─ runtime nebo nástroj? ── ano → ověřit, co mění na datech
  ├─ téma nebo dotaz? ── ano → data/temata.yaml
  └─ zdroj? ── ano → data/zdroje.yaml + co z něj sledujeme
```

## Kam co zapsat

| Kandidát | Kam | Co dál |
|---|---|---|
| Zařízení | `data/objevy.yaml`, po schválení `data/zarizeni.yaml` | stránka, cena, měření |
| Generativní model | `data/objevy.yaml`, po schválení `data/generativni-modely.yaml` | licence, nároky, čas |
| Nová verze Qwen | `data/objevy.yaml` | model card, měření, changelog |
| Téma | `data/temata.yaml` | stránka, interní odkazy |
| Zdroj | `data/zdroje.yaml` | co sledovat, frekvence |
| Měření | `data/mereni.yaml` | konfigurace, důvěryhodnost |

## Jak vypadá dobrý záznam

```yaml
- id: O-002
  datum: 2026-11-12
  typ: zarizeni
  nazev: "Nový 128GB box"
  url: https://vyrobce.example/produkt
  proc: "Chybí nám levnější varianta se 128 GB."
  stav: novy
  poznamka: "Ověřit českou cenu a dostupnost."
```

U zamítnutého kandidáta vždy `duvod`, aby se stejný nápad za půl roku
neřešil znovu.

## Publikace nové věci

1. Data do `data/*.yaml` s `zdroj`, `overeno` a typem údaje.
2. Stránka podle šablony v `AGENTS.md`.
3. Interní odkazy z existujících stránek (zařízení, model, slovník).
4. Zdroj do `data/zdroje.yaml`.
5. Zápis do `data/zmeny.yaml`.
6. `npm run check`, build, kontrola odkazu.
7. V `data/objevy.yaml` přepnout na `prevzato`.

## Kdy kandidáta zamítnout

- Je pod 128 GB, whitebox, rack nebo cloud.
- Vyžaduje pool, tensor parallel mezi boxy nebo offload.
- Je to dense model, který na boxu poběží nepoužitelně.
- Nemá veřejný zdroj nebo jen marketingové číslo.
- Je to historický model, který nemá co říct dnešnímu čtenáři.
- Je to novinka, která se netýká lokálního provozu.

## Měsíční kontrola

- Kolik kandidátů přibylo a kolik se jich zařadilo?
- Neopakují se zamítnuté nápady? Pokud ano, chybí důvod.
- Nejsou v `data/objevy.yaml` položky starší než měsíc bez rozhodnutí?
- Nevyšel nový zdroj, který by měl být v `data/zdroje.yaml`?

## Kudy dál

- [Registr mezer](data/chybi.yaml) — co u zařazených věcí chybí.
- [Aktualizace dat](aktualizace.md) — jak se mění ceny a měření.
- [Zdroje](/zdroje/zdroje/) — co sledujeme a proč.
- [Metodika](/o-webu/metodika/) — jak ověřujeme čísla.

*Stav k 5. 11. 2026.*
