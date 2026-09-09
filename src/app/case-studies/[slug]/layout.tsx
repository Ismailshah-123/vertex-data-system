import type { Metadata } from "next";
import { CASE_STUDIES } from "../data";

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((cs) => cs.id === slug);
  if (!caseStudy) return {};

  const url = `https://vertexdata.systems/case-studies/${caseStudy.id}`;
  return {
    title: `${caseStudy.title} — Vertex Data Systems`,
    description: caseStudy.outcome,
    alternates: { canonical: url },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.outcome,
      url,
      type: "article",
    },
  };
}

export default function CaseStudySlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
