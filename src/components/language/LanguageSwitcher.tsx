"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define supported locales
const supportedLocales = ['en', 'es'];

type LanguageSwitcherProps = {
  currentLang: string;
};

const LanguageSwitcher = ({ currentLang }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get the path without the language prefix
  const getPathWithoutLang = () => {
    // Split the pathname by "/"
    const pathSegments = pathname.split("/");
    
    // Remove the language segment (index 1)
    if (pathSegments.length > 1 && supportedLocales.includes(pathSegments[1])) {
      pathSegments.splice(1, 1);
    }
    
    // Join the segments back together
    return pathSegments.join("/") || "/";
  };

  // Create path for the selected language
  const createLangPath = (lang: string) => {
    const pathWithoutLang = getPathWithoutLang();
    return `/${lang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
  };

  // Get language label
  const getLanguageLabel = (code: string) => {
    const languages = {
      en: "English",
      es: "Español"
    };
    return languages[code as keyof typeof languages] || code;
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span>{getLanguageLabel(currentLang)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-1">
            {supportedLocales
              .filter((lang) => lang !== currentLang)
              .map((lang) => (
                <Link
                  key={lang}
                  href={createLangPath(lang)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  {getLanguageLabel(lang)}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;