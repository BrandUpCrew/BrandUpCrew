import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Magnetic, MaskedHeading, SpatialCta } from "@/components/site/motion";

export function CtaSection({
  title = "Good work starts with a good conversation.",
  description = "Share what you are working through. We will help you find a useful next step.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <SpatialCta>
      <div className="cta-mark" aria-hidden="true">
        ↗
      </div>
      <p className="eyebrow">
        <span />
        Next step
      </p>
      <MaskedHeading lines={[title]} tag="h2" trigger="scroll" />
      <p className="cta-copy">{description}</p>
      <Magnetic strength={0.25}>
        <Link className="button button-light" href="/contact">
          Tell us about your project{" "}
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </Magnetic>
    </SpatialCta>
  );
}
