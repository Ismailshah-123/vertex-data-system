import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process — Six Stages, Zero Surprises",
  description:
    "Audit, Architect, Build, Harden, Deploy, Compound — the six-stage engagement flow that prevents AI projects from failing in production.",
  openGraph: {
    title: "How Vertex Data Systems Works",
    description: "A six-stage engagement process built to prevent the exact failures that kill most AI projects before they reach production.",
    url: "https://vertexdata.systems/process",
  },
  alternates: { canonical: "https://vertexdata.systems/process" },
};

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
