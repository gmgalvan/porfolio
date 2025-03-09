"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dictionary } from "@/lib/getDictionary";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import styles from "./Header.module.scss";

type HeaderProps = {
  dictionary: Dictionary;
  lang: "en" | "es";
};

export default function Header({ dictionary, lang }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles["header-container"]}>
        {/* Logo */}
        <Link href={`/${lang}`} className={styles.logo}>
          <span className={styles["gradient-text"]}>GM Galvan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles["desktop-nav"]}>
          <Link href={`/${lang}#contact`}>{dictionary.navigation.contact}</Link>
          <LanguageSwitcher currentLang={lang} />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles["mobile-nav-btn"]}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className={styles["mobile-nav"]}>
          <Link href={`/${lang}#contact`} onClick={() => setIsMenuOpen(false)}>
            {dictionary.navigation.contact}
          </Link>
          <div style={{ paddingTop: "0.5rem" }}>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </nav>
      )}
    </header>
  );
}
