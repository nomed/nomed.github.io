import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const [sourceArg, outArg] = process.argv.slice(2);
assert.ok(sourceArg && outArg, "usage: node ov1-public-seam.mjs <openviking-source> <out-dir>");
const source = resolve(sourceArg);
const outDir = resolve(outArg);
const revision = "234a2d9fe778a9512fd7ebe9807198e847c647ec";

const readme = await readFile(join(source, "README.md"), "utf8");
const sdk = await readFile(join(source, "sdk/python/README.md"), "utf8");
const license = await readFile(join(source, "LICENSE"), "utf8");

const facts = {
  license_agpl_v3: license.includes("GNU AFFERO GENERAL PUBLIC LICENSE") && license.includes("Version 3"),
  context_database_claim: readme.includes("Context Database for AI Agents") && readme.includes("memories, resources, and skills"),
  virtual_filesystem: readme.includes("viking://") && readme.includes("ls") && readme.includes("tree") && readme.includes("find"),
  standalone_http_service: sdk.includes("existing OpenViking server over HTTP") && sdk.includes("http://127.0.0.1:1933"),
  lightweight_http_sdk: sdk.includes("openviking-sdk") && sdk.includes("SyncHTTPClient"),
  api_key_auth: sdk.includes("Most deployments use API key authentication"),
  account_user_identity: sdk.includes("account") && sdk.includes("user") && sdk.includes("root key"),
  request_scoped_actor_peer: sdk.includes("Request-Scoped Actor Peer") && sdk.includes("use_actor_peer"),
  actor_peer_not_auth_authority: sdk.includes("This scope does not change authentication or tenant ownership"),
  public_resource_ingest: sdk.includes("client.add_resource("),
  public_resource_read: sdk.includes("client.read(uri="),
  public_retrieval: sdk.includes("client.find(query="),
  public_session_memory: sdk.includes("memory_extraction_config") && sdk.includes(".commit("),
  public_admin_synthetic_users: sdk.includes("admin_create_account") && sdk.includes("admin_register_user"),
  oss_not_feature_gated_claim: readme.includes("open-source edition is not crippled") && readme.includes("no feature gates"),
  supports_local_ollama_setup: readme.includes("local Ollama"),
  agent_integrations_include_hermes_and_mcp: readme.includes("Hermes") && readme.includes("MCP clients"),
};

for (const [name, value] of Object.entries(facts)) assert.equal(value, true, `missing pinned public fact: ${name}`);

const report = {
  schema_version: 1,
  track: "C2",
  gate: "OV-1-public-substrate-seam",
  candidate: "volcengine/OpenViking",
  revision,
  facts,
  public_seams: [
    "HTTP service",
    "openviking-sdk",
    "ov CLI",
    "MCP/agent integrations",
  ],
  candidate_context_types: ["resources", "memories", "skills"],
  authority_boundary: {
    canonical_git_remains_source_of_truth: true,
    openviking_is_runtime_projection: true,
    openviking_is_yukh_authority: false,
    openviking_is_accepted_state: false,
    openviking_is_evidence_truth: false,
    openviking_actor_peer_is_yukh_participant_authority: false,
    openviking_skill_is_accepted_golden_path: false,
  },
  unresolved_for_later_gates: [
    "actual OSS cross-user visibility/isolation and revocation behavior",
    "stable provenance/source-revision representation for canonical Git projections",
    "stale/conflicting memory behavior",
    "host replacement using identical shared context",
    "candidate outage correctness",
    "embedding/VLM/inference operational profile and egress",
    "adapter cost and Yukh machinery eliminated",
  ],
  result: "PASS",
  result_scope: "Public supported substrate seams are sufficient to proceed to the executable synthetic fixture; no adoption/topology verdict is implied.",
  next_gate: "OV-2/OV-3 synthetic public-API fixture",
};

await mkdir(outDir, { recursive: true });
const output = join(outDir, "openviking-ov1.json");
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(output);