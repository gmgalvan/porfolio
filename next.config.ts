import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS to ./out,
  // which Netlify serves directly (no server runtime or plugin needed).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
