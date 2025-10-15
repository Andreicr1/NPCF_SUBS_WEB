const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Configurações específicas para Cloudflare Pages
  distDir: '.next',

  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  // Configuração para uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Configuração de headers CORS se necessário
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Webpack config para pdftk/fdf se necessário
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'pdf-lib': 'commonjs pdf-lib',
      });
    }

    // Garante que o alias '@' funcione em ambientes como Cloudflare Pages
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;