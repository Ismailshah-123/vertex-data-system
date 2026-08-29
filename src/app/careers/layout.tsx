import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Build AI That Actually Ships",
  description:
    "Early-stage and founder-led. The roles Vertex will need first, and what it's actually like to work here — no invented team size, no invented perks.",
  openGraph: {
    title: "Careers — Vertex Data Systems",
    description: "The roles ahead as Vertex grows, and an honest look at what joining early actually means.",
    url: "https://vertexdata.systems/careers",
  },
  alternates: { canonical: "https://vertexdata.systems/careers" },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
