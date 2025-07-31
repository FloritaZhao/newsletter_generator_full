
export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            AI驱动的智能内容平台
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            智能新闻简报
            <span className="text-primary-600">生成器</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            从RSS/JSON数据源自动获取文章，使用Google Gemini AI智能筛选内容，
            通过直观的拖拽界面生成专业的新闻简报。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/newsletters" className="btn btn-primary text-base px-8 py-4">
              立即开始创建
            </a>
            <a href="/sources" className="btn btn-secondary text-base px-8 py-4">
              管理数据源
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">强大的功能特性</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            集成了现代化的技术栈，为您提供完整的新闻简报生成解决方案
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card hover:shadow-lg transition">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">自动内容获取</h3>
              <p className="text-sm text-gray-600">
                支持RSS和JSON数据源，自动定期获取最新文章内容，保持内容时效性
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card hover:shadow-lg transition">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI智能筛选</h3>
              <p className="text-sm text-gray-600">
                基于Google Gemini AI技术，智能分析文章质量和相关性，过滤低质量内容
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card hover:shadow-lg transition">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">直观内容编辑</h3>
              <p className="text-sm text-gray-600">
                拖拽式界面设计，轻松重新排序文章，实时预览生成的新闻简报效果
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">快速开始</h2>
            <p className="text-lg text-gray-600">
              三个简单步骤，开始您的智能新闻简报之旅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">添加数据源</h3>
              <p className="text-sm text-gray-600">
                在数据源页面添加您的RSS或JSON源，系统将自动开始获取内容
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">查看文章</h3>
              <p className="text-sm text-gray-600">
                在文章页面查看AI筛选后的高质量内容，了解可用的素材
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">生成简报</h3>
              <p className="text-sm text-gray-600">
                在简报页面选择文章，通过拖拽调整顺序，一键生成专业简报
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a href="/sources" className="btn btn-primary text-base px-8 py-4">
              开始设置数据源
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">AI驱动</div>
            <div className="text-sm text-gray-600">智能内容分析</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">自动化</div>
            <div className="text-sm text-gray-600">定时内容获取</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">多源支持</div>
            <div className="text-sm text-gray-600">RSS + JSON</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">现代化</div>
            <div className="text-sm text-gray-600">响应式设计</div>
          </div>
        </div>
      </section>
    </div>
  );
}
