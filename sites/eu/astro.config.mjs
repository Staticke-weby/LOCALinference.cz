// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://www.localinference.eu',
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'LOCALinference',
      description:
        'Local AI on turnkey 128GB devices. What runs, how fast and what it costs.',
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
      },
      lastUpdated: false,
      customCss: ['./src/styles/custom.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'LOCALinference' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://www.localinference.eu/og-en.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'LOCALinference — local AI on 128 GB' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://www.localinference.eu/og-en.png' } },
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://navstevnost.pikapod.net/script.js',
            'data-website-id': '94da2420-aa54-4b76-a614-ca06835a2138',
          },
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'LOCALinference',
            url: 'https://www.localinference.eu/',
            inLanguage: 'en',
          }),
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ESHOpino s.r.o.',
            url: 'https://www.localinference.eu/',
            identifier: '03223485',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Roháčova 145/14',
              postalCode: '130 00',
              addressLocality: 'Prague 3',
              addressCountry: 'CZ',
            },
          }),
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Home', link: '/' },
            { label: 'About this site', link: '/about/' },
          ],
        },
        {
          label: 'Devices',
          items: [
            { label: 'Overview', link: '/devices/' },
            { label: 'Compare devices', link: '/devices/compare/' },
            { label: 'AI boxes', link: '/devices/ai-boxes/' },
            { label: 'AI laptops', link: '/devices/ai-laptops/' },
            { label: 'DGX Spark', link: '/devices/dgx-spark/' },
            { label: 'Strix Halo', link: '/devices/strix-halo/' },
            { label: 'RTX Spark mini', link: '/devices/rtx-spark-mini/' },
            { label: 'RTX Spark notebook', link: '/devices/rtx-spark-notebook/' },
            { label: 'Mac Studio', link: '/devices/mac-studio/' },
            { label: 'MacBook Pro', link: '/devices/macbook-pro/' },
            { label: 'OEM configurations', link: '/devices/configurations/' },
          ],
        },
        {
          label: 'Model',
          items: [
            { label: 'Qwen3.8 Flash Next', link: '/models/qwen3-8-flash-next/' },
          ],
        },
      ],
    }),
  ],
});
