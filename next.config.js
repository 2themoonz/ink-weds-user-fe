/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "mir-s3-cdn-cf.behance.net"],
  },
  webpack: (config, { webpack, isServer, nextRuntime }) => {
    // Avoid AWS SDK Node.js require issue
    if (isServer && nextRuntime === "nodejs") {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
