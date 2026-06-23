import '@fortawesome/fontawesome-svg-core/styles.css'
import dynamic from 'next/dynamic'
import { Open_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { AppProvider } from '../context'
import { SiteInfo } from './data'
import './globals.css'
import Loading from './loading'
import FloatingContactWrapper from '../components/FloatingContactWrapper'

const Navbar = dynamic(() => import('../components/Navbar'), { suspense: true })
const MenuDropDown = dynamic(() => import('../components/dropdowns/MenuDropDown'), { suspense: true })
const MapDropDown = dynamic(() => import('../components/dropdowns/MapDropDown'), { suspense: true })
const ShareDropDown = dynamic(() => import('../components/dropdowns/ShareDropDown'), { suspense: true })
const ContactDropDown = dynamic(() => import('../components/dropdowns/ContactDropDown'), { suspense: true })
const Footer = dynamic(() => import('../components/Footer'), { suspense: true })
const FixedCall = dynamic(() => import('../components/FixedCall'), { suspense: true })

const openSans = Open_Sans({ subsets: ['latin'] })

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://alameer-hafalat.com')

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SiteInfo.title,
  description: SiteInfo.description,
  icons: { icon: '/icon.ico' },
  verification: { google: 'DsAEdU_7q6zJlPUhicGtWsCdpwR9OQ39WgkUCft8Wpk' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isAdmin = pathname.startsWith('/admin')

  const telephone = SiteInfo.mobileNumber ? String(SiteInfo.mobileNumber).trim() : null

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SiteInfo.title,
    url: SITE_URL,
    ...(telephone ? { telephone } : {}),
    logo: new URL('/icon.ico', SITE_URL).toString(),
  }

  return (
    <html lang="ar" dir="rtl">
      <body className={`${openSans.className} ${isAdmin ? 'bg-gray-100' : 'bg-[#f8f4f4]'}`}>
        {!isAdmin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        )}
        {isAdmin ? (
          children
        ) : (
          <AppProvider>
            <Suspense fallback={<Loading />}>
              <MenuDropDown />
              <MapDropDown />
              <ShareDropDown />
              <ContactDropDown />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <FixedCall />
              <FloatingContactWrapper />
            </Suspense>
          </AppProvider>
        )}
      </body>
    </html>
  )
}
