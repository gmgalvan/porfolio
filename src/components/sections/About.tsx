"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./About.module.scss";
import { Dictionary } from "@/lib/getDictionary";

const About = ({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: string;
}) => {
  return (
    <section className={styles["about-section"]}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <Image
            src="/images/profile-photo.jpg"
            alt="Guillermo Galvan"
            width={250}
            height={250}
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://via.placeholder.com/250x250.png?text=GM";
            }}
          />
        </div>
        <div className={styles.bio}>
          <h2>{lang === "es" ? "Sobre mí" : "About Me"}</h2>
          <p>{dictionary.about.description}</p>
          <Link href={`/${lang}#contact`} className={styles.cta}>
            {lang === "es" ? "Contáctame" : "Contact Me"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
