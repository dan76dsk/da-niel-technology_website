import Link from 'next/link';

type Post = {
    slug: string;
    data: {
        title: string;
        date: string;
        excerpt: string;
        tags?: string[];
    };
};

export default function BlogCard({ post }: { post: Post }) {
    return (
        <Link
        href={`/blog/${post.slug}`}
        className="block group bg-terminal-bg-card border border-terminal-border rounded-md p-5 transition-all duration-300 hover:bg-terminal-bg-hover hover:border-terminal-accent"
        >
        <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
        <h3 className="text-lg font-medium text-white group-hover:text-terminal-accent transition-colors mb-1">
        {post.data.title}
        </h3>
        {post.data.tags && post.data.tags.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
            {post.data.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-terminal-muted bg-terminal-bg px-2 py-0.5 rounded border border-terminal-border">
                {tag}
                </span>
            ))}
            </div>
        )}
        </div>
        <span className="text-xs text-terminal-muted ml-4">{post.data.date}</span>
        </div>
        <p className="text-terminal-muted text-sm leading-relaxed">
        {post.data.excerpt}
        </p>
        </Link>
    );
}
