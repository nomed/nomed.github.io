import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Agent systems landscape — Nomed",
  description: "A dated, non-binding assessment of Yukh and current agent runtimes, workspaces, orchestration systems and interoperability boundaries.",
};

const candidates = [
  ["Yukh MCP", "Keep semantics; qualify composition", "Cross-runtime capability policy and evidence", "Duplicating every runtime's native approval path"],
  ["Yukh Coordination", "Keep kernel; integrate surfaces", "Claims, conflict, handoff, attribution and replay", "An external protocol proves equivalent semantics with less custom code"],
  ["Yukh Projects", "Narrow", "First accepted-state adapter for GitHub Projects", "Treating GitHub Projects itself as a universal Yukh layer"],
  ["Apache Maka", "Evaluate deeply", "Durable AgentRun and execution evidence", "Authority model cannot compose or required records leak private reasoning"],
  ["goose", "Reference-host qualification candidate", "Vendor-neutral host; MCP + ACP; composable agent-loop direction", "Requires internal patching or makes Yukh goose-specific"],
  ["Hermes Agent", "Reference-host qualification candidate", "Provider-neutral persistent agent host; memory, skills, subagents, MCP and multiple execution backends", "Hermes memory or host abstractions become required Yukh semantics"],
  ["OpenHuman", "Orchestration + durable-memory challenger", "Checkpointed graphs, durable workflows, approvals, agent fleets and persistent memory", "Broad platform coupling, unstable local-first boundary or orchestration becomes authoritative"],
  ["OpenHands", "Evaluate as execution provider", "Sandboxed and remote execution infrastructure", "Must adopt the whole platform just to obtain isolation"],
  ["Buzz", "Evaluate as workspace adapter", "Human-agent rooms, attribution and signed event experience", "Its event substrate changes Yukh authority or handoff semantics"],
];

const semantics = [
  ["Participant identity / attribution", "Yes", "Buzz identities, runtime principals, IdP adapters"],
  ["Claim / conflict / handoff", "Yes", "Yukh Coordination; external transport/workspace adapters"],
  ["Capability policy / decision", "Yes", "Yukh MCP composed with runtime-native permissions"],
  ["Agent host / loop", "No", "goose, Hermes, Maka, OpenHands, Codex, Claude Code"],
  ["Sandbox execution", "No", "OpenHands, Hermes execution backends and runtime-native sandboxes; Maka isolation requires qualification"],
  ["Durable AgentRun facts", "Probably", "Maka first; OpenHuman checkpointed graphs as a challenger"],
  ["Durable orchestration / workflow", "Probably not core", "OpenHuman/tinyagents/tinyflows and other workflow engines"],
  ["Persistent agent memory", "No, except evidence/retention contracts", "Hermes, OpenHuman and external memory stores"],
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
      <p>The working hypothesis is that Yukh should own only the governance and interoperability semantics that must survive a change of model, runtime, workspace or vendor. Agent hosts, loops, sandboxes, workflow engines, memory systems and human interfaces should be reused when an external implementation preserves those semantics better than custom code.</p>

      <h2>How to read the assessment</h2>
      <p>Postures are qualification priorities, not product rankings. Claims are based on public material observed on the date above; roadmap capabilities are treated as hypotheses until available through a released or otherwise testable public seam.</p>

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
        <li><strong>Yukh never builds an agent host.</strong> goose and Hermes are the first host candidates to qualify; Maka remains the strongest initial durable-execution challenger.</li>
        <li><strong>Durable orchestration and memory remain external machinery.</strong> OpenHuman tests whether checkpointed graphs, workflows, approvals and memory can be consumed without making a broad personal-AI platform authoritative.</li>
        <li><strong>Buzz becomes a collaborative surface.</strong> Yukh Coordination can remain the semantic kernel while Buzz, Matrix or another workspace carries human-agent interaction.</li>
        <li><strong>OpenHands supplies execution isolation.</strong> Yukh policy can authorize a bounded operation while an external sandbox performs it and returns evidence.</li>
        <li><strong>A Yukh repository can disappear.</strong> Prior investment is not a reason to preserve a component that an external project makes redundant.</li>
      </ul>

      <h2>Qualification tracks</h2>
      <ol>
        <li><strong>Agent host:</strong> compare goose and Hermes against the same Yukh participant, capability and evidence seam.</li>
        <li><strong>Durable execution:</strong> map Maka AgentRun semantics and compare them with checkpointed execution from OpenHuman.</li>
        <li><strong>Orchestration + memory:</strong> test OpenHuman as an external workflow/memory system without granting it Yukh authority.</li>
        <li><strong>Workspace:</strong> map Buzz rooms and identities onto Yukh Coordination without semantic loss.</li>
        <li><strong>Execution isolation:</strong> execute one bounded Yukh capability through OpenHands and return correlated evidence.</li>
        <li><strong>Accepted state:</strong> re-evaluate yukh-projects as the GitHub adapter for an abstract accepted-work-state contract.</li>
      </ol>

      <p>The full evidence, comparison matrices, upside and disqualifying conditions live in the dated research record governed by issue #56.</p>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/editorial/YUKH-AGENT-LANDSCAPE-2026-08-24.md">Read the landscape record <ArrowIcon direction="external" /></a>
    </EditorialPage>
  );
}
