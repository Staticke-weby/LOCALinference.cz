# Plán: abliterované modely, sandboxing agentů a běhové prostředí agentů

*Verze 1.0 — 10. listopadu 2026*

**Cíl:** doplnit tři obsahové celky, které na webu chybí a které čtenáři
hledají jinde než v obecných AI magazínech:

1. **Necenzurované a abliterované modely** — cluster, který vysvětlí
   odmítání, abliteraci, rizika a provoz na 128 GB. Součástí je
   varianta Qwen3.8 Flash Next v NVFP4, která má běžet stejně dobře
   jako základní NVIDIA NVFP4.
2. **Sandboxing agentů** — jeden dlouhý článek, ne cluster.
3. **Kde provozovat agenty** — harnessy, agentní GUI, OpenClaw,
   MausBot a spol. — jeden dlouhý článek, ne cluster.

Plán navazuje na `plan-rozsireni-temat-slovniku.md` a drží stejná
pravidla: žádná vlastní měření, každé číslo se zdrojem a datem,
`[DOPLNIT]` jen s položkou v `data/chybi.yaml`.

---

## 0. Shrnutí a doporučená rozhodnutí

| Otázka | Doporučení |
|---|---|
| Má abliterace být cluster, nebo jeden článek? | **Cluster**: hub + 4 dceřiné stránky + 1 stránka variantu modelu. Téma má právní, technickou i provozní rovinu. |
| Má se přidat abliterovaná varianta Q38FN? | **Ano, ale jako `status: draft`**, dokud neexistuje veřejné měření parity. Stránka nesmí tvrdit „běží stejně dobře“, jen doložit, co je změřené. |
| Sandboxing a harnessy jako clustery? | **Ne.** Jeden dlouhý článek (3 500–4 500 slov) pro každý. Jsou to průřezová témata, ne rodiny stránek. |
| Odkazy na Hugging Face s abliterovanými váhami? | **Ano, informativně**, bez affiliate, s upozorněním, že web váhy nehostuje ani nedoporučuje. |
| Právní kontrola? | **Povinná před publikací** obou částí A. Není to právní rada, ale riziko je vyšší než u běžných témat. |

**Odhad:** 4–6 dní na celek A, 2–3 dny na B, 2–3 dny na C, 1–2 dny QA
a prolinkování. Celkem 9–14 pracovních dnů při soustředěné práci.

---

## 1. Vymezení a publikační politika

### 1.1 Co na web patří

- **Vysvětlení**, jak odmítání a abliterace fungují, včetně toho, co
  se změnou vah ztrácí kvalita a bezpečnost.
- **Provozní dopady** na 128GB boxy: formáty, paměť, rychlost,
  kvantizace, kompatibilita s vLLM a llama.cpp.
- **Rizika a právo**: co může model způsobit, kde je odpovědnost
  provozovatele, co říká AI Act a české právo.
- **Ověřitelné odkazy** na model cards, metodiky a měření.

### 1.2 Co na web nepatří

- Návody na konkrétní škodlivý výstup (zbraně, drogy, CSAM, návod
  k trestnému činu, kybernetický útok krok za krokem).
- „Jailbreak prompt“ sady a odkazy na ně.
- Doporučení „použij abliterovaný model na X“, kde X je nezákonné.
- Návod na trénink abliterace za účelem obejít bezpečnostní opatření
  u modelu, který k tomu nemá licenci.

**Redakční věta, která musí být na každé stránce celku A:**

> Toto je vysvětlení, ne návod k obejití bezpečnostních opatření.
> Abliterovaný model nemá zábrany a odpovědnost za výstup nese ten,
> kdo ho provozuje.

### 1.3 Právní rámec (k ověření před publikací)

- **AI Act** — web není poskytovatel modelu, ale provozovatel systému
  může být. U nasazení v rozhodování o lidech je riziko vyšší.
- **GDPR** — abliterace nemění povinnosti; logy a výstupy mohou
  obsahovat osobní údaje.
- **České právo** — šíření a podpora materiálů, které vyzývají
  k trestné činnosti, není chráněná „technická informace“.
- **Licence** — odvozené váhy dědí licenci základního modelu
  (Qwen Community License 1.0). Někteří vydavatelé uvádějí
  Apache-2.0; to je **rozpor, který musíme ověřit**, ne převzít.

**Akce:** zapsat právní review jako položku `P0` do `data/chybi.yaml`
s odkazem na AI Act a Qwen LICENSE.

---

## 2. Celek A — Necenzurované a abliterované modely

### 2.1 Architektura

```
/temata/abliterace/                  hub, 2 000–2 500 slov
  /odmitani/                         co je refusal, 1 400 slov
  /jak-abliterace-funguje/           technika, 1 800 slov
  /provoz-na-128-gb/                 formáty a výkon, 1 600 slov
  /rizika-a-pravo/                   dopady a právo, 1 500 slov
  /kdo-je-tvori/                     vydavatelé a provenance, 1 200 slov
/modely/qwen3-8-flash-next-abliterated/   varianta modelu, 1 500 slov
```

Důvod pro cluster: „co to je“ a „jak to funguje“ jsou dvě různé
hledané otázky s jinou intencí. Jeden článek by byl 6 000 slov
a špatně se prolinkoval.

### 2.2 Osnovy stránek

#### `/temata/abliterace/` — hub (2 200 slov)

1. Rychlá odpověď: co abliterace je, co není, komu se hodí a komu ne.
2. Rozhodovací tabulka: základní vs. abliterovaný model (bezpečnost,
   kvalita, licence, riziko).
3. Co se mění ve vahách a co v chování; mýtus „stejný model bez
   zábran“.
4. Kde to potkáte na 128 GB (NVFP4, GGUF, EXL3; DGX, Strix, Mac).
5. Odkazy na dceřiné stránky a na modelovou variantu.
6. Kde je limit a kdy to nemá smysl.
7. Zdroje.

#### `/temata/abliterace/odmitani/` (1 400 slov)

- Co je **refusal**: tréninkové odmítnutí škodlivého požadavku.
- Rozdíl mezi **odmítnutím**, **varováním**, **přesměrováním**
  a **selháním nástroje**.
- **Oblasti, které odmítání pokrývá** (taxonomie, ne návod):
  násilí a zbraně, nezákonné jednání, drogy, sebepoškozování,
  sexuální obsah včetně ochrany nezletilých, nenávist a
  dehumanizace, soukromí a osobní údaje, zdravotní a právní
  doporučení, autorské právo, kybernetická bezpečnost, politická
  persuaze, obcházení vlastních pravidel.
- **Přemrštěné odmítání** (over-refusal) u benigních dotazů.
- Jak se odmítání měří (sada promptů, míra odmítnutí, falešné
  odmítnutí) — metodika, ne konkrétní jailbreaky.
- Tabulka: kategorie → proč ji model odmítá → co se stane po
  abliteraci → jaké riziko to přináší.

#### `/temata/abliterace/jak-abliterace-funguje/` (1 800 slov)

- Alignment v kostce: SFT, RLHF/DPO, safety data.
- **Refusal direction**: jeden směr v residual streamu
  ([Arditi et al., 2024](https://arxiv.org/abs/2406.11717)).
- Metody: **diff-in-means**, **orthogonalizace**, **LoRA**,
  **Heretic** (automatické hledání parametrů).
- Co se stane s vahami a proč to jde i po kvantizaci.
- **Proč to není „smazání znalosti“**: model látku pořád zná,
  jen ji přestane odmítat.
- Vedlejší efekty: ztráta obecné kvality, zhoršená instrukční
  poslušnost, vyšší míra halucinací, rozbité tool calling.
- Tabulka metod: metoda → náročnost → dopad na kvalitu → dostupné
  nástroje.
- **Co z toho plyne pro provoz**: abliterace není přepínač.

#### `/temata/abliterace/provoz-na-128-gb/` (1 600 slov)

- Formáty: NVFP4, FP8, GGUF Q4/Q5/Q6, EXL3, MLX.
- Které enginy to umí: vLLM na DGX/RTX, llama.cpp, MLX.
- Paměť: 180B model, aktivní 6B, NVFP4 ~101 GB; co zbyde na KV cache.
- **Výkon**: proč abliterace nemění počet parametrů, ale může změnit
  kvalitu kvantizace; co měřit (decode, prefill, TTFT, souběžnost).
- **Parity protokol** (viz 2.3).
- Tabulka: formát → kde běží → kvalita → rychlost → riziko.
- Kde je limit: vládní modely, dlouhý kontext, souběžnost.

#### `/temata/abliterace/rizika-a-pravo/` (1 500 slov)

- **Co může model způsobit**: nezákonný obsah, návod k ublížení,
  dezinformace, podpora nenávisti, únik soukromí, nebezpečné
  lékařské/technické rady.
- Rozdíl mezi **schopností** a **záměrem**; model nemá vůli, ale
  uživatel ano.
- **Odpovědnost**: provozovatel, uživatel, vydavatel vah.
- **AI Act**: kdy je nasazení high-risk; transparentnost.
- **GDPR**: logy, retence, práva subjektů.
- **Licence**: Qwen Community License 1.0, komerční použití,
  zákaz impersonace, odpovědnost za výstup.
- Checklist před nasazením: účel, oprávnění, moderace, logy,
  lidský dohled, incidentní plán.
- Kdy to nepoužívat: škola, zdravotnictví, HR, veřejná správa,
  cokoli s dopadem na práva lidí.

#### `/temata/abliterace/kdo-je-tvori/` (1 200 slov)

- Kdo abliteraci dělá: jednotlivci (huihui-ai), týmy (OrcaRouter),
  komunitní nakladatelé (lflare, DevelopingDad, myllmbox).
- **Provenance**: základní revize, metoda, kvantizace, hashe.
- Jak poznat solidní model card: uvedená metoda, míra odmítnutí
  před/po, známé ztráty, licence, datum.
- **Indexy**: abliteratedmodels.org, abliter.cn — jsou katalog,
  ne důkaz; neověřují tvrzení vydavatele.
- Riziko podvrhu a „uncensored“ marketingu.
- Kdo naopak abliteraci nedělá a proč.

### 2.3 Varianta Qwen3.8 Flash Next abliterated (NVFP4)

**Požadavek:** varianta, která poběží stejně dobře jako základní
NVIDIA NVFP4 na 128GB zařízeních.

**Realita k 10. 11. 2026:** existují veřejné NVFP4 buildy
(např. `orcarouter/Qwen3.8-Flash-Next-Uncensored-NVFP4`,
`DevelopingDad/Qwen3.8-Flash-Next-Uncensored-NVFP4-DGX-Spark`,
`lflare/...-CSF-QAD-Abliterated`). Tvrzení o paritě výkonu je ale
**tvrzení vydavatele**, ne naše měření. Proto:

- stránka vznikne jako **`status: draft`** s tabulkou „co je doložené“;
- každé číslo má `mereno_kym`, konfiguraci a datum;
- dokud není veřejné měření na stejném zařízení a stejné konfiguraci,
  zůstává `[DOPLNIT: parity measurement]` a položka v registru.

**Parity protokol (kritérium redakce, ne fakt):**

| Co | Jak | Tolerance |
|---|---|---|
| Stejný základ | stejná revize Qwen3.8 + stejný tokenizer/MTP/vision | musí sedět |
| Stejný formát | NVFP4, stejná KV cache, stejný engine a flags | musí sedět |
| Decode | 8k a 32k, 1 stream, 3 běhy | ±5 % proti základu |
| TTFT a prefill | stejné prompty | ±10 % |
| Souběžnost | 4 požadavky | bez pádu a bez swapu |
| Kvalita | veřejné benchmarky + 20 českých úloh | bez propadu > 2 body |
| Odmítání | sada 50 benigních a 50 škodlivých promptů | odmítání musí klesnout; benigní nesmí klesnout |

**Co publikovat, když parita nevyjde:** stránku ponechat ve stavu
„kandidát“, vysvětlit, kde se rozchází, a nedoporučit nasazení.
Nikdy nezaokrouhlit „skoro stejné“ na „stejné“.

### 2.5 Které buildy fungují s n-gramy z SSD (k 10. 11. 2026)

Klíčové kritérium není velikost na disku, ale jestli runtime umí držet
**n-gramovou (PLE) tabulku na SSD** a mapovat ji do paměti. NVIDIA to
u základního FP4-Local dělá přes `VLLM_PLE_TABLE_MEMORY=disk` a
`B12X_DISK_BACKEND=io_uring`; s offloadem udává na DGX Sparku
**1M tokenů FP8 KV cache**, bez něj méně.

| Zařízení | Build | Disk | PLE z SSD | Poznámka |
|---|---|---:|---|---|
| **DGX Spark** | `DevelopingDad/Qwen3.8-Flash-Next-FP4-Local-Abliterated` | 102,3 GB | **ano**, launcher | stejný layout jako NVIDIA FP4-Local; 104 GiB cap; MTP 4 drafty; naměřeno 38,0/54,3 tok/s proti 39,4/50,7 u základu (vydavatel) |
| **DGX Spark** | `DevelopingDad/Qwen3.8-Flash-Next-Uncensored-NVFP4-DGX-Spark` | 183,5 GB | **ano**, mmap + paralelní čtení | BF16 PLE shard zůstává na disku; 100 GiB container bez swapu; runtime vLLM 0.30.0 |
| **DGX Spark / RTX Spark** | `lflare/Qwen3.8-Flash-Next-NVFP4-MXFP8-CSF-QAD-Abliterated` | 102,8 GB | **ano**, `VLLM_PLE_TABLE_MEMORY=disk` | Qwen Community License; měřená shoda schopností s rodičem; vision BF16 |
| **RTX Spark mini/notebook** | váhy DevelopingDad + vLLM ARM64 port | 102,3 GB | **neověřeno** | launcher je DGX-specifický; Windows dělí paměť, repacking může být nutný |
| **Strix Halo** | `huihui-ai/...-abliterated-v2-GGUF` (UD-IQ4_XS) | 93,6 GB | ne (GGUF) | llama.cpp, Q8 KV; NVFP4 na ROCm ne |
| **Strix Halo** | `mradermacher/...-i1-GGUF` (IQ4_XS) | 97,5 GB | ne (GGUF) | imatrix kalibrace |
| **Mac Studio / MacBook Pro** | stejné GGUF přes Metal | 93,6–97,5 GB | ne (GGUF) | MLX 4bit 115,1 GB je na 128 GB těsné |

**Co je potřeba pro PLE z SSD:**

- **NVMe**, ne SATA a už vůbec ne síťový disk. io_uring potřebuje
  dostatečnou hloubku fronty a nízkou latenci.
- **Dost page cache** — opakované n-gramy se drží v RAM; čím
  rozmanitější text, tím víc čtení z disku.
- **Konkrétní kontejner a verze vLLM** — základ vyžaduje B12X build;
  stock vLLM tento checkpoint nenačte.
- **Měřit TTFT a stabilitu decode**, ne jen průměr. Pomalý disk se
  projeví hlavně na začátku a u dlouhých promptů.

**Co se na 128 GB nevejde ani s PLE z SSD:**

- `huihui-ai/...-abliterated` — 360 GB BF16; bez vlastní kvantizace
  a konfigurace PLE to není turnkey.
- `mazinb/...-NVFP4` — 186,4 GB rozdělené experty; způsob načítání
  není popsaný, bereme jako neověřené.
- `orcarouter/...-NVFP4` — 183,5 GB; originál nemá veřejně popsaný
  launcher s PLE z SSD. Použijte DevelopingDad repack, který stejné
  váhy servíruje s mmap PLE.

**Licence:** DevelopingDad dědí **NVIDIA Open Model Agreement**
(přes FP4-Local base) a Qwen Community License; lflare a OrcaRouter
dědí Qwen Community License 1.0. OrcaRouter v kartě uvádí
Apache-2.0, což je v rozporu se základní licencí — před publikací
ověřit (A03).

**Stav důkazu:** čísla DevelopingDad jsou měření vydavatele na
DGX Sparku, ne nezávislý test. Pro tvrzení „běží stejně dobře“
proto platí: doloženo pouze pro prózu a kód na jednom zařízení;
chybí nezávislé měření a česká sada (A01, A04).


### 2.4 Zdroje k ověření (celeku A)

- Arditi et al., *Refusal in Language Models Is Mediated by a Single
  Direction* — arXiv 2406.11717.
- Heretic — nástroj pro automatickou abliteraci (GitHub).
- Model cards: `orcarouter/Qwen3.8-Flash-Next-Uncensored-NVFP4`,
  `huihui-ai/...-abliterated`, `lflare/...-CSF-QAD-Abliterated`,
  `DevelopingDad/...-DGX-Spark`.
- Indexy: abliteratedmodels.org, abliter.cn (metodika a katalog).
- llamaperf — měření abliterovaných variant (kontext a konfigurace).
- Qwen LICENSE — Qwen Community License 1.0.
- AI Act (EU) 2024/1689, GDPR.

**Mezery k založení:** parita NVFP4 (P0), česká sada pro odmítání
(P1), právní review (P0), licence odvozenin (P0), kvalitativní
srovnání po abliteraci (P1), chování PLE z SSD při dlouhém kontextu
(P1), PLE z SSD na RTX Sparku (P1).

---

## 3. Celek B — Sandboxing agentů (jeden dlouhý článek)

**URL:** `/temata/provoz/sandbox-agentu/`
**Rozsah:** 3 500–4 500 slov, 12–15 sekcí, 4 tabulky, 1 diagram,
2 výpočty.

### Osnova

1. **Rychlá odpověď** — sandbox není antivirus; je to hranice.
2. **Model hrozeb**: prompt injection, únik dat, neoprávněná akce,
   smyčka, supply chain, eskalace.
3. **Čtyři vrstvy izolace**: proces, souborový systém, síť, identita.
4. **Úrovně sandboxu** (tabulka):
   - žádný (jen prompt) — kdy to nikdy nestačí,
   - kontejner (Docker/Podman),
   - microVM (Firecracker),
   - userspace kernel (gVisor),
   - WASM (Wasmtime) pro nástroje,
   - vzdálený sandbox (E2B, Daytona, Box).
5. **Souborový systém**: read-only mount, allowlist, oddělený uživatel,
   žádné secrets v prostředí.
6. **Síť**: egress allowlist, DNS, proxy, žádný přístup k meta-datům.
7. **Identita a oprávnění**: scoped tokeny, OAuth, rotace, least
   privilege; proč token v promptu neexistuje.
8. **Lidské schválení**: co musí projít kartou Allow/Deny; návrh
   pravidel podle rizika akce.
9. **Limity**: CPU, paměť, čas, počet kroků, velikost výstupu.
10. **Logy a audit**: co logovat, co nikdy, retence, oddělení.
11. **Testování obrany**: negativní testy (injection, cesta mimo
    allowlist, egress, smyčka, restart).
12. **Kolik to stojí**: výpočet režie kontejneru vs. microVM vs.
    vzdáleného sandboxu (start, RAM, latence).
13. **Kdy to nepoužívat**: jednorázový skript, žádná citlivá data,
    model nic nevolá.
14. **Kudy dál** a zdroje.

### Povinné prvky

- **Diagram** vrstev (SVG, currentColor).
- **Tabulka** úrovní izolace s tím, co která řeší a co ne.
- **Výpočet**: kolik paměti sebere kontejner a co zbyde na model
  (např. 128 GB − model − KV cache − 2 GB režie).
- **Výpočet**: doba startu sandboxu vs. počet kroků agenta.
- **Český příklad**: agent nad fakturami v kontejneru bez sítě.

### Zdroje k ověření

gVisor docs, Firecracker paper/docs, Docker security docs, E2B a
Daytona docs, Wasmtime, OWASP LLM Top 10, NIST AI RMF, Microsoft
Playwright sandbox? (jen pokud relevantní).

---

## 4. Celek C — Kde provozovat agenty (jeden dlouhý článek)

**URL:** `/temata/agenti/kde-provozovat-agenty/`
**Rozsah:** 3 500–4 500 slov, 12–15 sekcí, 3 tabulky, rozhodovací
strom, 2 výpočty.

### Proč jeden článek

Harnessy a GUI se mění rychleji než modely. Cluster by za rok
zastaral. Jeden článek s jasnou taxonomií a datem je udržitelnější.

### Taxonomie (tabulka)

| Vrstva | Co to je | Příklady |
|---|---|---|
| **CLI harness** | agent v terminálu nad repem | Claude Code, Codex CLI, Gemini CLI, OpenCode |
| **Gateway / messaging** | agent na serveru, dosažitelný z chatů | OpenClaw, Hermes Agent |
| **Desktop GUI** | aplikace s boty a schvalováním | MausBot, Goose, Claude Cowork |
| **IDE** | agent uvnitř editoru | Cursor, VS Code rozšíření |
| **Cloud sandbox** | agent v hostovaném VM | E2B, Daytona, Box |
| **GUI agent** | ovládá obrazovku | UI-TARS, Agent S, Agent Zero |

### Osnova

1. **Rychlá odpověď**: jak vybrat podle toho, kde má agent běžet
   a kdo schvaluje akce.
2. **Co je harness** a jak se liší od modelu a od enginu.
3. **Lokální model jako backend**: OpenAI kompatibilní endpoint,
   tool calling, kontext, limit kroků.
4. **OpenClaw**: co je, jak se provozuje, jaké má defaulty a kde
   je riziko otevřeného gatewaye. Ověřit licenci z GitHubu
   (zdroje se rozcházejí: MIT vs. Apache-2.0).
5. **MausBot**: desktop harness s approval gate, Apache-2.0,
   tvrzení výrobce označit jako tvrzení.
6. **Hermes, Goose, Claude Cowork, Codex/Claude CLI**: krátké
   profily, jen doložené vlastnosti.
7. **Srovnávací tabulka**: licence, platforma, approval gate,
   lokální model, síťová expozice, vhodnost pro 128GB box.
8. **Rozhodovací strom**: jeden uživatel / tým / server / GUI.
9. **Kolik to stojí**: režie harnessu, tokeny na systémový prompt,
   počet kroků, latence při 25 tok/s.
10. **Bezpečnostní minimum**: localhost, tokeny, allowlist,
    žádné veřejné porty, logy.
11. **Kdy to nepoužívat**: když stačí chat, když nemáte čas na
    údržbu, když agent potřebuje produkční klíče.
12. **Kudy dál** a zdroje.

### Zdroje k ověření

Oficiální dokumentace OpenClaw, GitHub repo (licence, defaulty),
MausBot docs (výrobce), Hermes Agent, Goose, Claude Code docs,
Codex docs, UI-TARS, Agent S, Agent Zero, E2B/Daytona.

**Pozor:** MausBot je zároveň vendor srovnávacích stránek. Jeho
tvrzení o konkurenci bereme jako `komunita`/`vyrobce`, ne jako
nezávislý test.

---

## 5. Prolinkování a SEO

### 5.1 Povinné odkazy

| Stránka | Musí odkazovat na |
|---|---|
| Hub abliterace | 4 dceřiné stránky, model variantu, kvantizaci, kontext, RAG, bezpečnost provozu |
| Odmítání | hub, jak to funguje, rizika, prompt injection, agentní úlohy |
| Jak funguje | hub, odmitani, provoz, kvantizace, MTP, model |
| Provoz | hub, kvantizace, NVFP4, KV cache, vLLM, llama.cpp, model variantu |
| Rizika | hub, GDPR, AI Act, bezpečnost provozu, licence |
| Kdo tvoří | hub, Hugging Face, kvantizace, licence |
| Model varianta | model, hub, provoz, licence, měření |
| Sandbox | agenti, bezpečnost agenta, bezpečnost provozu, API server, troubleshooting |
| Kde provozovat | agenti, sandbox, API server, monitoring, model, návody |

### 5.2 Hledané dotazy

- Abliterace: „abliterated model“, „uncensored LLM“, „co je
  odmítání modelu“, „Qwen3.8 abliterated“, „necenzurovaný model
  lokálně“.
- Sandbox: „sandbox pro AI agenty“, „jak izolovat agenta“,
  „docker sandbox AI“, „gVisor Firecracker agent“.
- Harnessy: „OpenClaw“, „MausBot“, „agent harness“, „lokální
  agent GUI“, „coding agent GUI“.

### 5.3 Title a description

- Title začíná hledaným výrazem, ne „Co je…“.
- Description 110–155 znaků, bez marketingových frází.
- U celku A nesmí title slibovat „bez cenzury“ jako výhodu.

---

## 6. Data a registry

### 6.1 Nové položky do `data/chybi.yaml`

| ID | Priorita | Co chybí |
|---|---|---|
| A01 | P0 | Parita abliterovaného NVFP4 proti základu na 128GB boxu |
| A02 | P0 | Právní review publikace o abliteraci (AI Act, české právo) |
| A03 | P0 | Licence odvozenin Qwen3.8 (QCL vs. Apache-2.0) |
| A04 | P1 | Česká sada pro měření odmítání (50+50 promptů) |
| A05 | P1 | Vliv PLE z SSD na TTFT a decode při 32k/128k/262k |
| A06 | P1 | PLE z SSD na RTX Sparku (Windows ARM, dělení paměti) |
| B01 | P1 | Měření režie sandboxů (start, RAM, latence) |
| C01 | P1 | Ověřené srovnání harnessů (licence, defaulty, gate) |

### 6.2 Záznamy do `data/mereni.yaml`

Jen pokud bude veřejné měření s konfigurací. Do té doby žádný
záznam, jen `[DOPLNIT]` a registr.

### 6.3 Nové zdroje do `data/zdroje.yaml`

- arXiv 2406.11717 (refusal direction).
- Heretic GitHub.
- Model cards abliterovaných Q38FN (orcarouter, huihui-ai, lflare,
  DevelopingDad).
- abliteratedmodels.org a abliter.cn (indexy).
- gVisor, Firecracker, E2B, Daytona, Wasmtime.
- OpenClaw GitHub a docs.
- MausBot docs (vendor).
- Hermes Agent, Goose, Claude Code docs.

---

## 7. Dávky

### Dávka A — abliterace (4–6 dní)

1. Rešerše a právní review; zápis mezer A01–A04.
2. Hub + `/odmitani/`.
3. `/jak-abliterace-funguje/` + `/kdo-je-tvori/`.
4. `/provoz-na-128-gb/` + parity protokol.
5. `/rizika-a-pravo/` + model varianta (draft).
6. Prolinkování, build, audit, kontrola.

### Dávka B — sandbox (2–3 dny)

1. Rešerše a model hrozeb.
2. Článek, diagram, tabulky, výpočty.
3. Negativní testy jako checklist; prolinkování.

### Dávka C — harnessy (2–3 dny)

1. Ověření licencí a defaultů z oficiálních zdrojů.
2. Článek, taxonomie, srovnávací tabulka, rozhodovací strom.
3. Prolinkování; označení vendorských tvrzení.

### Dávka D — QA (1–2 dny)

- `npm run check`, `check:odkazy`, `check:prolinkovani:strict`.
- Kontrola všech čísel, datumů a licencí.
- Česká korektura; test na 360px šířce.
- Live kontrola URL; changelog.

---

## 8. Akceptační kritéria

- [ ] Každá stránka má zdroje, datum a `last_verified`.
- [ ] Žádné `[DOPLNIT]` bez položky v registru.
- [ ] Žádné tvrzení o paritě bez měření.
- [ ] Každá stránka celku A má redakční upozornění.
- [ ] Model varianta má `status: draft`, dokud není důkaz.
- [ ] Sandbox i harness mají rozhodovací tabulku a „kdy to
      nepoužívat“.
- [ ] Všechny odkazy na váhy jsou bez affiliate a s upozorněním.
- [ ] Strict audit prolinkování 0 chyb.
- [ ] Právní review hotový (A02).

---

## 9. Otevřená rozhodnutí (pro vás)

1. **Zveřejnit abliterovanou variantu jako plnohodnotnou stránku
   modelu, nebo jen jako sekci v clusteru?** Doporučení: samostatná
   stránka ve stavu draft, indexovat až po paritě.
2. **Smí web odkazovat přímo na HF repozitáře s váhami?**
   Doporučení: ano, informativně, bez doporučení a bez affiliate.
3. **Kdo udělá právní review?** Bez něj nedoporučuji publikovat
   `/rizika-a-pravo/`.
4. **Má se „uncensored“ objevit v názvu stránky?** Doporučení:
   v titulku až na druhém místě, primárně „abliterované modely“.
5. **MausBot a OpenClaw v jedné tabulce s ostatními?** Doporučení:
   ano, ale s poznámkou, že jde o vendor tvrzení, ne náš test.

---

## 10. Poznámky k rizikům

- **Reputační:** web, který vysvětluje abliteraci, může být vnímán
  jako návod. Řeší to redakční věta a důraz na právo a rizika.
- **SEO:** „uncensored“ má vysoký objem, ale riziko nesouladu s
  reklamními politikami. Affiliate odkazy se k těmto stránkám
  nepřidávají.
- **Zastarání:** harnessy a model cards se mění rychle; u celku C
  je nutná revize každé 3 měsíce, u abliterace při každé nové
  variantě Q38FN.
- **Bezpečnost:** článek o sandboxu nesmí být návod na obejití
  sandboxu. Popisovat obranu, ne útok.

---

*Tento plán se po každé dávce aktualizuje. Čísla a tvrzení se před
publikací ověřují proti zdrojům; nic se nepřebírá z marketingu
vydavatelů bez označení.*
