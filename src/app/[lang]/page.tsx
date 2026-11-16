import Image from "next/image";
import Link from "next/link";
import { content, isLocale, locales, profile, type Locale } from "@/content";
import Section from "@/components/Section";
import ExperienceList from "@/components/ExperienceList";
import PrintButton from "@/components/PrintButton";
import { personJsonLd } from "@/site";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = content[locale];

  return (
    <div className="desk">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(locale)).replace(/</g, "\\u003c"),
        }}
      />
      <header className="topbar">
        <div className="topbar-inner">
          <Link href={`/${locale}/`} className="brand" aria-label={profile.name}>
            <span className="monogram" aria-hidden="true">GG</span>
            <span className="brand-name">{profile.name}</span>
          </Link>

          <div className="topbar-actions">
            <PrintButton label={t.ui.print} />
            <nav className="lang-toggle" aria-label="Language">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}/`}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === locale ? "page" : undefined}
                >
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
            <Image
              src={profile.photo}
              alt={profile.name}
              width={72}
              height={72}
              className="avatar"
              priority
            />
            <div>
              <h1>{profile.name}</h1>
              <p className="role">{t.role}</p>
            </div>
          </div>

          <ul className="contact-list">
            <li>{t.location}</li>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            {profile.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <div className="prose">
          {t.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <main>
          <Section id="experience" title={t.sections.experience} toggleLabel={t.ui.toggle}>
            <ExperienceList locale={locale} />
          </Section>

          <Section id="skills" title={t.sections.skills} toggleLabel={t.ui.toggle}>
            <dl className="rows">
              {t.skills.map((s) => (
                <div key={s.group} className="row">
                  <dt className="row-meta">{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <div className="split">
            <Section id="certifications" title={t.sections.certifications} toggleLabel={t.ui.toggle}>
              <ul className="rows">
                {t.certifications.map((c) => (
                  <li key={c.title}>
                    <h3>
                      {c.href ? (
                        <a href={c.href} target="_blank" rel="noopener noreferrer">
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}
                    </h3>
                    <p className="row-sub">
                      {c.issuer} · {c.date}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="education" title={t.sections.education} toggleLabel={t.ui.toggle}>
              <h3>{t.education.degree}</h3>
              <p className="row-sub">
                {t.education.school} · {t.education.year}
              </p>
            </Section>
          </div>

          <section aria-labelledby="contact">
            <h2 id="contact">{t.sections.contact}</h2>
            <p>{t.contactText}</p>
            <p>
              <a href={`mailto:${profile.email}`} className="email">
                {profile.email}
              </a>
            </p>
          </section>
        </main>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>{t.rights}</span>
        </footer>
      </article>
    </div>
  );
}
