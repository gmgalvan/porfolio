"use client";

import { useRef, useEffect, useState } from "react";
import { Dictionary } from "@/lib/getDictionary";
import Link from "next/link";
import styles from "./Experience.module.scss";

// Define project data structure
type Project = {
  id: string;
  title: string;
  role: string;
  duration: string;
  description: string;
  customer: string;
  technologies: string[];
  responsibilities: string[];
};

const Experience = ({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: string;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState<string>("it-monitoring");

  // Define projects data
  const projects: Project[] = [
    {
      id: "it-monitoring",
      title:
        lang === "es"
          ? "Solución de Monitoreo IT"
          : "IT Monitoring Solution",
      role:
        lang === "es"
          ? "Desarrollador Senior de Go"
          : "Senior Go Developer",
      duration: lang === "es" ? "5 meses" : "5 months",
      description:
        lang === "es"
          ? "Herramienta de monitoreo IT que proporciona a las empresas una visibilidad profunda en sus infraestructuras. Construida sobre un framework de sistema distribuido, asegurando escalabilidad y rendimiento robusto."
          : "IT monitoring tool that provides enterprises with deep visibility into their entire IT infrastructures. Built on a distributed system framework ensuring scalability and robust performance.",
      customer: lang === "es" ? "Empresa de EE.UU." : "US Company",
      technologies: [
        "Go",
        "Python",
        "Java",
        "JavaScript",
        "Vue.js",
        "Kubernetes",
        "GCP",
        "GKE",
        "Dataflow",
        "GraphQL",
        "MongoDB",
        "Etcd",
        "ElasticSearch"
      ],
      responsibilities: [
        lang === "es" ? "Arquitectura y diseño" : "Architecture and design",
        lang === "es" ? "Desarrollo de código" : "Code development",
        lang === "es" ? "Pruebas unitarias" : "Unit testing",
        lang === "es" ? "Revisiones de código" : "Code reviews",
        lang === "es" ? "Compartir conocimientos" : "Knowledge sharing"
      ]
    },
    {
      id: "transportation-management",
      title:
        lang === "es"
          ? "Sistema de Gestión de Transporte"
          : "Transportation Management System",
      role:
        lang === "es"
          ? "Desarrollador Backend de Go"
          : "Backend Go Developer",
      duration: lang === "es" ? "1 año y 7 meses" : "1 year 7 months",
      description:
        lang === "es"
          ? "Sistema avanzado de gestión de transporte diseñado para operaciones logísticas modernas. Construido sobre una arquitectura de microservicios, se integra con sistemas de aprendizaje automático para mejorar la toma de decisiones."
          : "Advanced Transportation Management System designed for modern logistics operations. Built on a microservices architecture, it integrates with machine learning systems for enhanced decision-making.",
      customer: lang === "es" ? "Empresa de EE.UU." : "US Company",
      technologies: [
        "Go",
        "Python",
        "Kubernetes",
        "PostgreSQL",
        "Etcd",
        "TypeScript",
        "Angular",
        "Docker",
        "Circle CI",
        "AWS",
        "GCP",
        "Airflow",
        "Superset"
      ],
      responsibilities: [
        lang === "es" ? "Arquitectura y diseño" : "Architecture and design",
        lang === "es" ? "Desarrollo de código" : "Code development",
        lang === "es" ? "Optimización de rendimiento" : "Performance optimization",
        lang === "es" ? "Integración con sistemas externos" : "Integration with external systems",
        lang === "es" ? "Mantenimiento y soporte" : "Maintenance and support"
      ]
    },
    {
      id: "patient-relationship",
      title:
        lang === "es"
          ? "Plataforma de Gestión de Relaciones con Pacientes"
          : "Patient Relationship Management Platform",
      role: lang === "es" ? "Desarrollador de Go" : "Go Developer",
      duration: lang === "es" ? "1 año y 9 meses" : "1 year 9 months",
      description:
        lang === "es"
          ? "Plataforma de gestión de relaciones con pacientes que ofrece a los proveedores de atención médica herramientas para mejorar la experiencia del paciente y fomentar mejores relaciones."
          : "Healthcare patient relationship management platform offering tools to enhance the patient experience and foster better relationships between providers and patients.",
      customer: lang === "es" ? "Empresa de EE.UU." : "US Company",
      technologies: [
        "Go",
        "GCP",
        "GKE",
        "JavaScript",
        "Vue.js",
        "Mithril",
        "PubSub",
        "Dataflow",
        "PostgreSQL",
        "REST APIs",
        "gRPC",
        "Cloud Spanner"
      ],
      responsibilities: [
        lang === "es" ? "Análisis de requisitos" : "Requirements analysis",
        lang === "es" ? "Desarrollo de microservicios" : "Microservices development",
        lang === "es" ? "Integración de APIs" : "API integration",
        lang === "es" ? "Migración e integración de datos" : "Data migration and integration",
        lang === "es" ? "Documentación técnica" : "Technical documentation"
      ]
    },
    {
      id: "cloud-migration",
      title:
        lang === "es"
          ? "Consultoría IT y Migración a la Nube"
          : "IT Consultancy and Cloud Migration",
      role:
        lang === "es"
          ? "Ingeniero DevOps Cloud"
          : "DevOps Cloud Engineer",
      duration: lang === "es" ? "10 meses" : "10 months",
      description:
        lang === "es"
          ? "Proyecto IT centrado en la migración de servicios existentes a un entorno en la nube. Prioriza la integración perfecta de proyectos distintos y diseños arquitectónicos personalizados."
          : "IT project focusing on migrating existing services to a cloud environment. It prioritizes seamless integration of distinct projects and custom architectural designs.",
      customer:
        lang === "es"
          ? "Clientes de EE.UU. y México"
          : "US and Mexican Customers",
      technologies: [
        "AWS",
        "S3",
        "Beanstalk",
        "Cognito",
        "Glue",
        "Athena",
        "Lambda",
        "Go",
        "Python",
        "Terraform",
        "Kafka",
        "Vue.js",
        "AWS CodeBuild"
      ],
      responsibilities: [
        lang === "es"
          ? "Estrategia de migración a la nube"
          : "Cloud migration strategy",
        lang === "es"
          ? "Implementación de Infraestructura como Código"
          : "Infrastructure as Code implementation",
        lang === "es"
          ? "Configuración de pipelines CI/CD"
          : "CI/CD pipelines setup",
        lang === "es" ? "Optimización de costos" : "Cost optimizations",
        lang === "es" ? "Consultoría técnica" : "Technical consultancy"
      ]
    },
    {
      id: "customer-service",
      title:
        lang === "es"
          ? "Plataforma de Automatización de Servicio al Cliente"
          : "Customer Service Automation Platform",
      role:
        lang === "es" ? "Desarrollador Web" : "Software Web Developer",
      duration: lang === "es" ? "1 año y 7 meses" : "1 year 7 months",
      description:
        lang === "es"
          ? "Plataforma de automatización de servicio al cliente para registro de dominios y alojamiento web. Utiliza arquitectura de servicios, chatbots e IBM Watson para la automatización del chat."
          : "Customer service automation platform for domain registration and web hosting. Utilizes service architecture, chatbots, and IBM Watson for chat automation.",
      customer:
        lang === "es" ? "Empresa Mexicana" : "Mexican Company",
      technologies: [
        "Go",
        "Python",
        "Docker",
        "IBM Bluemix Cloud",
        "Watson AI",
        "Rasa",
        "Beautiful Soup",
        "Scrapy",
        "MongoDB",
        "Gorilla Mux"
      ],
      responsibilities: [
        lang === "es" ? "Desarrollo de chatbots" : "Chatbot development",
        lang === "es"
          ? "Integración con APIs externas"
          : "Integration with external APIs",
        lang === "es" ? "Scraping web" : "Web scraping",
        lang === "es" ? "Desarrollo backend" : "Backend development",
        lang === "es"
          ? "Automatización de procesos"
          : "Process automation"
      ]
    }
  ];

  // Apply fade-in when the section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const activeProjectData = projects.find(
    (project) => project.id === activeProject
  );

  return (
    <section id="experience" ref={sectionRef} className={styles.experienceSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{dictionary.experience.title}</h2>
          <div className={styles.underline}></div>
          <p>{dictionary.experience.subtitle}</p>
        </div>

        <div className={styles.content}>
          {/* Project Tabs */}
          <div className={styles.projectTabs}>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`${styles.tabButton} ${
                  activeProject === project.id ? styles.active : ""
                }`}
              >
                <h3>{project.title}</h3>
                <p>
                  {project.role} • {project.duration}
                </p>
              </button>
            ))}
          </div>

          {/* Project Details */}
          {activeProjectData && (
            <div className={styles.projectDetails}>
              <h3>{activeProjectData.title}</h3>
              <p className={styles.info}>
                {activeProjectData.role} | {activeProjectData.customer} |{" "}
                {activeProjectData.duration}
              </p>
              <p className={styles.description}>{activeProjectData.description}</p>

              <div className="mb-6">
                <h4 className={styles.sectionTitle}>
                  {lang === "es"
                    ? "Tecnologías Utilizadas"
                    : "Technologies Used"}
                </h4>
                <div className={styles.techList}>
                  {activeProjectData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={styles.techTag}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={styles.sectionTitle}>
                  {lang === "es"
                    ? "Responsabilidades"
                    : "Responsibilities"}
                </h4>
                <ul className={styles.responsibilities}>
                  {activeProjectData.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;