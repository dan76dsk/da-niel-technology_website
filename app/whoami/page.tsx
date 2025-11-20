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
        <div className="space-y-4 text-terminal-muted leading-relaxed">
        <p>{t('bioPara1')}</p>
        <p>{t('bioPara2')}</p>
        <p>{t('bioPara3')}</p>
        <p>{t('bioPara4')}</p>
        </div>
        </section>

        {/* Mindset & Approach */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiMindset')}
        </h2>
        <div className="space-y-4 text-terminal-muted leading-relaxed">
        <p>{t('mindsetPara1')}</p>
        <p>{t('mindsetPara2')}</p>
        <p>{t('mindsetPara3')}</p>
        </div>
        </section>

        {/* Skills */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiSkills')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security */}
        <div>
        <h3 className="text-sm font-medium text-white mb-3">{t('skillsSecurity')}</h3>
        <ul className="text-sm text-terminal-muted space-y-2">
        <li>• {t('security1')}</li>
        <li>• {t('security2')}</li>
        <li>• {t('security3')}</li>
        <li>• {t('security4')}</li>
        </ul>
        </div>

        {/* Infrastructure */}
        <div>
        <h3 className="text-sm font-medium text-white mb-3">{t('skillsInfra')}</h3>
        <ul className="text-sm text-terminal-muted space-y-2">
        <li>• {t('infra1')}</li>
        <li>• {t('infra2')}</li>
        <li>• {t('infra3')}</li>
        <li>• {t('infra4')}</li>
        </ul>
        </div>

        {/* Development */}
        <div>
        <h3 className="text-sm font-medium text-white mb-3">{t('skillsDev')}</h3>
        <ul className="text-sm text-terminal-muted space-y-2">
        <li>• {t('dev1')}</li>
        <li>• {t('dev2')}</li>
        <li>• {t('dev3')}</li>
        <li>• {t('dev4')}</li>
        <li>• {t('dev5')}</li>
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
        {/* University */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">{t('bg1Title')}</p>
        <p className="text-xs">{t('bg1Desc')}</p>
        </div>

        {/* Geometry Hustlers */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('bg2Title')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('bg2Item1')}</li>
        <li>• {t('bg2Item2')}</li>
        <li>• {t('bg2Item3')}</li>
        </ul>
        </div>

        {/* Motion Capture */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('bg3Title')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('bg3Item1')}</li>
        <li>• {t('bg3Item2')}</li>
        <li>• {t('bg3Item3')}</li>
        <li>• {t('bg3Item4')}</li>
        </ul>
        </div>

        {/* Cross-domain */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('bg4Title')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('bg4Item1')}</li>
        <li>• {t('bg4Item2')}</li>
        <li>• {t('bg4Item3')}</li>
        </ul>
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
        rel="noopener noreferrer"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        github
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
