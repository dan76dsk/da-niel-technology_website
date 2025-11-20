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
        className="block group"
        >
        <h3 className="text-lg font-medium mb-2 text-white group-hover:text-[#00d9ff] transition-colors">
        {project.data.title}
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed">
        {project.data.excerpt}
        </p>
        </Link>
    );
}
