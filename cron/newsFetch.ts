
import { prisma } from '../lib/prisma';
import { passesKeywordFilter } from '../lib/keywordFilter';
import { RSSGenerator, siteConfigs } from '../lib/rssGenerator';
import Parser from 'rss-parser';
import axios from 'axios';

export async function run() {
  console.log('🚀 新闻抓取任务开始');
  const parser = new Parser();
  const keywords = process.env.KEYWORDS || '';
  console.log('🔑 关键词筛选:', keywords);
  const sources = await prisma.source.findMany();
  console.log('📊 找到数据源数量:', sources.length);
  for (const source of sources) {
    console.log(`📍 处理数据源: ${source.name} (${source.type})`);
    try {
      if (source.type === 'rss') {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items) {
          const title = item.title ?? 'Untitled';
          const content = item.contentSnippet ?? item.content ?? '';
          const url = item.link ?? '';
          const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();
          if (await prisma.article.findFirst({ where: { url } })) continue;
          const ok = passesKeywordFilter({ title, content }, keywords);
          await prisma.article.create({
            data: { sourceId: source.id, title, url, content, publishedAt, filteredOut: !ok }
          });
        }
      } else if (source.type === 'json') {
        const res = await axios.get(source.url);
        const arr: any[] = res.data.items ?? res.data.articles ?? res.data;
        for (const it of arr) {
          const title = it.title ?? it.headline ?? 'Untitled';
          const content = it.content ?? it.description ?? '';
          const url = it.url ?? it.link ?? '';
          const publishedAt = it.publishedAt ? new Date(it.publishedAt) : new Date();
          if (await prisma.article.findFirst({ where: { url } })) continue;
          const ok = passesKeywordFilter({ title, content }, keywords);
          await prisma.article.create({
            data: { sourceId: source.id, title, url, content, publishedAt, filteredOut: !ok }
          });
        }
      } else if (source.type === 'scrape') {
        // 处理网页抓取类型的源
        console.log(`🕷️ 开始抓取网站: ${source.name} (${source.url})`);
        
        // 从URL中提取网站域名
        const urlObj = new URL(source.url);
        const siteDomain = urlObj.hostname;
        console.log(`🌐 网站域名: ${siteDomain}`);
        
        // 检查是否有匹配的网站配置
        const matchingSite = Object.keys(siteConfigs).find(site => 
          siteDomain.includes(site.replace('www.', '')) || site.includes(siteDomain.replace('www.', ''))
        );
        
        if (matchingSite) {
          console.log(`✅ 找到匹配的网站配置: ${matchingSite}`);
          try {
            const generator = new RSSGenerator(matchingSite);
            let articles;
            
            try {
              console.log('🎯 尝试使用配置的选择器抓取...');
              // 先尝试使用配置的选择器
              articles = await generator.scrapeArticles(source.url, 15);
              console.log(`📊 配置选择器抓取结果: ${articles.length} 篇文章`);
              
              // 如果配置选择器返回0篇文章，尝试智能抓取
              if (articles.length === 0) {
                console.log('⚠️ 配置选择器返回0篇文章，切换到智能抓取...');
                articles = await generator.intelligentScrape(source.url, 15);
                console.log(`✅ 智能抓取成功获取到 ${articles.length} 篇文章`);
              } else {
                console.log(`✅ 配置选择器成功抓取到 ${articles.length} 篇文章`);
              }
            } catch (err) {
              console.log('❌ 配置选择器失败，尝试智能抓取...', err.message);
              // 如果失败，使用智能抓取
              articles = await generator.intelligentScrape(source.url, 15);
              console.log(`✅ 智能抓取成功获取到 ${articles.length} 篇文章`);
            }
            
            console.log(`📄 总共抓取到 ${articles.length} 篇文章`);
            
            for (const article of articles) {
              console.log(`📝 处理文章: ${article.title.substring(0, 50)}...`);
              
              if (await prisma.article.findFirst({ where: { url: article.url } })) {
                console.log('⏭️ 文章已存在，跳过');
                continue;
              }
              
              const ok = passesKeywordFilter({ title: article.title, content: article.description }, keywords);
              console.log(`🔍 关键词筛选结果: ${ok ? '通过' : '未通过'}`);
              
              await prisma.article.create({
                data: { 
                  sourceId: source.id, 
                  title: article.title, 
                  url: article.url, 
                  content: article.description, 
                  publishedAt: article.publishedAt, 
                  filteredOut: !ok 
                }
              });
              console.log('💾 文章已保存到数据库');
            }
          } catch (scrapeError) {
            console.error(`❌ 抓取 ${source.name} 失败:`, scrapeError);
          }
        } else {
          console.log(`暂不支持的网站域名: ${siteDomain}`);
          
          // 尝试通用智能抓取
          try {
            // 创建一个临时配置用于智能抓取
            const tempGenerator = new RSSGenerator('a16z.com'); // 使用现有配置作为基础
            const articles = await tempGenerator.intelligentScrape(source.url, 10);
            
            console.log(`智能抓取到 ${articles.length} 篇文章`);
            
            for (const article of articles) {
              if (await prisma.article.findFirst({ where: { url: article.url } })) continue;
              
              const ok = passesKeywordFilter({ title: article.title, content: article.description }, keywords);
              await prisma.article.create({
                data: { 
                  sourceId: source.id, 
                  title: article.title, 
                  url: article.url, 
                  content: article.description, 
                  publishedAt: article.publishedAt, 
                  filteredOut: !ok 
                }
              });
            }
          } catch (intelligentError) {
            console.error(`智能抓取 ${source.name} 也失败:`, intelligentError);
          }
        }
      }
    } catch (err) {
      console.error('❌ 数据源处理出错:', err);
    }
  }
  console.log('🏁 新闻抓取任务完成');
  await prisma.$disconnect();
}

if (require.main === module) {
  run().catch((e) => { console.error(e); process.exit(1); });
}
