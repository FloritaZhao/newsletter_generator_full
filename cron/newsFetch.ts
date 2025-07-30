
import { prisma } from '../lib/prisma';
import { passesKeywordFilter } from '../lib/keywordFilter';
import Parser from 'rss-parser';
import axios from 'axios';

export async function run() {
  const parser = new Parser();
  const keywords = process.env.KEYWORDS || '';
  const sources = await prisma.source.findMany();
  for (const source of sources) {
    try {
      if (source.type === 'rss') {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items) {
          const title = item.title ?? 'Untitled';
          const content = item.contentSnippet ?? item.content ?? '';
          const url = item.link ?? '';
          const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();
          if (await prisma.article.findFirst({ where: { url } })) continue;
          const ok = passesKeywordFilter({ title, content }, keywords);
          await prisma.article.create({
            data: { sourceId: source.id, title, url, content, publishedAt, filteredOut: !ok }
          });
        }
      } else if (source.type === 'json') {
        const res = await axios.get(source.url);
        const arr: any[] = res.data.items ?? res.data.articles ?? res.data;
        for (const it of arr) {
          const title = it.title ?? it.headline ?? 'Untitled';
          const content = it.content ?? it.description ?? '';
          const url = it.url ?? it.link ?? '';
          const publishedAt = it.publishedAt ? new Date(it.publishedAt) : new Date();
          if (await prisma.article.findFirst({ where: { url } })) continue;
          const ok = passesKeywordFilter({ title, content }, keywords);
          await prisma.article.create({
            data: { sourceId: source.id, title, url, content, publishedAt, filteredOut: !ok }
          });
        }
      }
    } catch (err) {
      console.error('Fetch error', err);
    }
  }
  await prisma.$disconnect();
}

if (require.main === module) {
  run().catch((e) => { console.error(e); process.exit(1); });
}
