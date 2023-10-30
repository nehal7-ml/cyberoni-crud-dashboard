/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
    images: {
        domains: [
          "lh3.googleusercontent.com",
          "res.cloudinary.com",
          "www.facebook.com",
          "www.google.com",
          "www.cjdropshipping.com/",
          "www.amazon.com",
          "example.com",
          "images.unsplash.com",
          "via.placeholder.com",
          "picsum.photos",
          "m.media-amazon.com"
        ],
      },
}

module.exports = nextConfig
