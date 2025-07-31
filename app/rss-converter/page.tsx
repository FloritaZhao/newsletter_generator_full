"use client";
import { useState, useEffect } from 'react';

interface SupportedSite {
  site: string;
  name: string;
  baseUrl: string;
  rssUrl: string;
  intelligentUrl: string;
}

interface ConversionStatus {
  site: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  articles: number;
  error?: string;
  previewUrl?: string;
}

export default function RSSConverterPage() {
  const [supportedSites, setSupportedSites] = useState<SupportedSite[]>([]);
  const [conversionStatus, setConversionStatus] = useState<Record<string, ConversionStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportedSites();
  }, []);

  const fetchSupportedSites = async () => {
    try {
      const response = await fetch('/api/rss/options', { method: 'OPTIONS' });
      const data = await response.json();
      setSupportedSites(data.supportedSites || []);
    } catch (error) {
      console.error('获取支持的网站失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConversion = async (site: string, intelligent: boolean = false) => {
    setConversionStatus(prev => ({
      ...prev,
      [site]: { site, status: 'loading', articles: 0 }
    }));

    try {
      const url = intelligent ? `/api/rss/${site}?intelligent=true&limit=5` : `/api/rss/${site}?limit=5`;
      const response = await fetch(url);
      
      if (response.ok) {
        const rssXml = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(rssXml, 'text/xml');
        const items = doc.querySelectorAll('item');
        
        setConversionStatus(prev => ({
          ...prev,
          [site]: {
            site,
            status: 'success',
            articles: items.length,
            previewUrl: url
          }
        }));
      } else {
        const errorData = await response.json();
        setConversionStatus(prev => ({
          ...prev,
          [site]: {
            site,
            status: 'error',
            articles: 0,
            error: errorData.error || '转换失败'
          }
        }));
      }
    } catch (error: any) {
      setConversionStatus(prev => ({
        ...prev,
        [site]: {
          site,
          status: 'error',
          articles: 0,
          error: error.message || '网络错误'
        }
      }));
    }
  };

  const openRSSPreview = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RSS转换器管理</h1>
        <p className="text-gray-600">测试和管理网页到RSS的转换功能</p>
      </div>

      {/* Usage Instructions */}
      <div className="bg-primary-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 className="font-semibold text-primary-900 mb-2">使用说明</h3>
            <div className="text-sm text-primary-700 space-y-2">
              <p>• <strong>标准转换</strong>：使用预配置的选择器，适合已优化的网站</p>
              <p>• <strong>智能转换</strong>：使用AI智能识别，适合未配置的网站</p>
              <p>• 测试成功后，可以在数据源页面添加对应的URL并选择"网页抓取"类型</p>
              <p>• RSS接口地址：<code className="bg-white px-2 py-1 rounded">/api/rss/[site]</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Sites List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">支持的网站</h2>
        
        {supportedSites.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-8">
              <p className="text-gray-500">暂无支持的网站配置</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {supportedSites.map((site) => {
              const status = conversionStatus[site.site];
              
              return (
                <div key={site.site} className="card">
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{site.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {site.site}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{site.baseUrl}</p>
                  </div>
                  
                  <div className="card-body space-y-4">
                    {/* Status Display */}
                    {status && (
                      <div className={`p-3 rounded-lg ${
                        status.status === 'success' ? 'bg-success-50 border border-success-200' :
                        status.status === 'error' ? 'bg-error-50 border border-error-200' :
                        'bg-primary-50 border border-primary-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {status.status === 'loading' && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                          )}
                          {status.status === 'success' && (
                            <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                          {status.status === 'error' && (
                            <svg className="w-4 h-4 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          )}
                          
                          <span className={`text-sm font-medium ${
                            status.status === 'success' ? 'text-success-700' :
                            status.status === 'error' ? 'text-error-700' :
                            'text-primary-700'
                          }`}>
                            {status.status === 'loading' && '转换中...'}
                            {status.status === 'success' && `成功获取 ${status.articles} 篇文章`}
                            {status.status === 'error' && `失败: ${status.error}`}
                          </span>
                        </div>
                        
                        {status.status === 'success' && status.previewUrl && (
                          <button
                            onClick={() => openRSSPreview(status.previewUrl!)}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 underline"
                          >
                            查看RSS预览
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => testConversion(site.site, false)}
                        disabled={status?.status === 'loading'}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        标准转换测试
                      </button>
                      <button
                        onClick={() => testConversion(site.site, true)}
                        disabled={status?.status === 'loading'}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        智能转换测试
                      </button>
                    </div>

                    {/* RSS URLs */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>RSS地址: <code className="bg-gray-100 px-1 rounded">{site.rssUrl}</code></div>
                      <div>智能RSS: <code className="bg-gray-100 px-1 rounded">{site.intelligentUrl}</code></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Example Usage */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">示例用法</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">1. 测试RSS转换</h4>
            <p className="text-sm text-gray-600 mb-2">先在这里测试网站的RSS转换效果</p>
            <div className="bg-white p-3 rounded border text-xs font-mono">
              点击"标准转换测试"或"智能转换测试"
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">2. 添加到数据源</h4>
            <p className="text-sm text-gray-600 mb-2">测试成功后，添加到数据源管理</p>
            <div className="bg-white p-3 rounded border text-xs font-mono">
              数据源页面 → 类型选择"网页抓取" → 输入网站URL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}