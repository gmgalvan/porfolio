// Downloads the CV from the career-vault API (SigV4-signed, your AWS credentials)
// and writes a CLEANED copy to data/*.json, which the static site reads at build time.
//
//   CV_API_URL=https://... npm run snapshot
//
// This repo is public, so the snapshot never contains:
// - real names of confidential employers/customers (replaced by their alias),
// - the phone number,
// - fields the site does not use (self ratings, private notes...): only known fields are kept.
// It stops without writing anything if a confidential real name still appears anywhere
// in the output (for example inside a project description).

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Sha256 } from "@aws-crypto/sha256-js";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";

const baseUrl = process.env.CV_API_URL;
if (!baseUrl) {
  console.error("Set CV_API_URL (terraform -chdir=infra output -raw api_endpoint in the career-vault repo).");
  process.exit(1);
}
const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";

async function signedGet(path) {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  const signer = new SignatureV4({
    service: "execute-api",
    region,
    credentials: fromNodeProviderChain(),
    sha256: Sha256,
  });
  const request = new HttpRequest({
    method: "GET",
    protocol: url.protocol,
    hostname: url.hostname,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers: { host: url.hostname, accept: "application/json" },
  });
  const signed = await signer.sign(request);
  const res = await fetch(url, { headers: signed.headers });
  if (!res.ok) throw new Error(`GET ${url.pathname} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Copies only the listed keys that are present. */
const pick = (obj, keys) =>
  obj == null ? obj : Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

const confidentialNames = new Set();

function cleanParty(party) {
  if (!party) return party;
  if (!party.confidential) return pick(party, ["name", "alias", "confidential"]);
  confidentialNames.add(party.name);
  const alias = party.alias?.trim() || null;
  // The site shows the alias for confidential parties; `name` only keeps the alias too.
  return { name: alias ?? "", alias, confidential: true };
}

function cleanProfile(bundle) {
  const p = bundle.profile;
  return {
    profile: p && {
      name: p.name,
      title: p.title,
      contact: p.contact && {
        ...pick(p.contact, ["email", "location"]), // no phone
        links: pick(p.contact.links ?? {}, ["linkedin", "github", "website"]),
      },
    },
    summaries: bundle.summaries.map((s) => pick(s, ["focus", "text"])),
    education: bundle.education.map((e) => pick(e, ["id", "degree", "institution", "year"])),
    certifications: bundle.certifications.map((c) =>
      pick(c, ["id", "name", "kind", "issuer", "issuedDate", "expiresDate", "credentialId", "credentialUrl", "skills", "status"]),
    ),
    languages: bundle.languages.map((l) => pick(l, ["id", "name", "level"])), // no notes
  };
}

// API project IDs can contain customer names ("softserve-zenoss") and the ID reaches the HTML,
// so each project gets a neutral ID from its start date instead.
const usedIds = new Set();
function neutralId(p) {
  const base = `project-${p.startDate}`;
  let id = base;
  for (let n = 2; usedIds.has(id); n++) id = `${base}-${n}`;
  usedIds.add(id);
  return id;
}

const cleanProject = (p) => ({
  id: neutralId(p),
  ...pick(p, [
    "headline", "startDate", "endDate", "role", "teamSize",
    "projectDescription", "responsibilities", "results", "tools", "practices",
  ]),
  employer: cleanParty(p.employer),
  customer: cleanParty(p.customer),
});

const cleanSkill = (s) =>
  pick(s, [
    "id", "name", "kind", "categories", "parent", "aliases",
    "lastUsed", "currentlyUsed", "freshness", "yearsOfExperience",
  ]);

const [profile, projects, skills] = await Promise.all([
  signedGet("profile"),
  signedGet("projects"),
  signedGet("skills"),
]);

const sortedProjects = [...projects].sort((a, b) => a.startDate.localeCompare(b.startDate));
const out = {
  profile: cleanProfile(profile),
  projects: sortedProjects.map(cleanProject),
  skills: skills.map(cleanSkill),
};

// Safety net: no confidential real name may survive anywhere (IDs, descriptions, bullets, aliases...).
const leaks = [];
function findLeaks(value, path) {
  if (typeof value === "string") {
    const text = value.toLowerCase();
    for (const name of confidentialNames) {
      if (name && text.includes(name.toLowerCase())) leaks.push(`"${name}" at ${path}: ${value.slice(0, 120)}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => findLeaks(v, `${path}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      findLeaks(k, `${path} (key)`);
      findLeaks(v, `${path}.${k}`);
    }
  }
}
for (const [file, data] of Object.entries(out)) findLeaks(data, file);
if (leaks.length) {
  console.error("Nothing written. Confidential names found in the cleaned data:");
  for (const l of leaks) console.error(`  - ${l}`);
  console.error("Fix the text in the API (or the alias), then run the snapshot again.");
  process.exit(1);
}

const dir = join(process.cwd(), "data");
await mkdir(dir, { recursive: true });
for (const [file, data] of Object.entries(out)) {
  await writeFile(join(dir, `${file}.json`), `${JSON.stringify(data, null, 2)}\n`);
}
console.log(
  `Wrote data/: ${out.projects.length} projects, ${out.skills.length} skills, ` +
    `${out.profile.certifications.length} certifications. Masked ${confidentialNames.size} confidential names.`,
);
