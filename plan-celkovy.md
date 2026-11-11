# Celkový plán webu LOCALinference

*Verze 2.3 — 11. listopadu 2026*

**Stav:** celek A (abliterace), celek B (sandboxing agentů) a celek C
(provoz agentů) jsou napsané a publikované. Zbývají datové mezery
A01, A04, A05 a A06 a průběžná údržba.

Tento dokument je **hlavní přehled**: co je hotové, co zbývá ze
starého plánu a co obsahuje nová část o abliterovaných modelech,
sandboxingu a běhovém prostředí agentů. Podrobné osnovy jsou
v `plan-rozsireni-temat-slovniku.md` a
`plan-abliterace-sandbox-agenti.md`; tento soubor je spojuje
a doplňuje rozhodnutí, která z nich plynou.

---

## 1. Stav k 10. 11. 2026

| Metrika | Hodnota |
|---|---:|
| Publikovaných stránek | 180 |
| Témat | 42 |
| Hesel ve slovníku | 56 |
| Záznamů měření | 23 |
| Sledovaných zdrojů | 71 |
| Položek v registru mezer | 48 (19 hotovo, 11 otevřeno, 17 průběžně, 1 čeká na vás) |
| Build a audity | 0 chyb, 0 varování, strict prolinkování 0 chyb |

**Hotovo ze starého plánu:**

- Dávky 0–3: tenká témata přepsána, clustery Čeština, RAG, Agenti,
  Provoz a Praxe postavené, generování a recepty sjednocené,
  troubleshooting a FAQ hotové.
- Dávka 4: `/data/` jako přehled 23 měření s filtrem a grafem,
  Mac Studio a MacBook Pro rozšířené, titulky a synonyma slovníku,
  provoz v menu, strict audit v CI.
- Infrastruktura: kontaktní e-mail, sekce Chyby a opravy, registr
  mezer, changelog, hlídač zdrojů.

**Zbývá ze starého plánu:**

- obsahové briefy pro 6 prioritních témat (artefakt, dnes nahrazený
  praxí),
- měsíční kontrola Search Console (proces),
- EN mutace — blokuje I02 (Pages a workflow v repu `.eu`),
- datové mezery: D01, D02, D03 (P0), D04, D06, D08, D10, D11, D12,
  G10, Z06 (P1), O03, O05 (P2).

---

## 2. Nová část A — abliterované a necenzurované modely

### 2.1 Proč cluster a co musí obsahovat

Téma má tři různé hledané otázky: co je odmítání, jak abliterace
funguje a jestli to lze provozovat na 128 GB. Proto cluster, ne
jeden článek.

| Stránka | Slov | Účel |
|---|---:|---|
| `/temata/abliterace/` | 2 200 | rozcestník a rozhodnutí |
| `/temata/abliterace/odmitani/` | 1 400 | co je refusal a jaké oblasti pokrývá |
| `/temata/abliterace/jak-abliterace-funguje/` | 1 800 | technika bez návodu na zneužití |
| `/temata/abliterace/provoz-na-128-gb/` | 1 600 | formáty, PLE z SSD, parita |
| `/temata/abliterace/rizika-a-pravo/` | 1 500 | dopady, AI Act, GDPR, licence |
| `/temata/abliterace/kdo-je-tvori/` | 1 200 | vydavatelé, provenance, indexy |
| `/modely/qwen3-8-flash-next-abliterated/` | 1 500 | konkrétní varianta, draft |

**Redakční věta na každé stránce celku A:**

> Toto je vysvětlení, ne návod k obejití bezpečnostních opatření.
> Abliterovaný model nemá zábrany a odpovědnost za výstup nese ten,
> kdo ho provozuje.

### 2.2 Odmítání: taxonomie

Stránka `/odmitani/` musí vysvětlit rozdíl mezi odmítnutím,
varováním, přesměrováním a selháním nástroje. Oblasti pokrývá
tabulka, ne konkrétní prompty:

| Oblast | Proč ji model odmítá | Co po abliteraci hrozí |
|---|---|---|
| Násilí a zbraně | škoda na zdraví | návod k ublížení |
| Nezákonné jednání | trestní odpovědnost | podpora trestné činnosti |
| Drogy | zdraví a zákon | dávkování, výroba |
| Sebepoškozování | ochrana života | eskalace krize |
| Sexuální obsah, nezletilí | zákon a etika | závažná trestná činnost |
| Nenávist a dehumanizace | ochrana skupin | šíření nenávisti |
| Soukromí a osobní údaje | GDPR a důstojnost | doxxing, profilování |
| Zdraví a právo | odborná odpovědnost | nebezpečná rada |
| Autorské právo | licence a právo | plagiát, porušení |
| Kybernetická bezpečnost | zneužití | útok, malware |
| Politická persuaze | manipulace | dezinformace |
| Obcházení pravidel | integrita systému | jailbreak |

Součástí je i **přemrštěné odmítání** (over-refusal) u benigních
dotazů, protože to je druhý důvod, proč lidé abliteraci chtějí.

### 2.3 Jak abliterace funguje

- Alignment: SFT, RLHF/DPO, safety data.
- **Refusal direction** v residual streamu (Arditi et al., 2024,
  arXiv 2406.11717).
- Metody: diff-in-means, orthogonalizace, LoRA, Heretic.
- Co se mění ve vahách a proč to přežije kvantizaci.
- **Model látku pořád zná**, jen ji přestane odmítat.
- Vedlejší efekty: pokles obecné kvality, horší instrukční
  poslušnost, vyšší halucinace, rozbité tool calling.

Do stránky nepatří konkrétní jailbreak prompty ani postup výroby
za účelem obejít bezpečnost u modelu, jehož licence to zakazuje.

### 2.4 Provoz na 128 GB a n-gramy z SSD

**Klíčové kritérium:** runtime musí umět držet n-gramovou (PLE)
tabulku na SSD. NVIDIA to u základu dělá přes
`VLLM_PLE_TABLE_MEMORY=disk` a `B12X_DISK_BACKEND=io_uring`;
na DGX Sparku s offloadem udává **1M tokenů FP8 KV cache**.

| Build | Disk | PLE z SSD | Poznámka |
|---|---:|---|---|
| `DevelopingDad/...-FP4-Local-Abliterated` | 102,3 GB | ano, launcher | stejný layout jako NVIDIA FP4-Local; 104 GiB cap; MTP 4 drafty |
| `DevelopingDad/...-Uncensored-NVFP4-DGX-Spark` | 183,5 GB | ano, mmap BF16 PLE | 100 GiB container bez swapu; vLLM 0.30.0 |
| `lflare/...-CSF-QAD-Abliterated` | 102,8 GB | ano, `VLLM_PLE_TABLE_MEMORY=disk` | Qwen Community License; měřená shoda schopností |
| `huihui-ai/...-abliterated-v2-GGUF` | 93,6 GB | ne (GGUF) | Strix Halo, Mac |
| `mradermacher/...-i1-GGUF` | 97,5 GB | ne (GGUF) | imatrix kalibrace |
| `grant-ai/...-MTPLX-4bit` | 115,1 GB | ne (MLX) | na 128 GB Mac těsné |

**Co se nevejde nebo není turnkey:** `orcarouter/...-NVFP4`
(183,5 GB, bez veřejného launcheru), `mazinb/...` (186,4 GB,
nerozdělené načítání), `huihui-ai/...-abliterated` (360 GB BF16).

**Požadavky na SSD:** NVMe (ne SATA, ne síť), io_uring, dost
page cache, pinovaný B12X kontejner, měření TTFT a stability
decode při 32k/128k/262k.

### 2.5 Parita: co musí být doloženo

| Kritérium | Jak | Tolerance |
|---|---|---|
| Stejný základ | stejná revize, tokenizer, MTP, vision | musí sedět |
| Stejný formát | NVFP4, FP8 KV, stejný engine a flags | musí sedět |
| Počet parametrů | safetensors total shodný se základnou | musí sedět |
| Decode | 8k a 32k, 1 stream, 3 běhy | ±5 % |
| TTFT a prefill | stejné prompty | ±10 % |
| Souběžnost | 4 požadavky | bez pádu a swapu |
| Kvalita | veřejné benchmarky + 20 českých úloh | bez propadu > 2 body |
| Odmítání | 50 benigních + 50 škodlivých promptů | odmítání klesne, benigní ne |

**Doložená čísla k 10. 11. 2026 (tvrzení vydavatelů):**

- DevelopingDad FP4-Local-Abliterated: 38,0 tok/s próza a 54,3 kód
  proti 39,4 / 50,7 u základu; odmítnutí 0/100 vývoj a 6/100
  holdout proti 99/100 a 100/100 u základu.
- lflare CSF: GPQA 166/198 proti 164/198, MTP acceptance 59,5 %
  proti 61,0 %, odmítnutí 0/200 v protokolu A.
- Nezávislé měření chybí. Proto stránka variantu zůstává draft.

**Rozhodnutí k právu a licencím (10. 11. 2026):**

- **Právní review se neprovádí.** Text musí být věcný, zodpovědný,
  s jasným „není právní rada“ a vymezením odpovědnosti. Riziko nese
  provozovatel webu.
- **Licence se uvádějí tak, jak je uvádí vydavatel i základní model.**
  Když se rozcházejí (Qwen Community vs. NVIDIA Open Model vs.
  Apache-2.0), popíšou se obě strany a rozdíl; nevybírá se „lepší“
  licence a netvrdí se, že rozpor je vyřešený.

### 2.6 Rizika, právo a licence

- **Co může model způsobit:** nezákonný obsah, návod k ublížení,
  dezinformace, nenávist, únik soukromí, nebezpečné rady.
- **Odpovědnost:** provozovatel a uživatel, ne model.
- **AI Act:** high-risk při nasazení v rozhodování o lidech;
  transparentnost.
- **GDPR:** logy, retence, práva subjektů.
- **Licence:** Qwen Community License 1.0 u Qwen odvozenin;
  NVIDIA Open Model Agreement u DevelopingDad (přes FP4-Local);
  OrcaRouter uvádí Apache-2.0, což je v rozporu se základem.
  Před publikací ověřit (A03).

### 2.7 Kdo to tvoří

- Jednotlivci: huihui-ai.
- Týmy: OrcaRouter.
- Nakladatelé: lflare, DevelopingDad, myllmbox.
- Indexy: abliteratedmodels.org, abliter.cn — katalog, ne důkaz.
- Jak poznat solidní kartu: metoda, míra odmítnutí před/po,
  známé ztráty, licence, datum, hashe.

### 2.8 Mezery celku A

| ID | Priorita | Co chybí |
|---|---|---|
| A01 | P0 | nezávislá parita abliterovaného NVFP4 |
| A02 | — | **uzavřeno rozhodnutím:** právní review se nedělá; text musí být věcný, zodpovědný a s vymezením odpovědnosti |
| A03 | — | **uzavřeno rozhodnutím:** licence se uvádějí tak, jak je uvádí vydavatel i základní model; rozpor se popíše, nevybírá |
| A04 | P1 | česká sada 50+50 promptů na odmítání |
| A05 | P1 | vliv PLE z SSD na TTFT a decode |
| A06 | P1 | PLE z SSD na RTX Sparku (Windows ARM) |

---

## 3. Nová část B — sandboxing agentů

**URL:** `/temata/provoz/sandbox-agentu/`
**Rozsah:** 3 500–4 500 slov, jeden článek.

### Osnova

1. Sandbox není antivirus, je to hranice.
2. Model hrozeb: prompt injection, únik dat, neoprávněná akce,
   smyčka, supply chain, eskalace.
3. Čtyři vrstvy: proces, souborový systém, síť, identita.
4. Úrovně izolace: žádná, kontejner, microVM, gVisor, WASM,
   vzdálený sandbox.
5. Souborový systém: read-only, allowlist, oddělený uživatel.
6. Síť: egress allowlist, DNS, proxy, metadata.
7. Identita: scoped tokeny, OAuth, rotace.
8. Lidské schválení: které akce musí projít kartou.
9. Limity: CPU, RAM, čas, kroky, velikost výstupu.
10. Logy a audit: co ano, co nikdy, retence.
11. Testování obrany: negativní testy.
12. Kolik to stojí: režie kontejneru vs. microVM vs. vzdálený.
13. Kdy to nepoužívat.
14. Kudy dál a zdroje.

**Povinné prvky:** SVG diagram vrstev, tabulka izolace,
výpočet paměti (128 GB − model − KV − režie), výpočet doby
startu vs. počet kroků, český příklad s fakturami.

**Zdroje:** gVisor, Firecracker, Docker security, E2B, Daytona,
Wasmtime, OWASP LLM Top 10, NIST AI RMF.

---

## 4. Nová část C — kde provozovat agenty

**URL:** `/temata/agenti/kde-provozovat-agenty/`
**Rozsah:** 3 500–4 000 slov, jeden článek.

### Taxonomie (čtyři vrstvy)

| Vrstva | Co to je | Nástroje |
|---|---|---|
| Terminálový harness | agent v terminálu nad repem | pi, omp, OpenCode |
| Desktopový workspace | aplikace pro session a review | OpenChamber, MausBot |
| Gateway / messaging | agent na serveru, dosažitelný z chatů | OpenClaw, Hermes |
| Orchestrace | správa více agentů a worktrees | Herdr |

**Vynecháno:** nástroje velkých poskytovatelů (Claude Code, Codex CLI,
Gemini CLI, Claude Cowork, Grok Bot), T3 Code, VS Code a všechna
editorová rozšíření (Cline, Roo Code, Continue), Cursor, Windsurf, Zed,
tmux a Zellij, computer-use agenti (UI-TARS, Agent S, Agent Zero),
cloudové sandboxy (E2B, Daytona, Box) a frameworky (LangChain, CrewAI).

Důvod: článek je o **nezávislých nástrojích, které jde připojit
k lokálnímu modelu**, ne o ekosystému velkých poskytovatelů, editorech
nebo infrastruktuře bez vazby na model.

### Struktura

1. Rychlá odpověď.
2. Co je harness a co není.
3. Čtyři vrstvy + diagram.
4. Co musí nástroj umět s lokálním modelem.
5. Terminálové harnessy: pi, omp, OpenCode.
6. Desktopový workspace: OpenChamber a MausBot.
7. Gateway: OpenClaw a Hermes.
8. Orchestrace: Herdr.
9. Srovnávací tabulka.
10. Rozhodovací strom.
11. Režie a náklady.
12. Bezpečnostní minimum.
13. Kdy to nepoužívat.
14. Kudy dál a zdroje.

### Podstránky (mimo menu)

- `/temata/agenti/nastroje/pi/`
- `/temata/agenti/nastroje/omp/`
- `/temata/agenti/nastroje/opencode-a-openchamber/`
- `/temata/agenti/nastroje/mausbot/`
- `/temata/agenti/nastroje/openclaw/`
- `/temata/agenti/nastroje/hermes/`
- `/temata/agenti/nastroje/herdr/`

Každá 600–900 slov: co to je, licence, připojení lokálního modelu,
instalace, workflow, limity, bezpečnost, kdy to nepoužít, zdroje.
Do menu se nezařazují; odkazuje na ně pilíř a tabulka.

**MausBot:** desktop harness s approval kartami, Apache-2.0,
harness na `127.0.0.1`, lokální endpoint přes OpenAI kompatibilní
API. Ověřit, které enginy lokální endpoint podporují, a uvést
platformy včetně omezení na Ubuntu (Xorg, ne Wayland).

**Hermes:** self-hosted asistent a gateway, MIT; plnohodnotná
podstránka, ne jen řádek v tabulce. Ověřit dokumentaci k lokálnímu
modelu, schvalování příkazů, kanály, platformy a licenci.

**Pozor:** u OpenClaw ověřit licenci (GitHub uvádí MIT, vendorská
stránka Apache-2.0) a výchozí oprávnění shellu. U každého nástroje
uvést datum posledního release a stav k datu.

---

## 5. Prolinkování a SEO

| Stránka | Musí odkazovat na |
|---|---|
| Hub abliterace | 4 děti, varianta modelu, kvantizace, kontext, RAG, bezpečnost |
| Odmítání | hub, technika, rizika, prompt injection |
| Technika | hub, odmítání, provoz, kvantizace, MTP |
| Provoz | hub, NVFP4, KV cache, vLLM, llama.cpp, varianta |
| Rizika | hub, GDPR, AI Act, licence, bezpečnost provozu |
| Kdo tvoří | hub, Hugging Face, licence |
| Varianta | model, hub, provoz, licence, měření |
| Sandbox | agenti, bezpečnost agenta, API server, troubleshooting |
| Kde provozovat | agenti, sandbox, API server, monitoring, model |

**Hledané dotazy:**

- „abliterated model“, „uncensored LLM“, „co je odmítání modelu“,
  „Qwen3.8 abliterated“, „necenzurovaný model lokálně“.
- „sandbox pro AI agenty“, „jak izolovat agenta“, „gVisor agent“.
- „OpenClaw“, „MausBot“, „agent harness“, „lokální agent GUI“.

Titulky začínají hledaným výrazem; description 110–155 znaků;
žádné marketingové fráze.

---

## 6. Registry a data

### 6.1 Nové mezery

A01–A06 (viz 2.8), B01 (režie sandboxů), C01 (ověřené srovnání
harnessů).

### 6.2 Záznamy měření

Jen s veřejným zdrojem a konfigurací. Do té doby `[DOPLNIT]`
a položka v registru. U DevelopingDad a lflare jde o měření
vydavatele, ne naše.

### 6.3 Nové zdroje

arXiv 2406.11717, Heretic, model cards OrcaRouter, huihui-ai,
lflare, DevelopingDad, abliteratedmodels.org, abliter.cn,
gVisor, Firecracker, E2B, Daytona, Wasmtime, OpenClaw,
MausBot, Hermes, Goose, Claude Code.

---

## 7. Pořadí práce a odhady

| Fáze | Co | Dny |
|---|---|---:|
| 1 | A01, A03: parita a licence (bez právního review) | 1–2 |
| 2 | Hub + odmítání | 1 |
| 3 | Technika + kdo tvoří | 1–2 |
| 4 | Provoz + PLE z SSD + protokol | 1–2 |
| 5 | Rizika + varianta modelu (draft) | 1–2 |
| 6 | Sandbox | 2–3 |
| 7 | Kde provozovat agenty | 2–3 |
| 8 | QA, prolinkování, live | 1–2 |

Celkem **10–16 pracovních dnů**. Datové mezery (D02, D03, D10,
D11, D12) jsou otevřené, dokud se neobjeví veřejný zdroj.

---

## 8. Akceptační kritéria

- [ ] Každá stránka má zdroje, datum a `last_verified`.
- [ ] Žádné `[DOPLNIT]` bez položky v `data/chybi.yaml`.
- [ ] Žádné tvrzení o paritě bez měření a konfigurace.
- [ ] Každá stránka celku A má redakční upozornění.
- [ ] Varianta modelu je `status: draft`, dokud není důkaz.
- [ ] Sandbox i harness mají rozhodovací tabulku a „kdy to
      nepoužívat“.
- [ ] Odkazy na váhy jsou bez affiliate a s upozorněním.
- [ ] `check`, `check:odkazy` a `check:prolinkovani:strict` procházejí.
- [ ] Licence uvedené tak, jak je uvádí vydavatel i základní model.
- [ ] Právní review hotový (A02).

---

## 9. Rozhodnutí, která potřebuju

1. **Právní review: nebude.** Rozhodnuto 10. 11. 2026. Text musí
   být věcný a zodpovědný, s upozorněním „není právní rada“.
   Odpovědnost nese provozovatel.
2. **Odkazy na HF s váhami: schváleno.** Web může odkazovat na
   veřejné repozitáře, ale vždy s vymezením odpovědnosti a bez
   doporučení. Pravidla jsou v 9.1.
3. **Má být varianta modelu indexovaná hned?** Doporučení: ne,
   nejdřív draft a parita.
4. **Řešit EN teď, nebo po celku A?** Doporučení: po celku A;
   blokuje I02.
5. **MausBot a OpenClaw v jedné tabulce?** Doporučení: ano,
   s označením vendorských tvrzení.

### 9.1 Pravidla pro odkazy na Hugging Face

**Rozhodnuto 10. 11. 2026:** odkazy na HF jsou povolené, protože
čtenář má mít možnost ověřit si model card a váhy sám. Web ale
musí být jasně jen informační.

Co platí:

- **Nehostujeme váhy.** Odkazujeme na veřejný repozitář třetí strany.
- **Neověřujeme obsah ani bezpečnost** cizích vah. To musí být
  u odkazu napsané.
- **Žádný affiliate, žádné `rel="sponsored"`.** Odkaz na HF není
  obchodní vztah.
- **Odkaz na model card, ne na přímé stahování.** Kde to jde,
  uveďte revizi nebo hash.
- **Před odkazem bezpečnostní věta** u abliterovaných modelů:
  model nemá zábrany a odpovědnost nese provozovatel.
- **Licence a gating** ověřit před publikací; odkazovat jen na
  repozitáře, které mají jasnou licenci a nešíří nezákonný obsah.
- **Datum kontroly odkazu** u každého odkazu v seznamu zdrojů.

**Doporučené znění pod odkazem:**

> Odkaz vede na veřejný repozitář třetí strany. LOCALinference váhy
> nehostuje, neověřuje jejich obsah ani bezpečnost a nedoporučuje
> jejich nasazení. Platí licence a podmínky vydavatele; za použití
> a výstupy odpovídá ten, kdo model provozuje.


---

## 10. Co je hotové a co se nemá znovu otevírat

Hotové a ověřené: build 180 stránek, 42 témat, 56 hesel,
23 měření, 71 zdrojů, strict audit 0 chyb, `/data/` s filtrem
a grafem, Mac stránky, kontaktní e-mail, CI s buildem a audity.

Znovu neotvírat bez důvodu: strukturu clusterů, šablony stránek,
automatické prolinkování, formát datových karet, pravidla pro
ceny a affiliate odkazy.

---

*Tento plán se po každé dávce aktualizuje. Čísla a tvrzení se před
publikací ověřují proti zdrojům; marketing vydavatelů se označuje
jako tvrzení, ne jako měření.*
