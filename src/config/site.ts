import { env } from "@/lib/env";

export const siteConfig = {
  name: "BrandUpCrew",
  descriptor: "Digital growth & technology",
  description:
    "Independent strategy, design, and technology for businesses ready to move forward.",
  logo: "/Logo.png",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en",
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
  ],
};
