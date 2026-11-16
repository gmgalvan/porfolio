import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { content, isLocale, locales, profile } from "@/content";
import { pageUrl, siteUrl } from "@/site";
import "../globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"] });

type Params = { params: Promise<{ lang: string }> };

// Only /en and /es exist; everything is pre-rendered at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = content[lang];

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: profile.name, url: pageUrl(lang) }],
    creator: profile.name,
    alternates: {
      canonical: `/${lang}/`,
      languages: { en: "/en/", es: "/es/", "x-default": "/en/" },
      types: { "text/plain": "/llms.txt" },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${lang}/`,
      siteName: profile.name,
      type: "profile",
      firstName: "Guillermo",
      lastName: "Galvan",
      locale: lang === "es" ? "es_MX" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@memo_dll",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9e6e1" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0c" },
  ],
};

export default async function LangLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
