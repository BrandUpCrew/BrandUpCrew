import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { PageIntro } from "@/components/site/page-intro";
import { PerspectiveTilt, ScrollStorySection } from "@/components/site/motion";
import { services, teamDisciplines } from "@/content/content";

export const metadata: Metadata = {
  title: "Start a Digital Project",
  description:
    "Tell us about your project, the challenge you are working through, or the opportunity you see.",
  alternates: { canonical: "/contact" },
};

type ContactPageProps = {
  searchParams: Promise<{ service?: string; team?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service: serviceSlug, team: teamSlug } = await searchParams;
  const initialService = services.some(
    (service) => service.slug === serviceSlug,
  )
    ? serviceSlug
    : "";
  const initialMember = teamDisciplines.find(
    (member) => member.slug === teamSlug,
  );
  return (
    <main id="main">
      <PageIntro
        eyebrow="Contact the studio"
        title="Start with what you are trying to change."
        description="A few details help us understand your context. We will come back with a considered response and a useful next step."
      />
      <ScrollStorySection>
        <section className="section-block contact-section">
          <div className="content-width contact-layout">
            <aside className="contact-sidebar">
              <PerspectiveTilt intensity={5} glare={false}>
                <div className="contact-aside-item">
                  <Mail aria-hidden="true" size={18} />
                  <div>
                    <span>What happens next</span>
                    <p>
                      We review each inquiry and respond with any useful
                      follow-up questions or a suggested conversation.
                    </p>
                  </div>
                </div>
              </PerspectiveTilt>
              <PerspectiveTilt intensity={5} glare={false}>
                <div className="contact-aside-item">
                  <ShieldCheck aria-hidden="true" size={18} />
                  <div>
                    <span>Your information</span>
                    <p>
                      We only request the details needed to understand and
                      respond. Please do not include sensitive personal
                      information.
                    </p>
                  </div>
                </div>
              </PerspectiveTilt>
              <PerspectiveTilt intensity={5} glare={false}>
                <div className="contact-expectation">
                  <span>Good to know</span>
                  <p>
                    We do not send an inquiry anywhere unless the delivery
                    provider has been configured. If it is not available, the
                    form will tell you clearly.
                  </p>
                </div>
              </PerspectiveTilt>
            </aside>
            <div>
              <h2>Tell us a little about it.</h2>
              <ContactForm
                initialMember={
                  initialMember
                    ? { slug: initialMember.slug, name: initialMember.name }
                    : undefined
                }
                initialService={initialService}
              />
            </div>
          </div>
        </section>
      </ScrollStorySection>
    </main>
  );
}
