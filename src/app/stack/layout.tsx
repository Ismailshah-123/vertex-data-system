import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Stack — Model-Agnostic, Reasoning-First",
  description:
    "Claude, GPT-4, Llama, LangGraph, Pinecone, Kubernetes and more — the full technology ecosystem we reach for, and exactly when we use each tool.",
  openGraph: {
    title: "Our Technology Ecosystem — VertexData Systems",
    description: "Model-agnostic, reasoning-first. Every tool we use, and exactly when we reach for it.",
    url: "https://vertexdata.systems/stack",
  },
  alternates: { canonical: "https://vertexdata.systems/stack" },
};

export default function StackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
