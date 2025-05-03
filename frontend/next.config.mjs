/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // for static export (if using GitHub Pages)
  trailingSlash: true, // for proper paths in GitHub Pages
  images: {
    unoptimized: true, // required for 'next export' if using <Image>
  },
};

export default nextConfig;

  // /** @type {import('next').NextConfig} */
  // const nextConfig = {
  //   output: 'export', // Assuming you are using static export for GitHub Pages
  //   basePath: '/spatialty', // Set the base path to your subdirectory name
  //   // ... other configurations
  // };

  // module.exports = nextConfig;