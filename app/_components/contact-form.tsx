"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight } from "./icons";
import { SITE } from "../_data/site";

/**
 * Contact endpoint, inlined at build from NEXT_PUBLIC_CONTACT_ENDPOINT. When set
 * (e.g. the Resend relay Worker), the form POSTs JSON there. When unset, the form
 * gracefully falls back to composing a mailto so it's never a dead end.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "submitting" | "success" | "error";
type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const e: Errors = {};
  if (!values.name.trim()) e.name = "Tell me who you are.";
  if (!values.email.trim()) e.email = "I need somewhere to write back.";
  else if (!EMAIL_RE.test(values.email.trim())) e.email = "That doesn't look like an email.";
  if (!values.message.trim()) e.message = "What's on your mind?";
  else if (values.message.trim().length < 12) e.message = "A little more detail, please.";
  return e;
}

/** Label + control + error/hint/counter row. Editorial form, labels above. */
function Field({
  label,
  htmlFor,
  error,
  hint,
  counter,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  counter?: number;
  children: ReactNode;
}) {
  return (
    <div className={`zf-cf-field${error ? " zf-cf-field-err" : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      <div className="zf-cf-aux">
        {error && (
          <span className="zf-cf-err" id={`${htmlFor}-error`}>
            {error}
          </span>
        )}
        {!error && hint && <span className="zf-cf-hint">{hint}</span>}
        {typeof counter === "number" && <span className="zf-cf-counter">{counter}</span>}
      </div>
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  const blur = (key: keyof Values) => () => setTouched((t) => ({ ...t, [key]: true }));

  const errors = validate(values);
  const showError = (key: keyof Values) => (touched[key] && errors[key]) || null;
  const invalid = Object.keys(errors).length > 0;

  const composeMailto = () => {
    const subject = values.subject.trim() || "Portfolio enquiry";
    const body = `${values.message}\n\n— ${values.name} (${values.email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (invalid) return;

    if (!ENDPOINT) {
      composeMailto();
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Bad response: ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="zf-cf-success" role="status">
        <div className="zf-cf-success-glyph" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="zf-cf-success-eyebrow">Sent</p>
        <h3>Thanks — I&rsquo;ll write back.</h3>
        <p>
          {ENDPOINT
            ? "Your message reached me. I usually reply within a couple of working days."
            : "Your email app should have opened with the message ready to send."}{" "}
          If it&rsquo;s urgent, reach me at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <button
          type="button"
          className="zf-btn zf-btn-secondary"
          onClick={() => {
            setStatus("idle");
            setValues({ name: "", email: "", subject: "", message: "" });
            setTouched({});
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="zf-cf" onSubmit={onSubmit} noValidate>
      <div className="zf-cf-row zf-cf-row-2">
        <Field label="Your name" htmlFor="cf-name" error={showError("name")}>
          <input
            id="cf-name"
            type="text"
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            autoComplete="name"
            placeholder="e.g. Aida Karim"
            aria-invalid={!!showError("name")}
            aria-describedby={showError("name") ? "cf-name-error" : undefined}
            required
          />
        </Field>
        <Field label="Email" htmlFor="cf-email" error={showError("email")}>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!showError("email")}
            aria-describedby={showError("email") ? "cf-email-error" : undefined}
            required
          />
        </Field>
      </div>
      <Field
        label="Subject"
        htmlFor="cf-subject"
        hint="Optional — a few words about what this is about."
      >
        <input
          id="cf-subject"
          type="text"
          value={values.subject}
          onChange={set("subject")}
          onBlur={blur("subject")}
          placeholder="Senior engineering role / project enquiry / chat"
        />
      </Field>
      <Field
        label="Message"
        htmlFor="cf-message"
        error={showError("message")}
        counter={values.message.length}
      >
        <textarea
          id="cf-message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          placeholder="Tell me the problem, the constraints, and what you've already tried."
          aria-invalid={!!showError("message")}
          aria-describedby={showError("message") ? "cf-message-error" : undefined}
          required
        />
      </Field>

      {status === "error" && (
        <p className="zf-cf-formerror" role="alert">
          Something went wrong sending that. Please try again, or email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> directly.
        </p>
      )}

      <div className="zf-cf-actions">
        <button type="submit" className="zf-btn zf-btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              Sending
              <span className="zf-cf-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </>
          ) : (
            <>
              Send message <ArrowRight />
            </>
          )}
        </button>
        <p className="zf-cf-fineprint">I read every message. Replies are usually quick on weekdays.</p>
      </div>
    </form>
  );
}
