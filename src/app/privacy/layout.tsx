import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VertexData Systems collects, uses, and protects your information.",
  alternates: { canonical: "https://vertexdata.systems/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
