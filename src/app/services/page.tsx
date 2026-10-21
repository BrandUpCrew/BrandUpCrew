import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ServiceCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { ScrollStorySection } from "@/components/site/motion";
import { StaggerGroup, StaggerItem } from "@/components/site/animated";
import { services } from "@/content/content";

export const metadata: Metadata = {
  title: "Digital Strategy, Design & Development Services",
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
        description="A connected set of digital services, brought together around the challenge you need to solve, not a one-size-fits-all package."
      />
      <ScrollStorySection>
        <section className="section-block">
          <div className="content-width">
            <SectionHeading
              eyebrow="12 ways to move forward"
              title="Build what your business actually needs."
            />
            <StaggerGroup
              className="service-grid service-grid-full"
              stagger={0.05}
            >
              {services.map((service, index) => (
                <StaggerItem key={service.slug}>
                  <ServiceCard service={service} index={index} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      </ScrollStorySection>

      <ScrollStorySection>
        <section className="service-approach-band">
          <div className="content-width service-approach-inner">
            <span>Our point of view</span>
            <p>
              We don&apos;t start with a menu of deliverables. We start by
              understanding what needs to change, and what is worth doing first.
            </p>
            <Link href="/process">
              How we work <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection />
    </main>
  );
}
