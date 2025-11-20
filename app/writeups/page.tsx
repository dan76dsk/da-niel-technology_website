import { getAllContent } from '@/lib/markdown';
import WriteupsClient from '@/components/WriteupsClient';

export default function WriteupsPage() {
    const writeupsEn = getAllContent('writeups', 'en');
    const writeupsPl = getAllContent('writeups', 'pl');

    return <WriteupsClient writeupsEn={writeupsEn} writeupsPl={writeupsPl} />;
}
