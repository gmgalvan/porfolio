import { content, profile } from "@/content";
import { cvMarkdown, pageUrl, siteUrl } from "@/site";

export const dynamic = "force-static";

// https://llmstxt.org — a concise, machine-readable summary for AI agents.
export function GET() {
  const t = content.en;
  const body = `# ${profile.name}

> ${t.meta.description} Based in Mexico, working remotely with teams in the US and Latin America.

${t.intro.join("\n\n")}

- Email: ${profile.email}

## Pages

- [Portfolio (English)](${pageUrl("en")}): Full CV — experience, skills, certifications and education.
- [Portafolio (Español)](${pageUrl("es")}): CV completo en español.
- [Full text for LLMs](${siteUrl}/llms-full.txt): The complete CV in Markdown, English and Spanish.

## Profiles

${profile.links.map((l) => `- [${l.label}](${l.href})`).join("\n")}

${cvMarkdown("en")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
