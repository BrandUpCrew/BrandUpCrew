import type { ReactNode } from "react";

import { ScrollProgress } from "@/components/site/animated";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
