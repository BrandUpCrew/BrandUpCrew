import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
} from "lucide-react";

import { TeamPortrait } from "@/components/site/team-portrait";
import type { TeamMember } from "@/content/content";

function contactHref(member: TeamMember) {
  const query = new URLSearchParams({
    team: member.slug,
    service: member.inquiryService,
  });
  return `/contact?${query.toString()}`;
}

export function TeamProfilePage({
  member,
  relatedMembers,
}: {
  member: TeamMember;
  relatedMembers: TeamMember[];
}) {
  const inquiryHref = contactHref(member);

  return (
    <main id="main" className={`team-profile-page team-card-${member.accent}`}>
      <div className="content-width team-profile-breadcrumbs">
        <Link href="/">Home</Link>
        <ChevronRight aria-hidden="true" size={14} />
        <Link href="/#team">Team</Link>
        <ChevronRight aria-hidden="true" size={14} />
        <span aria-current="page">{member.name}</span>
      </div>

      <section className="team-profile-hero">
        <div className="content-width team-profile-hero-inner">
          <div className="team-profile-hero-copy">
            <p className="eyebrow">
              <span />
              Team profile / {member.number}
            </p>
            <h1>{member.name}</h1>
            <p className="team-profile-title">{member.role}</p>
            <p className="team-profile-lead">{member.bio}</p>
            <div className="team-profile-actions">
              <Link className="button button-dark" href={inquiryHref}>
                Work With Me <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
              <a className="underlined-link" href="#expertise">
                View My Expertise{" "}
                <ArrowDownRight aria-hidden="true" size={15} />
              </a>
            </div>
            {member.socialLinks.length > 0 && (
              <div className="team-profile-socials">
                {member.socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={`${member.name} on ${social.label} (opens in a new tab)`}
                  >
                    {social.label} <ArrowUpRight aria-hidden="true" size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="team-profile-hero-image">
            <TeamPortrait
              name={member.name}
              number={member.number}
              preload
              role={member.role}
              src={member.portrait}
            />
          </div>
        </div>
      </section>

      <section className="section-block team-profile-overview">
        <div className="content-width team-profile-overview-inner">
          <div>
            <p className="eyebrow">
              <span />
              Professional overview
            </p>
            <h2>Clear thinking, focused on the work that matters.</h2>
          </div>
          <div>
            <p>{member.overview}</p>
            <p>
              Work is discussed and scoped around the specific project. No
              rankings, outcomes, or delivery timelines are guaranteed.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section-block team-profile-expertise"
        id="expertise"
        aria-labelledby="team-profile-expertise-title"
      >
        <div className="content-width">
          <div className="section-heading">
            <p className="eyebrow">
              <span />
              Core capabilities
            </p>
            <h2 id="team-profile-expertise-title">Areas of expertise</h2>
            <p>
              A focused view of the skills and responsibilities shared for this
              profile.
            </p>
          </div>
          <ul className="team-profile-skill-list">
            {member.expertise.map((skill, index) => (
              <li key={skill}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{skill}</strong>
                <Check aria-hidden="true" size={16} />
              </li>
            ))}
          </ul>
          {member.technologies.length > 0 && (
            <div className="team-profile-technologies">
              <h3>Verified tools and platforms</h3>
              <ul>
                {member.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section
        className="section-block team-profile-services"
        aria-labelledby="team-profile-services-title"
      >
        <div className="content-width">
          <div className="section-heading">
            <p className="eyebrow">
              <span />
              Ways to work together
            </p>
            <h2 id="team-profile-services-title">Services and support</h2>
            <p>
              Possible areas of support based on this member’s stated
              specialization. The project scope and deliverables are agreed
              before work begins.
            </p>
          </div>
          <div className="team-profile-service-grid">
            {member.services.map((service, index) => (
              <article
                className="team-profile-service-card"
                key={service.title}
              >
                <span className="team-profile-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div>
                  <h4>Problem addressed</h4>
                  <p>{service.problem}</p>
                </div>
                <div>
                  <h4>Possible deliverables</h4>
                  <ul>
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
                <p className="team-profile-service-fit">
                  <strong>May suit:</strong> {service.suitableFor}
                </p>
                <Link className="underlined-link" href={inquiryHref}>
                  Discuss this service{" "}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {member.experience && (
        <section className="section-block team-profile-experience">
          <div className="content-width team-profile-experience-inner">
            <p className="eyebrow">
              <span />
              Professional experience
            </p>
            <div>
              <p className="team-profile-experience-summary">
                {member.experience.summary}
              </p>
              <p>{member.experience.detail}</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-block team-profile-work">
        <div className="content-width team-profile-work-inner">
          <div>
            <p className="eyebrow">
              <span />
              Selected work
            </p>
            <h2>Work should speak for itself.</h2>
          </div>
          {member.projects.length > 0 ? (
            <div className="team-profile-project-grid">
              {member.projects.map((project) => {
                const projectContent = (
                  <>
                    {project.image && (
                      <Image
                        alt={`${project.title} project`}
                        height={480}
                        src={project.image}
                        width={720}
                      />
                    )}
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <p>
                      <strong>Contribution:</strong> {project.contribution}
                    </p>
                    {project.outcome && (
                      <p>
                        <strong>Verified outcome:</strong> {project.outcome}
                      </p>
                    )}
                  </>
                );

                return (
                  <article
                    className="team-profile-project-card"
                    key={project.title}
                  >
                    {project.href ? (
                      <a
                        href={project.href}
                        rel={
                          project.href.startsWith("http")
                            ? "noreferrer"
                            : undefined
                        }
                        target={
                          project.href.startsWith("http") ? "_blank" : undefined
                        }
                      >
                        {projectContent}
                      </a>
                    ) : (
                      projectContent
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <p>
              No verified individual project examples have been supplied for
              this profile. The studio’s demonstration concepts are not
              presented as this member’s client work.
            </p>
          )}
        </div>
      </section>

      <section className="section-block team-profile-process">
        <div className="content-width">
          <div className="section-heading">
            <p className="eyebrow">
              <span />A considered approach
            </p>
            <h2>How the work takes shape</h2>
          </div>
          <ol className="team-profile-process-list">
            {member.process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <ArrowDownRight aria-hidden="true" size={18} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-block team-profile-faq">
        <div className="content-width team-profile-faq-inner">
          <div className="section-heading">
            <p className="eyebrow">
              <span />
              Helpful context
            </p>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="team-profile-faq-list">
            {member.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ArrowDownRight aria-hidden="true" size={16} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="team-profile-contact" id="contact">
        <div className="content-width team-profile-contact-inner">
          <div>
            <p className="eyebrow">
              <span />A useful next step
            </p>
            <h2>Let&apos;s Discuss Your Project</h2>
            <p>
              Share what you are working on and why this expertise may be a fit.
              The studio will review your inquiry and follow up if contact
              delivery is configured.
            </p>
            <Link className="button button-light" href={inquiryHref}>
              Discuss a Project <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            {member.email && (
              <a
                className="team-profile-contact-email"
                href={`mailto:${member.email}`}
              >
                Email {member.name}
              </a>
            )}
            <p className="team-profile-contact-note">
              Inquiries go to the studio&apos;s configured contact inbox, not
              directly to {member.name}.{" "}
              {member.email || member.socialLinks.length > 0
                ? "Use the verified personal contact links shown on this profile where appropriate."
                : "No verified personal email or social profile has been provided."}
            </p>
          </div>
        </div>
      </section>

      <section className="section-block team-profile-related">
        <div className="content-width">
          <div className="section-heading-row">
            <div className="section-heading">
              <p className="eyebrow">
                <span />
                More perspectives
              </p>
              <h2>Meet the Rest of the Team</h2>
            </div>
            <Link className="underlined-link" href="/#team">
              Back to Team Overview <ArrowLeft aria-hidden="true" size={15} />
            </Link>
          </div>
          <div className="team-profile-related-grid">
            {relatedMembers.map((related) => (
              <article className="team-profile-related-card" key={related.slug}>
                <Link
                  aria-label={`View ${related.name}'s profile`}
                  className="team-profile-related-image"
                  href={`/team/${related.slug}`}
                >
                  <TeamPortrait
                    name={related.name}
                    number={related.number}
                    role={related.role}
                    src={related.portrait}
                  />
                </Link>
                <div>
                  <p>{related.role}</p>
                  <h3>{related.name}</h3>
                  <Link
                    className="underlined-link"
                    href={`/team/${related.slug}`}
                  >
                    View Profile <ArrowUpRight aria-hidden="true" size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
