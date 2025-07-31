
import { prisma } from '@/lib/prisma';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, include: { source: true } });
  const filteredArticles = articles.filter(a => !a.filteredOut);
  const totalArticles = articles.length;
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
          <p className="text-gray-600 mt-2">查看从数据源获取的文章内容，AI已智能筛选高质量内容</p>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>总计 {totalArticles} 篇</span>
          </div>
          <div className="flex items-center space-x-2 text-success-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>优质 {filteredArticles.length} 篇</span>
          </div>
        </div>
      </div>

      {/* Filter Stats */}
      {totalArticles > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI智能筛选统计</h3>
              <p className="text-sm text-gray-600">
                从 {totalArticles} 篇文章中筛选出 {filteredArticles.length} 篇高质量内容
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {totalArticles > 0 ? Math.round((filteredArticles.length / totalArticles) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">筛选通过率</div>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {totalArticles === 0 ? '暂无文章' : '暂无优质文章'}
              </h3>
              <p className="text-gray-600 mb-6">
                {totalArticles === 0 
                  ? '请先在数据源页面添加RSS或JSON源，系统将自动获取文章'
                  : 'AI正在分析文章质量，请稍后查看或调整筛选条件'
                }
              </p>
              <a href="/sources" className="btn btn-primary">
                {totalArticles === 0 ? '添加数据源' : '管理数据源'}
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map(article => (
              <article key={article.id} className="card hover:shadow-md transition">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                        {article.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                          </svg>
                          {article.source.name}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {new Date(article.publishedAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-xs font-medium bg-success-100 text-success-600 rounded-full">
                        AI推荐
                      </span>
                      {article.url && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition"
                          title="打开原文"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {article.content.slice(0, 300)}
                      {article.content.length > 300 && '...'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        内容质量：优秀
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {Math.round(article.content.length / 100) / 10}k 字符
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {filteredArticles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">准备创建简报？</h3>
              <p className="text-sm text-gray-600">
                选择这些优质文章，开始创建您的专业新闻简报
              </p>
            </div>
            <a href="/newsletters" className="btn btn-primary">
              开始创建简报
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
