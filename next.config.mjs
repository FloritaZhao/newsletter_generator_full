
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['cheerio'],
  },
  webpack: (config, { isServer }) => {
    // 处理 undici 和其他 Node.js 模块的兼容性问题
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('undici');
    }
    
    // 处理 cheerio 和其他依赖
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;
