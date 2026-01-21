import './globals.css'
import cn from 'classnames'
import type { Metadata } from 'next'
import { Gowun } from './fonts'
import { Analytics } from './layout/analytics'
import Header from './layout/header'
import { HOME_OG_IMAGE_URL, SITE_URL } from './lib/constants'

export const metadata: Metadata = {
  verification: {
    google: 'nVDv8WmLV18rMEtWA5RSYOPLd7QSJ7yvxNfcJP7Om3c',
  },
  title: `Nohgh Blog`,
  description: `안녕하세요. 노기훈의 블로그입니다.`,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/favicon/icon.svg',
  },
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(Gowun.variable)}>
      <body
        className={cn(
          'flex min-h-screen flex-col dark:bg-zinc-900 dark:text-neutral-400 bg-[#FFF9F4]',
        )}
      >
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
      <Analytics />
    </html>
  )
}
