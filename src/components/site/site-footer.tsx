import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
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
          <p>
            Independent thinking, thoughtful design, and useful technology for
            what comes next.
          </p>
        </div>
        <div className="footer-column">
          <p className="footer-label">Explore</p>
          <Link href="/services">Services</Link>
          <Link href="/work">Selected work</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/process">How we work</Link>
          <Link href="/insights">Insights</Link>
        </div>
        <div className="footer-column">
          <p className="footer-label">Studio</p>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-contact">
          <p className="footer-label">Have something in mind?</p>
          <Link className="footer-contact-link" href="/contact">
            Tell us about it <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <p>Thoughtful projects start with a useful conversation.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
        <span>{siteConfig.descriptor}</span>
        <Link href="/contact">
          Work with us <ArrowUpRight aria-hidden="true" size={13} />
        </Link>
      </div>
    </footer>
  );
}
