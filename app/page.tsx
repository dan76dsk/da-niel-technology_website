import { getAllContent } from '@/lib/markdown';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  // Server Component - loads data for BOTH languages
  const projectsEn = getAllContent('projects', 'en');
  const projectsPl = getAllContent('projects', 'pl');
  const postsEn = getAllContent('posts', 'en');
  const postsPl = getAllContent('posts', 'pl');

  return <HomeClient data={{ projectsEn, projectsPl, postsEn, postsPl }} />;
}
