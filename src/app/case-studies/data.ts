/* ─────────────────────────────────────────────────────────────────────────
   /case-studies data — single source shared by the listing page
   (case-studies/page.tsx) and the detail pages (case-studies/[slug]).

   IMPORTANT: same honesty rule as the page itself — these are real
   independent/prototype projects Ismail built, not client work. Every
   entry keeps its actual status. Do not add fabricated client names,
   dollar figures, testimonials, or "results" that weren't measured.

   The type is declared as a plain interface BEFORE the data, and the
   data is typed AGAINST that interface — not derived from it via
   `typeof CASE_STUDIES[number]`. That reversed order (type derived from
   the data it's meant to constrain) is what produced the circular
   reference error this file replaces.
───────────────────────────────────────────────────────────────────────── */

export interface CaseStudy {
  id: string;
  status: string;
  category: string;
  title: string;
  problem: string;
  approach: string;
  stack: string[];
  features: string[];
  outcome: string;
  color: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "voice-agent-platform",
    status: "Independent project",
    category: "Voice AI · Multi-Tenant SaaS",
    title: "AI Voice Agent Platform",
    problem: "Most AI phone agent demos are single-tenant proofs of concept — they don't handle multiple businesses, real billing, or the reliability bar a paying customer would actually need.",
    approach: "Built a multi-tenant SaaS platform letting businesses across 11+ industries deploy AI phone agents — RAG-based knowledge retrieval so answers are grounded in each business's own information, automated appointment booking, and WhatsApp/email confirmations.",
    stack: ["FastAPI", "PostgreSQL", "Vapi", "Groq", "Stripe", "Pytest"],
    features: ["Multi-tenant architecture", "RAG knowledge retrieval", "Automated booking + confirmations", "Stripe billing integration", "35+ test Pytest suite"],
    outcome: "A working platform architecture — not just a call demo — proving multi-tenant voice AI deployment with the billing and test coverage a real product needs.",
    color: "#00e5b4",
  },
  {
    id: "ai-interviewer",
    status: "Deployed",
    category: "Voice AI · HR Tech",
    title: "AI Interviewer",
    problem: "Screening interviews are time-consuming and inconsistent between candidates when done manually at volume.",
    approach: "Built an end-to-end AI interview platform: analyzes an uploaded resume, conducts a live voice interview over WebRTC, and generates a structured hiring evaluation within minutes of the call ending.",
    stack: ["FastAPI", "PostgreSQL", "Streamlit", "Vapi", "WebRTC"],
    features: ["Resume analysis", "Live voice interview via WebRTC", "Structured evaluation generation", "Deployed on Render"],
    outcome: "A live, deployed system — not a mockup — demonstrating real-time voice AI paired with structured decision-support output.",
    color: "#00d19e",
  },
  {
    id: "career-gpt",
    status: "In active development",
    category: "Agentic AI · Automation",
    title: "AI Job Hunter (CareerGPT)",
    problem: "Job searching is fragmented across separate steps — finding roles, tailoring a resume for each one, and building outreach content — that most tools handle in isolation, if at all.",
    approach: "A 9-agent system automating job discovery, resume tailoring by role, and LinkedIn content generation, built with a multi-provider fallback chain so no single LLM outage stops the pipeline.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Qdrant", "Groq", "Claude", "GPT-4", "Gemini"],
    features: ["9-agent orchestration", "Role-specific resume tailoring", "Vector search via Qdrant", "Multi-provider LLM fallback chain"],
    outcome: "Demonstrates production-grade multi-agent orchestration with real reliability engineering — not a single-LLM wrapper.",
    color: "#00bcd4",
  },
  {
    id: "cancer-detection",
    status: "Proof of concept",
    category: "Computer Vision · Healthcare AI",
    title: "Multi-Cancer Detection System",
    problem: "Early detection across different cancer types usually requires organ-specific imaging expertise that isn't uniformly available.",
    approach: "A deep learning platform with 9 independently trained CNN models (ResNet50, EfficientNet) for organ-specific cancer classification, including brain and lung, with an image upload interface that identifies the cancer type and localizes the affected region.",
    stack: ["Python", "TensorFlow/PyTorch", "ResNet50", "EfficientNet"],
    features: ["9 independently trained CNN models", "Organ-specific classification", "Region localization on the image", "Clinical-report-style output"],
    outcome: "Demonstrates computer vision capability across multiple specialized classification tasks with a genuinely usable output format, not just a single-class demo.",
    color: "#b000e5",
  },
];
