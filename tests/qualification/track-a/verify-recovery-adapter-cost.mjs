import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [reportPath] = process.argv.slice(2);
assert.ok(reportPath, "usage: node verify-recovery-adapter-cost.mjs <report.json>");
const report = JSON.parse(await readFile(reportPath, "utf8"));

assert.equal(report.track, "A");
assert.equal(report.gate, "restart-recovery-adapter-cost");
assert.ok(["goose", "hermes"].includes(report.candidate));
assert.equal(report.results.initial_execution, "PASS");
assert.ok(["PASS", "PARTIAL", "FAIL", "NOT_AVAILABLE"].includes(report.results.native_session_restore));
assert.equal(report.results.yukh_checkpoint_rebind, "PASS");
assert.equal(report.results.stable_participant_work_correlation, "PASS");
assert.equal(report.results.memory_non_authority, "PASS");
assert.equal(report.results.neutral_recovery_evidence, "PASS");
assert.equal(report.results.provider_local_recovery_controls, "PASS");
assert.equal(report.results.dependency_bootstrap_excluded_from_controls, "PASS");
assert.equal(report.adapter_surface.public_protocol, "ACP stdio only");
assert.equal(report.adapter_surface.candidate_specific_api_calls_required, false);
assert.ok(report.adapter_surface.candidate_specific_config_key_count > 0);
assert.equal(report.operational_friction.external_provider_dependency_in_measured_controls, false);
assert.equal(report.operational_friction.dependency_bootstrap_in_measured_controls, false);
assert.equal(report.support_gate_pass, true);
assert.notEqual(report.sessions.initial.session_id, report.sessions.checkpoint_rebind.session_id);
assert.ok(report.checkpoint.participant_id);
assert.ok(report.checkpoint.work_uri);
assert.ok(report.checkpoint.capability_id);
assert.ok(report.checkpoint.evidence_run_id);

console.log(`verified ${report.candidate} recovery/adapter-cost gate; native restore=${report.results.native_session_restore}`);
