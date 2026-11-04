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

export default defineConfig({
  site: 'https://www.localinference.cz',
  markdown: {
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        rehypeAffiliate,
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
          label: 'Návody',
          items: [{ autogenerate: { directory: 'navody' } }],
        },
        {
          label: 'Témata',
          items: [{ autogenerate: { directory: 'temata' } }],
        },
        {
          label: 'Modely',
          items: [{ autogenerate: { directory: 'modely' } }],
        },
        {
          label: 'Rychlost',
          items: [{ autogenerate: { directory: 'rychlost' } }],
        },
        {
          label: 'Výběr',
          items: [{ autogenerate: { directory: 'vyber' } }],
        },
        {
          label: 'Data',
          items: [{ autogenerate: { directory: 'data' } }],
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
