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
  // ... other options you like
});

const nextConfig = {
  reactStrictMode: true,
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
      "numero.s3.gra.io.cloud.ovh.net"
    ]
  },

  publicRuntimeConfig: {
    NEXTAUTH_URL: process.env?.NEXTAUTH_URL,
    APP_URL: process.env?.APP_URL,
    API_URL: process.env?.API_URL,
    SITE_URL: process.env?.SITE_URL
  }
};

module.exports = withPWA(withNextIntl(nextConfig));
