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
        <div className="text-terminal-muted leading-relaxed whitespace-pre-line">
        {t('bioPara1')}
        </div>
        </section>

        {/* Mindset & Approach */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiMindset')}
        </h2>
        <ul className="space-y-3 text-terminal-muted leading-relaxed">
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara1')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara2')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara3')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara4')}</span></li>
        </ul>
        </section>

        {/* Skills */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiSkills')}
        </h2>
        <div className="space-y-3 text-sm text-terminal-muted">
        {/* DevSecOps & Automation */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsDevSecOps')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('devsecops1')}</li>
        <li>• {t('devsecops2')}</li>
        <li>• {t('devsecops3')}</li>
        <li>• {t('devsecops4')}</li>
        </ul>
        </div>

        {/* IT Security */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsSecurity')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('security1')}</li>
        <li>• {t('security2')}</li>
        </ul>
        </div>

        {/* Development */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsDev')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('dev1')}</li>
        <li>• {t('dev2')}</li>
        <li>• {t('dev3')}</li>
        </ul>
        </div>

        {/* Networks & Systems */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsNetwork')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('network1')}</li>
        <li>• {t('network2')}</li>
        </ul>
        </div>

        {/* Cross-domain / Innovation */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsCross')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('cross1')}</li>
        <li>• {t('cross2')}</li>
        <li>• {t('cross3')}</li>
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
        {/* Geometry Hustlers */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('bg1Title')}</p>
        <p className="text-xs leading-relaxed">{t('bg1Desc')}</p>
        </div>

        {/* Motion Capture */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('bg2Title')}</p>
        <p className="text-xs leading-relaxed">{t('bg2Desc')}</p>
        </div>

        {/* University */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">{t('bg3Title')}</p>
        <p className="text-xs">{t('bg3Desc')}</p>
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
        href="https://www.linkedin.com/in/daniel-litwin/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        linkedin
        </a>
        <a
        href="https://app.hackthebox.com/users/98349"
        target="_blank"
        rel="noopener noreferrer"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        hackthebox
        </a>
        <a
        href="https://github.com/dan76dsk"
        target="_blank"
        rel="noopener noreferrer"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        github
        </a>
        </div>
        </section>

        {/* Contact */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiContact')}
        </h2>
        <div className="text-sm">
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
