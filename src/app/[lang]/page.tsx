import Image from "next/image";
import Link from "next/link";
import ExperienceList from "@/components/ExperienceList";
import PrintButton from "@/components/PrintButton";
import Section from "@/components/Section";
import { isLocale, locales, ui, type Locale } from "@/i18n/ui";
import { cvConfig } from "@/lib/cv/config";
import { formatCertificationDates } from "@/lib/cv/format";
import { getCv, localizeExperience, personJsonLd } from "@/site";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = ui[locale];
  const cv = await getCv();

  return (
    <div className="desk">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(cv, locale)).replace(/</g, "\\u003c"),
        }}
      />
      <header className="topbar">
        <div className="topbar-inner">
          <Link href={`/${locale}/`} className="brand" aria-label={cv.name}>
            <span className="monogram" aria-hidden="true">
              {initials(cv.name)}
            </span>
            <span className="brand-name">{cv.name}</span>
          </Link>

          <div className="topbar-actions">
            <PrintButton label={t.print} />
            <nav className="lang-toggle" aria-label="Language">
              {locales.map((l) => (
                <Link key={l} href={`/${l}/`} hrefLang={l} lang={l} aria-current={l === locale ? "page" : undefined}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <article className="sheet">
        <header className="sheet-head">
          <div className="identity">
            <Image src={cvConfig.photo} alt={cv.name} width={72} height={72} className="avatar" priority />
            <div>
              <h1>{cv.name}</h1>
              {/* A LinkedIn-style headline "A | B | C" is shown as separate parts that wrap whole. */}
              <p className="role">
                <span className="role-inner">
                  {cv.title
                    .split("|")
                    .map((part) => part.trim())
                    .filter(Boolean)
                    .map((part) => (
                      <span key={part} className="role-part">
                        {part}
                      </span>
                    ))}
                </span>
              </p>
            </div>
          </div>

          <ul className="contact-list">
            {cv.location && <li>{cv.location}</li>}
            {cv.email && (
              <li>
                <a href={`mailto:${cv.email}`}>{cv.email}</a>
              </li>
            )}
            {cv.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <span className="screen-only">{l.label}</span>
                  {/* On paper a label is useless: print the short URL instead. */}
                  <span className="print-only">{l.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
                </a>
              </li>
            ))}
          </ul>
        </header>

        <main>
          {cv.intro.length > 0 && (
            <Section id="summary" title={t.sections.summary} toggleLabel={t.toggle}>
              <div className="prose">
                {cv.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Section>
          )}

          {cv.employers.length > 0 && (
              <ExperienceList
                sectionId="experience"
                title={t.sections.experience}
                employers={localizeExperience(cv, locale)}
                filters={cv.filters.map((g) => ({
                  label: g.phase ? (t.phases[g.phase] ?? g.phase) : t.other,
                  chips: g.chips,
                }))}
                labels={{
                  filterBy: t.filterBy,
                  all: t.all,
                  showing: t.showing,
                  searchPlaceholder: t.searchPlaceholder,
                  noResults: t.noResults,
                  toggle: t.toggle,
                  fields: t.fields,
                }}
              />
          )}

          {cv.skillGroups.length > 0 && (
            <Section id="skills" title={t.sections.skills} toggleLabel={t.toggle} wide>
              <ol className="phases">
                {cv.skillGroups.map((g, i) => (
                  <li key={g.category ?? ""} className="phase">
                    <span className="phase-name">
                      <span className="phase-num">{String(i + 1).padStart(2, "0")}</span>
                      {g.category ? (t.phases[g.category] ?? g.category) : t.other}
                    </span>
                    <span className="phase-items">{g.items.join(" · ")}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {cv.certifications.length > 0 && (
            <Section id="certifications" title={t.sections.certifications} toggleLabel={t.toggle}>
              <ul className="certs">
                {cv.certifications.map((c) => {
                  const dates = formatCertificationDates(c.issuedDate, c.expiresDate, locale);
                  return (
                    <li key={c.id} className={c.expired ? "cert is-expired" : "cert"}>
                      <h3>
                        {c.url ? (
                          <a href={c.url} target="_blank" rel="noopener noreferrer" title={t.verify}>
                            {c.name}
                            <span className="ext" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        ) : (
                          c.name
                        )}
                      </h3>
                      <p className="cert-meta">
                        <span className="cert-issuer">{c.issuer}</span>
                        {dates && <span className="cert-dates">{dates}</span>}
                        {c.expired && <span className="cert-expired">{t.expired}</span>}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {cv.education.length > 0 && (
            <Section id="education" title={t.sections.education} toggleLabel={t.toggle}>
              <ul className="edu">
                {cv.education.map((e) => (
                  <li key={`${e.degree}-${e.institution}`}>
                    <h3>{e.degree}</h3>
                    <p className="muted">{[e.institution, e.year].filter(Boolean).join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {cv.languages.length > 0 && (
            <Section id="languages" title={t.sections.languages} toggleLabel={t.toggle}>
              <ul className="langs">
                {cv.languages.map((l) => (
                  <li key={l.name} className="lang">
                    <span className="lang-name">{l.name}</span>
                    <span className="lang-level">{t.levels[l.level]}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {cv.email && (
            <Section id="contact" title={t.sections.contact} toggleLabel={t.toggle}>
              <p>{t.contactText}</p>
              <p>
                <a href={`mailto:${cv.email}`} className="email">
                  {cv.email}
                </a>
              </p>
            </Section>
          )}
        </main>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {cv.name}
          </span>
          <span>{t.rights}</span>
        </footer>
      </article>
    </div>
  );
}
