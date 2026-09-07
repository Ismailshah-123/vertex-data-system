import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/contact
   
   Receives the contact form payload and sends it as a real email via
   Resend (resend.com) — free tier covers 3,000 emails/month, which is
   more than enough for a contact form.

   SETUP (2 minutes):
   1. Sign up at https://resend.com (free)
   2. Verify your sending domain OR use their default onboarding domain
      for testing
   3. Get your API key from the Resend dashboard
   4. Add to .env.local:
        RESEND_API_KEY=re_your_key_here
        CONTACT_EMAIL=hello@vertexdata.systems   ← where YOU want to receive leads
   5. npm install resend
   6. Restart your dev server

   Until RESEND_API_KEY is set, this route falls back to logging the
   submission to your server console so nothing is silently lost during
   development — but you MUST set the real key before going live.
───────────────────────────────────────────────────────────────────────── */

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  challenge: string;
  website?: string; // honeypot — real users never fill this, bots often do
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Rate limiting ────────────────────────────────────────────────────────
   Lightweight in-memory sliding-window limiter — no extra dependency.
   Honest caveat: this resets on cold start and isn't shared across
   serverless instances, so it's a real deterrent against casual abuse,
   not a hard guarantee under multi-instance load. If this route starts
   seeing meaningful traffic, swap the Map below for a durable store
   (Upstash Redis / Vercel KV) behind the same isRateLimited() interface.
──────────────────────────────────────────────────────────────────────────*/
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;                     // submissions per window per IP
const submissionLog = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissionLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(ip, recent);
  // Opportunistic cleanup so this Map doesn't grow unbounded between cold starts
  if (submissionLog.size > 5000) {
    for (const [key, times] of submissionLog) {
      if (times.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) submissionLog.delete(key);
    }
  }
  return false;
}

// Escape user input before interpolating into the email HTML — otherwise
// a submission could inject arbitrary HTML/links into the email you receive.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // Reject oversized bodies before parsing — a legitimate submission from
  // this form is at most a few KB. Checking Content-Length up front means
  // an abusive multi-MB payload gets rejected immediately instead of being
  // fully parsed into memory first.
  const MAX_BODY_BYTES = 50_000; // 50KB — generous headroom over a real submission
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, company, service, budget, timeline, challenge, website } = body;

  // Honeypot — a real user never sees or fills this field (it's visually and
  // from-screen-reader hidden). If it has a value, this is a bot. Return a
  // success response anyway so the bot doesn't learn to look for a different
  // signal — just silently drop the submission instead of sending it.
  if (website && website.trim().length > 0) {
    return NextResponse.json({ success: true, mode: "logged" });
  }

  // Server-side validation — never trust the client alone
  if (!firstName || !lastName || !email || !company || !service || !budget || !timeline || !challenge) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  // Sanity length caps — defends against spam payloads and absurdly large requests
  if (challenge.length > 5000 || firstName.length > 100 || lastName.length > 100 || company.length > 200) {
    return NextResponse.json({ error: "One of the fields is too long. Please shorten it and try again." }, { status: 400 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "hello@vertexdata.systems";

  const emailHtml = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0a0c0b; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #00e5b4; font-size: 18px; margin: 0;">New Project Inquiry</h1>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8e6; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px; width: 140px;">Name</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px;">Company</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(company)}</td></tr>
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px;">Service</td>
              <td style="padding: 8px 0;">${escapeHtml(service)}</td></tr>
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px;">Budget</td>
              <td style="padding: 8px 0;">${escapeHtml(budget)}</td></tr>
          <tr><td style="padding: 8px 0; color: #5a6b68; font-size: 12px;">Timeline</td>
              <td style="padding: 8px 0;">${escapeHtml(timeline)}</td></tr>
        </table>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8e6;">
          <p style="color: #5a6b68; font-size: 12px; margin: 0 0 8px 0;">Challenge description</p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(challenge)}</p>
        </div>
      </div>
    </div>
  `;

  // Fallback mode: no API key configured yet — log instead of failing silently
  if (!RESEND_API_KEY) {
    console.log("═══════════════════════════════════════════════════");
    console.log("📬 CONTACT FORM SUBMISSION (RESEND_API_KEY not set)");
    console.log("═══════════════════════════════════════════════════");
    console.log(`From:     ${firstName} ${lastName} <${email}>`);
    console.log(`Company:  ${company}`);
    console.log(`Service:  ${service} | Budget: ${budget} | Timeline: ${timeline}`);
    console.log(`Message:  ${challenge}`);
    console.log("═══════════════════════════════════════════════════");
    console.log("⚠️  Set RESEND_API_KEY in .env.local to actually send this by email.");
    return NextResponse.json({ success: true, mode: "logged" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vertex Data Systems <onboarding@resend.dev>", // change once your domain is verified
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `New inquiry: ${company} — ${service}`,
        html: emailHtml,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend API error:", errText);
      return NextResponse.json({ error: "Failed to send email. Please try again or email us directly." }, { status: 502 });
    }

    return NextResponse.json({ success: true, mode: "sent" });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    console.error("Contact form error:", timedOut ? "Resend request timed out" : err);
    return NextResponse.json({ error: "Something went wrong. Please email us directly at hello@vertexdata.systems." }, { status: 500 });
  }
}
