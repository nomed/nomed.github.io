import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const [sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(sourceDirArg && reportDirArg, "usage: node maka-public-recovery-preflight.mjs <maka-source-dir> <report-dir>");

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);
const revision = "8fd33df4bb26cadff93d38f3d824ae0760a4d01d";

const cli = await readFile(join(sourceDir, "packages/cli/src/run-command-core.ts"), "utf8");
const cliReadme = await readFile(join(sourceDir, "packages/cli/README.md"), "utf8");
const recovery = await readFile(join(sourceDir, "docs/architecture/runtime-resume-architecture.md"), "utf8");
const releaseSmoke = await readFile(join(sourceDir, "scripts/smoke-release-cli-package.mjs"), "utf8");
const repoReadme = await readFile(join(sourceDir, "README.md"), "utf8");

const facts = {
  public_resume_flag: cli.includes("'resume'") && cli.includes("resumeId") && cli.includes("--resume"),
  public_continue_flag: cli.includes("'continue'") && cli.includes("continueLatest"),
  public_graph_flag: cli.includes("'graph'") && cli.includes("graph?: true"),
  cli_documents_configured_model_required: cliReadme.includes("a configured model connection for agent turns"),
  cli_documents_interactive_provider_setup: cliReadme.includes("Select a provider, enter its API") && cliReadme.includes("/setup"),
  release_smoke_has_controlled_provider: releaseSmoke.includes("async function smokeControlledRun") && releaseSmoke.includes("async function startProvider"),
  controlled_provider_setup_imports_storage_authority:
    releaseSmoke.includes("node_modules/@maka/storage/dist/root-authority.js") &&
    releaseSmoke.includes("node_modules/@maka/storage/dist/runtime-policy-stores.js"),
  recovery_document_current: recovery.includes("document_status: current"),
  recovery_document_last_verified_2026_07_28: recovery.includes("last_verified: 2026-07-28"),
  recovery_phase_0_2_documented_implemented: recovery.includes("Phases 0–2 are implemented"),
  recovery_phase_3a_foundation_documented_implemented: recovery.includes("Phase 3A") && recovery.includes("Resolver are implemented"),
  production_reconciler_documented_future_work: recovery.includes("production Phase 3 reconciler") && recovery.includes("remain future work"),
  phase_4_documented_not_implemented: recovery.includes("Phase 4") && recovery.includes("not implemented"),
  readme_claims_crash_recovery: repoReadme.includes("crash recovery") && repoReadme.includes("optional resume of an interrupted turn"),
};

for (const [name, value] of Object.entries(facts)) {
  assert.equal(value, true, `expected pinned Maka fact missing: ${name}`);
}

const blockers = [
  {
    id: "deterministic-provider-bootstrap-public-seam",
    status: "NOT_PROVEN",
    reason:
      "The public CLI documentation requires a configured model and documents interactive /setup. The candidate's own deterministic release smoke configures its controlled provider by importing @maka/storage authority/runtime-policy modules; Track B may not use that private setup path to claim PASS.",
  },
  {
    id: "unknown-side-effect-production-reconciliation",
    status: "DOCUMENTED_GAP_REQUIRES_REVALIDATION",
    reason:
      "The recovery architecture present at the pinned revision is marked current but last verified 2026-07-28; it states that the production Phase 3 reconciler and complete host-owner lifecycle remain future work. Track B treats this as a documented gap, not proof that newer code lacks every reconciliation path. A PASS still requires executable public evidence at the pin.",
  },
  {
    id: "workspace-checkpoint-recovery",
    status: "DOCUMENTED_GAP_REQUIRES_REVALIDATION",
    reason:
      "The same pinned current document, last verified 2026-07-28, states Phase 4 Git checkpoints / isolated restore / durable rebaseline are not implemented. This prevents a general workspace-safe claim unless executable public evidence at the pin proves otherwise.",
  },
];

const report = {
  schema_version: 2,
  track: "B",
  gate: "maka-public-recovery-preflight",
  candidate: "apache/maka",
  revision,
  concern: "replaceable durable execution",
  facts,
  blockers,
  authority_boundary: {
    yukh_checkpoint_fields: ["participant_id", "work_uri", "capability_id", "evidence_run_id"],
    maka_runtime_events_are_yukh_authority: false,
    maka_session_or_graph_state_is_accepted_work_state: false,
  },
  result: "PARTIAL",
  result_reason:
    "Maka exposes real public resume/continue/graph surfaces and substantial durable recovery foundations. The frozen Yukh crash/recovery proof is not yet executable through a clean deterministic public setup path, and the pinned current recovery document identifies reconciliation/workspace gaps that must be revalidated by executable evidence rather than assumed away.",
  next_probe_allowed: false,
  next_probe_unblock_condition:
    "A supported public deterministic/non-interactive provider bootstrap and executable public evidence sufficient to test the T1-without-T2 recovery boundary without private storage/runtime-policy mutation.",
};

await mkdir(reportDir, { recursive: true });
const output = join(reportDir, "maka-public-recovery-preflight.json");
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(output);
