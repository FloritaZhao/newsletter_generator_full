import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        source: {
          select: {
            name: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}