import type { Metadata } from "next";
import { PROJECTS } from "./data";

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return {};

  const url = `https://vertexdata.systems/projects/${project.slug}`;
  return {
    title: `${project.name} — Vertex Data Systems`,
    description: project.overview,
    alternates: { canonical: url },
    openGraph: {
      title: project.name,
      description: project.tagline,
      url,
      type: "website",
    },
  };
}

export default function ProjectSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
