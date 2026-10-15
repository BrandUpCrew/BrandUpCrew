import type { Metadata } from "next";
import { Check } from "lucide-react";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { processSteps } from "@/content/content";

export const metadata: Metadata = {
  title: "Our process",
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
      <section className="section-block">
        <div className="content-width">
          <SectionHeading
            eyebrow="Four useful phases"
            title="Thoughtful, not overcomplicated."
          />
          <ol className="process-page-list">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="process-number">{step.number}</span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
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
          <ul className="check-list">
            {commitments.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" size={17} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaSection
        title="Have a challenge in mind?"
        description="Let’s talk about where you are, what matters, and whether we are the right people to help."
      />
    </main>
  );
}
