import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Start a Project",
  description:
    "No 30-slide deck, no automated qualification. A real engineer reads every submission and replies within 24 hours with an honest assessment.",
  openGraph: {
    title: "Contact — VertexData Systems",
    description: "Tell us what you're building. A senior engineer replies within 24 hours.",
    url: "https://vertexdata.systems/contact",
  },
  alternates: { canonical: "https://vertexdata.systems/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
