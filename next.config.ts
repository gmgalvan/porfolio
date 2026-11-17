import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` reads the CV from data/*.json and writes
  // plain HTML/CSS to ./out, which Netlify serves directly.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
