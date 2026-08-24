import type { Metadata } from "next";
import { EditorialPage } from "../components/EditorialPage";
import { ArrowIcon } from "../components/Navigation";

export const metadata: Metadata = {
  title: "Control plane concept — Nomed",
  description: "A superseded Yukh control-plane exploration retained for route continuity, not a current architecture or runtime surface.",
};

export default function ControlPlaneConceptPage() {
  return (
    <EditorialPage
      index="Archive"
      label="Superseded concept"
      title="The control plane is not an accepted Yukh component."
      lede="This route previously showed a manager/worker operator-console mock. Current Yukh work no longer assumes a Yukh-owned agent manager, runtime host or orchestration control plane."
      accent="#FF3B30"
    >
      <p><strong>This page is retained only for route continuity.</strong> The earlier mock encoded assumptions about managers, worker creation, runtime ownership and orchestration that are now explicitly under qualification. It must not be read as product status, accepted architecture or a planned Yukh runtime.</p>

      <h2>What replaced the assumption</h2>
      <ul>
        <li><strong>Agent hosts are replaceable.</strong> goose and Hermes are the current Track A qualification candidates; both passed only the runtime-substrate gate.</li>
        <li><strong>Host composition must be proven.</strong> Gate A2 requires Yukh policy and host-native policy to remain independently observable and compose without weakening either side.</li>
        <li><strong>Orchestration is a separate concern.</strong> OpenHuman is being evaluated as external workflow/orchestration machinery rather than as a Yukh control plane.</li>
        <li><strong>Memory is separate again.</strong> TencentDB Agent Memory is the Track C2 shared-memory candidate; memory cannot become authority, accepted state or evidence truth.</li>
        <li><strong>Coordination remains semantic.</strong> Claims, conflict, handoff, attribution and replay do not imply that Yukh owns the UI, agent loop or process manager.</li>
      </ul>

      <h2>Current authority</h2>
      <p>RFC-0003 remains the accepted reference architecture until superseded by a later RFC. Qualification records may challenge implementations and topology assumptions, but they do not silently rewrite accepted authority boundaries.</p>

      <a className="editorial-cta internal-cta" href="/system/">Read the current Yukh system <ArrowIcon /></a>
      <a className="editorial-cta internal-cta" href="/landscape/">See the active qualification landscape <ArrowIcon /></a>
      <a className="editorial-cta internal-cta" href="https://github.com/nomed/nomed.github.io/issues/58">Track A host qualification <ArrowIcon direction="external" /></a>
    </EditorialPage>
  );
}
