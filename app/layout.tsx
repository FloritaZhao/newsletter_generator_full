
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Newsletter Generator',
  description: 'Generate newsletters from your sources'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Modern Header with Glassmorphism Effect */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
          <div className="container">
            <div className="flex items-center justify-between py-4">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-4 md:h-4">
                      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">Newsletter Generator</h1>
                    <p className="text-xs text-gray-500 hidden md:block">Powered by AI</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <a href="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition">
                  首页
                </a>
                <a href="/workspace" className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:text-primary-600 hover:bg-primary-100 rounded-md transition font-semibold">
                  🚀 工作台
                </a>
                <a href="/sources" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition">
                  数据源
                </a>
                <a href="/articles" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition">
                  文章
                </a>
                <a href="/newsletters" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition">
                  简报
                </a>
                <a href="/rss-converter" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition">
                  RSS转换
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <button id="mobile-menu-button" className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div id="mobile-menu" className="hidden md:hidden border-t border-gray-100 pt-4 pb-2">
              <nav className="flex flex-col space-y-1">
                <a href="/" className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  首页
                </a>
                <a href="/workspace" className="px-3 py-3 text-sm font-medium text-primary-700 bg-primary-50 hover:text-primary-600 hover:bg-primary-100 rounded-md transition flex items-center font-semibold">
                  <svg className="w-4 h-4 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  🚀 工作台
                </a>
                <a href="/sources" className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  数据源
                </a>
                <a href="/articles" className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  文章
                </a>
                <a href="/newsletters" className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  简报
                </a>
                <a href="/rss-converter" className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  RSS转换
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container py-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 mt-20">
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900">Newsletter Generator</span>
                </div>
                <p className="text-sm text-gray-600">
                  使用AI技术从你的数据源生成高质量的新闻简报。
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">功能</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>RSS/JSON数据源管理</li>
                  <li>智能文章筛选</li>
                  <li>AI驱动的内容生成</li>
                  <li>拖拽式简报编辑</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">技术栈</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Next.js 14 + React</li>
                  <li>Prisma + SQLite</li>
                  <li>Google Gemini AI</li>
                  <li>现代化CSS设计</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-500">
                © 2024 Newsletter Generator. 由 AI 驱动的智能内容生成平台。
              </p>
            </div>
          </div>
        </footer>
        
        {/* Mobile Menu Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const menuButton = document.getElementById('mobile-menu-button');
              const mobileMenu = document.getElementById('mobile-menu');
              
              if (menuButton && mobileMenu) {
                menuButton.addEventListener('click', function() {
                  const isHidden = mobileMenu.classList.contains('hidden');
                  if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                  } else {
                    mobileMenu.classList.add('hidden');
                  }
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(event) {
                  if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.add('hidden');
                  }
                });
              }
            });
          `
        }} />
      </body>
    </html>
  );
}
