"use client";

import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   /terms — same disclaimer as privacy/page.tsx: structured starting
   template, not lawyer-reviewed. See that file's header comment.
───────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    title: "1. Agreement to terms",
    body: `By using this website, you agree to these terms. If you don't agree, please don't use the site. These terms apply to the website itself — a separate services agreement covers any actual project work.`,
  },
  {
    title: "2. Services",
    body: `Vertex Data Systems provides AI and data engineering services, including CRM automation, data analytics, web development, RAG-based knowledge assistants, voice AI agents, ML engineering, agentic AI systems, computer vision, and NLP/LLM systems. Specific project scope, pricing, and deliverables are agreed separately in writing before any work begins — nothing on this website constitutes a binding offer or quote.`,
  },
  {
    title: "3. No guaranteed outcomes",
    body: `We build systems to a high engineering standard, but we don't guarantee specific business outcomes (revenue increases, conversion rates, cost savings) unless explicitly committed to in a signed project agreement. Case studies and examples on this site describe real independent work and its actual, honestly-labeled status — not promises about what we'll deliver for you.`,
  },
  {
    title: "4. Intellectual property",
    body: `Content on this website (copy, design, logo) belongs to Vertex Data Systems. Code and deliverables from an actual client engagement are governed by that engagement's separate agreement — our standard approach is that you own what we build for you, source code included, as described on our services pages.`,
  },
  {
    title: "5. Acceptable use",
    body: `Don't use this website to submit false information, attempt to compromise its security, or use automated tools to scrape or spam the contact form. We reserve the right to block access from anyone doing so.`,
  },
  {
    title: "6. No warranty on the website itself",
    body: `This website is provided as-is. We work to keep it accurate and available, but we don't warrant it will be error-free or uninterrupted at all times.`,
  },
  {
    title: "7. Limitation of liability",
    body: `To the extent permitted by law, Vertex Data Systems isn't liable for indirect or consequential damages arising from your use of this website. This doesn't limit liability that can't be excluded by law.`,
  },
  {
    title: "8. Changes to these terms",
    body: `We may update these terms as the business evolves. Material changes will update the date below.`,
  },
  {
    title: "9. Contact",
    body: `Questions about these terms: hello@vertexdata.systems`,
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] min-h-screen">
      <section className="pt-36 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Legal</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black tracking-tight leading-none mb-6">
            Terms of Service
          </h1>
          <p className="text-[#5a7570] text-sm">Last updated: August 2026</p>

          <div className="mt-8 p-5 rounded-xl border border-[#00e5b4]/20 bg-[#00e5b4]/5">
            <p className="text-sm text-[#8aa39e] leading-relaxed">
              <strong className="text-[#00e5b4]">Note:</strong> this is a clearly-structured starting template, not lawyer-reviewed legal text. Have it reviewed before treating it as final, particularly Sections 3 and 7 once you have real client agreements in place.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 pb-28">
        <div className="max-w-3xl mx-auto space-y-10">
          {SECTIONS.map(s => (
            <div key={s.title}>
              <h2 className="text-lg font-black tracking-tight mb-3">{s.title}</h2>
              <p className="text-sm text-[#8aa39e] leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}

          <div className="pt-8 border-t border-[#1e2b28]">
            <Link href="/privacy" className="text-sm text-[#00e5b4] link-underline">
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
