import 'server-only';

export type Dictionary = {
  navigation: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    content: string[];
  };
  skills: {
    title: string;
    subtitle: string;
    categories: {
      languages: string;
      frontend: string;
      backend: string;
      devops: string;
      cloud: string;
      databases: string;
      bigdata: string;
      frameworks: string;
    };
  };
  experience: {
    title: string;
    subtitle: string;
    viewAll: string;
    roles: {
      title: string;
      company: string;
      period: string;
      location: string;
    }[];
  };
  projects: {
    title: string;
    subtitle: string;
    viewProject: string;
  };
  education: {
    title: string;
    degree: string;
    institution: string;
    period: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
    };
    success: string;
    error: string;
  };
};

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Use the specified locale or fallback to English if not supported
  const dictionary = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  return dictionary();
};