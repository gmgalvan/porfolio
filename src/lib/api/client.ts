// Loads the CV data at build time from static JSON files in the repo:
// data/*.json (a cleaned snapshot of the career-vault API, see scripts/snapshot.mjs)
// or fixtures/*.json (fake data) when CV_DATA=fixtures.
// Server-only: never import this from a client component.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CvData, Project, ProfileBundle, Skill } from "./types";

const dataDir = () => (process.env.CV_DATA === "fixtures" ? "fixtures" : "data");

async function load(): Promise<CvData> {
  const dir = dataDir();
  const read = async <T>(name: string): Promise<T> => {
    const file = join(process.cwd(), dir, `${name}.json`);
    try {
      return JSON.parse(await readFile(file, "utf8")) as T;
    } catch (err) {
      throw new Error(
        `Cannot read ${dir}/${name}.json. Run \`npm run snapshot\` to create data/, ` +
          `or use CV_DATA=fixtures to build with example data. (${(err as Error).message})`,
      );
    }
  };
  const [profile, projects, skills] = await Promise.all([
    read<ProfileBundle>("profile"),
    read<Project[]>("projects"),
    read<Skill[]>("skills"),
  ]);
  return { profile: withCurrentStatus(profile), projects, skills };
}

/**
 * The snapshot stores the certification status computed on the day it was taken.
 * Recompute it for the build date with the API's rule: valid through the expiration month.
 */
function withCurrentStatus(bundle: ProfileBundle, today = new Date()): ProfileBundle {
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  return {
    ...bundle,
    certifications: bundle.certifications.map((c) => ({
      ...c,
      status: !c.expiresDate ? "no-expiry" : c.expiresDate < thisMonth ? "expired" : "active",
    })),
  };
}

let cached: Promise<CvData> | undefined;

// One read per build process: every page and SEO file reuses it.
// In `next dev` it reads on every request, so edits to data/ show on reload.
export function loadCvData(): Promise<CvData> {
  if (process.env.NODE_ENV === "development") return load();
  cached ??= load();
  return cached;
}
