import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon, RepositoryLink } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Work — Nomed",
  description: "The current maturity, focus and canonical source of every Yukh component.",
};

const work = [
  {
    slug: "yukh-mcp",
    name: "Yukh MCP",
    color: "#7C3AED",
    mark: "/brand/yukh-mcp.svg",
    status: "Foundation",
    focus: "Stabilize the capability envelope, policy decision model and evidence contract before adding provider-specific operations.",
    system: "/system/mcp/",
    repository: "https://github.com/nomed/yukh-mcp",
  },
  {
    slug: "yukh-projects",
    name: "Yukh Projects",
    color: "#00E5FF",
    mark: "/brand/yukh-projects.svg",
    status: "Foundation bootstrap",
    focus: "Complete the clean-room foundation and prove deterministic, idempotent reconciliation against real GitHub Projects fixtures.",
    system: "/system/projects/",
    repository: "https://github.com/nomed/yukh-projects",
  },
  {
    slug: "yukh-coordination",
    name: "Yukh Coordination",
    color: "#CCFF00",
    mark: "/brand/yukh-coordination.svg",
    status: "Foundation / reference implementation",
    focus: "Complete a secure provider profile and multi-session proof before exposing a supported public process.",
    system: "/system/coordination/",
    repository: "https://github.com/nomed/yukh-coordination",
  },
];

export default function WorkPage() {
  return (
    <EditorialPage
      index="04"
      label="Work"
      title="What is real. What comes next."
      lede="Yukh is one system at different stages of formation. This page reports the current state of each component and points to its canonical technical source."
    >
      <div className="project-cards work-cards">
        {work.map((item) => (
          <section className="project-card" id={item.slug} key={item.slug} style={{ "--card-color": item.color } as CSSProperties}>
            <span className="mark-keyline project-mark"><img src={item.mark} alt={`${item.name} mark`} /></span>
            <p className="card-status">{item.status}</p>
            <h2>{item.name}</h2>
            <p className="work-focus"><strong>Current direction</strong>{item.focus}</p>
            <Link className="internal-detail-link" href={item.system}>Understand the component <ArrowIcon /></Link>
            <RepositoryLink href={item.repository} name={item.name} compact />
          </section>
        ))}
      </div>
    </EditorialPage>
  );
}
