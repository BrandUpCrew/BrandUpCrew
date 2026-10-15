import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { siteConfig } from "@/config/site";
import { SiteShell } from "@/components/site/site-shell";

import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "design agency",
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  openGraph: {
    type: "website",
    locale: "en",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f8f5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.locale}>
      <body className={`${sans.variable} ${display.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
