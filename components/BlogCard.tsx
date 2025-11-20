import Link from 'next/link';

type Post = {
    slug: string;
    data: {
        title: string;
        date: string;
        excerpt: string;
    };
};

export default function BlogCard({ post }: { post: Post }) {
    return (
        <Link
        href={`/blog/${post.slug}`}
        className="block group bg-terminal-bg-card border border-terminal-border rounded-md p-5 transition-all duration-300 hover:bg-terminal-bg-hover hover:border-terminal-accent"
        >
        <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-medium text-white group-hover:text-terminal-accent transition-colors">
        {post.data.title}
        </h3>
        <span className="text-xs text-terminal-muted">{post.data.date}</span>
        </div>
        <p className="text-terminal-muted text-sm leading-relaxed">
        {post.data.excerpt}
        </p>
        </Link>
    );
}
