import { getContentBySlug } from '@/lib/markdown';
import { generateArticleMetadata } from '@/lib/metadata';
import { generateArticleSchema } from '@/lib/structured-data';
import WriteupClient from '@/components/WriteupClient';
import StructuredData from '@/components/StructuredData';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const writeup = getContentBySlug(slug, 'writeups', 'en');

    return generateArticleMetadata(
        writeup.data.title,
        writeup.data.excerpt || '',
        writeup.data.date,
        slug,
        'writeup',
        'en'
    );
}

export default async function WriteupPage({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const writeupEn = getContentBySlug(slug, 'writeups', 'en');
    const writeupPl = getContentBySlug(slug, 'writeups', 'pl');

    const schema = generateArticleSchema(
        writeupEn.data.title,
        writeupEn.data.excerpt || '',
        writeupEn.data.date,
        slug,
        'writeup'
    );

    return (
        <>
            <StructuredData data={schema} />
            <WriteupClient writeupEn={writeupEn} writeupPl={writeupPl} />
        </>
    );
}
