import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { ArticleCard, ProjectCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { FaqList } from "@/components/site/faq-list";
import { HeroVisual } from "@/components/site/hero-visual";
import { Magnetic, MaskedHeading, Parallax } from "@/components/site/motion";
import {
  HeroBlock,
  Marquee,
  RevealSection,
  StatCounter,
} from "@/components/site/animated";
import { SectionHeading } from "@/components/site/page-intro";
import { TeamPortrait } from "@/components/site/team-portrait";
import {
  faqs,
  articles,
  caseStudies,
  industries,
  processSteps,
  services,
  teamDisciplines,
} from "@/content/content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "BrandUpCrew" },
  description:
    "Strategy, design, development, and digital marketing for organizations ready to make their next move.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BrandUpCrew",
    description:
      "Strategy, design, development, and digital marketing for organizations ready to make their next move.",
    url: "/",
  },
};

export default function HomePage() {
  const [leadService, ...supportingServices] = services;

  return (
    <main id="main">
      <section className="hero" id="hero">
        <div aria-hidden="true" className="hero-stage">
          <HeroVisual />
        </div>
        <div aria-hidden="true" className="hero-scrim" />

        <div className="content-width">
          <div className="hero-shell">
            <div className="hero-content">
              <HeroBlock delay={0.05}>
                <p className="eyebrow hero-eyebrow">
                  <span />
                  {siteConfig.descriptor}
                </p>
              </HeroBlock>

              <MaskedHeading
                className="hero-title"
                lines={[
                  <span key="line-one">Make your next move</span>,
                  <em key="line-two">matter.</em>,
                ]}
                tag="h1"
                trigger="mount"
              />

              <HeroBlock delay={0.4}>
                <p className="hero-description">
                  We bring strategy, design, and technology together to make
                  digital work clearer, more useful, and ready for what comes
                  next.
                </p>

                <div className="hero-actions">
                  <Magnetic>
                    <Link className="button button-light" href="/contact">
                      Start a conversation
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  </Magnetic>
                  <Link className="text-link" href="/services">
                    Explore our services
                    <ArrowDownRight aria-hidden="true" size={16} />
                  </Link>
                </div>

                <div className="hero-stats">
                  <StatCounter value={services.length} label="Capabilities" />
                  <StatCounter
                    value={industries.length}
                    label="Industries"
                    delay={0.1}
                  />
                  <StatCounter
                    value={processSteps.length}
                    label="Process steps"
                    delay={0.2}
                  />
                </div>

                <p className="hero-cue">
                  <span aria-hidden="true" />
                  Scroll to explore
                </p>
              </HeroBlock>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={services.map((service) => service.title)} />

      <RevealSection className="section-block service-section">
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

          <div className="service-feature-grid">
            <Parallax className="service-feature-slot" distance={5}>
              <Link
                className="service-feature"
                href={`/services/${leadService.slug}`}
              >
                <span aria-hidden="true" className="service-feature-art" />
                <span className="service-feature-index">01</span>
                <p className="service-feature-kicker">Lead discipline</p>
                <h3>{leadService.title}</h3>
                <p className="service-feature-copy">{leadService.summary}</p>
                <ul className="service-feature-tags">
                  {leadService.deliverables.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="service-feature-cta">
                  Explore capability
                  <ArrowUpRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </Parallax>

            <ul className="service-rail">
              {supportingServices.slice(0, 5).map((service, index) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>
                    <span className="service-rail-index">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <span className="service-rail-body">
                      <span className="service-rail-title">
                        {service.title}
                      </span>
                      <span className="service-rail-summary">
                        {service.summary}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="service-more">
            <span>From a focused sprint to a connected growth program.</span>
            <Link href="/services">
              Explore all {services.length} capabilities
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="section-block process-preview">
        <div className="content-width process-preview-grid">
          <div>
            <p className="eyebrow">
              <span />
              How we work
            </p>
            <MaskedHeading
              lines={[
                <span key="p-one">Clarity before activity.</span>,
                <em key="p-two">Progress all the way through.</em>,
              ]}
            />
            <p className="section-lead">
              We make the work visible, keep decisions close to evidence, and
              leave your team better equipped for what follows.
            </p>
            <Link className="underlined-link" href="/process">
              See our process <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <ol className="process-list process-rail">
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
      </RevealSection>

      <RevealSection className="section-block work-preview">
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

          <div className="work-showcase">
            {caseStudies.map((project, index) => (
              <Parallax
                className={`work-slot work-slot-${index + 1}`}
                distance={index === 1 ? 11 : 5}
                key={project.slug}
              >
                <ProjectCard project={project} />
              </Parallax>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="industry-band">
        <div className="content-width industry-band-inner">
          <div>
            <p className="eyebrow">
              <span />
              Where we help
            </p>
            <MaskedHeading
              lines={[
                <span key="i-one">Different worlds.</span>,
                <em key="i-two">Shared human needs.</em>,
              ]}
            />
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
      </RevealSection>

      <RevealSection className="section-block team-section">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading
              eyebrow="The people behind the work"
              title="A senior team, shaped around the brief."
              description="A small team with a deliberate point of view—working closely enough to keep strategy, design, and delivery aligned."
            />
            <Link className="underlined-link" href="/about">
              Meet the studio <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>

          <div className="team-grid">
            {teamDisciplines.map((member) => (
              <article
                key={member.number}
                className={`team-card team-card-${member.accent}`}
              >
                <div className="team-profile-portrait">
                  <TeamPortrait
                    name={member.name}
                    number={member.number}
                    role={member.role}
                    src={member.portrait}
                  />
                </div>
                <div className="team-meta">
                  <p className="team-role">{member.role}</p>
                  <h3>{member.name}</h3>
                </div>
                <p className="team-bio">{member.bio}</p>
                <details className="team-profile-details">
                  <summary>
                    Areas of expertise
                    <ArrowDownRight aria-hidden="true" size={16} />
                  </summary>
                  <ul>
                    {member.expertise.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                  {member.linkedin && (
                    <a href={member.linkedin} rel="noreferrer" target="_blank">
                      LinkedIn profile
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </a>
                  )}
                </details>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="section-block insight-preview">
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
      </RevealSection>

      <RevealSection className="section-block home-faq">
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
      </RevealSection>
      <CtaSection />
    </main>
  );
}
