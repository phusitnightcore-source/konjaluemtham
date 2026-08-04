import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Autosave from "@/components/Autosave";
import MusicToggle from "@/components/MusicToggle";
import PwaRegister from "@/components/PwaRegister";
import FontSizeApply from "@/components/FontSize";

// Google Analytics 4 - เก็บแค่ page view/event ไม่เห็นเนื้อหาที่ผู้ใช้เขียน
const GA_ID = "G-0WCW98YRN4";

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_DESC =
  "พื้นที่ปลอดภัยสำหรับคนที่กำลังจะสูญเสียคนสำคัญ - คำถามที่คิดมาให้แล้ว บทเปิดที่ไม่เหมือนสั่งเสีย บันทึกไว้ในเครื่องคุณเท่านั้น";

export const metadata: Metadata = {
  metadataBase: new URL("https://luemtham.app"),
  title: "ก่อนจะลืมถาม - ถามตอนที่ยังถามได้",
  description: SITE_DESC,
  applicationName: "ก่อนจะลืมถาม",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ก่อนจะลืมถาม",
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "ก่อนจะลืมถาม",
    title: "ก่อนจะลืมถาม - ถามตอนที่ยังถามได้",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "ก่อนจะลืมถาม - ถามตอนที่ยังถามได้",
    description: SITE_DESC,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body>
        <StoreProvider>
          {children}
          <Autosave />
          <MusicToggle />
          <PwaRegister />
          <FontSizeApply />
        </StoreProvider>

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
