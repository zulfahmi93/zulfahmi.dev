import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Reveal } from "../../_components/reveal";
import { HeroOrbs } from "../../_components/hero-orbs";
import { ArrowRight, ArrowUpRight, ArrowLeft } from "../../_components/icons";
import { ScreenshotGallery } from "../../_components/screenshot-gallery";
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

const KEYWORDS = new Set([
  "if", "else", "for", "while", "return", "var", "final", "int", "void", "new",
  "true", "false", "List", "decimal", "double", "static", "public", "private",
  "Math", "const", "bool", "switch", "case",
]);

/**
 * Lightweight editorial syntax highlight for the case-study code block. Wraps
 * comments, keywords, and numbers in token spans without pulling in a full
 * highlighter — a pure function, so it runs on the server. Language-agnostic
 * enough for the Dart + C# samples in this portfolio.
 */
function highlightCode(src: string): ReactNode[] {
  return src.split("\n").map((line, lineIdx) => {
    const commentLine = line.match(/^(\s*)(\/\/.*)$/);
    if (commentLine) {
      return (
        <span key={lineIdx}>
          {commentLine[1]}
          <span className="cm">{commentLine[2]}</span>
          {"\n"}
        </span>
      );
    }
    const slash = line.indexOf("//");
    const code = slash >= 0 ? line.slice(0, slash) : line;
    const trail = slash >= 0 ? line.slice(slash) : "";

    const tokens: ReactNode[] = [];
    let i = 0;
    while (i < code.length) {
      const rest = code.slice(i);
      const ws = rest.match(/^[\s(){};,=&|^<>+\-*/?:[\].!]+/);
      if (ws) {
        tokens.push(ws[0]);
        i += ws[0].length;
        continue;
      }
      const num = rest.match(/^(0x[0-9a-fA-F]+|\d+)/);
      if (num) {
        tokens.push(<span className="nm" key={i}>{num[0]}</span>);
        i += num[0].length;
        continue;
      }
      const id = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (id) {
        tokens.push(
          KEYWORDS.has(id[0]) ? <span className="kw" key={i}>{id[0]}</span> : id[0],
        );
        i += id[0].length;
        continue;
      }
      tokens.push(code[i]);
      i += 1;
    }
    return (
      <span key={lineIdx}>
        {tokens}
        {trail && <span className="cm">{trail}</span>}
        {"\n"}
      </span>
    );
  });
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
    { k: "Problem", v: project.summary.problem },
    { k: "My role", v: project.summary.role },
    { k: isResearch ? "Status" : "Result", v: project.summary.result },
  ];

  // Build the present sections in order, then number them sequentially so a
  // project without screenshots / tests / code doesn't leave a gap in the count.
  const sections: { title: string; body: ReactNode }[] = [
    { title: "The problem", body: <p className="zf-lede">{project.problem}</p> },
  ];
  if (project.screenshots && project.screenshots.length > 0) {
    sections.push({ title: "A look at the app", body: <ScreenshotGallery project={project} /> });
  }
  sections.push({
    title: isResearch ? "What I've explored" : "What I built",
    body: <CaseList items={project.built} />,
  });
  sections.push({
    title: "Key decisions",
    body: (
      <div className="zf-case-decisions">
        {project.decisions.map((d) => (
          <article className="zf-case-note" key={d.title}>
            <h3>{d.title}</h3>
            <p>{d.detail}</p>
          </article>
        ))}
      </div>
    ),
  });
  if (project.testing.length > 0) {
    sections.push({ title: "Checks and tests", body: <CaseList items={project.testing} /> });
  }
  if (project.codeSamples && project.codeSamples.length > 0) {
    sections.push({
      title: project.codeSamples.length > 1 ? "Code samples" : "Code sample",
      body: (
        <div className="zf-code-stack">
          {project.codeSamples.map((sample) => (
            <figure className="zf-code" key={`${sample.lang}-${sample.caption}`}>
              <figcaption className="zf-code-bar">
                <span className="lights" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="lang">{sample.lang}</span>
                <span>{sample.caption}</span>
              </figcaption>
              <pre>
                <code>{highlightCode(sample.body)}</code>
              </pre>
            </figure>
          ))}
        </div>
      ),
    });
  }
  sections.push({ title: "Trade-offs", body: <CaseList items={project.tradeoffs} /> });
  sections.push({
    title: isResearch ? "Where it's heading" : "Result",
    body: <p>{project.outcome}</p>,
  });
  sections.push({
    title: isResearch ? "What's next" : "What I would improve next",
    body: <CaseList items={project.nextSteps} />,
  });

  return (
    <>
      <header className="zf-pagehead">
        <HeroOrbs variant="soft" />
        <div className="zf-container zf-pagehead-inner">
          <p className="zf-eyebrow">Case · {project.domain}</p>
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
                  className="zf-btn zf-btn-secondary zf-btn-sm"
                >
                  {link.label} <ArrowUpRight />
                </a>
              ))}
            </div>
          )}
          <dl className="zf-meta-strip">
            <div>
              <dt className="k">Role</dt>
              <dd className="v">{project.role}</dd>
            </div>
            <div>
              <dt className="k">Year</dt>
              <dd className="v">{project.year}</dd>
            </div>
            <div>
              <dt className="k">Status</dt>
              <dd className="v">{project.status}</dd>
            </div>
            <div>
              <dt className="k">Stack</dt>
              <dd className="v">{project.stack.slice(0, 3).join(" · ")}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-case-summary" aria-label="Project summary">
              {summary.map((item) => (
                <div className="zf-case-summary-item" key={item.k}>
                  <span className="k">{item.k}</span>
                  <p>{item.v}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="zf-case-content">
            {sections.map((section, i) => (
              <section className="zf-case-section" key={section.title}>
                <h2>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </div>

          <nav className="zf-case-nav" aria-label="Case study navigation">
            <Link href="/work" className="zf-case-back">
              <ArrowLeft /> All work
            </Link>
            <Link href={`/work/${next.slug}`} className="zf-case-next">
              <span>
                <span className="k">Next project</span>
                <span className="v">{next.name}</span>
              </span>
              <ArrowRight />
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
