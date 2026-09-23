import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://velclaw.github.io/docs.velclaw.ai/'),
  title: {
    default: 'Velclaw Docs',
    template: '%s — Velclaw Docs'
  },
  description:
    'Velclaw documentation for developer tooling, infrastructure, deployment, hosting, domains, automation and AI agents.',
  icons: {
    icon: '/assets/velclaw-animated-mark.svg'
  }
}

const navbar = (
  <Navbar
    logo={
      <span className="velclaw-logo">
        <img src="/assets/velclaw-animated-mark.svg" alt="" width="28" height="28" />
        <strong>velclaw</strong>
      </span>
    }
    projectLink="https://github.com/Velclaw/Velclaw"
    projectIcon={<span aria-hidden="true">↗</span>}
  />
)

const footer = (
  <Footer>
    <span>
      <strong>VELCLAW</strong> · Source-traceable documentation
    </span>
  </Footer>
)

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/Velclaw/docs.velclaw.ai/tree/main"
          sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 2 }}
          navigation={{ prev: true, next: true }}
          darkMode
          themeSwitch={{ dark: 'Tối', light: 'Sáng', system: 'Hệ thống' }}
          toc={{ title: 'Trong phần này', backToTop: 'Lên đầu trang' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
