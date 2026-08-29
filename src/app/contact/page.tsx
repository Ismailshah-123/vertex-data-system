"use client";
import { useEffect, useRef, useState } from "react";

const SERVICES = ["CRM Automation & Lead Gen","Data Analytics & BI","Web Development","AI Knowledge Assistants (RAG Chatbots)","Voice AI Agents","ML Engineering & Predictive Analytics","Agentic AI & Automation","Computer Vision","NLP & LLM Systems","Not sure yet — help me figure it out"];
const BUDGETS  = ["Under £50K","£50K – £150K","£150K – £500K","£500K+","Ongoing retainer"];
const TIMELINES= ["ASAP","1–3 months","3–6 months","6+ months"];

function FloatingLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/field">
      <label className="block text-[10px] tracking-[0.18em] uppercase text-[#3a5550] mb-2 group-focus-within/field:text-[#00e5b4] transition-colors">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#0d0f0e] border border-[#1e2b28] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#2a3d38] focus:outline-none focus:border-[#00e5b4] focus:shadow-[0_0_0_3px_rgba(0,229,180,0.07)] transition-all duration-200";

export default function ContactPage() {
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm]           = useState({ firstName:"",lastName:"",email:"",company:"",service:"",budget:"",timeline:"",challenge:"",website:"" });
  const heroRef                   = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / 400));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); };
  }, []);

  const canNext1 = form.firstName && form.lastName && form.email && form.company;
  const canNext2 = form.service && form.budget && form.timeline;
  const canSubmit = canNext2 && form.challenge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again or email us directly.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't reach the server. Please check your connection or email us directly at hello@vertexdata.systems.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#0a0c0b] text-[#f0f5f3] overflow-x-hidden min-h-screen">
      <style>{`
        @keyframes stepReveal { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        .step-enter { animation: stepReveal 0.4s ease forwards; }
      `}</style>

      {/* BG grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,229,180,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,180,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,229,180,0.04),transparent_70%)] pointer-events-none" />

      {/* HERO */}
      <section className="relative pt-36 pb-16 px-8 overflow-hidden">
        <div className="max-w-screen-xl mx-auto" ref={heroRef}>
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-[#00e5b4]" />
            <span className="text-[#00e5b4] text-xs tracking-[0.25em] uppercase">Start a Project</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black tracking-tight leading-[0.95] mb-6">
            Tell us what<br />
            <span className="text-[#00e5b4]">you're building.</span>
          </h1>
          <p className="text-[#5a7570] text-lg max-w-xl leading-relaxed">
            No 30-slide deck. No automated qualification. A real engineer reads every submission and replies within 24 hours with an honest assessment.
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="px-8 pb-32">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1fr_480px] gap-16 items-start">

          {/* LEFT — info */}
          <div className="space-y-8">
            {/* What happens next */}
            <div className="border border-[#1e2b28] rounded-2xl p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-6">What Happens Next</p>
              {[
                { n: "01", title: "We read it",        body: "A senior engineer reads your submission the same day — no automated scoring, no junior SDR." },
                { n: "02", title: "We respond",        body: "Within 24 hours with an initial assessment of your challenge and whether we're the right team." },
                { n: "03", title: "60-min audit call", body: "We spend an hour going deep on your data, your goals, and your constraints. No pitch." },
                { n: "04", title: "Concrete proposal", body: "A written proposal with scope, timeline, team composition, and a fixed or capped price within 5 working days." },
              ].map((s, i) => (
                <div key={s.n} className={`flex gap-5 ${i < 3 ? "pb-6 mb-6 border-b border-[#111]" : ""} group`}>
                  <div className="text-xs font-black text-[#2a3d38] w-6 shrink-0 group-hover:text-[#00e5b4] transition-colors pt-0.5">{s.n}</div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1 group-hover:text-[#00e5b4] transition-colors">{s.title}</div>
                    <div className="text-xs text-[#5a7570] leading-relaxed">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct contacts */}
            <div className="border border-[#1e2b28] rounded-2xl p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3a5550] mb-6">Direct Contact</p>
              {[
                { icon: "✉", label: "Email", value: "hello@vertexdata.systems" },
                { icon: "🌐", label: "Working", value: "Remote-first, worldwide" },
                { icon: "⚡", label: "Response time", value: "Under 24 hours — always" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 py-4 border-b border-[#111] last:border-0 group">
                  <span className="text-base w-6 shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-[10px] text-[#3a5550] uppercase tracking-widest mb-0.5">{item.label}</div>
                    <div className="text-sm text-white group-hover:text-[#00e5b4] transition-colors">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — multi-step form */}
          <div className="lg:sticky lg:top-28">
            {submitted ? (
              <div className="border border-[#00e5b4]/30 rounded-2xl p-10 text-center bg-[#0d1a16]">
                <div className="w-16 h-16 rounded-full bg-[#00e5b4]/10 border border-[#00e5b4]/30 flex items-center justify-center text-3xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-black tracking-tight mb-3 text-[#00e5b4]">Received.</h3>
                <p className="text-[#5a7570] text-sm leading-relaxed max-w-xs mx-auto">
                  A senior engineer will read this today and reply within 24 hours with an honest assessment. No automated response — a real human.
                </p>
                <div className="mt-8 pt-8 border-t border-[#1e2b28]">
                  <p className="text-xs text-[#3a5550]">While you wait, read a case study →</p>
                </div>
              </div>
            ) : (
              <div className="border border-[#1e2b28] rounded-2xl overflow-hidden bg-[#0d0f0e]">
                {/* Step progress */}
                <div className="flex border-b border-[#1e2b28]">
                  {["You","Project","Challenge"].map((s, i) => (
                    <button key={s} onClick={() => { if (i+1 < step || (i+1===2&&canNext1) || (i+1===3&&canNext2)) setStep(i+1); }}
                      className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-200 relative
                        ${step === i+1 ? "text-[#00e5b4]" : step > i+1 ? "text-[#3a5550]" : "text-[#1e2b28]"}`}>
                      {step > i+1 && <span className="mr-1.5">✓</span>}{s}
                      {step === i+1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00e5b4]" />}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="p-7 space-y-5">

                  {/* Honeypot — invisible to real users, tabIndex -1 and aria-hidden so
                      screen readers skip it too. Bots that blindly fill every input trip
                      this; humans never see it exists. Checked server-side in the API route. */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={set("website")}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] w-px h-px opacity-0 pointer-events-none"
                  />

                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="step-enter space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <FloatingLabel label="First name">
                          <input value={form.firstName} onChange={set("firstName")} placeholder="Alex" className={inputCls} />
                        </FloatingLabel>
                        <FloatingLabel label="Last name">
                          <input value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className={inputCls} />
                        </FloatingLabel>
                      </div>
                      <FloatingLabel label="Work email">
                        <input type="email" value={form.email} onChange={set("email")} placeholder="alex@company.com" className={inputCls} />
                      </FloatingLabel>
                      <FloatingLabel label="Company">
                        <input value={form.company} onChange={set("company")} placeholder="Acme Corp" className={inputCls} />
                      </FloatingLabel>
                      <button type="button" onClick={() => canNext1 && setStep(2)} disabled={!canNext1}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300
                          ${canNext1 ? "bg-[#00e5b4] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.4)]" : "bg-[#1e2b28] text-[#3a5550]"}`}>
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="step-enter space-y-5">
                      <FloatingLabel label="Service needed">
                        <select value={form.service} onChange={set("service")} className={inputCls + " appearance-none"}>
                          <option value="">Select a service</option>
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </FloatingLabel>
                      <FloatingLabel label="Budget range">
                        <select value={form.budget} onChange={set("budget")} className={inputCls + " appearance-none"}>
                          <option value="">Select budget</option>
                          {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </FloatingLabel>
                      <FloatingLabel label="Timeline">
                        <select value={form.timeline} onChange={set("timeline")} className={inputCls + " appearance-none"}>
                          <option value="">When do you need this?</option>
                          {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </FloatingLabel>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)}
                          className="flex-1 py-3.5 rounded-xl text-sm font-semibold border border-[#1e2b28] text-[#5a7570] hover:border-[#2a3d38] hover:text-white transition-all duration-200">
                          ← Back
                        </button>
                        <button type="button" onClick={() => canNext2 && setStep(3)} disabled={!canNext2}
                          className={`flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all duration-300
                            ${canNext2 ? "bg-[#00e5b4] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.4)]" : "bg-[#1e2b28] text-[#3a5550]"}`}>
                          Continue →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="step-enter space-y-5">
                      <FloatingLabel label="Tell us about your challenge">
                        <textarea value={form.challenge} onChange={set("challenge")} rows={7}
                          placeholder={"We're sitting on 3 years of customer data and getting nothing from it. We need someone who can build us a system that actually helps us make decisions in real time — not just a dashboard we ignore..."}
                          className={inputCls + " resize-none leading-relaxed"} />
                      </FloatingLabel>
                      <p className="text-[10px] text-[#2a3d38]">The more specific you are, the more useful our response will be. No detail is too technical.</p>
                      {submitError && (
                        <div className="text-xs text-[#ff6b8a] bg-[#2a0f16] border border-[#ff6b8a]/30 rounded-lg px-4 py-3">
                          {submitError}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(2)}
                          className="flex-1 py-3.5 rounded-xl text-sm font-semibold border border-[#1e2b28] text-[#5a7570] hover:border-[#2a3d38] hover:text-white transition-all duration-200">
                          ← Back
                        </button>
                        <button type="submit" disabled={!canSubmit || submitting}
                          className={`flex-[2] py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                            ${canSubmit && !submitting ? "bg-[#00e5b4] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,180,0.4)]" : "bg-[#1e2b28] text-[#3a5550]"}`}>
                          {submitting ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message →"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
