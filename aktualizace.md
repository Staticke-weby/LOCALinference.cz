# Aktualizace dat a správa zdrojů

*Pracovní postup pro provozovatele a agenty. Cíl: data nezastarají a každá
změna je dohledatelná.*

---

## 1. Co se aktualizuje a jak často

| Co | Kde | Frekvence | Kdo |
|---|---|---|---|
| Ceny zařízení | `data/zarizeni.yaml` | týdně / při změně | hlídač + člověk |
| Kurzy ČNB/ECB | `data/kurzy.yaml` | denně / při buildu | hlídač |
| Nové modely a model cards | `data/modely.yaml` | týdně | hlídač + člověk |
| Měření | `data/mereni.yaml` | při novém testu | člověk |
| Zdroje a jejich stav | `data/zdroje.yaml` | týdně | hlídač |
| Changelog | `data/zmeny.yaml` | při každé změně | člověk |
| Texty stránek | `obsah/` | při změně faktu | člověk |

**Pravidlo:** nikdy neměň číslo bez data a zdroje. Když zdroj chybí, použij
`[DOPLNIT]` a zapiš to do `poznamky-agenta.md`.

---

## 2. Týdenní rutina

1. Spustit hlídač: `npm run hlidac` (nebo workflow v GitHub Actions).
2. Projít report: nové verze modelů, změny cen, nové články.
3. U každé novinky rozhodnout:
   - **relevantní** → založit issue s checklistem,
   - **nerelevantní** → zavřít s poznámkou,
   - **nejisté** → označit `[DOPLNIT]` a ověřit u primárního zdroje.
4. Ověřit ceny a kurzy; přepočítat CZ/EN.
5. Ověřit, zda některé měření nevypršelo (nová verze enginu, nová kvantizace).
6. Aktualizovat `data/zmeny.yaml`.
7. `npm run build` a kontrola odkazů.
8. Publikovat.

---

## 3. Jak přidat zdroj

Do `data/zdroje.yaml`:

```yaml
- id: kratke-id
  nazev: Název zdroje
  url: https://…
  typ: rss            # rss | github | hf | html | api
  co_sledujeme: [cena, model, mereni]
  frekvence: tydne
  priorita: stredni  # vysoka | stredni | nizka
  posledni_kontrola: 2026-11-04
  stav: ok
  poznamka: "Co z něj na web teče."
```

Podmínky:

- Zdroj musí být primární (výrobce, model card, dokumentace) nebo nezávislý
  (měření, benchmark). U komunitních měření uveď konkrétní setup.
- Musí být jasné, **kterou stránku nebo tabulku** zásobuje.
- Když zdroj zanikne, označ `stav: chyba` a najdi náhradu.

---

## 4. Jak aktualizovat cenu

1. Ověř cenu u oficiálního prodejce nebo OEM, ne u překupníka.
2. Zapiš datum (`cena.overeno`) a zdroj (`cena.zdroj`).
3. Zkontroluj, zda jde o cenu s DPH nebo bez; do dat ulož jednotně bez DPH
   a poznamenej to.
4. Přepočet nech na `data/kurzy.yaml`; nikdy nepiš ručně do textu.
5. Zapiš změnu do `data/zmeny.yaml` a uprav `last_verified` na stránce.

---

## 5. Jak přidat měření

Nové měření = nový záznam, nikdy nepřepisuj starý. **Data přebíráme od
zdroje; nikdy netvrď, že jsi měřil ty.** Do záznamu patří i to, kdo měřil
a jak důvěryhodný zdroj je.

```yaml
- id: 2026-11-10-dgx-spark-qwen38-nvfp4
  datum: 2026-11-10
  zarizeni: dgx-spark
  model: qwen3-8-flash-next
  kvantizace: NVFP4
  engine: vLLM
  engine_verze: "0.30.0"
  kontext: 32000
  kontext_strop: 262144
  ttft_ms: 850
  prefill_toks: 1200
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
  typ: namereno
  mereno_kym: nezavisle    # vyrobce | nezavisle | komunita | my
  zdroj_typ: nezavisle
  duveryhodnost: stredni   # vysoka | stredni | nizka
  rozptyl:
    min: 60
    max: 79
    jine_zdroje: [https://…]
  normalizace: "single-stream, kontext 32k, bez fronty"
  interpretace: "Pro plánování použij 40 tok/s, ne 70."
  zdroj: https://…
  poznamka: "Stejný prompt, stejná kvantizace, bez fronty."
```

**Minimální sada pro zveřejnění:** zařízení, model, kvantizace, engine,
kontext, decode tok/s, typ a zdroj. TTFT a prefill jsou silně doporučené;
bez nich se nedá mluvit o „použitelnosti“.

---

## 6. Jak publikovat změnu

1. Uprav data nebo text.
2. Aktualizuj `last_verified`.
3. Přidej záznam do `data/zmeny.yaml`:

```yaml
- datum: 2026-11-10
  typ: cena
  titulek: "DGX Spark zlevnil na 6 500 USD"
  co_se_zmenilo: "Nová cena u NVIDIA; přepočet CZK aktualizován."
  dotcene_stranky: [zarizeni/dgx-spark, vyber/rozpocet]
  zdroj: https://…
```

4. Spusť `npm run check` a `npm run build`.
5. Commit s popisem, co a proč se změnilo.

---

## 7. Hledání novinek

Kromě hlídače jednou týdně projít:

- Qwen blog a Hugging Face novinky,
- NVIDIA a AMD oznámení (DGX, RTX Spark, Strix/Gorgon Halo),
- Apple Mac Studio / MLX,
- vLLM, SGLang a llama.cpp releases,
- llamaperf a InferenceX nová měření,
- české a evropské zdroje o lokální AI (okrajově).

Používat konkrétní dotazy, ne obecné „AI news“:

- „Qwen3.8 Flash Next DGX Spark tok/s“
- „Strix Halo 128GB llama.cpp Qwen3.8“
- „Mac Studio M5 Ultra MLX local LLM“
- „DGX Station GB300 inference benchmark“
- „llama.cpp release MTP“

Výsledek vždy ověřit u primárního zdroje. Novinový titulek není fakt.
