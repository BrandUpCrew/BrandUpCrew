import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";

import { siteConfig } from "@/config/site";
import { SiteShell } from "@/components/site/site-shell";
import { initializeThemeScript } from "@/lib/theme";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-montserrat",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={siteConfig.locale}
      className={montserrat.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="initialize-color-theme" strategy="beforeInteractive">
          {initializeThemeScript}
        </Script>
        <Script id="initial-page-loader-gate" strategy="beforeInteractive">
          {`document.documentElement.dataset.initialLoader = "pending";`}
        </Script>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
