# Plán: generativní AI (obrázky, video, audio, 3D, překlady)

*Historie návrhu. Sekce Generování je hotová; aktuální seznam mezer a
dalších kroků je v [`data/chybi.yaml`](data/chybi.yaml) a [`chybi.md`](chybi.md).
Stav k 5. 11. 2026.*

---

## 1. Rozhodnutí, které je potřeba udělat první

Dnešní web řeší **jen textový model Qwen3.8 Flash Next na 128GB zařízeních**.
Generativní obrázky, video a 3D jsou jiný svět:

- běží na jiných modelech (difuzní, ne LLM),
- mají jiné nároky (VRAM, CUDA jádra, doba běhu),
- část nejlepších modelů má **restriktivní licence** (Qwen Research,
  FLUX non-commercial, LTX nad 10 mil. USD obratu, MiniMax H3 mimo US).

**Otázka:** držíme se i tady zařízení z katalogu (128 GB unified), nebo
u generativních modelů připustíme i srovnání s cloudem a jiným hardwarem?

Doporučení: **primárně „co z toho poběží na našich 128GB strojích“**,
cloud jen jako kontextová poznámka („kdy je lepší cloud“). Jinak web
ztratí svůj rozdíl.

---

## 2. Struktura sekce

`/generovani/` jako nová hlavní kategorie, s podstránkami:

| Stránka | Co řeší |
|---|---|
| `/generovani/` | rozcestník a přehled, co dnes jde lokálně |
| `/generovani/obrazky/` | fotorealistické obrázky, plakáty, typografie |
| `/generovani/uprava-obrazku/` | částečné úpravy, inpainting, mazání objektů, pozadí |
| `/generovani/video/` | text→video, obrázek→video |
| `/generovani/uprava-videa/` | prodlužování, přehrávání, střih, titulky |
| `/generovani/rozhybani-obrazku/` | animace fotky nebo ilustrace |
| `/generovani/audio/` | TTS, klonování hlasu, podcast, dabing |
| `/generovani/preklady/` | překlad textů i titulků, lokalizace |
| `/generovani/3d/` | image→3D, PBR materiály, herní assety |
| `/generovani/herni-prvky/` | sprity, UI, textury, koncepty |

Každá stránka má jednotnou šablonu (viz bod 5).

---

## 3. Datový model

Nový soubor `data/generativni-modely.yaml`:

```yaml
- id: z-image-turbo
  nazev: Z-Image-Turbo
  kategorie: obrazky
  vyrobce: Tongyi-MAI (Alibaba)
  licence: Apache-2.0
  komercni_pouziti: ano
  parametry_b: 6
  naroky: "16 GB VRAM, 24 GB unified"
  runtime: [ComfyUI, Diffusers]
  kvalita: "fotorealismus, anglický a čínský text"
  slozitost: "nízká"
  zdroje: [https://...]
  overeno: 2026-11-05
```

Povinné: licence a `komercni_pouziti` — u firemního publika je to
často důležitější než kvalita.

Doplnit validaci v `scripts/schema.mjs` a `kontrola-dat.mjs`.

---

## 4. Kandidáti podle oblastí (k ověření)

### Obrázky

| Model | Licence | Nároky | Proč |
|---|---|---|---|
| **Z-Image-Turbo** | Apache-2.0 | ~16 GB | nejlepší poměr kvalita/rychlost, text v obraze |
| **FLUX.2 [klein] 4B** | Apache-2.0 | ~13 GB | nejrychlejší, interaktivní |
| **Qwen-Image 2.1 / Turbo** | Qwen Research (nekomerční) | ~24 GB | typografie, RGBA, 10 referencí |
| **FLUX.2 [dev] 32B** | non-commercial | 24–48 GB | nejvyšší kvalita, pomalejší |
| **HunyuanImage 3.0** | community | 80B MoE | jen pro silný hardware |
| **Stable Diffusion 3.5** | community | 8–16 GB | ekosystém, LoRA, fine-tuny |

### Úprava obrázků

- **Qwen-Image-Edit / 2.1** — úpravy tahem, maskou, více referencí.
- **FLUX.2** — generování i editace v jednom modelu.
- **ComfyUI inpainting** — klasická cesta pro částečné úpravy.

### Video

| Model | Licence | Nároky | Proč |
|---|---|---|---|
| **Wan 2.2** | Apache-2.0 | 8–48 GB | nejlepší licence, 5B i 14B (MoE) |
| **HunyuanVideo 1.5** | Tencent community (mimo EU/UK/KR) | ~14 GB s offloadem | nejlepší tváře |
| **LTX-2.5 / 2.3** | zdarma do 10 mil. USD obratu | 32 GB+ | video i zvuk v jednom |
| **Kandinsky 6.0** | community | 16 GB | kompromis kvalita/nároky |
| **MiniMax H3** | mimo US | vysoké | kvalita, ale licenčně nepoužitelné v US |

### Rozhýbání obrázků

- **Wan 2.2 I2V**, **HunyuanVideo I2V**, **LTX I2V**, **Wan Animate 2** (ComfyUI).
- Na Macu: **Draw Things**, **mlx-video** (Wan, LTX; bez zvuku).

### Audio

| Model | Licence | Proč |
|---|---|---|
| **Kokoro-82M** | Apache-2.0 | běží na CPU, rychlé, pevné hlasy |
| **Qwen3-TTS** | Apache-2.0 | klonování, 10 jazyků |
| **VoxCPM2** | open weights | 48 kHz, klonování, MLX na Macu |
| **Chatterbox** | MIT/Apache | klonování, dobrá kvalita |
| **Ming-3.0-tts** | MIT | nejlepší komerční výsledek v aréně |
| **Voxtral TTS** | CC (ověřit) | evropský, 3s klonování |

### Překlady

Kandidáti k ověření: **Qwen-MT**, **NLLB-200**, **SeamlessM4T v2**,
**MADLAD-400**, případně Qwen3.8 Flash Next s dlouhým kontextem.
Pozor na licence (NLLB a Seamless jsou CC-BY-NC).

### 3D a herní assety

| Model | Licence | Proč |
|---|---|---|
| **TRELLIS.2** | MIT | 4B, image→3D s PBR, 1536³ |
| **Pixal3D** | open (ověřit) | věrnost předloze, SIGGRAPH 2026 |
| **Hunyuan3D 2.x** | Tencent community | nejpoužívanější, 2stupňový pipeline |
| **TripoSR / Stable Fast 3D** | MIT / community | rychlé hrubé assety |
| **PartCrafter** | open (ověřit) | jeden obrázek → více meshů |

---

## 5. Rychlost na našich konfiguracích

Tohle je jádro celé sekce — čtenář chce vědět, jestli mu obrázek vznikne
za 8 sekund, nebo za dvě minuty. Proto u každého modelu bude platit:

**vždy uvést: zařízení + kvantizaci + rozlišení + počet kroků + engine.**
Bez toho je číslo k ničemu.

### Co už je veřejně naměřené (DGX Spark, ComfyUI, 1024×1024)

| Model | Kroky | Čas na obrázek | Paměť |
|---|---|---|---|
| FLUX.2 [klein] 4B | 4 | **3,1 s** | 18,3 GB |
| Z-Image-Turbo | 8 | **7,5 s** | 24,4 GB |
| Qwen-Image 2.1 Turbo | 8 | **9,5 s** | 31,5 GB |

Zdroj: [LocalAgentBoard](https://localagentboard.com/images), vlastní
test na jednom DGX Sparku, 29. 10. 2026. Převzato, ne naše měření.

### Jak doplnit ostatní zařízení

1. **Hledat komunitní čísla** pro Strix Halo, RTX Spark a Mac (M5 Max)
   u stejných modelů a stejného rozlišení.
2. **Kde čísla nejsou, dopočítat** z veřejného výkonu čipu a počtu
   kroků; označit `vypocet` a uvést vstupní hodnoty.
3. **Kde není ani výpočet**, napsat `[DOPLNIT]` — ne odhad „od oka“.

### Orientační stupnice použitelnosti

| Výstup | Použitelné | Hraniční | Nepoužitelné |
|---|---|---|---|
| Obrázek 1024² | do 15 s | 15–60 s | nad 60 s |
| Video 5 s, 720p | do 3 min | 3–10 min | nad 10 min |
| Hlas 1 minuta řeči | do 30 s | 30–120 s | nad 2 min |
| 3D asset | do 60 s | 1–5 min | nad 5 min |

Tato stupnice patří na každou stránku — číslo bez kontextu čtenáři
nepomůže.

### Co bude v tabulce u každého modelu

| Sloupec | Příklad |
|---|---|
| Zařízení | DGX Spark 128 GB |
| Engine | ComfyUI 0.44 |
| Rozlišení | 1024 × 1024 |
| Kroky | 8 |
| Čas | 7,5 s |
| Typ údaje | naměřeno / výpočet |
| Zdroj | odkaz |

Pro video navíc: délka klipu, fps, rozlišení a jestli je zvuk.
Pro audio: vzorkovací frekvence a délka vstupu.
Pro 3D: rozlišení voxelů a formát výstupu.

---

## 6. Šablona stránky (jednotná)


1. **Co to umí** — jedna věta a tři příklady použití.
2. **Co z toho poběží u nás** — tabulka model × naše zařízení × čas na
   jeden výstup (s nebo bez zdroje).
3. **Licence** — komerční použití ano/ne/za podmínek, výslovně.
4. **Jak začít** — runtime (ComfyUI, MLX, Draw Things), odkaz na návod.
5. **Kde je limit** — kvalita, rychlost, VRAM, rozmazání textu…
6. **Zdroje** — model card, měření, licence.

---

## 7. TODO po fázích

### Fáze 0 — rozhodnutí (blokuje zbytek)

- [x] Rozsah: jen 128GB zařízení, nebo i cloud? — rozhodnuto: jen 128GB.
- [x] Má být nová sekce v hlavním menu, nebo pod `/modely/`? — rozhodnuto: vlastní sekce.
- [x] Chceme u generativních modelů měření z komunit (jako u LLM),
      nebo jen popis a doporučení? — rozhodnuto: převzatá měření se zdrojem.

### Fáze 1 — data a jedna vzorová stránka

- [x] `data/generativni-modely.yaml` + schema + validace.
- [ ] Registr zdrojů: model cards, licence, ComfyUI docs, oMLX, Draw Things. — částečně; chybí Draw Things a jednotlivé model cards.
- [x] Vzorová stránka: **obrázky** (nejzralejší obor).
- [x] Zjistit reálné časy na 128GB strojích z komunitních měření. — DGX, Strix, Mac a RTX Spark; video a 3D částečně (G08).
- [x] Rychlostní tabulka pro každé zařízení (DGX, RTX, Strix, Mac) — obrázky, video, audio, 3D. — tabulky jsou v receptech a na stránkách zařízení.

### Fáze 2 — video a audio

- [x] Video: Wan 2.2 vs HunyuanVideo 1.5 vs LTX — licence, nároky, kvalita.
- [x] Audio: TTS + klonování + podcast; upozornit na souhlas s hlasem.
- [x] Stránky: video, úprava videa, rozhýbání obrázků, audio.
- [x] Recepty ComfyUI pro Windows, macOS, DGX OS a Linux.

### Fáze 3 — 3D, hry, překlady

- [x] 3D: TRELLIS.2, Hunyuan3D, Pixal3D; formáty GLB, PBR.
- [x] Herní prvky: sprity, UI, textury — návaznost na 3D.
- [x] Překlady: modely, kvalita češtiny, titulky.

### Fáze 4 — propojení

- [x] Odkazy ze stránek zařízení („co na tom poběží“ rozšířit
      o generativní modely).
- [ ] Slovník: pojmy difuze, LoRA, VRAM, PBR, TTS, STT. — chybí VRAM a STT (G09).
- [ ] Témata: „AI na obrázky lokálně“, „AI video lokálně“ atd. — O06.

---

## 8. SEO termíny

- „lokální generování obrázků“, „AI obrázky na vlastním počítači“
- „AI video lokálně“, „Wan 2.2 na 128 GB“
- „AI dabing česky“, „klonování hlasu lokálně“
- „AI 3D model z fotky“, „TRELLIS 2“
- „překlad s lokálním modelem“

---

## 9. Rizika

- **Licence.** U firemního publika je to první otázka. Bez ní stránka
  škodí.
- **Rychlost.** Video na 128GB boxu jsou minuty na klip, ne sekundy.
  Čtenář to musí vědět dřív, než koupí.
- **Zastarávání.** Generativní modely se mění po měsících; každá stránka
  potřebuje datum a zdroj.
- **Rozsah.** Deset podstránek je velký projekt. Začít jedním oborem
  (obrázky) a ověřit, jestli to má návštěvnost.

---

## 10. Otevřené otázky

- Kolik prostoru dát licencím? Samostatná stránka „licence generativních
  modelů“ by byla užitečná.
- Chceme u generativních modelů i ceny? Většina je zdarma, platí se
  hardware a elektřina.
- Má se sekce jmenovat „Generování“ nebo „Obrázky, video a 3D“?
