import type { ReactNode } from "react";
import Link from "next/link";
import { EditorialPage } from "./EditorialPage";
import { ArrowIcon, RepositoryLink } from "./Navigation";

type Contract = {
  name: string;
  description: string;
};

type SystemDeepDiveProps = {
  component: "mcp" | "projects" | "coordination";
  index: string;
  label: string;
  title: string;
  lede: string;
  accent: string;
  status: string;
  problem: ReactNode;
  responsibility: ReactNode;
  boundary: ReactNode;
  contracts: Contract[];
  interactions: ReactNode;
  direction: ReactNode;
  repository: string;
  repositoryName: string;
};

const components = [
  { slug: "mcp", name: "Yukh MCP" },
  { slug: "projects", name: "Yukh Projects" },
  { slug: "coordination", name: "Yukh Coordination" },
] as const;

export function SystemDeepDive({
  component,
  index,
  label,
  title,
  lede,
  accent,
  status,
  problem,
  responsibility,
  boundary,
  contracts,
  interactions,
  direction,
  repository,
  repositoryName,
}: SystemDeepDiveProps) {
  const currentIndex = components.findIndex((item) => item.slug === component);
  const previous = components[(currentIndex + components.length - 1) % components.length];
  const next = components[(currentIndex + 1) % components.length];
  const mark = `/brand/yukh-${component}.svg`;

  return (
    <EditorialPage index={index} label={label} title={title} lede={lede} accent={accent} mark={mark} markAlt={`${repositoryName} mark`}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Nomed</Link>
        <ArrowIcon />
        <Link href="/system">Yukh system</Link>
        <ArrowIcon />
        <span aria-current="page">{repositoryName}</span>
      </nav>

      <p className="editorial-note"><strong>Status:</strong> {status}</p>

      <h2>The problem</h2>
      {problem}

      <h2>Responsibility</h2>
      {responsibility}

      <h2>Authority boundary</h2>
      {boundary}

      <h2>Public contracts</h2>
      <ul>
        {contracts.map((contract) => (
          <li key={contract.name}><strong>{contract.name}:</strong> {contract.description}</li>
        ))}
      </ul>

      <h2>How it interacts</h2>
      {interactions}

      <h2>Next direction</h2>
      {direction}

      <RepositoryLink href={repository} name={repositoryName} />

      <nav className="sibling-nav" aria-label="Yukh components">
        <Link href={`/system/${previous.slug}/`}>
          <ArrowIcon direction="left" />
          <span><small>Previous component</small>{previous.name}</span>
        </Link>
        <Link className="system-overview-link" href="/system/">Yukh system overview</Link>
        <Link className="sibling-next" href={`/system/${next.slug}/`}>
          <span><small>Next component</small>{next.name}</span>
          <ArrowIcon />
        </Link>
      </nav>
    </EditorialPage>
  );
}
