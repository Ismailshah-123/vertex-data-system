import {
  SiAnthropic, SiGooglegemini, SiMeta, SiMistralai,
  SiLangchain, SiTemporal,
  SiPostgresql, SiElasticsearch,
  SiBraintrust,
  SiOpentelemetry, SiDatadog, SiPrometheus, SiGrafana,
  SiGooglecloud, SiKubernetes, SiVllm, SiRay,
} from "react-icons/si";
import type { IconType } from "react-icons";

/* ─────────────────────────────────────────────────────────────────────────
   Every entry here was checked against the installed react-icons package
   before being added — nothing in this map is assumed. Technologies used
   on this site that don't have a confirmed real brand icon available
   (OpenAI/GPT, AWS, Azure, Pinecone, Weaviate, Langfuse, Ragas, and
   anything generic like "Custom eval harness" or "Human review") are
   intentionally left out of this map, and the calling component falls
   back to a plain text monogram for those — never a fabricated or
   mismatched logo.
───────────────────────────────────────────────────────────────────────── */

export const TECH_ICONS: Record<string, IconType> = {
  Claude: SiAnthropic,
  Gemini: SiGooglegemini,
  Llama: SiMeta,
  Mistral: SiMistralai,
  LangGraph: SiLangchain,
  LangChain: SiLangchain,
  Temporal: SiTemporal,
  pgvector: SiPostgresql,
  PostgreSQL: SiPostgresql,
  Elasticsearch: SiElasticsearch,
  Braintrust: SiBraintrust,
  OpenTelemetry: SiOpentelemetry,
  Datadog: SiDatadog,
  Prometheus: SiPrometheus,
  Grafana: SiGrafana,
  GCP: SiGooglecloud,
  Kubernetes: SiKubernetes,
  vLLM: SiVllm,
  Ray: SiRay,
};

export function getTechIcon(name: string): IconType | null {
  return TECH_ICONS[name] ?? null;
}
