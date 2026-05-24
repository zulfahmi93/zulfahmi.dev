import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "../_components/reveal";
import { HeroOrbs } from "../_components/hero-orbs";
import { ArrowRight } from "../_components/icons";
import { PROJECTS } from "../_data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects by Zulfahmi Ahmad, including a Flutter DuitNow payments app, the MyClaaz tutor marketplace, the enterSarawak border-control system, a ballot OCR counter, a school timetable solver, and a receipt renderer.",
};

export default function WorkPage() {
  const lead = PROJECTS.filter((p) => p.lead);
  const others = PROJECTS.filter((p) => !p.lead);
  const shipped = PROJECTS.filter((p) => p.status.startsWith("Shipped")).length;
  const research = PROJECTS.filter((p) => p.kind === "research").length;

  return (
    <>
      <header className="zf-pagehead">
        <HeroOrbs variant="soft" />
        <div className="zf-container zf-pagehead-inner">
          <p className="zf-eyebrow">Selected work · {PROJECTS.length}</p>
          <h1>
            A few projects, <span className="ital">in detail.</span>
          </h1>
          <p className="zf-lede">
            These are the projects I&rsquo;d want to talk through in an interview: where
            the edge cases were, what I chose to test, and what I would improve next.
          </p>
          <dl className="zf-meta-strip">
            <div>
              <dt className="k">Projects</dt>
              <dd className="v">{PROJECTS.length}</dd>
            </div>
            <div>
              <dt className="k">Lead</dt>
              <dd className="v">{lead.length}</dd>
            </div>
            <div>
              <dt className="k">Shipped</dt>
              <dd className="v">{shipped}</dd>
            </div>
            <div>
              <dt className="k">Research</dt>
              <dd className="v">{research}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="zf-section tight" id="work-all">
        <div className="zf-container">
          {/* Lead projects — with phone-screenshot collages */}
          <Reveal>
            <div className="zf-work-grid">
              {lead.map((project, i) => (
                <Link key={project.slug} className="zf-work-card" href={`/work/${project.slug}`}>
                  {project.screenshots && project.screenshots.length > 0 && (
                    <div className="zf-work-shotwrap">
                      <div className="zf-work-shotrow" aria-hidden="true">
                        {project.screenshots.slice(0, 2).map((shot) => (
                          <div className="zf-phone" key={shot.src}>
                            <div className="zf-phone-notch" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={shot.src} alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="zf-work-body">
                    <div className="zf-work-top">
                      <span className="zf-work-chip">{project.domain}</span>
                      <span className="zf-work-num">No. {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.tagline}</p>
                    <div className="zf-work-foot">
                      <span>{project.stack.slice(0, 3).join(" · ")}</span>
                      <span className="zf-work-read">
                        Case study <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          <div className="zf-work-divider">
            <span>—</span>
            <span>Backend · AI · Research</span>
            <span>
              {others.length} / {PROJECTS.length}
            </span>
          </div>

          {/* Secondary projects — typographic, no screenshots */}
          <Reveal delay={1}>
            <div className="zf-work-grid no-shot">
              {others.map((project, i) => (
                <Link
                  key={project.slug}
                  className="zf-work-card zf-work-card-no-shot"
                  href={`/work/${project.slug}`}
                >
                  <div className="num-row">
                    <span className="big-num">{String(i + lead.length + 1).padStart(2, "0")}</span>
                    <span className="zf-card-status">{project.status}</span>
                  </div>
                  <div className="zf-work-top">
                    <span className="zf-work-chip">{project.domain}</span>
                    <span className="zf-card-status">{project.year}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.tagline}</p>
                  <div className="zf-work-foot">
                    <span>{project.stack.slice(0, 3).join(" · ")}</span>
                    <span className="zf-work-read">
                      Case study <ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
