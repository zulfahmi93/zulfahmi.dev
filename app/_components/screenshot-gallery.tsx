"use client";

import { ExpandIcon } from "./icons";
import { useDocumentViewer } from "./document-viewer";
import type { Project } from "../_data/projects";

/**
 * Phone-screenshot gallery for a case study. Each thumbnail is a real button
 * framed like a handset (notch + rounded corners) that opens the shared document
 * viewer (same dialog as résumé / certs) showing just the clicked screenshot —
 * keyboard-accessible, no carousel. The `cols-N` class fits the grid to the shot
 * count so 3-shot galleries don't leave a 2+1 orphan row.
 */
export function ScreenshotGallery({ project }: { project: Project }) {
  const { openDoc } = useDocumentViewer();
  const shots = project.screenshots ?? [];
  if (shots.length === 0) return null;

  return (
    <div className={`zf-shots cols-${Math.min(shots.length, 4)}`}>
      {shots.map((shot) => (
        <button
          key={shot.src}
          type="button"
          className="zf-shot-trigger"
          aria-label={`View screenshot: ${shot.alt}`}
          onClick={() =>
            openDoc({
              title: project.name,
              subtitle: shot.caption,
              orientation: "portrait",
              pages: [shot.src],
            })
          }
        >
          <span className="zf-shot-badge" aria-hidden="true">
            <ExpandIcon />
          </span>
          <span className="zf-shot-notch" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.src}
            alt={shot.alt}
            className="zf-shot"
            width={540}
            height={1170}
            loading="lazy"
            decoding="async"
          />
          <span className="zf-shot-cap">{shot.caption}</span>
        </button>
      ))}
    </div>
  );
}
