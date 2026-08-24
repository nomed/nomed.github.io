import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "The Yukh System — Nomed",
  description: "The accepted Yukh reference architecture, stable semantic boundaries and replaceable implementation machinery.",
};

const components = [
  ["03.1", "MCP", "Current capability-policy and execution-boundary implementation", "/system/mcp/"],
  ["03.2", "Projects", "Current GitHub Projects adapter for accepted work state", "/system/projects/"],
  ["03.3", "Coordination", "Current coordination-kernel implementation", "/system/coordination/"],
];

const machinery = [
  ["Agent host", "goose and Hermes are qualification candidates; both passed only the runtime-substrate gate."],
  ["Durable execution", "Apache Maka is the first AgentRun / execution-evidence candidate."],
  ["Execution isolation", "OpenHands is being evaluated as an external sandbox/execution provider."],
  ["Orchestration", "OpenHuman is a workflow/orchestration challenger, not an accepted Yukh control plane."],
  ["Shared memory", "TencentDB Agent Memory is the Track C2 candidate; Hermes and OpenHuman memory are benchmarks."],
  ["Workspace", "Buzz and other human-agent surfaces may carry interaction without owning Yukh authority."],
];

export default function SystemPage() {
  return (
    <EditorialPage
      index="03"
      label="System"
      title="Own the boundaries. Replace the machinery."
      lede="RFC-0003 remains the accepted Yukh reference architecture. Current qualification work is testing how much implementation machinery can be external without changing the authority, coordination, evidence and accepted-state semantics that must survive replacement."
      accent="#7C3AED"
    >
      <p><strong>The architecture and the repositories are not the same thing.</strong> The accepted reference decomposition still separates capability authority, accepted delivery state and live coordination. Those boundaries remain authoritative until an RFC supersedes them; the current repositories are implementations of those responsibilities, not protected product pillars.</p>
      <p>The working architectural principle is now explicit: <strong>Yukh should own semantics only where they must survive replacement of the model, host, runtime, workspace or vendor.</strong> Hosts, sandboxes, workflow engines, memory systems and human interfaces are machinery to reuse when they preserve those boundaries.</p>

      <h2>Current Yukh implementations</h2>
      <ul className="system-index">
        {components.map(([index, name, responsibility, href]) => (
          <li key={name}>
            <a href={href}>
              <strong>{index} / {name}</strong>
              <span>{responsibility}</span>
              <ArrowIcon />
            </a>
          </li>
        ))}
      </ul>

      <h2>Replaceable machinery under qualification</h2>
      <table>
        <thead><tr><th>Concern</th><th>Current qualification posture</th></tr></thead>
        <tbody>
          {machinery.map(([concern, posture]) => (
            <tr key={concern}><td><strong>{concern}</strong></td><td>{posture}</td></tr>
          ))}
        </tbody>
      </table>

      <p><strong>No external candidate is adopted by this page.</strong> goose and Hermes have passed the first executable runtime-substrate gate, while the stricter Yukh host-composition Gate A2 is defined but not yet executed against candidate adapters. No reference host has been selected.</p>
      <a className="editorial-cta internal-cta" href="/landscape/">See the active qualification landscape <ArrowIcon /></a>
      <a className="editorial-cta internal-cta" href="/work/">Inspect implementation and qualification work <ArrowIcon /></a>
    </EditorialPage>
  );
}
