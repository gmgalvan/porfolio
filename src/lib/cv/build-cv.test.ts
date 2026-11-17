import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { CvData } from "@/lib/api/types";
import { buildCv } from "./build-cv";
import { cvConfig } from "./config";
import { formatCertificationDates, formatDuration, monthsBetween } from "./format";

const fixture = <T>(name: string): T =>
  JSON.parse(readFileSync(join(process.cwd(), "fixtures", `${name}.json`), "utf8")) as T;

const data: CvData = {
  profile: fixture("profile"),
  projects: fixture("projects"),
  skills: fixture("skills"),
};

const cv = buildCv(data, cvConfig);

describe("buildCv", () => {
  it("never exposes confidential names or the phone", () => {
    const json = JSON.stringify(cv);
    expect(json).not.toContain("Secret Health Inc");
    expect(json).not.toContain("Hidden Corp");
    expect(json).not.toContain("+00 000");
  });

  it("uses the alias of a confidential party, or anonymous without alias", () => {
    const projects = cv.employers[0].projects;
    expect(projects[0].customer).toEqual({ kind: "named", text: "US healthcare company" });
    expect(projects[1].customer).toEqual({ kind: "anonymous" });
    expect(cv.warnings).toHaveLength(1);
  });

  it("groups projects by employer, ongoing employer first, newest project first", () => {
    expect(cv.employers.map((e) => e.key)).toEqual(["Example Consulting", "Example Hosting"]);
    const consulting = cv.employers[0];
    expect(consulting.projects.map((p) => p.id)).toEqual(["example-platform-migration", "example-data-pipeline"]);
    expect(consulting.startDate).toBe("2023-01");
    expect(consulting.endDate).toBeNull();
  });

  it("keeps responsibilities and results apart and resolves tool names", () => {
    const p = cv.employers[0].projects[0];
    expect(p.responsibilities).toEqual(["Built example pipelines", "Wrote example infrastructure as code"]);
    expect(p.results).toEqual(["Example result: faster deployments"]);
    expect(p.teamSize).toBe("4");
    expect(p.stack.map((s) => s.name)).toEqual(["AWS", "Lambda", "Terraform"]);
  });

  it("lets a parent filter match child skills", () => {
    const lambda = cv.employers[0].projects[0].stack.find((s) => s.id === "lambda");
    expect(lambda?.matchIds).toEqual(["lambda", "aws"]);
  });

  it("groups filter chips by phase, top-level technologies only, most used first", () => {
    expect(cv.filters).toEqual([
      { phase: "Code", chips: [{ id: "go", label: "Go", count: 2 }] },
      { phase: "Release & Deploy", chips: [{ id: "terraform", label: "Terraform", count: 1 }] },
      {
        phase: "Run",
        chips: [
          { id: "aws", label: "AWS", count: 1 }, // covers Lambda: no separate Lambda chip
          { id: "kubernetes", label: "Kubernetes", count: 1 },
        ],
      },
      { phase: null, chips: [{ id: "python", label: "Python", count: 1 }] },
    ]);
  });

  it("limits chips per phase", () => {
    const view = buildCv(data, { ...cvConfig, chipsPerPhase: 1 });
    expect(view.filters.find((g) => g.phase === "Run")?.chips.map((c) => c.id)).toEqual(["aws"]);
  });

  it("gives every tool search terms from its name, aliases, and parent", () => {
    const tools = cv.employers.flatMap((e) => e.projects).flatMap((p) => p.stack);
    expect(tools.find((t) => t.id === "lambda")?.terms).toEqual(expect.arrayContaining(["lambda", "aws"]));
    expect(tools.find((t) => t.id === "go")?.terms).toEqual(expect.arrayContaining(["go", "golang"]));
  });

  it("groups technologies by lifecycle phase in config order, children inside parents, Other last", () => {
    expect(cv.skillGroups).toEqual([
      { category: "Code", items: ["Go"] },
      { category: "Release & Deploy", items: ["Terraform"] },
      { category: "Run", items: ["AWS (Lambda)", "Kubernetes"] },
      { category: null, items: ["Python"] },
    ]);
  });

  it("shows a child in its own phase when it differs from its parent's", () => {
    const skills = [
      { id: "aws", name: "AWS", kind: "technology" as const, categories: ["Run"], aliases: [] },
      { id: "lambda", name: "Lambda", kind: "technology" as const, categories: ["Run"], parent: "aws", aliases: [] },
      { id: "athena", name: "Athena", kind: "technology" as const, categories: ["Data"], parent: "aws", aliases: [] },
    ];
    const groups = buildCv({ ...data, skills, projects: [] }, cvConfig).skillGroups;
    expect(groups).toEqual([
      { category: "Run", items: ["AWS (Lambda)"] },
      { category: "Data", items: ["Athena"] },
    ]);
  });

  it("puts unknown categories after the configured ones, alphabetically", () => {
    const skills = [
      { id: "a", name: "A", kind: "technology" as const, categories: ["Zeta"], aliases: [] },
      { id: "b", name: "B", kind: "technology" as const, categories: ["Alpha"], aliases: [] },
      { id: "c", name: "C", kind: "technology" as const, categories: ["Plan"], aliases: [] },
    ];
    const groups = buildCv({ ...data, skills, projects: [] }, cvConfig).skillGroups;
    expect(groups.map((g) => g.category)).toEqual(["Plan", "Alpha", "Zeta"]);
  });

  it("splits the summary into paragraphs", () => {
    expect(cv.intro).toHaveLength(2);
  });
});

describe("certifications and languages", () => {
  it("hides courses and shows expired certifications flagged, in API order", () => {
    expect(cv.certifications.map((c) => [c.id, c.expired])).toEqual([
      ["example-cloud-architect", false],
      ["example-iac-associate", true],
      ["example-k8s-fundamentals", false],
    ]);
    expect(cv.certifications[0].url).toBe("https://example.com/verify/EX-123");
    expect(cv.certifications[2].expiresDate).toBeNull();
  });

  it("can hide expired certifications and show courses by config", () => {
    const custom = buildCv(data, { ...cvConfig, expiredCertifications: "hide", showCourses: true });
    expect(custom.certifications.map((c) => c.id)).toEqual([
      "example-cloud-architect",
      "example-intro-course",
      "example-k8s-fundamentals",
      "example-undated-course",
    ]);
  });

  it("orders languages native first, then by level", () => {
    const languages = [
      { id: "french", name: "French", level: "B1" as const },
      { id: "english", name: "English", level: "B2" as const },
      { id: "spanish", name: "Spanish", level: "native" as const },
    ];
    const view = buildCv({ ...data, profile: { ...data.profile, languages } }, cvConfig);
    expect(view.languages.map((l) => l.name)).toEqual(["Spanish", "English", "French"]);
  });

  it("works when the API has no certifications or languages yet", () => {
    const older = { profile: data.profile.profile, summaries: [], education: [] } as unknown as CvData["profile"];
    const view = buildCv({ ...data, profile: older }, cvConfig);
    expect(view.certifications).toEqual([]);
    expect(view.languages).toEqual([]);
  });
});

describe("format", () => {
  it("formats certification dates", () => {
    expect(formatCertificationDates("2024-10", "2026-10", "en")).toBe("Oct 2024 – Oct 2026");
    expect(formatCertificationDates("2020-09", null, "en")).toBe("Sep 2020");
    expect(formatCertificationDates(null, "2026-10", "en")).toBe("Valid until Oct 2026");
    expect(formatCertificationDates(null, null, "en")).toBe("");
  });

  it("counts months inclusively", () => {
    expect(monthsBetween("2019-02", "2019-11")).toBe(10);
    expect(formatDuration("2017-06", "2018-12", "en")).toBe("1 yr 7 mos");
    expect(formatDuration("2017-06", "2018-12", "es")).toBe("1 año 7 meses");
  });
});
