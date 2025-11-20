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
        className="block group"
        >
        <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-medium text-white group-hover:text-[#00d9ff] transition-colors">
        {post.data.title}
        </h3>
        <span className="text-xs text-[#6b7280]">{post.data.date}</span>
        </div>
        <p className="text-[#6b7280] text-sm leading-relaxed">
        {post.data.excerpt}
        </p>
        </Link>
    );
}
