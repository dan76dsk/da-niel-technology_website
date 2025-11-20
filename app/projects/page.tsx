import { getAllContent } from '@/lib/markdown';
import Link from 'next/link';

export default function ProjectsPage() {
    const projects = getAllContent('projects');

    return (
        <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-8">&gt; ls projects</h1>
        <div className="space-y-4">
        {projects.map(project => (
            <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block border border-green-500 p-4 hover:bg-green-500/10"
            >
            <h2 className="text-2xl mb-2">{project.data.title}</h2>
            <p className="mt-2">{project.data.excerpt}</p>
            </Link>
        ))}
        </div>
        </div>
        </main>
    );
}
