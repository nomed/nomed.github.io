import type { Metadata } from "next";
import "./globals.css";
import "./editorial-tables.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nomed.github.io"),
  title: "Nomed — Governed Agentic Development",
  description:
    "Open governance semantics for replaceable agent systems: capability without custody, explicit coordination and portable evidence.",
  openGraph: {
    title: "Nomed — Governed Agentic Development",
    description: "Open governance semantics for replaceable agent systems and human-agent collaboration.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nomed — Governed Agentic Development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomed — Governed Agentic Development",
    description: "Open governance semantics for replaceable agent systems and human-agent collaboration.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
