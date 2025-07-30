
import Builder from '@/components/NewsletterBuilder';
import { prisma } from '@/lib/prisma';

export default async function NewslettersPage() {
  const articles = await prisma.article.findMany({ where:{filteredOut:false}, orderBy:{publishedAt:'desc'} });
  const newsletters = await prisma.newsletter.findMany({ orderBy:{createdAt:'desc'} });
  return <Builder availableArticles={articles.map(a=>({ ...a, publishedAt:a.publishedAt.toISOString() }))} newsletters={newsletters.map(n=>({ ...n, createdAt:n.createdAt.toISOString() }))}/>;
}
