'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

export default function WhoamiPage() {
    const { language } = useLanguage();
    const t = (key: any) => getTranslation(language, key);

    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-terminal-accent pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">{t('whoamiTitle')}</h1>
        <p className="text-terminal-muted">{t('whoamiSubtitle')}</p>
        </div>

        <div className="space-y-8 text-terminal-text">
        {/* Bio */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiBio')}
        </h2>
        <p className="text-terminal-muted leading-relaxed mb-4">
        {t('heroTagline')}
        </p>
        <p className="text-terminal-muted leading-relaxed">
        {t('heroBio')}
        </p>
        </section>

        {/* Skills */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiSkills')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
        <div>
        <h3 className="text-sm font-medium text-white mb-2">{t('skillsSecurity')}</h3>
        <ul className="text-sm text-terminal-muted space-y-1">
        <li>• {t('securityPentest')}</li>
        <li>• {t('securityWebApp')}</li>
        <li>• {t('securityCTF')}</li>
        </ul>
        </div>
        <div>
        <h3 className="text-sm font-medium text-white mb-2">{t('skillsInfra')}</h3>
        <ul className="text-sm text-terminal-muted space-y-1">
        <li>• {t('infraProxmox')}</li>
        <li>• {t('infraLinux')}</li>
        <li>• {t('infraAutomation')}</li>
        </ul>
        </div>
        </div>
        </section>

        {/* Background */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiBackground')}
        </h2>
        <div className="space-y-3 text-sm text-terminal-muted">
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">{t('bgPolishUniversity')}</p>
        <p className="text-xs">{t('bgTelecom')}</p>
        </div>
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">{t('bg3DPrinting')}</p>
        <p className="text-xs">{t('bg3DPrintingDesc')}</p>
        </div>
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">{t('bgMotionCap')}</p>
        <p className="text-xs">{t('bgMotionCapDesc')}</p>
        </div>
        </div>
        </section>

        {/* Links */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiLinks')}
        </h2>
        <div className="flex gap-4 text-sm">
        <a
        href="https://github.com/dan76dsk"
        target="_blank"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        github
        </a>
        <a
        href="https://app.hackthebox.com/users/98349"
        target="_blank"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        hackthebox
        </a>
        <a
        href="mailto:d@niel.technology"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        d@niel.technology
        </a>
        </div>
        </section>
        </div>
        </div>
        </main>
    );
}
