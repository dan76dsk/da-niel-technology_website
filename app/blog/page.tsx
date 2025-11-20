import { getAllContent } from '@/lib/markdown';
import BlogCard from '@/components/BlogCard';

export default function BlogPage() {
    const posts = getAllContent('posts');

    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-[#00d9ff] pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">Writing</h1>
        <p className="text-[#6b7280]">Technical insights, tutorials, and lessons learned</p>
        </div>

        <div className="space-y-6">
        {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
        ))}
        </div>
        </div>
        </main>
    );
}
