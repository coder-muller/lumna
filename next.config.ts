import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "804f-2804-11d4-fffb-6100-2052-a68e-8f79-9e5.ngrok-free.app",
  ],
}

export default nextConfig
