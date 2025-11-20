import { getAllContent } from '@/lib/markdown';
import { generateMetadata as genMeta } from '@/lib/metadata';
import WriteupsClient from '@/components/WriteupsClient';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return genMeta('writeups', 'en');
}

export default function WriteupsPage() {
    const writeupsEn = getAllContent('writeups', 'en');
    const writeupsPl = getAllContent('writeups', 'pl');

    return <WriteupsClient writeupsEn={writeupsEn} writeupsPl={writeupsPl} />;
}
