'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ReadingProgress from './ReadingProgress';
import { useCodeCopy } from '@/hooks/useCodeCopy';

type PostData = {
  data: any;
  content: string;
  slug: string;
};

type Props = {
  postEn: PostData;
  postPl: PostData;
};

export default function PostClient({ postEn, postPl }: Props) {
  const { language } = useLanguage();
  const post = language === 'pl' ? postPl : postEn;
  useCodeCopy();

  return (
    <>
    <ReadingProgress />
    <main className="min-h-screen">
    <article className="max-w-3xl mx-auto px-6 py-16">
    <Link
    href="/blog"
    className="inline-flex items-center gap-2 mb-8 text-xl text-terminal-muted hover:text-terminal-accent transition-colors"
    >
    <span className="text-terminal-accent">$</span> cd ..
    </Link>
    <div className="border-l-2 border-terminal-accent pl-6 mb-12">
    <h1 className="text-3xl font-semibold text-white mb-3">{post.data.title}</h1>
    <p className="text-xs text-terminal-muted">{post.data.date}</p>
    </div>
    <div
    className="prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: post.content }}
    />
    </article>
    </main>
    </>
  );
}
