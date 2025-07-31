import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, articleIds } = body;
    
    if (!title || !articleIds || articleIds.length === 0) {
      return NextResponse.json({ error: '请提供标题和文章ID' }, { status: 400 });
    }
    
    // 获取选中的文章
    const articles = await prisma.article.findMany({
      where: {
        id: { in: articleIds }
      },
      include: {
        source: true
      }
    });
    
    if (articles.length === 0) {
      return NextResponse.json({ error: '未找到指定的文章' }, { status: 404 });
    }
    
    // 生成简报内容
    let content = '';
    try {
      const prompt = `请根据以下文章生成一份专业的简报，标题为"${title}":

${articles.map((article, index) => `
${index + 1}. ${article.title}
来源: ${article.source.name}
内容: ${article.content}
`).join('\n')}

请生成一份结构清晰、内容丰富的简报，包含摘要和要点。`;

      content = await callGemini(prompt);
    } catch (error) {
      console.warn('AI生成失败，使用基础模板:', error);
      // 如果AI生成失败，使用基础模板
      content = `# ${title}

## 本期要点

${articles.map((article, index) => `
### ${index + 1}. ${article.title}
**来源:** ${article.source.name}

${article.content}

---
`).join('\n')}

## 总结
本期简报包含 ${articles.length} 篇精选文章，涵盖了最新的行业动态和见解。

---
*由 Newsletter Generator 自动生成*`;
    }
    
    // 保存简报到数据库
    const newsletter = await prisma.newsletter.create({
      data: {
        userId: 1, // 默认用户ID
        title,
        markdown: content,
        html: content // 暂时使用相同内容，后续可以转换为HTML
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        content: newsletter.content
      }
    });
    
  } catch (error) {
    console.error('生成简报失败:', error);
    return NextResponse.json({ error: '生成简报失败' }, { status: 500 });
  }
}