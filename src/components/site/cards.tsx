import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { Article, CaseStudy, Service } from "@/content/content";

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Link className="service-card" href={`/services/${service.slug}`}>
      <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
      </div>
      <ArrowUpRight aria-hidden="true" size={19} />
    </Link>
  );
}

export function ProjectCard({ project }: { project: CaseStudy }) {
  return (
    <Link
      className={`project-card project-${project.accent}`}
      href={`/work/${project.slug}`}
    >
      <div className="project-art" aria-hidden="true">
        <div className="project-art-paper">
          <span className="project-art-caption">{project.discipline}</span>
          <span className="project-art-title">{project.name}</span>
          <span className="project-art-rule" />
          <span className="project-art-shape" />
          <span className="project-art-shape project-art-shape-small" />
        </div>
        <span className="project-art-number">
          CONCEPT / 0
          {project.slug.startsWith("north")
            ? "1"
            : project.slug.startsWith("field")
              ? "2"
              : "3"}
        </span>
      </div>
      <div className="project-card-meta">
        <div>
          <span className="card-index">{project.industry} · Demonstration</span>
          <h3>{project.name}</h3>
        </div>
        <ArrowUpRight aria-hidden="true" size={19} />
      </div>
      <p>{project.summary}</p>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link className="article-card" href={`/insights/${article.slug}`}>
      <div className="article-card-top">
        <span>{article.category}</span>
        <ArrowUpRight aria-hidden="true" size={17} />
      </div>
      <p className="article-date">
        {new Date(`${article.published}T12:00:00`).toLocaleDateString("en", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        <span>·</span> {article.readingTime}
      </p>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <span className="article-read">
        Read article <ArrowDownRight aria-hidden="true" size={15} />
      </span>
    </Link>
  );
}
