import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "The Yukh System — Nomed",
  description: "Three bounded responsibilities connected by explicit contracts.",
};

const components = [
  ["03.1", "Yukh MCP", "Governed capabilities", "/system/mcp/"],
  ["03.2", "Yukh Projects", "Durable project state", "/system/projects/"],
  ["03.3", "Yukh Coordination", "Cross-session coordination", "/system/coordination/"],
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
      <ul>
        {components.map(([index, name, responsibility, href]) => (
          <li key={name}><a className="text-link" href={href}><strong>{index} / {name}</strong> — {responsibility} <ArrowIcon /></a></li>
        ))}
      </ul>
      <a className="editorial-cta internal-cta" href="/work/">Inspect current maturity and work <ArrowIcon /></a>
    </EditorialPage>
  );
}
