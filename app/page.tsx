import Link from "next/link";
import { Reveal } from "./_components/reveal";
import { HeroOrbs } from "./_components/hero-orbs";
import { Marquee } from "./_components/marquee";
import { ArrowRight } from "./_components/icons";
import { LEAD_PROJECTS } from "./_data/projects";
import { PRINCIPLES, SITE, STACK } from "./_data/site";

export default function HomePage() {
  const [feature, ...others] = LEAD_PROJECTS;

  return (
    <>
      {/* Hero */}
      <section className="zf-hero" id="home">
        <HeroOrbs variant="full" />
        <div className="zf-container zf-hero-grid">
          <div>
            <p className="zf-eyebrow">
              <span className="dot" aria-hidden="true" />
              {SITE.role} · {SITE.location}
            </p>
            <h1 className="zf-hero-title">
              I build software people{" "}
              <br />
              can <span className="ital">rely on.</span>
            </h1>
            <p className="zf-hero-sub">{SITE.positioning}</p>
            <div className="zf-hero-cta">
              <Link href="/work" className="zf-btn zf-btn-dark">
                View work <ArrowRight />
              </Link>
              <Link href="/contact" className="zf-btn zf-btn-secondary">
                Get in touch
              </Link>
            </div>
            <dl className="zf-hero-meta">
              <div>
                <dt className="k">Based in</dt>
                <dd className="v">{SITE.location}</dd>
              </div>
              <div>
                <dt className="k">Coordinates</dt>
                <dd className="v">
                  {SITE.coords.lat}
                  <br />
                  {SITE.coords.lon}
                </dd>
              </div>
              <div>
                <dt className="k">Available for</dt>
                <dd className="v">Roles · Project work</dd>
              </div>
            </dl>
          </div>
          <div className="zf-hero-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.portrait}
              alt={`Portrait of ${SITE.fullName}`}
              width={720}
              height={900}
            />
            <div className="zf-portrait-tag">
              <span className="dot" aria-hidden="true" />
              {SITE.fullName}
            </div>
          </div>
        </div>
      </section>

      {/* Stack marquee */}
      <div className="zf-stack">
        <Marquee items={STACK} speedSeconds={32} />
      </div>

      {/* Selected work */}
      <section className="zf-section" id="work">
        <div className="zf-container">
          <Reveal>
            <header className="zf-numhead">
              <div className="num">01</div>
              <h2>
                Projects with <span className="ital">real</span> constraints
              </h2>
              <p className="lede">
                A payments client, a statewide border-control system, a tutor
                marketplace, an OCR counting pipeline, a timetable solver, and a
                receipt renderer. Different domains, same habit: make the important
                parts explicit and testable.
              </p>
            </header>
          </Reveal>

          {/* Featured project */}
          <Reveal>
            <article className="zf-feature">
              <div>
                <div className="zf-feature-meta">
                  <span>
                    <b>FEATURED</b>
                  </span>
                  <span>{feature.domain}</span>
                  <span>{feature.year}</span>
                  <span>{feature.status}</span>
                </div>
                <h3>{feature.name}</h3>
                <p>{feature.tagline}</p>
                <div className="zf-feature-stack">
                  {feature.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <Link className="zf-feature-link" href={`/work/${feature.slug}`}>
                  Read case study <ArrowRight />
                </Link>
              </div>
              {feature.screenshots && feature.screenshots.length > 0 && (
                <div className="zf-phone-row" aria-hidden="true">
                  {feature.screenshots.slice(0, 3).map((shot) => (
                    <div className="zf-phone" key={shot.src}>
                      <div className="zf-phone-notch" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot.src} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </article>
          </Reveal>

          {/* Secondary lead projects */}
          <Reveal delay={1}>
            <div className="zf-grid-2 mt">
              {others.map((project) => (
                <Link key={project.slug} className="zf-card" href={`/work/${project.slug}`}>
                  <div className="zf-card-top">
                    <span className="zf-card-chip">{project.domain}</span>
                    <span className="zf-card-status">{project.status}</span>
                  </div>
                  <h3 className="zf-card-title">{project.name}</h3>
                  <p className="zf-card-tagline">{project.tagline}</p>
                  <div className="zf-card-foot">
                    <span>{project.stack.slice(0, 3).join(" · ")}</span>
                    <span className="zf-card-link">
                      Case study <ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          <Link className="zf-view-all" href="/work">
            View all work <ArrowRight />
          </Link>
        </div>
      </section>

      <div className="zf-stripe thin" role="presentation" />

      {/* How I work */}
      <section className="zf-section soft" id="how">
        <div className="zf-container">
          <Reveal>
            <header className="zf-numhead">
              <div className="num">02</div>
              <h2>
                Less <span className="ital">theatre,</span> more checks
              </h2>
              <p className="lede">
                I&rsquo;m not interested in making a tool sound smarter than it is. I care
                about clear constraints, tests, and release paths I can explain.
              </p>
            </header>
          </Reveal>
          <Reveal delay={1}>
            <div className="zf-principles">
              {PRINCIPLES.map((principle, i) => (
                <div className="zf-principle" key={principle.title}>
                  <span className="num">
                    {String(i + 1).padStart(2, "0")} / 04
                  </span>
                  <h4>{principle.title}</h4>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-cta-band">
              <h2>
                Have <span className="ital">something</span> in mind?
              </h2>
              <p>
                I&rsquo;m open to roles and project work where careful engineering is
                useful, especially around mobile apps, backend systems, and AI-assisted
                workflows.
              </p>
              <div className="zf-cta-row">
                <Link href="/contact" className="zf-btn zf-btn-primary">
                  Get in touch <ArrowRight />
                </Link>
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
