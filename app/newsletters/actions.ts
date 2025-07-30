
'use server';
import { prisma } from '@/lib/prisma';
import { generateSummary, generateNewsletter } from '@/lib/gemini';
import { marked } from 'marked';
import { revalidatePath } from 'next/cache';

export async function createNewsletterAction(title: string, ids: number[]) {
  const articles = await prisma.article.findMany({ where: { id: { in: ids } }});
  const summaries = [];
  for (const a of articles) {
    const sum = await generateSummary(a.content);
    summaries.push({ title: a.title, summary: sum, url: a.url });
  }
  const md = await generateNewsletter(title, summaries);
  const html = marked.parse(md);
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'demo@example.com', name: 'Demo User' }
    });
  }
  const newsletter = await prisma.newsletter.create({ data: { userId: user.id, title, markdown: md, html } });
  revalidatePath('/newsletters');
  return newsletter;
}
