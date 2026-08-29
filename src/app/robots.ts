import { MetadataRoute } from "next";

/* ─────────────────────────────────────────────────────────────────────────
   Auto-generates /robots.txt — tells search engine crawlers what they
   can index and points them to the sitemap.
───────────────────────────────────────────────────────────────────────── */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://vertexdata.systems/sitemap.xml",
  };
}
