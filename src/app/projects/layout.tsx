import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Catalog — Order a Fixed-Scope AI Project",
  description:
    "Analytics platform builds, agentic support systems, RAG assistants, vision inspection, security audits — fixed starting prices, real timelines, order directly.",
  openGraph: {
    title: "Project Catalog — VertexData Systems",
    description: "Fixed-scope AI and data projects with transparent starting prices. Pick one, see the full detail, order directly.",
    url: "https://vertexdata.systems/projects",
  },
  alternates: { canonical: "https://vertexdata.systems/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
