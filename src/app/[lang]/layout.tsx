import '../../styles/globals.scss';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

export default async function RootLayout(props: { children: React.ReactNode; params: { lang: string } }) {
  // Await the params object to satisfy Next.js requirements
  const resolvedParams = await Promise.resolve(props.params);
  const lang = resolvedParams.lang;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <Header dictionary={dictionary} lang={lang} />
        <main>{props.children}</main>
        <Footer dictionary={dictionary} lang={lang} />
      </body>
    </html>
  );
}
