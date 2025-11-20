import { getContentBySlug } from '@/lib/markdown';
import WriteupClient from '@/components/WriteupClient';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function WriteupPage({ params }: Props) {
    const { slug } = await params;

    // Load both languages
    const writeupEn = getContentBySlug(slug, 'writeups', 'en');
    const writeupPl = getContentBySlug(slug, 'writeups', 'pl');

    return <WriteupClient writeupEn={writeupEn} writeupPl={writeupPl} />;
}
