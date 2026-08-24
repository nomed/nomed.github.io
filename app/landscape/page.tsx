import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Agent systems landscape — Nomed",
  description: "A dated, non-binding assessment of Yukh and current agent hosts, execution systems, memory, orchestration, workspaces and interoperability boundaries.",
};

const candidates = [
  ["Yukh MCP", "Keep semantics; qualify composition", "Cross-runtime capability policy, decision and evidence boundary", "Becoming a second approval engine beside every host"],
  ["Yukh Coordination", "Keep kernel; integrate surfaces", "Claims, conflict, handoff, attribution and replay", "An external protocol proves equivalent semantics with less custom code"],
  ["Yukh Projects", "Narrow to adapter", "GitHub Projects implementation of accepted work state", "Treating GitHub Projects itself as a universal Yukh layer"],
  ["goose", "Host candidate — A1 PASS / A2 not executed", "ACP + MCP host with broad composability", "Yukh composition requires internal patching, global auto mode or broader authority"],
  ["Hermes Agent", "Host candidate — A1 PASS / A2 not executed", "Provider-neutral persistent host with ACP, MCP, approvals and multiple execution backends", "Host memory or internal APIs become required Yukh semantics"],
  ["Apache Maka", "Durable-execution candidate", "Event-sourced AgentRun and execution/evaluation facts", "Required records leak private reasoning or authority cannot remain external"],
  ["OpenHands", "Execution-isolation candidate", "External sandbox and remote execution machinery", "Isolation requires adopting unrelated platform authority"],
  ["OpenHuman", "Orchestration challenger", "Checkpointed workflows, approvals and agent fleets; memory remains a benchmark concern", "Broad platform coupling or workflow state becomes Yukh authority"],
  ["TencentDB Agent Memory", "Shared-memory candidate — Track C2", "Team memory assets across agents: Chat Memory, Skill, Wiki and CodeGraph", "Memory status/ACL/proxy semantics leak into Yukh evidence or project authority"],
  ["Buzz", "Workspace candidate", "Human-agent rooms, identity/attribution and collaborative interaction", "Its event substrate changes Yukh authority or handoff semantics"],
  ["Codex / Claude Code", "Participants, not dependencies", "Agent runtimes that should be able to participate through public seams", "Yukh core contracts become vendor/runtime-specific"],
];

const semantics = [
  ["Participant identity / attribution", "Yes", "Yukh-visible participant contract; runtime/workspace identities remain adapters"],
  ["Claim / conflict / handoff", "Yes", "Yukh Coordination today; external transports and workspaces may carry it"],
  ["Capability policy / decision", "Yes", "Yukh MCP semantics composed with host-native permissions"],
  ["Evidence correlation", "Yes", "Operational facts must survive host/runtime replacement without private reasoning"],
  ["Agent host / loop", "No", "goose, Hermes, Codex, Claude Code and other replaceable hosts"],
  ["Sandbox execution", "No", "OpenHands and host/runtime-native sandboxes"],
  ["Durable AgentRun facts", "Candidate stable contract", "Apache Maka first qualification target"],
  ["Durable orchestration / workflow", "Probably not core", "OpenHuman and other workflow engines"],
  ["Persistent agent memory", "No, except boundary contracts", "TencentDB Agent Memory; Hermes/OpenHuman as benchmarks"],
  ["Accepted work state", "Yes, abstractly", "GitHub Projects through yukh-projects today; other adapters later"],
  ["Human collaborative workspace", "No", "Buzz, Matrix, IDEs, web clients"],
];

export default function LandscapePage() {
  return (
    <EditorialPage
      index="05"
      label="Landscape"
      title="Own the semantics. Reuse the machinery."
      lede="Yukh is being tested against the agent ecosystem with no protected components and no preferred external winner. A useful result may be a pivot, a replacement, multiple supported adapters, or less Yukh code."
      accent="#00E5FF"
    >
      <p><strong>Research status / 24 August 2026.</strong> This page is a dated qualification view, not an adoption decision, and it does not supersede accepted RFCs. RFC-0003 remains the current reference architecture.</p>

      <h2>What changed</h2>
      <p>The architecture review is no longer only documentary. goose and Hermes both passed the first executable <strong>runtime-substrate gate</strong>. The stricter Gate A2 now requires a two-sided Yukh/host policy-composition proof through supported public seams; it is defined but candidate adapters have not yet executed it. No reference host is selected.</p>
      <p>Memory has also been separated from orchestration. TencentDB Agent Memory is now the primary Track C2 shared/team-memory qualification candidate, while OpenHuman remains an orchestration/workflow challenger and a memory benchmark rather than a combined default platform.</p>

      <h2>The architectural test</h2>
      <p>Yukh should own only governance and interoperability semantics that must survive a change of model, host, runtime, workspace or vendor. Agent hosts, sandboxes, workflow engines, memory systems and human interfaces should remain replaceable machinery whenever external implementations preserve those semantics.</p>

      <h2>Current qualification posture</h2>
      <table>
        <thead><tr><th>Component / project</th><th>Posture</th><th>Why it matters</th><th>Disqualifier</th></tr></thead>
        <tbody>
          {candidates.map(([component, posture, value, disqualifier]) => (
            <tr key={component}><td><strong>{component}</strong></td><td>{posture}</td><td>{value}</td><td>{disqualifier}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>What Yukh may actually need to own</h2>
      <table>
        <thead><tr><th>Semantic concern</th><th>Stable Yukh contract?</th><th>Implementation direction</th></tr></thead>
        <tbody>
          {semantics.map(([concern, owned, implementations]) => (
            <tr key={concern}><td><strong>{concern}</strong></td><td>{owned}</td><td>{implementations}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Most plausible pivots</h2>
      <ul>
        <li><strong>Projects becomes explicitly an adapter.</strong> The durable semantic is accepted work state; GitHub Projects is the current implementation, not necessarily a universal pillar.</li>
        <li><strong>Yukh never builds an agent host.</strong> goose and Hermes have both earned further qualification; neither has yet passed Yukh-specific host composition.</li>
        <li><strong>Memory becomes external team machinery.</strong> TencentDB Agent Memory tests whether reusable Chat Memory, Skills, Wiki and CodeGraph can remain contextual without becoming authority or evidence truth.</li>
        <li><strong>Orchestration remains external.</strong> OpenHuman tests whether checkpointed workflows and approvals can be consumed without turning workflow state into Yukh authority.</li>
        <li><strong>Buzz becomes a collaborative surface.</strong> Yukh Coordination can remain the semantic kernel while Buzz, Matrix or another workspace carries human-agent interaction.</li>
        <li><strong>OpenHands supplies isolation.</strong> Yukh policy can authorize a bounded operation while external execution machinery performs it and returns correlated evidence.</li>
        <li><strong>A Yukh repository can disappear.</strong> Prior investment is not a reason to preserve a component that an external project makes redundant.</li>
      </ul>

      <h2>Qualification tracks</h2>
      <ol>
        <li><strong>Track A / Agent host:</strong> goose vs Hermes. Runtime-substrate PASS for both; Yukh host-composition A2 next.</li>
        <li><strong>Durable execution:</strong> qualify Apache Maka for AgentRun / execution facts and evidence.</li>
        <li><strong>Orchestration:</strong> qualify OpenHuman workflow/checkpoint/approval boundaries independently from memory.</li>
        <li><strong>Track C2 / Shared memory:</strong> qualify TencentDB Agent Memory against memory ≠ authority, accepted state or evidence truth.</li>
        <li><strong>Workspace:</strong> map Buzz interaction and identities onto Yukh Coordination without semantic loss.</li>
        <li><strong>Execution isolation:</strong> execute one bounded Yukh capability through OpenHands and return correlated evidence.</li>
        <li><strong>Accepted state:</strong> re-evaluate yukh-projects as the GitHub adapter for an abstract accepted-work-state contract.</li>
      </ol>

      <p>The dated research record and governing issues carry the evidence. External projects are never considered selected merely because they appear on this page.</p>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/issues/56">Architecture review / #56 <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/issues/58">Host qualification / #58 <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/issues/63">Shared memory qualification / #63 <ArrowIcon direction="external" /></a>
    </EditorialPage>
  );
}
