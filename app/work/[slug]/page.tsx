import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Reveal } from "../../_components/reveal";
import { ArrowRight } from "../../_components/icons";
import { PROJECTS, getProject } from "../../_data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
  };
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="zf-case-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function CaseList({ items }: { items: string[] }) {
  return (
    <ul className="zf-case-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const isResearch = project.kind === "research";
  const summary = [
    { label: "Problem", value: project.summary.problem },
    { label: "My role", value: project.summary.role },
    { label: isResearch ? "Status" : "Result", value: project.summary.result },
  ];

  return (
    <>
      <header className="zf-pagehead zf-case-head">
        <div className="zf-container">
          <p className="zf-eyebrow">{project.domain}</p>
          <h1>{project.name}</h1>
          <p className="zf-case-tagline">{project.tagline}</p>
          {project.links && project.links.length > 0 && (
            <div className="zf-case-actions">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zf-btn zf-btn-secondary"
                >
                  {link.label} <ArrowRight />
                </a>
              ))}
            </div>
          )}
          <div className="zf-case-meta">
            <div>
              <span className="k">Role</span>
              <span className="v">{project.role}</span>
            </div>
            <div>
              <span className="k">Year</span>
              <span className="v">{project.year}</span>
            </div>
            <div>
              <span className="k">Status</span>
              <span className="v">{project.status}</span>
            </div>
            <div>
              <span className="k">Stack</span>
              <span className="v">{project.stack.join(" · ")}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-case-summary" aria-label="Project summary">
              {summary.map((item) => (
                <div className="zf-case-summary-item" key={item.label}>
                  <span className="k">{item.label}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="zf-case-content">
            <CaseSection title="The problem">
              <p className="zf-lede">{project.problem}</p>
            </CaseSection>

            <CaseSection title={isResearch ? "What I've explored" : "What I built"}>
              <CaseList items={project.built} />
            </CaseSection>

            <CaseSection title="Key decisions">
              <div className="zf-case-notes">
                {project.decisions.map((point) => (
                  <article className="zf-case-note" key={point.title}>
                    <h3>{point.title}</h3>
                    <p>{point.detail}</p>
                  </article>
                ))}
              </div>
            </CaseSection>

            {project.testing.length > 0 && (
              <CaseSection title="Checks and tests">
                <CaseList items={project.testing} />
              </CaseSection>
            )}

            {project.codeSamples && project.codeSamples.length > 0 && (
              <CaseSection
                title={project.codeSamples.length > 1 ? "Code samples" : "Code sample"}
              >
                <div className="zf-code-stack">
                  {project.codeSamples.map((sample) => (
                    <figure className="zf-code" key={`${sample.lang}-${sample.caption}`}>
                      <figcaption className="zf-code-bar">
                        <span className="lang">{sample.lang}</span>
                        <span>{sample.caption}</span>
                      </figcaption>
                      <pre>
                        <code>{sample.body}</code>
                      </pre>
                    </figure>
                  ))}
                </div>
              </CaseSection>
            )}

            <CaseSection title="Trade-offs">
              <CaseList items={project.tradeoffs} />
            </CaseSection>

            <CaseSection title={isResearch ? "Where it's heading" : "Result"}>
              <p>{project.outcome}</p>
            </CaseSection>

            <CaseSection title={isResearch ? "What's next" : "What I would improve next"}>
              <CaseList items={project.nextSteps} />
            </CaseSection>
          </div>

          <Reveal>
            <nav className="zf-case-nav" aria-label="Case study navigation">
              <Link href="/work" className="zf-case-back">
                All work
              </Link>
              <Link href={`/work/${next.slug}`} className="zf-case-next">
                <span>
                  <span className="k">Next project</span>
                  <br />
                  <span className="v">{next.name}</span>
                </span>
                <ArrowRight />
              </Link>
            </nav>
          </Reveal>
        </div>
      </section>
    </>
  );
}
