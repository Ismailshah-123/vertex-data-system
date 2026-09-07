import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Real Independent Projects",
  description:
    "Vertex Data Systems doesn't have client case studies yet — we're early. Here's real, independent engineering work instead: production-style AI systems built end to end.",
  openGraph: {
    title: "Case Studies — Vertex Data Systems",
    description: "Real independent projects, honestly labeled — not client work.",
    url: "https://vertexdata.systems/case-studies",
  },
  alternates: { canonical: "https://vertexdata.systems/case-studies" },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
