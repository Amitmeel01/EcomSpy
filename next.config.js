/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'm.media-amazon.com',
      'images-eu.ssl-images-amazon.com',
      'images-na.ssl-images-amazon.com', // Add this hostname
    ],
  },
};

module.exports = nextConfig;
