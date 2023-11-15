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
      async headers() {
        return [
          {
            // matching all API routes
            source: "/api/:path*",
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: "*" },
              { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
              { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
          }
        ]
      }
}

module.exports = nextConfig
