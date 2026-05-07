import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en';
import tn from '../locales/tn';

type Language = 'en' | 'tn';

type TranslationKeys = keyof typeof en;
type NestedTranslationValues<T extends TranslationKeys> = typeof en[T];

type Translations = {
  [K in TranslationKeys]: NestedTranslationValues<K>;
};

const translations: Record<Language, typeof en> = { en, tn };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [t, setT] = useState<typeof en>(en);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem('app_language');
        if (saved === 'tn') {
          setLanguageState('tn');
          setT(tn);
        } else {
          setLanguageState('en');
          setT(en);
        }
      } catch (err) {
        console.error('Failed to load language:', err);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      setT(translations[lang]);
      await AsyncStorage.setItem('app_language', lang);
    } catch (err) {
      console.error('Failed to save language:', err);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
