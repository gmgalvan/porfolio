import { cvMarkdown, getCv, pageUrl } from "@/site";

export const dynamic = "force-static";

export async function GET() {
  const cv = await getCv();
  const body = `# ${cv.name} — CV

Source: ${pageUrl("en")} (English) · ${pageUrl("es")} (Español)

**${cv.title}**${cv.location ? ` · ${cv.location}` : ""}

${cv.intro.join("\n\n")}

${cvMarkdown(cv, "en")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
