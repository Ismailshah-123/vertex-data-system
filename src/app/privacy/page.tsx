"use client";

import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   /privacy

   This is a structured starting template, not lawyer-reviewed legal text.
   It accurately describes what this codebase actually does (contact form
   fields collected, Resend used for email delivery, no analytics wired up
   yet as of this writing) rather than generic boilerplate or invented
   specifics. Have an actual lawyer review before treating this as final —
   flagged clearly on the page itself, not just in this comment.
───────────────────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    title: "1. Who we are",
    body: `Vertex Data Systems ("we," "us," "our") provides AI and data engineering services. This policy explains what information we collect through this website, why, and what you can do about it.`,
  },
  {
    title: "2. Information we collect",
    body: `When you submit our contact form, we collect your name, email address, company name, the service you're interested in, budget range, timeline, and the description you provide of your project. We don't ask for anything beyond what's needed to respond to your inquiry.

We don't currently run analytics or advertising tracking on this site. If that changes, this section will be updated to name the specific tool and what it collects before it goes live — not after.`,
  },
  {
    title: "3. How we use it",
    body: `Solely to respond to your inquiry and, if you become a client, to deliver the work. We don't sell, rent, or share your information with third parties for marketing purposes — full stop.`,
  },
  {
    title: "4. Cookies",
    body: `This site does not currently set marketing or tracking cookies. Any cookies used are strictly functional (for example, remembering your place in a multi-step form) and don't identify you personally or track you across other sites.`,
  },
  {
    title: "5. Third-party services",
    body: `Contact form submissions are delivered via Resend (resend.com), an email API provider, solely to get your message to our inbox. We don't share your data with them for any other purpose. If we add other third-party tools that process visitor data in the future, they'll be listed here.`,
  },
  {
    title: "6. Data retention",
    body: `We keep contact form submissions for as long as reasonably needed to respond to your inquiry and, if we engage on a project, for the duration of that engagement plus standard business record-keeping. You can ask us to delete your data at any time — see Section 8.`,
  },
  {
    title: "7. Security",
    body: `This site is served over HTTPS, and our contact form includes server-side validation, bot-submission filtering, and input sanitization before anything reaches our inbox. No system is unbreakable, but we don't collect more than we need, which limits what there is to protect.`,
  },
  {
    title: "8. Your rights",
    body: `You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Email hello@vertexdata.systems and we'll respond within a reasonable timeframe. If you're in the EU/UK, this reflects your rights under GDPR; if you're in California, under the CCPA — we intend to honor these regardless of where you're located.`,
  },
  {
    title: "9. Changes to this policy",
    body: `If this policy changes materially, we'll update the date below. We won't quietly narrow your rights without telling you.`,
  },
  {
    title: "10. Contact",
    body: `Questions about this policy: hello@vertexdata.systems`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] min-h-screen">
      <section className="pt-36 pb-16 px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#00e5b4] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Legal</p>
          <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black tracking-tight leading-none mb-6">
            Privacy Policy
          </h1>
          <p className="text-[#5a7570] text-sm">Last updated: August 2026</p>

          <div className="mt-8 p-5 rounded-xl border border-[#00e5b4]/20 bg-[#00e5b4]/5">
            <p className="text-sm text-[#8aa39e] leading-relaxed">
              <strong className="text-[#00e5b4]">Note:</strong> this is a clearly-structured starting template that accurately reflects what this site currently does — it hasn't been reviewed by a lawyer yet. Have it reviewed before treating it as final, especially if you start processing data beyond what's described below.
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
            <Link href="/terms" className="text-sm text-[#00e5b4] link-underline">
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
