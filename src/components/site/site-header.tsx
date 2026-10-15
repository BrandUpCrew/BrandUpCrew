import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          className="brand-lockup"
          href="/"
          aria-label={`${siteConfig.name} home`}
        >
          <span aria-hidden="true" className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">{siteConfig.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="nav-contact" href="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <Menu aria-hidden="true" size={20} />
          </summary>
          <nav aria-label="Mobile navigation">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/industries">Industries</Link>
            <Link href="/process">Our process</Link>
            <Link href="/faq">FAQs</Link>
            <Link className="nav-contact" href="/contact">
              Start a conversation <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
