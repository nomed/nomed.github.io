import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Yukh Research — Nomed",
  description: "Vendor-neutral research into team-scale agentic engineering, delivery automation and project FinOps. Yukh itself is subject to reassessment.",
};

const tracks = [
  ["01", "Agent runtimes", "Codex, Claude Code, IDE, CLI, SDK, API, authentication and subscription constraints."],
  ["02", "Orchestration", "Parallel agent teams, durable workflows, checkpoints, retries and human approval."],
  ["03", "Delivery automation", "GitHub Issues, Jira, task dependencies, pull requests, CI and verification."],
  ["04", "Worker infrastructure", "Local workstations, VPS, containers, Kubernetes, identities and isolation."],
  ["05", "FinOps", "Attribution per developer, run, work item, project and customer cost center."],
  ["06", "Architecture alternatives", "Build versus integrate versus replace, including a complete Yukh refactor."],
];

export default function ResearchPage() {
  return (
    <EditorialPage
      index="06"
      label="Research"
      title="Investigate the system. Do not defend the implementation."
      lede="A clean-sheet investigation of team-scale agentic engineering, market trends and emerging GitHub projects. No Yukh component, principle or architecture is protected."
      accent="#CCFF00"
    >
      <p><strong>Started 24 October 2026 · Discovery / no architecture selected.</strong> A valid outcome is to refactor, replace or remove every existing Yukh implementation. Existing Yukh RFCs document the previous system; they are not design constraints for this research.</p>
      <h2>Research mission</h2>
      <p>Understand how humans and multiple AI agents deliver governed work across organizations, projects and repositories, with automated issue-to-PR chains, replaceable execution environments and attributable costs per commessa.</p>
      <h2>Tracks</h2>
      <table><thead><tr><th>Track</th><th>Question</th></tr></thead><tbody>
        {tracks.map(([id, name, description]) => <tr key={id}><td><strong>{id} / {name}</strong></td><td>{description}</td></tr>)}
      </tbody></table>
      <h2>Evidence before decisions</h2>
      <p>Each candidate requires source dates, deployment and licensing constraints, observable integration tests, security boundaries and disqualifiers. Product documentation is not an integration test; an estimate is not a billed cost; a passed unit test is not production qualification.</p>
      <h2>Living records</h2>
      <p>The canonical research files live in this repository. This page is the public entry point; detailed evidence and decisions remain versioned in Git.</p>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/research/README.md">Research charter <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/research/BACKLOG.md">Research backlog <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/research/GITHUB-WATCH.md">GitHub trends and candidate radar <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/blob/main/docs/research/EVIDENCE.md">Evidence ledger <ArrowIcon direction="external" /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/issues/56">Existing architecture review / #56 <ArrowIcon direction="external" /></a>
    </EditorialPage>
  );
}
