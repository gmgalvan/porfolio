import type { MetadataRoute } from "next";
import { getCv, metaDescription } from "@/site";

export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cv = await getCv();
  return {
    name: `${cv.name} — ${cv.title}`,
    short_name: cv.name,
    description: metaDescription(cv),
    start_url: "/",
    display: "browser",
    background_color: "#e9e6e1",
    theme_color: "#e9e6e1",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
