// Mirror of the career-vault API models (backend/career-vault/src/career_vault/domain/models.py).
// Only the fields the UI reads. JSON is camelCase.

export type YearMonth = string; // "YYYY-MM"

export type Links = {
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
};

export type Contact = {
  email?: string | null;
  phone?: string | null; // never rendered
  location?: string | null;
  links?: Links;
};

export type Profile = {
  name: string;
  title: string;
  contact?: Contact;
};

export type Summary = { focus: string; text: string };

export type Education = {
  id: string;
  degree: string;
  institution: string;
  year?: number | null;
};

export type Certification = {
  id: string;
  name: string;
  /** `course`: completion certificate, kept as a record but hidden from CVs by default. */
  kind: "certification" | "course";
  issuer: string;
  issuedDate?: YearMonth | null;
  expiresDate?: YearMonth | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  skills: string[]; // skill IDs
  /** Computed by the API for today. */
  status: "active" | "expired" | "no-expiry";
};

export type Language = {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native";
  notes?: string | null;
};

export type ProfileBundle = {
  profile: Profile | null;
  summaries: Summary[];
  education: Education[];
  /** Newest first; undated ones last (API order). */
  certifications: Certification[];
  languages: Language[];
};

export type Party = {
  name: string;
  alias?: string | null;
  confidential: boolean;
};

export type Project = {
  id: string;
  headline: string;
  employer?: Party | null;
  customer?: Party | null;
  startDate: YearMonth;
  endDate?: YearMonth | null;
  role: string;
  teamSize?: string | null;
  projectDescription: string;
  responsibilities: string[];
  results: string[];
  tools: string[]; // skill IDs
  practices: string[]; // skill IDs
};

export type Skill = {
  id: string;
  name: string;
  kind: "technology" | "practice";
  categories: string[];
  parent?: string | null;
  aliases: string[];
  lastUsed?: YearMonth | null;
  currentlyUsed?: boolean;
  freshness?: "fresh" | "rusty" | "stale" | "unknown";
  yearsOfExperience?: number | null;
};

export type CvData = {
  profile: ProfileBundle;
  projects: Project[];
  skills: Skill[];
};
