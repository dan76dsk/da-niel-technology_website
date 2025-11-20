import { getContentBySlug } from '@/lib/markdown';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getContentBySlug(slug, 'projects');

    return (
        <main className="min-h-screen">
        <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-terminal-accent pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-4">{project.data.title}</h1>
        {project.data.tech && (
            <div className="flex gap-2 flex-wrap">
            {project.data.tech.map((tech: string) => (
                <span key={tech} className="text-xs text-terminal-muted bg-terminal-bg-card px-3 py-1 rounded-md border border-terminal-border">
                {tech}
                </span>
            ))}
            </div>
        )}
        </div>
        <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: project.content }}
        />
        </article>
        </main>
    );
}
