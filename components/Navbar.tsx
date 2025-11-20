import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium text-white hover:text-[#00d9ff] transition-colors">
        daniel
        </Link>
        <div className="flex gap-6 text-sm">
        <Link href="/projects" className="text-[#6b7280] hover:text-[#00d9ff] transition-colors px-3 py-1 rounded-md hover:bg-[#1a1a1a]">
        projects
        </Link>
        <Link href="/blog" className="text-[#6b7280] hover:text-[#00d9ff] transition-colors px-3 py-1 rounded-md hover:bg-[#1a1a1a]">
        blog
        </Link>
        </div>
        </div>
        </nav>
    );
}
