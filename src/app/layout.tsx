import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "@/styles/globals.css";
import Navbar          from "@/components/navbar/Navbar";
import Footer          from "@/components/footer/Footer";
import ParticleCanvas  from "@/components/particles/ParticleCanvas";
import ScrollProgress  from "@/components/scroll-progress/ScrollProgress";
import CustomCursor    from "@/components/ui/CustomCursor";
import PageTransition  from "@/components/transitions/PageTransition";
import CommandPalette  from "@/components/command-palette/CommandPalette";
import { safeJsonLd } from "@/lib/safeJsonLd";

// Display font — used for all headings (h1/h2/h3). A confident grotesque
// with real Black (900) weight support, distinct from the Inter/system-sans
// look nearly every AI product defaults to, and holds up at the heavy
// black/900 weight used throughout this design.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

// Body font — clean and highly readable for paragraph text and UI copy,
// still distinct from the ubiquitous Inter.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Vertex Data Systems — Enterprise AI & Data Intelligence",
    template: "%s | Vertex Data Systems",
  },
  description:
    "We build production ML systems, autonomous AI agents, and real-time analytics infrastructure that give your organization an unfair, compounding advantage.",
  keywords: [
    "AI agency","machine learning","data analytics","agentic AI",
    "LLM engineering","computer vision","MLOps","data science",
    "NLP","enterprise AI","predictive analytics","AI security",
  ],
  authors:  [{ name: "Vertex Data Systems" }],
  creator:  "Vertex Data Systems",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://vertexdata.systems",
    siteName:    "Vertex Data Systems",
    title:       "Vertex Data Systems — Enterprise AI & Data Intelligence",
    description: "We turn raw data into decisive intelligence. Production ML, autonomous agents, and real-time BI.",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Vertex Data Systems" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Vertex Data Systems — Enterprise AI & Data Intelligence",
    description: "Production ML, agentic AI, and data intelligence for enterprises.",
    images:      ["/images/og-image.png"],
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "/" },
  metadataBase: new URL("https://vertexdata.systems"),
};

export const viewport: Viewport = {
  themeColor:   "#0a0c0b",
  width:        "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type":    "Organization",
              name:        "Vertex Data Systems",
              url:         "https://vertexdata.systems",
              description: "Enterprise AI and data intelligence agency.",
              contactPoint: { "@type": "ContactPoint", email: "hello@vertexdata.systems", contactType: "sales" },
              // sameAs intentionally omitted — add real social profile URLs here once they
              // exist. Shipping placeholder links makes a verifiable claim (schema.org's
              // sameAs is meant to point at *confirmed* accounts for this entity) that a
              // search for "vertexdata-systems" on LinkedIn/X/GitHub doesn't back up.
            }),
          }}
        />
      </head>
      <body className="bg-[#0a0c0b] text-[#f0f5f3] antialiased overflow-x-hidden">

        {/* Ambient particle field — subtle, non-blocking, visible on all pages */}
        <ParticleCanvas count={60} opacity={0.35} />

        {/* Film-grain texture — already defined in globals.css, wasn't mounted anywhere */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Custom cursor — desktop/fine-pointer only, no-ops itself out on touch and reduced-motion */}
        <CustomCursor />

        {/* Navigation */}
        <Navbar />

        {/* Page content injected by Next.js — animates between routes; nav/footer stay put */}
        <PageTransition>{children}</PageTransition>

        {/* Footer */}
        <Footer />

        {/* Command palette — Cmd/Ctrl+K, all pages */}
        <CommandPalette />

        {/* Scroll progress indicator — fixed overlay, all pages */}
        <ScrollProgress />

      </body>
    </html>
  );
}
