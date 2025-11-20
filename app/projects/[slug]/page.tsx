import { getContentBySlug } from '@/lib/markdown';
import ProjectClient from '@/components/ProjectClient';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const projectEn = getContentBySlug(slug, 'projects', 'en');
    const projectPl = getContentBySlug(slug, 'projects', 'pl');

    return <ProjectClient projectEn={projectEn} projectPl={projectPl} />;
}
