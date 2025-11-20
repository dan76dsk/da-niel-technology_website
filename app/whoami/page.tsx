export default function WhoamiPage() {
    return (
        <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-2 border-terminal-accent pl-6 mb-12">
        <h1 className="text-3xl font-semibold text-white mb-3">$ whoami</h1>
        <p className="text-terminal-muted">Daniel Litwin / Security Engineer</p>
        </div>

        <div className="space-y-8 text-terminal-text">
        {/* Bio */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> Bio
        </h2>
        <p className="text-terminal-muted leading-relaxed mb-4">
        Security engineer focused on automation, infrastructure, and breaking things ethically.
        Self-taught pentester with a background in 3D printing automation and motion capture.
        </p>
        <p className="text-terminal-muted leading-relaxed">
        Currently building homelab setups, solving HackTheBox challenges, and pivoting into
        cybersecurity full-time.
        </p>
        </section>

        {/* Skills */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> Skills
        </h2>
        <div className="grid grid-cols-2 gap-4">
        <div>
        <h3 className="text-sm font-medium text-white mb-2">Security</h3>
        <ul className="text-sm text-terminal-muted space-y-1">
        <li>• Penetration Testing</li>
        <li>• Web Application Security</li>
        <li>• CTF Challenges</li>
        </ul>
        </div>
        <div>
        <h3 className="text-sm font-medium text-white mb-2">Infrastructure</h3>
        <ul className="text-sm text-terminal-muted space-y-1">
        <li>• Proxmox / Docker</li>
        <li>• Linux Administration</li>
        <li>• Automation</li>
        </ul>
        </div>
        </div>
        </section>

        {/* Background */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> Background
        </h2>
        <div className="space-y-3 text-sm text-terminal-muted">
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">Politechnika Śląska</p>
        <p className="text-xs">Teleinformatyka</p>
        </div>
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">3D Printing Automation</p>
        <p className="text-xs">First automated quotation system in Poland</p>
        </div>
        <div className="bg-terminal-bg-card border border-terminal-border rounded-md p-4">
        <p className="font-medium text-white mb-1">Motion Capture & 3D Graphics</p>
        <p className="text-xs">Previous industry experience</p>
        </div>
        </div>
        </section>

        {/* Links */}
        <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-terminal-accent">&gt;</span> Links
        </h2>
        <div className="flex gap-4 text-sm">
        <a
        href="https://github.com/dan76dsk"
        target="_blank"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        github
        </a>
        <a
        href="https://app.hackthebox.com/users/98349"
        target="_blank"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        hackthebox
        </a>
        <a
        href="mailto:d@niel.technology"
        className="text-terminal-muted hover:text-terminal-accent transition-colors"
        >
        d@niel.technology
        </a>
        </div>
        </section>
        </div>
        </div>
        </main>
    );
}
