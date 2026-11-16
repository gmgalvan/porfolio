"use client";

import { useState } from "react";
import { content, techFilters, type Locale } from "@/content";

export default function ExperienceList({ locale }: { locale: Locale }) {
  const t = content[locale];
  const [active, setActive] = useState<string | null>(null);

  const filter = techFilters.find((f) => f.label === active);
  const matches = (tech: string) => !!filter && filter.match.includes(tech);
  const jobs = filter
    ? t.experience.filter((job) => job.stack.some(matches))
    : t.experience;

  const countFor = (label: string) => {
    const f = techFilters.find((x) => x.label === label)!;
    return t.experience.filter((job) => job.stack.some((s) => f.match.includes(s))).length;
  };

  return (
    <>
      <div className="filters" role="group" aria-label={t.ui.filterBy}>
        <button
          type="button"
          className="chip"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          {t.ui.all}
        </button>
        {techFilters.map((f) => (
          <button
            key={f.label}
            type="button"
            className="chip"
            aria-pressed={active === f.label}
            onClick={() => setActive(active === f.label ? null : f.label)}
          >
            {f.label}
            <span className="chip-count">{countFor(f.label)}</span>
          </button>
        ))}
      </div>

      <p className="filter-status" aria-live="polite">
        {t.ui.showing(jobs.length, t.experience.length)}
      </p>

      <ol className="rows">
        {jobs.map((job) => (
          <li key={job.company} className="row job">
            <span className="row-meta">{job.period}</span>
            <div>
              <h3>
                {job.title} <span className="muted">· {job.company}</span>
              </h3>
              <p className="row-sub">{job.location}</p>
              <p>{job.summary}</p>
              <p className="stack">
                {job.stack.map((tech, i) => (
                  <span key={tech}>
                    {i > 0 && " · "}
                    {matches(tech) ? <mark>{tech}</mark> : tech}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
