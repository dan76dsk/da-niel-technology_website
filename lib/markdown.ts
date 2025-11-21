import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { notFound } from 'next/navigation';

// Configure marked renderer to use highlight.js
const renderer = new marked.Renderer();

renderer.code = function({ text, lang }) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
            console.error('Highlight.js error:', err);
        }
    }
    const autoHighlighted = hljs.highlightAuto(text);
    return `<pre><code class="hljs">${autoHighlighted.value}</code></pre>`;
};

marked.setOptions({ renderer });

const postsDirectory = path.join(process.cwd(), 'content/posts');
const projectsDirectory = path.join(process.cwd(), 'content/projects');
const writeupsDirectory = path.join(process.cwd(), 'content/writeups');

type ContentType = 'posts' | 'projects' | 'writeups';
type Language = 'en' | 'pl';

function getDirectory(type: ContentType): string {
    switch (type) {
        case 'posts': return postsDirectory;
        case 'projects': return projectsDirectory;
        case 'writeups': return writeupsDirectory;
    }
}

export function getContentBySlug(slug: string, type: ContentType, language: Language = 'en'): { data: any; content: string; slug: string } {
    const dir = getDirectory(type);
    const langDir = path.join(dir, language);
    const fullPath = path.join(langDir, `${slug}.md`);

    // Fallback: if requested language doesn't exist, try the other one
    let finalPath = fullPath;
    if (!fs.existsSync(fullPath)) {
        const fallbackLang = language === 'pl' ? 'en' : 'pl';
        finalPath = path.join(dir, fallbackLang, `${slug}.md`);
    }

    if (!fs.existsSync(finalPath)) {
        notFound();
    }

    const fileContents = fs.readFileSync(finalPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked.parse(content) as string;

    return { data, content: htmlContent, slug };
}

export function getAllContent(type: ContentType, language: Language = 'en') {
    const dir = getDirectory(type);
    const enDir = path.join(dir, 'en');
    const plDir = path.join(dir, 'pl');

    // Collect all unique slugs from both language folders
    const allSlugs = new Set<string>();

    if (fs.existsSync(enDir)) {
        fs.readdirSync(enDir)
            .filter(file => file.endsWith('.md'))
            .forEach(file => allSlugs.add(file.replace(/\.md$/, '')));
    }

    if (fs.existsSync(plDir)) {
        fs.readdirSync(plDir)
            .filter(file => file.endsWith('.md'))
            .forEach(file => allSlugs.add(file.replace(/\.md$/, '')));
    }

    // Load each slug with fallback support
    return Array.from(allSlugs).map(slug => getContentBySlug(slug, type, language));
}
