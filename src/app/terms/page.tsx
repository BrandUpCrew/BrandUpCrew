import type { Metadata } from "next";

import { PageIntro } from "@/components/site/page-intro";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for browsing this website and contacting the studio.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main">
      <PageIntro
        eyebrow="Terms"
        title="A clear starting point."
        description="These draft terms cover use of this website only. A signed project agreement governs any commissioned work."
      />
      <article className="legal-content content-width">
        <p className="legal-updated">Effective date: October 15, 2026</p>
        <h2>Website information</h2>
        <p>
          This website is provided under the {siteConfig.name} name. Content is
          general information and is not professional, legal, financial, or
          technical advice for a specific situation.
        </p>
        <h2>Demonstration concepts</h2>
        <p>
          Portfolio items labeled as demonstrations are fictional concepts. They
          do not identify real clients, represent completed engagements, or
          claim results. Do not treat them as evidence of a specific client
          outcome.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not misuse this site, interfere with its operation, submit unlawful
          material, or attempt to gain unauthorized access to its systems. We
          may restrict access when reasonably necessary to protect the site or
          its users.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Unless identified otherwise, the original text, layouts, and visual
          concepts on this site are provided for viewing only. Obtain written
          permission before reproducing material. Third-party names and marks
          remain the property of their respective owners.
        </p>
        <h2>Availability and liability</h2>
        <p>
          We aim to keep the website accurate and available but do not promise
          uninterrupted operation or that all content will be error-free. To the
          extent permitted by applicable law, the site is provided without
          warranties beyond those that cannot legally be excluded.
        </p>
        <h2>Before launch</h2>
        <p>
          The responsible legal entity, governing law, jurisdiction, limitation
          terms, and any consumer rights must be reviewed and completed for the
          actual business. This template is not legal advice and should not be
          published as final legal terms without qualified review.
        </p>
      </article>
    </main>
  );
}
