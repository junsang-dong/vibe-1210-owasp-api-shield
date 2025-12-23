import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ko';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // 언어 변경 이벤트 발생 (다른 컴포넌트에서 구독 가능)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

