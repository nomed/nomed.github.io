import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [reportPath] = process.argv.slice(2);
assert.ok(reportPath, "usage: node verify-maka-public-recovery-preflight.mjs <report.json>");
const report = JSON.parse(await readFile(reportPath, "utf8"));

assert.equal(report.schema_version, 2);
assert.equal(report.track, "B");
assert.equal(report.gate, "maka-public-recovery-preflight");
assert.equal(report.candidate, "apache/maka");
assert.equal(report.revision, "8fd33df4bb26cadff93d38f3d824ae0760a4d01d");
assert.equal(report.concern, "replaceable durable execution");

assert.equal(report.facts.public_resume_flag, true);
assert.equal(report.facts.public_continue_flag, true);
assert.equal(report.facts.public_graph_flag, true);
assert.equal(report.facts.recovery_document_current, true);
assert.equal(report.facts.recovery_document_last_verified_2026_07_28, true);
assert.equal(report.facts.recovery_phase_0_2_documented_implemented, true);
assert.equal(report.facts.recovery_phase_3a_foundation_documented_implemented, true);
assert.equal(report.facts.production_reconciler_documented_future_work, true);
assert.equal(report.facts.phase_4_documented_not_implemented, true);
assert.equal(report.facts.controlled_provider_setup_imports_storage_authority, true);

assert.deepEqual(report.authority_boundary.yukh_checkpoint_fields, [
  "participant_id",
  "work_uri",
  "capability_id",
  "evidence_run_id",
]);
assert.equal(report.authority_boundary.maka_runtime_events_are_yukh_authority, false);
assert.equal(report.authority_boundary.maka_session_or_graph_state_is_accepted_work_state, false);

assert.equal(report.result, "PARTIAL");
assert.equal(report.next_probe_allowed, false);
assert.ok(Array.isArray(report.blockers) && report.blockers.length >= 2);
const bootstrap = report.blockers.find((b) => b.id === "deterministic-provider-bootstrap-public-seam");
assert.equal(bootstrap?.status, "NOT_PROVEN");
const reconcile = report.blockers.find((b) => b.id === "unknown-side-effect-production-reconciliation");
assert.equal(reconcile?.status, "DOCUMENTED_GAP_REQUIRES_REVALIDATION");
const workspace = report.blockers.find((b) => b.id === "workspace-checkpoint-recovery");
assert.equal(workspace?.status, "DOCUMENTED_GAP_REQUIRES_REVALIDATION");

console.log("verified Track B Maka public recovery preflight: PARTIAL (fail-closed, no stale-state overclaim)");
