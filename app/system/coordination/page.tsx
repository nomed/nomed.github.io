import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh Coordination — Nomed",
  description: "The current Yukh coordination-kernel implementation and its replaceable transport/workspace boundary.",
};

export default function YukhCoordinationPage() {
  return (
    <SystemDeepDive
      component="coordination"
      index="03.3"
      label="Yukh system / Coordination"
      title="Coordination without invisible orchestration."
      lede="Sessions, hosts and human workspaces are replaceable. Yukh Coordination is the current implementation of the claims, conflict, handoff, attribution and replay semantics that must remain visible across them."
      accent="#93B800"
      status="preparation evidence complete. Protocol, security-boundary and reproducible runtime preparation evidence exists, but there is no public/live runtime qualification and the project is not production-ready."
      problem={<p>Parallel agents and people cannot rely on one another&apos;s transient context. Without explicit coordination, silence becomes ambiguous, work is duplicated and handoff or authority is inferred from chat behavior.</p>}
      responsibility={<p>Make cross-session work legible through participant attribution, bounded claims, observable conflict, typed signals, evidence references and explicit handoff.</p>}
      boundary={<p>Coordination records and transports coordination facts. Messaging, acknowledgement, timeouts, workspace roles or coordinator recommendations never grant execution or accepted-state authority by themselves.</p>}
      contracts={[
        { name: "Presence", description: "which participant is active, idle, blocked or gone without making presence authoritative." },
        { name: "Claims", description: "which bounded work a participant currently claims, including observable concurrent conflict." },
        { name: "Signals", description: "progress, question, answer, review request and verdict as typed coordination events." },
        { name: "Evidence refs", description: "portable references to commits, runs, fixtures and decisions rather than private reasoning." },
        { name: "Handoffs", description: "explicit transfer with accepted boundaries instead of guessing from silence or elapsed time." },
      ]}
      interactions={<p>Accepted-state implementations provide reviewed delivery context. MCP supplies capability/evidence semantics. Buzz, Matrix, IDEs or other human-agent workspaces may become replaceable interaction surfaces, but they must not redefine Yukh claims, authority or handoff semantics.</p>}
      direction={<p>Keep the semantic kernel small while qualifying external workspace and transport surfaces. Publication/live runtime qualification remains separate from protocol correctness, and replacing UI or messaging machinery should not require changing Yukh-visible coordination contracts.</p>}
      documentation="https://github.com/nomed/yukh-coordination/blob/main/PROTOCOL.md"
      documentationName="Yukh Coordination protocol"
      repository="https://github.com/nomed/yukh-coordination"
      repositoryName="Yukh Coordination"
    />
  );
}
