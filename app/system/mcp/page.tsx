import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh MCP — Nomed",
  description: "The governed capability boundary of the Yukh system.",
};

export default function YukhMcpPage() {
  return (
    <SystemDeepDive
      component="mcp"
      index="03.1"
      label="Yukh system / MCP"
      title="Capability without custody."
      lede="Yukh MCP turns agent intent into bounded execution and verifiable evidence without distributing unrestricted credentials or invisible authority."
      accent="#7C3AED"
      status="foundation. Public contracts and security boundaries precede operational capabilities."
      problem={<p>Agents need to inspect and change real systems, but direct credential access collapses intent, policy, execution and audit into one opaque step.</p>}
      responsibility={<p>Expose typed capabilities through an explicit intent-to-evidence lifecycle: describe the proposed action, evaluate policy, execute within a bounded grant and return durable proof of the outcome.</p>}
      boundary={<p>MCP may validate and execute an authorized capability. It does not decide portfolio priority, own project state or infer coordination authority from messages.</p>}
      contracts={[
        { name: "Intent", description: "a typed declaration of the requested outcome and target." },
        { name: "Policy decision", description: "an explicit allow, deny or approval requirement with reasons." },
        { name: "Capability grant", description: "the minimum authority, scope and lifetime needed for execution." },
        { name: "Evidence", description: "immutable references that show what happened and under which decision." },
      ]}
      interactions={<p>Coordination carries claims and signals to the right participants. Projects provides durable delivery context. MCP alone crosses the execution boundary and returns evidence for both.</p>}
      direction={<p>Stabilize the capability envelope, policy decision model and evidence contract before adding provider-specific operations.</p>}
      documentation="https://nomed.github.io/yukh-mcp/"
      documentationName="Yukh MCP documentation"
      repository="https://github.com/nomed/yukh-mcp"
      repositoryName="Yukh MCP"
    />
  );
}
