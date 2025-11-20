import { getAllContent } from '@/lib/markdown';
import Link from 'next/link';

export default function BlogPage() {
    const posts = getAllContent('posts');

    return (
        <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-8">&gt; cat blog</h1>
        <div className="space-y-4">
        {posts.map(post => (
            <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-green-500 p-4 hover:bg-green-500/10"
            >
            <h2 className="text-2xl mb-2">{post.data.title}</h2>
            <p className="text-green-500/70">{post.data.date}</p>
            <p className="mt-2">{post.data.excerpt}</p>
            </Link>
        ))}
        </div>
        </div>
        </main>
    );
}
