'use client';

import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

type ContentData = {
  projectsEn: any[];
  projectsPl: any[];
  postsEn: any[];
  postsPl: any[];
};

export default function HomeClient({ data }: { data: ContentData }) {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  const projects = (language === 'pl' ? data.projectsPl : data.projectsEn).slice(0, 3);
  const posts = (language === 'pl' ? data.postsPl : data.postsEn).slice(0, 3);

  return (
    <main className="min-h-screen">
    {/* Hero */}
    <section className="max-w-3xl mx-auto px-6 py-24">
    <div className="border-l-2 border-terminal-accent pl-6">
    <h1 className="text-4xl font-semibold mb-6 text-white">
    {t('heroTitle')}
    </h1>
    <p className="text-xl text-terminal-muted mb-8 leading-relaxed">
    {t('heroTagline')}
    </p>
    <p className="text-terminal-muted leading-relaxed mb-8">
    {t('heroBio')}
    </p>

    <div className="flex gap-4 text-sm">
    <a
    href="https://github.com/dan76dsk"
    target="_blank"
    className="text-terminal-muted hover:text-white transition-colors"
    >
    github
    </a>
    <a
    href="https://app.hackthebox.com/users/98349"
    target="_blank"
    className="text-terminal-muted hover:text-white transition-colors"
    >
    hackthebox
    </a>
    <Link
    href="/writeups"
    className="text-terminal-muted hover:text-white transition-colors"
    >
    writeups
    </Link>
    <a
    href="mailto:d@niel.technology"
    className="text-terminal-muted hover:text-white transition-colors"
    >
    d@niel.technology
    </a>
    </div>
    </div>
    </section>

    {/* Projects */}
    <section className="max-w-3xl mx-auto px-6 py-16 border-t border-terminal-border">
    <h2 className="text-sm uppercase tracking-wider text-terminal-muted mb-8">
    {t('sectionProjects')}
    </h2>
    <div className="space-y-6">
    {projects.map(project => (
      <ProjectCard key={project.slug} project={project} />
    ))}
    </div>
    <Link
    href="/projects"
    className="inline-block mt-8 text-sm text-terminal-muted hover:text-white transition-colors"
    >
    {t('viewAll')} →
    </Link>
    </section>

    {/* Blog */}
    <section className="max-w-3xl mx-auto px-6 py-16 border-t border-terminal-border">
    <h2 className="text-sm uppercase tracking-wider text-terminal-muted mb-8">
    {t('sectionWriting')}
    </h2>
    <div className="space-y-6">
    {posts.map(post => (
      <BlogCard key={post.slug} post={post} />
    ))}
    </div>
    <Link
    href="/blog"
    className="inline-block mt-8 text-sm text-terminal-muted hover:text-white transition-colors"
    >
    {t('viewAll')} →
    </Link>
    </section>
    </main>
  );
}
