"use client";

import { useEffect, useId, useRef, useState } from "react";
import Collapsible from "./Collapsible";

// Already localized by the page (dates, durations, party labels), so this
// client component only handles filtering.
export type ExperienceProject = {
  id: string;
  role: string;
  headline: string;
  customer: string | null;
  period: string;
  duration: string;
  teamSize: string | null;
  description: string;
  responsibilities: string[];
  results: string[];
  stack: { id: string; name: string; matchIds: string[]; terms: string[] }[];
  matchIds: string[];
};

export type ExperienceEmployer = {
  key: string;
  name: string;
  period: string;
  duration: string;
  projects: ExperienceProject[];
};

export type ExperienceLabels = {
  filterBy: string;
  all: string;
  showing: string; // "{n} of {total} projects"
  searchPlaceholder: string;
  noResults: string; // "No projects use “{q}”."
  toggle: string;
  fields: {
    description: string;
    customer: string;
    role: string;
    duration: string;
    teamSize: string;
    responsibilities: string;
    results: string;
    tools: string;
  };
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export type FilterGroupView = { label: string; chips: { id: string; label: string; count: number }[] };

// Renders the whole Experience section so the filter toggle (magnifier) can sit
// next to the section heading. The filter panel starts closed.
export default function ExperienceList({
  sectionId,
  title,
  employers,
  filters,
  labels,
}: {
  sectionId: string;
  title: string;
  employers: ExperienceEmployer[];
  filters: FilterGroupView[];
  labels: ExperienceLabels;
}) {
  // One filter at a time: a chip (skill ID) or a search query.
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (filtersOpen) searchRef.current?.focus();
  }, [filtersOpen]);
  const f = labels.fields;
  const q = query.trim().toLowerCase();

  type Tool = ExperienceProject["stack"][number];
  const toolMatches = (t: Tool) =>
    (active !== null && t.matchIds.includes(active)) || (q !== "" && t.terms.some((term) => term.includes(q)));
  const projectMatches = (p: ExperienceProject) => (active === null && q === "") || p.stack.some(toolMatches);

  const allProjects = employers.flatMap((e) => e.projects);
  const shown = employers
    .map((e) => ({ ...e, projects: e.projects.filter(projectMatches) }))
    .filter((e) => e.projects.length > 0);
  const shownCount = shown.reduce((n, e) => n + e.projects.length, 0);

  const pickChip = (id: string | null) => {
    setActive(active === id ? null : id);
    setQuery("");
  };

  const toggleFilters = () => {
    if (filtersOpen) pickChip(null); // closing the panel also clears the filter
    setFiltersOpen(!filtersOpen);
  };

  const filterToggle = (
    <button
      type="button"
      className="icon-button"
      aria-expanded={filtersOpen}
      aria-controls={panelId}
      title={labels.filterBy}
      aria-label={labels.filterBy}
      onClick={toggleFilters}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    </button>
  );

  return (
    <Collapsible
      as="section"
      className="cv-section is-wide"
      headingTag="h2"
      headingId={sectionId}
      heading={title}
      aside={filterToggle}
      bodyClassName="cv-body"
      toggleLabel={labels.toggle}
    >
      {filtersOpen && (
      <div className="filter-bar" id={panelId}>
        <div className="search">
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(null);
            }}
          />
        </div>

        {filters.length > 0 && (
          <div className="chip-groups" role="group" aria-label={labels.filterBy}>
            {filters.map((g) => (
              <div key={g.label} className="chip-group">
                <span className="chip-group-label">{g.label}</span>
                <div className="filters">
                  {g.chips.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="chip"
                      aria-pressed={active === c.id}
                      onClick={() => pickChip(c.id)}
                    >
                      {c.label}
                      <span className="chip-count">{c.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="filter-status" aria-live="polite">
          {shownCount === 0 && q !== ""
            ? labels.noResults.replace("{q}", query.trim())
            : labels.showing.replace("{n}", String(shownCount)).replace("{total}", String(allProjects.length))}
          {(active !== null || q !== "") && (
            <>
              {" · "}
              <button type="button" className="link-button" onClick={() => pickChip(null)}>
                {labels.all}
              </button>
            </>
          )}
        </p>
      </div>
      )}

      <ol className="employers">
        {shown.map((e) => (
          <Collapsible
            key={e.key}
            as="li"
            className="employer"
            headingTag="h3"
            heading={e.name}
            aside={
              <p className="employer-period">
                {e.period} · {e.duration}
              </p>
            }
            bodyClassName="projects"
            toggleLabel={labels.toggle}
          >
              {e.projects.map((p) => (
                <Collapsible
                  key={p.id}
                  className="project"
                  headingTag="h4"
                  headingClassName="project-title"
                  heading={p.headline}
                  bodyClassName="facts"
                  toggleLabel={labels.toggle}
                >
                  <dl>
                    {p.description && <Fact label={f.description}>{p.description}</Fact>}
                    {p.customer && <Fact label={f.customer}>{p.customer}</Fact>}
                    <Fact label={f.role}>{p.role}</Fact>
                    <Fact label={f.duration}>
                      {p.period} <span className="muted">· {p.duration}</span>
                    </Fact>
                    {p.teamSize && <Fact label={f.teamSize}>{p.teamSize}</Fact>}
                    {p.responsibilities.length > 0 && (
                      <Fact label={f.responsibilities}>
                        <ul className="bullets">
                          {p.responsibilities.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </Fact>
                    )}
                    {p.results.length > 0 && (
                      <Fact label={f.results}>
                        <ul className="bullets">
                          {p.results.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </Fact>
                    )}
                    {p.stack.length > 0 && (
                      <Fact label={f.tools}>
                        <ul className="tags">
                          {p.stack.map((t) => (
                            <li key={t.id} className={toolMatches(t) ? "is-match" : undefined}>
                              {t.name}
                            </li>
                          ))}
                        </ul>
                      </Fact>
                    )}
                  </dl>
                </Collapsible>
              ))}
          </Collapsible>
        ))}
      </ol>
    </Collapsible>
  );
}
