import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getContentBySlug(slug: string, type: 'posts' | 'projects') {
    const dir = type === 'posts' ? postsDirectory : projectsDirectory;
    const fullPath = path.join(dir, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return { data, content: htmlContent, slug };
}

export function getAllContent(type: 'posts' | 'projects') {
    const dir = type === 'posts' ? postsDirectory : projectsDirectory;
    if (!fs.existsSync(dir)) return [];

    const slugs = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    return slugs.map(slug => {
        const realSlug = slug.replace(/\.md$/, '');
        return getContentBySlug(realSlug, type);
    });
}
