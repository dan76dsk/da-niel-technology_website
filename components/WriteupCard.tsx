import Link from 'next/link';

type Writeup = {
    slug: string;
    data: {
        title: string;
        date: string;
        excerpt: string;
        platform?: string;
        difficulty?: string;
    };
};

export default function WriteupCard({ writeup }: { writeup: Writeup }) {
    return (
        <Link
        href={`/writeups/${writeup.slug}`}
        className="block group bg-terminal-bg-card border border-terminal-border rounded-md p-5 transition-all duration-300 hover:bg-terminal-bg-hover hover:border-terminal-accent"
        >
        <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
        <h3 className="text-lg font-medium text-white group-hover:text-terminal-accent transition-colors mb-1">
        {writeup.data.title}
        </h3>
        {(writeup.data.platform || writeup.data.difficulty) && (
            <div className="flex gap-2 mb-2">
            {writeup.data.platform && (
                <span className="text-xs text-terminal-muted bg-terminal-bg px-2 py-0.5 rounded border border-terminal-border">
                {writeup.data.platform}
                </span>
            )}
            {writeup.data.difficulty && (
                <span className="text-xs text-terminal-muted bg-terminal-bg px-2 py-0.5 rounded border border-terminal-border">
                {writeup.data.difficulty}
                </span>
            )}
            </div>
        )}
        </div>
        <span className="text-xs text-terminal-muted ml-4">{writeup.data.date}</span>
        </div>
        <p className="text-terminal-muted text-sm leading-relaxed">
        {writeup.data.excerpt}
        </p>
        </Link>
    );
}
