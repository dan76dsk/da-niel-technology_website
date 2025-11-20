'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const { language } = useLanguage();
    const t = (key: any) => getTranslation(language, key);

    return (
        <nav className="border-b border-terminal-border bg-terminal-bg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium text-white hover:text-terminal-accent transition-colors">
        <span className="text-terminal-muted">d@niel.technology</span><span className="text-white">:~$</span>
        </Link>
        <div className="flex gap-6 items-center text-sm">
        <Link href="/projects" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        {t('projects')}
        </Link>
        <Link href="/blog" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        {t('blog')}
        </Link>
        <Link href="/whoami" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        <span className="text-terminal-accent">&gt;</span> {t('whoami')}
        </Link>
        <LanguageSwitcher />
        </div>
        </div>
        </nav>
    );
}
