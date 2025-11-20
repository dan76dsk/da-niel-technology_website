// Centralna konfiguracja aplikacji

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  name: 'd@niel.technology',
  author: 'Daniel Litwin',
} as const;
