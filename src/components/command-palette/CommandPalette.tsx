"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────
   CommandPalette

   Cmd/Ctrl+K opens a searchable list of every real route on the site,
   grouped by section. Every entry below is a route that actually exists —
   pulled from the real page/service/project/blog titles in the codebase,
   not placeholder content.
───────────────────────────────────────────────────────────────────────── */

interface Entry { label: string; href: string; group: string; }

const ENTRIES: Entry[] = [
  // Pages
  { label: "Home",        href: "/",             group: "Pages" },
  { label: "About",       href: "/about",        group: "Pages" },
  { label: "Services",    href: "/services",     group: "Pages" },
  { label: "Process",     href: "/process",      group: "Pages" },
  { label: "Projects",    href: "/projects",     group: "Pages" },
  { label: "Case Studies",href: "/case-studies", group: "Pages" },
  { label: "Tech Stack",  href: "/stack",        group: "Pages" },
  { label: "Clients",     href: "/clients",      group: "Pages" },
  { label: "Blog",        href: "/blog",         group: "Pages" },
  { label: "FAQ",         href: "/faq",          group: "Pages" },
  { label: "Resources",   href: "/resources",    group: "Pages" },
  { label: "Careers",     href: "/careers",      group: "Pages" },
  { label: "Contact",     href: "/contact",      group: "Pages" },

  // Services
  { label: "CRM Automation & Lead Generation",         href: "/services/crm-automation", group: "Services" },
  { label: "Data Analytics & BI",                      href: "/services/analytics",      group: "Services" },
  { label: "Web Development",                          href: "/services/web-development",group: "Services" },
  { label: "AI Knowledge Assistants (RAG Chatbots)",   href: "/services/rag-chatbots",   group: "Services" },
  { label: "Voice AI Agents",                          href: "/services/voice-ai",       group: "Services" },
  { label: "ML Engineering & Predictive Analytics",    href: "/services/ml",             group: "Services" },
  { label: "Agentic AI & Automation",                  href: "/services/agentic-ai",     group: "Services" },
  { label: "Computer Vision",                          href: "/services/vision",         group: "Services" },
  { label: "NLP & LLM Systems",                        href: "/services/nlp",            group: "Services" },

  // Projects
  { label: "Analytics & BI Platform Build",            href: "/projects/analytics-platform-build",  group: "Projects" },
  { label: "Data Warehouse Migration",                 href: "/projects/data-warehouse-migration",  group: "Projects" },
  { label: "Predictive Model Deployment",              href: "/projects/predictive-model-deployment", group: "Projects" },
  { label: "Agentic Support Automation",               href: "/projects/agentic-support-system",    group: "Projects" },
  { label: "RAG Knowledge Assistant",                  href: "/projects/rag-knowledge-assistant",   group: "Projects" },
  { label: "Vision-Based Quality Inspection",          href: "/projects/vision-quality-inspection", group: "Projects" },
  { label: "CRM for Property Developers",              href: "/projects/property-developer-crm",    group: "Projects" },
  { label: "CRM for Schools & Educational Institutions", href: "/projects/school-management-crm",   group: "Projects" },

  // Case Studies
  { label: "AI Voice Agent Platform",         href: "/case-studies/voice-agent-platform", group: "Case Studies" },
  { label: "AI Interviewer",                  href: "/case-studies/ai-interviewer",      group: "Case Studies" },
  { label: "AI Job Hunter (CareerGPT)",       href: "/case-studies/career-gpt",          group: "Case Studies" },
  { label: "Multi-Cancer Detection System",   href: "/case-studies/cancer-detection",    group: "Case Studies" },

  // Blog
  { label: "Why 2026 is the year agentic AI stops being a demo and starts being infrastructure", href: "/blog/agentic-ai-enterprise-2026", group: "Blog" },
  { label: "RAG vs fine-tuning in 2026: a practitioner's honest guide",                           href: "/blog/rag-vs-finetuning-2026",     group: "Blog" },
  { label: "Data mesh vs data lake vs data lakehouse: which one does your business actually need",href: "/blog/data-mesh-vs-data-lake",     group: "Blog" },
  { label: "OWASP LLM Top 10: what it means for your production deployment right now",            href: "/blog/llm-security-owasp-top10",   group: "Blog" },
  { label: "Your model was great on launch day. Here's why it's quietly failing right now",       href: "/blog/mlops-drift-detection",      group: "Blog" },
  { label: "Synthetic data for computer vision: scaling rare-defect detection when real examples don't exist", href: "/blog/computer-vision-synthetic-data", group: "Blog" },
];

const GROUP_ORDER = ["Pages", "Services", "Projects", "Case Studies", "Blog"];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerElRef = useRef<Element | null>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q === "" ? ENTRIES : ENTRIES.filter(e => e.label.toLowerCase().includes(q) || e.group.toLowerCase().includes(q));
    return GROUP_ORDER
      .map(group => ({ group, items: matches.filter(m => m.group === group) }))
      .filter(g => g.items.length > 0);
  }, [query]);

  const flatResults = useMemo(() => results.flatMap(g => g.items), [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    (triggerElRef.current as HTMLElement | null)?.focus?.();
  }, []);

  const openPalette = useCallback(() => {
    triggerElRef.current = document.activeElement;
    setOpen(true);
  }, []);

  // Global Cmd/Ctrl+K toggle, plus a custom event so other components
  // (e.g. a visible navbar trigger) can open this without shared state.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => { if (!o) triggerElRef.current = document.activeElement; return !o; });
      }
    };
    const onCustomOpen = () => openPalette();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("vertex:open-command-palette", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("vertex:open-command-palette", onCustomOpen);
    };
  }, [openPalette]);

  // Focus the input on open, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const navigate = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDownInPalette = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatResults.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter") { e.preventDefault(); const hit = flatResults[activeIndex]; if (hit) navigate(hit.href); return; }
  };

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[12vh] px-4"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl shadow-2xl overflow-hidden"
        onKeyDown={onKeyDownInPalette}
      >
        <div className="flex items-center gap-3 border-b border-[#1e2b28] px-5 py-4">
          <span className="text-[#00e5b4] font-mono text-sm">/</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a page, service, project, or post…"
            aria-label="Search"
            className="flex-1 bg-transparent outline-none text-[#f0f5f3] placeholder:text-[#3a5550] text-sm"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono text-[#3a5550] border border-[#2a3d38] rounded px-1.5 py-0.5">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
          {flatResults.length === 0 && (
            <p className="px-5 py-6 text-sm text-[#5a7570]">No matches for &ldquo;{query}&rdquo;.</p>
          )}
          {results.map(({ group, items }) => (
            <div key={group} className="mb-2 last:mb-0">
              <p className="px-5 pt-3 pb-1 text-[10px] tracking-[0.15em] uppercase text-[#3a5550]">{group}</p>
              {items.map((item) => {
                runningIndex += 1;
                const idx = runningIndex;
                const active = idx === activeIndex;
                return (
                  <button
                    key={item.href}
                    data-index={idx}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                      active ? "bg-[#00e5b4]/10 text-[#f0f5f3]" : "text-[#8aa39e]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
