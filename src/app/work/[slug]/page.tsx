import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CtaSection } from "@/components/site/cta-section";
import { PageIntro } from "@/components/site/page-intro";
import { caseStudies } from "@/content/content";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — demonstration concept`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — demonstration concept`,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = caseStudies.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <main id="main">
      <PageIntro
        eyebrow="Demonstration concept"
        title={project.name}
        description={project.summary}
        tone="dark"
      >
        <span className="demo-pill">{project.label}</span>
      </PageIntro>
      <section
        className={`project-detail-art project-${project.accent}`}
        aria-label={`${project.name} concept artwork`}
      >
        <div className="content-width project-detail-art-inner">
          <div className="project-detail-paper">
            <span>{project.discipline}</span>
            <strong>{project.name}</strong>
            <i />
            <b />
            <small>CONCEPT / NOT CLIENT WORK</small>
          </div>
          <p>
            01 / A visual exploration
            <br />
            No real-world results claimed.
          </p>
        </div>
      </section>
      <section className="section-block project-detail">
        <div className="content-width">
          <div className="project-facts">
            <div>
              <span>Type</span>
              <p>{project.label}</p>
            </div>
            <div>
              <span>Industry</span>
              <p>{project.industry}</p>
            </div>
            <div>
              <span>Discipline</span>
              <p>{project.discipline}</p>
            </div>
          </div>
          <div className="project-story">
            {[
              ["The challenge", project.challenge],
              ["The strategy", project.strategy],
              ["The execution", project.execution],
            ].map(([heading, text]) => (
              <section key={heading}>
                <p className="eyebrow">
                  <span />
                  {heading}
                </p>
                <p>{text}</p>
              </section>
            ))}
          </div>
          <div className="project-delivery">
            <div>
              <span className="story-label">Concept deliverables</span>
              <ul>
                {project.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="story-label">Related services</span>
              <ul>
                {project.services.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="project-integrity">
            This is a fictional demonstration concept created to show a possible
            approach. It is not client work and does not represent a real
            engagement, testimonial, or measured result.
          </p>
          <Link className="underlined-link" href="/work">
            <ArrowLeft aria-hidden="true" size={15} />
            All concepts
          </Link>
        </div>
      </section>
      <CtaSection
        title="Bring us a real-world challenge."
        description="We will start by understanding your context before recommending the work."
      />
    </main>
  );
}
