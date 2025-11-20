import { getContentBySlug } from '@/lib/markdown';
import PostClient from '@/components/PostClient';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const postEn = getContentBySlug(slug, 'posts', 'en');
    const postPl = getContentBySlug(slug, 'posts', 'pl');

    return <PostClient postEn={postEn} postPl={postPl} />;
}
