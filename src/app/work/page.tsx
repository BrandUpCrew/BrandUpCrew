import type { Metadata } from "next";

import { ProjectCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { caseStudies } from "@/content/content";

export const metadata: Metadata = {
  title: "Digital Work & Demonstration Concepts",
  description:
    "Explore demonstration concepts that illustrate our approach to digital design, technology, and growth.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Selected work"
        title="A look at how we approach a challenge."
        description="These demonstration concepts are here to make our thinking tangible. They are not commissioned client projects and include no claimed performance results."
      />
      <section className="section-block">
        <div className="content-width">
          <div className="portfolio-note">
            <span>Read this first</span>
            <p>
              Every project on this page is explicitly labeled as a
              demonstration. No client names, testimonials, or performance
              metrics are presented as real.
            </p>
          </div>
          <SectionHeading
            eyebrow="Demonstration concepts"
            title="Ideas made visible."
          />
          <div className="project-grid">
            {caseStudies.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
      <CtaSection
        title="Your challenge will be different."
        description="Tell us what you are working through and we can start with the question that matters most."
      />
    </main>
  );
}
