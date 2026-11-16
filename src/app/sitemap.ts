import type { MetadataRoute } from "next";
import { locales } from "@/content";
import { pageUrl, siteUrl } from "@/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: pageUrl("en"), es: pageUrl("es"), "x-default": pageUrl("en") };
  const lastModified = new Date();

  return [
    ...locales.map((lang) => ({
      url: pageUrl(lang),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: lang === "en" ? 1 : 0.9,
      alternates: { languages },
    })),
    { url: `${siteUrl}/llms.txt`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
  ];
}
