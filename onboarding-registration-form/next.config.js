/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  outputFileTracingRoot: require('path').join(__dirname, '../'),
};

module.exports = nextConfig;