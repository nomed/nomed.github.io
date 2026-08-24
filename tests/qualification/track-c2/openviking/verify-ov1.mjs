import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [path] = process.argv.slice(2);
assert.ok(path, "usage: node verify-ov1.mjs <report.json>");
const r = JSON.parse(await readFile(path, "utf8"));

assert.equal(r.track, "C2");
assert.equal(r.gate, "OV-1-public-substrate-seam");
assert.equal(r.candidate, "volcengine/OpenViking");
assert.equal(r.revision, "234a2d9fe778a9512fd7ebe9807198e847c647ec");
assert.equal(r.result, "PASS");

for (const key of [
  "license_agpl_v3",
  "context_database_claim",
  "virtual_filesystem",
  "standalone_http_service",
  "lightweight_http_sdk",
  "api_key_auth",
  "account_user_identity",
  "request_scoped_actor_peer",
  "actor_peer_not_auth_authority",
  "public_resource_ingest",
  "public_resource_read",
  "public_retrieval",
  "public_session_memory",
  "public_admin_synthetic_users",
  "oss_not_feature_gated_claim",
  "supports_local_ollama_setup",
  "agent_integrations_include_hermes_and_mcp",
]) assert.equal(r.facts[key], true, `required OV-1 fact missing: ${key}`);

assert.equal(r.authority_boundary.canonical_git_remains_source_of_truth, true);
assert.equal(r.authority_boundary.openviking_is_runtime_projection, true);
assert.equal(r.authority_boundary.openviking_is_yukh_authority, false);
assert.equal(r.authority_boundary.openviking_is_accepted_state, false);
assert.equal(r.authority_boundary.openviking_is_evidence_truth, false);
assert.equal(r.authority_boundary.openviking_actor_peer_is_yukh_participant_authority, false);
assert.equal(r.authority_boundary.openviking_skill_is_accepted_golden_path, false);
assert.ok(r.unresolved_for_later_gates.length >= 6);
assert.equal(r.next_gate, "OV-2/OV-3 synthetic public-API fixture");

console.log("verified OpenViking OV-1 public substrate seam: PASS");