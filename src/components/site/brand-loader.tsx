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
        <div className="brand-loader-emblem">
          <div className="brand-loader-emblem-face">
            <span />
            <span />
            <span />
          </div>
          <div className="brand-loader-emblem-side" />
        </div>
      </div>
      <p className="brand-loader-name">{siteConfig.name}</p>
      <p className="brand-loader-message">{label}</p>
      <div aria-hidden="true" className="brand-loader-track">
        <span />
      </div>
    </div>
  );
}
