import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the Vertex Data Systems website and services.",
  alternates: { canonical: "https://vertexdata.systems/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
