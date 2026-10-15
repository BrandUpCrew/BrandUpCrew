import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import type { Metadata } from "next";

import { ArticleCard, ProjectCard, ServiceCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { SectionHeading } from "@/components/site/page-intro";
import {
  faqs,
  articles,
  caseStudies,
  industries,
  processSteps,
  services,
} from "@/content/content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Independent digital growth & technology",
  description:
    "Strategy, design, development, and digital marketing for organizations ready to make their next move.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Independent digital growth & technology",
    description:
      "Strategy, design, development, and digital marketing for organizations ready to make their next move.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <main id="main">
      <section className="home-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span />
              {siteConfig.descriptor}
            </p>
            <h1>
              Make your next move <em>matter.</em>
            </h1>
            <p className="hero-description">
              We bring strategy, design, and technology together to make digital
              work clearer, more useful, and ready for what comes next.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/contact">
                Start a conversation{" "}
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
              <Link className="text-link" href="/services">
                Explore our services{" "}
                <ArrowDownRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <p className="hero-note">
              Independent perspective. Thoughtful delivery. No borrowed
              playbook.
            </p>
          </div>
          <div
            className="hero-composition"
            aria-label="Abstract, original studio artwork"
          >
            <div className="hero-composition-top">
              <span>Ideas into action</span>
              <span>01 — 04</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="hero-sun" />
            <div className="hero-composition-bottom">
              <span>Strategy / Design / Technology</span>
              <MoveUpRight aria-hidden="true" size={18} />
            </div>
          </div>
        </div>
        <div className="hero-stamp">
          <span>Small enough to care</span>
          <span>Built to think bigger</span>
        </div>
      </section>

      <section className="intro-strip content-width">
        <p className="eyebrow">
          <span />A useful kind of independent
        </p>
        <p className="intro-statement">
          Good digital work isn&apos;t a collection of deliverables. It&apos;s a
          better way for people to find you, understand you, and move forward.
        </p>
        <Link href="/about" className="underlined-link">
          Meet the studio <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </section>

      <section className="section-block service-section">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="What we do"
              title="One partner. The right mix of disciplines."
              description="Bring us a specific challenge or a bigger ambition. We shape the team and approach around what will make a difference."
            />
            <Link className="underlined-link" href="/services">
              All services <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <div className="service-grid">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
          <div className="service-more">
            <span>From a focused sprint to a connected growth program.</span>
            <Link href="/services">
              Explore all 12 capabilities{" "}
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block process-preview">
        <div className="content-width process-preview-grid">
          <div>
            <p className="eyebrow">
              <span />
              How we work
            </p>
            <h2>
              Clarity before activity.
              <br />
              <em>Progress all the way through.</em>
            </h2>
            <p className="section-lead">
              We make the work visible, keep decisions close to evidence, and
              leave your team better equipped for what follows.
            </p>
            <Link className="underlined-link" href="/process">
              See our process <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <ol className="process-list">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="process-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <ArrowUpRight aria-hidden="true" size={16} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-block work-preview">
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
          <div className="project-grid">
            {caseStudies.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="industry-band">
        <div className="content-width industry-band-inner">
          <div>
            <p className="eyebrow">
              <span />
              Where we help
            </p>
            <h2>
              Different worlds.
              <br />
              <em>Shared human needs.</em>
            </h2>
            <Link className="underlined-link" href="/industries">
              Explore industries <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <ul className="industry-list">
            {industries.map((industry, index) => (
              <li key={industry.slug}>
                <span>0{index + 1}</span>
                {industry.title}
                <ArrowUpRight aria-hidden="true" size={15} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-block insight-preview">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="Notes from the studio"
              title="Useful thinking, openly shared."
              description="Practical perspectives on digital strategy, design, search, and technology."
            />
            <Link className="underlined-link" href="/insights">
              All insights <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <div className="article-grid">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block home-faq">
        <div className="content-width home-faq-grid">
          <div>
            <p className="eyebrow">
              <span />A few useful answers
            </p>
            <h2>Before we begin.</h2>
            <p>
              Good questions lead to better work. Here are a few we hear often.
            </p>
            <Link className="underlined-link" href="/faq">
              More questions answered{" "}
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <FaqList items={faqs.slice(0, 4)} />
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
