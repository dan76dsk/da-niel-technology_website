'use client';

import { getAllContent } from '@/lib/markdown';
import BlogCard from '@/components/BlogCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';

export default function BlogPage() {
    const { language } = useLanguage();
    const t = (key: any) => getTranslation(language, key);
    const posts = getAllContent('posts', language);

    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-terminal-accent pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">{t('blogTitle')}</h1>
        <p className="text-terminal-muted">{t('blogSubtitle')}</p>
        </div>

        <div className="space-y-6">
        {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
        ))}
        </div>
        </div>
        </main>
    );
}
