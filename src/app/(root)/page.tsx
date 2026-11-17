import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV",
  robots: { index: false },
};

const pickLanguage = `
  var l = (navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  location.replace("/" + l + "/");
`;

export default function RootRedirect() {
  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
      <p className="page" style={{ textAlign: "center" }}>
        <Link href="/en/">English</Link> · <Link href="/es/">Español</Link>
      </p>
    </>
  );
}
