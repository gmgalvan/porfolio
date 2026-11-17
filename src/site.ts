import type { ExperienceEmployer } from "@/components/ExperienceList";
import { ui, type Locale } from "@/i18n/ui";
import { loadCvData } from "@/lib/api/client";
import { buildCv, type CvView, type PartyDisplay } from "@/lib/cv/build-cv";
import { cvConfig } from "@/lib/cv/config";
import { formatCertificationDates, formatDuration, formatPeriod } from "@/lib/cv/format";

// Absolute site URL. Netlify sets $URL at build time. Override with SITE_URL.
export const siteUrl = (process.env.SITE_URL ?? process.env.URL ?? "http://localhost:3000").replace(/\/$/, "");

export const pageUrl = (lang: Locale) => `${siteUrl}/${lang}/`;

let cvPromise: Promise<CvView> | undefined;

const buildFromApi = () =>
  loadCvData().then((data) => {
    const cv = buildCv(data, cvConfig);
    for (const w of cv.warnings) console.warn(`[cv] ${w}`);
    return cv;
  });

/** The CV view model: built once per build process; rebuilt on every request in `next dev`. */
export function getCv(): Promise<CvView> {
  if (process.env.NODE_ENV === "development") return buildFromApi();
  cvPromise ??= buildFromApi();
  return cvPromise;
}

export function partyText(party: PartyDisplay, locale: Locale, as: "company" | "client"): string {
  if (party.kind === "named") return party.text;
  return as === "company" ? ui[locale].confidentialCompany : ui[locale].confidentialClient;
}

export function localizeExperience(cv: CvView, locale: Locale): ExperienceEmployer[] {
  return cv.employers.map((e) => ({
    key: e.key,
    name: e.employer ? partyText(e.employer, locale, "company") : ui[locale].noEmployer,
    period: formatPeriod(e.startDate, e.endDate, locale),
    duration: formatDuration(e.startDate, e.endDate, locale),
    projects: e.projects.map((p) => ({
      id: p.id,
      role: p.role,
      headline: p.headline,
      customer: p.customer ? partyText(p.customer, locale, "client") : null,
      period: formatPeriod(p.startDate, p.endDate, locale),
      duration: formatDuration(p.startDate, p.endDate, locale),
      teamSize: p.teamSize,
      description: p.description,
      responsibilities: p.responsibilities,
      results: p.results,
      stack: p.stack,
      matchIds: p.matchIds,
    })),
  }));
}

export const metaDescription = (cv: CvView) => cv.intro[0] ?? `${cv.name} — ${cv.title}`;

const allSkills = (cv: CvView) => cv.skillGroups.flatMap((g) => g.items);

// schema.org structured data so search engines and AI agents can identify you.
export function personJsonLd(cv: CvView, lang: Locale) {
  const url = pageUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#page`,
    url,
    name: `${cv.name} — ${cv.title}`,
    description: metaDescription(cv),
    inLanguage: lang,
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: cv.name,
      jobTitle: cv.title,
      description: cv.intro.join(" "),
      url,
      image: `${siteUrl}${cvConfig.photo}`,
      ...(cv.email ? { email: `mailto:${cv.email}` } : {}),
      knowsAbout: allSkills(cv),
      sameAs: cv.links.map((l) => l.href),
      ...(cv.education[0]
        ? { alumniOf: { "@type": "EducationalOrganization", name: cv.education[0].institution } }
        : {}),
      hasOccupation: { "@type": "Occupation", name: cv.title, skills: allSkills(cv).join(", ") },
      ...(cv.languages.length ? { knowsLanguage: cv.languages.map((l) => l.name) } : {}),
      hasCredential: cv.certifications
        .filter((c) => !c.expired)
        .map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.name,
          credentialCategory: "certification",
          recognizedBy: { "@type": "Organization", name: c.issuer },
          ...(c.url ? { url: c.url } : {}),
        })),
    },
  };
}

// Plain-markdown version of the CV, used by /llms.txt and /llms-full.txt.
export function cvMarkdown(cv: CvView, lang: Locale) {
  const t = ui[lang];
  const lines: string[] = [];
  lines.push(`## ${t.sections.experience}`, "");
  for (const e of localizeExperience(cv, lang)) {
    lines.push(`### ${e.name}`, `${e.period} · ${e.duration}`, "");
    for (const p of e.projects) {
      const f = t.fields;
      lines.push(`#### ${p.headline}`, "");
      if (p.description) lines.push(`- **${f.description}:** ${p.description}`);
      if (p.customer) lines.push(`- **${f.customer}:** ${p.customer}`);
      lines.push(`- **${f.role}:** ${p.role}`, `- **${f.duration}:** ${p.period} (${p.duration})`);
      if (p.teamSize) lines.push(`- **${f.teamSize}:** ${p.teamSize}`);
      if (p.responsibilities.length) lines.push(`- **${f.responsibilities}:**`, ...p.responsibilities.map((b) => `  - ${b}`));
      if (p.results.length) lines.push(`- **${f.results}:**`, ...p.results.map((b) => `  - ${b}`));
      if (p.stack.length) lines.push(`- **${f.tools}:** ${p.stack.map((s) => s.name).join(", ")}`);
      lines.push("");
    }
  }
  if (cv.skillGroups.length) {
    lines.push(`## ${t.sections.skills}`, "");
    for (const g of cv.skillGroups) lines.push(`- **${g.category ?? t.other}:** ${g.items.join(", ")}`);
    lines.push("");
  }
  if (cv.certifications.length) {
    lines.push(`## ${t.sections.certifications}`, "");
    for (const c of cv.certifications) {
      const dates = formatCertificationDates(c.issuedDate, c.expiresDate, lang);
      const meta = [c.issuer, dates, c.expired ? t.expired : ""].filter(Boolean).join(", ");
      lines.push(`- ${c.name} — ${meta}${c.url ? ` (${c.url})` : ""}`);
    }
    lines.push("");
  }
  if (cv.education.length) {
    lines.push(`## ${t.sections.education}`, "");
    for (const e of cv.education) lines.push(`- ${e.degree} — ${e.institution}${e.year ? `, ${e.year}` : ""}`);
    lines.push("");
  }
  if (cv.languages.length) {
    lines.push(`## ${t.sections.languages}`, "");
    for (const l of cv.languages) lines.push(`- ${l.name}: ${t.levels[l.level]}`);
    lines.push("");
  }
  lines.push(`## ${t.sections.contact}`, "");
  if (cv.email) lines.push(`- Email: ${cv.email}`);
  for (const l of cv.links) lines.push(`- ${l.label}: ${l.href}`);
  return lines.join("\n");
}
