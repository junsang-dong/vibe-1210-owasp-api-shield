import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

export default function SettingsMenu() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const menuRef = useRef(null);

  useEffect(() => {
    // 테마에 따라 HTML 클래스 추가/제거
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors bg-white/20 hover:bg-white/30 text-white"
        aria-label={getTranslation(language, 'settings.title')}
        title={getTranslation(language, 'settings.title')}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-adaptive-surface border border-adaptive-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            {/* 디자인 테마 */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-adaptive-text mb-2 px-2">
                {getTranslation(language, 'settings.designTheme')}
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    theme === 'light'
                      ? 'bg-adaptive-primary text-white'
                      : 'text-adaptive-text hover:bg-adaptive-surface/80'
                  }`}
                >
                  {getTranslation(language, 'settings.light')}
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-adaptive-primary text-white'
                      : 'text-adaptive-text hover:bg-adaptive-surface/80'
                  }`}
                >
                  {getTranslation(language, 'settings.dark')}
                </button>
              </div>
            </div>

            {/* 언어 */}
            <div>
              <label className="block text-sm font-semibold text-adaptive-text mb-2 px-2">
                {getTranslation(language, 'settings.language')}
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setLanguage('ko');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    language === 'ko'
                      ? 'bg-adaptive-primary text-white'
                      : 'text-adaptive-text hover:bg-adaptive-surface/80'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    language === 'en'
                      ? 'bg-adaptive-primary text-white'
                      : 'text-adaptive-text hover:bg-adaptive-surface/80'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('ja');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    language === 'ja'
                      ? 'bg-adaptive-primary text-white'
                      : 'text-adaptive-text hover:bg-adaptive-surface/80'
                  }`}
                >
                  日本語
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

