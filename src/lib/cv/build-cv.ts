// API data -> view model. All display rules live here (docs/cv-ui.md#display-rules).
// Pure and locale-free: components format dates and translate labels.

import type { Certification, CvData, Language, Party, Project, Skill, YearMonth } from "@/lib/api/types";
import type { CvConfig } from "./config";

/** A party as shown publicly: its name, its alias, or anonymous. Never the real name of a confidential party. */
export type PartyDisplay = { kind: "named"; text: string } | { kind: "anonymous" };

/**
 * A tool. `matchIds` = its own ID plus its parent's (filter chips).
 * `terms` = lowercase name and aliases of the tool and of its parent (search box),
 * so "aws" finds Lambda and "golang" finds Go.
 */
export type StackItem = { id: string; name: string; matchIds: string[]; terms: string[] };

export type ProjectView = {
  id: string;
  role: string;
  headline: string;
  customer: PartyDisplay | null;
  startDate: YearMonth;
  endDate: YearMonth | null;
  teamSize: string | null;
  description: string;
  responsibilities: string[];
  results: string[];
  stack: StackItem[];
  /** Skill IDs a filter chip can match: tools plus their parents. */
  matchIds: string[];
};

export type EmployerView = {
  key: string;
  employer: PartyDisplay | null;
  startDate: YearMonth;
  endDate: YearMonth | null;
  projects: ProjectView[];
};

/** `items` are display strings; a parent with children reads "AWS (Lambda, S3)". */
export type SkillGroup = { category: string | null; items: string[] };

/** `count` = number of projects the chip matches. */
export type FilterChip = { id: string; label: string; count: number };

/** Filter chips of one lifecycle phase (`null` = skills without a phase). */
export type FilterGroup = { phase: string | null; chips: FilterChip[] };

export type CertificationView = {
  id: string;
  name: string;
  issuer: string;
  url: string | null;
  issuedDate: YearMonth | null;
  expiresDate: YearMonth | null;
  expired: boolean;
};

export type LanguageView = { name: string; level: Language["level"] };

export type CvView = {
  name: string;
  title: string;
  location: string | null;
  email: string | null;
  links: { label: string; href: string }[];
  intro: string[];
  employers: EmployerView[];
  filters: FilterGroup[];
  skillGroups: SkillGroup[];
  education: { degree: string; institution: string; year: number | null }[];
  certifications: CertificationView[];
  languages: LanguageView[];
  warnings: string[];
};

/** Courses hidden unless configured; expired ones per config. Keeps the API order (newest first). */
function buildCertifications(certifications: Certification[], config: CvConfig): CertificationView[] {
  return certifications
    .filter((c) => c.kind === "certification" || config.showCourses)
    .filter((c) => c.status !== "expired" || config.expiredCertifications === "show")
    .map((c) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      url: c.credentialUrl?.trim() || null,
      issuedDate: c.issuedDate ?? null,
      expiresDate: c.expiresDate ?? null,
      expired: c.status === "expired",
    }));
}

const levelRank: Record<Language["level"], number> = { native: 7, C2: 6, C1: 5, B2: 4, B1: 3, A2: 2, A1: 1 };

/** Native first, then highest level, then by name. */
function buildLanguages(languages: Language[]): LanguageView[] {
  return [...languages]
    .sort((a, b) => levelRank[b.level] - levelRank[a.level] || a.name.localeCompare(b.name))
    .map((l) => ({ name: l.name, level: l.level }));
}

export function partyDisplay(party: Party, warn: (msg: string) => void): PartyDisplay {
  if (!party.confidential) return { kind: "named", text: party.name };
  const alias = party.alias?.trim();
  if (alias) return { kind: "named", text: alias };
  warn("A confidential party has no alias; it is shown as anonymous.");
  return { kind: "anonymous" };
}

/** Latest end date, where `null` (ongoing) is the latest of all. */
function laterEnd(a: YearMonth | null, b: YearMonth | null): YearMonth | null {
  if (a === null || b === null) return null;
  return a > b ? a : b;
}

function compareByRecency(a: { startDate: string; endDate: string | null }, b: typeof a): number {
  if ((a.endDate === null) !== (b.endDate === null)) return a.endDate === null ? -1 : 1;
  if (a.endDate !== b.endDate) return (b.endDate ?? "").localeCompare(a.endDate ?? "");
  return b.startDate.localeCompare(a.startDate);
}

function buildEmployers(projects: Project[], skills: Map<string, Skill>, warn: (m: string) => void) {
  const groups = new Map<string, EmployerView>();

  for (const p of projects) {
    const key = p.employer?.name ?? "";
    const stack = p.tools.map((id): StackItem => {
      const skill = skills.get(id);
      const parent = skill?.parent ? skills.get(skill.parent) : undefined;
      const names = (s: Skill | undefined) => (s ? [s.name, ...s.aliases] : []);
      return {
        id,
        name: skill?.name ?? id,
        matchIds: skill?.parent ? [id, skill.parent] : [id],
        terms: [...new Set([...names(skill), ...names(parent), id].map((t) => t.toLowerCase()))],
      };
    });
    const view: ProjectView = {
      id: p.id,
      role: p.role,
      headline: p.headline,
      customer: p.customer ? partyDisplay(p.customer, warn) : null,
      startDate: p.startDate,
      endDate: p.endDate ?? null,
      teamSize: p.teamSize ?? null,
      description: p.projectDescription,
      responsibilities: p.responsibilities,
      results: p.results,
      stack,
      matchIds: [...new Set(stack.flatMap((t) => t.matchIds))],
    };

    const group = groups.get(key);
    if (group) {
      group.projects.push(view);
      if (view.startDate < group.startDate) group.startDate = view.startDate;
      group.endDate = laterEnd(group.endDate, view.endDate);
    } else {
      groups.set(key, {
        key,
        employer: p.employer ? partyDisplay(p.employer, warn) : null,
        startDate: view.startDate,
        endDate: view.endDate,
        projects: [view],
      });
    }
  }

  const employers = [...groups.values()].sort(compareByRecency);
  for (const e of employers) e.projects.sort((a, b) => b.startDate.localeCompare(a.startDate));
  return employers;
}

/** Sort key for a category: configured order first, then unknown ones alphabetically, `null` last. */
function categoryRank(category: string | null, config: CvConfig): [number, string] {
  if (category === null) return [2, ""];
  const i = config.categoryOrder.indexOf(category);
  return i >= 0 ? [0, String(i).padStart(4, "0")] : [1, category];
}

function compareCategories(a: string | null, b: string | null, config: CvConfig): number {
  const [ra, ka] = categoryRank(a, config);
  const [rb, kb] = categoryRank(b, config);
  return ra - rb || ka.localeCompare(kb);
}

/**
 * Filter chips grouped by lifecycle phase: only top-level technologies (a parent chip
 * already covers its children, e.g. AWS covers Lambda), the most used first,
 * at most `config.chipsPerPhase` per phase.
 */
function buildFilters(employers: EmployerView[], skills: Map<string, Skill>, config: CvConfig): FilterGroup[] {
  const isTopLevel = (s: Skill) => s.kind === "technology" && !(s.parent && skills.has(s.parent));
  const counts = new Map<string, number>();
  for (const p of employers.flatMap((e) => e.projects)) {
    for (const id of p.matchIds) {
      const skill = skills.get(id);
      if (skill && isTopLevel(skill)) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const groups = new Map<string | null, FilterChip[]>();
  for (const [id, count] of counts) {
    const skill = skills.get(id)!;
    const phase = skill.categories[0] ?? null;
    groups.set(phase, [...(groups.get(phase) ?? []), { id, label: skill.name, count }]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareCategories(a, b, config))
    .map(([phase, chips]) => ({
      phase,
      chips: chips
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
        .slice(0, config.chipsPerPhase),
    }));
}

function buildSkillGroups(skills: Skill[], config: CvConfig): SkillGroup[] {
  const technologies = skills.filter((s) => s.kind === "technology");
  const byId = new Map(technologies.map((s) => [s.id, s]));
  const phase = (s: Skill) => s.categories[0] ?? null;
  // A child is shown inside its parent ("AWS (Lambda)") only when both are in the same
  // phase; otherwise it stands alone in its own phase (Athena under Data, not under Run).
  const nestedParent = (s: Skill) => {
    const parent = s.parent ? byId.get(s.parent) : undefined;
    return parent && phase(parent) === phase(s) ? parent.id : null;
  };
  const children = new Map<string, Skill[]>();
  for (const s of technologies) {
    const p = nestedParent(s);
    if (p) children.set(p, [...(children.get(p) ?? []), s]);
  }

  const byExperience = (a: Skill, b: Skill) =>
    (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0) || a.name.localeCompare(b.name);

  const groups = new Map<string | null, Skill[]>();
  for (const s of technologies) {
    if (nestedParent(s)) continue; // shown inside its parent
    const category = phase(s);
    groups.set(category, [...(groups.get(category) ?? []), s]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareCategories(a, b, config))
    .map(([category, list]) => ({
      category,
      items: list.sort(byExperience).map((s) => {
        const kids = (children.get(s.id) ?? []).sort(byExperience).map((k) => k.name);
        return kids.length ? `${s.name} (${kids.join(", ")})` : s.name;
      }),
    }));
}

export function buildCv(data: CvData, config: CvConfig): CvView {
  const warnings: string[] = [];
  const warn = (msg: string) => {
    if (!warnings.includes(msg)) warnings.push(msg);
  };

  const profile = data.profile.profile;
  if (!profile) throw new Error("The API has no profile yet (PUT /profile).");

  const contact = profile.contact ?? {};
  const links = [
    { label: "LinkedIn", href: contact.links?.linkedin },
    { label: "GitHub", href: contact.links?.github },
    { label: "Website", href: contact.links?.website },
  ].filter((l): l is { label: string; href: string } => !!l.href);

  const summary =
    data.profile.summaries.find((s) => s.focus === config.summaryFocus) ?? data.profile.summaries[0];

  const skills = new Map(data.skills.map((s) => [s.id, s]));
  const employers = buildEmployers(data.projects, skills, warn);

  return {
    name: profile.name,
    title: profile.title,
    location: contact.location ?? null,
    email: contact.email ?? null,
    links,
    intro: summary ? summary.text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [],
    employers,
    filters: buildFilters(employers, skills, config),
    skillGroups: buildSkillGroups(data.skills, config),
    education: [...data.profile.education]
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .map((e) => ({ degree: e.degree, institution: e.institution, year: e.year ?? null })),
    certifications: buildCertifications(data.profile.certifications ?? [], config),
    languages: buildLanguages(data.profile.languages ?? []),
    warnings,
  };
}
