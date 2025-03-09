"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import styles from "./Certifications.module.scss";
import { Dictionary } from "@/lib/getDictionary";

//type Certification = {
 // title: string;
 // institution: string;
 // date: string;
 // link?: string;
//};

export default function Certifications({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  return (
    <section id="certifications" className={styles.certificationsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{dictionary.certifications.title}</h2>
          <div className={styles.underline}></div>
          <p>{dictionary.certifications.subtitle}</p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {dictionary.certifications.certificates.map((cert, index) => (
            <SwiperSlide key={index} className={styles.card}>
              <h3>{cert.title}</h3>
              <p className={styles.issuer}>{cert.institution}</p>
              <p className={styles.date}>{cert.date}</p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  {dictionary.certifications.viewCredential}
                </a>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
