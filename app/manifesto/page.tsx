import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";

export const metadata: Metadata = {
  title: "Manifesto — Nomed",
  description: "A position on capability, custody, evidence and open agentic systems.",
};

export default function ManifestoPage() {
  return (
    <EditorialPage
      index="01"
      label="Manifesto"
      title="Agency without accountability is only automation with better marketing."
      lede="The challenge is not to make agents look autonomous. It is to build systems in which their authority is explicit, bounded and reviewable."
    >
      <h2>Capability, not custody.</h2>
      <p>Give an agent the smallest typed capability needed for the task. Keep credentials, policy and durable authority outside its custody.</p>
      <h2>Plans before mutations.</h2>
      <p>Intent should become a legible plan before it becomes an external effect. People and peer agents need a stable object they can question, approve or reject.</p>
      <h2>Evidence, not declarations.</h2>
      <p>A successful tool call is not proof of a successful outcome. Verification and structured evidence belong inside the execution lifecycle.</p>
      <h2>Observable coordination.</h2>
      <p>Agent sessions need shared rooms, durable questions, visible ownership and explicit handoffs—the social guarantees that made open-source communities effective.</p>
      <blockquote>We are not trying to remove people from software. We are designing a better public contract between people, agents and the systems they change.</blockquote>
    </EditorialPage>
  );
}
