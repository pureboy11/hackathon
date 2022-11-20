/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["global-uploads.webflow.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "global-uploads.webflow.com",
        port: "",
        pathname: "/public/img/**",
      },
    ],
  },
};

module.exports = nextConfig;
