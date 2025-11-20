import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

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

export function getContentBySlug(slug: string, type: ContentType, language: Language = 'en') {
    const dir = getDirectory(type);
    const langDir = path.join(dir, language);
    const fullPath = path.join(langDir, `${slug}.md`);

    // Fallback to English if translation doesn't exist
    let finalPath = fullPath;
    if (!fs.existsSync(fullPath) && language === 'pl') {
        finalPath = path.join(dir, 'en', `${slug}.md`);
    }

    if (!fs.existsSync(finalPath)) {
        throw new Error(`Content not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(finalPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return { data, content: htmlContent, slug };
}

export function getAllContent(type: ContentType, language: Language = 'en') {
    const dir = getDirectory(type);
    const langDir = path.join(dir, language);

    if (!fs.existsSync(langDir)) {
        // Fallback to English if language folder doesn't exist
        const enDir = path.join(dir, 'en');
        if (!fs.existsSync(enDir)) return [];

        const slugs = fs.readdirSync(enDir).filter(file => file.endsWith('.md'));
        return slugs.map(slug => {
            const realSlug = slug.replace(/\.md$/, '');
            return getContentBySlug(realSlug, type, 'en');
        });
    }

    const slugs = fs.readdirSync(langDir).filter(file => file.endsWith('.md'));
    return slugs.map(slug => {
        const realSlug = slug.replace(/\.md$/, '');
        return getContentBySlug(realSlug, type, language);
    });
}
