import type { MetadataRoute } from "next";
import { content, profile } from "@/content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${content.en.role}`,
    short_name: profile.name,
    description: content.en.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#e9e6e1",
    theme_color: "#e9e6e1",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
