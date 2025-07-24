// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/spatialty-web-app', // Use your actual repository name
  assetPrefix: '/spatialty-web-app/', // Use your actual repository name
  images: {
    unoptimized: true,
    path: '/spatialty-web-app/_next/image'  // Add this line
  },
}

export default nextConfig;  // Note: using export default instead of module.exports
