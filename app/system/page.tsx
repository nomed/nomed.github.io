import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "The Yukh System — Nomed",
  description: "Three bounded responsibilities connected by explicit contracts.",
};

const components = [
  ["03.1", "MCP", "Governed capabilities", "/system/mcp/"],
  ["03.2", "Projects", "Durable project state", "/system/projects/"],
  ["03.3", "Coordination", "Cross-session coordination", "/system/coordination/"],
];

export default function SystemPage() {
  return (
    <EditorialPage
      index="03"
      label="System"
      title="Three boundaries. One governed flow."
      lede="Yukh separates execution authority, durable delivery state and live coordination so that no component quietly becomes the whole control plane."
      accent="#7C3AED"
    >
      <p>Intent moves through explicit contracts: coordination makes work visible, projects makes accepted state durable, and MCP crosses the execution boundary under policy. Evidence returns through the same system.</p>
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
      <a className="editorial-cta internal-cta" href="/work/">Inspect current maturity and work <ArrowIcon /></a>
    </EditorialPage>
  );
}
