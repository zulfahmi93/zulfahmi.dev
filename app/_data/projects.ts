// Single source of truth for the project showcase.
// Used by /work (grid) and /work/[slug] (case study). No employer branding.

export type CasePoint = { title: string; detail: string };

export type CodeSample = { lang: string; caption: string; body: string };

export type ProjectLink = { label: string; href: string };

export type Screenshot = { src: string; alt: string; caption: string };

export type ProjectSummary = {
  problem: string;
  role: string;
  result: string;
};

export type Project = {
  slug: string;
  name: string;
  /** One-line summary for cards + meta description. */
  tagline: string;
  /** Short category label shown as a chip. */
  domain: string;
  year: string;
  role: string;
  status: string;
  /** "build" (default) uses shipped-work headings; "research" uses design/discovery framing. */
  kind?: "build" | "research";
  /** Featured on the homepage when true. */
  lead: boolean;
  stack: string[];
  /** Compact summary cards near the top of the case-study page. */
  summary: ProjectSummary;
  /** Editorial lede on the case-study page. */
  problem: string;
  /** What I built — scope bullets. */
  built: string[];
  /** Key implementation decisions for the case-study page. */
  decisions: CasePoint[];
  /** Tests, checks, and review steps worth calling out. */
  testing: string[];
  /** Trade-offs that make the case study more honest. */
  tradeoffs: string[];
  /** What I would improve next. */
  nextSteps: string[];
  outcome: string;
  /** Optional public artifacts. */
  links?: ProjectLink[];
  /** Optional illustrative code samples. */
  codeSamples?: CodeSample[];
  /** Optional app screenshots, shown as a gallery row on the case study. */
  screenshots?: Screenshot[];
};

export const PROJECTS: Project[] = [
  {
    slug: "duitnow",
    name: "DuitNow Payments App",
    tagline: "QR payments and DuitNow transfers in Flutter, with biometrics before money moves.",
    domain: "Mobile · Payments",
    year: "2026",
    role: "Sole engineer",
    status: "Demo · complete",
    lead: true,
    stack: ["Flutter", "Dart", "Riverpod", "Freezed", "local_auth"],
    summary: {
      problem: "Payment flows need exact QR parsing, strict input checks, and clear confirmation before money moves.",
      role: "Sole Flutter engineer",
      result: "Demo complete with biometric gating before every sensitive action, and 71 tests.",
    },
    problem:
      "DuitNow QR and DuitNow Transfer leave little room for guesswork: the QR payload has to match EMVCo rules, and every payment screen has to treat money and identity carefully. I built a working Flutter client over one night as a focused payments exercise.",
    built: [
      "Scan a DuitNow QR, parse the EMVCo payload, verify the checksum, then show a confirmation before any debit.",
      "Send DuitNow transfers by account, phone number (E.164), or national ID, with bank-specific account rules.",
      "Require Face ID, fingerprint, or device PIN before sensitive actions.",
      "Keep error messages on payment screens deliberately non-revealing.",
    ],
    decisions: [
      {
        title: "Validate before the payment flow",
        detail:
          "QR payloads, MyKad values, phone numbers, and bank account formats are checked before the app reaches the confirmation screen.",
      },
      {
        title: "Typed failures",
        detail:
          "Fallible paths return sealed Result / Failure types, so errors stay explicit. There is no exception-driven control flow and no untyped `as` casts in the codebase.",
      },
      {
        title: "Keep payment screens narrow",
        detail:
          "Sensitive screens require biometrics or device PIN before they act, and avoid error messages that reveal too much.",
      },
    ],
    testing: [
      "40 parser tests cover EMVCo payload parsing and CRC16-CCITT-FALSE verification, including a real bank QR payload.",
      "I calculated checksum fixtures manually so the parser is tested against known-good values.",
      "Validators cover MyKad, E.164 phone numbers, and bank-specific account formats.",
      "The full suite has 71 tests across parsing, validation, failure handling, and payment flow logic.",
    ],
    tradeoffs: [
      "I kept this as a demo client instead of implying access to live banking rails.",
      "Payment-screen errors are intentionally bland; detailed failure reasons stay inside typed failures and tests.",
    ],
    nextSteps: [
      "Wire the native screenshot block (Android FLAG_SECURE / iOS) — the Dart guard is in place, but the platform side is still stubbed.",
      "Add mocked bank adapters so transfer states can be exercised end to end.",
      "Add receipt and transaction-history screens without widening the sensitive surface area.",
    ],
    outcome:
      "A complete, test-backed payments client showing how I approach money movement: validate early, keep sensitive paths narrow, and make failures explicit.",
    codeSamples: [
      {
        lang: "dart",
        caption: "EMVCo CRC16-CCITT-FALSE, checked against manual fixtures",
        body: `/// Every EMVCo QR payload ends with a CRC16-CCITT-FALSE checksum
/// over the preceding bytes, including the "6304" tag and length.
/// We recompute it and refuse to parse a code whose checksum is wrong.
int crc16(List<int> data) {
  var crc = 0xFFFF;
  for (final byte in data) {
    crc ^= byte << 8;
    for (var i = 0; i < 8; i++) {
      crc = (crc & 0x8000) != 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc;
}`,
      },
    ],
    screenshots: [
      { src: "/work/duitnow/01-home.webp", alt: "Home dashboard with account balance and quick actions", caption: "Home" },
      { src: "/work/duitnow/02-send.webp", alt: "Choosing how to identify a DuitNow transfer recipient", caption: "Send" },
      { src: "/work/duitnow/03-confirm.webp", alt: "Payment review screen with recipient, amount, and a biometric confirm button", caption: "Confirm" },
      { src: "/work/duitnow/04-success.webp", alt: "Successful payment receipt with reference number", caption: "Success" },
    ],
  },
  {
    slug: "ballot-counter",
    name: "Ballot OCR Counter",
    tagline: "Photos of handwritten ballots into an auditable tally, with rules around the OCR.",
    domain: "AI · Civic tech",
    year: "2026",
    role: "Sole engineer",
    status: "In progress",
    lead: true,
    stack: [".NET 10", "Python", "Next.js", "FastAPI", "Gemini", "Supabase"],
    summary: {
      problem: "Handwritten ballots need OCR help, but the model cannot be the final authority.",
      role: "Sole engineer",
      result: "MVP built: roster checks, four-tier name matching, and tests against a real PostgreSQL.",
    },
    problem:
      "Manual counts take time, and children's handwriting on Malay-language ballots is a rough case for OCR. This project turns ballot photos into a tally, but it doesn't ask the model to be the final source of truth.",
    built: [
      "Upload a ballot image, run vision extraction, apply eligibility rules, then store the counted result.",
      "Run the web app, API, OCR worker, and PostgreSQL with Docker so the whole stack is repeatable.",
      "Check group eligibility against a seeded roster before a vote is counted.",
    ],
    decisions: [
      {
        title: "Model as extractor",
        detail:
          "Gemini reads the handwriting and suggests a name; a four-tier matcher (exact, accent-folded, fuzzy, phonetic) plus the eligibility and counting rules all run outside the model.",
      },
      {
        title: "Database rules matter",
        detail:
          "The tally depends on seeded rosters, eligibility checks, and stored state, so the tests run against PostgreSQL rather than mocks.",
      },
      {
        title: "Real fixtures stay out of git",
        detail:
          "Test ballot photos and roster images are real, but git-ignored and never committed, so no real voter data lands in the repo.",
      },
    ],
    testing: [
      "110 pgTAP assertions plus a Testcontainers suite exercise a real PostgreSQL instance, with state reset between tests — no ORM mocks.",
      "Seeded rosters cover eligible, ineligible, duplicate, and wrong-group vote cases.",
      "The upload path checks JPEG magic bytes, caps body size, and rejects open redirects; every endpoint sits behind Supabase JWT auth.",
    ],
    tradeoffs: [
      "I chose an auditable pipeline over a one-shot OCR answer, even though it adds more moving parts.",
      "Low-confidence extraction should go to review rather than being silently counted.",
    ],
    nextSteps: [
      "Add a human review queue for low-confidence OCR results.",
      "Add batch import/export so a full voting session can be checked outside the app.",
    ],
    outcome:
      "An OCR counting pipeline where AI helps with extraction, while eligibility rules, database constraints, and checks decide what gets counted.",
  },
  {
    slug: "susun-jadual",
    name: "School Timetable Solver",
    tagline: "Research toward school timetabling as a constraint problem — not something to hand an LLM.",
    domain: "AI · Optimization",
    year: "2026",
    role: "Sole engineer",
    status: "Research · ongoing",
    kind: "research",
    lead: false,
    stack: ["OR-Tools", "Python", ".NET", "Supabase"],
    summary: {
      problem: "School timetables are a constraint problem, not something an LLM should guess.",
      role: "Solo — research and design",
      result: "Ongoing: interviewing teachers and designing the solver before writing the first line of solver code.",
    },
    problem:
      "Schools often buy timetable tools they only use a few times a year. The hard part is avoiding clashes across teachers, rooms, classes, and rules. That is a constraint problem — so the plan is to solve it with an OR-Tools CP-SAT solver, not guess it with an LLM that cannot guarantee a clash-free result.",
    built: [
      "Interviewing teachers to learn how Malaysian schools actually build timetables today, and where the current tools hurt.",
      "Researched the market and the KSSR curriculum hour rules (for example, Bahasa Melayu at 11 periods a week in Year 4) so the model is grounded in real requirements.",
      "Designed the system end to end — CP-SAT solver, an independent verifier, and plain-language conflict explanations — in a plan that went through three separate design-review passes.",
    ],
    decisions: [
      {
        title: "LLM stays in its lane",
        detail:
          "The model is only meant to turn plain-language constraints into structure. The timetable itself will come from a deterministic CP-SAT solver — and the product copy will say so plainly.",
      },
      {
        title: "Solver chosen for its licence, too",
        detail:
          "OR-Tools (Apache-2.0) is the planned solver over strong alternatives like FET, whose AGPL licence would force the whole product open-source.",
      },
      {
        title: "Verify independently of the solver",
        detail:
          "The design calls for a separate verifier that re-checks every timetable against the full rule set, rather than trusting the solver's own feasibility result.",
      },
    ],
    testing: [],
    tradeoffs: [
      "An LLM cannot create the timetable. If a teacher's rule cannot be structured clearly, it needs clarification rather than a guess.",
      "A constraint solver is less 'magical' than an LLM, but it can guarantee no clashes and explain exactly why a schedule is impossible.",
    ],
    nextSteps: [
      "Turn the teacher interviews into a first concrete constraint set to model against.",
      "Build the CP-SAT solver and the independent verifier as the first coding milestone, test-first.",
      "Validate generated timetables with a pilot school before widening the scope.",
    ],
    outcome:
      "A scheduling tool grounded in how schools really work, honest about using a solver — not an LLM — for the part that has to be correct. The research phase is shaping what gets built first.",
  },
  {
    slug: "receipt-maker",
    name: "Receipt Renderer",
    tagline: "Receipts rendered from structured JSON to matching PDF, PNG, and SVG output.",
    domain: "Backend · Rendering",
    year: "2026",
    role: "Sole engineer",
    status: "Shipped",
    lead: false,
    stack: [".NET 10", "SkiaSharp", "QRCoder", "xUnit"],
    summary: {
      problem: "Receipts need exact totals and matching output across PDF, PNG, and SVG.",
      role: "Sole engineer",
      result: "Shipped renderer with a shared core, golden-image tests, and architecture notes.",
    },
    problem:
      "Receipts sound simple until totals, taxes, logos, fonts, and different output formats all have to match. I built a renderer that keeps the math exact and the visual output stable across servers.",
    built: [
      "Validate the JSON, render once with SkiaSharp, then write the same receipt through PDF, PNG, and SVG backends.",
      "Expose the same rendering core through a CLI, an HTTP API, and a Telegram bot, with a Flutter macOS demo on top.",
    ],
    decisions: [
      {
        title: "Render once, write many",
        detail:
          "The renderer builds one receipt layout, then sends it through PDF, PNG, and SVG backends so the formats stay aligned.",
      },
      {
        title: "Decimal money",
        detail:
          "Amounts use `decimal` with explicit away-from-zero rounding from input parsing to the rendered total. No floating point is used for currency.",
      },
      {
        title: "Self-contained rendering",
        detail:
          "Logos and fonts are embedded rather than fetched at render time, which avoids SSRF risk and keeps output reproducible.",
      },
    ],
    testing: [
      "184 tests on macOS (186 in Linux CI), plus 30 Flutter widget tests on the demo app.",
      "Golden-image tests run on Linux in CI so visual drift is caught during review.",
      "Time comes from an `IClock`, which keeps generated receipts deterministic.",
      "Compiler warnings fail the build, and four ADRs document the main trade-offs.",
    ],
    tradeoffs: [
      "Embedding fonts and logos reduces runtime flexibility, but it makes output reproducible and removes remote fetch risk.",
      "The renderer prioritises deterministic layout over browser-style flowing HTML.",
    ],
    nextSteps: [
      "Add more receipt templates without changing the money and rendering contracts.",
      "Add a visual diff review page for template changes.",
    ],
    outcome:
      "A small rendering toolkit with the boring parts handled properly: exact money, stable output, and architecture notes explaining the main decisions.",
    codeSamples: [
      {
        lang: "csharp",
        caption: "Money stays decimal until it is rendered",
        body: `decimal RoundMoney(decimal amount)
{
    return Math.Round(amount, 2, MidpointRounding.AwayFromZero);
}`,
      },
    ],
  },
];

export const LEAD_PROJECTS = PROJECTS.filter((p) => p.lead);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
