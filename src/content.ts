// All site copy lives here. Edit this file to update the portfolio.

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Language-independent data
export const profile = {
  name: "Guillermo Galvan",
  email: "guillermoo.gs@gmail.com",
  photo: "/images/profile-photo.jpg",
  links: [
    { label: "GitHub", href: "https://github.com/gmgalvan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/gmgalvan/" },
    { label: "X", href: "https://x.com/memo_dll" },
  ],
};

// Technology filters shown above Experience. A job matches a filter when its
// stack contains any of the listed names.
export const techFilters: { label: string; match: string[] }[] = [
  { label: "Python", match: ["Python"] },
  { label: "Kubernetes", match: ["Kubernetes", "GKE"] },
  { label: "AWS", match: ["AWS", "Lambda", "Glue", "Athena", "Cognito"] },
  { label: "GCP", match: ["GCP", "GKE", "Dataflow", "Pub/Sub", "Cloud Spanner", "BigTable"] },
  { label: "gRPC", match: ["gRPC"] },
  { label: "PostgreSQL", match: ["PostgreSQL", "CockroachDB"] },
  { label: "Vue.js", match: ["Vue.js"] },
];

export type Role = {
  title: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  stack: string[];
};

type Content = {
  meta: { title: string; description: string; keywords: string[] };
  role: string;
  location: string;
  intro: string[];
  sections: {
    experience: string;
    skills: string;
    certifications: string;
    education: string;
    contact: string;
  };
  contactText: string;
  ui: {
    print: string;
    filterBy: string;
    all: string;
    showing: (n: number, total: number) => string;
    toggle: string;
  };
  experience: Role[];
  skills: { group: string; items: string[] }[];
  certifications: { title: string; issuer: string; date: string; href?: string }[];
  education: { degree: string; school: string; year: string };
  rights: string;
};

const stacks = {
  monitoring: ["Go", "Python", "GraphQL", "gRPC", "Kubernetes", "GCP", "GKE", "Dataflow", "MongoDB", "Etcd", "Elasticsearch", "Vue.js"],
  tms: ["Go", "Python", "Kubernetes", "PostgreSQL", "Etcd", "Angular", "AWS", "GCP", "Airflow", "Superset", "CircleCI"],
  patients: ["Go", "GCP", "GKE", "Pub/Sub", "Dataflow", "PostgreSQL", "CockroachDB", "Cloud Spanner", "BigTable", "gRPC", "Vue.js"],
  cloud: ["AWS", "Lambda", "Glue", "Athena", "Cognito", "Terraform", "CloudFormation", "Go", "Python", "Kafka"],
  support: ["Go", "Python", "Docker", "IBM Watson", "Rasa", "Scrapy", "Pandas", "MongoDB"],
};

const terraformCert = {
  title: "HashiCorp Certified: Terraform Associate (003)",
  issuer: "HashiCorp",
  // TODO: replace with your real Credly badge URL
  href: undefined as string | undefined,
};

export const content: Record<Locale, Content> = {
  en: {
    meta: {
      title: "Guillermo Galvan — Senior Software Engineer",
      description:
        "Senior Software Engineer specializing in Go, Python and cloud architecture: distributed systems, microservices and DevOps.",
      keywords: [
        "Guillermo Galvan",
        "Senior Software Engineer",
        "Go developer",
        "Golang engineer",
        "Python developer",
        "Backend engineer",
        "Cloud architect",
        "DevOps engineer",
        "Kubernetes",
        "AWS",
        "GCP",
        "Microservices",
        "Distributed systems",
        "Remote software engineer Mexico",
      ],
    },
    role: "Senior Software Engineer",
    location: "Mexico · Remote",
    intro: [
      "I build backend systems and cloud infrastructure, mostly in Go and Python. My work centers on distributed systems, microservices and the DevOps practices that keep them running.",
      "I've shipped products for teams in the US and Mexico on AWS and GCP — from IT monitoring and logistics platforms to healthcare software and cloud migrations.",
    ],
    sections: {
      experience: "Experience",
      skills: "Skills",
      certifications: "Certifications",
      education: "Education",
      contact: "Contact",
    },
    contactText: "The fastest way to reach me is by email.",
    ui: {
      print: "Save PDF",
      filterBy: "Filter by technology",
      all: "All",
      showing: (n, total) => `${n} of ${total} roles`,
      toggle: "Show or hide section",
    },
    experience: [
      {
        title: "Senior Go Developer",
        company: "IT Monitoring Platform",
        period: "5 months",
        location: "US · Remote",
        summary:
          "Architecture, development and team leadership on a distributed monitoring platform giving enterprises full visibility into their infrastructure. GraphQL gateway over Go microservices.",
        stack: stacks.monitoring,
      },
      {
        title: "Backend Go Developer",
        company: "Transportation Management System",
        period: "1 yr 7 mos",
        location: "US · Remote",
        summary:
          "Event-driven microservices for a logistics platform integrating legacy systems and machine-learning services. Led performance optimization; built data workflows with Airflow and Superset.",
        stack: stacks.tms,
      },
      {
        title: "Go Developer",
        company: "Patient Relationship Management Platform",
        period: "1 yr 9 mos",
        location: "US · Remote",
        summary:
          "Microservices for a healthcare platform improving patient experience: REST externally, gRPC and Pub/Sub internally, running on Kubernetes.",
        stack: stacks.patients,
      },
      {
        title: "DevOps Cloud Engineer",
        company: "IT Consultancy & Cloud Migration",
        period: "10 months",
        location: "US & Mexico",
        summary:
          "Led migrations of existing services to AWS, implemented infrastructure as code and CI/CD, and built cloud cost reporting and optimization.",
        stack: stacks.cloud,
      },
      {
        title: "Software Developer",
        company: "Customer Service Automation Platform",
        period: "1 yr 7 mos",
        location: "Mexico",
        summary:
          "Chatbots and automation for a domain and hosting provider using IBM Watson and NLP, plus scraping and data analysis to improve customer interactions.",
        stack: stacks.support,
      },
    ],
    skills: [
      { group: "Languages", items: ["Go", "Python", "TypeScript", "Java"] },
      { group: "Backend", items: ["gRPC", "GraphQL", "REST", "Echo", "Flask", "Microservices"] },
      { group: "Cloud & DevOps", items: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "CI/CD"] },
      { group: "Data", items: ["PostgreSQL", "MongoDB", "BigTable", "Cloud Spanner", "Kafka", "Airflow", "Apache Beam"] },
      { group: "Frontend", items: ["Vue.js", "Angular", "React"] },
    ],
    certifications: [{ ...terraformCert, date: "Oct 2024" }],
    education: {
      degree: "Mechatronics Engineer",
      school: "Centro de Enseñanza Técnico e Industrial",
      year: "2015",
    },
    rights: "All rights reserved.",
  },

  es: {
    meta: {
      title: "Guillermo Galvan — Ingeniero de Software Senior",
      description:
        "Ingeniero de Software Senior especializado en Go, Python y arquitectura en la nube: sistemas distribuidos, microservicios y DevOps.",
      keywords: [
        "Guillermo Galvan",
        "Ingeniero de Software Senior",
        "Desarrollador Go",
        "Desarrollador Golang",
        "Desarrollador Python",
        "Ingeniero backend",
        "Arquitecto cloud",
        "Ingeniero DevOps",
        "Kubernetes",
        "AWS",
        "GCP",
        "Microservicios",
        "Sistemas distribuidos",
        "Ingeniero de software remoto México",
      ],
    },
    role: "Ingeniero de Software Senior",
    location: "México · Remoto",
    intro: [
      "Construyo sistemas backend e infraestructura en la nube, principalmente con Go y Python. Mi trabajo se centra en sistemas distribuidos, microservicios y las prácticas DevOps que los mantienen funcionando.",
      "He desarrollado productos para equipos en Estados Unidos y México sobre AWS y GCP: desde plataformas de monitoreo IT y logística hasta software de salud y migraciones a la nube.",
    ],
    sections: {
      experience: "Experiencia",
      skills: "Habilidades",
      certifications: "Certificaciones",
      education: "Educación",
      contact: "Contacto",
    },
    contactText: "La forma más rápida de contactarme es por correo.",
    ui: {
      print: "Guardar PDF",
      filterBy: "Filtrar por tecnología",
      all: "Todo",
      showing: (n, total) => `${n} de ${total} puestos`,
      toggle: "Mostrar u ocultar sección",
    },
    experience: [
      {
        title: "Desarrollador Senior de Go",
        company: "Plataforma de Monitoreo IT",
        period: "5 meses",
        location: "EE. UU. · Remoto",
        summary:
          "Arquitectura, desarrollo y liderazgo técnico en una plataforma distribuida de monitoreo que da a las empresas visibilidad completa de su infraestructura. Gateway GraphQL sobre microservicios en Go.",
        stack: stacks.monitoring,
      },
      {
        title: "Desarrollador Backend de Go",
        company: "Sistema de Gestión de Transporte",
        period: "1 año 7 meses",
        location: "EE. UU. · Remoto",
        summary:
          "Microservicios orientados a eventos para una plataforma logística integrada con sistemas legados y servicios de machine learning. Lideré la optimización de rendimiento; flujos de datos con Airflow y Superset.",
        stack: stacks.tms,
      },
      {
        title: "Desarrollador de Go",
        company: "Plataforma de Relación con Pacientes",
        period: "1 año 9 meses",
        location: "EE. UU. · Remoto",
        summary:
          "Microservicios para una plataforma de salud enfocada en la experiencia del paciente: REST hacia afuera, gRPC y Pub/Sub internamente, sobre Kubernetes.",
        stack: stacks.patients,
      },
      {
        title: "Ingeniero DevOps Cloud",
        company: "Consultoría IT y Migración a la Nube",
        period: "10 meses",
        location: "EE. UU. y México",
        summary:
          "Lideré migraciones de servicios a AWS, implementé infraestructura como código y CI/CD, y construí reportes para el control y optimización de costos en la nube.",
        stack: stacks.cloud,
      },
      {
        title: "Desarrollador de Software",
        company: "Plataforma de Automatización de Servicio al Cliente",
        period: "1 año 7 meses",
        location: "México",
        summary:
          "Chatbots y automatización para un proveedor de dominios y hosting con IBM Watson y NLP, además de scraping y análisis de datos para mejorar la atención al cliente.",
        stack: stacks.support,
      },
    ],
    skills: [
      { group: "Lenguajes", items: ["Go", "Python", "TypeScript", "Java"] },
      { group: "Backend", items: ["gRPC", "GraphQL", "REST", "Echo", "Flask", "Microservicios"] },
      { group: "Cloud y DevOps", items: ["AWS", "GCP", "Kubernetes", "Docker", "Terraform", "CI/CD"] },
      { group: "Datos", items: ["PostgreSQL", "MongoDB", "BigTable", "Cloud Spanner", "Kafka", "Airflow", "Apache Beam"] },
      { group: "Frontend", items: ["Vue.js", "Angular", "React"] },
    ],
    certifications: [{ ...terraformCert, date: "Oct 2024" }],
    education: {
      degree: "Ingeniero en Mecatrónica",
      school: "Centro de Enseñanza Técnico e Industrial",
      year: "2015",
    },
    rights: "Todos los derechos reservados.",
  },
};
