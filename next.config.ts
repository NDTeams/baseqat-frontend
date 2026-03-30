// next.config.ts
const nextConfig = {
  async rewrites() {
    // استخدام API محلي للتطوير أو API الإنتاج
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5139';

    return {
      beforeFiles: [
        // API proxy - يعيد توجيه جميع طلبات /api إلى السيرفر
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
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
