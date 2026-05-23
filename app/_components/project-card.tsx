import Link from "next/link";
import type { Project } from "../_data/projects";
import { ArrowRight } from "./icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="zf-card">
      <div className="zf-card-top">
        <span className="zf-chip">{project.domain}</span>
        <span className="zf-card-status">{project.status}</span>
      </div>
      <h3 className="zf-card-title">{project.name}</h3>
      <p className="zf-card-tagline">{project.tagline}</p>
      <div className="zf-card-foot">
        <span className="zf-card-stack">{project.stack.slice(0, 3).join(" · ")}</span>
        <span className="zf-card-link">
          Case study <ArrowRight />
        </span>
      </div>
    </Link>
  );
}
