import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — AI & Data Engineering, Built for Production",
  description:
    "Founded in 2026. Early-stage and focused — direct access to the team building your system, source-code ownership on every project, no account managers in between.",
  openGraph: {
    title: "About Vertex Data Systems",
    description: "AI and data engineering, built for production. Direct access to the team building your system, from day one.",
    url: "https://vertexdata.systems/about",
  },
  alternates: { canonical: "https://vertexdata.systems/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
