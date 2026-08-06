import type { Metadata } from "next";
import { SystemDeepDive } from "../../components/SystemDeepDive";

export const metadata: Metadata = {
  title: "Yukh Projects — Nomed",
  description: "The durable project-state boundary of the Yukh system.",
};

export default function YukhProjectsPage() {
  return (
    <SystemDeepDive
      component="projects"
      index="03.2"
      label="Yukh system / Projects"
      title="Declared state. Deterministic reconciliation."
      lede="Yukh Projects makes portfolio and delivery state durable, reviewable and independent from any single agent, session or consumer."
      accent="#00B8CC"
      status="published and synthetically qualified. Yukh Projects v1.7.0 includes a controlled-apply profile, but no live qualification or apply has occurred."
      problem={<p>When planning state lives inside chats, local notes or tool-specific automation, parallel participants cannot reliably discover ownership, priority, dependencies or the accepted outcome.</p>}
      responsibility={<p>Reconcile declared project configuration with GitHub Projects through deterministic plans, bounded mutations and verifiable postconditions.</p>}
      boundary={<p>Projects owns declared portfolio and delivery state. It does not coordinate live participants, grant execution authority or treat a message as an accepted project mutation.</p>}
      contracts={[
        { name: "Desired state", description: "consumer-neutral declarations of project structure and policy." },
        { name: "Plan", description: "the deterministic difference between declared and observed state." },
        { name: "Apply result", description: "bounded mutations with stable identifiers and diagnostics." },
        { name: "Postconditions", description: "evidence that observed state now satisfies the declaration." },
      ]}
      interactions={<p>Coordination announces who is acting on a plan and carries review signals. MCP can expose reconciliation as a governed capability. Projects remains the durable source of delivery truth.</p>}
      direction={<p>Perform a separately authorized live qualification, then require a fresh exact approval for any live apply. Publication and synthetic convergence evidence do not authorize consumer migration or mutation.</p>}
      documentation="https://github.com/nomed/yukh-projects#architecture-and-migration"
      documentationName="Yukh Projects documentation"
      repository="https://github.com/nomed/yukh-projects"
      repositoryName="Yukh Projects"
    />
  );
}
