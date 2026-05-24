import type { Metadata } from "next";
import { SITE } from "../_data/site";
import { HeroOrbs } from "../_components/hero-orbs";
import { ArrowUpRight } from "../_components/icons";
import { ContactForm } from "../_components/contact-form";
import { ResumeTrigger } from "../_components/credential-triggers";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.fullName} about senior engineering roles, project work, or technical collaboration.`,
};

/** Strip protocol + trailing slash for a clean displayed handle. */
function display(href: string): string {
  return href.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}

export default function ContactPage() {
  const socials = [
    { label: "GitHub", href: SITE.socials.github },
    { label: "LinkedIn", href: SITE.socials.linkedin },
  ].filter((s) => s.href);

  return (
    <>
      <header className="zf-pagehead">
        <HeroOrbs variant="soft" />
        <div className="zf-container zf-pagehead-inner">
          <p className="zf-eyebrow">Contact</p>
          <h1>
            Let&rsquo;s <span className="ital">talk.</span>
          </h1>
          <p className="zf-lede">
            Send me something specific — the problem, the constraints, what&rsquo;s already
            been tried. I&rsquo;ll write back with what I think and why.
          </p>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          <div className="zf-ct-layout">
            <ContactForm />

            <aside className="zf-ct-direct">
              <h3>Or reach me directly</h3>
              <div className="zf-ct-stack">
                <a className="zf-ct-card" href={`mailto:${SITE.email}`}>
                  <div>
                    <span className="k">Email</span>
                    <span className="v">{SITE.email}</span>
                  </div>
                  <ArrowUpRight />
                </a>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    className="zf-ct-card"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>
                      <span className="k">{s.label}</span>
                      <span className="v">{display(s.href)}</span>
                    </div>
                    <ArrowUpRight />
                  </a>
                ))}
                <ResumeTrigger className="zf-ct-card">
                  <div>
                    <span className="k">Résumé</span>
                    <span className="v">View &amp; download</span>
                  </div>
                  <ArrowUpRight />
                </ResumeTrigger>
              </div>

              <div className="zf-ct-availability">
                <b>
                  <span className="zf-ct-ping" aria-hidden="true" />
                  Currently open to
                </b>
                Senior engineering roles &amp; selective project work where careful
                implementation matters. Replies within a few working days.
              </div>
            </aside>
          </div>

          <div className="zf-ct-note">
            <p className="k">A note from {SITE.name}</p>
            <h2>
              &ldquo;I read every message and write back personally — but specific, concrete
              questions get specific, concrete answers.&rdquo;
            </h2>
            <p className="signoff">— {SITE.name}</p>
          </div>

          <dl className="zf-ct-locator">
            <div>
              <dt className="k">Based in</dt>
              <dd className="v">{SITE.location}</dd>
            </div>
            <div>
              <dt className="k">Latitude</dt>
              <dd className="v">{SITE.coords.lat}</dd>
            </div>
            <div>
              <dt className="k">Longitude</dt>
              <dd className="v">{SITE.coords.lon}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
