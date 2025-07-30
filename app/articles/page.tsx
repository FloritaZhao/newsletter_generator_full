
import { prisma } from '@/lib/prisma';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, include: { source: true } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Articles</h2>
      <div className="space-y-3">
        {articles.map(a => (
          <div key={a.id} className="p-3 border rounded">
            <div className="flex justify-between">
              <h3 className="font-medium">{a.title}</h3>
              <span className="text-xs text-gray-500">{a.source.name}</span>
            </div>
            <p className="text-sm">{a.content.slice(0,200)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
