// Presentation settings. See docs/cv-ui.md.

export const cvConfig = {
  /** Summary focus shown as the intro; falls back to the first summary. */
  summaryFocus: "cloud-devops",
  /** Experience filter: max chips per lifecycle phase (most used top-level technologies). */
  chipsPerPhase: 4,
  /**
   * Order of technology categories: software lifecycle phases (docs/data-model.md).
   * Unknown categories follow alphabetically, skills without one ("Other") go last.
   */
  categoryOrder: ["Plan", "Code", "Build & Test", "Release & Deploy", "Run", "Observe", "Data"],
  /** Show `course` entries (completion certificates) in the certifications section. */
  showCourses: false,
  /** Expired certifications: "show" with their date range and an "Expired" label, or "hide". */
  expiredCertifications: "show" as "show" | "hide",
  photo: "/images/profile-photo.jpg",
};

export type CvConfig = typeof cvConfig;
