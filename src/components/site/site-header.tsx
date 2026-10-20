"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/site/theme-toggle";

const SECONDARY_NAV = [
  { label: "Industries", href: "/industries" },
  { label: "Our process", href: "/process" },
  { label: "FAQs", href: "/faq" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the panel whenever the route changes (adjust state during render).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" data-scrolled={scrolled}>
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
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link className="nav-contact" href="/contact">
            Start a project <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>

        <ThemeToggle />

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
      </div>

      <div className="mobile-nav" id="mobile-navigation" hidden={!open}>
        <nav aria-label="Mobile navigation">
          {[...siteConfig.navigation, ...SECONDARY_NAV].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          ))}
          <Link className="nav-contact" href="/contact">
            Start a project <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
