import React, { createContext, useContext, useEffect, useState } from 'react';
import { CONTENT, type Content, type Lang } from './data/content';

const KEY = 'invite-lang';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'hi', setLang: () => {} });

const initialLang = (): Lang => {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'hi'; // Hindi is the default
  } catch {
    return 'hi';
  }
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // drives the Hindi typography rules in index.css (html[lang="hi"] …)
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);

/** The invitation text in the current language. */
export const useContent = (): Content => CONTENT[useLang().lang];
