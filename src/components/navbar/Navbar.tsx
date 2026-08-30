"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VertexLogo from "@/components/logo/VertexLogo";

const NAV_LINKS = [
  {
    label: "Services",
    href:  "/services",
    mega: [
      { label: "CRM Automation & Lead Gen", href: "/services/crm-automation", desc: "Cold outreach, meeting booking, pipeline" },
      { label: "Data Analytics & BI",    href: "/services/analytics",     desc: "Real-time BI & intelligence"         },
      { label: "Web Development",        href: "/services/web-development", desc: "Fast, modern, built to convert"    },
      { label: "AI Knowledge Assistants", href: "/services/rag-chatbots", desc: "Cited answers from your documents"   },
      { label: "Voice AI Agents",        href: "/services/voice-ai",      desc: "Natural inbound & outbound calling"  },
      { label: "ML Engineering",         href: "/services/ml",            desc: "Predictive models that stay accurate" },
      { label: "Agentic AI",             href: "/services/agentic-ai",    desc: "Autonomous multi-agent pipelines"    },
      { label: "Computer Vision",        href: "/services/vision",        desc: "Visual perception at the edge"       },
      { label: "NLP & LLM Systems",      href: "/services/nlp",           desc: "Custom language model systems"       },
    ],
  },
  { label: "Process",      href: "/process",      mega: null },
  { label: "Case Studies", href: "/case-studies", mega: null },
  { label: "About",        href: "/about",        mega: null },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [megaOpen,    setMegaOpen]    = useState<string | null>(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Lock background scroll while the full-screen mobile menu is open, and
  // let Escape close it — without this the page behind the overlay still
  // scrolls, which feels broken on touch devices, and keyboard users had
  // no way to dismiss the menu without a mouse.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // A link is "active" if the current path matches it exactly, or is a
  // sub-route of it. Home is exact-match only, otherwise every link
  // would light up on every page.
  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false; // homepage anchors never count as a distinct page
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega  = (label: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(label); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(null), 160); };

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
        ${scrolled ? "bg-[#0a0c0b]/90 backdrop-blur-xl border-b border-[#1e2b28]/80 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-screen-xl mx-auto px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <VertexLogo size={28} withWordmark priority className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <li key={link.label}
                  onMouseEnter={() => link.mega && openMega(link.label)}
                  onMouseLeave={closeMega}
                  className="relative">
                  <Link href={link.href}
                    className={`text-sm transition-colors duration-200 flex items-center gap-1 py-2 relative
                      ${active ? "text-[#00e5b4] font-semibold" : "text-[#8aada8] hover:text-[#00e5b4]"}`}>
                    {link.label}
                    {link.mega && (
                      <svg className={`w-3 h-3 transition-transform duration-200 ${megaOpen === link.label ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                    {active && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#00e5b4]" />
                    )}
                  </Link>

                  {link.mega && megaOpen === link.label && (
                    <div onMouseEnter={() => openMega(link.label)} onMouseLeave={closeMega}
                      className="absolute top-full left-0 pt-3 w-[min(600px,calc(100vw-4rem))]">
                      <div className="bg-[#0d0f0e] border border-[#1e2b28] rounded-2xl p-5
                        shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
                        style={{ animation: "fadeSlide 0.2s ease forwards" }}>
                        <div className="grid grid-cols-3 gap-1">
                          {link.mega.map(item => (
                            <Link key={item.label} href={item.href}
                              className="group/i flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-[#161918] transition-colors">
                              <span className="text-sm font-semibold text-white group-hover/i:text-[#00e5b4] transition-colors">{item.label}</span>
                              <span className="text-xs text-[#3a5550]">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-[#1e2b28] mt-3 pt-3 px-4 flex items-center justify-between">
                          <span className="text-xs text-[#3a5550]">Not sure which fits? See the full breakdown.</span>
                          <Link href="/services" className="text-xs font-semibold text-[#00e5b4] hover:underline shrink-0 ml-4">
                            All services →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/projects" className="text-sm text-[#5a7570] hover:text-[#00e5b4] transition-colors">
              Explore our work
            </Link>
            <Link href="/#contact"
              className="text-sm font-bold bg-[#00e5b4] text-black px-5 py-2.5 rounded-lg
                hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.5)] transition-all duration-300">
              Book a call →
            </Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            className="lg:hidden flex flex-col gap-1.5 items-center justify-center w-8 h-8">
            <span className={`block h-px w-6 bg-[#00e5b4] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px w-6 bg-[#00e5b4] transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-[#00e5b4] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div id="mobile-nav-menu" className={`fixed inset-0 z-40 bg-[#0a0c0b] transition-all duration-500 flex flex-col pt-28 px-8
        ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}>
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.href);
            return (
              <Link key={link.label} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-4xl font-black tracking-tight py-4 border-b border-[#1e2b28] transition-colors
                  ${active ? "text-[#00e5b4]" : "text-white hover:text-[#00e5b4]"}`}
                style={{ transitionDelay: mobileOpen ? `${i * 70}ms` : "0ms" }}>
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pb-16">
          <Link href="/#contact" onClick={() => setMobileOpen(false)}
            className="block w-full text-center font-bold bg-[#00e5b4] text-black py-4 rounded-xl text-lg mt-8">
            Book a call →
          </Link>
        </div>
      </div>
    </>
  );
}
