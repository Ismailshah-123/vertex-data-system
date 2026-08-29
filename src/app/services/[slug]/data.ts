/* ─────────────────────────────────────────────────────────────────────────
   Shared service data — single source of truth for the /services/[slug]
   page (client component) and its metadata layout (server component),
   so titles/descriptions can never drift out of sync with the actual
   page content, and so generateStaticParams has one real source to read.
───────────────────────────────────────────────────────────────────────── */

interface ServiceDetail {
  id: string;
  number: string;
  category: string;
  title: string;
  headline: string;
  description: string;
  whoWeHelp: { title: string; body: string }[];
  whatWeDeliver: string[];
  stack: string[];
  metric: { value: string; label: string };
  clientResult: string;
  color: string;
  heroVideo?: string;        // e.g. "/videos/services/crm-automation.mp4" — add once you send per-service footage
  heroVideoPoster?: string;  // poster frame for the above; required if heroVideo is set
  relatedProject?: { slug: string; title: string };
}

const SERVICES: Record<string, ServiceDetail> = {
  "crm-automation": {
    id: "crm-automation", number: "01", category: "Revenue Engine",
    title: "CRM Automation & Lead Generation",
    headline: "Turn your CRM into a self-running pipeline, not a data graveyard.",
    description: "We connect your CRM to an AI layer that qualifies leads, runs cold outreach, and books meetings — so your team spends time closing, not chasing. Built on the CRM you already use, with a human checkpoint wherever a wrong move would cost you a relationship.",
    whoWeHelp: [
      { title: "Sales Teams Drowning in Admin", body: "Auto-logging calls, drafting summaries, and updating fields so reps sell instead of typing." },
      { title: "RevOps & Sales Leadership", body: "Real-time pipeline scoring and coverage visibility without waiting on manual CRM hygiene." },
      { title: "Fast-Growing Sales Orgs", body: "Scale cold outreach and lead response without scaling headcount at the same rate." },
    ],
    whatWeDeliver: ["AI lead scoring synced directly into your existing pipeline stages", "Automated cold calling and cold email sequences that don't read as robotic", "Meeting booking that handles scheduling, reminders, and no-show follow-up", "CRM hygiene — auto-enrichment, deduplication, and stage tracking without manual entry", "A full audit trail of every automated touch, so nothing happens you can't see"],
    stack: ["HubSpot", "Salesforce", "Twilio", "n8n", "Zapier", "Claude", "GPT-4", "Make"],
    metric: { value: "24/7", label: "automated outreach that never stops for a lunch break" },
    clientResult: "Every sequence ships with a human review queue and a kill-switch — so cold outreach scales without your brand voice going sideways.",
    color: "#00e5b4",
  },
  "analytics": {
    id: "analytics", number: "02", category: "Business Intelligence",
    title: "Data Analytics & BI",
    headline: "Answers your team trusts, not another dashboard nobody opens.",
    description: "We build the semantic layer and live dashboards that replace 48-hour reports with a single source of truth — so 'what's our churn rate' means the same thing whether finance or product is asking.",
    whoWeHelp: [
      { title: "Founders & Leadership", body: "One number for revenue, churn, and growth — not three spreadsheets that disagree." },
      { title: "Product Teams", body: "Self-serve dashboards wired to real production data instead of a weekly CSV export." },
      { title: "Finance & Ops", body: "Reporting that updates itself instead of eating an analyst's afternoon every Monday." },
    ],
    whatWeDeliver: ["A semantic data model that's the same source of truth across every team", "Real-time dashboards wired to your actual production data, not a nightly export", "Cohort, churn, and LTV analysis built into the reporting layer itself", "Self-serve reporting your team can actually use without pinging a data analyst", "A cleanup audit of existing reports — most companies have 3 different 'truths'"],
    stack: ["Python", "SQL", "dbt", "BigQuery", "Looker", "Metabase", "Airflow", "pandas"],
    metric: { value: "Real-time", label: "live dashboards instead of 48-hour-old reports" },
    clientResult: "We build the semantic layer once, so every team is arguing about strategy — not about whose spreadsheet has the right number.",
    color: "#00d19e",
  },
  "web-development": {
    id: "web-development", number: "03", category: "Digital Presence",
    title: "Web Development",
    headline: "Fast, modern sites — built to actually convert, not just look nice.",
    description: "We design and build production-grade websites and web apps — marketing sites, internal tools, customer portals — on a modern stack that's fast today and genuinely maintainable in a year, not just at launch.",
    whoWeHelp: [
      { title: "Founders Launching or Relaunching", body: "A site that loads fast, ranks, and actually converts — not just looks good in a mockup." },
      { title: "Teams Stuck on a Legacy Site", body: "Rebuild on a modern stack your own team can extend, without starting from zero." },
      { title: "Marketing Teams", body: "A CMS-backed site your team can update without filing a developer ticket." },
    ],
    whatWeDeliver: ["Custom design and build on Next.js, React, or your existing stack", "Performance budgets enforced in CI, not just checked once at launch", "CMS integration so your team can update content without a developer", "SEO fundamentals and analytics wired in from day one, not bolted on after", "Clean handover — source code, docs, and a site your own team can extend"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Node.js", "PostgreSQL"],
    metric: { value: "<2s", label: "target load time on every build, enforced by CI" },
    clientResult: "Every site ships with real performance budgets in the pipeline — speed is a gate that blocks a bad deploy, not an afterthought.",
    color: "#00c9c0",
  },
  "rag-chatbots": {
    id: "rag-chatbots", number: "04", category: "Knowledge Systems",
    title: "AI Knowledge Assistants (RAG Chatbots)",
    headline: "Answers grounded in your own documents — cited, not improvised.",
    description: "We build retrieval-augmented chatbots that answer from your private knowledge — docs, wikis, support tickets, product manuals — and cite exactly where the answer came from, respecting whatever access permissions already exist.",
    whoWeHelp: [
      { title: "Support Teams", body: "Deflect repetitive tickets with an assistant that answers from your actual docs, cited." },
      { title: "Internal Ops Teams", body: "Stop being the human search engine for 'where's that policy doc again?'" },
      { title: "Customer-Facing Teams", body: "A chatbot that says 'I don't know' instead of confidently making something up." },
    ],
    whatWeDeliver: ["Retrieval pipelines built on your actual documents, not a generic wrapper", "Every answer cited back to its source passage, so it's checkable", "Access-permission-aware retrieval — it won't surface what a user can't see", "A clean fallback when there's no grounded answer, instead of a confident guess", "Deployed as a widget, Slack app, or internal tool — wherever your team works"],
    stack: ["LangChain", "LlamaIndex", "Pinecone", "Weaviate", "Claude", "GPT-4", "Cohere"],
    metric: { value: "Cited", label: "every answer traceable back to its source document" },
    clientResult: "If the assistant can't find a grounded answer in your documents, it says so — it doesn't improvise one.",
    color: "#00bcd4",
  },
  "voice-ai": {
    id: "voice-ai", number: "05", category: "Voice Systems",
    title: "Voice AI Agents",
    headline: "Phone agents that sound natural and know when to hand off.",
    description: "We build voice agents for inbound and outbound calls — appointment booking, support triage, outbound follow-up — with streaming transcription, natural turn-taking, and a clean handoff to a human the moment a caller actually needs one.",
    whoWeHelp: [
      { title: "Sales & Outreach Teams", body: "Outbound calling for reminders, follow-ups, and qualification that never gets tired." },
      { title: "Support & Front Desk Teams", body: "Inbound booking and FAQs handled without hold music or a missed call." },
      { title: "Ops Teams", body: "Confirmations and reminders that go out automatically, every time, on schedule." },
    ],
    whatWeDeliver: ["Inbound call handling — booking, FAQs, and routing without hold music", "Outbound calling for reminders, follow-ups, and qualification", "Natural turn-taking with barge-in, so callers don't have to wait out a script", "Grounded answers pulled from your actual systems, not generic scripting", "Clean escalation to a human agent with full context, not a cold transfer"],
    stack: ["Twilio", "Deepgram", "ElevenLabs", "Claude", "GPT-4", "WebRTC", "n8n"],
    metric: { value: "<500ms", label: "target response latency for natural turn-taking" },
    clientResult: "Built with a clean handoff to a human the moment a caller needs one — no dead-end call loops.",
    color: "#00a8cc",
  },
  "ml": {
    id: "ml", number: "06", category: "Predictive Systems",
    title: "ML Engineering & Predictive Analytics",
    headline: "Models that stay accurate in production, not just in the notebook.",
    description: "We take predictive models from prototype to production — demand forecasting, churn prediction, pricing, risk scoring — with monitoring and retraining built in from day one, so accuracy doesn't quietly decay the month after launch.",
    whoWeHelp: [
      { title: "Product & Growth Teams", body: "Forecasting and churn models that ship past the notebook and into production." },
      { title: "Finance & Risk Teams", body: "Pricing and risk models with a monitored baseline, not a black box nobody can audit." },
      { title: "Ops Teams", body: "Demand forecasting that updates itself instead of a quarterly spreadsheet exercise." },
    ],
    whatWeDeliver: ["End-to-end pipelines from raw data to a served, monitored model", "A benchmark every model has to beat before it ships, not just a demo", "Drift monitoring so degrading accuracy gets caught before it costs a decision", "Automated retraining pipelines instead of a model that quietly goes stale", "Clear documentation of what the model does and doesn't handle well"],
    stack: ["Python", "PyTorch", "scikit-learn", "MLflow", "Airflow", "Docker", "AWS SageMaker"],
    metric: { value: "Eval-gated", label: "no model ships without a benchmark it has to beat" },
    clientResult: "Every model gets a monitored baseline in production, so drift gets caught before it costs you a real decision.",
    color: "#0098c9",
  },
  "agentic-ai": {
    id: "agentic-ai", number: "07", category: "Autonomous Systems",
    title: "Agentic AI & Automation",
    headline: "Systems that plan, use tools, and finish the job — safely.",
    description: "We build multi-agent systems that decompose a goal, call your existing tools through typed interfaces, and complete multi-step work end-to-end — with explicit scope limits, approval gates, and a full trace of every decision the agent made.",
    whoWeHelp: [
      { title: "Ops Teams", body: "Multi-step workflows that run themselves within limits you actually set." },
      { title: "Teams Drowning in Manual Process", body: "Hand off the repetitive, multi-system busywork — with a human still in the loop where it matters." },
      { title: "Technical Leadership", body: "A full decision trace for every agent run, so 'what did it actually do' has a real answer." },
    ],
    whatWeDeliver: ["Multi-agent architectures scoped to specific, bounded workflows", "Typed tool integrations into your actual systems, not open-ended API access", "Approval gates wherever an automated mistake would actually cost you", "A full decision trace for every run, so you can see exactly what happened", "Observability and alerting when an agent gets stuck or goes out of scope"],
    stack: ["LangGraph", "Claude", "GPT-4", "Temporal", "Redis", "PostgreSQL", "n8n"],
    metric: { value: "Scoped", label: "every agent has explicit tool limits and approval gates" },
    clientResult: "Multi-step workflows run autonomously inside boundaries you set — not an open-ended agent holding your API keys.",
    color: "#7c5cff",
  },
  "vision": {
    id: "vision", number: "08", category: "Perception Systems",
    title: "Computer Vision",
    headline: "Vision models built for the camera you actually have, not a demo reel.",
    description: "We build and deploy computer vision systems — quality inspection, object detection, OCR — tested against your actual hardware and lighting conditions, not stock footage, with a clear path from prototype to something running reliably at the edge.",
    whoWeHelp: [
      { title: "Manufacturing & QA Teams", body: "Defect detection trained and tested on your actual line, not stock footage." },
      { title: "Ops Teams", body: "Object detection and OCR that runs at the edge, not round-tripping to a server." },
      { title: "Technical Leadership", body: "A defined confidence threshold with human review for anything below it." },
    ],
    whatWeDeliver: ["Custom model training on your actual images, not a generic pretrained demo", "Edge deployment so inference runs where the camera is, not round-tripping to a server", "Load-tested against your real hardware, lighting, and camera angles", "A defined confidence threshold with human review for anything below it", "Monitoring so a drifting model gets flagged before it silently degrades"],
    stack: ["PyTorch", "OpenCV", "YOLO", "TensorRT", "ONNX", "NVIDIA Jetson", "AWS Panorama"],
    metric: { value: "Edge-ready", label: "models built to run where the camera actually is" },
    clientResult: "Vision pipelines are built and load-tested against your actual camera hardware, not stock demo footage.",
    color: "#b000e5",
  },
  "nlp": {
    id: "nlp", number: "09", category: "Language Systems",
    title: "NLP & LLM Systems",
    headline: "Custom language systems, engineered — not just a prompt in a wrapper.",
    description: "We build the language layer underneath your product — fine-tuning, evaluation harnesses, and the prompt/model architecture — designed so switching model providers is a config change, not a rebuild, as the underlying models keep shifting.",
    whoWeHelp: [
      { title: "Product Teams Shipping AI Features", body: "A model-agnostic architecture so a provider price hike doesn't force a rebuild." },
      { title: "Technical Leadership", body: "An eval suite that catches quality regressions before your users do." },
      { title: "Teams on a Cost Budget", body: "Latency and cost tuning so the system is actually affordable to run at scale." },
    ],
    whatWeDeliver: ["Fine-tuning and prompt engineering benchmarked against a real eval suite", "A model-agnostic architecture — the prompt and eval layer live separately from any one provider", "Structured output pipelines that don't silently break on edge cases", "Cost and latency tuning so the system is affordable to actually run at scale", "Ongoing eval monitoring as underlying models get updated by their providers"],
    stack: ["Claude", "GPT-4", "Llama", "Hugging Face", "LangSmith", "Ollama", "vLLM"],
    metric: { value: "Model-agnostic", label: "built to swap providers without a rewrite" },
    clientResult: "We architect the prompt and eval layer separately from the model call, so a provider price hike doesn't mean a rebuild.",
    color: "#e5b400",
  },
};

const ORDER = ["crm-automation", "analytics", "web-development", "rag-chatbots", "voice-ai", "ml", "agentic-ai", "vision", "nlp"];

export type { ServiceDetail };
export { SERVICES, ORDER };
