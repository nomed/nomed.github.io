import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EditorialPage } from "../components/EditorialPage";

export const metadata: Metadata = {
  title: "Identity system — Nomed",
  description: "The Nomed and Yukh family identity, colors and usage boundaries.",
};

const marks = [
  ["Nomed", "Voice / point of view", "#FF3B30", "/brand/nomed.svg", "Canonical"],
  ["Yukh MCP", "Capability gateway", "#7C3AED", "/brand/yukh-mcp.svg", "Canonical"],
  ["Yukh Projects", "Control plane", "#00E5FF", "/brand/yukh-projects.svg", "Proposed"],
  ["Yukh Coordination", "Coordination protocol", "#CCFF00", "/brand/yukh-coordination.svg", "Proposed"],
];

export default function BrandPage() {
  return (
    <EditorialPage
      index="05"
      label="Identity"
      title="One geometry. Distinct responsibilities."
      lede="The family mark establishes provenance; color identifies the component. Maturity is stated separately and never implied by visual polish."
    >
      <div className="brand-grid">
        {marks.map(([name, role, color, mark, status]) => (
          <section className="brand-card" key={name} style={{ "--card-color": color } as CSSProperties}>
            <img src={mark} alt="" />
            <p>{status}</p>
            <h2>{name}</h2>
            <span>{role}</span>
            <code>{color}</code>
          </section>
        ))}
      </div>
      <h2>Usage rules</h2>
      <ul>
        <li>Preserve the geometry and white internal circles.</li>
        <li>Do not add gradients, shadows or decorative effects to the canonical mark.</li>
        <li>Use component color for recognition, not as a substitute for status or accessibility.</li>
        <li>Mark proposed identities explicitly until adopted in the owning repository.</li>
      </ul>
    </EditorialPage>
  );
}
