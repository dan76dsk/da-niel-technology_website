'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  const text = {
    en: {
      title: '404 - Not Found',
      message: 'Could not find requested resource',
    },
    pl: {
      title: '404 - Nie znaleziono',
      message: 'Nie można znaleźć żądanego zasobu',
    },
  };

  const t = text[language];

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">{t.title}</h2>
        <p className="text-terminal-muted mb-8">{t.message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg text-terminal-muted hover:text-terminal-accent transition-colors"
        >
          <span className="text-terminal-accent">$</span> cd ~
        </Link>
      </div>
    </main>
  );
}
