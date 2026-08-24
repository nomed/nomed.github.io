import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon, RepositoryLink } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Work — Nomed",
  description: "Current Yukh implementation maturity and active cross-suite qualification work.",
};

const work = [
  {
    slug: "yukh-mcp",
    name: "Yukh MCP",
    color: "#7C3AED",
    mark: "/brand/yukh-mcp.svg",
    status: "Foundation / current capability-policy implementation",
    focus: "Preserve the capability decision and evidence boundary while proving that Yukh policy composes with host-native security instead of duplicating or bypassing it. Durable production readiness remains unproven.",
    system: "/system/mcp/",
    repository: "https://github.com/nomed/yukh-mcp",
  },
  {
    slug: "yukh-projects",
    name: "Yukh Projects",
    color: "#00E5FF",
    mark: "/brand/yukh-projects.svg",
    status: "Published / synthetically qualified GitHub adapter",
    focus: "Keep the proven GitHub Projects implementation useful while re-evaluating its architectural role as an adapter for abstract accepted work state. Publication and synthetic qualification do not imply a live apply qualification.",
    system: "/system/projects/",
    repository: "https://github.com/nomed/yukh-projects",
  },
  {
    slug: "yukh-coordination",
    name: "Yukh Coordination",
    color: "#CCFF00",
    mark: "/brand/yukh-coordination.svg",
    status: "Preparation evidence complete / current coordination kernel",
    focus: "Preserve claims, conflict, handoff, attribution and replay semantics while allowing transports, workspaces and human interaction surfaces to remain replaceable. Public/live runtime qualification remains unproven.",
    system: "/system/coordination/",
    repository: "https://github.com/nomed/yukh-coordination",
  },
];

const qualifications = [
  ["Track A / Agent host", "goose + Hermes", "Runtime-substrate PASS for both. A2 Yukh/host two-sided policy composition is defined and awaits executable candidate adapters.", "https://github.com/nomed/nomed.github.io/issues/58"],
  ["Shared memory / Track C2", "TencentDB Agent Memory", "Qualify team memory as contextual machinery that cannot become Yukh authority, accepted state or evidence truth.", "https://github.com/nomed/nomed.github.io/issues/63"],
  ["Durable execution", "Apache Maka", "Qualify durable AgentRun and execution/evidence facts without importing private reasoning or runtime authority.", "https://github.com/nomed/nomed.github.io/issues/56"],
  ["Orchestration", "OpenHuman", "Evaluate checkpointed workflows and approvals as replaceable machinery, independently from shared memory.", "https://github.com/nomed/nomed.github.io/issues/56"],
  ["Execution isolation", "OpenHands", "Test whether bounded Yukh capabilities can execute through an external sandbox and return correlated evidence.", "https://github.com/nomed/nomed.github.io/issues/56"],
  ["Workspace", "Buzz", "Evaluate human-agent collaboration as a replaceable surface over Yukh coordination semantics.", "https://github.com/nomed/nomed.github.io/issues/56"],
];

export default function WorkPage() {
  return (
    <EditorialPage
      index="04"
      label="Work"
      title="Implementations and qualifications."
      lede="Some Yukh work lives in current repositories; some is now evidence-driven qualification of external machinery. This page separates the two so research candidates are never mistaken for adopted components."
    >
      <h2>Current Yukh implementations</h2>
      <div className="project-cards work-cards">
        {work.map((item) => (
          <section className="project-card" id={item.slug} key={item.slug} style={{ "--card-color": item.color } as CSSProperties}>
            <span className="mark-keyline project-mark"><img src={item.mark} alt={`${item.name} mark`} /></span>
            <p className="card-status">{item.status}</p>
            <h2>{item.name}</h2>
            <p className="work-focus"><strong>Current direction</strong>{item.focus}</p>
            <Link className="internal-detail-link" href={item.system}>Understand the responsibility <ArrowIcon /></Link>
            <RepositoryLink href={item.repository} name={item.name} compact />
          </section>
        ))}
      </div>

      <h2>Active qualification work</h2>
      <p>These are investigations, not additions to the Yukh suite. A candidate may pass, fail, remain optional, or prove that Yukh should own less code.</p>
      <table>
        <thead><tr><th>Concern</th><th>Candidate(s)</th><th>Current evidence / next gate</th><th>Governing record</th></tr></thead>
        <tbody>
          {qualifications.map(([concern, candidates, state, issue]) => (
            <tr key={concern}>
              <td><strong>{concern}</strong></td>
              <td>{candidates}</td>
              <td>{state}</td>
              <td><a href={issue} target="_blank" rel="noreferrer">Issue <ArrowIcon direction="external" /></a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </EditorialPage>
  );
}
