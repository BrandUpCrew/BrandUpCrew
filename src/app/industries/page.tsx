import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { PerspectiveTilt, ScrollStorySection } from "@/components/site/motion";
import { StaggerGroup, StaggerItem } from "@/components/site/animated";
import { industries } from "@/content/content";

export const metadata: Metadata = {
  title: "Industries We Support",
  description:
    "Digital design, technology, and growth support for teams across a range of sectors.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Who we work with"
        title="Different contexts. A shared focus on people."
        description="We bring a fresh perspective to each engagement, learning the context before recommending a solution."
      />
      <ScrollStorySection>
        <section className="section-block">
          <div className="content-width">
            <SectionHeading
              eyebrow="Areas of experience"
              title="Built around your world."
              description="These are starting points, not limits. We focus on understanding the needs, constraints, and people specific to your organization."
            />
            <StaggerGroup className="industry-cards" stagger={0.06}>
              {industries.map((industry, index) => (
                <StaggerItem key={industry.slug}>
                  <PerspectiveTilt intensity={7}>
                    <article>
                      <span>0{index + 1} / SECTOR</span>
                      <h2>{industry.title}</h2>
                      <p>{industry.description}</p>
                    </article>
                  </PerspectiveTilt>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <p className="industry-disclaimer">
              Sector descriptions explain our areas of focus; they do not imply
              a specific client engagement or outcome.
            </p>
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection />
    </main>
  );
}
