import Image from "next/image";

import { siteConfig } from "@/config/site";

export function BrandLoader({ mode }: { mode: "initial" | "route" }) {
  const isInitial = mode === "initial";

  return (
    <div
      aria-atomic="true"
      aria-label={isInitial ? `Loading ${siteConfig.name}` : undefined}
      aria-live="polite"
      className={`brand-loader brand-loader-${mode}`}
      role="status"
    >
      <div aria-hidden="true" className="brand-loader-stage">
        <span className="brand-loader-aura" />
        <span className="brand-loader-halo" />
        <span className="brand-loader-orbit" />
        <div className="brand-loader-emblem-enter">
          <div className="brand-loader-emblem">
            <Image
              alt=""
              className="brand-loader-logo"
              height={192}
              priority
              src={siteConfig.logo}
              width={192}
            />
            <span className="brand-loader-sheen">
              <Image
                alt=""
                className="brand-loader-sheen-mark"
                height={192}
                loading="eager"
                src={siteConfig.logo}
                width={192}
              />
            </span>
          </div>
        </div>
      </div>

      <div className="brand-loader-lockup">
        <p className="brand-loader-name">{siteConfig.name}</p>
        <span className="brand-loader-rule" />
        {isInitial ? (
          <p className="brand-loader-tagline">{siteConfig.tagline}</p>
        ) : (
          <p className="brand-loader-message">Opening your page</p>
        )}
      </div>

      <div aria-hidden="true" className="brand-loader-track">
        <span />
      </div>
    </div>
  );
}
