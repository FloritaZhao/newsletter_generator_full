import { NextRequest, NextResponse } from 'next/server';
import { RSSGenerator, siteConfigs } from '@/lib/rssGenerator';

export async function GET(
  request: NextRequest,
  { params }: { params: { site: string } }
) {
  try {
    const { site } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const intelligent = searchParams.get('intelligent') === 'true';

    console.log(`RSS请求: ${site}, limit: ${limit}, intelligent: ${intelligent}`);

    // 检查网站配置是否存在
    if (!siteConfigs[site]) {
      return NextResponse.json(
        { error: `不支持的网站: ${site}` },
        { status: 400 }
      );
    }

    const generator = new RSSGenerator(site);
    const config = siteConfigs[site];
    
    // 确定要抓取的URL
    let scrapeUrl = config.baseUrl;
    
    // 针对不同网站的特定URL
    switch (site) {
      case 'a16z.com':
        scrapeUrl = 'https://a16z.com/news-content/';
        break;
      case 'techcrunch.com':
        scrapeUrl = 'https://techcrunch.com/';
        break;
      default:
        scrapeUrl = config.baseUrl;
    }

    console.log(`开始抓取: ${scrapeUrl}`);

    // 抓取文章
    let articles;
    if (intelligent) {
      articles = await generator.intelligentScrape(scrapeUrl, limit);
    } else {
      articles = await generator.scrapeArticles(scrapeUrl, limit);
    }

    if (articles.length === 0) {
      console.log('没有抓取到文章，尝试智能抓取...');
      articles = await generator.intelligentScrape(scrapeUrl, limit);
    }

    // 生成RSS
    const rssXml = generator.generateRSS(articles);

    console.log(`成功生成RSS，包含 ${articles.length} 篇文章`);

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800', // 缓存30分钟
      },
    });

  } catch (error: any) {
    console.error('RSS生成失败:', error);
    
    return NextResponse.json(
      { 
        error: 'RSS生成失败', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 支持的网站列表API
export async function OPTIONS() {
  const supportedSites = Object.keys(siteConfigs).map(site => ({
    site,
    name: siteConfigs[site].name,
    baseUrl: siteConfigs[site].baseUrl,
    rssUrl: `/api/rss/${site}`,
    intelligentUrl: `/api/rss/${site}?intelligent=true`
  }));

  return NextResponse.json({
    supportedSites,
    usage: {
      examples: [
        '/api/rss/a16z.com',
        '/api/rss/a16z.com?limit=20',
        '/api/rss/a16z.com?intelligent=true',
        '/api/rss/techcrunch.com?limit=15'
      ],
      parameters: {
        limit: 'Number of articles to fetch (default: 10)',
        intelligent: 'Use intelligent scraping when true (default: false)'
      }
    }
  });
}