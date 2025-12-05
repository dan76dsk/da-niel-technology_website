'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

export default function WhoamiContent() {
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
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara5')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara6')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara7')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('mindsetPara8')}</span></li>
        </ul>
        </section>

        {/* Skills */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> {t('whoamiSkills')}
        </h2>
        <div className="space-y-3 text-sm text-terminal-muted">
        {/* IT Solutions Architecture */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsArchitecture')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('architecture1')}</li>
        <li>• {t('architecture2')}</li>
        <li>• {t('architecture3')}</li>
        </ul>
        </div>

        {/* Innovation & R&D */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsInnovation')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('innovation1')}</li>
        <li>• {t('innovation2')}</li>
        <li>• {t('innovation3')}</li>
        </ul>
        </div>

        {/* DevOps */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsDevOps')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('devops1')}</li>
        <li>• {t('devops2')}</li>
        <li>• {t('devops3')}</li>
        </ul>
        </div>

        {/* Cybersecurity */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsSecurity')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('security1')}</li>
        <li>• {t('security2')}</li>
        <li>• {t('security3')}</li>
        <li>• {t('security4')}</li>
        <li>• {t('security5')}</li>
        </ul>
        </div>

        {/* Automation & Business Process Tools */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsAutomation')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('automation1')}</li>
        <li>• {t('automation2')}</li>
        <li>• {t('automation3')}</li>
        <li>• {t('automation4')}</li>
        <li>• {t('automation5')}</li>
        </ul>
        </div>

        {/* Development & Programming */}
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-2">{t('skillsDev')}</p>
        <ul className="text-xs space-y-1">
        <li>• {t('dev1')}</li>
        <li>• {t('dev2')}</li>
        <li>• {t('dev3')}</li>
        <li>• {t('dev4')}</li>
        </ul>
        </div>
        </div>
        </section>

{/* Background */}
<section>
  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <span className="text-terminal-accent">&gt;</span> {t('whoamiBackground')}
  </h2>
  <div className="space-y-4 text-sm text-terminal-muted">
    {/* Geometry Hustlers */}
    <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
      <p className="font-medium text-white mb-2">{t('bg1Title')}</p>
      <p className="text-xs leading-relaxed mb-3">{t('bg1Desc')}</p>
      <ul className="text-xs space-y-1.5 ml-2">
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg1Point1')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg1Point2')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg1Point3')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg1Point4')}</span></li>
      </ul>
    </div>

    {/* Motion Capture */}
    <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
      <p className="font-medium text-white mb-2">{t('bg2Title')}</p>
      <p className="text-xs leading-relaxed mb-3">{t('bg2Desc')}</p>
      <ul className="text-xs space-y-1.5 ml-2">
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg2Point1')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg2Point2')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg2Point3')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg2Point4')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg2Point5')}</span></li>
      </ul>
    </div>

    {/* University */}
    <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
      <p className="font-medium text-white mb-2">{t('bg3Title')}</p>
      <p className="text-xs leading-relaxed mb-3">{t('bg3Desc')}</p>
      <ul className="text-xs space-y-1.5 ml-2">
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg3Point1')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg3Point2')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg3Point3')}</span></li>
        <li className="flex gap-2"><span className="text-terminal-accent">•</span><span>{t('bg3Point4')}</span></li>
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