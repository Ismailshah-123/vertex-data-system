/* ─────────────────────────────────────────────────────────────────────────
   Shared project data — single source of truth for the /projects/[slug]
   page (client component) and its metadata layout (server component).
───────────────────────────────────────────────────────────────────────── */

interface ProjectDetail {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  color: string;
  timeline: string;
  overview: string;
  included: string[];
  notIncluded: string[];
  process: { phase: string; body: string }[];
  tags: string[];
}

const PROJECTS: Record<string, ProjectDetail> = {
  "analytics-platform-build": {
    slug: "analytics-platform-build", category: "Data",
    name: "Analytics & BI Platform Build",
    tagline: "A live source of truth, not another spreadsheet.",
    color: "#00e5b4", timeline: "6–10 weeks",
    overview: "We design and build your complete analytics stack: warehouse architecture, transformation layer, semantic model, and executive dashboards. The result replaces manual reporting with a system that refreshes automatically and that every team trusts equally — one metric, one definition, everywhere.",
    included: [
      "Full data source audit and warehouse architecture design",
      "dbt transformation layer with complete lineage documentation",
      "Semantic layer — one definition per metric across the business",
      "Up to 10 executive dashboards in Looker or Metabase",
      "Automated daily refresh with monitoring and alerting",
      "2 training sessions for your internal team",
    ],
    notIncluded: ["Real-time streaming (available as an add-on)", "Custom ML models on top of the warehouse"],
    process: [
      { phase: "Weeks 1–2", body: "Data source audit, warehouse architecture design, and metric definition workshops with your stakeholders." },
      { phase: "Weeks 3–6", body: "Build the transformation layer and semantic model. You see working dashboards from week 3 onward." },
      { phase: "Weeks 7–9", body: "Executive dashboard build-out, automated refresh pipelines, and monitoring setup." },
      { phase: "Week 10", body: "Team training, documentation handover, and 30-day post-launch support window." },
    ],
    tags: ["dbt", "BigQuery", "Looker", "Fivetran"],
  },
  "data-warehouse-migration": {
    slug: "data-warehouse-migration", category: "Data",
    name: "Data Warehouse Migration",
    tagline: "Move without losing a single number.",
    color: "#00d19e", timeline: "8–14 weeks",
    overview: "Migrating warehouse platforms is where most data teams get burned — silent data loss, broken downstream reports, weeks of parallel-running two systems. We run a structured migration with full validation at every stage, so cutover day has zero surprises.",
    included: [
      "Complete inventory of existing tables, views, and dependent reports",
      "Migration plan with rollback strategy at every stage",
      "Automated data validation comparing old vs new warehouse output",
      "Parallel-run period with reconciliation reporting",
      "Full cutover with monitored rollback window",
      "Documentation of the new architecture for your team",
    ],
    notIncluded: ["New dashboard builds (use Analytics Platform Build alongside this)", "Historical data older than what's queryable in your source system"],
    process: [
      { phase: "Weeks 1–3", body: "Full inventory and dependency mapping. This stage alone prevents most migration disasters." },
      { phase: "Weeks 4–9", body: "Build the new warehouse and transformation layer in parallel with your existing system." },
      { phase: "Weeks 10–12", body: "Parallel-run period — both systems live, automated reconciliation catches any discrepancy." },
      { phase: "Weeks 13–14", body: "Cutover, monitored rollback window, and decommission of the old system." },
    ],
    tags: ["Snowflake", "Fivetran", "Airflow", "dbt"],
  },
  "predictive-model-deployment": {
    slug: "predictive-model-deployment", category: "ML & AI",
    name: "Predictive Model Deployment",
    tagline: "From notebook to production, properly.",
    color: "#00c49a", timeline: "6–12 weeks",
    overview: "Whether you have an existing model stuck in a notebook or need one built from scratch, we wrap it in production-grade infrastructure: feature stores, model registry, real-time or batch inference, and the monitoring that catches drift before your business does.",
    included: [
      "Model development or productionisation of an existing model",
      "Feature store architecture (Feast or custom)",
      "Model registry with versioning and A/B experimentation support",
      "Real-time or batch inference infrastructure, sized to your traffic",
      "Automated drift monitoring and retraining triggers",
      "Full evaluation harness benchmarked against your business KPIs",
    ],
    notIncluded: ["Data warehouse setup (see Analytics Platform Build)", "Ongoing model retraining after month 3 (available as a retainer)"],
    process: [
      { phase: "Weeks 1–2", body: "Model and data audit, feature engineering plan, and evaluation criteria agreed with your team." },
      { phase: "Weeks 3–7", body: "Model build or hardening, feature store implementation, weekly working deploys to staging." },
      { phase: "Weeks 8–10", body: "Production inference infrastructure, monitoring dashboards, drift detection setup." },
      { phase: "Weeks 11–12", body: "Phased production rollout with full observability from day one." },
    ],
    tags: ["PyTorch", "MLflow", "Feast", "Kubeflow"],
  },
  "agentic-support-system": {
    slug: "agentic-support-system", category: "ML & AI",
    name: "Agentic Support Automation",
    tagline: "Autonomous resolution, not another chatbot.",
    color: "#00b48a", timeline: "8–12 weeks",
    overview: "A multi-agent system that actually resolves tickets — not a chatbot that deflects to a human the moment something's non-trivial. Built on a three-tier architecture (triage, resolver, escalation) designed to resolve the large majority of volume autonomously, and escalate cleanly on everything else.",
    included: [
      "Historical ticket classification and ground-truth dataset creation",
      "Triage, resolver, and escalation agent architecture",
      "Integration with your existing helpdesk (Zendesk, Intercom, etc.)",
      "Guardrails layer: PII protection, sentiment escalation, audit logging",
      "3-week shadow-mode period before customer-facing rollout",
      "Phased rollout plan with weekly volume increase",
    ],
    notIncluded: ["Voice/phone support (text and chat channels only)", "Multi-language support beyond English (available as an add-on)"],
    process: [
      { phase: "Weeks 1–2", body: "Ticket archaeology: classify 12+ months of resolved tickets to build the training dataset." },
      { phase: "Weeks 3–6", body: "Agent architecture build — triage, resolver, and escalation agents, with the guardrails layer." },
      { phase: "Weeks 7–9", body: "Shadow mode: the system processes real tickets in parallel with your team, never responding live." },
      { phase: "Weeks 10–12", body: "Phased rollout — 10% → 40% → 100% of eligible volume, monitored at every step." },
    ],
    tags: ["LangGraph", "Claude API", "Guardrails AI", "Zendesk API"],
  },
  "rag-knowledge-assistant": {
    slug: "rag-knowledge-assistant", category: "ML & AI",
    name: "RAG Knowledge Assistant",
    tagline: "Your documents, finally searchable and answerable.",
    color: "#00a07a", timeline: "5–9 weeks",
    overview: "A retrieval-augmented assistant trained on your own proprietary documents — matters, manuals, correspondence, whatever your team currently searches manually. Every answer comes with a citation back to the source document, plus a confidence score so your team knows when to verify.",
    included: [
      "Document ingestion pipeline (PDF, Word, scanned documents via OCR)",
      "Hierarchical chunking and embedding strategy tuned to your content type",
      "Hybrid retrieval (dense + sparse) for both semantic and exact-match queries",
      "Citation verification — every answer traces to a real source passage",
      "Access control enforced at the retrieval layer, not just the UI",
      "Full query audit logging for compliance",
    ],
    notIncluded: ["Fine-tuning a custom base model (see below for that option)", "Real-time document sync beyond daily batch ingestion"],
    process: [
      { phase: "Weeks 1–2", body: "Document pipeline build: ingestion, OCR where needed, PII detection, and access-tagging." },
      { phase: "Weeks 3–5", body: "Chunking and retrieval architecture, embedding generation, hybrid search tuning." },
      { phase: "Weeks 6–7", body: "Answer generation with citation verification and confidence scoring." },
      { phase: "Weeks 8–9", body: "Access control hardening, audit logging, and user acceptance testing with your team." },
    ],
    tags: ["RAG", "LlamaIndex", "Pinecone", "Claude"],
  },
  "vision-quality-inspection": {
    slug: "vision-quality-inspection", category: "Vision",
    name: "Vision-Based Quality Inspection",
    tagline: "Catch the defect before it leaves the line.",
    color: "#00d4c4", timeline: "10–16 weeks",
    overview: "Real-time defect detection deployed directly at the edge — no cloud latency, no data leaving your factory. We spend real time on your shop floor building a defect taxonomy before writing a line of code, which is exactly the step that determines whether this succeeds.",
    included: [
      "On-site defect taxonomy workshop with your quality engineers",
      "Synthetic data augmentation to cover rare defect classes",
      "Edge-deployed inference (NVIDIA Jetson or equivalent), sub-16ms latency",
      "SCADA integration for automated line-stop and quarantine routing",
      "Live monitoring dashboard: detection feed, defect rate, hourly trends",
      "Active learning loop for continuous accuracy improvement post-launch",
    ],
    notIncluded: ["Camera hardware procurement (we specify, you procure)", "Deployment across additional lines beyond the initial scope (quoted separately)"],
    process: [
      { phase: "Weeks 1–3", body: "On-site defect taxonomy build with your quality team — the foundation everything else depends on." },
      { phase: "Weeks 4–8", body: "Data collection, synthetic augmentation, and model training against the taxonomy." },
      { phase: "Weeks 9–13", body: "Edge deployment, SCADA integration, and monitoring dashboard build." },
      { phase: "Weeks 14–16", body: "Live line deployment with active learning loop calibration." },
    ],
    tags: ["YOLOv9", "TensorRT", "NVIDIA Jetson", "OpenCV"],
  },
  "property-developer-crm": {
    slug: "property-developer-crm", category: "CRM",
    name: "CRM for Property Developers",
    tagline: "From first inquiry to handover, one system.",
    color: "#00c49a", timeline: "6–10 weeks",
    // NOTE: placeholder-level detail — built from what a property/builder
    // CRM typically needs, not verified specifics of the real deployment.
    // Swap in the actual client name, exact features shipped, and real
    // tech stack once confirmed.
    overview: "A CRM built for how property developers actually sell — tracking every inquiry against live unit inventory, automating follow-ups so no lead goes cold, and giving sales teams one pipeline view from first contact through to handover.",
    included: [
      "Lead capture from listings, walk-ins, and referral sources into one pipeline",
      "Live unit/inventory tracking tied to each lead and deal stage",
      "Automated follow-up sequences — no manual chasing of warm leads",
      "Sales pipeline with custom stages matched to the actual sales process",
      "Reporting dashboard — conversion by source, stage, and sales rep",
    ],
    notIncluded: ["Listing-site integrations beyond what's scoped at kickoff", "Accounting/finance system integration (scoped separately if needed)"],
    process: [
      { phase: "Weeks 1–2", body: "Mapping the actual sales process and inventory structure before writing any code." },
      { phase: "Weeks 3–7", body: "Core CRM build — pipeline, inventory sync, automated follow-ups." },
      { phase: "Weeks 8–10", body: "Team onboarding, reporting setup, and handover." },
    ],
    tags: ["CRM", "Sales Automation", "Real Estate"],
  },
  "school-management-crm": {
    slug: "school-management-crm", category: "CRM",
    name: "CRM for Schools & Educational Institutions",
    tagline: "Admissions that don't lose track of a single family.",
    color: "#00b48a", timeline: "6–10 weeks",
    // NOTE: same as above — placeholder-level detail pending the real
    // specifics of what was actually built and shipped.
    overview: "An admissions and enrollment CRM built around how schools actually recruit — every inquiry tracked from first contact through enrollment, with automated follow-ups for parents and a clear pipeline view for the admissions team.",
    included: [
      "Inquiry capture from your website, events, and referrals into one pipeline",
      "Automated follow-up sequences for parents at every admissions stage",
      "Enrollment tracking from inquiry through confirmed enrollment",
      "Staff-facing dashboard for the admissions team's day-to-day pipeline",
      "Reporting on inquiry sources, conversion, and enrollment trends",
    ],
    notIncluded: ["Student information system (SIS) integration beyond what's scoped at kickoff", "Billing/tuition payment processing (scoped separately if needed)"],
    process: [
      { phase: "Weeks 1–2", body: "Mapping the actual admissions process before writing any code." },
      { phase: "Weeks 3–7", body: "Core CRM build — pipeline, automated follow-ups, staff dashboard." },
      { phase: "Weeks 8–10", body: "Admissions team onboarding, reporting setup, and handover." },
    ],
    tags: ["CRM", "Education", "Enrollment Automation"],
  },
};

export type { ProjectDetail };
export { PROJECTS };
