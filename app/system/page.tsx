import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "The Yukh System — Nomed",
  description: "The current Yukh reference decomposition and its explicit authority boundaries.",
};

const components = [
  ["03.1", "MCP", "Governed capabilities", "/system/mcp/"],
  ["03.2", "Projects", "Current GitHub Projects accepted-state implementation", "/system/projects/"],
  ["03.3", "Coordination", "Cross-session coordination", "/system/coordination/"],
];

export default function SystemPage() {
  return (
    <EditorialPage
      index="03"
      label="System"
      title="Boundaries first. Components can change."
      lede="The accepted Yukh reference architecture currently separates execution authority, accepted delivery state and live coordination. The boundaries matter more than preserving any particular repository or implementation."
      accent="#7C3AED"
    >
      <p>Intent moves through explicit contracts: coordination makes work visible, accepted-state adapters make reviewed delivery state durable, and MCP crosses the execution boundary under policy. Evidence returns through the same system.</p>
      <p>This is the <strong>current reference decomposition, not a promise that all three implementations survive unchanged</strong>. External runtimes and workspaces are being evaluated where they may replace custom machinery without weakening attribution, authority, replay or evidence.</p>
      <ul className="system-index">
        {components.map(([index, name, responsibility, href]) => (
          <li key={name}>
            <a href={href}>
              <strong>{index} / {name}</strong>
              <span>{responsibility}</span>
              <ArrowIcon />
            </a>
          </li>
        ))}
      </ul>
      <a className="editorial-cta internal-cta" href="/landscape/">See the active architecture challenge <ArrowIcon /></a>
      <a className="editorial-cta internal-cta" href="/work/">Inspect current maturity and work <ArrowIcon /></a>
    </EditorialPage>
  );
}
