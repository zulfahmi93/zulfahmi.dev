// Single source of truth for site-wide identity, navigation, and CV content.
// No employer-branded *product* names beyond the public employment record below.

export const SITE = {
  name: "Zulfahmi", // short wordmark
  fullName: "Zulfahmi Ahmad",
  role: "Senior Software Engineer",
  location: "Sungai Udang, Melaka",
  domain: "zulfahmi.dev",
  url: "https://zulfahmi.dev",
  positioning:
    "I build mobile, web, and AI-backed systems for teams that need to ship quickly and keep things running.",
  email: "hello@zulfahmi.dev",
  resume: "/zulfahmi-cv.pdf",
  portrait: "/portrait.jpg",
  // Town-level locator shown decoratively in the hero + footer.
  coords: { lat: "N 2°17.56′", lon: "E 102°7.99′" },
  socials: {
    github: "https://github.com/zulfahmi93",
    linkedin: "https://www.linkedin.com/in/zulfahmi-ahmad/",
    x: "",
  },
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Tools shown in the homepage "built with" strip.
export const STACK: string[] = [
  "Flutter",
  "Dart",
  "C# / .NET",
  "TypeScript",
  "Python",
  "AWS",
  "PostgreSQL",
  "Docker",
  "OR-Tools",
];

// Headline numbers from a decade of shipping. Rendered on the About page.
export const STATS: { value: string; label: string }[] = [
  { value: "5+", label: "apps in production" },
  { value: "50k+", label: "downloads across shipped apps" },
  { value: "7", label: "engineers on the team" },
];

export type Role = {
  title: string;
  org: string;
  location: string;
  period: string;
  points: string[];
};

export const EXPERIENCE: Role[] = [
  {
    title: "Head, Mobile Division",
    org: "Ukuya Sdn. Bhd.",
    location: "Petaling Jaya",
    period: "Mar 2020 – Present",
    points: [
      "Lead a team of seven Flutter engineers building production apps for Google Play and the App Store; the portfolio has 50k+ downloads.",
      "Started a shared-code effort that removed 50%+ duplicated code and made new app work faster to deliver.",
      "Defined the SOPs and tooling (Flutter Web, CI/CD, Playwright E2E) that let the team ship quickly when the work called for it, including days with 10 dev builds and 2 live releases.",
    ],
  },
  {
    title: "Senior Flutter Developer",
    org: "Ukuya Sdn. Bhd.",
    location: "Petaling Jaya",
    period: "Jan 2020 – Mar 2020",
    points: [
      "Built a Vue.js + .NET membership and print-service system for a government programme, reducing card issuance from days to seconds.",
      "Delivered a state border-management system in one week during COVID, when the service was receiving thousands of daily requests.",
    ],
  },
  {
    title: "Senior .NET Engineer",
    org: "Urban Mobility Tech PLT",
    location: "Kuala Lumpur",
    period: "Jul 2019 – Jan 2020",
    points: [
      "Worked on a nationwide fuel-retail and payment platform in ASP.NET for a major oil and gas company.",
      "Built product categorisation and promotion/discount tooling for station operators.",
    ],
  },
  {
    title: "Research Assistant",
    org: "Multimedia University",
    location: "Melaka",
    period: "Dec 2015 – Apr 2018",
    points: [
      "Built a WPF ray-tracing simulator for indoor/outdoor radio-signal propagation that was later used in published research.",
      "Also prototyped an autonomous mapping robot (Arduino Mega, ultrasonic, XBee) and a real-time Twitter sentiment pipeline (.NET Core + Flask + Elasticsearch).",
    ],
  },
];

export const EDUCATION: { title: string; org: string; location: string; period: string }[] = [
  {
    title: "Foundation in Engineering",
    org: "Multimedia University",
    location: "Melaka",
    period: "2011 – 2012",
  },
];

export type Certification = {
  title: string;
  /** Issuing body shown as a sublabel under the title. */
  issuer: string;
  year: string;
  /** Rendered page image(s) shown in the in-page document viewer. */
  pages: string[];
};

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Microsoft Certified Professional",
    issuer: "Microsoft",
    year: "2014",
    pages: ["/credentials/mcp.webp"],
  },
  {
    title: "Microsoft Technology Associate — Software",
    issuer: "Microsoft",
    year: "2014",
    pages: ["/credentials/mta-software.webp"],
  },
  {
    title: "Microsoft Technology Associate — Web",
    issuer: "Microsoft",
    year: "2015",
    pages: ["/credentials/mta-web.webp"],
  },
];

// Résumé page images for the in-page viewer. The downloadable PDF is SITE.resume.
export const RESUME_PAGES: string[] = [
  "/credentials/resume-1.webp",
  "/credentials/resume-2.webp",
];

// Working habits reused on Home + About.
export const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Test the risky parts",
    body: "I like tests to pin down behaviour before the code gets comfortable. For payments, auth, parsing, and renderers, the suite becomes the checklist.",
  },
  {
    title: "Review security early",
    body: "Auth, crypto, file uploads, and untrusted input get a separate pass before release. I write down the threat model so the trade-offs are visible.",
  },
  {
    title: "Use AI where it fits",
    body: "I'm comfortable with models, but I don't let them make decisions that need deterministic checks. OCR can suggest; validators and rules still decide.",
  },
  {
    title: "Write down the why",
    body: "I benchmark libraries, models, and costs before settling on them, then leave notes for the next person who has to maintain the work.",
  },
];

// Grouped capabilities for the About page.
export const CAPABILITIES: { group: string; items: string[] }[] = [
  {
    group: "Mobile",
    items: ["Flutter / Dart", "Riverpod", "Freezed", "Flutter Web"],
  },
  {
    group: "Backend",
    items: ["C# / ASP.NET", ".NET Core", "REST + gRPC", "PostgreSQL"],
  },
  {
    group: "Web & cloud",
    items: ["TypeScript", "Vue / Next.js", "AWS", "Docker · CI/CD"],
  },
  {
    group: "AI & quality",
    items: ["Vision OCR (Gemini)", "OR-Tools CP-SAT", "Playwright E2E", "Testcontainers"],
  },
];
