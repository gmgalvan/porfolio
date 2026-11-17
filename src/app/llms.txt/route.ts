import { cvMarkdown, getCv, metaDescription, pageUrl, siteUrl } from "@/site";

export const dynamic = "force-static";

// https://llmstxt.org — a concise, machine-readable summary for AI agents.
export async function GET() {
  const cv = await getCv();
  const body = `# ${cv.name}

> ${cv.title}. ${metaDescription(cv)}

${cv.intro.join("\n\n")}

## Pages

- [CV (English)](${pageUrl("en")}): Full CV — experience, technologies and education.
- [CV (Español)](${pageUrl("es")}): CV completo en español.
- [Full text for LLMs](${siteUrl}/llms-full.txt): The complete CV in Markdown.

## Profiles

${cv.links.map((l) => `- [${l.label}](${l.href})`).join("\n")}

${cvMarkdown(cv, "en")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
