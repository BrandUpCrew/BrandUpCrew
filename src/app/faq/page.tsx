import type { Metadata } from "next";

import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { PageIntro } from "@/components/site/page-intro";
import { ScrollStorySection } from "@/components/site/motion";
import { faqs } from "@/content/content";

export const metadata: Metadata = {
  title: "Digital Agency FAQs",
  description:
    "Answers to common questions about how we work, scope projects, and measure progress.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Frequently asked questions"
        title="A few things worth knowing."
        description="If your question is not covered here, get in touch and we will give you a direct answer."
      />
      <ScrollStorySection>
        <section className="section-block">
          <div className="content-width faq-page-grid">
            <div>
              <p className="eyebrow">
                <span />
                Good to know
              </p>
              <h2>Clear answers, before we begin.</h2>
            </div>
            <FaqList items={faqs} />
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection
        title="Still have a question?"
        description="Tell us what you need to know. We are happy to start there."
      />
    </main>
  );
}
