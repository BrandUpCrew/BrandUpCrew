import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ServiceCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { services } from "@/content/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore strategy, design, development, and marketing services built around your business priorities.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Our capabilities"
        title="The right work, in the right order."
        description="A connected set of digital services, brought together around the challenge you need to solve—not a one-size-fits-all package."
      />
      <section className="section-block">
        <div className="content-width">
          <SectionHeading
            eyebrow="12 ways to move forward"
            title="Build what your business actually needs."
          />
          <div className="service-grid service-grid-full">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
      <section className="service-approach-band">
        <div className="content-width service-approach-inner">
          <span>Our point of view</span>
          <p>
            We don&apos;t start with a menu of deliverables. We start by
            understanding what needs to change—and what is worth doing first.
          </p>
          <Link href="/process">
            How we work <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
