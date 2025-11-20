'use client';

import { useLanguage } from '@/contexts/LanguageContext';

type WriteupData = {
  data: any;
  content: string;
  slug: string;
};

type Props = {
  writeupEn: WriteupData;
  writeupPl: WriteupData;
};

export default function WriteupClient({ writeupEn, writeupPl }: Props) {
  const { language } = useLanguage();
  const writeup = language === 'pl' ? writeupPl : writeupEn;

  return (
    <main className="min-h-screen">
    <article className="max-w-3xl mx-auto px-6 py-16">
    <div className="border-l-2 border-terminal-accent pl-6 mb-12">
    <h1 className="text-3xl font-semibold text-white mb-3">{writeup.data.title}</h1>
    <div className="flex gap-3 items-center text-xs text-terminal-muted">
    <span>{writeup.data.date}</span>
    {writeup.data.platform && (
        <>
        <span>•</span>
        <span>{writeup.data.platform}</span>
        </>
    )}
    {writeup.data.difficulty && (
        <>
        <span>•</span>
        <span>{writeup.data.difficulty}</span>
        </>
    )}
    </div>
    </div>
    <div
    className="prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: writeup.content }}
    />
    </article>
    </main>
  );
}
