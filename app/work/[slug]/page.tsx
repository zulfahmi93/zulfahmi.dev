import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <>
      <header className="zf-pagehead">
        <div className="zf-container">
          <p className="zf-eyebrow">{project.domain}</p>
          <h1>{project.name}</h1>
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
          <div className="zf-prose">
            <p className="zf-lede">{project.problem}</p>

            <h2>What I built</h2>
            <ul>
              {project.built.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {project.code && (
              <figure className="zf-code" style={{ marginBottom: 8 }}>
                <figcaption className="zf-code-bar">
                  <span className="lang">{project.code.lang}</span>
                  <span>{project.code.caption}</span>
                </figcaption>
                <pre>
                  <code>{project.code.body}</code>
                </pre>
              </figure>
            )}
          </div>

          <div style={{ marginTop: 56 }}>
            <h2
              className="zf-section-title"
              style={{ fontSize: 28, fontWeight: 500, marginBottom: 24 }}
            >
              Technical notes
            </h2>
            <div className="zf-rigor">
              {project.rigor.map((point) => (
                <div className="zf-rigor-item" key={point.title}>
                  <h4>{point.title}</h4>
                  <p>{point.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="zf-prose" style={{ marginTop: 56 }}>
            <h2>Outcome</h2>
            <p>{project.outcome}</p>
          </div>

          <Reveal>
            <Link href={`/work/${next.slug}`} className="zf-case-next">
              <span>
                <span className="k">Next project</span>
                <br />
                <span className="v">{next.name}</span>
              </span>
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
