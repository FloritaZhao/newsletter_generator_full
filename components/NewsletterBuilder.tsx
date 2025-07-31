
"use client";
import React, { useState, useTransition } from 'react';
import { DraggableList, DraggableCard } from './DraggableCard';
import { createNewsletterAction } from '@/app/newsletters/actions';

export interface Article { id:number; title:string; url:string; content:string; publishedAt:string; }
export interface Newsletter { id:number; title:string; createdAt:string; }

export default function Builder({ availableArticles, newsletters }:{ availableArticles:Article[]; newsletters:Newsletter[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');

  const avail = availableArticles.filter(a=>!selected.includes(a.id));
  const chosen = availableArticles.filter(a=>selected.includes(a.id));

  function reorder(ids:string[]){ setSelected(ids.map(Number)); }

  function submit(e:React.FormEvent){
    e.preventDefault();
    if(!title||selected.length===0){ 
      setMsg('请输入简报标题并选择至少一篇文章'); 
      return;
    }
    start(async()=>{
      setMsg('正在生成简报，请稍候...');
      await createNewsletterAction(title, selected);
      setMsg('简报生成成功！');
      setSelected([]); 
      setTitle('');
      setTimeout(() => setMsg(''), 3000);
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">简报编辑器</h1>
        <p className="text-gray-600">选择文章并通过拖拽调整顺序，一键生成专业简报</p>
      </div>

      {/* Newsletter Form */}
      <form onSubmit={submit} className="space-y-8">
        {/* Title Input */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">简报信息</h3>
          </div>
          <div className="card-body">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">简报标题</label>
              <input 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                placeholder="例：每周科技要闻、财经资讯汇总" 
                className="input"
                disabled={pending}
              />
              <p className="text-xs text-gray-500 mt-1">为您的简报起一个吸引人的标题</p>
              </div>
          </div>
        </div>

        {/* Article Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Articles */}
          <div className="card h-fit">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                  可用文章
                </h3>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {avail.length} 篇
                </span>
              </div>
            </div>
            <div className="card-body">
              {avail.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p className="text-sm text-gray-500">所有文章都已添加到简报中</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {avail.map(article=>(
                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <h4 className="font-medium text-gray-900 text-sm leading-snug mb-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {article.content.slice(0, 120)}...
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={()=>setSelected([...selected,article.id])} 
                          className="btn btn-primary btn-sm"
                          disabled={pending}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                          添加
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Articles */}
          <div className="card h-fit">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  已选文章
                </h3>
                <span className="px-3 py-1 text-xs font-medium bg-success-100 text-success-600 rounded-full">
                  {chosen.length} 篇
                </span>
              </div>
              {chosen.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">拖拽调整文章顺序</p>
              )}
            </div>
            <div className="card-body">
              {chosen.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">还未选择任何文章</p>
                  <p className="text-xs text-gray-400">从左侧选择文章开始编辑简报</p>
                </div>
              ) : (
                <DraggableList items={selected.map(String)} onReorder={reorder}>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {chosen.map((article, index) => (
                      <DraggableCard key={article.id.toString()} id={article.id.toString()}>
                        <div className="border border-success-200 rounded-lg p-4 bg-success-50 hover:bg-success-100 transition">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex items-center justify-center w-6 h-6 bg-success-600 text-white text-xs font-bold rounded-full">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm leading-snug mb-2">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {article.content.slice(0, 100)}...
                                </p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                  </svg>
                                  拖拽排序
                                </div>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={()=>setSelected(selected.filter(id=>id!==article.id))} 
                              className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-md transition"
                              title="移除文章"
                              disabled={pending}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                    </div>
                  </DraggableCard>
                ))}
                  </div>
                </DraggableList>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">准备生成简报</h3>
                <p className="text-sm text-gray-600">
                  已选择 {chosen.length} 篇文章，{title ? `标题：${title}` : '请输入标题'}
                </p>
              </div>
              <button 
                className="btn btn-success px-8 py-3 text-base" 
                disabled={pending || !title || chosen.length === 0}
              >
                {pending ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    生成简报
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`card ${msg.includes('成功') ? 'border-success-200 bg-success-50' : msg.includes('请') ? 'border-error-200 bg-error-50' : 'border-primary-200 bg-primary-50'}`}>
            <div className="card-body py-3">
              <div className="flex items-center">
                {msg.includes('成功') ? (
                  <svg className="w-5 h-5 mr-2 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ) : msg.includes('请') ? (
                  <svg className="w-5 h-5 mr-2 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span className={`text-sm font-medium ${msg.includes('成功') ? 'text-success-700' : msg.includes('请') ? 'text-error-700' : 'text-primary-700'}`}>
                  {msg}
                </span>
              </div>
        </div>
      </div>
        )}
    </form>

      {/* Recent Newsletters */}
      {newsletters.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">最近的简报</h3>
            <p className="text-sm text-gray-600 mt-1">查看您之前创建的简报</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsletters.slice(0, 6).map(newsletter => (
                <a 
                  key={newsletter.id} 
                  href={`/newsletters/${newsletter.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition flex-1">
                      {newsletter.title}
                    </h4>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M10 6l4-4 4 4M14 2v12" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    创建于 {new Date(newsletter.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      AI生成
                    </span>
                    <span className="text-xs text-primary-600 group-hover:text-primary-700 font-medium">
                      点击查看 →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
