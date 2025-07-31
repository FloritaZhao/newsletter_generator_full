import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getNewsletter(id: string) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });
  
  if (!newsletter || !newsletter.markdown) {
    notFound();
  }
  
  return newsletter;
}

// 简单的Markdown到HTML转换函数
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\n/g, '<br/>')
    .replace(/^# (.*$)/gm, '<h1 style="font-size: 2rem; font-weight: bold; margin: 2rem 0 1rem 0; color: #1f2937;">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: #374151;">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0; color: #4b5563;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #1f2937;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e5e7eb;"/>')
    .replace(/^\* (.*$)/gm, '<li style="margin: 0.5rem 0; list-style: disc; margin-left: 1rem;">$1</li>');
}

export default async function NewsletterPage({ params }: { params: { id: string } }) {
  const newsletter = await getNewsletter(params.id);
  const htmlContent = markdownToHtml(newsletter.markdown);
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部导航 */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/newsletters" className="hover:text-primary-600">简报</Link>
            <span>/</span>
            <span className="text-gray-900">{newsletter.title}</span>
          </nav>
        </div>

        {/* 简报标题和信息 */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{newsletter.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>创建于 {new Date(newsletter.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI 生成</span>
            </div>
          </div>
        </div>

        {/* 简报内容 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              style={{
                lineHeight: '1.7',
                fontSize: '16px'
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex items-center justify-between">
          <Link 
            href="/newsletters"
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回简报列表
          </Link>
          
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium bg-success-100 text-success-700 rounded-md">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              简报生成成功
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}