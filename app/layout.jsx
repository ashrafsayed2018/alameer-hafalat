import '@fortawesome/fontawesome-svg-core/styles.css'
import dynamic from 'next/dynamic'
import { Open_Sans } from 'next/font/google'
import { Suspense } from 'react'
import { AppProvider } from '../context'
import { SiteInfo } from './data'
import './globals.css'
import Loading from './loading'
import FloatingContact from '../components/FloatingContact'

// Dynamically import Navbar, Footer, and dropdowns
const Navbar = dynamic(() => import('../components/Navbar'), { suspense: true })
const MenuDropDown = dynamic(
  () => import('../components/dropdowns/MenuDropDown'),
  { suspense: true }
)
const MapDropDown = dynamic(
  () => import('../components/dropdowns/MapDropDown'),
  { suspense: true }
)
const ShareDropDown = dynamic(
  () => import('../components/dropdowns/ShareDropDown'),
  { suspense: true }
)
const ContactDropDown = dynamic(
  () => import('../components/dropdowns/ContactDropDown'),
  { suspense: true }
)
const Footer = dynamic(() => import('../components/Footer'), { suspense: true })
const FixedCall = dynamic(() => import('../components/FixedCall'), {
  suspense: true,
})
const FixedMobileCall = dynamic(() => import('../components/FixedMobileCall'), {
  suspense: true,
})

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
  icons: {
    icon: '/icon.ico',
  },
  verification: {
    google: 'DsAEdU_7q6zJlPUhicGtWsCdpwR9OQ39WgkUCft8Wpk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${openSans.className} bg-[#f8f4f4]`}>
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
            {/* <FixedMobileCall /> */}
            <FloatingContact />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  )
}