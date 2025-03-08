"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dictionary } from "@/lib/getDictionary";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import styles from "./Header.module.scss";

const Header = ({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: string;
}) => {
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
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles["header-container"]}>
        <Link href={`/${lang}`} className={styles.logo}>
          <span className={styles["gradient-text"]}>GM Galvan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles["desktop-nav"]}>
          <Link href={`/${lang}#about`}>
            {dictionary.navigation.about}
          </Link>
          <Link href={`/${lang}#skills`}>
            {dictionary.navigation.skills}
          </Link>
          <Link href={`/${lang}#experience`}>
            {dictionary.navigation.experience}
          </Link>
          <Link href={`/${lang}#contact`}>
            {dictionary.navigation.contact}
          </Link>
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
          <Link
            href={`/${lang}#about`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.about}
          </Link>
          <Link
            href={`/${lang}#skills`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.skills}
          </Link>
          <Link
            href={`/${lang}#experience`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.experience}
          </Link>
          <Link
            href={`/${lang}#contact`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.contact}
          </Link>
          <div style={{ paddingTop: "0.5rem" }}>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
