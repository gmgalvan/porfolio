"use client";

import { useRef, useEffect } from "react";
import { Dictionary } from "@/lib/getDictionary";
import styles from "./Skills.module.scss";

// Define skill data structure
type Skill = {
  name: string;
  level: number; // 1-5 scale
  icon?: string; // Optional icon name
};

type SkillCategory = {
  category: string;
  title: string;
  icon?: string; // Category icon
  skills: Skill[];
};

const Skills = ({ 
  dictionary, 
  lang 
}: { 
  dictionary: Dictionary; 
  lang: string 
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            
            // Add staggered animation to skill items
            if (skillsRef.current) {
              const items = skillsRef.current.querySelectorAll(`.${styles.skillItem}`);
              items.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add(styles.animated);
                }, 100 * index);
              });
            }
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

  // Extract skills data properly from JSON
  const skillsData: SkillCategory[] = Object.entries(dictionary.skills.categories).map(
    ([key, value]: [string, any]) => ({
      category: key,
      title: value.title,
      icon: value.icon || getDefaultIcon(key),
      skills: value.skills || [] // Use empty array if no skills are present
    })
  );

  // Get a default icon based on category name
  function getDefaultIcon(category: string): string {
    const icons: {[key: string]: string} = {
      frontend: "code",
      backend: "server",
      design: "palette",
      databases: "database",
      devops: "settings",
      languages: "globe",
      other: "tool"
    };
    
    return icons[category.toLowerCase()] || "star";
  }

  // Helper to get skill level label
  const getSkillLevelLabel = (level: number): string => {
    const labels = {
      1: lang === "es" ? "Principiante" : "Beginner",
      2: lang === "es" ? "Básico" : "Basic",
      3: lang === "es" ? "Intermedio" : "Intermediate",
      4: lang === "es" ? "Avanzado" : "Advanced",
      5: lang === "es" ? "Experto" : "Expert"
    };
    
    return labels[level as keyof typeof labels] || "";
  };

  return (
    <section ref={sectionRef} className={styles.skillsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{dictionary.skills.title}</h2>
          <div className={styles.underline}></div>
          <p>{dictionary.skills.subtitle}</p>
        </div>
        
        <div ref={skillsRef} className={styles.skillsGrid}>
          {skillsData.map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  {getCategoryIcon(category.icon)}
                </div>
                <h3>{category.title}</h3>
              </div>
              
              {category.skills.length > 0 ? (
                <ul className={styles.skillsList}>
                  {category.skills.map((skill, i) => (
                    <li key={i} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillLevel}>{getSkillLevelLabel(skill.level)}</span>
                      </div>
                      <div className={styles.skillBar}>
                        <div 
                          className={styles.skillFill} 
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  {lang === "es" ? "No hay habilidades listadas" : "No skills listed"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to render appropriate category icon
function getCategoryIcon(icon: string): JSX.Element {
  const iconMap: {[key: string]: JSX.Element} = {
    code: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    server: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>
    ),
    database: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    palette: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"></circle>
        <circle cx="17.5" cy="10.5" r=".5"></circle>
        <circle cx="8.5" cy="7.5" r=".5"></circle>
        <circle cx="6.5" cy="12.5" r=".5"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    globe: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    tool: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  };
  
  return iconMap[icon] || iconMap["star"];
}

export default Skills;