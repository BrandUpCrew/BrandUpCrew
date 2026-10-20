import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { Parallax } from "@/components/site/motion";
import { RevealSection } from "@/components/site/animated";
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
        </div>
      </section>
      <RevealSection className="section-block work-preview">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Selected concepts"
              title="A glimpse of how we think."
              description="These clearly labeled demonstrations show our approach. They are not client work and do not claim real-world results."
            />
            <Link className="underlined-link" href="/work">
              View all concepts <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>

          <div className="work-showcase">
            {caseStudies.map((project, index) => (
              <Parallax
                className={`work-slot work-slot-${index + 1}`}
                distance={index === 1 ? 11 : 5}
                key={project.slug}
              >
                <ProjectCard project={project} />
              </Parallax>
            ))}
          </div>
        </div>
      </RevealSection>
      <CtaSection
        title="Your challenge will be different."
        description="Tell us what you are working through and we can start with the question that matters most."
      />
    </main>
  );
}
