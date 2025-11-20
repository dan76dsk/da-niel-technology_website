import { getAllContent } from '@/lib/markdown';
import { generateMetadata as genMeta } from '@/lib/metadata';
import { generateWebsiteSchema } from '@/lib/structured-data';
import HomeClient from '@/components/HomeClient';
import StructuredData from '@/components/StructuredData';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  // Generate for both languages (default to EN for SSR, client will use their preference)
  return genMeta('home', 'en');
}

export default function Home() {
  // Server Component - loads data for BOTH languages
  const projectsEn = getAllContent('projects', 'en');
  const projectsPl = getAllContent('projects', 'pl');
  const postsEn = getAllContent('posts', 'en');
  const postsPl = getAllContent('posts', 'pl');
  const writeupsEn = getAllContent('writeups', 'en');
  const writeupsPl = getAllContent('writeups', 'pl');

  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <HomeClient data={{ projectsEn, projectsPl, postsEn, postsPl, writeupsEn, writeupsPl }} />
    </>
  );
}
