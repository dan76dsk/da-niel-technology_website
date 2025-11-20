import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">404 - Not Found</h2>
        <p className="text-terminal-muted mb-8">Could not find requested resource</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg text-terminal-muted hover:text-terminal-accent transition-colors"
        >
          <span className="text-terminal-accent">$</span> cd ~
        </Link>
      </div>
    </main>
  );
}
