
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function Newsletter({ params }:{ params:{ id:string } }) {
  const newsletter = await prisma.newsletter.findUnique({ where:{ id: parseInt(params.id)}});
  if(!newsletter) notFound();
  return (
    <div className="prose max-w-none">
      <h2>{newsletter.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: newsletter.html }} />
    </div>
  );
}
