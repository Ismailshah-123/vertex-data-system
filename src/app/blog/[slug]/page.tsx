import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "../posts";

/* ─────────────────────────────────────────────────────────────────────────
   /blog/[slug]

   Every post card on /blog links here. Full long-form article bodies
   haven't been written yet — rather than either 404 (dead link) or fake a
   complete article, this renders the real title/excerpt/metadata plus an
   honest "in progress" note. Swap the panel below for real article content
   as each post gets written; the route, metadata, and SEO plumbing are
   already correct.
───────────────────────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  const url = `https://vertexdata.systems/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] min-h-screen">
      <article className="max-w-2xl mx-auto px-8 pt-40 pb-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-[#5a7570] hover:text-[#00e5b4] transition-colors duration-200 mb-10"
        >
          ← All posts
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border"
            style={{ borderColor: `${post.accentColor}40`, color: post.accentColor }}
          >
            {post.category}
          </span>
          <span className="text-[10px] text-[#3a5550]">{post.readTime}</span>
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-black tracking-tight leading-[1.05] mb-8">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-[#1e2b28]">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
            style={{ background: `${post.accentColor}15`, border: `1px solid ${post.accentColor}30`, color: post.accentColor }}
          >
            {post.author.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{post.author.name}, {post.author.role}</div>
            <div className="text-xs text-[#3a5550]">{post.date}</div>
          </div>
        </div>

        <p className="text-lg text-[#c8d8d4] leading-relaxed mb-10">
          {post.excerpt}
        </p>

        <div className="bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-8 mb-12">
          <p className="text-sm text-[#5a7570] leading-relaxed">
            The full write-up for this one is still being finished. Want to talk through it now instead of waiting? Reach out directly and I'll walk you through it.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((t) => (
            <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-[#1e2b28] text-[#5a7570]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#00e5b4] text-black font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-white transition-all duration-300"
          >
            Talk to Ismail →
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 border border-[#1e2b28] text-[#8aada8] font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-[#2a3d38] transition-all duration-300"
          >
            Browse all posts
          </Link>
        </div>
      </article>
    </main>
  );
}
