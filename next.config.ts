import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages: `next build` emits a fully static site to `out/`.
 * Served from the apex custom domain (zulfahmi.dev), so no basePath / assetPrefix is
 * needed. If this ever serves from <user>.github.io/<repo> instead, set both
 * basePath and assetPrefix to "/<repo>" or every asset 404s.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Emit folder/index.html per route so GitHub Pages serves clean URLs reliably
  // (e.g. /about/ -> out/about/index.html) without depending on extensionless lookup.
  trailingSlash: true,
};

export default nextConfig;
