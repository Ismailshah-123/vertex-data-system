import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Research & Engineering Notes",
  description:
    "No thought leadership, no hot takes — hard-won engineering experience from building AI systems in production, written by the engineers who shipped them.",
  openGraph: {
    title: "Blog — VertexData Systems",
    description: "Research and engineering notes from building AI systems in production.",
    url: "https://vertexdata.systems/blog",
  },
  alternates: { canonical: "https://vertexdata.systems/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
