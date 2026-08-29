import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Questions, Answered Honestly",
  description:
    "How fast can you deliver? Can our data stay private? Which models do you use? Straight answers to everything enterprise buyers ask before they engage.",
  openGraph: {
    title: "FAQ — VertexData Systems",
    description: "Straight answers, no sales spin, to everything you'd ask before signing.",
    url: "https://vertexdata.systems/faq",
  },
  alternates: { canonical: "https://vertexdata.systems/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
