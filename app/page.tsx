import Link from "next/link";
import { Reveal } from "./_components/reveal";
import { ProjectCard } from "./_components/project-card";
import { HeroShader } from "./_components/hero-shader";
import { ArrowRight } from "./_components/icons";
import { LEAD_PROJECTS } from "./_data/projects";
import { PRINCIPLES, SITE, STACK } from "./_data/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="zf-hero">
        <div className="zf-hero-bg" aria-hidden="true" />
        <HeroShader />
        <div className="zf-hero-veil" aria-hidden="true" />
        <div className="zf-container zf-hero-inner">
          <p className="zf-hero-eyebrow">
            <span className="dot" aria-hidden="true" />
            {SITE.role} · Malaysia
          </p>
          <h1 className="zf-hero-title">I build software people can rely on.</h1>
          <p className="zf-hero-sub">{SITE.positioning}</p>
          <div className="zf-hero-cta">
            <Link href="/work" className="zf-btn zf-btn-dark">
              View work <ArrowRight />
            </Link>
            <Link href="/contact" className="zf-btn zf-btn-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stack strip */}
      <div className="zf-stack">
        <div className="zf-container">
          <div className="zf-stack-inner">
            <span className="zf-stack-label">Mostly built with</span>
            <ul className="zf-stack-list">
              {STACK.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Selected work */}
      <section className="zf-section">
        <div className="zf-container">
          <Reveal>
            <div className="zf-section-head">
              <p className="zf-eyebrow">Selected work</p>
              <h2 className="zf-section-title">Projects with real constraints</h2>
              <p className="zf-lede">
                A payments client, an OCR counting pipeline, a timetable solver, and
                a receipt renderer. Different domains, same habit: make the important
                parts explicit and testable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="zf-grid-2">
              {LEAD_PROJECTS.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Reveal>
          <p style={{ marginTop: 28 }}>
            <Link href="/work" className="zf-card-link">
              View all work <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      {/* How I work */}
      <section className="zf-section soft">
        <div className="zf-container">
          <Reveal>
            <div className="zf-section-head">
              <p className="zf-eyebrow">How I work</p>
              <h2 className="zf-section-title">Less theatre, more checks</h2>
              <p className="zf-lede">
                I&rsquo;m not interested in making a tool sound smarter than it is. I care
                about clear constraints, tests, and release paths I can explain.
              </p>
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

      {/* CTA band */}
      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-cta-band">
              <h2>Have something in mind?</h2>
              <p>
                I&rsquo;m open to roles and project work where careful engineering is
                useful, especially around mobile apps, backend systems, and AI-assisted
                workflows.
              </p>
              <div className="zf-cta-row">
                <a href={`mailto:${SITE.email}`} className="zf-btn zf-btn-primary">
                  Email me <ArrowRight />
                </a>
                <Link href="/about" className="zf-btn zf-btn-secondary">
                  More about me
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
