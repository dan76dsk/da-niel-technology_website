import { getAllContent } from '@/lib/markdown';
import { generateMetadata as genMeta } from '@/lib/metadata';
import BlogClient from '@/components/BlogClient';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return genMeta('blog', 'en');
}

export default function BlogPage() {
    const postsEn = getAllContent('posts', 'en');
    const postsPl = getAllContent('posts', 'pl');

    return <BlogClient postsEn={postsEn} postsPl={postsPl} />;
}
