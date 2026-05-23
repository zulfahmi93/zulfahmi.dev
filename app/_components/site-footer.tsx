import Link from "next/link";
import { NAV, SITE } from "../_data/site";
import { ResumeTrigger } from "./credential-triggers";

const SOCIAL_LABELS: Record<keyof typeof SITE.socials, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
};

export function SiteFooter() {
  const socials = (Object.keys(SITE.socials) as (keyof typeof SITE.socials)[])
    .filter((key) => SITE.socials[key])
    .map((key) => ({ label: SOCIAL_LABELS[key], href: SITE.socials[key] }));

  return (
    <>
      <div className="zf-stripe" role="presentation" />
      <footer className="zf-footer">
        <div className="zf-container">
          <div className="zf-footer-inner">
            <div className="zf-footer-brand">
              <div className="name">
                {SITE.name}
                <span className="dot">.</span>
              </div>
              <p>{SITE.positioning}</p>
            </div>

            <div className="zf-footer-nav">
              <div className="zf-footer-col">
                <h4>Pages</h4>
                <ul>
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="zf-footer-col">
                <h4>Elsewhere</h4>
                <ul>
                  <li>
                    <a href={`mailto:${SITE.email}`}>Email</a>
                  </li>
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <ResumeTrigger className="zf-footer-linkbtn">Résumé</ResumeTrigger>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="zf-footer-bottom">
            <span>
              © {new Date().getFullYear()} {SITE.name}
            </span>
            <span>{SITE.domain}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
