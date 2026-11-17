// UI labels only. CV content comes from the API (English for now, see docs/cv-ui.md).

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const ui = {
  en: {
    sections: {
      summary: "Summary",
      experience: "Experience",
      skills: "Technologies",
      certifications: "Certifications",
      education: "Education",
      languages: "Languages",
      contact: "Contact",
    },
    expired: "Expired",
    validUntil: "Valid until",
    verify: "Verify credential",
    levels: {
      native: "Native",
      A1: "A1 · Beginner",
      A2: "A2 · Elementary",
      B1: "B1 · Intermediate",
      B2: "B2 · Upper intermediate",
      C1: "C1 · Advanced",
      C2: "C2 · Proficient",
    },
    fields: {
      description: "Project description",
      customer: "Customer",
      role: "Project role",
      duration: "Duration",
      teamSize: "Team size",
      responsibilities: "Responsibilities",
      results: "Results",
      tools: "Tools & technologies",
    },
    contactText: "The fastest way to reach me is by email.",
    print: "Save PDF",
    filterBy: "Filter by technology",
    all: "Show all",
    showing: "{n} of {total} projects",
    searchPlaceholder: "Search a technology…",
    noResults: "No projects use “{q}”.",
    toggle: "Show or hide section",
    present: "Present",
    other: "Other",
    /** Display names for lifecycle phases stored in skill `categories`; unknown ones show as stored. */
    phases: {} as Record<string, string>,
    confidentialCompany: "Confidential company",
    confidentialClient: "Confidential client",
    noEmployer: "Independent",
    duration: (years: number, months: number) =>
      [years && plural(years, "yr", "yrs"), months && plural(months, "mo", "mos")].filter(Boolean).join(" "),
    rights: "All rights reserved.",
  },
  es: {
    sections: {
      summary: "Resumen",
      experience: "Experiencia",
      skills: "Tecnologías",
      certifications: "Certificaciones",
      education: "Educación",
      languages: "Idiomas",
      contact: "Contacto",
    },
    expired: "Vencida",
    validUntil: "Vigente hasta",
    verify: "Verificar credencial",
    levels: {
      native: "Nativo",
      A1: "A1 · Principiante",
      A2: "A2 · Básico",
      B1: "B1 · Intermedio",
      B2: "B2 · Intermedio alto",
      C1: "C1 · Avanzado",
      C2: "C2 · Dominio",
    },
    fields: {
      description: "Descripción",
      customer: "Cliente",
      role: "Rol",
      duration: "Duración",
      teamSize: "Tamaño del equipo",
      responsibilities: "Responsabilidades",
      results: "Resultados",
      tools: "Tecnologías",
    },
    contactText: "La forma más rápida de contactarme es por correo.",
    print: "Guardar PDF",
    filterBy: "Filtrar por tecnología",
    all: "Ver todo",
    showing: "{n} de {total} proyectos",
    searchPlaceholder: "Buscar una tecnología…",
    noResults: "Ningún proyecto usa “{q}”.",
    toggle: "Mostrar u ocultar sección",
    present: "Actualidad",
    other: "Otras",
    phases: {
      Plan: "Planeación",
      Code: "Código",
      "Build & Test": "Build y pruebas",
      "Release & Deploy": "Despliegue",
      Run: "Operación",
      Observe: "Observabilidad",
      Data: "Datos",
    } as Record<string, string>,
    confidentialCompany: "Empresa confidencial",
    confidentialClient: "Cliente confidencial",
    noEmployer: "Independiente",
    duration: (years: number, months: number) =>
      [years && plural(years, "año", "años"), months && plural(months, "mes", "meses")].filter(Boolean).join(" "),
    rights: "Todos los derechos reservados.",
  },
} satisfies Record<Locale, unknown>;
