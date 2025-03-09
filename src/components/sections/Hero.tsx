"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dictionary } from "@/lib/getDictionary";
import styles from "./Hero.module.scss";

const Hero = ({ dictionary, lang }: { dictionary: Dictionary; lang: string }) => {
  // Typing effect states
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Palabras más cortas para no ocupar tanto espacio
  const words = [
    lang === "es" ? "Go & Python" : "Go & Python",
    lang === "es" ? "AWS & GCP" : "AWS & GCP",
    lang === "es" ? "Microservicios" : "Microservices",
    lang === "es" ? "DevOps" : "DevOps"
  ];

  // Tecnologías más importantes organizadas por categoría (2 por categoría en lugar de 3)
  const techStack = [
    {
      name: lang === "es" ? "Backend" : "Backend",
      items: ["Go", "Python"]
    },
    {
      name: lang === "es" ? "Cloud" : "Cloud",
      items: ["AWS", "GCP"]
    },
    {
      name: lang === "es" ? "DevOps" : "DevOps",
      items: ["Kubernetes", "Docker"]
    },
    {
      name: lang === "es" ? "Datos" : "Data",
      items: ["PostgreSQL", "MongoDB"]
    }
  ];

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.substring(0, displayText.length + 1));
        if (displayText.length === word.length) {
          setTypingSpeed(1500); // Pause before deleting
          setIsDeleting(true);
        } else {
          setTypingSpeed(150);
        }
      } else {
        setDisplayText(word.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
          setTypingSpeed(500); // Pause before typing next word
        } else {
          setTypingSpeed(50);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, currentWordIndex, isDeleting, typingSpeed]);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles["section-wrapper"]}>
          <div className={styles["text-section"]}>
            <h1>{dictionary.hero.title}</h1>
            <p>{dictionary.hero.subtitle}</p>
            <div className="h-10 flex items-center">
              <span className={styles.typing}>
                {lang === "es" ? "Experto en: " : "Expert in: "}
                <span>
                  {displayText}
                  <span className="cursor">|</span>
                </span>
              </span>
            </div>
            {/*
            <div className="pt-3">
              <Link href={`/${lang}#projects`} className={styles.cta}>
                {dictionary.hero.cta}
              </Link>
            </div>
            */}
          </div>
          <div className={styles["image-section"]}>
            <div className={styles["profile-img"]}>
              <Image
                src="/images/profile-photo.jpg"
                alt="Guillermo Galvan"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x400.png?text=GM";
                }}
              />
            </div>
          </div>
        </div>
        
        <div className={styles["tech-stack"]}>
          <h3>{lang === "es" ? "Mi Stack Técnico" : "My Technical Stack"}</h3>
          <div className={styles["tech-categories"]}>
            {techStack.map((category) => (
              <div key={category.name} className={styles["category-group"]}>
                <h4>{category.name}</h4>
                <div className={styles["tech-icons"]}>
                  {category.items.map((tech) => (
                    <div key={tech} className={styles.icon}>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;