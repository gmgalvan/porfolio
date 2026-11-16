import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { content, isLocale, locales, profile } from "@/content";

// Social preview card (LinkedIn, X, WhatsApp, Slack…) rendered at build time.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — Senior Software Engineer`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = content[isLocale(lang) ? lang : "en"];
  const photo = await readFile(join(process.cwd(), "public", profile.photo));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#e9e6e1",
          padding: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#fffefb",
            borderRadius: 6,
            padding: "64px 72px",
            boxShadow: "0 20px 50px rgba(60,50,40,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <img
              src={photoSrc}
              width={132}
              height={132}
              alt=""
              style={{ borderRadius: 999, filter: "grayscale(1)" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 68, color: "#1f1d1a", letterSpacing: -2 }}>{profile.name}</div>
              <div style={{ fontSize: 32, color: "#77716a", marginTop: 6 }}>{t.role}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ height: 3, background: "#1f1d1a", display: "flex" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#77716a" }}>
              <span>Go · Python · Kubernetes · AWS · GCP</span>
              <span>{t.location}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
