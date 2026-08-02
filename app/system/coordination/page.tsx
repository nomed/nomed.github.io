import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh Coordination — Nomed",
  description: "The cross-session coordination boundary of the Yukh system.",
};

export default function YukhCoordinationPage() {
  return (
    <SystemDeepDive
      index="03.3"
      label="Yukh system / Coordination"
      title="A shared room for work that happens in separate minds."
      lede="Sessions are isolated. Delivery is not. Coordination provides a neutral channel for ownership, questions, evidence, review and explicit handoff."
      accent="#93B800"
      status="research and design. The interaction model is a proposal, not a released protocol."
      problem={<p>Parallel agents and people cannot see one another's transient context. Silence becomes ambiguous, work is duplicated and handoffs decay into inference.</p>}
      responsibility={<p>Make cross-session activity legible through open presence, bounded claims, typed signals, evidence references and explicit transfer of work.</p>}
      boundary={<p>Coordination transports and records signals. It does not grant capability, accept project mutations, supervise participants or convert message delivery into authority.</p>}
      contracts={[
        { name: "Presence", description: "who is active, idle, blocked or gone." },
        { name: "Claims", description: "which bounded outcome a participant currently owns." },
        { name: "Signals", description: "progress, question, answer, review request and verdict." },
        { name: "Evidence", description: "immutable references to commits, runs, fixtures and decisions." },
        { name: "Handoffs", description: "explicit transfer without guessing from silence or elapsed time." },
      ]}
      interactions={<p>Projects supplies durable delivery context. MCP supplies governed capabilities and execution evidence. Coordination connects participants to those systems without becoming either one.</p>}
      direction={<p>Validate the minimum protocol across isolated sessions and model providers, then prove that claims and handoffs reduce duplicated work without introducing a central supervisor.</p>}
      repository="https://github.com/nomed/yukh-coordination"
    />
  );
}
