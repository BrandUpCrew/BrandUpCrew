import { articles } from "@/content/content";
import { siteConfig } from "@/config/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = articles
    .map((article) => {
      const link = new URL(
        `/insights/${article.slug}`,
        siteConfig.url,
      ).toString();
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(link)}</link><guid>${escapeXml(link)}</guid><description>${escapeXml(article.summary)}</description><pubDate>${new Date(`${article.published}T12:00:00Z`).toUTCString()}</pubDate></item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)}: Insights</title><link>${escapeXml(new URL("/insights", siteConfig.url).toString())}</link><description>${escapeXml(siteConfig.description)}</description><language>${siteConfig.locale}</language>${items}</channel></rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
