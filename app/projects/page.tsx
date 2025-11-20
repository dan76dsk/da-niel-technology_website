import { getAllContent } from '@/lib/markdown';
import ProjectsClient from '@/components/ProjectsClient';

export default function ProjectsPage() {
    const projectsEn = getAllContent('projects', 'en');
    const projectsPl = getAllContent('projects', 'pl');

    return <ProjectsClient projectsEn={projectsEn} projectsPl={projectsPl} />;
}
