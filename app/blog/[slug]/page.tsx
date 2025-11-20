import { getContentBySlug } from '@/lib/markdown';
import { generateArticleMetadata } from '@/lib/metadata';
import { generateArticleSchema } from '@/lib/structured-data';
import PostClient from '@/components/PostClient';
import StructuredData from '@/components/StructuredData';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getContentBySlug(slug, 'posts', 'en');

    return generateArticleMetadata(
        post.data.title,
        post.data.excerpt || '',
        post.data.date,
        slug,
        'blog',
        'en'
    );
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const postEn = getContentBySlug(slug, 'posts', 'en');
    const postPl = getContentBySlug(slug, 'posts', 'pl');

    const schema = generateArticleSchema(
        postEn.data.title,
        postEn.data.excerpt || '',
        postEn.data.date,
        slug,
        'blog'
    );

    return (
        <>
            <StructuredData data={schema} />
            <PostClient postEn={postEn} postPl={postPl} />
        </>
    );
}
