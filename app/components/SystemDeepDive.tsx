import type { ReactNode } from "react";
import { EditorialPage } from "./EditorialPage";

type Contract = {
  name: string;
  description: string;
};

type SystemDeepDiveProps = {
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
};

export function SystemDeepDive({
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
}: SystemDeepDiveProps) {
  return (
    <EditorialPage index={index} label={label} title={title} lede={lede} accent={accent}>
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

      <a className="editorial-cta" href={repository}>Inspect the canonical repository ↗</a>
    </EditorialPage>
  );
}
