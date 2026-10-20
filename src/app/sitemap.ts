import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import {
  articles,
  caseStudies,
  services,
  teamDisciplines,
} from "@/content/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/work",
    "/process",
    "/industries",
    "/insights",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];
  return [
    ...routes.map((route) => ({
      url: new URL(route, siteConfig.url).toString(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...services.map(({ slug }) => ({
      url: new URL(`/services/${slug}`, siteConfig.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...caseStudies.map(({ slug }) => ({
      url: new URL(`/work/${slug}`, siteConfig.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...teamDisciplines.map(({ slug }) => ({
      url: new URL(`/team/${slug}`, siteConfig.url).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map(({ slug, published }) => ({
      url: new URL(`/insights/${slug}`, siteConfig.url).toString(),
      lastModified: new Date(`${published}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
