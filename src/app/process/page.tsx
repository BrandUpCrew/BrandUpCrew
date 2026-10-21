import type { Metadata } from "next";
import { Check } from "lucide-react";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import {
  PerspectiveTilt,
  ScrollStorySection,
  TimelineProgress,
} from "@/components/site/motion";
import { StaggerGroup, StaggerItem } from "@/components/site/animated";
import { processSteps } from "@/content/content";

export const metadata: Metadata = {
  title: "Our Digital Project Process",
  description:
    "A collaborative, evidence-informed approach from discovery through delivery and continuous improvement.",
  alternates: { canonical: "/process" },
};

const commitments = [
  "A named point of contact and agreed decision-makers",
  "Review points that make the work visible as it develops",
  "Clear assumptions, risks, and responsibilities",
  "An accessible handover and practical next steps",
];

export default function ProcessPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="How we work"
        title="A good process makes room for better decisions."
        description="We keep collaboration practical, make the work visible, and adapt the level of process to the size and risk of the project."
      />
      <ScrollStorySection>
        <section className="section-block">
          <div className="content-width">
            <SectionHeading
              eyebrow="Four useful phases"
              title="Thoughtful, not overcomplicated."
            />
            <div style={{ position: "relative" }}>
              <TimelineProgress className="process-timeline-progress" />
              <ol className="process-page-list">
                {processSteps.map((step) => (
                  <PerspectiveTilt
                    key={step.number}
                    intensity={5}
                    glare={false}
                  >
                    <li>
                      <span className="process-number">{step.number}</span>
                      <h2>{step.title}</h2>
                      <p>{step.text}</p>
                    </li>
                  </PerspectiveTilt>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </ScrollStorySection>

      <ScrollStorySection>
        <section className="process-commitments">
          <div className="content-width process-commitments-grid">
            <div>
              <p className="eyebrow">
                <span />
                What you can expect
              </p>
              <h2>
                Steady communication.
                <br />
                <em>No mystery process.</em>
              </h2>
            </div>
            <StaggerGroup className="check-list" stagger={0.06}>
              {commitments.map((item) => (
                <StaggerItem key={item}>
                  <li>
                    <Check aria-hidden="true" size={17} />
                    {item}
                  </li>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection
        title="Have a challenge in mind?"
        description="Let’s talk about where you are, what matters, and whether we are the right people to help."
      />
    </main>
  );
}
