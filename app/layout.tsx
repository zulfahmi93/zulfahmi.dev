import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "./_components/nav";
import { SiteFooter } from "./_components/site-footer";
import { DocumentViewerProvider } from "./_components/document-viewer";
import { SITE } from "./_data/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = `${SITE.fullName} — ${SITE.role}`;
const description = `${SITE.role} in ${SITE.location}. Mobile, web, backend, and AI-assisted systems, with a practical focus on tests, security, and maintainable delivery.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s — ${SITE.fullName}`,
  },
  description,
  openGraph: {
    title,
    description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <DocumentViewerProvider>
          <Nav />
          <main className="zf-main">{children}</main>
          <SiteFooter />
        </DocumentViewerProvider>
      </body>
    </html>
  );
}
