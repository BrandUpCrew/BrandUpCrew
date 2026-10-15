import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaSection({
  title = "Good work starts with a good conversation.",
  description = "Share what you are working through. We will help you find a useful next step.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="cta-section">
      <div className="cta-mark" aria-hidden="true">
        ↗
      </div>
      <p className="eyebrow">
        <span />
        Next step
      </p>
      <h2>{title}</h2>
      <p className="cta-copy">{description}</p>
      <Link className="button button-light" href="/contact">
        Tell us about your project <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </section>
  );
}
