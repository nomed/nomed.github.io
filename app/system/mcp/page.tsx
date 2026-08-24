import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh MCP — Nomed",
  description: "The current Yukh capability-policy and evidence boundary implementation.",
};

export default function YukhMcpPage() {
  return (
    <SystemDeepDive
      component="mcp"
      index="03.1"
      label="Yukh system / Capability"
      title="Capability without custody."
      lede="Yukh MCP is the current implementation of the capability-policy and evidence boundary. Track A is testing whether that semantic contract can compose with host-native permissions without duplicating, bypassing or replacing them."
      accent="#7C3AED"
      status="foundation implementation. Durable audit/profile work remains incomplete, and no external host has passed the Yukh-specific host-composition gate. goose and Hermes passed only the earlier runtime-substrate gate."
      problem={<p>Agents need to inspect and change real systems, but direct credential access collapses intent, policy, host permissions, execution and audit into one opaque step.</p>}
      responsibility={<p>Represent explicit capability decisions, minimum scope and operational evidence so execution authority remains legible across replaceable hosts and runtimes.</p>}
      boundary={<p>MCP may participate in authorizing and evidencing a bounded capability. It must not become a second hidden approval engine beside the agent host, decide portfolio priority, own accepted work state or infer coordination authority from messages.</p>}
      contracts={[
        { name: "Intent", description: "a typed declaration of the requested outcome and target." },
        { name: "Policy decision", description: "an explicit Yukh allow, deny or approval requirement with reasons and scope." },
        { name: "Capability grant", description: "the minimum Yukh authority, scope and lifetime needed for the operation." },
        { name: "Evidence", description: "portable operational facts correlated to participant, work, capability and runtime identifiers." },
      ]}
      interactions={<p>Coordination carries claims and handoffs. Accepted-state implementations retain reviewed delivery state. The current Track A Gate A2 requires Yukh decisions and host-native decisions to remain independently observable, with the effective result no broader than either policy allows.</p>}
      direction={<p>Execute Gate A2 against goose and Hermes through supported public seams, prove two-sided Yukh/host policy composition, then continue restart/recovery and adapter-cost qualification. A host is not selected merely because its upstream permission tests pass.</p>}
      documentation="https://nomed.github.io/yukh-mcp/"
      documentationName="Yukh MCP documentation"
      repository="https://github.com/nomed/yukh-mcp"
      repositoryName="Yukh MCP"
    />
  );
}
