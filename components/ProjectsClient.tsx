'use client';

import ProjectCard from '@/components/ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

type Props = {
  projectsEn: any[];
  projectsPl: any[];
};

export default function ProjectsClient({ projectsEn, projectsPl }: Props) {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);
  const projects = language === 'pl' ? projectsPl : projectsEn;

  return (
    <main className="min-h-screen">
    <div className="max-w-3xl mx-auto px-6 py-16">
    <div className="border-l-2 border-terminal-accent pl-6 mb-12">
    <h1 className="text-3xl font-semibold text-white mb-3">{t('projectsTitle')}</h1>
    <p className="text-terminal-muted">{t('projectsSubtitle')}</p>
    </div>

    <div className="space-y-6">
    {projects.map(project => (
        <ProjectCard key={project.slug} project={project} />
    ))}
    </div>
    </div>
    </main>
  );
}
