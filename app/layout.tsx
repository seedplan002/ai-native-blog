import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

const SITE_NAME = 'Next.js Portfolio Starter'
const SITE_DESCRIPTION = 'This is my portfolio.'
const SITE_LOCALE = 'en_US'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'My Portfolio',
    description: SITE_DESCRIPTION,
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: SITE_LOCALE,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const THEME_CLASS_NAMES = 'text-black bg-white dark:text-white dark:bg-black'
const BODY_CLASS_NAMES = 'antialiased max-w-xl mx-4 mt-8 lg:mx-auto'
const MAIN_CLASS_NAMES = 'flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'

const combineClassNames = (...classes: (string | boolean | undefined)[]): string =>
  classes.filter(Boolean).join(' ')

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const htmlClassNames = combineClassNames(
    THEME_CLASS_NAMES,
    GeistSans.variable,
    GeistMono.variable
  )

  return (
    <html lang="en" className={htmlClassNames}>
      <body className={BODY_CLASS_NAMES}>
        <main className={MAIN_CLASS_NAMES}>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}

export default RootLayout
