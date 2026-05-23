"use client";

import type { ReactNode } from "react";
import { ExpandIcon } from "./icons";
import { useDocumentViewer, type ViewerDoc } from "./document-viewer";
import { RESUME_PAGES, SITE, type Certification } from "../_data/site";

const RESUME_DOC: ViewerDoc = {
  title: `Résumé — ${SITE.fullName}`,
  subtitle: `PDF · ${RESUME_PAGES.length} pages`,
  orientation: "portrait",
  pages: RESUME_PAGES,
  downloadHref: SITE.resume,
  downloadName: "Zulfahmi-Ahmad-CV.pdf",
};

/** A certification card that opens its scanned page(s) in the viewer. */
export function CredentialButton({ cert }: { cert: Certification }) {
  const { openDoc } = useDocumentViewer();
  return (
    <button
      type="button"
      className="zf-cred-card"
      aria-label={`View ${cert.title}, ${cert.issuer} ${cert.year} certificate`}
      onClick={() =>
        openDoc({
          title: cert.title,
          subtitle: `${cert.issuer} · ${cert.year}`,
          orientation: "landscape",
          pages: cert.pages,
        })
      }
    >
      <span className="zf-cred-accent" aria-hidden="true" />
      <span className="zf-cred-body">
        <span className="zf-cred-title">{cert.title}</span>
        <span className="zf-cred-issuer">{cert.issuer}</span>
      </span>
      <span className="zf-cred-tail">
        <span className="zf-cred-year">{cert.year}</span>
        <span className="zf-cred-view" aria-hidden="true">
          <ExpandIcon />
        </span>
      </span>
    </button>
  );
}

/** Opens the résumé in the viewer (with a Download PDF action). */
export function ResumeTrigger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openDoc } = useDocumentViewer();
  return (
    <button type="button" className={className} onClick={() => openDoc(RESUME_DOC)}>
      {children}
    </button>
  );
}
