import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "../_components/reveal";
import { ArrowRight } from "../_components/icons";
import { CredentialButton, ResumeTrigger } from "../_components/credential-triggers";
import {
  CAPABILITIES,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  PRINCIPLES,
  SITE,
  STATS,
} from "../_data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zulfahmi Ahmad is a senior software engineer in Malaysia who leads a Flutter team and builds mobile, web, backend, and AI-assisted systems.",
};

export default function AboutPage() {
  return (
    <>
      <header className="zf-pagehead">
        <div className="zf-container">
          <p className="zf-eyebrow">About</p>
          <h1>Hi, I&rsquo;m {SITE.name}.</h1>
        </div>
      </header>

      {/* Intro: portrait + bio */}
      <section className="zf-section tight">
        <div className="zf-container">
          <div className="zf-about-intro">
            <div className="zf-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.portrait}
                alt={`Portrait of ${SITE.fullName}`}
                width={720}
                height={899}
              />
            </div>
            <div className="zf-prose">
              <p className="zf-lede">
                I&rsquo;m a senior software engineer in {SITE.location}. I lead a
                Flutter team, and I like building software that holds up once people
                start relying on it.
              </p>
              <p>
                I currently head a Flutter team of seven engineers. We&rsquo;ve shipped
                5+ production apps with 50k+ downloads, and we&rsquo;ve had to move quickly
                without losing track of quality. Before that, I worked on .NET and web
                systems, including a government membership platform that reduced card
                issuance from days to seconds and a state border-management system
                delivered during COVID.
              </p>
              <p>
                The projects here are the kind of problems I enjoy: payments, OCR,
                scheduling, rendering. They force you to be clear about rules, failure
                modes, and what AI should or should not decide.
              </p>
              <div className="zf-hero-cta" style={{ marginTop: 28 }}>
                <ResumeTrigger className="zf-btn zf-btn-primary">
                  View résumé <ArrowRight />
                </ResumeTrigger>
                <a href={`mailto:${SITE.email}`} className="zf-btn zf-btn-secondary">
                  Email me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="zf-section tight">
        <div className="zf-container">
          <div className="zf-stats">
            {STATS.map((stat) => (
              <div className="zf-stat" key={stat.label}>
                <span className="num">{stat.value}</span>
                <span className="label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="zf-section soft">
        <div className="zf-container">
          <Reveal>
            <div className="zf-section-head">
              <p className="zf-eyebrow">Experience</p>
              <h2 className="zf-section-title">Places I&rsquo;ve worked</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <ol className="zf-timeline">
              {EXPERIENCE.map((role) => (
                <li className="zf-tl-item" key={`${role.title}-${role.period}`}>
                  <div className="zf-tl-head">
                    <h3>{role.title}</h3>
                    <span className="zf-tl-org">
                      {role.org} · {role.location}
                    </span>
                    <span className="zf-tl-period">{role.period}</span>
                  </div>
                  <ul className="zf-tl-points">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* How I work */}
      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-section-head">
              <p className="zf-eyebrow">How I work</p>
              <h2 className="zf-section-title">Habits I bring to the work</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="zf-values">
              {PRINCIPLES.map((principle, i) => (
                <div className="zf-value" key={principle.title}>
                  <div className="zf-value-num">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="zf-section soft tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-section-head">
              <p className="zf-eyebrow">Capabilities</p>
              <h2 className="zf-section-title">Tools I use often</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="zf-caps">
              {CAPABILITIES.map((cap) => (
                <div className="zf-cap" key={cap.group}>
                  <h4>{cap.group}</h4>
                  <ul>
                    {cap.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Education + certifications */}
      <section className="zf-section tight">
        <div className="zf-container">
          <div className="zf-creds">
            <div>
              <h4 className="zf-creds-h">Education</h4>
              {EDUCATION.map((ed) => (
                <div className="zf-cred-row" key={ed.title}>
                  <span className="t">{ed.title}</span>
                  <span className="m">
                    {ed.org} · {ed.location}
                  </span>
                  <span className="y">{ed.period}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="zf-creds-h">Certifications</h4>
              <div className="zf-cred-list">
                {CERTIFICATIONS.map((cert) => (
                  <CredentialButton cert={cert} key={cert.title} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-cta-band">
              <h2>Want to talk through the work?</h2>
              <p>I&rsquo;m happy to share more context, walk through code, or discuss a role.</p>
              <div className="zf-cta-row">
                <a href={`mailto:${SITE.email}`} className="zf-btn zf-btn-primary">
                  Email me <ArrowRight />
                </a>
                <Link href="/work" className="zf-btn zf-btn-secondary">
                  See the work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
