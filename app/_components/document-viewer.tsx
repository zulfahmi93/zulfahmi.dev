"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CloseIcon } from "./icons";

export type ViewerDoc = {
  /** Dialog heading + alt-text prefix. */
  title: string;
  /** Muted sublabel under the title (e.g. "Microsoft · 2014" or "PDF · 2 pages"). */
  subtitle?: string;
  /**
   * Page aspect, used to frame the dialog to the document instead of a fixed box.
   * Landscape (certificates ~1.4:1) gets a wide dialog; portrait (résumé) a narrow one.
   * Defaults to "landscape" when omitted.
   */
  orientation?: "landscape" | "portrait";
  /** Page image sources, rendered top-to-bottom. */
  pages: readonly string[];
  /** When set, a "Download PDF" action appears in the header. */
  downloadHref?: string;
  /** Suggested filename for the download. */
  downloadName?: string;
};

type ViewerContextValue = { openDoc: (doc: ViewerDoc) => void };

const ViewerContext = createContext<ViewerContextValue | null>(null);

export function useDocumentViewer(): ViewerContextValue {
  const ctx = useContext(ViewerContext);
  if (!ctx) {
    throw new Error("useDocumentViewer must be used within <DocumentViewerProvider>");
  }
  return ctx;
}

/**
 * Mounts a single modal viewer at the root and exposes `openDoc` via context.
 * Built on the native <dialog>: focus trap, Esc-to-close, and the top layer come
 * for free, so the only job here is keeping React state and the dialog in sync.
 */
export function DocumentViewerProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<ViewerDoc | null>(null);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDoc = useCallback((next: ViewerDoc) => {
    setDoc(next);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // Drive the dialog from the open flag so the button, Esc, and the backdrop all
  // agree. `doc` deliberately stays set after close so the content survives the
  // exit animation — the CSS animates enter + exit via @starting-style and
  // transition: ... allow-discrete, which only works while the node stays mounted.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock background scroll while the viewer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <ViewerContext.Provider value={{ openDoc }}>
      {children}
      <dialog
        ref={dialogRef}
        className={`zf-viewer zf-viewer--${doc?.orientation ?? "landscape"}`}
        aria-label={doc?.title}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {doc && (
          <>
            <div className="zf-viewer-head">
              <div className="zf-viewer-heading">
                <h2 className="zf-viewer-title">{doc.title}</h2>
                {doc.subtitle && <p className="zf-viewer-sub">{doc.subtitle}</p>}
              </div>
              <div className="zf-viewer-actions">
                {doc.downloadHref && (
                  <a
                    className="zf-btn zf-btn-primary zf-btn-sm"
                    href={doc.downloadHref}
                    download={doc.downloadName ?? ""}
                  >
                    Download PDF
                  </a>
                )}
                <button
                  type="button"
                  className="zf-viewer-close"
                  onClick={close}
                  aria-label="Close viewer"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="zf-viewer-body" tabIndex={0}>
              {doc.pages.map((src, index) => (
                <figure className="zf-viewer-page" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${doc.title} — page ${index + 1}`}
                    className="zf-viewer-img"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </>
        )}
      </dialog>
    </ViewerContext.Provider>
  );
}
