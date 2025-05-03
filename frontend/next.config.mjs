
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

