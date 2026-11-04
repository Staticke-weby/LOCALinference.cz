// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

/**
 * Affiliate odkazy (Alza) označí rel="sponsored". Bez toho by web
 * vydával placený odkaz za redakční.
 */
function rehypeAffiliate() {
  const AFFILIATE = ['alza.cz'];

  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string') {
          try {
            const host = new URL(href).hostname.toLowerCase();
            const jeAffiliate = AFFILIATE.some(
              (d) => host === d || host.endsWith(`.${d}`),
            );
            if (jeAffiliate) {
              const rel = new Set(
                String(node.properties.rel ?? '')
                  .split(/\s+/)
                  .filter(Boolean),
              );
              rel.add('sponsored');
              rel.add('noopener');
              rel.add('noreferrer');
              node.properties.rel = [...rel].join(' ');
            }
          } catch {
            // relativní odkaz
          }
        }
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}

/**
 * Slovník: první výskyt pojmu na stránce se automaticky prolinkuje.
 * Drží to princip wikipedie — každý pojem je dostupný z místa, kde
 * se poprvé objeví, a články se propojují navzájem.
 */
function rehypeSlovnik() {
  const TERMS = [
    { re: /\bCUDA\b/g, url: '/slovnik/software/cuda/', slug: 'software/cuda' },
    { re: /\bROCm\b/g, url: '/slovnik/software/rocm/', slug: 'software/rocm' },
    { re: /\bvLLM\b/g, url: '/slovnik/software/vllm/', slug: 'software/vllm' },
    { re: /llama\.cpp/g, url: '/slovnik/software/llamacpp/', slug: 'software/llamacpp' },
    { re: /\bGGUF\b/g, url: '/slovnik/software/gguf/', slug: 'software/gguf' },
    { re: /Hugging Face/g, url: '/slovnik/software/huggingface/', slug: 'software/huggingface' },
    { re: /\bkvantizac\w*/gi, url: '/slovnik/software/kvantizace/', slug: 'software/kvantizace' },
    { re: /\bTTFT\b/g, url: '/slovnik/vykon/ttft/', slug: 'vykon/ttft' },
    { re: /\bprefill\w*/gi, url: '/slovnik/vykon/prefill/', slug: 'vykon/prefill' },
    { re: /\bsouběžnost\w*/gi, url: '/slovnik/vykon/soubeznost/', slug: 'vykon/soubeznost' },
    { re: /\bparalelizac\w*/gi, url: '/slovnik/vykon/paralelizace/', slug: 'vykon/paralelizace' },
    { re: /\btok\/s\b/gi, url: '/slovnik/vykon/tok-s/', slug: 'vykon/tok-s' },
    { re: /\bKV cache\b/gi, url: '/slovnik/pamet/kv-cache/', slug: 'pamet/kv-cache' },
    { re: /\bpower limit\w*/gi, url: '/slovnik/provoz/power-limit/', slug: 'provoz/power-limit' },
    { re: /\bthrottling\w*/gi, url: '/slovnik/provoz/throttling/', slug: 'provoz/throttling' },
    { re: /\bMoE\b/g, url: '/zaciname/proc-moe/', slug: 'proc-moe' },
    { re: /\broofline\b/gi, url: '/rychlost/roofline/', slug: 'rychlost/roofline' },
  ];

  const SKIP_PARENTS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const MAX_LINKS = 10;

  return (tree, file) => {
    const cesta = String(file?.path ?? '').replaceAll('\\', '/');
    const pouzite = new Set();
    let pocet = 0;

    // Co je na stránce odkazované ručně, nech být.
    const posbirat = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && href.startsWith('/slovnik/')) {
          pouzite.add(href);
        }
      }
      (node.children ?? []).forEach(posbirat);
    };
    posbirat(tree);

    const projdi = (parent) => {
      if (!parent.children) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];

        if (node.type === 'element') {
          if (SKIP_PARENTS.has(node.tagName)) continue;
          projdi(node);
          continue;
        }

        if (node.type !== 'text' || pocet >= MAX_LINKS) continue;

        for (const term of TERMS) {
          if (pouzite.has(term.url)) continue;
          if (cesta.includes(`slovnik/${term.slug}`)) continue;

          term.re.lastIndex = 0;
          const m = term.re.exec(node.value);
          if (!m) continue;

          const before = node.value.slice(0, m.index);
          const after = node.value.slice(m.index + m[0].length);

          const link = {
            type: 'element',
            tagName: 'a',
            properties: { href: term.url },
            children: [{ type: 'text', value: m[0] }],
          };

          const nahrada = [];
          if (before) nahrada.push({ type: 'text', value: before });
          nahrada.push(link);
          if (after) nahrada.push({ type: 'text', value: after });

          parent.children.splice(i, 1, ...nahrada);

          pouzite.add(term.url);
          pocet++;

          // přeskočit nově vložený odkaz a pokračovat za ním
          i += nahrada.length - 1;
          break;
        }
      }
    };

    projdi(tree);
  };
}

export default defineConfig({
  site: 'https://www.localinference.cz',
  markdown: {
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        rehypeAffiliate,
        rehypeSlovnik,
      ],
    }),
  },
  integrations: [
    starlight({
      title: 'Local Inference',
      description:
        'Lokální AI pro firmy na 128GB boxech. Ceny v Kč, Qwen3.8 Flash Next a návody krok za krokem.',
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Čeština', lang: 'cs' },
      },
      lastUpdated: false,
      customCss: ['./src/styles/custom.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
        SiteTitle: './src/components/SiteTitle.astro',
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Local Inference' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://www.localinference.cz/og-cz.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Local Inference — lokální AI pro firmy' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://www.localinference.cz/og-cz.png' } },
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://navstevnost.pikapod.net/script.js',
            'data-website-id': '0f31f779-c9bd-4e31-9745-19b8b425be0b',
          },
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Local Inference',
            url: 'https://www.localinference.cz/',
            inLanguage: 'cs',
          }),
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ESHOpino s.r.o.',
            url: 'https://www.localinference.cz/',
            identifier: '03223485',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Roháčova 145/14',
              postalCode: '130 00',
              addressLocality: 'Praha 3',
              addressCountry: 'CZ',
            },
          }),
        },
      ],
      sidebar: [
        {
          label: 'Začínáme',
          items: [{ autogenerate: { directory: 'zaciname' } }],
        },
        {
          label: 'Zařízení',
          items: [{ autogenerate: { directory: 'zarizeni' } }],
        },
        {
          label: 'Výběr',
          items: [{ autogenerate: { directory: 'vyber' } }],
        },
        {
          label: 'Model',
          items: [{ autogenerate: { directory: 'modely' } }],
        },
        {
          label: 'Návody',
          items: [{ autogenerate: { directory: 'navody' } }],
        },
        {
          label: 'Slovník',
          items: [
            { label: 'Přehled', link: '/slovnik/' },
            {
              label: 'Výkon a měření',
              items: [{ autogenerate: { directory: 'slovnik/vykon' } }],
            },
            {
              label: 'Software a runtime',
              items: [{ autogenerate: { directory: 'slovnik/software' } }],
            },
            {
              label: 'Paměť a model',
              items: [{ autogenerate: { directory: 'slovnik/pamet' } }],
            },
            {
              label: 'Provoz a hardware',
              items: [{ autogenerate: { directory: 'slovnik/provoz' } }],
            },
          ],
        },
        {
          label: 'Rychlost a měření',
          items: [
            { autogenerate: { directory: 'rychlost' } },
            {
              label: 'Datové karty',
              items: [
                { label: 'Přehled', link: '/data/' },
                { label: 'Qwen3.8 na Strix Halo', link: '/data/qwen3-8-flash-next-strix-halo/' },
              ],
            },
          ],
        },
        {
          label: 'Témata',
          items: [{ autogenerate: { directory: 'temata' } }],
        },
        {
          label: 'Zdroje',
          items: [{ autogenerate: { directory: 'zdroje' } }],
        },
        {
          label: 'O webu',
          items: [{ autogenerate: { directory: 'o-webu' } }],
        },
      ],
    }),
  ],
});
