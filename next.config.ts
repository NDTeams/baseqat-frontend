// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/locales/:lng/:ns.json',
        destination: '/locales/:lng/:ns.json',
      },
    ];
  },
};

module.exports = nextConfig;
