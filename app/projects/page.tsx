import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EditorialPage } from "../components/EditorialPage";

export const metadata: Metadata = {
  title: "Projects — Nomed",
  description: "The Yukh family of open infrastructure for governed agentic development.",
};

const projects = [
  {
    slug: "yukh-mcp",
    name: "Yukh MCP",
    color: "#7C3AED",
    mark: "/brand/yukh-mcp.svg",
    status: "Foundation",
    description: "A policy-governed capability gateway with a strict intent-to-evidence lifecycle.",
    truth: "Public contracts and security boundaries are being designed before operational capabilities are implemented.",
    href: "https://github.com/nomed/yukh-mcp",
  },
  {
    slug: "yukh-projects",
    name: "Yukh Projects",
    color: "#00E5FF",
    mark: "/brand/yukh-projects.svg",
    status: "Foundation bootstrap",
    description: "Declarative, secure and consumer-neutral reconciliation for GitHub Projects.",
    truth: "The repository is not production-ready; functional code enters through reviewed clean-room migration.",
    href: "https://github.com/nomed/yukh-projects",
  },
  {
    slug: "yukh-coordination",
    name: "Yukh Coordination",
    color: "#CCFF00",
    mark: "/brand/yukh-coordination.svg",
    status: "Research / design",
    description: "An open coordination protocol for people and agents working across isolated sessions.",
    truth: "This is a thesis and protocol direction, not yet a released product or accepted standard.",
    href: "/coordination",
  },
];

export default function ProjectsPage() {
  return (
    <EditorialPage
      index="02"
      label="Projects"
      title="One thesis. Several bounded instruments."
      lede="Yukh is a family of open components, not a platform that asks to own the whole workflow. Each project has a narrow authority boundary and reports its real maturity."
    >
      <div className="project-cards">
        {projects.map((project) => (
          <section
            className="project-card"
            id={project.slug}
            key={project.slug}
            style={{ "--card-color": project.color } as CSSProperties}
          >
            <img src={project.mark} alt="" />
            <p className="card-status">{project.status}</p>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p className="project-truth">{project.truth}</p>
            <a href={project.href}>Inspect the work ↗</a>
          </section>
        ))}
      </div>
    </EditorialPage>
  );
}
