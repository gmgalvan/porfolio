import { content, profile } from "@/content";
import { cvMarkdown, pageUrl } from "@/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${profile.name} — CV

Source: ${pageUrl("en")} (English) · ${pageUrl("es")} (Español)

---

# English

**${content.en.role}** · ${content.en.location}

${content.en.intro.join("\n\n")}

${cvMarkdown("en")}

---

# Español

**${content.es.role}** · ${content.es.location}

${content.es.intro.join("\n\n")}

${cvMarkdown("es")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
