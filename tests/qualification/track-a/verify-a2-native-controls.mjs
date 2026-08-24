import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [reportPath] = process.argv.slice(2);
assert.ok(reportPath, "usage: node verify-a2-native-controls.mjs <report.json>");
const report = JSON.parse(await readFile(reportPath, "utf8"));

assert.equal(report.track, "A");
assert.equal(report.qualification_level, "host-composition-native-controls");
assert.ok(["goose", "hermes"].includes(report.candidate));
assert.equal(report.authority_claims.adapter_decision_made, false);
assert.equal(report.authority_claims.native_safety_disabled, false);
assert.equal(report.authority_claims.private_reasoning_required, false);
assert.equal(report.authority_claims.deterministic_provider_is_permission_authority, false);
assert.equal(report.dimensions.positive_allow_allow, "PASS");
assert.equal(report.dimensions.observed_host_allow_control, "PASS");
assert.equal(report.dimensions.yukh_deny_host_allow_composition, "PASS");
assert.equal(report.dimensions.observed_host_deny_control, "PASS");
assert.equal(report.dimensions.yukh_allow_host_deny_composition, "PASS");
assert.equal(report.dimensions.neutral_a2_evidence_export, "PASS");
assert.equal(report.controls.positive_allow_allow.host_native_decision, "ALLOW");
assert.equal(report.controls.positive_allow_allow.effective_decision, "ALLOW");
assert.equal(report.controls.yukh_deny_host_allow.host_native_decision, "ALLOW");
assert.equal(report.controls.yukh_deny_host_allow.effective_decision, "DENY");
assert.equal(report.controls.yukh_deny_host_allow.enforcement_source, "yukh");
assert.equal(report.controls.yukh_allow_host_deny.host_native_decision, "DENY");
assert.equal(report.controls.yukh_allow_host_deny.effective_decision, "DENY");
assert.equal(report.controls.yukh_allow_host_deny.enforcement_source, "host");
assert.equal(report.controls.yukh_allow_host_deny.host_denied_content_leaked, false);
assert.equal(report.controls.yukh_deny_host_allow.composed_candidate_output_contains_forbidden_bytes, false);
assert.ok(report.controls.positive_allow_allow.candidate_native_refs.length > 0);
assert.ok(report.controls.forbidden_host_only_control.candidate_native_refs.length > 0);
assert.ok(report.controls.yukh_allow_host_deny.candidate_native_refs.length > 0);
assert.equal(report.gate_status, "A2_NATIVE_CONTROLS_PASS");

console.log(`verified ${report.candidate} A2 native controls`);
