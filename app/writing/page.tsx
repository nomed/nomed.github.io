import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Writing — Nomed",
  description: "Field notes from the design of governed agentic systems.",
};

export default function WritingPage() {
  return (
    <EditorialPage
      index="05"
      label="Writing"
      title="Ideas tested against the work."
      lede="Field notes make the reasoning behind Nomed and Yukh public before it hardens into architecture, protocol or policy."
    >
      <div className="writing-list">
        <article>
          <p className="card-status">Field note · 01 / August 2026</p>
          <h2>Capability, not custody.</h2>
          <p>Why useful agents need bounded capabilities rather than possession of credentials and systems.</p>
          <Link className="text-link" href="/writing/capability-not-custody/">Read the field note <ArrowIcon /></Link>
        </article>
      </div>
    </EditorialPage>
  );
}
