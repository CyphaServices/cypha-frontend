import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    return [
      // Hub shorthands (optional)
      { source: "/", destination: "/index.html", permanent: false },

      // Bingo pretty paths
      { source: "/bingo",      destination: "https://api.cyphaent.com/client.html", permanent: false },
      { source: "/bingo/host", destination: "https://api.cyphaent.com/host.html",   permanent: false },

      // (Optional) legacy LAN links that might still exist in old pages/apps
      { source: "/client.html", destination: "https://api.cyphaent.com/client.html", permanent: false },
      { source: "/host.html",   destination: "https://api.cyphaent.com/host.html",   permanent: false },
    ];
  },

    // Optional: caching headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;