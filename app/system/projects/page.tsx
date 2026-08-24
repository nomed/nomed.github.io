import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh Projects — Nomed",
  description: "The current GitHub Projects implementation of Yukh accepted delivery state.",
};

export default function YukhProjectsPage() {
  return (
    <SystemDeepDive
      component="projects"
      index="03.2"
      label="Yukh system / Accepted state"
      title="Accepted state without session custody."
      lede="RFC-0003 assigns accepted delivery state to Projects. The current yukh-projects repository implements that responsibility for GitHub Projects; its broader role is under architecture review rather than assumed universal."
      accent="#00B8CC"
      status="published and synthetically qualified. The GitHub Projects implementation includes a controlled-apply profile, but publication and synthetic convergence do not constitute a live apply qualification or make GitHub Projects a universal Yukh dependency."
      problem={<p>When accepted delivery state lives only inside chats, local notes or one agent&apos;s memory, parallel participants cannot reliably distinguish proposals from reviewed outcomes.</p>}
      responsibility={<p>Today, reconcile declared accepted state with GitHub Projects through deterministic plans, bounded mutations and verifiable postconditions. The stable cross-suite concern is accepted work state; GitHub Projects is the current adapter target.</p>}
      boundary={<p>Under RFC-0003, Projects retains accepted portfolio and delivery state. It does not coordinate live participants, grant execution authority or turn a message into an accepted mutation. Architecture qualification may later move the stable contract behind multiple adapters only through an explicit superseding decision.</p>}
      contracts={[
        { name: "Desired state", description: "consumer-neutral declarations of the accepted project structure and policy." },
        { name: "Plan", description: "the deterministic difference between declared and observed GitHub Projects state." },
        { name: "Apply result", description: "bounded mutations with stable identifiers and diagnostics." },
        { name: "Postconditions", description: "evidence that observed state now satisfies the accepted declaration." },
      ]}
      interactions={<p>Coordination carries who is acting, reviewing or handing work over. MCP may expose reconciliation as a governed capability. yukh-projects currently persists accepted delivery state in GitHub Projects without making the tracker itself a universal Yukh semantic.</p>}
      direction={<p>Keep the GitHub adapter useful and qualified while the suite review tests whether accepted work state should become an explicit abstract contract with additional adapters. Any authority/topology change requires a later RFC; this page does not make that change.</p>}
      documentation="https://github.com/nomed/yukh-projects#architecture-and-migration"
      documentationName="Yukh Projects documentation"
      repository="https://github.com/nomed/yukh-projects"
      repositoryName="Yukh Projects"
    />
  );
}
