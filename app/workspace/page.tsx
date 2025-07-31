"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Source {
  id: number;
  name: string;
  url: string;
  type: string;
  createdAt: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  filteredOut: boolean;
  sourceId: number;
  source?: { name: string };
}

export default function WorkspacePage() {
  // 状态管理
  const [sources, setSources] = useState<Source[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 筛选状态
  const [dateFilter, setDateFilter] = useState('all'); // all, 7days, 30days, custom
  const [keywordFilter, setKeywordFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  
  // 简报生成状态
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // 获取数据
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sourcesRes, articlesRes] = await Promise.all([
        fetch('/api/sources'),
        fetch('/api/articles')
      ]);
      
      if (sourcesRes.ok && articlesRes.ok) {
        const sourcesData = await sourcesRes.json();
        const articlesData = await articlesRes.json();
        setSources(sourcesData);
        setArticles(articlesData);
        setFilteredArticles(articlesData.filter((article: Article) => !article.filteredOut));
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 筛选文章
  useEffect(() => {
    let filtered = articles.filter(article => !article.filteredOut);
    
    // 日期筛选
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      if (dateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      } else if (dateFilter === 'custom' && customDateStart && customDateEnd) {
        const startDate = new Date(customDateStart);
        const endDate = new Date(customDateEnd);
        filtered = filtered.filter(article => {
          const articleDate = new Date(article.publishedAt);
          return articleDate >= startDate && articleDate <= endDate;
        });
      }
      
      if (dateFilter !== 'custom') {
        filtered = filtered.filter(article => {
          const articleDate = new Date(article.publishedAt);
          return articleDate >= filterDate;
        });
      }
    }
    
    // 关键词筛选
    if (keywordFilter) {
      const keywords = keywordFilter.toLowerCase().split(',').map(k => k.trim());
      filtered = filtered.filter(article => 
        keywords.some(keyword => 
          article.title.toLowerCase().includes(keyword) || 
          article.content.toLowerCase().includes(keyword)
        )
      );
    }
    
    // 数据源筛选
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(article => article.sourceId.toString() === sourceFilter);
    }
    
    // 排除已选文章
    const selectedIds = selectedArticles.map(a => a.id);
    filtered = filtered.filter(article => !selectedIds.includes(article.id));
    
    setFilteredArticles(filtered);
  }, [articles, dateFilter, keywordFilter, sourceFilter, customDateStart, customDateEnd, selectedArticles]);

  // 添加文章到已选列表
  const addArticle = (article: Article) => {
    setSelectedArticles(prev => [...prev, article]);
  };

  // 从已选列表移除文章
  const removeArticle = (articleId: number) => {
    setSelectedArticles(prev => prev.filter(a => a.id !== articleId));
  };

  // 拖拽排序
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedArticles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedArticles(items);
  };

  // 手动抓取
  const handleManualFetch = async () => {
    setMessage('正在抓取最新文章...');
    try {
      const response = await fetch('/api/cron/newsFetch');
      if (response.ok) {
        setMessage('✅ 抓取完成！');
        await fetchData();
      } else {
        setMessage('❌ 抓取失败');
      }
    } catch (error) {
      setMessage('❌ 抓取出错');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // 生成简报
  const handleGenerateNewsletter = async () => {
    if (!newsletterTitle.trim() || selectedArticles.length === 0) {
      setMessage('❌ 请输入标题并选择文章');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/newsletters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsletterTitle,
          articleIds: selectedArticles.map(a => a.id)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('✅ 简报生成成功！');
        setNewsletterTitle('');
        setSelectedArticles([]);
      } else {
        setMessage('❌ 简报生成失败');
      }
    } catch (error) {
      setMessage('❌ 生成出错');
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter 工作台</h1>
        <p className="text-gray-600">从数据源管理到简报生成的一站式工作流程</p>
      </div>

      {/* 数据源管理区域 */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">数据源管理</h2>
            </div>
            <button 
              onClick={handleManualFetch}
              className="btn btn-primary btn-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              手动抓取
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map((source) => (
              <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{source.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    source.type === 'rss' ? 'bg-orange-100 text-orange-600' :
                    source.type === 'json' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {source.type === 'scrape' ? '网页抓取' : source.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 break-all mb-2">{source.url}</p>
                <p className="text-xs text-gray-500">
                  创建于 {new Date(source.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {sources.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <p>暂无数据源</p>
                <a href="/sources" className="btn btn-primary mt-4">添加数据源</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 文章筛选和选择区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：文章筛选 */}
        <div className="card h-fit">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              文章筛选
              <span className="ml-2 px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {filteredArticles.length} 篇可选
              </span>
            </h3>
          </div>
          <div className="card-body space-y-4">
            {/* 筛选控件 */}
            <div className="space-y-3">
              {/* 日期筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 发布时间</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input mb-2"
                >
                  <option value="all">全部时间</option>
                  <option value="7days">最近7天</option>
                  <option value="30days">最近30天</option>
                  <option value="custom">自定义范围</option>
                </select>
                
                {dateFilter === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      className="input"
                      placeholder="开始日期"
                    />
                    <input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      className="input"
                      placeholder="结束日期"
                    />
                  </div>
                )}
              </div>

              {/* 关键词筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🔍 关键词搜索</label>
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  placeholder="输入关键词，多个关键词用逗号分隔"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">如：AI, 科技, 创新</p>
              </div>

              {/* 数据源筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📂 数据源</label>
                <select 
                  value={sourceFilter} 
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">全部数据源</option>
                  {sources.map(source => (
                    <option key={source.id} value={source.id.toString()}>{source.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 文章列表 */}
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {filteredArticles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-3">
                      <h4 className="font-medium text-gray-900 mb-1 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {article.content.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source?.name || '未知来源'}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addArticle(article)}
                      className="btn btn-primary btn-sm ml-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>没有找到符合条件的文章</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：已选文章 */}
        <div className="card h-fit">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              已选文章
              <span className="ml-2 px-3 py-1 text-xs font-medium bg-success-100 text-success-600 rounded-full">
                {selectedArticles.length} 篇
              </span>
            </h3>
          </div>
          <div className="card-body">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selected-articles">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"
                  >
                    {selectedArticles.map((article, index) => (
                      <Draggable key={article.id} draggableId={article.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border border-gray-200 rounded-lg p-4 ${
                              snapshot.isDragging ? 'shadow-lg bg-white' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <span className="w-6 h-6 bg-success-100 text-success-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1 leading-snug">
                                    {article.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                    {article.content.substring(0, 100)}...
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeArticle(article.id)}
                                className="text-gray-400 hover:text-error-600 ml-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {selectedArticles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="mb-2">还未选择任何文章</p>
                <p className="text-xs text-gray-400">从左侧选择文章开始编辑简报</p>
              </div>
            )}

            {selectedArticles.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  拖拽文章调整顺序
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 简报生成区域 */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            简报生成
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 简报信息 */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">简报标题</label>
                  <input
                    type="text"
                    value={newsletterTitle}
                    onChange={(e) => setNewsletterTitle(e.target.value)}
                    placeholder="例：每周科技要闻、财经资讯汇总"
                    className="input"
                    disabled={generating}
                  />
                </div>
                
                {message && (
                  <div className={`p-3 rounded-lg ${
                    message.includes('✅') ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="flex flex-col justify-center">
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>📝 已选择 <strong>{selectedArticles.length}</strong> 篇文章</p>
                  <p>🎯 {newsletterTitle.trim() ? '标题已设置' : '请输入标题'}</p>
                </div>
                <button
                  onClick={handleGenerateNewsletter}
                  disabled={generating || !newsletterTitle.trim() || selectedArticles.length === 0}
                  className="btn btn-success w-full py-3"
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      生成简报
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}