import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { services } from "@/content/content";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.summary },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main id="main">
      <PageIntro
        eyebrow="Service / 01 to 12"
        title={service.title}
        description={service.summary}
        tone="dark"
      >
        <Link
          className="button button-light"
          href={`/contact?service=${service.slug}`}
        >
          Talk about this service <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </PageIntro>
      <section className="section-block service-story">
        <div className="content-width service-story-grid">
          <div className="service-story-aside">
            <p className="eyebrow">
              <span />
              The opportunity
            </p>
            <h2>
              Make the complex feel <em>clear.</em>
            </h2>
          </div>
          <div className="service-problem">
            <div>
              <span className="story-label">The challenge</span>
              <p>{service.problem}</p>
            </div>
            <div>
              <span className="story-label">The intended outcome</span>
              <p>{service.outcome}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-block service-deliverables">
        <div className="content-width service-two-col">
          <div>
            <p className="eyebrow">
              <span />
              What we bring
            </p>
            <h2>Practical by design.</h2>
            <p className="section-lead">
              The exact scope is shaped with you, but work may include:
            </p>
          </div>
          <ul className="check-list">
            {service.deliverables.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" size={17} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-block service-process">
        <div className="content-width">
          <SectionHeading
            eyebrow="A considered process"
            title="From first questions to useful progress."
          />
          <ol className="service-steps">
            {service.process.map((step, index) => (
              <li key={step}>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <div className="channel-list">
            <span className="story-label">
              Relevant technologies & channels
            </span>
            <div>
              {service.channels.map((channel) => (
                <span key={channel}>{channel}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-block service-faq">
        <div className="content-width home-faq-grid">
          <div>
            <p className="eyebrow">
              <span />
              Good to know
            </p>
            <h2>Common questions.</h2>
          </div>
          <FaqList items={service.faqs} />
        </div>
      </section>
      <div className="service-back content-width">
        <Link className="underlined-link" href="/services">
          <ArrowLeft aria-hidden="true" size={15} />
          All services
        </Link>
      </div>
      <CtaSection
        title={`Let's talk about ${service.shortTitle.toLowerCase()}.`}
      />
    </main>
  );
}
