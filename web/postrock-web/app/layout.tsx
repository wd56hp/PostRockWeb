import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AlertBanner } from "@/components/AlertBanner";
import { OrganizationJsonLd } from "@/components/schema-org";
import { getAlertConfig } from "@/lib/alert";
import { brandImages } from "@/lib/brand-assets";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Agricultural services`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: brandImages.postRockLogoSquare, width: 1200, height: 630, alt: siteConfig.name }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const alert = getAlertConfig();

  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <OrganizationJsonLd />
        <AlertBanner id={alert.id} active={alert.active} message={alert.message} severity={alert.severity} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
