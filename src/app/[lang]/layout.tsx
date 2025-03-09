import '../../styles/globals.scss';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/lib/getDictionary";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: unknown;
}) {
  // Assert that params has the expected shape.
  const { lang } = await Promise.resolve(params as { lang: string });
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header dictionary={dictionary} lang={lang} />
      <main>{children}</main>
      <Footer dictionary={dictionary} lang={lang} />
    </>
  );
}
