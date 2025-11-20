import { getContentBySlug } from '@/lib/markdown';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getContentBySlug(slug, 'projects');

    return (
        <main className="min-h-screen p-8">
        <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-4">{project.data.title}</h1>
        <div
        className="prose prose-invert prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: project.content }}
        />
        </article>
        </main>
    );
}
