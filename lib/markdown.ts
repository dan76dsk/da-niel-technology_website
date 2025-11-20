import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const projectsDirectory = path.join(process.cwd(), 'content/projects');
const writeupsDirectory = path.join(process.cwd(), 'content/writeups');

export function getContentBySlug(slug: string, type: 'posts' | 'projects' | 'writeups') {
    const dir = type === 'posts' ? postsDirectory : type === 'projects' ? projectsDirectory : writeupsDirectory;
    const fullPath = path.join(dir, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = marked(content);

    return { data, content: htmlContent, slug };
}

export function getAllContent(type: 'posts' | 'projects' | 'writeups') {
    const dir = type === 'posts' ? postsDirectory : type === 'projects' ? projectsDirectory : writeupsDirectory;
    if (!fs.existsSync(dir)) return [];

    const slugs = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    return slugs.map(slug => {
        const realSlug = slug.replace(/\.md$/, '');
        return getContentBySlug(realSlug, type);
    });
}
