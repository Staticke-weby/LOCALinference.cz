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
        Head: './src/components/Head.astro',
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
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'LOCALinference — changelog',
            href: 'https://www.localinference.cz/zdroje/novinky/rss.xml',
          },
        },
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
            { label: 'What is local AI', link: '/getting-started/what-is-local-ai/' },
            { label: 'How it works', link: '/getting-started/how-it-works/' },
            { label: 'How we read data', link: '/getting-started/how-we-read-data/' },
            { label: 'Environment', link: '/getting-started/environment/' },
            { label: 'FAQ', link: '/getting-started/faq/' },
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
            { label: 'Gorgon Halo 192 GB', link: '/devices/gorgon-halo/' },
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
            { label: 'Why MoE', link: '/models/why-moe/' },
          ],
        },
        {
          label: 'Generation',
          items: [
            { label: 'Overview', link: '/generation/' },
            { label: 'Images', link: '/generation/images/' },
            { label: 'Image editing', link: '/generation/image-editing/' },
            { label: 'Video', link: '/generation/video/' },
            { label: 'Video editing', link: '/generation/video-editing/' },
            { label: 'Image to video', link: '/generation/image-to-video/' },
            { label: 'Audio', link: '/generation/audio/' },
            { label: 'Translation', link: '/generation/translation/' },
            { label: '3D', link: '/generation/3d/' },
            { label: 'Game assets', link: '/generation/game-assets/' },
            { label: 'Licensing', link: '/generation/licensing/' },
            {
              label: 'Recipes',
              items: [
                { label: 'Overview', link: '/generation/recipes/' },
                { label: 'Windows', link: '/generation/recipes/windows/' },
                { label: 'macOS', link: '/generation/recipes/macos/' },
                { label: 'DGX OS', link: '/generation/recipes/dgx-os/' },
                { label: 'Linux', link: '/generation/recipes/linux/' },
              ],
            },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Overview', link: '/guides/' },
            { label: 'DGX Spark', link: '/guides/dgx-spark/' },
            { label: 'Strix Halo', link: '/guides/strix-halo/' },
            { label: 'RTX Spark', link: '/guides/rtx-spark/' },
            { label: 'Mac', link: '/guides/mac/' },
          ],
        },
        {
          label: 'Choosing',
          items: [
            { label: 'Budget', link: '/choosing/budget/' },
            { label: 'Desktop or laptop', link: '/choosing/desktop-vs-laptop/' },
            { label: 'How many users', link: '/choosing/how-many-users/' },
            { label: 'Safe choice', link: '/choosing/safe-choice/' },
          ],
        },
        {
          label: 'Dictionary',
          items: [{ label: 'Overview', link: '/dictionary/' }],
        },
        {
          label: 'Topics',
          items: [{ label: 'Overview', link: '/topics/' }],
        },
        {
          label: 'Speed',
          items: [
            { label: 'Roofline', link: '/speed/roofline/' },
            { label: 'Calculator', link: '/speed/calculator/' },
          ],
        },
        {
          label: 'Sources',
          items: [
            { label: 'Sources', link: '/sources/sources/' },
            { label: 'Measurements', link: '/sources/measurements/' },
            { label: 'What we do not know', link: '/sources/what-we-dont-know/' },
            { label: 'Changelog', link: '/sources/changelog/' },
          ],
        },
        {
          label: 'About',
          items: [
            { label: 'About', link: '/about/' },
            { label: 'Methodology', link: '/about/methodology/' },
            { label: 'How we write', link: '/about/how-we-write/' },
            { label: 'Legal', link: '/about/legal/' },
          ],
        },
        {
          label: 'Data',
          items: [
            { label: 'Overview', link: '/data/' },
            { label: 'Qwen3.8 on Strix Halo', link: '/data/qwen3-8-flash-next-strix-halo/' },
          ],
        },
      ],
    }),
  ],
});
