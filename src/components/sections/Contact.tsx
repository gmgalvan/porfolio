"use client";

import { useRef, useEffect, useState, FormEvent } from "react";
import { Dictionary } from "@/lib/getDictionary";
import styles from "./Contact.module.scss";

const Contact = ({
  dictionary,
  lang,
  formEnabled = false,
}: {
  dictionary: Dictionary;
  lang: string;
  formEnabled?: boolean;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const currentSection = sectionRef.current; // capture the ref value
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

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert(lang === "es" ? "Por favor completa todos los campos" : "Please fill in all fields");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{dictionary.contact.title}</h2>
          <div className="underline"></div>
          <p>{dictionary.contact.subtitle}</p>
        </div>

        <div className={styles.contactContent}>
          {/* Contact Info */}
          <div className={`${styles.contactInfo} ${!formEnabled ? styles.fullWidth : ''}`}>
            <div className={styles.contactItems}>
              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3>{lang === "es" ? "Teléfono" : "Phone"}</h3>
                <p>+52 3334858187</p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3>{lang === "es" ? "Correo Electrónico" : "Email"}</h3>
                <p>guillermoo.gs@gmail.com</p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3>{lang === "es" ? "Ubicación" : "Location"}</h3>
                <p>{lang === "es" ? "México" : "Mexico"}</p>
              </div>
            </div>
          </div>

          {/* Only render the form if formEnabled is true */}
          {formEnabled && (
            <div className={styles.contactForm}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">{dictionary.contact.form.name}</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">{dictionary.contact.form.email}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message">{dictionary.contact.form.message}</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? lang === "es" ? "Enviando..." : "Sending..."
                    : dictionary.contact.form.send}
                </button>
                {status === "success" && (
                  <div className={`${styles.statusMessage} ${styles.success}`}>
                    {dictionary.contact.success}
                  </div>
                )}
                {status === "error" && (
                  <div className={`${styles.statusMessage} ${styles.error}`}>
                    {dictionary.contact.error}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;