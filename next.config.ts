// next.config.ts
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // API proxy - يعيد توجيه جميع طلبات /api إلى السيرفر الحقيقي
        {
          source: '/api/:path*',
          destination: `https://app.baseqatbusiness.com/api/:path*`,
        },
      ],
      fallback: [
        {
          source: '/locales/:lng/:ns.json',
          destination: '/locales/:lng/:ns.json',
        },
      ],
    };
  },
};

module.exports = nextConfig;
