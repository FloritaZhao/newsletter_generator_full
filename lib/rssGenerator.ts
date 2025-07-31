import * as cheerio from 'cheerio';
import { Feed } from 'feed';
import axios from 'axios';

export interface ScrapedArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  author?: string;
  category?: string;
}

export interface SiteConfig {
  name: string;
  baseUrl: string;
  description: string;
  selectors: {
    article: string;
    title: string;
    description: string;
    url: string;
    date?: string;
    author?: string;
  };
  urlTransform?: (url: string, baseUrl: string) => string;
  dateTransform?: (dateStr: string) => Date;
}

// 网站配置
export const siteConfigs: Record<string, SiteConfig> = {
  'a16z.com': {
    name: 'Andreessen Horowitz',
    baseUrl: 'https://a16z.com',
    description: 'News and insights from Andreessen Horowitz',
    selectors: {
      article: 'article, .article-card, .card, .post, [data-testid*="post"], .content-item, .feed-item',
      title: 'h1, h2, h3, h4, .title, .headline, [class*="title"], [class*="headline"], [data-testid*="title"]',
      description: 'p, .excerpt, .summary, .description, [class*="excerpt"], [class*="description"], [class*="summary"]',
      url: 'a',
      date: 'time, .date, .published, [class*="date"], [class*="time"], [datetime]',
      author: '.author, .byline, [class*="author"], [class*="byline"]'
    },
    urlTransform: (url: string, baseUrl: string) => {
      if (url.startsWith('http')) return url;
      if (url.startsWith('/')) return baseUrl + url;
      return baseUrl + '/' + url;
    },
    dateTransform: (dateStr: string) => {
      // 尝试解析各种日期格式
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date() : date;
    }
  },
  'techcrunch.com': {
    name: 'TechCrunch',
    baseUrl: 'https://techcrunch.com',
    description: 'Startup and technology news',
    selectors: {
      article: '.post-block, article',
      title: '.post-block__title a, h2 a, h3 a',
      description: '.post-block__content, .excerpt',
      url: '.post-block__title a, h2 a, h3 a',
      date: '.post-block__meta time, time',
      author: '.post-block__meta .author, .author'
    }
  }
};

export class RSSGenerator {
  private config: SiteConfig;

  constructor(private siteName: string) {
    this.config = siteConfigs[siteName];
    if (!this.config) {
      throw new Error(`未找到网站配置: ${siteName}`);
    }
  }

  /**
   * 抓取网站内容
   */
  async scrapeArticles(url: string, limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      console.log(`正在抓取: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const articles: ScrapedArticle[] = [];

      // 使用配置的选择器抓取文章
      $(this.config.selectors.article).each((index, element) => {
        if (index >= limit) return false; // 限制数量

        const $article = $(element);
        
        // 提取标题
        const titleElement = $article.find(this.config.selectors.title).first();
        const title = titleElement.text()?.trim() || titleElement.attr('title')?.trim() || '';
        
        if (!title) return; // 跳过没有标题的项目

        // 提取描述
        const descElement = $article.find(this.config.selectors.description).first();
        let description = descElement.text()?.trim() || '';
        
        // 如果描述太长，截取前200字符
        if (description.length > 200) {
          description = description.substring(0, 200) + '...';
        }

        // 提取URL
        const urlElement = $article.find(this.config.selectors.url).first();
        let articleUrl = urlElement.attr('href') || '';
        
        if (articleUrl && this.config.urlTransform) {
          articleUrl = this.config.urlTransform(articleUrl, this.config.baseUrl);
        }

        if (!articleUrl) return; // 跳过没有URL的项目

        // 提取日期
        let publishedAt = new Date();
        if (this.config.selectors.date) {
          const dateElement = $article.find(this.config.selectors.date).first();
          const dateStr = dateElement.attr('datetime') || dateElement.text()?.trim() || '';
          
          if (dateStr && this.config.dateTransform) {
            publishedAt = this.config.dateTransform(dateStr);
          }
        }

        // 提取作者
        let author = '';
        if (this.config.selectors.author) {
          const authorElement = $article.find(this.config.selectors.author).first();
          author = authorElement.text()?.trim() || '';
        }

        articles.push({
          title,
          description,
          url: articleUrl,
          publishedAt,
          author: author || undefined
        });
      });

      console.log(`成功抓取到 ${articles.length} 篇文章`);
      return articles;

    } catch (error) {
      console.error(`抓取失败: ${url}`, error);
      throw error;
    }
  }

  /**
   * 生成RSS Feed
   */
  generateRSS(articles: ScrapedArticle[]): string {
    const feed = new Feed({
      title: this.config.name,
      description: this.config.description,
      id: this.config.baseUrl,
      link: this.config.baseUrl,
      language: 'en',
      image: `${this.config.baseUrl}/favicon.ico`,
      favicon: `${this.config.baseUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${this.config.name}`,
      updated: new Date(),
      generator: 'Newsletter Generator RSS Converter',
      feedLinks: {
        rss: `${this.config.baseUrl}/rss.xml`,
      },
      author: {
        name: this.config.name,
        link: this.config.baseUrl,
      }
    });

    // 添加文章
    articles.forEach(article => {
      feed.addItem({
        title: article.title,
        id: article.url,
        link: article.url,
        description: article.description,
        content: article.description,
        author: article.author ? [{ name: article.author }] : undefined,
        date: article.publishedAt,
      });
    });

    return feed.rss2();
  }

  /**
   * 智能抓取 - 尝试多个常见的内容区域
   */
  async intelligentScrape(url: string, limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const articles: ScrapedArticle[] = [];

      // 更全面的文章选择器，优化a16z.com的抓取
      const allPossibleSelectors = [
        // 标准文章结构
        'article',
        '.post', '.article', '.news-item', '.content-item',
        '[class*="post"]', '[class*="article"]', '[class*="news"]',
        
        // a16z特定结构
        '.card', '.featured-post', '.post-card', '.article-card',
        '[class*="card"]', '[class*="item"]', '[class*="content"]',
        
        // 更广泛的选择器
        'a[href*="/"]', // 链接
        'div:has(h1)', 'div:has(h2)', 'div:has(h3)', 'div:has(h4)',
        'li:has(h1)', 'li:has(h2)', 'li:has(h3)', 'li:has(h4)',
        
        // 通用容器
        '.grid > div', '.list-item', '.feed-item',
        '[data-testid]', '[class*="grid"] > div'
      ];

      const seenTitles = new Set();

      // 尝试多种选择器，收集更多文章
      for (const selector of allPossibleSelectors) {
        if (articles.length >= limit) break;
        
        try {
          const elements = $(selector);
          
          if (elements.length > 0) {
            console.log(`尝试选择器: ${selector} (找到 ${elements.length} 个元素)`);
            
            elements.each((index, element) => {
              if (articles.length >= limit) return false;

              const $element = $(element);
              
              // 查找标题 - 更全面的标题选择器
              const titleSelectors = [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                '.title', '.headline',
                '[class*="title"]', '[class*="headline"]', '[class*="heading"]',
                'a[href*="/"]' // 链接文本作为标题
              ];
              
              let title = '';
              let articleUrl = '';

              for (const titleSel of titleSelectors) {
                const titleEl = $element.find(titleSel).first();
                if (titleEl.length > 0) {
                  const potentialTitle = titleEl.text()?.trim() || '';
                  const href = titleEl.attr('href') || $element.find('a').first().attr('href');
                  
                  if (potentialTitle && potentialTitle.length > 10 && potentialTitle.length < 200) {
                    title = potentialTitle;
                    if (href) {
                      articleUrl = href.startsWith('http') ? href : 
                                  href.startsWith('/') ? this.config.baseUrl + href :
                                  this.config.baseUrl + '/' + href;
                    }
                    break;
                  }
                }
              }

              // 如果没找到标题，尝试直接从元素文本提取
              if (!title) {
                const elementText = $element.text()?.trim() || '';
                if (elementText.length > 10 && elementText.length < 300) {
                  const lines = elementText.split('\n').filter(line => line.trim().length > 10);
                  if (lines.length > 0) {
                    title = lines[0].trim();
                    const href = $element.find('a').first().attr('href');
                    if (href) {
                      articleUrl = href.startsWith('http') ? href : 
                                  href.startsWith('/') ? this.config.baseUrl + href :
                                  this.config.baseUrl + '/' + href;
                    }
                  }
                }
              }

              // 过滤掉导航菜单和其他非文章内容
              const blacklistKeywords = [
                'terms of use', 'privacy policy', 'about us', 'contact', 'menu', 'navigation',
                'sign in', 'sign up', 'login', 'register', 'subscribe', 'newsletter',
                'terms', 'privacy', 'cookie', 'home', 'back to', 'read more', 'continue reading',
                'share', 'tweet', 'facebook', 'linkedin', 'instagram', 'twitter',
                'portfolio', 'team', 'careers', 'jobs', 'legal', 'disclaimer'
              ];
              
              const titleLower = title.toLowerCase();
              const isBlacklisted = blacklistKeywords.some(keyword => 
                titleLower.includes(keyword) || titleLower === keyword
              );
              
              // 检查是否是有效文章标题 - 调整为更宽松的条件
              const isValidTitle = 
                title.length >= 10 && // 至少10个字符（降低要求）
                title.length <= 200 && // 不超过200个字符
                !isBlacklisted && // 不在黑名单中
                !seenTitles.has(titleLower) && // 未重复
                !/^(home|about|contact|menu|navigation)$/i.test(title) && // 不是常见导航项
                title.split(' ').length >= 2 && // 至少2个词（降低要求）
                !/^\s*$/.test(title); // 不是纯空白
              
              if (!isValidTitle) {
                return;
              }

              seenTitles.add(title.toLowerCase());

              // 查找描述
              const descSelectors = [
                'p', '.excerpt', '.description', '.summary', 
                '[class*="excerpt"]', '[class*="description"]', '[class*="summary"]'
              ];
              let description = '';
              
              for (const descSel of descSelectors) {
                const descEl = $element.find(descSel).first();
                if (descEl.length > 0) {
                  const potentialDesc = descEl.text()?.trim() || '';
                  if (potentialDesc.length > 20) {
                    description = potentialDesc;
                    break;
                  }
                }
              }

              // 如果没有找到描述，使用标题
              if (!description) {
                description = title;
              }

              if (description.length > 300) {
                description = description.substring(0, 300) + '...';
              }

              // 确保URL有效
              if (!articleUrl) {
                articleUrl = url; // 使用源URL作为fallback
              }

              articles.push({
                title,
                description,
                url: articleUrl,
                publishedAt: new Date(),
              });

              console.log(`✓ 找到文章: ${title.substring(0, 50)}...`);
            });
          }
        } catch (selectorError) {
          console.log(`选择器 ${selector} 失败:`, selectorError.message);
          continue;
        }
      }

      console.log(`智能抓取完成，共找到 ${articles.length} 篇文章`);
      return articles;

    } catch (error) {
      console.error('智能抓取失败:', error);
      throw error;
    }
  }
}