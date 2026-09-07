"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ─── Full case study data ───────────────────────────────────────────────── */
const CASE_STUDIES: Record<string, CaseStudy> = {
  "novafin-agentic-support": {
    slug:       "novafin-agentic-support",
    client:     "NovaTech Financial",
    industry:   "Financial Services",
    service:    "Agentic AI",
    location:   "London, UK",
    teamSize:   "4 VertexData engineers · 8 weeks",
    accentColor:"#00e5b4",
    title:      "How we automated 85% of tier-1 support and saved $2.3M annually",
    subtitle:   "A multi-agent AI system that triages, resolves, and escalates financial service queries — without a ticket queue.",
    challenge:  "NovaTech's 120-person support team was processing 40,000 tickets per month. 73% were identical in nature: balance enquiries, transaction disputes, KYC status checks. Average handle time was 11 minutes. Customer wait time was 4 hours. CSAT was 4.1/5 and falling. The business had already tried a traditional chatbot — it handled 12% of queries and customers hated it. The CTO came to us with a clear mandate: solve this without degrading the customer experience.",
    approach: [
      {
        phase: "01 — Data Archaeology",
        body: "We extracted and classified 18 months of resolved tickets. Every ticket was labelled by intent, complexity, required system access, and resolution path. This gave us a ground truth dataset of 720,000 labelled examples — the foundation for everything that followed.",
      },
      {
        phase: "02 — Agent Architecture Design",
        body: "We designed a three-tier agent hierarchy. A triage agent classifies incoming queries in under 200ms using a fine-tuned classifier. A resolver agent handles L1 queries by calling NovaTech's internal APIs directly — account balance, transaction history, KYC status — with Claude as the reasoning backbone. An escalation agent prepares a full context brief for human agents when complexity exceeds threshold, so agents never start cold.",
      },
      {
        phase: "03 — Safety & Compliance Layer",
        body: "Financial services AI must be auditable. Every agent decision is logged with its reasoning chain, confidence score, and the specific data it accessed. We built a guardrails layer that prevents any response containing unverified financial data, blocks PII exfiltration, and routes any sentiment indicating distress to a human immediately.",
      },
      {
        phase: "04 — Shadowing & Calibration",
        body: "For 3 weeks the system ran in shadow mode — processing every real ticket in parallel with human agents but never responding to customers. We used disagreements between human and AI resolution as training signal. By week 3, agreement on L1 tickets was 96%.",
      },
      {
        phase: "05 — Phased Rollout",
        body: "Week 1: 10% of L1 traffic. Week 2: 40%. Week 3: 100% L1. L2 routing began in week 5. By week 8 the system was handling 85% of all incoming volume autonomously. Human agents were reassigned to complex cases, fraud investigation, and high-value customer relationship management.",
      },
    ],
    results: [
      { value: "85%",   label: "Queries resolved autonomously",    detail: "Up from 12% with previous chatbot" },
      { value: "$2.3M", label: "Annual cost reduction",            detail: "Support headcount reallocated to higher-value work" },
      { value: "4.8★",  label: "CSAT score",                       detail: "Up from 4.1 — customers prefer instant resolution" },
      { value: "<8s",   label: "Average first response time",      detail: "Down from 4 hours" },
      { value: "96%",   label: "AI–human agreement rate on L1",    detail: "Measured across 720K labelled examples" },
      { value: "8wk",   label: "Kickoff to full production",       detail: "Including 3-week shadow mode period" },
    ],
    stack:    ["LangGraph", "Claude 3.5 Sonnet", "OpenAI GPT-4o", "PostgreSQL", "Redis", "Zendesk API", "Twilio", "AWS Lambda", "Guardrails AI", "Langfuse"],
    quote:    "We'd tried two other agencies and a major consultancy. VertexData were the first team who talked about the problem before talking about the solution. The system they built handles more volume than our entire support team did two years ago.",
    quoteName:"James Whitmore",
    quoteRole:"CTO, NovaTech Financial",
    nextSlug: "axiom-retail-analytics",
    nextTitle:"Rebuilding the analytics stack of a $4B retailer — in 90 days",
  },
  "axiom-retail-analytics": {
    slug:       "axiom-retail-analytics",
    client:     "Axiom Retail Group",
    industry:   "Retail & E-commerce",
    service:    "Data Analytics & BI",
    location:   "Manchester, UK",
    teamSize:   "6 VertexData engineers · 90 days",
    accentColor:"#00c49a",
    title:      "Rebuilding the analytics stack of a $4B retailer — in 90 days",
    subtitle:   "A unified semantic data layer that turned 7 years of siloed data into real-time decisions for 300 stakeholders.",
    challenge:  "Axiom had £4B in annual revenue and almost no visibility into it. Data lived across four systems: a legacy ERP, a Shopify instance, a third-party logistics platform, and an in-house loyalty programme. The weekly trading report took 3 analysts 48 hours to produce — and was wrong 30% of the time due to manual joins. The board was making decisions on stale, inaccurate data. A previous BI project had failed after 14 months and £2M of spend.",
    approach: [
      {
        phase: "01 — Data Source Audit",
        body: "We spent two weeks doing nothing but mapping. Every table, every field, every implicit join, every business rule that existed only in an analyst's head. We produced a 200-page data dictionary that became the source of truth for the entire engagement.",
      },
      {
        phase: "02 — Warehouse Architecture",
        body: "We chose BigQuery for the cloud warehouse and Fivetran for ingestion — Axiom's IT team could maintain both without us. We designed a medallion architecture: raw → cleaned → business-logic → presentation. Every transformation documented in dbt with full lineage.",
      },
      {
        phase: "03 — Semantic Layer",
        body: "The key insight from the failed previous project: the data was right but the definitions were wrong. 'Revenue' meant different things to finance, merchandising, and e-commerce. We built a semantic layer in dbt where every metric — revenue, margin, returns, LTV — has exactly one definition. One metric, one place, one truth.",
      },
      {
        phase: "04 — Dashboard Build",
        body: "We built 12 executive dashboards in Looker covering trading, product performance, supply chain, and customer analytics. Every dashboard refreshes every 15 minutes from the live warehouse. The weekly report that took 48 hours now takes 4 minutes to generate — automatically, every Monday at 06:00.",
      },
      {
        phase: "05 — Enablement",
        body: "We ran 8 training sessions with power users and produced a self-service guide. Within 30 days, 90% of ad-hoc data requests that previously went to the data team were being answered by business users directly in Looker.",
      },
    ],
    results: [
      { value: "40%",   label: "Revenue attribution accuracy lift", detail: "Resolved 3 years of conflicting measurement" },
      { value: "48→4m", label: "Weekly report generation time",     detail: "Fully automated, runs at 06:00 every Monday" },
      { value: "300",   label: "Active Looker users",               detail: "Zero data team bottleneck for ad-hoc analysis" },
      { value: "90d",   label: "Full delivery timeline",            detail: "Warehouse, transforms, 12 dashboards, training" },
      { value: "30%",   label: "Data error rate eliminated",        detail: "Down from 30% on manually produced reports" },
      { value: "£2.1M", label: "Previous failed project avoided",   detail: "Delivered in 90 days vs 14 months prior attempt" },
    ],
    stack:    ["BigQuery", "dbt", "Fivetran", "Looker", "Kafka", "Apache Airflow", "Python", "Terraform", "GitHub Actions", "Slack API"],
    quote:    "The previous project failed because they tried to solve everything at once. VertexData started with the data, not the dashboards. By the time we saw the first dashboard, we already trusted the numbers behind it.",
    quoteName:"Rachel Osei",
    quoteRole:"Chief Data Officer, Axiom Retail Group",
    nextSlug: "meridian-computer-vision",
    nextTitle:"99.3% defect detection accuracy across 12 production lines",
  },
  "meridian-computer-vision": {
    slug:       "meridian-computer-vision",
    client:     "Meridian Manufacturing",
    industry:   "Industrial Manufacturing",
    service:    "Computer Vision",
    location:   "Stuttgart, Germany",
    teamSize:   "5 VertexData engineers · 16 weeks",
    accentColor:"#00a07a",
    title:      "99.3% defect detection accuracy across 12 production lines",
    subtitle:   "Edge-deployed vision AI that runs at 60fps and catches what human QC misses — before the defect leaves the factory.",
    challenge:  "Meridian supplies Tier 1 components to three European automotive OEMs. Their manual quality control process had a 6.7% defect escape rate — each escaped defect triggering an average £12,000 warranty claim plus reputational risk with OEM partners. Human inspectors were working 3-shift rotations, fatiguing by hour 6, and had no way to inspect every unit at line speed. Meridian's operations director had been rejected by two CV vendors who said the defect variety was 'too complex for current AI'.",
    approach: [
      {
        phase: "01 — Defect Taxonomy",
        body: "We spent 3 weeks on the shop floor before writing a line of code. With quality engineers we catalogued every defect type, created a visual taxonomy of 47 distinct failure modes, and identified which were safety-critical vs cosmetic. This taxonomy became the training schema.",
      },
      {
        phase: "02 — Data Collection & Synthetic Augmentation",
        body: "Real defect examples were scarce — by definition, most parts pass. We collected 8,000 real defect images then used diffusion-based synthetic data generation to expand the dataset to 180,000 training examples across all 47 defect classes. Crucially, synthetic data was validated by quality engineers before entering the training set.",
      },
      {
        phase: "03 — Model Architecture",
        body: "We fine-tuned YOLOv9 for detection with a custom head for defect severity classification. TensorRT optimisation brought inference to 12ms per frame on NVIDIA Jetson AGX Orin — well within the 16ms budget for 60fps operation. The model runs entirely at the edge: no cloud dependency, no latency, no data leaving the factory.",
      },
      {
        phase: "04 — Integration & Line Deployment",
        body: "We integrated with Meridian's existing SCADA system for automated line stop on critical defect detection. Parts flagged as defective are automatically diverted to a quarantine lane. The dashboard shows live detection feeds, defect rate by line, and hourly trend analysis accessible from the operations centre.",
      },
      {
        phase: "05 — Active Learning Loop",
        body: "The system continuously improves. Every quarantined part is reviewed by a QC engineer whose verdict is fed back as a label. False positives and missed detections are surfaced for retraining. In 6 months of operation, false positive rate dropped from 2.1% to 0.4%.",
      },
    ],
    results: [
      { value: "99.3%", label: "Defect detection accuracy",       detail: "Across all 47 defect classes" },
      { value: "94%",   label: "Reduction in defect escape rate", detail: "From 6.7% to 0.4%" },
      { value: "3wk",   label: "Time to positive ROI",            detail: "Warranty cost savings exceeded project cost" },
      { value: "12",    label: "Production lines deployed",       detail: "Across 3 factory facilities" },
      { value: "60fps", label: "Real-time inspection speed",      detail: "At full line speed, zero slowdown" },
      { value: "0.4%",  label: "False positive rate",             detail: "Down from 2.1% after 6 months active learning" },
    ],
    stack:    ["YOLOv9", "TensorRT", "NVIDIA Jetson AGX Orin", "OpenCV", "ONNX Runtime", "SCADA API", "FastAPI", "InfluxDB", "Grafana", "PyTorch"],
    quote:    "Two vendors told us our defect variety was too complex. VertexData spent three weeks understanding our defects before they wrote a single line of code. That's why they succeeded where others didn't.",
    quoteName:"Klaus Reinhardt",
    quoteRole:"VP Operations, Meridian Manufacturing GmbH",
    nextSlug: "clarion-legal-llm",
    nextTitle:"40 years of case law, searchable and answerable in seconds",
  },
  "clarion-legal-llm": {
    slug:       "clarion-legal-llm",
    client:     "Clarion Legal LLP",
    industry:   "Legal Services",
    service:    "LLM & NLP Systems",
    location:   "London, UK",
    teamSize:   "4 VertexData engineers · 12 weeks",
    accentColor:"#008a68",
    title:      "40 years of case law, searchable and answerable in seconds",
    subtitle:   "A RAG system trained on 40 years of proprietary case files that answers with full citation — and a confidence score.",
    challenge:  "Clarion's 800 lawyers were spending an estimated 15% of their billable time searching through internal case precedents, memos, and correspondence. At an average billing rate of £450/hour across the firm, that's £27M of annual value locked in search friction. External legal databases like Westlaw answered questions about public case law but had no visibility into Clarion's proprietary work product — 40 years of how the firm had actually approached, argued, and resolved cases.",
    approach: [
      {
        phase: "01 — Document Pipeline",
        body: "Clarion had 2.3 million documents across matters dating to 1985. Formats ranged from modern Word docs to scanned PDFs to legacy WordPerfect files. We built an ingestion pipeline with OCR, format normalisation, PII detection, and matter-level access control tagging. Every document preserves its matter, author, date, and access permissions.",
      },
      {
        phase: "02 — Chunking & Embedding Strategy",
        body: "Legal documents require context-aware chunking — a clause mid-paragraph is meaningless without the section heading. We developed a hierarchical chunking strategy: document → section → paragraph, with parent context injected into child chunks. Embeddings generated with text-embedding-3-large and stored in Pinecone with metadata filters for matter type, date range, and jurisdiction.",
      },
      {
        phase: "03 — Retrieval Architecture",
        body: "We implemented hybrid retrieval: dense vector search for semantic similarity, sparse BM25 for exact legal terminology, and a re-ranker to combine scores. Initial retrieval pulls 40 candidates; the re-ranker selects the top 8 for context injection. This combination was critical — legal queries often contain exact citations that dense-only retrieval misses.",
      },
      {
        phase: "04 — Answer Generation with Citation",
        body: "Claude generates answers that cite the specific document, section, and passage used. Every citation is verified — if the cited passage doesn't support the claim, the answer is flagged for review. Confidence scores are generated based on retrieval score, source recency, and citation verification. Lawyers see a score from 1–100 and a recommendation to verify independently on scores below 85.",
      },
      {
        phase: "05 — Access Control & Audit",
        body: "This was non-negotiable: a lawyer must never see documents from a matter they're not authorised on. Access control is enforced at query time, not display time — the retrieval layer filters by the querying user's matter permissions before any document is considered. Every query is logged with user, timestamp, retrieved documents, and generated answer for SRA compliance.",
      },
    ],
    results: [
      { value: "94%",   label: "Answer accuracy with citation",   detail: "Benchmarked by 12 senior partners across 500 test queries" },
      { value: "15%",   label: "Lawyer time reclaimed",           detail: "Across 800 lawyers — equivalent to 120 full-time equivalents" },
      { value: "£1.8M", label: "Annual productivity value",       detail: "Conservative estimate at average billing rate" },
      { value: "800",   label: "Users in production day one",     detail: "Firm-wide rollout, zero phased approach needed" },
      { value: "2.3M",  label: "Documents indexed",               detail: "40 years of matters, memos, correspondence" },
      { value: "<3s",   label: "Average query response time",     detail: "Including retrieval, re-ranking, and generation" },
    ],
    stack:    ["RAG", "LlamaIndex", "Claude 3.5 Sonnet", "Azure OpenAI", "Pinecone", "BM25", "text-embedding-3-large", "FastAPI", "PostgreSQL", "Azure AD"],
    quote:    "I was sceptical. I've seen too many legal AI demos that looked good until a partner tested it with a real question. We had 12 partners stress-test this system and it passed. The citation verification was the detail that won us over.",
    quoteName:"Sarah Blackwood QC",
    quoteRole:"Managing Partner, Clarion Legal LLP",
    nextSlug: "novafin-agentic-support",
    nextTitle:"How we automated 85% of tier-1 support and saved $2.3M annually",
  },
};

type CaseStudy = typeof CASE_STUDIES["novafin-agentic-support"];

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cs = CASE_STUDIES[slug];
  if (!cs) notFound();

  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
        heroRef.current.style.opacity   = String(Math.max(0, 1 - window.scrollY / 500));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ac = cs.accentColor;

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-end pb-20 px-8 pt-32 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]" />
        {/* Colour glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${ac}08` }} />

        <div className="max-w-screen-xl mx-auto w-full" ref={heroRef}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#3a5550] mb-10">
            <Link href="/" className="hover:text-[#00e5b4] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-[#00e5b4] transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-[#5a7570]">{cs.client}</span>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border border-[#1e2b28] text-[#3a5550]">
              {cs.industry}
            </span>
            <span className="text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border"
              style={{ borderColor: `${ac}40`, color: ac }}>
              {cs.service}
            </span>
            <span className="text-[10px] text-[#2a3d38]">·</span>
            <span className="text-[10px] text-[#3a5550]">{cs.location}</span>
            <span className="text-[10px] text-[#2a3d38]">·</span>
            <span className="text-[10px] text-[#3a5550]">{cs.teamSize}</span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.2rem,5vw,5rem)] font-black tracking-tight leading-[1.0] mb-6 max-w-4xl">
            {cs.title}
          </h1>
          <p className="text-[#5a7570] text-lg max-w-2xl leading-relaxed">{cs.subtitle}</p>
        </div>
      </section>

      {/* ── KEY RESULTS BAND ──────────────────────────────────────────── */}
      <section className="border-y border-[#1e2b28] bg-[#0d0f0e]">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-[#1e2b28]">
            {cs.results.map((r, i) => (
              <Reveal key={r.label} delay={i * 60}>
                <div className="py-10 px-5 text-center group hover:bg-[#0a0c0b] transition-colors">
                  <div className="text-3xl font-black tracking-tight tabular-nums mb-1 transition-all duration-300"
                    style={{ color: ac }}>
                    {r.value}
                  </div>
                  <div className="text-[10px] text-[#5a7570] uppercase tracking-widest mb-1">{r.label}</div>
                  <div className="text-[9px] text-[#2a3d38] leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {r.detail}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE ─────────────────────────────────────────────────── */}
      <section className="py-24 px-8">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ac }}>The Challenge</p>
              <h2 className="text-2xl font-black tracking-tight">What we were up against.</h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[#8aada8] leading-relaxed text-lg">{cs.challenge}</p>
          </Reveal>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-y border-[#1e2b28]">
        <div className="max-w-screen-xl mx-auto">
          <Reveal>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ac }}>Our Approach</p>
            <h2 className="text-2xl font-black tracking-tight mb-20">How we solved it.</h2>
          </Reveal>

          <div className="space-y-0">
            {cs.approach.map((step, i) => (
              <Reveal key={step.phase} delay={i * 80}>
                <div className="grid md:grid-cols-[280px_1fr] gap-10 py-10 border-b border-[#1e2b28] last:border-0 group">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                        style={{ background: ac }} />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#3a5550] group-hover:text-[#00e5b4] transition-colors">
                        {step.phase}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#8aada8] leading-relaxed text-sm">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-8">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ac }}>Tech Stack</p>
              <h2 className="text-2xl font-black tracking-tight">What we built it with.</h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3">
              {cs.stack.map((tech, i) => (
                <span key={tech}
                  className="group/tech text-sm px-4 py-2.5 rounded-xl border border-[#1e2b28] text-[#5a7570]
                    hover:border-[#00e5b4]/40 hover:text-[#00e5b4] hover:bg-[#00e5b4]/04
                    transition-all duration-200 font-medium"
                  style={{ transitionDelay: `${i * 20}ms` }}>
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── QUOTE ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-[#0d0f0e] border-y border-[#1e2b28] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${ac}04 0%, transparent 70%)` }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <div className="text-[8rem] font-serif leading-none mb-4"
              style={{ color: `${ac}15` }}>"</div>
            <blockquote className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-medium leading-relaxed text-[#f0f5f3] mb-10 -mt-12">
              "{cs.quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: `${ac}20`, border: `1.5px solid ${ac}40`, color: ac }}>
                {cs.quoteName.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{cs.quoteName}</div>
                <div className="text-xs text-[#3a5550]">{cs.quoteRole}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── NEXT CASE STUDY ───────────────────────────────────────────── */}
      <section className="py-24 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Reveal>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-10">Next Case Study</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href={`/case-studies/${cs.nextSlug}`}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between
                gap-6 py-10 border-y border-[#1e2b28] hover:border-[#2a3d38] transition-colors">
              <h3 className="text-2xl font-black tracking-tight leading-tight max-w-2xl
                group-hover:text-[#00e5b4] transition-colors duration-300">
                {cs.nextTitle}
              </h3>
              <span className="text-3xl text-[#3a5550] group-hover:text-[#00e5b4] group-hover:translate-x-3
                transition-all duration-300 shrink-0">→</span>
            </Link>
          </Reveal>

          {/* CTA */}
          <Reveal delay={200}>
            <div className="mt-20 text-center">
              <p className="text-[#3a5550] text-sm mb-6">Want results like these?</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/projects"
                  className="inline-flex items-center gap-2 bg-[#00e5b4] text-black font-bold
                    px-10 py-4 rounded-xl text-base hover:bg-white hover:shadow-[0_0_60px_rgba(0,229,180,0.5)]
                    transition-all duration-300">
                  Order This Type of Project →
                </Link>
                <Link href="/#contact"
                  className="inline-flex items-center gap-2 border border-[#2a3d38] text-white font-semibold
                    px-10 py-4 rounded-xl text-base hover:border-[#00e5b4] hover:text-[#00e5b4]
                    transition-all duration-300">
                  Talk to Us First
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
