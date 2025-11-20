import { getContentBySlug } from '@/lib/markdown';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getContentBySlug(slug, 'posts');

    return (
        <main className="min-h-screen p-8">
        <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-4">{post.data.title}</h1>
        <p className="text-green-500/70 mb-8">{post.data.date}</p>
        <div
        className="prose prose-invert prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
        />
        </article>
        </main>
    );
}
