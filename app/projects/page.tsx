import { getAllContent } from '@/lib/markdown';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
    const projects = getAllContent('projects');

    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-[#00d9ff] pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">Projects</h1>
        <p className="text-[#6b7280]">Case studies and technical explorations</p>
        </div>

        <div className="space-y-6">
        {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
        ))}
        </div>
        </div>
        </main>
    );
}
