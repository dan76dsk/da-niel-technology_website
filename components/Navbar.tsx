'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const { language } = useLanguage();
    const t = (key: any) => getTranslation(language, key);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="border-b border-terminal-border bg-terminal-bg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium text-white hover:text-terminal-accent transition-colors">
        <span className="text-terminal-muted">d@niel.technology</span><span className="text-white">:~$</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center text-sm">
        <Link href="/projects" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        {t('projects')}
        </Link>
        <Link href="/writeups" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        {t('writeups')}
        </Link>
        <Link href="/blog" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        {t('blog')}
        </Link>
        <Link href="/whoami" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        <span className="text-terminal-accent">&gt;</span> {t('whoami')}
        </Link>
        <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-terminal-muted hover:text-terminal-accent transition-colors p-2"
        aria-label="Toggle menu"
        >
        <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        >
        {mobileMenuOpen ? (
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
            />
        ) : (
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
            />
        )}
        </svg>
        </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden border-t border-terminal-border">
            <div className="px-6 py-4 space-y-3">
            <Link
            href="/projects"
            className="block text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-2 rounded-md hover:bg-terminal-bg-card"
            onClick={() => setMobileMenuOpen(false)}
            >
            {t('projects')}
            </Link>
            <Link
            href="/writeups"
            className="block text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-2 rounded-md hover:bg-terminal-bg-card"
            onClick={() => setMobileMenuOpen(false)}
            >
            {t('writeups')}
            </Link>
            <Link
            href="/blog"
            className="block text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-2 rounded-md hover:bg-terminal-bg-card"
            onClick={() => setMobileMenuOpen(false)}
            >
            {t('blog')}
            </Link>
            <Link
            href="/whoami"
            className="block text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-2 rounded-md hover:bg-terminal-bg-card"
            onClick={() => setMobileMenuOpen(false)}
            >
            <span className="text-terminal-accent">&gt;</span> {t('whoami')}
            </Link>
            <div className="pt-3 border-t border-terminal-border flex justify-start">
            <LanguageSwitcher />
            </div>
            </div>
            </div>
        )}
        </nav>
    );
}
