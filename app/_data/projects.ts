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
    tagline: "A DuitNow payments client built like money matters: real bank-QR parsing, integer-cent money, and biometrics before every debit.",
    domain: "Mobile · Payments",
    year: "2026",
    role: "Sole engineer",
    status: "Demo · complete",
    lead: true,
    stack: ["Flutter", "Dart", "Riverpod", "Freezed", "local_auth"],
    summary: {
      problem: "Payments are unforgiving: a mis-parsed QR, a rounding error, or a debit without consent is a real-world failure, not a bug ticket.",
      role: "Sole Flutter engineer",
      result: "A working client in one night — a real CIMB production QR parsed and checksum-verified, integer-cent money end to end, biometrics before every debit, 71 tests.",
    },
    problem:
      "DuitNow QR and DuitNow Transfer are Malaysia's instant-payment rails, and they punish guesswork: a QR payload has to satisfy EMVCo's tag-length-value structure and a CRC checksum, money has to reconcile to the cent, and no debit should ever happen without the payer's consent. I built a working Flutter client in a single overnight push to hold exactly that bar — not to mock a happy path, but to treat money and identity the way a real wallet has to.",
    built: [
      "Scan a DuitNow QR, parse its EMVCo tag-length-value payload, recompute the CRC16-CCITT-FALSE checksum, and refuse any code whose checksum doesn't match — verified against a real CIMB OCTO production QR, not a synthetic fixture — then show an explicit confirmation before any debit.",
      "Compose DuitNow transfers three ways — bank account (validated against per-bank account-length rules across six banks), phone number (E.164), or national ID (MyKad, checked against the 12-digit format and state-code table) — each on its own validation path before the flow proceeds.",
      "Gate every money-moving action behind device biometrics — Face ID, fingerprint, or PIN — through local_auth.",
      "Carry the payment as typed state through a Riverpod provider, never through route parameters, so amount and recipient live in typed app state instead of a tamperable URL.",
      "Keep money as integer cents from parse to display; floating-point currency never enters the system.",
    ],
    decisions: [
      {
        title: "Validate at the boundary, not the button",
        detail:
          "QR payloads, MyKad numbers, phone numbers, and per-bank account formats are all checked before the user reaches a confirmation screen. By the time money is on screen, the inputs are already known-good.",
      },
      {
        title: "Make failure a type, not a surprise",
        detail:
          "Every fallible path returns a sealed Result / Failure (Freezed) instead of throwing. There is no exception-driven control flow and no untyped `as` casts in the hand-written code (generated Freezed and JSON files excepted), so the compiler forces every error to be handled.",
      },
      {
        title: "Money is integer cents, end to end",
        detail:
          "Amounts are integer cents from the moment a value is parsed to the moment it is displayed. Floating-point never touches currency, so totals can't drift by a rounding error.",
      },
      {
        title: "Consent and least disclosure on every sensitive screen",
        detail:
          "Biometrics gate every debit, the payment intent travels through a provider rather than route params, and user-facing errors stay deliberately non-revealing — the precise failure reason lives in typed failures and tests, never leaked to the UI.",
      },
    ],
    testing: [
      "40 parser tests across 7 groups cover EMVCo TLV parsing and CRC16-CCITT-FALSE checksum verification.",
      "Checksum fixtures were derived by hand — the EMVCo reference (\"123456789\" → 0x29B1) plus hand-computed payloads — so the parser is pinned to known-good values, not to its own output.",
      "Separate suites cover currency math, payment execution, and widget behaviour; validators cover MyKad, E.164 phone numbers, and per-bank account formats.",
      "71 tests in total — 40 parser, 21 currency, 4 payment-execution, 6 widget — so a regression names exactly which layer broke.",
    ],
    tradeoffs: [
      "This is a demo on a mock backend, by design. Going live on DuitNow needs a PayNet partnership agreement and sandbox access — a commercial gate, not a coding one — so I recorded that as an ADR instead of faking live rails.",
      "The mock transfer backend declines roughly one in ten attempts on an injectable random, so the failure path is exercised honestly rather than always showing success.",
      "Payment-screen errors are intentionally non-revealing — a deliberate trade of user-facing diagnostics for not leaking why a payment failed.",
    ],
    nextSteps: [
      "Finish the native screenshot block — the Dart guard is wired and called, but the Android/iOS platform side is still stubbed, so it does not yet block on a real device.",
      "Add mocked bank adapters so more transfer outcomes — limits, rejections, timeouts — can be driven end to end.",
      "Add receipt and transaction-history screens without widening the sensitive surface area.",
    ],
    outcome:
      "A test-backed DuitNow client built to be checked, not trusted: a real CIMB production QR parsed and checksum-verified, integer-cent math end to end, typed failures on every fallible path, and biometrics before any debit. Built in one overnight push — honest about what's mocked, rigorous about what isn't.",
    codeSamples: [
      {
        lang: "dart",
        caption: "CRC16-CCITT-FALSE, hand-rolled — every scanned QR's checksum is recomputed and a mismatch refuses to parse",
        body: `/// Every EMVCo QR payload ends with a CRC16-CCITT-FALSE checksum
/// over the preceding bytes, including the "6304" tag and length.
/// We recompute it and refuse to parse a code whose checksum is wrong.
int crc16(List<int> data) {
  var crc = 0xFFFF;                 // CCITT-FALSE initial value
  for (final byte in data) {
    crc ^= byte << 8;               // fold next byte into the high byte
    for (var i = 0; i < 8; i++) {   // then process it one bit at a time
      crc = (crc & 0x8000) != 0     // is the top bit set?
          ? (crc << 1) ^ 0x1021     //   yes: shift out, then XOR the polynomial
          : crc << 1;               //   no:  just shift
      crc &= 0xFFFF;                // stay 16-bit (Dart ints are 64-bit)
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
    slug: "myclaaz",
    name: "MyClaaz",
    tagline: "The Flutter and Vue front end for a Malaysian tutor marketplace that reached 15,000+ members (2021) across web, iOS, and Android.",
    domain: "Mobile · Web · EdTech",
    year: "2020–2023",
    role: "Front-end engineer (freelance)",
    status: "Shipped · archived",
    lead: true,
    stack: ["Flutter", "Dart", "Vue 2", "Provider", "Google Maps"],
    summary: {
      problem: "A two-sided tutor marketplace lives or dies on its phone experience: discovery, scheduling, and payment all have to feel effortless.",
      role: "Front-end engineer (freelance) — Flutter app + Vue 2 web",
      result: "Shipped the iOS + Android app and the web front end for a platform that reached 15,000+ members and 14,000+ transactions across 20+ countries (per 2021 press).",
    },
    problem:
      "MyClaaz is a Malaysian EdTech marketplace that connects students with tutors and trainers, founded by Islamic-finance scholar Dr Zaharuddin Abdul Rahman; the platform was a recipient of Cradle Fund start-up assistance. As the freelance front-end engineer, I built the client side — the Flutter app for iOS and Android, and the Vue 2 web front end — against an API owned by the backend developer. A marketplace only works if finding a tutor, booking a slot, and paying all feel simple on a phone, so the front end had to carry discovery, scheduling, media, and payments without friction.",
    built: [
      "Built the iOS and Android app in Flutter (Dart) — onboarding, account and PIN login, tutor search, profiles, scheduling, and the purchase flow's client side — across 126 source files in a feature-first architecture.",
      "Built the customer-facing web front end in Vue 2 against the same backend API.",
      "Location-based tutor discovery on Google Maps, with subject, distance, date, and duration filters.",
      "In-app scheduling on a calendar, plus the booking and purchase screens for classes and tutor products like notes and videos.",
      "Reactive state with Provider and RxDart, networking through Dio, push notifications via OneSignal, and crash reporting via Sentry.",
    ],
    decisions: [
      {
        title: "Feature-first architecture",
        detail:
          "The Flutter codebase is organised by feature — account, search, tutor, transaction, dashboard — rather than by layer, so each screen's pages, models, and state sit together and the app stays navigable as features grow.",
      },
      {
        title: "Built for real phones, not the demo",
        detail:
          "Shimmer skeletons for slow connections, image compression before upload, hand-rolled localisation, and Sentry in production so real crashes were visible — choices for an app used in the field across 20+ countries.",
      },
      {
        title: "Reactive state, not manual refreshes",
        detail:
          "Provider and RxDart drive the UI from observable stores, so search, filters, and dashboards update from data changes instead of imperative screen refreshes.",
      },
    ],
    testing: [],
    tradeoffs: [
      "This was a front-end role: I built the Flutter and Vue clients against an API and data model owned by the backend developer, not the server itself.",
      "It predates the test-first discipline in my newer work — the app shipped and scaled on manual QA and production monitoring (Sentry), not an automated suite.",
      "The app is no longer published, so this case study links an archived 2021 snapshot rather than a live download.",
    ],
    nextSteps: [
      "Add an automated test suite — widget and flow tests around booking and payments especially — instead of leaning on manual QA.",
      "Migrate the codebase to null-safety and off the now-dated Flutter 1.x packages.",
      "Pull the per-screen styling into a shared component and design-token system.",
    ],
    outcome:
      "A cross-platform marketplace app and web front end that real tutors and students used — 15,000+ members and 14,000+ transactions across 20+ countries, per 2021 press. It was my first production Flutter app, and the reason I care about discovery, scheduling, and payment flows feeling effortless.",
    links: [
      { label: "Archived site (2021)", href: "https://web.archive.org/web/20210624224222/https://myclaaz.com/" },
      { label: "Press — BusinessToday", href: "https://www.businesstoday.com.my/2021/07/13/myclaaz-com-digital-platform-empowers-trainers-with-numerous-opportunities-for-monetisation/" },
    ],
    screenshots: [
      { src: "/work/myclaaz/01-home.webp", alt: "MyClaaz app home with Student, Tutor, and Business sections", caption: "Home" },
      { src: "/work/myclaaz/02-search.webp", alt: "Map of Malaysia showing nearby tutors as location pins", caption: "Find a tutor" },
      { src: "/work/myclaaz/03-profile.webp", alt: "Tutor profile showing services, hourly pricing, and an engage button", caption: "Tutor profile" },
      { src: "/work/myclaaz/04-schedule.webp", alt: "Weekly tutor availability calendar", caption: "Scheduling" },
    ],
  },
  {
    slug: "enter-sarawak",
    name: "enterSarawak",
    tagline: "Three Flutter apps — public, enforcement, and command centre — for Sarawak's COVID-era border-entry approval system.",
    domain: "Mobile · GovTech",
    year: "2020–2022",
    role: "Front-end engineer (Ukuya)",
    status: "Shipped · archived",
    lead: true,
    stack: ["Flutter", "Dart", "Freezed", "Provider", "Hive"],
    summary: {
      problem: "During COVID, entering Sarawak meant approval through one mandatory state gate — a single system serving three very different users: travellers, frontline officers, and a command centre.",
      role: "Front-end engineer, Ukuya — top contributor across the three apps (266 of 499 commits)",
      result: "Shipped three production Flutter apps that ran the mandatory entry-approval flow end to end — apply, verify at the border, and decide — through the pandemic.",
    },
    problem:
      "When Sarawak controlled its borders during COVID-19, every non-Sarawakian had to be approved before entering. enterSarawak was the state's official system for that — the single mandatory gate for entering the state, run by the State Disaster Management Committee — and it had three sides: the public applies and carries a QR entry pass, enforcement officers verify and process arrivals at entry points, and a command centre reviews and decides. I built the front end at Ukuya — the largest contributor across all three Flutter apps, with 266 of the 499 commits on an eight-person team.",
    built: [
      "Built three Flutter apps for the three sides of the system: the public app (apply, upload documents, carry a QR entry pass, track status on a timeline), an officer app to verify and process travellers at entry points, and an admin Command Centre to review and decide applications.",
      "Generated each approved traveller's QR entry pass with qr_flutter for officers to scan at the border.",
      "Cached data on-device with Hive and gated access with device biometrics (local_auth), for frontline use on patchy connections.",
      "Built on a shared in-house Flutter package ecosystem (~24 ukuya_* packages — OAuth, DI, API clients, form fields, validation, i18n, file handling) so the three apps stayed consistent and shipped fast.",
      "Typed models with Freezed, code-generated routing with auto_route, Provider for state, and Sentry crash reporting in production.",
    ],
    decisions: [
      {
        title: "One system, three focused apps",
        detail:
          "Travellers, officers, and the command centre have completely different jobs, so each got its own app instead of one overloaded build — the public app tuned for applying and carrying a pass, the officer app for fast verification, the admin app for review and decisions.",
      },
      {
        title: "Shared packages, not copy-paste",
        detail:
          "The three apps run on a common in-house package set — auth/OAuth, DI, API clients, form fields, validators, i18n — versioned through a private pub server. Shared behaviour lives in one place, so a fix or design change lands across all three apps instead of being copy-pasted into drift.",
      },
      {
        title: "Typed and generated where it counts",
        detail:
          "Freezed for typed models and auto_route for generated routing keep a large multi-app codebase — 365+ Dart files across the three apps — navigable, with the compiler catching breakage that would otherwise need a test.",
      },
    ],
    testing: [],
    tradeoffs: [
      "Front-end role: I built the three client apps against APIs owned by the backend team; the server side and the approval rules weren't mine.",
      "Like a lot of pandemic-era software, it shipped fast under real pressure and leaned on production monitoring (Sentry) rather than an automated test suite.",
      "It was retired when border controls lifted and is no longer on the stores, so this case study points to the SDMC system and press coverage rather than a live download.",
    ],
    nextSteps: [
      "Add automated tests — especially contract tests on the shared packages, so one change can't silently break any of the three apps.",
      "Add end-to-end flow tests for the apply → verify → approve path across the apps.",
      "Promote the per-app theming into a single shared design-system layer.",
    ],
    outcome:
      "Three production Flutter apps that carried Sarawak's mandatory border-entry approval through the pandemic — for the public, frontline officers, and a command centre. It's the work that taught me to keep three apps coherent across one repo and a shared package set while shipping under real public-health deadlines.",
    links: [
      { label: "About the system — SDMC", href: "https://sarawakdisastermc.com/" },
      { label: "Press — Malay Mail", href: "https://www.malaymail.com/news/malaysia/2021/10/17/entersarawak-application-required-for-all-non-sarawakians-sdmc-clarifies/2013934" },
    ],
    screenshots: [
      { src: "/work/enter-sarawak/01-applications.webp", alt: "enterSarawak My Applications list showing several travel requests and their approval status", caption: "Applications" },
      { src: "/work/enter-sarawak/02-submitted.webp", alt: "Travel request submitted confirmation screen", caption: "Request submitted" },
      { src: "/work/enter-sarawak/03-vaccination.webp", alt: "Adding a COVID-19 vaccination record in the app", caption: "Add vaccination" },
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
    lead: false,
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
