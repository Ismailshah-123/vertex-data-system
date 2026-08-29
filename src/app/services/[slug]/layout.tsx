import type { Metadata } from "next";
import { SERVICES } from "./data";

export function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) return {};

  const url = `https://vertexdata.systems/services/${service.id}`;
  return {
    title: `${service.title} — Vertex Data Systems`,
    description: service.description,
    alternates: { canonical: url },
    openGraph: {
      title: service.title,
      description: service.headline,
      url,
      type: "website",
    },
  };
}

export default function ServiceSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
