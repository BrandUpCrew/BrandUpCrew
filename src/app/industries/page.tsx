import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { industries } from "@/content/content";

export const metadata: Metadata = {
  title: "Industries",
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
      <section className="section-block">
        <div className="content-width">
          <SectionHeading
            eyebrow="Areas of experience"
            title="Built around your world."
            description="These are starting points, not limits. We focus on understanding the needs, constraints, and people specific to your organization."
          />
          <div className="industry-cards">
            {industries.map((industry, index) => (
              <article key={industry.slug}>
                <span>0{index + 1} / SECTOR</span>
                <h2>{industry.title}</h2>
                <p>{industry.description}</p>
              </article>
            ))}
          </div>
          <p className="industry-disclaimer">
            Sector descriptions explain our areas of focus; they do not imply a
            specific client engagement or outcome.
          </p>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
