import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Agent systems landscape — Nomed",
  description: "A dated, non-binding assessment of Yukh, Maka, goose, OpenHands, Buzz and agent interoperability boundaries.",
};

const candidates = [
  ["Yukh MCP", "Keep semantics; qualify composition", "Cross-runtime capability policy and evidence", "Duplicating every runtime's native approval path"],
  ["Yukh Coordination", "Keep kernel; integrate surfaces", "Claims, conflict, handoff, attribution and replay", "An external protocol proves equivalent semantics with less custom code"],
  ["Yukh Projects", "Narrow", "First accepted-state adapter for GitHub Projects", "Treating GitHub Projects itself as a universal Yukh layer"],
  ["Apache Maka", "Evaluate deeply", "Durable AgentRun and execution evidence", "Authority model cannot compose or required records leak private reasoning"],
  ["goose", "Evaluate first as reference host", "Vendor-neutral host; MCP + ACP; composable agent loop direction", "Requires internal patching or makes Yukh goose-specific"],
  ["OpenHands", "Evaluate as execution provider", "Sandboxed and remote execution infrastructure", "Must adopt the whole platform just to obtain isolation"],
  ["Buzz", "Evaluate as workspace adapter", "Human-agent rooms, attribution and signed event experience", "Its event substrate changes Yukh authority or handoff semantics"],
];

const semantics = [
  ["Participant identity / attribution", "Yes", "Buzz identities, runtime principals, IdP adapters"],
  ["Claim / conflict / handoff", "Yes", "Yukh Coordination; external transport/workspace adapters"],
  ["Capability policy / decision", "Yes", "Yukh MCP composed with runtime-native permissions"],
  ["Agent loop", "No", "Maka, goose, OpenHands, Codex, Claude Code"],
  ["Sandbox execution", "No", "OpenHands, Maka and runtime-native sandboxes"],
  ["Durable AgentRun facts", "Probably", "Maka is the first qualification candidate"],
  ["Accepted work state", "Yes, abstractly", "GitHub Projects through yukh-projects; other adapters later"],
  ["Human collaborative workspace", "No", "Buzz, Matrix, IDEs, web clients"],
];

export default function LandscapePage() {
  return (
    <EditorialPage
      index="05"
      label="Landscape"
      title="Own the semantics. Reuse the machinery."
      lede="Yukh is being tested against the agent ecosystem with no protected components and no preferred external winner. A useful result may be a pivot, a replacement, or less Yukh code."
      accent="#00E5FF"
    >
      <p><strong>Research status / observed 24 August 2026.</strong> This page is not an adoption decision and does not supersede accepted RFCs. External projects move quickly; every material decision requires fresh qualification.</p>

      <h2>The architectural test</h2>
      <p>The working hypothesis is that Yukh should own only the governance and interoperability semantics that must survive a change of model, runtime, workspace or vendor. Agent loops, sandboxes and human interfaces should be reused when an external implementation preserves those semantics better than custom code.</p>

      <h2>Current adoption posture</h2>
      <table>
        <thead><tr><th>Component</th><th>Posture</th><th>Why it matters</th><th>Disqualifier</th></tr></thead>
        <tbody>
          {candidates.map(([component, posture, value, disqualifier]) => (
            <tr key={component}><td><strong>{component}</strong></td><td>{posture}</td><td>{value}</td><td>{disqualifier}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>What Yukh may actually need to own</h2>
      <table>
        <thead><tr><th>Semantic concern</th><th>Stable Yukh contract?</th><th>Implementation candidates</th></tr></thead>
        <tbody>
          {semantics.map(([concern, owned, implementations]) => (
            <tr key={concern}><td><strong>{concern}</strong></td><td>{owned}</td><td>{implementations}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Most plausible pivots</h2>
      <ul>
        <li><strong>Projects becomes an adapter.</strong> The durable semantic is accepted work state; GitHub Projects is the first implementation, not necessarily a universal pillar.</li>
        <li><strong>Maka or goose becomes a reference runtime/host.</strong> Yukh may never need its own agent loop. Maka is strongest on recoverable execution facts; goose is strongest on interoperability and host composition.</li>
        <li><strong>Buzz becomes a collaborative surface.</strong> Yukh Coordination can remain the semantic kernel while Buzz, Matrix or another workspace carries human-agent interaction.</li>
        <li><strong>OpenHands supplies execution isolation.</strong> Yukh policy can authorize a bounded operation while an external sandbox performs it and returns evidence.</li>
        <li><strong>A Yukh repository can disappear.</strong> Prior investment is not a reason to preserve a component that an external project makes redundant.</li>
      </ul>

      <h2>Qualification order</h2>
      <ol>
        <li>goose compatibility spike: can Yukh integrate without owning the agent loop?</li>
        <li>Maka AgentRun mapping: can durable execution facts become vendor-neutral evidence?</li>
        <li>Buzz coordination mapping: can rooms and identity preserve Yukh handoff and authority boundaries?</li>
        <li>OpenHands execution-provider spike: can a Yukh capability be executed in an external sandbox with verifiable evidence?</li>
        <li>Re-evaluate yukh-projects as the GitHub adapter for an abstract accepted-work-state contract.</li>
      </ol>

      <p>The full evidence, comparison matrices, upside and disqualifying conditions live in the dated research record governed by issue #56.</p>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/editorial/YUKH-AGENT-LANDSCAPE-2026-08-24.md">Read the landscape record <ArrowIcon direction="external" /></a>
    </EditorialPage>
  );
}
