import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { PerspectiveTilt, ScrollStorySection } from "@/components/site/motion";

export const metadata: Metadata = {
  title: "About Our Digital Studio",
  description:
    "An independent digital studio bringing strategy, design, and technology together around meaningful work.",
  alternates: { canonical: "/about" },
};

const principles = [
  [
    "Make it make sense",
    "Clear thinking and useful language are part of the craft, not a finishing touch.",
  ],
  [
    "Stay close to the people",
    "We consider the people who use, maintain, and depend on the work.",
  ],
  [
    "Choose progress over theatre",
    "We make decisions visible, explain trade-offs, and focus on work that can be put to use.",
  ],
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="A little about us"
        title="Independent thinking, built around your next move."
        description="We bring the strategic view and the hands-on craft together, so the plan and the thing people use stay connected."
      />
      <ScrollStorySection>
        <section className="section-block about-belief">
          <div className="content-width about-belief-grid">
            <p className="eyebrow">
              <span />
              Why independent
            </p>
            <div>
              <h2>
                Better work happens when the right people are in the room.
              </h2>
              <p>
                We keep the work close to the people doing it. That means fewer
                handoffs, thoughtful collaboration, and a clear line between the
                business question and the finished experience.
              </p>
              <p>
                BrandUpCrew is the name used for this studio. The work,
                standards, and commitments are described here without borrowed
                client credentials or invented results.
              </p>
            </div>
          </div>
        </section>
      </ScrollStorySection>

      <ScrollStorySection>
        <section className="section-block about-principles">
          <div className="content-width">
            <SectionHeading
              eyebrow="What guides the work"
              title="A few principles we return to."
            />
            <div className="principle-grid">
              {principles.map(([title, text], index) => (
                <PerspectiveTilt key={title} intensity={7}>
                  <article>
                    <span>0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                </PerspectiveTilt>
              ))}
            </div>
          </div>
        </section>
      </ScrollStorySection>

      <ScrollStorySection>
        <section className="about-capabilities">
          <div className="content-width about-capabilities-inner">
            <span className="about-capability-symbol" aria-hidden="true">
              ↗
            </span>
            <div>
              <p className="eyebrow">
                <span />
                One connected perspective
              </p>
              <h2>From the first question to what happens after launch.</h2>
            </div>
            <Link className="underlined-link" href="/services">
              See what we do <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection />
    </main>
  );
}
