export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: { name: string; role: string; initials: string };
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  accentColor: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "agentic-ai-enterprise-2026",
    category: "Agentic AI",
    title: "Why 2026 is the year agentic AI stops being a demo and starts being infrastructure",
    excerpt: "Multi-agent systems have crossed a capability threshold. Here's what actually works once you push an agent system past the demo stage — and where the hype gets ahead of what's real.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "Jul 8, 2026",
    readTime: "12 min read",
    featured: true,
    tags: ["Agentic AI", "LangGraph", "Production ML"],
    accentColor: "#00e5b4",
  },
  {
    slug: "rag-vs-finetuning-2026",
    category: "LLM Engineering",
    title: "RAG vs fine-tuning in 2026: a practitioner's honest guide",
    excerpt: "It's the question I get asked most. Here's the decision framework I actually use after building both — not the one the benchmark papers suggest.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "Jun 22, 2026",
    readTime: "9 min read",
    featured: false,
    tags: ["RAG", "Fine-tuning", "LLMs"],
    accentColor: "#00c49a",
  },
  {
    slug: "data-mesh-vs-data-lake",
    category: "Data Architecture",
    title: "Data mesh vs data lake vs data lakehouse: which one does your business actually need",
    excerpt: "Architecture debates are fun. Choosing the wrong one can cost months of rework later. Here's the question that actually determines which one is right for you.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "Jun 10, 2026",
    readTime: "15 min read",
    featured: false,
    tags: ["Data Architecture", "dbt", "BigQuery"],
    accentColor: "#00b48a",
  },
  {
    slug: "llm-security-owasp-top10",
    category: "AI Security",
    title: "OWASP LLM Top 10: what it means for your production deployment right now",
    excerpt: "Prompt injection, training data poisoning, model theft. These aren't theoretical — they show up the moment you actually red-team a deployed system. Here's what to fix first.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "May 28, 2026",
    readTime: "11 min read",
    featured: false,
    tags: ["AI Security", "OWASP", "LLM"],
    accentColor: "#9b5de5",
  },
  {
    slug: "mlops-drift-detection",
    category: "MLOps",
    title: "Your model was great on launch day. Here's why it's quietly failing right now",
    excerpt: "Data drift is silent and lethal. Here's what degradation actually looks like once a model is running against the real world — and how to catch it before it costs you.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "May 14, 2026",
    readTime: "8 min read",
    featured: false,
    tags: ["MLOps", "Model Monitoring", "Drift"],
    accentColor: "#e5b400",
  },
  {
    slug: "computer-vision-synthetic-data",
    category: "Computer Vision",
    title: "Synthetic data for computer vision: scaling rare-defect detection when real examples don't exist",
    excerpt: "Real-world defects are rare by design, which means collecting enough of them to train a robust model can take years you don't have. Diffusion-based synthesis is how I've approached closing that gap.",
    author: { name: "Vertex Data Systems", role: "Engineering", initials: "VX" },
    date: "Apr 29, 2026",
    readTime: "14 min read",
    featured: false,
    tags: ["Computer Vision", "Synthetic Data", "Manufacturing"],
    accentColor: "#00a07a",
  },
];
