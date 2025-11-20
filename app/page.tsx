import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import { getAllContent } from '@/lib/markdown';

export default function Home() {
  const projects = getAllContent('projects').slice(0, 3);
  const posts = getAllContent('posts').slice(0, 3);

  return (
    <main className="min-h-screen">
    {/* Hero */}
    <section className="max-w-3xl mx-auto px-6 py-24">
    <h1 className="text-4xl font-semibold mb-6 text-white">
    Daniel Litwin
    </h1>
    <p className="text-xl text-[#6b7280] mb-8 leading-relaxed">
    Security engineer focused on automation, infrastructure, and breaking things ethically.
    </p>
    <p className="text-[#6b7280] leading-relaxed mb-8">
    Self-taught pentester with a background in 3D printing automation and motion capture.
    Currently building homelab setups, solving HackTheBox challenges, and pivoting into
    cybersecurity full-time.
    </p>

    <div className="flex gap-4 text-sm">
    <a
    href="https://github.com/dan76dsk"
    target="_blank"
    className="text-[#6b7280] hover:text-white transition-colors"
    >
    github
    </a>
    <a
    href="https://app.hackthebox.com/users/98349"
    target="_blank"
    className="text-[#6b7280] hover:text-white transition-colors"
    >
    hackthebox
    </a>
    <a
    href="mailto:d@niel.technology"
    className="text-[#6b7280] hover:text-white transition-colors"
    >
    email
    </a>
    </div>
    </section>

    {/* Projects */}
    <section className="max-w-3xl mx-auto px-6 py-16 border-t border-[#2a2a2a]">
    <h2 className="text-sm uppercase tracking-wider text-[#6b7280] mb-8">
    Projects
    </h2>
    <div className="space-y-6">
    {projects.map(project => (
      <ProjectCard key={project.slug} project={project} />
    ))}
    </div>
    <Link
    href="/projects"
    className="inline-block mt-8 text-sm text-[#6b7280] hover:text-white transition-colors"
    >
    View all →
    </Link>
    </section>

    {/* Blog */}
    <section className="max-w-3xl mx-auto px-6 py-16 border-t border-[#2a2a2a]">
    <h2 className="text-sm uppercase tracking-wider text-[#6b7280] mb-8">
    Writing
    </h2>
    <div className="space-y-6">
    {posts.map(post => (
      <BlogCard key={post.slug} post={post} />
    ))}
    </div>
    <Link
    href="/blog"
    className="inline-block mt-8 text-sm text-[#6b7280] hover:text-white transition-colors"
    >
    View all →
    </Link>
    </section>
    </main>
  );
}
