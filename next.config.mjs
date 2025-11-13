/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/pas_proj_ver1',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
