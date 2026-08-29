import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Build For — Industries & Use Cases",
  description:
    "Financial services, healthcare, manufacturing, retail, legal, and more — where Vertex Data Systems' AI and data engineering expertise applies, and what it can do for each.",
  openGraph: {
    title: "Who We Build For — Vertex Data Systems",
    description: "The industries with the most to gain from AI, and where our engineering expertise applies.",
    url: "https://vertexdata.systems/clients",
  },
  alternates: { canonical: "https://vertexdata.systems/clients" },
};

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
