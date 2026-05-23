# zulfahmi.dev — personal portfolio

A multi-page personal portfolio for zulfahmi.dev. The site keeps the strongest
technical work up front, then uses case studies to explain the engineering decisions
behind each project. The visual system is a warm orange/cream editorial style based
on `DESIGN.md`.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind 4** with a `--zf-*` token bridge in `app/globals.css`
- Fonts via `next/font`: **Fraunces** (display) · **Inter** (UI) · **JetBrains Mono** (code)
- Deploy: **static export → GitHub Pages** (`zulfahmi.dev`)
- Quality gates: **Playwright** e2e + **axe-core** a11y, **Lighthouse CI**

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # static export to out/ (all routes prerendered)
npm run preview      # serve the out/ export locally
npm run e2e:install  # one-time: Playwright chromium
npm run e2e          # smoke + a11y (boots the dev server automatically)
npm run lhci         # Lighthouse budgets
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`: it type-checks, lints,
runs `next build` (static export to `out/`), and publishes via GitHub Pages.

One-time setup:

1. Push this repo to GitHub (a **public** repo for free Pages).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. The apex domain is pinned by `public/CNAME` (`zulfahmi.dev`); enable
   **Enforce HTTPS** once DNS resolves.
4. Point DNS for the apex `zulfahmi.dev` at GitHub Pages:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - optional `www` → `CNAME` to `<user>.github.io`

## Structure

```
app/
  layout.tsx              root layout — fonts, metadata, nav + footer shell
  page.tsx                Home
  work/page.tsx           project grid
  work/[slug]/page.tsx    case study (static per project)
  about/page.tsx
  contact/page.tsx
  robots.ts / sitemap.ts
  _components/            nav, footer, reveal, project-card, icons,
                          document-viewer (dialog) + credential-triggers
  _data/
    site.ts               identity, nav, socials, principles, capabilities
    projects.ts           the four projects (drives grid + case studies)
  globals.css             Mistral-Orange token bridge + component styles
DESIGN.md                 brand source of truth
tests/e2e/smoke.spec.ts   nav, routing, and a11y checks
```

Content lives in `app/_data/`. To add or edit a project, edit `projects.ts`; the grid,
case-study page, sitemap, and homepage selection all update from it.

## Content wired in

- **CV** — name, senior title, summary, experience, education, certifications, and
  skills are in `app/_data/site.ts`, surfaced on About. Source: `raw/cv.pdf`.
- **Portrait** — `public/portrait.jpg` (cropped to 4:5 from `raw/`), shown on About.
- **Résumé** — opens in an in-page viewer (`_components/document-viewer.tsx`) from About,
  Contact, and the footer; the viewer carries a **Download PDF** action. The served PDF
  (`public/zulfahmi-cv.pdf`) and the viewer images are phone-redacted.
- **Certifications** — the three Microsoft certs + the certification transcript open in the
  same viewer (view-only, no download). Page images live in `public/credentials/`, rendered
  from the source PDFs in `raw/`. The transcript's home-address block is redacted.
- **Socials** — GitHub + LinkedIn, surfaced on Contact + footer.

### Regenerating credential images

The viewer shows WebP renders of the PDFs in `raw/` (git-ignored). To regenerate after
swapping a source PDF, render with PyMuPDF (`fitz`) → Pillow into `public/credentials/`,
keeping the redactions (résumé phone, transcript address). The shipped images are committed.

## TODO before launch

- **Repo / demo links** — wire per-project links in `projects.ts` once repo visibility
  is decided (public source vs. screenshots/demo only).
- **OG image** — add a static Open Graph image for richer link previews.
