/**
 * Contact relay — Cloudflare Worker.
 *
 * The portfolio is a static site, so it cannot hold the Resend API key safely.
 * This Worker is the thin server-side hop: the browser POSTs the contact form as
 * JSON here, the Worker validates it and calls Resend with the key stored as a
 * Worker secret, then returns a small JSON result. The key never reaches the
 * client.
 *
 * Threat model:
 *  - Untrusted input: every field is type-checked, length-capped, and the email
 *    is regex-validated before anything is sent. Oversized bodies are rejected.
 *  - Secret exposure: RESEND_API_KEY lives only as a Worker secret; it is never
 *    logged or returned.
 *  - Header/content injection: fields go to Resend as a JSON body (not raw SMTP
 *    headers); reply_to is a validated email, and text is plain — no interpolation
 *    into a header line an attacker controls.
 *  - Cross-origin abuse: CORS is locked to ALLOWED_ORIGIN, not "*".
 *  - Spam volume: cap with a Cloudflare Rate Limiting rule on this route (see
 *    README). The Worker stays stateless.
 */

export interface Env {
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN: string; // e.g. "https://zulfahmi.dev"
  FROM_EMAIL: string;     // verified sender, e.g. "Portfolio <contact@zulfahmi.dev>"
  TO_EMAIL: string;       // inbox that receives the message
}

type Payload = { name: string; email: string; subject: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 200, subject: 200, message: 5000 } as const;
const MAX_BODY_BYTES = 16 * 1024;

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function isPayload(value: unknown): value is Payload {
  if (typeof value !== "object" || value === null) return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    b.name.length <= LIMITS.name &&
    typeof b.email === "string" &&
    EMAIL_RE.test(b.email.trim()) &&
    b.email.length <= LIMITS.email &&
    typeof b.subject === "string" &&
    b.subject.length <= LIMITS.subject &&
    typeof b.message === "string" &&
    b.message.trim().length >= 12 &&
    b.message.length <= LIMITS.message
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = env.ALLOWED_ORIGIN || "";
    const origin = request.headers.get("Origin") ?? "";
    const allowOrigin = origin === allowed ? origin : allowed;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(allowOrigin) });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, allowOrigin);
    }
    if (allowed && origin && origin !== allowed) {
      return json({ ok: false, error: "Forbidden origin" }, 403, allowOrigin);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "Payload too large" }, 413, allowOrigin);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, allowOrigin);
    }
    if (!isPayload(parsed)) {
      return json({ ok: false, error: "Invalid submission" }, 422, allowOrigin);
    }

    const { name, email, subject, message } = parsed;
    const subjectLine = subject.trim() || "Portfolio enquiry";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        reply_to: email.trim(),
        subject: `[Portfolio] ${subjectLine}`,
        text: `From: ${name.trim()} <${email.trim()}>\nSubject: ${subjectLine}\n\n${message.trim()}`,
      }),
    });

    if (!resendRes.ok) {
      // Don't leak Resend's response detail to the client.
      return json({ ok: false, error: "Delivery failed" }, 502, allowOrigin);
    }

    return json({ ok: true }, 200, allowOrigin);
  },
};
