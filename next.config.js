/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")();
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true
  }
});

const isDev = process.env.NODE_ENV === "development";
const domain = isDev
  ? "http://localhost:3000"
  : process.env?.NEXTAUTH_URL;

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/storage/:path*",
        destination: `${process.env?.OVH_PUBLIC_URL}/:path*`
      }
    ];
  },

  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "picsum.photos",
      "s3.fr-par.scw.cloud",
      "cloud.ovh.net",
      "numero.s3.sbg.io.cloud.ovh.net",
      "loremflickr.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloud.ovh.net",
        port: "",
        pathname: "/**"
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT"
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ];
  },

  publicRuntimeConfig: {
    NEXTAUTH_URL: domain,
    APP_URL: domain,
    API_URL: `${domain}/api`,
    SITE_URL: domain,
    API_BASE_URL: domain
  }
};

module.exports = withPWA(withNextIntl(nextConfig));
