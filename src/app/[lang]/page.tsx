import { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import Hero from "@/components/sections/Hero";
//import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
//import Contact from "@/components/sections/Contact";
import Certifications from "@/components/sections/Certifications";

// Dynamic metadata generation
export async function generateMetadata(
  props: { params: { lang: string } }
): Promise<Metadata> {
  // Cast props.params to ensure it has the expected shape
  const resolvedParams = await Promise.resolve(
    props.params as unknown as { lang: string }
  );
  const lang = resolvedParams.lang;

  return {
    title:
      lang === "es"
        ? "Guillermo Galvan | Ingeniero de Software Senior"
        : "Guillermo Galvan | Senior Software Engineer",
    description:
      lang === "es"
        ? "Ingeniero de Software Senior especializado en Go, Python y Arquitectura en la Nube con experiencia en sistemas distribuidos y prácticas DevOps."
        : "Senior Software Engineer specializing in Go, Python, and Cloud Architecture with experience in distributed systems and DevOps practices.",
  };
}

export default async function Home(
  props: { params: { lang: string } }
) {
  // Cast props.params as above to satisfy TypeScript.
  const resolvedParams = await Promise.resolve(
    props.params as unknown as { lang: string }
  );
  const lang = resolvedParams.lang;
  const dictionary = await getDictionary(lang);

  return (
    <div className="space-y-24">
      <Hero dictionary={dictionary} lang={lang} />
      {/* <About dictionary={dictionary} lang={lang} /> */}
      <Skills dictionary={dictionary} lang={lang} />
      <Experience dictionary={dictionary} lang={lang} />
      {/* <Contact dictionary={dictionary} lang={lang} /> */}
      <Certifications dictionary={dictionary} lang={lang} />
    </div>
  );
}
