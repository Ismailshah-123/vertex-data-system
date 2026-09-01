"use client";

import Link from "next/link";
import { useReveal } from "@/hooks";
import VertexLogo from "@/components/logo/VertexLogo";

// Real, verified professional profiles — not the placeholder social
// links that were removed earlier in this project's history.
const PROFESSIONAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ismail-shah-57b425327/" },
  { label: "Upwork",   href: "https://www.upwork.com/freelancers/~01b4aafea43abec20a" },
  { label: "Fiverr",   href: "https://www.fiverr.com/users/isamil67" },
];

const COLS = [
  {
    title: "Services",
    links: [
      { label: "CRM Automation & Lead Gen", href: "/services/crm-automation" },
      { label: "Data Analytics & BI",  href: "/services/analytics"     },
      { label: "Web Development",      href: "/services/web-development" },
      { label: "AI Knowledge Assistants", href: "/services/rag-chatbots" },
      { label: "Voice AI Agents",      href: "/services/voice-ai"      },
      { label: "Agentic AI",           href: "/services/agentic-ai"    },
      { label: "All services",         href: "/services"               },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",     href: "/about"        },
      { label: "Our Team",     href: "/about#team"   },
      { label: "Projects",     href: "/projects"     },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers",      href: "/careers"      },
      { label: "Blog",         href: "/blog"         },
      { label: "Contact",      href: "/#contact"     },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation",   href: "/resources"  },
      { label: "Technology Stack", href: "/stack"     },
      { label: "FAQ",             href: "/faq"        },
      { label: "Partners",        href: "/clients"    },
    ],
  },
];

export default function Footer() {
  const { ref, visible } = useReveal(0.05);

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className="relative border-t border-[#1e2b28] bg-[#0a0c0b] overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]
        bg-[radial-gradient(ellipse,rgba(0,229,180,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Big CTA band */}
      <div className="border-b border-[#1e2b28] py-24 px-8 text-center relative">
        <div className="max-w-3xl mx-auto">
          <p className={`text-xs tracking-[0.25em] text-[#00e5b4] uppercase mb-6
            transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Ready to build?
          </p>
          <h2 className={`text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-tight leading-none mb-10
            transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Your data has been<br />
            <span className="text-[#00e5b4]">waiting long enough.</span>
          </h2>
          <div className={`flex items-center justify-center gap-4 flex-wrap
            transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link href="/#contact"
              className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold
                px-8 py-4 rounded-xl text-base hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)]
                transition-all duration-300">
              Book a discovery call
              <span className="text-lg">→</span>
            </Link>
            <Link href="/projects"
              className="inline-flex items-center gap-2 border border-[#2a3d38] text-white
                font-semibold px-8 py-4 rounded-xl text-base hover:border-[#00e5b4] hover:text-[#00e5b4]
                transition-all duration-300">
              Explore our work
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-screen-xl mx-auto px-8 py-16
        grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

        {/* Brand column */}
        <div>
          <Link href="/" className="flex items-center mb-6 group w-fit">
            <VertexLogo size={30} withWordmark animated className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          <p className="text-sm text-[#3a5550] leading-relaxed max-w-[260px] mb-8">
            Enterprise AI and data intelligence, engineered the way I'd build it for my own systems — for organizations that need it to actually work in production, not just demo well.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {PROFESSIONAL_LINKS.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1e2b28] text-[#5a7570]
                  hover:border-[#00e5b4] hover:text-[#00e5b4] transition-all duration-200">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {COLS.map(col => (
          <div key={col.title}>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] text-[#2a3d38] uppercase mb-5">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#5a7570] hover:text-[#00e5b4]
                      transition-colors duration-200 flex items-center gap-1.5 group/link">
                    <span className="w-0 h-px bg-[#00e5b4] group-hover/link:w-3 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e2b28] px-8 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#2a3d38]">
            © 2026 VertexData Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]].map(([label, href]) => (
              <Link key={label} href={href}
                className="text-xs text-[#2a3d38] hover:text-[#00e5b4] transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
