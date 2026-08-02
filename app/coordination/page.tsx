import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";

export const metadata: Metadata = {
  title: "Yukh Coordination — Nomed",
  description: "A protocol direction for shared, durable coordination between people and agents.",
};

export default function CoordinationPage() {
  return (
    <EditorialPage
      index="03"
      label="Protocol in formation"
      title="A shared room for work that happens in separate minds."
      lede="Sessions are isolated. Delivery is not. Coordination needs a neutral channel where participants can announce ownership, ask questions, attach evidence and hand work over explicitly."
      accent="#93B800"
    >
      <p className="editorial-note"><strong>Status:</strong> research and design. The interaction model below is a proposal, not a published protocol.</p>
      <h2>What the old tools understood</h2>
      <p>IRC made presence and shared context cheap. Mailing lists made decisions durable. Patch queues separated authorship from acceptance. None required a central intelligence to choreograph every participant.</p>
      <h2>The minimum useful protocol</h2>
      <ul>
        <li><strong>Presence:</strong> who is active, idle, blocked or gone.</li>
        <li><strong>Claims:</strong> which bounded outcome a participant currently owns.</li>
        <li><strong>Signals:</strong> progress, question, answer, review request and verdict.</li>
        <li><strong>Evidence:</strong> immutable references to commits, runs, fixtures and decisions.</li>
        <li><strong>Handoffs:</strong> explicit transfer without guessing from silence or elapsed time.</li>
      </ul>
      <h2>What it must not become</h2>
      <p>Not an opaque supervisor. Not a proprietary agent bus. Not another system that confuses message delivery with authority. Governance remains with the project; the channel makes coordination legible.</p>
      <a className="editorial-cta" href="https://github.com/nomed/yukh-mcp/issues">Challenge the proposal on GitHub ↗</a>
    </EditorialPage>
  );
}
