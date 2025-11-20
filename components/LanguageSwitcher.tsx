'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-terminal-bg-card border border-terminal-border rounded-md overflow-hidden">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          language === 'en'
            ? 'bg-terminal-accent text-terminal-bg'
            : 'text-terminal-muted hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pl')}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          language === 'pl'
            ? 'bg-terminal-accent text-terminal-bg'
            : 'text-terminal-muted hover:text-white'
        }`}
      >
        PL
      </button>
    </div>
  );
}
