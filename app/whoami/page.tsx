import { generateMetadata as genMeta } from '@/lib/metadata';
import { generatePersonSchema } from '@/lib/structured-data';
import WhoamiContent from '@/components/WhoamiContent';
import StructuredData from '@/components/StructuredData';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return genMeta('whoami', 'en');
}

export default function WhoamiPage() {
    return (
        <>
            <StructuredData data={generatePersonSchema()} />
            <WhoamiContent />
        </>
    );
}
