import { getAllContent } from '@/lib/markdown';
import WriteupCard from '@/components/WriteupCard';

export default function WriteupsPage() {
    const writeups = getAllContent('writeups');

    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-terminal-accent pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">Writeups</h1>
        <p className="text-terminal-muted">HackTheBox, TryHackMe, and CTF solutions</p>
        </div>

        <div className="space-y-6">
        {writeups.map(writeup => (
            <WriteupCard key={writeup.slug} writeup={writeup} />
        ))}
        </div>
        </div>
        </main>
    );
}
