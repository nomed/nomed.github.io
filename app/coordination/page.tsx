import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yukh Coordination has moved — Nomed",
  description: "Compatibility route for the Yukh Coordination system deep dive.",
  alternates: {
    canonical: "/system/coordination/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CoordinationCompatibilityPage() {
  return (
    <main>
      <meta httpEquiv="refresh" content="0;url=/system/coordination/" />
      <p>Yukh Coordination has moved to <a href="/system/coordination/">/system/coordination/</a>.</p>
    </main>
  );
}
