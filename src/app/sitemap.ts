import { MetadataRoute } from "next";
import { POSTS } from "./blog/posts";

/* ─────────────────────────────────────────────────────────────────────────
   Next.js auto-generates /sitemap.xml from this file — no manual XML,
   no extra package. Google and Bing fetch this automatically once your
   domain is live and submitted to Search Console / Bing Webmaster Tools.

   Static routes are listed by hand below, same as before. Dynamic routes
   (service detail pages, project detail pages, blog posts) are generated
   from the same slug lists the pages themselves render from, so this
   can't silently drift out of sync when a service or project is added.
───────────────────────────────────────────────────────────────────────── */

const BASE_URL = "https://vertexdata.systems";

// Keep in sync with the keys in src/app/services/[slug]/page.tsx's SERVICES object.
const SERVICE_SLUGS = [
  "crm-automation", "analytics", "web-development", "rag-chatbots",
  "voice-ai", "ml", "agentic-ai", "vision", "nlp",
];

// Keep in sync with the keys in src/app/projects/[slug]/page.tsx's PROJECTS object.
const PROJECT_SLUGS = [
  "agentic-support-system", "ai-security-audit", "analytics-platform-build",
  "data-warehouse-migration", "predictive-model-deployment",
  "rag-knowledge-assistant", "vision-quality-inspection",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "",              priority: 1.0, freq: "weekly"  as const },
    { path: "/services",     priority: 0.9, freq: "weekly"  as const },
    { path: "/projects",     priority: 0.8, freq: "weekly"  as const },
    { path: "/about",        priority: 0.7, freq: "monthly" as const },
    { path: "/process",      priority: 0.8, freq: "monthly" as const },
    { path: "/stack",        priority: 0.7, freq: "monthly" as const },
    { path: "/case-studies", priority: 0.9, freq: "weekly"  as const },
    { path: "/clients",      priority: 0.7, freq: "monthly" as const },
    { path: "/blog",         priority: 0.8, freq: "daily"   as const },
    { path: "/careers",      priority: 0.6, freq: "weekly"  as const },
    { path: "/contact",      priority: 0.9, freq: "monthly" as const },
    { path: "/faq",          priority: 0.6, freq: "monthly" as const },
    { path: "/resources",    priority: 0.7, freq: "weekly"  as const },
    { path: "/privacy",      priority: 0.3, freq: "yearly"  as const },
    { path: "/terms",        priority: 0.3, freq: "yearly"  as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map(slug => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = PROJECT_SLUGS.map(slug => ({
    url: `${BASE_URL}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...projectEntries, ...blogEntries];
}
