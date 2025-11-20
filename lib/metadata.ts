import { Metadata } from 'next';
import { translations, Language } from './translations';
import { siteConfig } from './config';

export function generateMetadata(
  page: 'home' | 'projects' | 'blog' | 'writeups' | 'whoami',
  language: Language = 'en'
): Metadata {
  const t = translations[language];

  let title = '';
  let description = '';
  let ogTitle = '';
  let ogDescription = '';

  switch (page) {
    case 'home':
      title = t.metaHomeTitle;
      description = t.metaHomeDesc;
      ogTitle = t.heroTitle;
      ogDescription = t.heroTagline;
      break;
    case 'projects':
      title = t.metaProjectsTitle;
      description = t.metaProjectsDesc;
      ogTitle = t.projectsTitle;
      ogDescription = t.projectsSubtitle;
      break;
    case 'blog':
      title = t.metaBlogTitle;
      description = t.metaBlogDesc;
      ogTitle = t.blogTitle;
      ogDescription = t.blogSubtitle;
      break;
    case 'writeups':
      title = t.metaWriteupsTitle;
      description = t.metaWriteupsDesc;
      ogTitle = t.writeupsTitle;
      ogDescription = t.writeupsSubtitle;
      break;
    case 'whoami':
      title = t.metaWhoamiTitle;
      description = t.metaWhoamiDesc;
      ogTitle = t.whoamiTitle;
      ogDescription = t.whoamiSubtitle;
      break;
  }

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export function generateArticleMetadata(
  title: string,
  excerpt: string,
  date: string,
  slug: string,
  type: 'blog' | 'writeup' | 'project',
  language: Language = 'en'
): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}/${type === 'blog' ? 'blog' : type === 'writeup' ? 'writeups' : 'projects'}/${slug}`;

  return {
    title: fullTitle,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      url,
      siteName: siteConfig.name,
      locale: language === 'pl' ? 'pl_PL' : 'en_US',
      type: 'article',
      publishedTime: date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
    },
  };
}
