'use client';

import { useLanguage } from '@/contexts/LanguageContext';

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

  return (
    <main className="min-h-screen">
    <article className="max-w-3xl mx-auto px-6 py-16">
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
  );
}
