import type { Metadata } from "next";

import { PageIntro } from "@/components/site/page-intro";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How this website handles information submitted through the contact form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Privacy"
        title="Your information deserves care."
        description="This notice explains the information this website requests and how the contact workflow is intended to handle it."
      />
      <article className="legal-content content-width">
        <p className="legal-updated">Effective date: October 15, 2026</p>
        <h2>Who is responsible?</h2>
        <p>
          {siteConfig.name} is the agency name used on this website. Before
          launch, the responsible legal entity, postal address, and
          jurisdiction-specific contact details must be added here and the
          notice reviewed for the applicable laws.
        </p>
        <h2>Information you provide</h2>
        <p>
          If you submit an inquiry, the form collects your name, business email,
          optional company and website, selected services, optional budget and
          timeline, and project details. Do not submit sensitive personal
          information.
        </p>
        <h2>How information is used</h2>
        <p>
          Submitted information is used only to assess and respond to your
          inquiry. It is not used for advertising or sold. This starter website
          does not set analytics or advertising cookies.
        </p>
        <h2>Delivery and retention</h2>
        <p>
          The contact form requires a configured email delivery provider. When
          configured, information is transmitted to that provider to deliver the
          inquiry; the provider’s processing terms and retention practices must
          be reviewed before launch. When delivery is not configured, the form
          reports that the inquiry was not sent and does not store it in this
          application.
        </p>
        <p>
          Rate limiting uses temporary in-memory request counters on the running
          server. The application does not intentionally retain IP addresses,
          but hosting infrastructure may process request metadata under its own
          policies. Establish and publish a retention period for inquiry emails
          before launch.
        </p>
        <h2>Your choices and rights</h2>
        <p>
          Privacy rights depend on where you live. Before launch, add the
          correct contact route and instructions for exercising rights, and
          identify any lawful basis and retention period applicable to the
          operating business.
        </p>
        <h2>Changes to this notice</h2>
        <p>
          This notice should be updated when the website, providers, or business
          practices change. It is a project template, not legal advice or a
          substitute for jurisdiction-specific review.
        </p>
      </article>
    </main>
  );
}
