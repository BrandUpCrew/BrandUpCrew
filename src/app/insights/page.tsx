import type { Metadata } from "next";

import { ArticleCard } from "@/components/site/cards";
import { CtaSection } from "@/components/site/cta-section";
import { PageIntro, SectionHeading } from "@/components/site/page-intro";
import { ScrollStorySection } from "@/components/site/motion";
import { StaggerGroup, StaggerItem } from "@/components/site/animated";
import { articles } from "@/content/content";

export const metadata: Metadata = {
  title: "Digital Strategy & Technology Insights",
  description:
    "Practical perspectives on digital strategy, design, search, and technology from the studio.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const categories = [...new Set(articles.map(({ category }) => category))];
  return (
    <main id="main">
      <PageIntro
        eyebrow="Insights"
        title="A little thinking, made useful."
        description="Notes on the choices behind good digital work. We share them to help you ask better questions and make more confident decisions."
      />
      <ScrollStorySection>
        <section className="section-block">
          <div className="content-width">
            <div className="insights-categories">
              <span>Filed under</span>
              {categories.map((category) => (
                <span className="category-chip" key={category}>
                  {category}
                </span>
              ))}
              <a className="category-chip" href="/feed.xml">
                RSS feed
              </a>
            </div>
            <SectionHeading
              eyebrow="Studio notes"
              title="Ideas for what comes next."
            />
            <StaggerGroup className="article-grid" stagger={0.06}>
              {articles.map((article) => (
                <StaggerItem key={article.slug}>
                  <ArticleCard article={article} />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <p className="editorial-note">
              Articles are published under the studio name; no individual author
              credentials are implied.
            </p>
          </div>
        </section>
      </ScrollStorySection>
      <CtaSection
        title="Want to think something through?"
        description="A useful conversation can be a good place to start."
      />
    </main>
  );
}
