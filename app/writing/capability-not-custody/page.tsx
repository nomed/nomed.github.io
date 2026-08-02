import type { Metadata } from "next";
import { EditorialPage } from "../../components/EditorialPage";

export const metadata: Metadata = {
  title: "Capability, not custody — Nomed",
  description: "Why useful agents need bounded capabilities rather than possession of credentials and systems.",
};

export default function CapabilityArticle() {
  return (
    <EditorialPage
      index="04"
      label="Field note · 01"
      title="Capability, not custody."
      lede="An agent becomes useful when it can act. It becomes dangerous when acting requires us to hand it the identity, credentials and durable authority of the operator."
    >
      <p className="byline">Daniele Favara / Nomed · August 2026</p>
      <h2>The false choice</h2>
      <p>Most agent integrations offer two unsatisfying modes: a model that can only suggest, or a model wrapped around credentials powerful enough to operate an entire account. That is not autonomy. It is authority without a boundary.</p>
      <h2>A capability is a contract</h2>
      <p>A useful capability says what operation is available, over which resources, under which policy, for how long and with what evidence. The agent can request it without possessing the underlying credential or inventing a new path to the system.</p>
      <h2>Execution is a lifecycle</h2>
      <p>Intent becomes a typed request. Policy determines whether it is admissible. Planning freezes the proposed effects. Approval authorizes the plan rather than an open-ended session. Execution is followed by observation, verification and a durable audit record.</p>
      <h2>The larger consequence</h2>
      <p>When capability is separated from custody, agents can become more powerful without making trust binary. That is the architectural condition for genuine multi-agent teams: authority can be composed, reviewed and revoked.</p>
      <blockquote>The future is not agents with all our passwords. It is systems capable of granting narrow authority with public reasons.</blockquote>
    </EditorialPage>
  );
}
