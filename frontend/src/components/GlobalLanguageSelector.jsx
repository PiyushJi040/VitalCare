
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const GlobalLanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2">
        <Globe className="h-4 w-4 text-gray-300" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              i18n.language === lang.code
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalLanguageSelector;