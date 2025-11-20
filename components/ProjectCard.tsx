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
        <h3 className="text-lg font-medium text-white group-hover:text-terminal-accent transition-colors mb-1">
        {project.data.title}
        </h3>
        {project.data.tech && project.data.tech.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
            {project.data.tech.map((tech: string) => (
                <span key={tech} className="text-xs text-terminal-muted bg-terminal-bg px-2 py-0.5 rounded border border-terminal-border">
                {tech}
                </span>
            ))}
            </div>
        )}
        <p className="text-terminal-muted text-sm leading-relaxed">
        {project.data.excerpt}
        </p>
        </Link>
    );
}
