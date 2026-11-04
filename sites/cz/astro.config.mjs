// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://www.localinference.cz',
  markdown: {
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  integrations: [
    starlight({
      title: 'Local Inference',
      description:
        'Lokální AI pro firmy na 128GB boxech. Ceny v Kč, Qwen3.8 Flash Next a návody krok za krokem.',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'Local Inference',
        replacesTitle: true,
      },
      defaultLocale: 'root',
      locales: {
        root: { label: 'Čeština', lang: 'cs' },
      },
      lastUpdated: false,
      customCss: ['./src/styles/custom.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
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
