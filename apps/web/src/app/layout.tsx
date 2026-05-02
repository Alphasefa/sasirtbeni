import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import ScrollToTop from "@/components/scroll-to-top";
import ScrollRestoration from "@/components/scroll-restoration";
import SiteHeader from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiYARDIMET | Türkiye vs Almanya Araç Fiyatları",
  description:
    "Türkiye ve Almanya araç fiyatlarını karşılaştır. ÖTV ve KDV dahil ne kadar vergi ödediğini gör. Volkswagen, BMW, Toyota ve daha fazlası.",
  keywords:
    "araç fiyat karşılaştırma, ötv hesaplama, türkiye almanya fiyat, araba vergi hesaplama",
  openGraph: {
    title: "BiYARDIMET - Türkiye vs Almanya Araç Fiyatları",
    description:
      "Türkiye ve Almanya araç fiyatlarını karşılaştır. Ne kadar vergi ödediğini gör.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ScrollRestoration />
          <SiteHeader />
          <main className="min-h-screen pt-16">{children}</main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
