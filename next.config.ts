import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Allow the dev server to serve HMR and dev assets when the app is opened
  // from another device on the local network instead of localhost.
  allowedDevOrigins: ["192.168.1.*"],
  images: {
    // Next.js 16 only allows the qualities listed here; anything else is
    // silently coerced to the nearest entry and the optimizer rejects unknown
    // values with a 400. The brand loader asks for 85 and 60, so both need to
    // be spelled out rather than inherited from the `[75]` default.
    qualities: [60, 75, 85],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
