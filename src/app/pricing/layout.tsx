import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Transparent Engagement Models",
  description:
    "Starter from £12K/mo, Scale at £38K/mo, custom Enterprise partnerships. No hidden fees, no scope creep — every engagement starts with a free audit.",
  openGraph: {
    title: "Pricing — VertexData Systems",
    description: "Transparent pricing with zero surprises. Every engagement starts with a free 60-minute audit.",
    url: "https://vertexdata.systems/pricing",
  },
  alternates: { canonical: "https://vertexdata.systems/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
