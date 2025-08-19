import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Hub shorthands (optional)
      { source: "/", destination: "/hub/index.html", permanent: false },

      // Bingo pretty paths
      { source: "/bingo",      destination: "https://api.cyphaent.com/client.html", permanent: false },
      { source: "/bingo/host", destination: "https://api.cyphaent.com/host.html",   permanent: false },

      // (Optional) legacy LAN links that might still exist in old pages/apps
      { source: "/client.html", destination: "https://api.cyphaent.com/client.html", permanent: false },
      { source: "/host.html",   destination: "https://api.cyphaent.com/host.html",   permanent: false },
    ];
  },
};

export default nextConfig;