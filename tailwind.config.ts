import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                terminal: {
                    bg: '#0a0a0a',
                    'bg-card': '#1a1a1a',
                    'bg-hover': '#1f1f1f',
                    border: '#2a2a2a',
                    text: '#e0e0e0',
                    accent: '#a78bfa',
                    muted: '#6b7280',
                }
            },
            borderRadius: {
                'md': '6px',
            }
        },
    },
    plugins: [],
};

export default config;
