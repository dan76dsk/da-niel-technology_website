import { getContentBySlug } from '@/lib/markdown';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function WriteupPage({ params }: Props) {
    const { slug } = await params;
    const writeup = getContentBySlug(slug, 'writeups');

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
