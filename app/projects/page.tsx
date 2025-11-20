import { getAllContent } from '@/lib/markdown';
import { generateMetadata as genMeta } from '@/lib/metadata';
import ProjectsClient from '@/components/ProjectsClient';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return genMeta('projects', 'en');
}

export default function ProjectsPage() {
    const projectsEn = getAllContent('projects', 'en');
    const projectsPl = getAllContent('projects', 'pl');

    return <ProjectsClient projectsEn={projectsEn} projectsPl={projectsPl} />;
}
