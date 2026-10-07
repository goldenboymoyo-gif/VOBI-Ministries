import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces } from "next/font/google";

import { site } from "@/config/site";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const SITE_URL = "https://vobiministries.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.fullName} — ${site.city}, ${site.country}`,
    template: `%s — ${site.shortName}`,
  },
  description: `${site.fullName} (VOBI) in ${site.city}, ${site.country}. Sunday services, sermons, prayer and testimonies with Prophet Promise. Watch services live and plan your visit.`,
  keywords: [
    "Valley of Blessings International Ministries",
    "VOBI Ministries",
    "Victoria Falls",
    "Zimbabwe",
    "Prophet Promise",
    "VOBI",
    "church Victoria Falls",
    "Sermons Zimbabwe",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: site.fullName,
    title: `${site.fullName} — ${site.city}, ${site.country}`,
    description:
      "Sunday services, sermons, prayer and testimonies with Prophet Promise. Watch live from Victoria Falls, Zimbabwe.",
    images: [{ url: "/media/zS8NL8NMNlQ-maxresdefault.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description:
      "Sunday services, sermons, prayer and testimonies with Prophet Promise. Watch live from Victoria Falls, Zimbabwe.",
    images: ["/media/zS8NL8NMNlQ-maxresdefault.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#101413",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: site.fullName,
  alternateName: "VOBI Ministries",
  url: SITE_URL,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "8875 CBZ, Mkhosana",
    addressLocality: site.city,
    addressRegion: "Matabeleland North",
    addressCountry: "ZW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.coordinates.lat,
    longitude: site.coordinates.lng,
  },
  sameAs: [
    "https://www.youtube.com/@prophetpromiseministries4267",
    "https://www.facebook.com/VOBI_Ministries/",
    "https://www.instagram.com/vobiministries/",
    "https://www.tiktok.com/@vobiministries",
  ],
  founder: { "@type": "Person", name: "Prophet Promise" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
