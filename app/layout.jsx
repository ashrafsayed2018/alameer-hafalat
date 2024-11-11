import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import MenuDropDown from "../components/dropdowns/MenuDropDown";
import { AppProvider } from "../context";
import MapDropDown from "../components/dropdowns/MapDropDown";
import ShareDropDown from "../components/dropdowns/ShareDropDown";
import ContactDropDown from "../components/dropdowns/ContactDropDown";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Footer from "../components/Footer";
import FixedCall from "../components/FixedCall";
import FixedMobileCall from "../components/FixedMobileCall";
import { SiteInfo } from "./data";
const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: SiteInfo.title,
  description: SiteInfo.description,
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${openSans.className} bg-[#f8f4f4]`}>
        <AppProvider>
          <MenuDropDown />
          <MapDropDown />
          <ShareDropDown />
          <ContactDropDown />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FixedCall />
          <FixedMobileCall />
        </AppProvider>
      </body>
    </html>
  );
}
