import { getContentBySlug } from '@/lib/markdown';
import { generateArticleMetadata } from '@/lib/metadata';
import { generateArticleSchema } from '@/lib/structured-data';
import ProjectClient from '@/components/ProjectClient';
import StructuredData from '@/components/StructuredData';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getContentBySlug(slug, 'projects', 'en');

    return generateArticleMetadata(
        project.data.title,
        project.data.excerpt || '',
        project.data.date,
        slug,
        'project',
        'en'
    );
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const projectEn = getContentBySlug(slug, 'projects', 'en');
    const projectPl = getContentBySlug(slug, 'projects', 'pl');

    const schema = generateArticleSchema(
        projectEn.data.title,
        projectEn.data.excerpt || '',
        projectEn.data.date,
        slug,
        'project'
    );

    return (
        <>
            <StructuredData data={schema} />
            <ProjectClient projectEn={projectEn} projectPl={projectPl} />
        </>
    );
}
