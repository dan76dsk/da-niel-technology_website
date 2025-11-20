import { siteConfig } from './config';

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: 'Security & DevOps Engineer - Portfolio and Technical Blog',
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      jobTitle: 'Security & DevOps Engineer',
      url: `${siteConfig.url}/whoami`,
      sameAs: [
        'https://www.linkedin.com/in/daniel-litwin/',
        'https://github.com/dan76dsk',
        'https://app.hackthebox.com/users/98349',
      ],
    },
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    jobTitle: 'Security & DevOps Engineer',
    description: 'DevSecOps practitioner with interdisciplinary experience in security, automation, and infrastructure',
    url: siteConfig.url,
    email: 'd@niel.technology',
    sameAs: [
      'https://www.linkedin.com/in/daniel-litwin/',
      'https://github.com/dan76dsk',
      'https://app.hackthebox.com/users/98349',
    ],
    knowsAbout: [
      'DevSecOps',
      'IT Security',
      'Penetration Testing',
      'Infrastructure Automation',
      'Docker',
      'Linux Administration',
      'Network Security',
    ],
  };
}

export function generateArticleSchema(
  title: string,
  excerpt: string,
  date: string,
  slug: string,
  type: 'blog' | 'writeup' | 'project'
) {
  const url = `${siteConfig.url}/${type === 'blog' ? 'blog' : type === 'writeup' ? 'writeups' : 'projects'}/${slug}`;

  // Określ typ artykułu
  let articleType: 'BlogPosting' | 'TechArticle' = 'BlogPosting';
  if (type === 'writeup' || type === 'project') {
    articleType = 'TechArticle';
  }

  return {
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: title,
    description: excerpt,
    url: url,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: `${siteConfig.url}/whoami`,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
