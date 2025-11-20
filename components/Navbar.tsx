import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b border-terminal-border bg-terminal-bg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-lg font-medium text-white hover:text-terminal-accent transition-colors">
        <span className="text-terminal-muted">d@niel.technology</span><span className="text-white">:~$</span>
        </Link>
        <div className="flex gap-6 text-sm">
        <Link href="/projects" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        projects
        </Link>
        <Link href="/blog" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        blog
        </Link>
        <Link href="/whoami" className="text-terminal-muted hover:text-terminal-accent transition-colors px-3 py-1 rounded-md hover:bg-terminal-bg-card">
        <span className="text-terminal-accent">&gt;</span> whoami
        </Link>
        </div>
        </div>
        </nav>
    );
}
