import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { ArticleCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { MaskedHeading, ScrollStorySection } from "@/components/site/motion";
import { articles } from "@/content/content";
import { siteConfig } from "@/config/site";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      publishedTime: article.published,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles
    .filter(
      (item) =>
        item.slug !== article.slug && item.category === article.category,
    )
    .slice(0, 2);
  const date = new Date(`${article.published}T12:00:00`).toLocaleDateString(
    "en",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.published,
    articleSection: article.category,
    mainEntityOfPage: new URL(
      `/insights/${article.slug}`,
      siteConfig.url,
    ).toString(),
  }).replaceAll("<", "\\u003c");
  return (
    <main id="main">
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <header className="article-hero content-width">
          <Link className="underlined-link" href="/insights">
            <ArrowLeft aria-hidden="true" size={15} />
            All insights
          </Link>
          <p className="eyebrow">
            <span />
            {article.category}
          </p>
          <MaskedHeading lines={[article.title]} tag="h1" trigger="mount" />
          <p className="article-deck">{article.summary}</p>
          <p className="article-byline">
            Studio Notes <span>·</span> {date} <span>·</span>{" "}
            {article.readingTime}
          </p>
        </header>
        <div className="article-body">
          {article.sections.map((section, index) => (
            <section key={section.heading}>
              <span className="article-section-number">0{index + 1}</span>
              <div>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="article-disclaimer">
            Shared as general information by the studio. Recommendations for a
            specific organization should be based on its context, evidence, and
            requirements.
          </p>
          <Link className="underlined-link" href="/contact">
            Talk to us about your challenge{" "}
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </article>
      {related.length > 0 && (
        <ScrollStorySection>
          <section className="section-block related-articles">
            <div className="content-width">
              <h2>Keep exploring</h2>
              <div className="article-grid">
                {related.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))}
              </div>
            </div>
          </section>
        </ScrollStorySection>
      )}
      <CtaSection />
    </main>
  );
}
