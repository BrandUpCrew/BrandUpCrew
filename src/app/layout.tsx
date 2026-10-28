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
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
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
      data-initial-loader="pending"
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html { background: #050608; }
            .brand-loader-initial {
              --loader-emblem-size: 96px;
              position: fixed;
              z-index: 120;
              inset: 0;
              display: none;
              align-content: center;
              justify-items: center;
              overflow: hidden;
              background: #050608;
              color: #eef2ff;
              opacity: 1;
              visibility: visible;
              transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
            }
            html[data-initial-loader="pending"] .brand-loader-initial,
            html[data-initial-loader="leaving"] .brand-loader-initial {
              display: grid;
            }
            html[data-initial-loader="leaving"] .brand-loader-initial {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
            @media (max-width: 30rem) {
              .brand-loader-initial { --loader-emblem-size: 76px; }
            }
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script id="initialize-color-theme" strategy="beforeInteractive">
          {initializeThemeScript}
        </Script>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
