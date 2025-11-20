import { getAllContent } from '@/lib/markdown';
import BlogClient from '@/components/BlogClient';

export default function BlogPage() {
    const postsEn = getAllContent('posts', 'en');
    const postsPl = getAllContent('posts', 'pl');

    return <BlogClient postsEn={postsEn} postsPl={postsPl} />;
}
