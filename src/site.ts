import { content, profile, type Locale } from "@/content";

// Absolute site URL. Netlify sets $URL at build time (your custom domain if you
// have one). Override with SITE_URL in Netlify env vars if needed.
export const siteUrl = (process.env.SITE_URL ?? process.env.URL ?? "http://localhost:3000").replace(/\/$/, "");

export const pageUrl = (lang: Locale) => `${siteUrl}/${lang}/`;

const allSkills = (lang: Locale) => content[lang].skills.flatMap((s) => s.items);

// schema.org structured data so search engines and AI agents can identify you.
export function personJsonLd(lang: Locale) {
  const t = content[lang];
  const url = pageUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#page`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: lang,
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      jobTitle: t.role,
      description: t.intro.join(" "),
      url,
      image: `${siteUrl}${profile.photo}`,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressCountry: "MX" },
      knowsLanguage: ["es", "en"],
      knowsAbout: allSkills(lang),
      sameAs: profile.links.map((l) => l.href),
      alumniOf: {
        "@type": "EducationalOrganization",
        name: t.education.school,
      },
      hasCredential: t.certifications.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.title,
        credentialCategory: "certification",
        recognizedBy: { "@type": "Organization", name: c.issuer },
        ...(c.href ? { url: c.href } : {}),
      })),
      hasOccupation: {
        "@type": "Occupation",
        name: t.role,
        skills: allSkills(lang).join(", "),
      },
    },
  };
}

// Plain-markdown version of the CV, used by /llms.txt and /llms-full.txt.
export function cvMarkdown(lang: Locale) {
  const t = content[lang];
  const lines: string[] = [];
  lines.push(`## ${t.sections.experience}`, "");
  for (const job of t.experience) {
    lines.push(`### ${job.title} — ${job.company}`);
    lines.push(`${job.period} · ${job.location}`, "");
    lines.push(job.summary, "");
    lines.push(`Stack: ${job.stack.join(", ")}`, "");
  }
  lines.push(`## ${t.sections.skills}`, "");
  for (const s of t.skills) lines.push(`- **${s.group}:** ${s.items.join(", ")}`);
  lines.push("", `## ${t.sections.certifications}`, "");
  for (const c of t.certifications) lines.push(`- ${c.title} — ${c.issuer}, ${c.date}${c.href ? ` (${c.href})` : ""}`);
  lines.push("", `## ${t.sections.education}`, "");
  lines.push(`- ${t.education.degree} — ${t.education.school}, ${t.education.year}`);
  lines.push("", `## ${t.sections.contact}`, "");
  lines.push(`- Email: ${profile.email}`);
  for (const l of profile.links) lines.push(`- ${l.label}: ${l.href}`);
  return lines.join("\n");
}
