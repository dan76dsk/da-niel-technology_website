import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium hover:text-[#00d9ff] transition-colors">
        daniel
        </Link>
        <div className="flex gap-8 text-sm">
        <Link href="/projects" className="text-[#6b7280] hover:text-white transition-colors">
        projects
        </Link>
        <Link href="/blog" className="text-[#6b7280] hover:text-white transition-colors">
        blog
        </Link>
        </div>
        </div>
        </nav>
    );
}
