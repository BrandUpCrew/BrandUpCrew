import Image from "next/image";

import { siteConfig } from "@/config/site";

export function BrandLoader({ mode }: { mode: "initial" | "route" }) {
  const label =
    mode === "initial" ? "Preparing your experience" : "Opening your page";

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={`brand-loader brand-loader-${mode}`}
      role="status"
    >
      <div aria-hidden="true" className="brand-loader-emblem-wrap">
        <span className="brand-loader-ring" />
        <Image
          alt=""
          className="brand-loader-logo"
          height={76}
          priority
          src={siteConfig.logo}
          width={76}
        />
      </div>
      <p className="brand-loader-name">{siteConfig.name}</p>
      <p className="brand-loader-message">{label}</p>
      <div aria-hidden="true" className="brand-loader-track">
        <span />
      </div>
    </div>
  );
}
