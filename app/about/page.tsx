import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "../_components/reveal";
import { HeroOrbs } from "../_components/hero-orbs";
import { ArrowRight } from "../_components/icons";
import { CredentialButton, ResumeTrigger } from "../_components/credential-triggers";
import {
  CAPABILITIES,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  SITE,
  STATS,
} from "../_data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Zulfahmi Ahmad is a senior software engineer in Sungai Udang, Melaka who leads a Flutter team and builds mobile, web, backend, and AI-assisted systems.",
};

export default function AboutPage() {
  return (
    <>
      <header className="zf-pagehead">
        <HeroOrbs variant="soft" />
        <div className="zf-container zf-pagehead-inner">
          <p className="zf-eyebrow">About</p>
          <h1>
            Hi, I&rsquo;m <span className="ital">{SITE.name}.</span>
          </h1>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          {/* Intro: portrait + bio */}
          <div className="zf-about-intro">
            <div className="zf-portrait-arch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.portrait}
                alt={`Portrait of ${SITE.fullName}`}
                width={720}
                height={900}
              />
              <div className="zf-portrait-tag">
                <span className="dot" aria-hidden="true" />
                {SITE.location}
              </div>
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
              <div className="zf-hero-cta">
                <ResumeTrigger className="zf-btn zf-btn-primary">
                  View résumé <ArrowRight />
                </ResumeTrigger>
                <a href={`mailto:${SITE.email}`} className="zf-btn zf-btn-secondary">
                  Email me
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="zf-stats">
            {STATS.map((stat) => {
              const m = stat.value.match(/^(\d+)(.*)$/);
              return (
                <div className="zf-stat" key={stat.label}>
                  <span className="num">
                    {m ? m[1] : stat.value}
                    {m && m[2] && <em>{m[2]}</em>}
                  </span>
                  <span className="label">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <header className="zf-numhead">
              <div className="num">01</div>
              <h2>
                Places I&rsquo;ve <span className="ital">worked</span>
              </h2>
              <p className="lede">
                A decade of mobile, backend, and research — shipping in production
                environments where small mistakes were expensive.
              </p>
            </header>
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

      {/* Capabilities */}
      <section className="zf-section soft tight">
        <div className="zf-container">
          <Reveal>
            <header className="zf-numhead">
              <div className="num">02</div>
              <h2>
                Tools I <span className="ital">use</span> often
              </h2>
              <p className="lede">
                Stack I reach for. Not a complete list — the ones that earn their seat.
              </p>
            </header>
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
          <Reveal>
            <header className="zf-numhead">
              <div className="num">03</div>
              <h2>
                On <span className="ital">paper</span>
              </h2>
              <p className="lede">Formal credentials — the official ones at least.</p>
            </header>
          </Reveal>
          <div className="zf-creds">
            <div>
              <h4 className="zf-creds-h">Education</h4>
              {EDUCATION.map((ed) => (
                <div className="zf-cred-row" key={ed.title}>
                  <div>
                    <span className="t">{ed.title}</span>
                    <span className="m">
                      {ed.org} · {ed.location}
                    </span>
                  </div>
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
              <h2>
                Want to <span className="ital">talk</span> through the work?
              </h2>
              <p>I&rsquo;m happy to share more context, walk through code, or discuss a role.</p>
              <div className="zf-cta-row">
                <Link href="/contact" className="zf-btn zf-btn-primary">
                  Get in touch <ArrowRight />
                </Link>
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
