import { getContentBySlug } from '@/lib/markdown';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getContentBySlug(slug, 'posts');

    return (
        <main className="min-h-screen">
        <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-[#00d9ff] pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">{post.data.title}</h1>
        <p className="text-xs text-[#6b7280]">{post.data.date}</p>
        </div>
        <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
        />
        </article>
        </main>
    );
}
