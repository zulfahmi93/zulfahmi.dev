# zulfahmi.dev — design system

Mistral-inspired editorial system: saturated orange, cream-yellow surfaces, ink
text, and a horizontal "sunset stripe" closing every page. **One change from the
source system: the display face is Fraunces, not PP Editorial Old.**

This file is the source of truth for visual tokens. Concrete values are realized
once in `app/globals.css` as `--zf-*` CSS variables and consumed via Tailwind 4
`@theme`. No off-token magic numbers in component code — add the token here first.

## Implemented tokens (concrete values)

### Colors (`--zf-*` in `app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| `primary` | `#fa520f` | Brand orange — primary CTAs, active states, sunset stripe |
| `primary-deep` | `#c43d08` | AA-safe orange for small text (eyebrows, links, active nav) |
| `sunshine-300/500/700/900` | `#ffd27a` / `#ffae3d` / `#ff7a1a` / `#d8410a` | Sunset gradient stops |
| `yellow` | `#ffc21f` | Pure brand yellow in the sunset stripe |
| `cream` / `cream-soft` / `cream-deeper` | `#fbeedd` / `#fdf6ec` / `#f4ddc0` | Warm surfaces, cards, chips |
| `beige-deep` | `#e7d3b3` | Border on cream surfaces |
| `canvas` / `surface` / `surface-cream` | `#ffffff` / `#faf7f2` / `#fbf3e6` | Page + section backgrounds |
| `surface-code` | `#1b1a17` | Dark code-block surface |
| `ink` / `ink-tint` / `charcoal` | `#1c1407` / `#2b2114` / `#3a2f20` | Headlines + body |
| `slate` / `steel` / `stone` | `#564d40` / `#6b6354` / `#736b5a` | Secondary → label text (all ≥ 4.5:1) |
| `link` | `#c2410c` | Inline links (AA on white) |
| `primary-wash` | `rgba(250,82,15,.07)` | Decorative orange tint — warm hover/accent wash on cards + framing (non-text, contrast-exempt) |

Contrast rule: the bright `primary` (`#fa520f`) only carries large/non-text accents
and buttons **with dark ink text**. Small text uses `primary-deep` or `link`.
`primary-wash` is a translucent orange used only as a decorative surface tint
(card hover, document framing); it never sits behind text that must meet contrast.

### Type

- **Fraunces** (`--font-display`) — editorial serif for hero/section displays, italic
  ledes, numeric counters. Fallback: `'Times New Roman', Georgia, serif`.
- **Inter** (`--font-ui`) — body, navigation, buttons, labels.
- **JetBrains Mono** (`--font-mono`) — code blocks only.

### Radii + spacing

Buttons `8px`, cards `12px`, full-round reserved for chips/badges — **no pill
buttons**. Gutter `32px` (20px mobile), container `1200px`, section rhythm `104px`
(72px tight / mobile).

---

The remainder is the descriptive design language (adapted from the source Mistral
system, Fraunces substituted for PP Editorial Old throughout).

## Overview

A singular, cinematographic visual signature — a hero in elegant serif display type
over a warm orange-yellow sunset gradient. Every page closes with the same
recognizable element: a horizontal "sunset stripe" gradient band running
orange→yellow→cream just above the footer. This stripe is THE brand recognizer.

The system pairs **Fraunces** (an editorial serif display face) for hero displays
with Inter for everything else (body, headings, UI). Cream-yellow surfaces anchor
form panels and feature cards; saturated orange (`{colors.primary}`) carries primary
CTAs. Cards are rectangular with 12px corners; buttons are 8px — sober, editorial
geometry, not pills.

**Key characteristics:**
- Atmospheric sunset hero (orange-yellow gradient)
- Horizontal sunset stripe band (`primary → sunshine-700 → sunshine-500 → yellow → cream`) at every page bottom
- Cream-yellow surfaces for panels and feature cards
- Fraunces for displays; Inter for everything else
- 8px buttons, 12px cards — editorial geometry
- Saturated orange primary action

## Typography hierarchy

| Token | Size | Weight | Line height | Tracking | Family | Use |
|---|---|---|---|---|---|---|
| hero-display | clamp 44–92px | 400 | 1.04 | -2px | Fraunces | Home hero |
| page-title | clamp 40–68px | 400 | 1.05 | -1.5px | Fraunces | Interior page H1 |
| section-title | clamp 34–56px | 400 | 1.08 | -1px | Fraunces | Section openers |
| card-title | 27px | 500 | 1.15 | -.4px | Fraunces | Project card titles |
| lede | clamp 19–24px | 300 italic | 1.45 | 0 | Fraunces | Section + problem ledes |
| body | 16px | 400 | 1.6 | 0 | Inter | Primary body |
| eyebrow | 11px | 600 | 1 | 2.2px | Inter | Section eyebrows (uppercase) |
| code | 13px | 400 | 1.6 | 0 | JetBrains Mono | Code blocks |

### Principles
- **Editorial / sans pairing** — Fraunces (serif, classical) anchors displays; Inter (geometric sans) carries everything else. The contrast IS the brand voice.
- **Tight display leading** (≈1.05) — magazine-grade typographic display.
- **Negative tracking progresses with size** — displays use -1 to -2px; smaller heads relax to 0.

## Signature components

- **`sunset-stripe-band`** — 8px multi-stop gradient (`primary → sunshine-700 → sunshine-500 → yellow → cream`). MUST close every page above the footer. The brand's most recognizable element. (`.zf-stripe`)
- **Hero** — warm radial sunset gradient over cream-soft → white; Fraunces display headline, italic Fraunces sub, dark + outline CTAs. (`.zf-hero`)
- **Project card** — white card, hairline border, 12px radius, domain chip + status, Fraunces title, mono stack line, "Case study →". (`.zf-card`)
- **Rigor card** — cream-surface card with beige border; the per-project engineering-rigor highlight. (`.zf-rigor-item`)
- **Code block** — dark `surface-code` with a mono header bar (orange language label). (`.zf-code`)

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (orange) for primary CTAs and active states.
- Use the sunset stripe band at the foot of every page.
- Pair Fraunces (display) with Inter (UI) — never substitute either with a generic fallback in production.
- Apply 8px to buttons and 12px to cards consistently.
- Use cream-yellow surfaces for panels, feature cards, and footer.

### Don't
- Don't use pill-shaped buttons — geometry is sober and editorial.
- Don't introduce accent colors beyond the orange / yellow / cream sunset palette.
- Don't relax hero leading below ~1.05 — the editorial display needs that tightness.
- Don't replace Fraunces displays with Inter — the editorial / sans contrast IS the brand.
- Don't drop the sunset stripe band from any page bottom — it's the continuity element.

## Known gaps / notes

- The source Mistral spec carried a fuller neutral ramp and component catalogue; this
  personal site implements the subset it actually uses. Add tokens here before
  consuming new values in components.
- The original document specified PP Editorial Old; this site uses **Fraunces** by
  decision of the owner.
