import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [reportPath] = process.argv.slice(2);
assert.ok(reportPath, "usage: node verify-a2-public-seam.mjs <report.json>");

const report = JSON.parse(await readFile(reportPath, "utf8"));
assert.equal(report.track, "A");
assert.equal(report.qualification_level, "host-composition-public-seam");
assert.ok(["goose", "hermes"].includes(report.candidate));
assert.equal(report.public_entrypoint_probe.outcome, "PASS");
assert.equal(report.dimensions.pinned_public_entrypoint, "PASS");
assert.equal(report.dimensions.documented_permission_surface, "PASS");
assert.equal(report.dimensions.observed_host_allow_control, "NOT_EXECUTED");
assert.equal(report.dimensions.yukh_deny_host_allow_composition, "NOT_EXECUTED");
assert.equal(report.dimensions.observed_host_deny_control, "NOT_EXECUTED");
assert.equal(report.dimensions.yukh_allow_host_deny_composition, "NOT_EXECUTED");
assert.equal(report.authority_claims.adapter_decision_made, false);
assert.equal(report.authority_claims.native_safety_disabled, false);
assert.equal(report.gate_status, "READY_FOR_NATIVE_CONTROL_SLICE");
assert.match(report.note, /MUST NOT be interpreted as an A2 PASS/i);
