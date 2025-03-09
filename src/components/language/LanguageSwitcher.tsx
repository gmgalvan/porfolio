"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const languages = {
  en: { label: "", icon: "/icons/en.svg" },
  es: { label: "", icon: "/icons/es.svg" },
};

type LanguageSwitcherProps = {
  currentLang: "en" | "es";
};

const LanguageSwitcher = ({ currentLang }: LanguageSwitcherProps) => {
  const pathname = usePathname();

  const otherLang = currentLang === "en" ? "es" : "en";

  const getPathWithoutLang = () => {
    const pathSegments = pathname.split("/");
    if (pathSegments.length > 1 && ["en", "es"].includes(pathSegments[1])) {
      pathSegments.splice(1, 1);
    }
    return pathSegments.join("/") || "/";
  };

  const createLangPath = (lang: string) => {
    const pathWithoutLang = getPathWithoutLang();
    return `/${lang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
  };

  const otherLangData = languages[otherLang];

  return (
    <Link
      href={createLangPath(otherLang)}
      className="flex items-center gap-2 px-3 py-2 rounded-md 
                 text-gray-700 dark:text-gray-300 
                 hover:text-blue-600 dark:hover:text-blue-400
                 transition-colors duration-200"
    >
      <Image
        src={otherLangData.icon}
        alt={otherLangData.label}
        width={20}
        height={20}
      />
      <span>{otherLangData.label}</span>
    </Link>
  );
};

export default LanguageSwitcher;
