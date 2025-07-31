
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据源管理</h1>
          <p className="text-gray-600 mt-2">添加和管理RSS/JSON数据源，自动获取最新内容</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>共 {sources.length} 个数据源</span>
        </div>
      </div>

      {/* Add New Source Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            添加新数据源
          </h3>
          <p className="text-sm text-gray-600 mt-1">支持RSS和JSON格式的数据源</p>
        </div>
        <div className="card-body">
          <form action={createSource} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">源名称</label>
                <input 
                  name="name" 
                  placeholder="例：科技新闻、财经资讯" 
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                <select name="type" className="input">
                  <option value="rss">RSS Feed</option>
                  <option value="json">JSON API</option>
                  <option value="scrape">网页抓取 (适用于无RSS的网站)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL地址</label>
              <input 
                name="url" 
                type="url"
                placeholder="https://example.com/rss" 
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">请输入有效的RSS或JSON数据源地址</p>
            </div>
            <button className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              添加数据源
            </button>
          </form>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">当前数据源</h3>
        
        {sources.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-2">暂无数据源</h4>
              <p className="text-gray-600 mb-4">添加您的第一个RSS或JSON数据源开始使用</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sources.map(source => (
              <div key={source.id} className="card hover:shadow-md transition">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{source.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          source.type === 'rss' 
                            ? 'bg-orange-100 text-orange-600' 
                            : source.type === 'json'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {source.type === 'scrape' ? '抓取' : source.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 break-all">{source.url}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          添加于 {new Date(source.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <form action={async () => { 'use server'; await del(source.id); }}>
                        <button 
                          className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-md transition"
                          title="删除数据源"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-primary-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h4 className="font-medium text-primary-900 mb-2">使用提示</h4>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• RSS源：大多数新闻网站和博客都提供RSS feed</li>
              <li>• JSON源：支持自定义API接口，需返回标准格式的JSON数据</li>
              <li>• 网页抓取：适用于没有RSS的高质量网站，如a16z.com、TechCrunch等</li>
              <li>• 系统会定期自动抓取新内容，无需手动更新</li>
              <li>• 建议添加多个不同领域的数据源以获得更丰富的内容</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
