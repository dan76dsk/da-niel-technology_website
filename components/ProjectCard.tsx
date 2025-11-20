import Link from 'next/link';

type Project = {
    slug: string;
    data: {
        title: string;
        excerpt: string;
        tech?: string[];
    };
};

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <Link
        href={`/projects/${project.slug}`}
        className="block group bg-terminal-bg-card border border-terminal-border rounded-md p-5 transition-all duration-300 hover:bg-terminal-bg-hover hover:border-terminal-accent"
        >
        <h3 className="text-lg font-medium mb-2 text-white group-hover:text-terminal-accent transition-colors">
        {project.data.title}
        </h3>
        <p className="text-terminal-muted text-sm leading-relaxed">
        {project.data.excerpt}
        </p>
        </Link>
    );
}
