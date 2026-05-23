import type { MetadataRoute } from "next";
import { SITE } from "./_data/site";
import { PROJECTS } from "./_data/projects";

// Emit a static sitemap.xml at build time (required under output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/work", "/about", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
  }));
  const projects = PROJECTS.map((project) => ({
    url: `${SITE.url}/work/${project.slug}`,
    lastModified: now,
  }));
  return [...pages, ...projects];
}
