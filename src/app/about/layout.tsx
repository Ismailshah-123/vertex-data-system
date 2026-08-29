import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Founder-Led AI & Data Engineering",
  description:
    "Founded in 2026. Early-stage and founder-led — direct access to whoever builds your system, source-code ownership on every project, no account managers in between.",
  openGraph: {
    title: "About VertexData Systems",
    description: "Founder-led AI and data engineering. Direct access to whoever's building your system, from day one.",
    url: "https://vertexdata.systems/about",
  },
  alternates: { canonical: "https://vertexdata.systems/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
