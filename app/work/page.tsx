import type { Metadata } from "next";
import { Reveal } from "../_components/reveal";
import { ProjectCard } from "../_components/project-card";
import { PROJECTS } from "../_data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects by Zulfahmi Ahmad, including a Flutter DuitNow payments app, ballot OCR counter, school timetable solver, and receipt renderer.",
};

export default function WorkPage() {
  return (
    <>
      <header className="zf-pagehead">
        <div className="zf-container">
          <p className="zf-eyebrow">Work</p>
          <h1>A few projects, in detail.</h1>
          <p className="zf-lede">
            These are the projects I&rsquo;d want to talk through in an interview: where
            the edge cases were, what I chose to test, and what I would improve next.
          </p>
        </div>
      </header>

      <section className="zf-section tight">
        <div className="zf-container">
          <Reveal>
            <div className="zf-grid-2">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
