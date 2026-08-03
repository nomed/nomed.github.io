import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh Coordination — Nomed",
  description: "The cross-session coordination boundary of the Yukh system.",
};

export default function YukhCoordinationPage() {
  return (
    <SystemDeepDive
      component="coordination"
      index="03.3"
      label="Yukh system / Coordination"
      title="A shared room for work that happens in separate minds."
      lede="Sessions are isolated. Delivery is not. Coordination provides a neutral channel for ownership, questions, evidence, review and explicit handoff."
      accent="#93B800"
      status="foundation and reference implementation. The protocol and qualified internal relay layers exist, but there is no supported public process binary and the project is not production-ready."
      problem={<p>Parallel agents and people cannot see one another&apos;s transient context. Silence becomes ambiguous, work is duplicated and handoffs decay into inference.</p>}
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
      direction={<p>Complete a secure provider profile and the end-to-end multi-session proof before exposing a supported public process. Protocol conformance remains independent from deployment readiness.</p>}
      documentation="https://github.com/nomed/yukh-coordination/blob/main/PROTOCOL.md"
      documentationName="Yukh Coordination protocol"
      repository="https://github.com/nomed/yukh-coordination"
      repositoryName="Yukh Coordination"
    />
  );
}
