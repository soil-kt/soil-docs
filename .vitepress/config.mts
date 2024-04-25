import { defineConfig, type DefaultTheme } from 'vitepress'

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'What is Soil?', link: 'what-is-soil' },
        { text: 'Getting Started', link: 'getting-started' },
        { text: 'FAQ', link: 'faq' },
      ]
    },
    {
      text: 'Query',
      items: [
        { text: 'Hello, Query', link: 'query/hello-query' },
        { text: 'Coming soon... 🚧 🚧', link: 'wip' }
      ]
    },
    {
      text: 'Form',
      items: [
        { text: 'Hello, Form', link: 'form/hello-form' },
        { text: 'Coming soon... 🚧 🚧', link: 'wip' }
      ]
    },
    {
      text: 'Space',
      items: [
        { text: 'Hello, Space', link: 'space/hello-space' },
        { text: 'Coming soon... 🚧 🚧', link: 'wip' }
      ]
    }
  ]
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Soil",
  description: "Compose-First Power Packs for Kotlin Multiplatform and Android",
  appearance: false,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://docs.soil-kt.com'
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', rel: 'stylesheet' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/soil-logo-mini.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/soil-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#BEA47C' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Soil | Compose-First Power Packs' }],
    ['meta', { property: 'og:site_name', content: 'Soil' }],
    ['meta', { property: 'og:image', content: 'https://docs.soil-kt.com/soil-og.jpg' }],
    ['meta', { property: 'og:url', content: 'https://docs.soil-kt.com/' }],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      themeConfig: {
        sidebar: {
          "/ja/guide/": { base: '/ja/guide/', items: sidebarGuide() }
        }
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' }
    ],

    sidebar: {
        "/guide/": { base: '/guide/', items: sidebarGuide() }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/soil-kt/soil' },
      { icon: 'x', link: 'https://twitter.com/soil_kt' },
    ]
  }
})
