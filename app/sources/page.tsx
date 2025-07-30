
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function createSource(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '');
  const url = String(formData.get('url') || '');
  const type = String(formData.get('type') || 'rss');
  
  // Create user if doesn't exist
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'demo@example.com', name: 'Demo User' }
    });
  }
  
  await prisma.source.create({ data: { name, url, type, userId: user.id } });
  revalidatePath('/sources');
}

async function del(id: number) {
  'use server';
  await prisma.source.delete({ where: { id } });
  revalidatePath('/sources');
}

export default async function SourcesPage() {
  // Create user if doesn't exist
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: 'demo@example.com', name: 'Demo User' }
    });
  }
  
  const sources = await prisma.source.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sources</h2>
      <form action={createSource} className="space-y-2 mb-6">
        <input name="name" placeholder="Name" className="p-2 border rounded w-full"/>
        <input name="url" placeholder="URL" className="p-2 border rounded w-full"/>
        <select name="type" className="p-2 border rounded w-full">
          <option value="rss">RSS</option>
          <option value="json">JSON</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {sources.map(s => (
          <li key={s.id} className="p-3 border rounded flex justify-between">
            <span>{s.name}</span>
            <form action={async () => { 'use server'; await del(s.id); }}>
              <button className="text-red-600">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
