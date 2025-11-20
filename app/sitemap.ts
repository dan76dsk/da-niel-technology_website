import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://d@niel.technology';
  const currentDate = new Date();

  // Get all content
  const projects = getAllContent('projects', 'en');
  const posts = getAllContent('posts', 'en');
  const writeups = getAllContent('writeups', 'en');

  // Helper to safely parse date
  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return currentDate;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? currentDate : parsed;
  };

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/whoami`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writeups`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Dynamic pages - projects
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: parseDate(project.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic pages - blog posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: parseDate(post.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic pages - writeups
  const writeupPages = writeups.map((writeup) => ({
    url: `${baseUrl}/writeups/${writeup.slug}`,
    lastModified: parseDate(writeup.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages, ...writeupPages];
}
