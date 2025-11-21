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

renderer.image = function({ href, title, text }) {
    if (title) {
        return `<figure class="image-figure">
            <img src="${href}" alt="${text || ''}" />
            <figcaption>${title}</figcaption>
        </figure>`;
    }
    return `<img src="${href}" alt="${text || ''}" />`;
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
    const langDir = path.join(dir, language);

    // Only return content that exists in the requested language
    if (!fs.existsSync(langDir)) return [];

    const slugs = fs.readdirSync(langDir).filter(file => file.endsWith('.md'));
    const content = slugs.map(slug => {
        const realSlug = slug.replace(/\.md$/, '');
        return getContentBySlug(realSlug, type, language);
    });

    // Sort by date, newest first
    return content.sort((a, b) => {
        const dateA = new Date(a.data.date || 0).getTime();
        const dateB = new Date(b.data.date || 0).getTime();
        return dateB - dateA;
    });
}
