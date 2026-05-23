import type { MetadataRoute } from "next";
import { SITE } from "./_data/site";
import { PROJECTS } from "./_data/projects";

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
