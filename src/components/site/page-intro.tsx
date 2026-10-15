import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <section className={`page-intro page-intro-${tone}`}>
      <div className="page-intro-inner">
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="page-intro-description">{description}</p>
        {children}
      </div>
      <div className="page-intro-index" aria-hidden="true">
        Independent
        <br />
        by design.
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow && (
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
      )}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
