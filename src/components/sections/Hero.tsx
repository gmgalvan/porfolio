"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dictionary } from "@/lib/getDictionary";
import styles from "./Hero.module.scss"; // Import your Sass module

const Hero = ({ dictionary, lang }: { dictionary: Dictionary; lang: string }) => {
  // Typing effect states
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Words to animate
  const words = ["Go", "Python", "DevOps", "AWS", "GCP", "Kubernetes", "Docker"];

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
            <div className="h-14 flex items-center">
              <span className={styles.typing}>
                {lang === "es" ? "Especializado en: " : "Specializing in: "}
                <span>
                  {displayText}
                  <span className="cursor">|</span>
                </span>
              </span>
            </div>
            <div className="pt-4">
              <Link href={`/${lang}#projects`} className={styles.cta}>
                {dictionary.hero.cta}
              </Link>
            </div>
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
          <h3>{lang === "es" ? "Tecnologías que uso" : "Technologies I work with"}</h3>
          <div className={styles["tech-icons"]}>
            {["Go", "Python", "AWS", "GCP", "Kubernetes", "Docker", "Terraform"].map((tech) => (
              <div key={tech} className={styles.icon}>
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
