// Single source of truth for the project showcase.
// Used by /work (grid) and /work/[slug] (case study). No employer branding.

export type RigorPoint = { title: string; detail: string };

export type CodeSample = { lang: string; caption: string; body: string };

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
  /** Featured on the homepage when true. */
  lead: boolean;
  stack: string[];
  /** Editorial lede on the case-study page. */
  problem: string;
  /** What I built — scope bullets. */
  built: string[];
  /** Technical notes for the case-study page. */
  rigor: RigorPoint[];
  outcome: string;
  /** Optional illustrative code sample. */
  code?: CodeSample;
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
    problem:
      "DuitNow QR and DuitNow Transfer leave little room for guesswork: the QR payload has to match EMVCo rules, and every payment screen has to treat money and identity carefully. I built a working Flutter client over one night as a focused payments exercise.",
    built: [
      "Scan a DuitNow QR, parse the EMVCo payload, verify the checksum, then show a confirmation before any debit.",
      "Send DuitNow transfers by account, phone number (E.164), or national ID, with bank-specific account rules.",
      "Require Face ID, fingerprint, or device PIN before sensitive actions.",
      "Block screenshots on payment screens and keep error messages deliberately non-revealing.",
    ],
    rigor: [
      {
        title: "Hand-checked QR fixtures",
        detail:
          "The parser is tested against CRC16-CCITT-FALSE checksums I calculated manually: 39 parser tests and 66 tests overall. A QR code only moves forward after its checksum passes.",
      },
      {
        title: "Typed failures",
        detail:
          "Fallible paths return sealed Result / Failure types, so errors stay explicit. There is no exception-driven control flow and no untyped `as` casts in the codebase.",
      },
      {
        title: "Boundary validation",
        detail:
          "MyKad, E.164 phone numbers, and bank account formats are checked before input reaches the payment flow.",
      },
    ],
    outcome:
      "A complete, test-backed payments client showing how I approach money movement: validate early, keep sensitive paths narrow, and make failures explicit.",
    code: {
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
    stack: ["Python", "FastAPI", "PostgreSQL", "Gemini", "Docker"],
    problem:
      "Manual counts take time, and children's handwriting on Malay-language ballots is a rough case for OCR. This project turns ballot photos into a tally, but it doesn't ask the model to be the final source of truth.",
    built: [
      "Upload a ballot image, run vision extraction, apply eligibility rules, then store the counted result.",
      "Run the web app, API, OCR worker, and PostgreSQL with Docker so the whole stack is repeatable.",
      "Check group eligibility against a seeded roster before a vote is counted.",
    ],
    rigor: [
      {
        title: "Test against PostgreSQL",
        detail:
          "pgTAP and Testcontainers run the tests against a real PostgreSQL instance, with state reset between tests. I avoided ORM mocks here because the database rules matter.",
      },
      {
        title: "Security passes",
        detail:
          "I did separate reviews for untrusted image uploads and data isolation, each with a short threat model.",
      },
      {
        title: "Synthetic fixtures",
        detail:
          "The repo doesn't need real ballot images or voter data. Test images and roster data are synthetic, and the pipeline is designed around that constraint.",
      },
    ],
    outcome:
      "An OCR counting pipeline where AI helps with extraction, while eligibility rules, database constraints, and checks decide what gets counted.",
  },
  {
    slug: "susun-jadual",
    name: "School Timetable Solver",
    tagline: "School timetables generated by a constraint solver, with AI only for rule capture.",
    domain: "AI · Optimization",
    year: "2026",
    role: "Sole engineer",
    status: "In progress",
    lead: false,
    stack: [".NET", "Python", "OR-Tools", "PostgreSQL", "Docker"],
    problem:
      "Schools often buy timetable tools they only use a few times a year. The hard part is avoiding clashes across teachers, rooms, classes, and rules. That is a constraint problem, so the timetable is solved by OR-Tools instead of guessed by an LLM.",
    built: [
      "Let teachers describe constraints in natural language, then translate them into structured rules.",
      "Use OR-Tools CP-SAT to generate the timetable from those rules.",
      "Run a separate validator over the generated timetable before showing it.",
    ],
    rigor: [
      {
        title: "LLM stays in its lane",
        detail:
          "The model only helps turn text into structured constraints. The schedule comes from a deterministic CP-SAT solver, and the product copy says that plainly.",
      },
      {
        title: "Independent validation",
        detail:
          "After solving, a separate validator checks the timetable against the full rule set. The app doesn't rely on the solver's feasibility result alone.",
      },
    ],
    outcome:
      "A practical scheduling prototype that combines natural-language input with a deterministic solver and a plain-spoken explanation of what the AI does.",
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
    problem:
      "Receipts sound simple until totals, taxes, logos, fonts, and different output formats all have to match. I built a renderer that keeps the math exact and the visual output stable across servers.",
    built: [
      "Validate the JSON, render once with SkiaSharp, then write the same receipt through PDF, PNG, and SVG backends.",
      "Expose the same rendering core through a CLI, an HTTP API, and a bot.",
    ],
    rigor: [
      {
        title: "Decimal money throughout",
        detail:
          "Amounts use `decimal` with explicit away-from-zero rounding from input parsing to the rendered total. No floating point is used for currency.",
      },
      {
        title: "Stable output in CI",
        detail:
          "Time comes from an `IClock`, and golden-image tests run on Linux in CI so rendering changes are caught instead of drifting silently.",
      },
      {
        title: "Self-contained rendering",
        detail:
          "Logos and fonts are embedded rather than fetched at render time, which avoids SSRF risk and keeps output reproducible. Compiler warnings fail the build.",
      },
    ],
    outcome:
      "A small rendering toolkit with the boring parts handled properly: exact money, stable output, and architecture notes explaining the main decisions.",
  },
];

export const LEAD_PROJECTS = PROJECTS.filter((p) => p.lead);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
