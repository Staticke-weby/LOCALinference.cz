# EN parita: mapa překladu a pravidla

*Pracovní podklad pro dávku 11. 11. 2026. CZ je zdroj pravdy, EN je
adaptace pro mezinárodního čtenáře. Čísla, tabulky a varování zůstávají.*

## Kam co patří

Zdroj je vždy `sites/cz/src/content/docs/<cz>.mdx` (nebo `.md`),
cíl v `sites/eu/src/content/docs/<en>.mdx`.

### Abliterace a model

| CZ | EN |
|---|---|
| temata/abliterace/index | topics/abliteration/index |
| temata/abliterace/odmitani | topics/abliteration/refusals |
| temata/abliterace/jak-abliterace-funguje | topics/abliteration/how-abliteration-works |
| temata/abliterace/provoz-na-128-gb | topics/abliteration/running-on-128gb |
| temata/abliterace/rizika-a-pravo | topics/abliteration/risks-and-law |
| temata/abliterace/kdo-je-tvori | topics/abliteration/who-makes-them |
| modely/qwen3-8-flash-next-abliterated | models/qwen3-8-flash-next-abliterated |

### Agenti

| CZ | EN |
|---|---|
| temata/agenti/index | topics/agents/index |
| temata/agenti/kde-provozovat-agenty | topics/agents/where-to-run-agents |
| temata/agenti/function-calling-v-praxi | topics/agents/function-calling |
| temata/agenti/mcp-v-praxi | topics/agents/mcp |
| temata/agenti/coding-agent | topics/agents/coding-agents |
| temata/agenti/office-automatizace | topics/agents/office-automation |
| temata/agenti/bezpecnost-agenta | topics/agents/agent-security |
| temata/agenti/nastroje/pi | topics/agents/tools/pi |
| temata/agenti/nastroje/omp | topics/agents/tools/omp |
| temata/agenti/nastroje/opencode-a-openchamber | topics/agents/tools/opencode-and-openchamber |
| temata/agenti/nastroje/mausbot | topics/agents/tools/mausbot |
| temata/agenti/nastroje/openclaw | topics/agents/tools/openclaw |
| temata/agenti/nastroje/hermes | topics/agents/tools/hermes |
| temata/agenti/nastroje/hermes-desktop | topics/agents/tools/hermes-desktop |
| temata/agenti/nastroje/lm-studio | topics/agents/tools/lm-studio |
| temata/agenti/nastroje/herdr | topics/agents/tools/herdr |

### Čeština a dokumenty

| CZ | EN |
|---|---|
| temata/cestina/index | topics/czech-and-documents/index |
| temata/cestina/jak-model-zvlada-cestinu | topics/czech-and-documents/czech-language |
| temata/cestina/shrnuti-dokumentu | topics/czech-and-documents/document-summaries |
| temata/cestina/extrakce-dat | topics/czech-and-documents/data-extraction |
| temata/cestina/preklad-a-korektura | topics/czech-and-documents/translation-and-proofreading |
| temata/cestina/hodnoceni-kvality | topics/czech-and-documents/quality-evaluation |

### RAG a dokumenty

| CZ | EN |
|---|---|
| temata/rag/index | topics/rag/index |
| temata/rag/pdf-a-skeny | topics/rag/pdf-and-scans |
| temata/rag/chunking | topics/rag/chunking |
| temata/rag/embeddingy-v-praxi | topics/rag/embeddings-in-practice |
| temata/rag/citace-a-hodnoceni | topics/rag/citations-and-evaluation |
| temata/rag/opravneni-a-bezpecnost | topics/rag/permissions-and-security |

### Provoz a bezpečnost

| CZ | EN |
|---|---|
| temata/provoz/index | topics/operations/index |
| temata/provoz/api-server | topics/operations/api-server |
| temata/provoz/monitoring | topics/operations/monitoring |
| temata/provoz/aktualizace | topics/operations/updates |
| temata/provoz/bezpecnost-provozu | topics/operations/security |
| temata/provoz/gdpr-a-ai-act | topics/operations/gdpr-and-ai-act |
| temata/provoz/reseni-problemu | topics/operations/troubleshooting |
| temata/provoz/sandbox-agentu | topics/operations/agent-sandbox |

### Praxe pro profese

| CZ | EN |
|---|---|
| temata/praxe/index | topics/practice/index |
| temata/praxe/pravo | topics/practice/law |
| temata/praxe/ucetnictvi | topics/practice/accounting |
| temata/praxe/vyroba | topics/practice/manufacturing |
| temata/praxe/vyvojari | topics/practice/developers |

## Slovník: 25 chybějících hesel

Soubor `data/en/slovnik.yaml` má položky `{group, slug, title,
description, text}`. `text` je jeden string s Markdownem, 120–200 slov.
Skupiny: `pamet` → `memory`, `software` → `software`, `provoz` →
`operations`, `vykon` → `performance`.

| CZ | EN group/slug |
|---|---|
| slovnik/pamet/context-rot | memory/context-rot |
| slovnik/pamet/gtt | memory/gtt |
| slovnik/pamet/ngram-embeddings | memory/ngram-embeddings |
| slovnik/pamet/offload | memory/offload |
| slovnik/pamet/paged-attention | memory/paged-attention |
| slovnik/pamet/prefix-caching | memory/prefix-caching |
| slovnik/pamet/rope-yarn | memory/rope-yarn |
| slovnik/provoz/prompt-injection | operations/prompt-injection |
| slovnik/software/abliterace | software/abliteration |
| slovnik/software/agent-harness | software/agent-harness |
| slovnik/software/ai-workspace | software/ai-workspace |
| slovnik/software/chat-template | software/chat-template |
| slovnik/software/embeddingy | software/embeddings |
| slovnik/software/flash-attention | software/flash-attention |
| slovnik/software/function-calling | software/function-calling |
| slovnik/software/mcp | software/mcp |
| slovnik/software/mlx | software/mlx |
| slovnik/software/ocr | software/ocr |
| slovnik/software/orchestrace-agentu | software/agent-orchestration |
| slovnik/software/reasoning | software/reasoning |
| slovnik/software/reranker | software/reranker |
| slovnik/software/structured-output | software/structured-output |
| slovnik/software/teplota-vzorkovani | software/sampling-temperature |
| slovnik/software/vektorova-databaze | software/vector-database |
| slovnik/vykon/batch-size | performance/batch-size |

## Pravidla pro EN text

- **Frontmatter:** `title`, `description`, `last_verified: 2026-11-11`.
  Žádné `sidebar:` — menu se vede v `sites/eu/astro.config.mjs`.
- **Adaptace, ne doslovný překlad.** Angličtina pro mezinárodního
  čtenáře, krátké věty, každý pojem při prvním výskytu vysvětlený.
- **Všechna čísla, tabulky a varování z CZ zůstávají.** EN nesmí být
  zkrácená verze. If a number has a source and date, keep both.
- **Ceny jen USD** jako list price bez DPH a dopravy. Žádné Kč, žádné
  Alza odkazy, žádné affiliate, žádné „kde koupit“.
- **Žádné české komponenty** (`AlzaCena`, `Cena`) ani české názvy
  prodejců. Místo nich obyčejná tabulka nebo věta s USD a datem.
- **Licence a rozpory** popsat tak, jak je uvádí vydavatel; nic
  nerozhodovat za něj.
- **Externí odkazy** nechat jako v CZ, s `target="_blank"` se postará
  rehype plugin. Hugging Face odkazy jen na model card, s výhradou
  odpovědnosti, pokud ji má CZ stránka.
- **Interní odkazy jen na existující EN routy** (níže). Když CZ
  odkazuje na stránku, která v EN ještě není, odkaž na nejbližší
  existující EN stránku nebo odkaz vynech.
- **Konec stránky:** `## Where next` s 3–6 odkazy, `## Sources`
  s použitými zdroji a `*Last verified: 11 November 2026.*`

## Existující EN routy (stav po dávce 11. 11.)

`/`, `/getting-started/{what-is-local-ai,how-it-works,how-we-read-data,environment,faq}/`,
`/devices/{,compare,ai-boxes,ai-laptops,configurations,dgx-spark,strix-halo,gorgon-halo,rtx-spark-mini,rtx-spark-notebook,mac-studio,macbook-pro}/`,
`/models/{,qwen3-8-flash-next,why-moe}/`,
`/generation/{,images,image-editing,video,video-editing,image-to-video,audio,translation,3d,game-assets,licensing,recipes}/`,
`/guides/{,dgx-spark,strix-halo,rtx-spark,mac}/`,
`/choosing/{budget,desktop-vs-laptop,how-many-users,safe-choice}/`,
`/speed/{roofline,calculator}/`,
`/sources/{sources,measurements,what-we-dont-know,changelog}/`,
`/about/{,methodology,how-we-write,legal}/`,
`/data/{,qwen3-8-flash-next-strix-halo}/`,
`/topics/` a stuby `/topics/{local-ai-for-business,cost-of-local-ai,dgx-spark,strix-halo,rtx-spark,qwen3-8-flash-next,128gb-unified-memory,local-ai-on-windows-11,local-ai-images,local-ai-video,local-ai-audio,local-ai-3d}/`,
`/topics/{context-engineering,quantization-in-practice,electricity-noise-heat,agent-memory,tool-design,model-routing,observability,backups-and-recovery}/`,
`/dictionary/` a hesla z `data/en/slovnik.yaml`.

**Pozor:** slugy z posledních dvou řádků `/topics/` (stuby i nová
témata) se nesmí vytvořit jako soubor znovu — kolidovaly by s
dynamickou routou. Nové stránky z této dávky mají jiné slugy.

## Co nedělat

- Neupravovat `sites/cz/` ani `data/*.yaml` (výjimka: slovník v
  `data/en/slovnik.yaml`).
- Neupravovat `sites/eu/astro.config.mjs`, `scripts/` ani
  `data/preklady.yaml`.
- Nespouštět build ani jiné příkazy, které mění repo.
