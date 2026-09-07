import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Data Science, ML Engineering & Agentic AI",
  description:
    "Ten disciplines, one unfair edge: data science, data engineering, analytics, ML engineering, MLOps, agentic AI, computer vision, LLM systems, AI security, and CRM automation — all built for production.",
  openGraph: {
    title: "AI & Data Services — Vertex Data Systems",
    description: "Production-grade AI systems across ten disciplines, from data science foundations to CRM automation.",
    url: "https://vertexdata.systems/services",
  },
  alternates: { canonical: "https://vertexdata.systems/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
