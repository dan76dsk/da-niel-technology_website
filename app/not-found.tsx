import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="border border-terminal-border rounded-lg p-8 bg-terminal-bg-card">
          <h1 className="text-6xl font-bold text-terminal-accent mb-4">404</h1>
          <p className="text-xl text-white mb-2">bash: command not found</p>
          <p className="text-terminal-muted mb-8">
            Strona, której szukasz nie istnieje.
            <br />
            The page you're looking for doesn't exist.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg text-terminal-muted hover:text-terminal-accent transition-colors"
            >
              <span className="text-terminal-accent">$</span> cd ~
            </Link>
            <p className="text-xs text-terminal-muted">
              (powrót do strony głównej / back to homepage)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
