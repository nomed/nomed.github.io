import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [reportPath] = process.argv.slice(2);
assert.ok(reportPath, "usage: node verify-report.mjs <report.json>");
const report = JSON.parse(await readFile(reportPath, "utf8"));

assert.equal(report.schema_version, 1);
assert.equal(report.track, "A");
assert.equal(report.qualification_level, "runtime-substrate");
assert.equal(report.work_uri, "yukh://qualification/track-a/work/hello-evidence");
assert.match(report.operation, /runtime substrate|host substrate/i);
assert.match(report.harness_fixture.purpose, /not consumed by this substrate gate/i);
assert.equal(report.harness_fixture.value, "hello-yukh\n");
assert.equal(report.harness_fixture.byte_length, 11);
assert.equal(report.harness_fixture.sha256, "2ac976403f898314551829ae59ce7acb69f6a725ad5df5c09e6db7766f766cbd");
assert.ok(["PASS", "FAIL", "NOT_REQUIRED"].includes(report.bootstrap.outcome));
assert.equal(report.authority_claims.yukh_authority_granted_to_host, false);
assert.equal(report.authority_claims.host_memory_is_evidence, false);
assert.equal(report.authority_claims.private_reasoning_required, false);
assert.equal(report.authority_claims.native_safety_disabled, false);
assert.equal(report.dimensions.model_driven_capability_composition, "NOT_EXECUTED");
assert.equal(report.dimensions.restart_recovery, "NOT_EXECUTED");
assert.equal(report.dimensions.neutral_evidence_export, "NOT_EXECUTED");
assert.ok(["PASS", "FAIL", "NOT_EXECUTED"].includes(report.runtime_gate.outcome));
assert.ok(report.public_surface_checks.length > 0);
assert.ok(report.public_surface_checks.every((entry) => entry.exists === true));

console.log(`verified ${report.candidate} ${report.revision} (${report.runtime_gate.outcome})`);
