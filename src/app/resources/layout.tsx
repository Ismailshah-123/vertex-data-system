import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources — Research, Documentation & Guides",
  description:
    "Documentation, research notes, and frameworks from real engineering work — agent evaluation, MLOps, and AI security. Some in progress, all genuinely ours.",
  openGraph: {
    title: "Resources — Vertex Data Systems",
    description: "What we've learned, written down — as it's written, not invented in advance.",
    url: "https://vertexdata.systems/resources",
  },
  alternates: { canonical: "https://vertexdata.systems/resources" },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
