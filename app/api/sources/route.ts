import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(sources);
  } catch (error) {
    console.error('获取数据源失败:', error);
    return NextResponse.json({ error: '获取数据源失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, url, type } = body;
    
    if (!name || !url || !type) {
      return NextResponse.json({ error: '请提供完整的数据源信息' }, { status: 400 });
    }
    
    const source = await prisma.source.create({
      data: {
        userId: 1, // 默认用户ID
        name,
        url,
        type
      }
    });
    
    return NextResponse.json(source);
  } catch (error) {
    console.error('创建数据源失败:', error);
    return NextResponse.json({ error: '创建数据源失败' }, { status: 500 });
  }
}