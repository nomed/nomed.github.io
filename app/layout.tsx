import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nomed.github.io"),
  title: "Nomed — Governed Agentic Development",
  description:
    "Nomed designs open infrastructure for governed agentic development: capability without custody, coordination with evidence.",
  openGraph: {
    title: "Nomed — Governed Agentic Development",
    description: "Open infrastructure for people and agents working together in public.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nomed — Governed Agentic Development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomed — Governed Agentic Development",
    description: "Open infrastructure for people and agents working together in public.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
