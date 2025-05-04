// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/speciality', // Use your actual repository name
  assetPrefix: '/speciality/', // Use your actual repository name
  images: {
    unoptimized: true,
    path: '/speciality/_next/image'  // Add this line
  },
}

export default nextConfig;  // Note: using export default instead of module.exports
