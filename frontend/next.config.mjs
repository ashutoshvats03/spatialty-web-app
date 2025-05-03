// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/speciality', // Optional, for GitHub Pages compatibility
};

module.exports = nextConfig;
