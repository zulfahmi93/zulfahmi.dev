import type { Metadata } from "next";
import { SITE } from "../_data/site";
import { ResumeTrigger } from "../_components/credential-triggers";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.fullName} about senior engineering roles, project work, or technical collaboration.`,
};

const SOCIAL_LABELS: Record<keyof typeof SITE.socials, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
};

/** Strip protocol + trailing slash for a clean displayed handle. */
function display(href: string): string {
  return href.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}

export default function ContactPage() {
  const socials = (Object.keys(SITE.socials) as (keyof typeof SITE.socials)[])
    .filter((key) => SITE.socials[key])
    .map((key) => ({ label: SOCIAL_LABELS[key], href: SITE.socials[key] }));

  return (
    <>
      <header className="zf-pagehead">
        <div className="zf-container">
          <p className="zf-eyebrow">Contact</p>
          <h1>Let&rsquo;s talk.</h1>
          <p className="zf-lede">
            Email is the easiest way to reach me. I&rsquo;m open to senior engineering
            roles, consulting, and collaborations where careful implementation matters.
          </p>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          <div className="zf-contact-methods">
            <a className="zf-contact-card" href={`mailto:${SITE.email}`}>
              <span className="k">Email</span>
              <span className="v">{SITE.email}</span>
            </a>

            {socials.map((s) => (
              <a
                key={s.label}
                className="zf-contact-card"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="k">{s.label}</span>
                <span className="v">{display(s.href)}</span>
              </a>
            ))}

            <ResumeTrigger className="zf-contact-card">
              <span className="k">Résumé</span>
              <span className="v">View &amp; download</span>
            </ResumeTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
