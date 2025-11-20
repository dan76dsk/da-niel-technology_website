import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/markdown';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/whoami`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/writeups`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Dynamic pages - projects
  const projectPages = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: parseDate(project.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic pages - blog posts
  const blogPages = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: parseDate(post.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic pages - writeups
  const writeupPages = writeups.map((writeup) => ({
    url: `${siteConfig.url}/writeups/${writeup.slug}`,
    lastModified: parseDate(writeup.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages, ...writeupPages];
}
