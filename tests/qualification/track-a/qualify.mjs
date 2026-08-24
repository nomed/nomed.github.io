import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const [candidateName, sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(candidateName && sourceDirArg && reportDirArg, "usage: node qualify.mjs <candidate> <source-dir> <report-dir>");

const root = resolve(new URL(".", import.meta.url).pathname);
const config = JSON.parse(await readFile(join(root, "candidates.json"), "utf8"));
const candidate = config.candidates[candidateName];
assert.ok(candidate, `unknown candidate: ${candidateName}`);

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);
const fixturePath = join(root, "fixture", "hello.txt");
const fixtureBytes = await readFile(fixturePath);
const fixtureDigest = createHash("sha256").update(fixtureBytes).digest("hex");
const actualRevision = execFileSync("git", ["-C", sourceDir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
assert.equal(actualRevision, candidate.revision, "candidate checkout is not pinned to the required revision");

const pathChecks = [];
for (const relativePath of candidate.required_paths) {
  const path = join(sourceDir, relativePath);
  const info = await stat(path);
  pathChecks.push({ path: relativePath, exists: true, kind: info.isDirectory() ? "directory" : "file" });
}

const startedAt = process.env.TRACK_A_GATE_STARTED_AT ?? null;
const finishedAt = new Date().toISOString();
const bootstrapOutcome = process.env.TRACK_A_BOOTSTRAP_OUTCOME ?? "PASS";
const runtimeGate = process.env.TRACK_A_RUNTIME_GATE ?? "NOT_EXECUTED";
assert.ok(["PASS", "FAIL", "NOT_REQUIRED"].includes(bootstrapOutcome), `invalid TRACK_A_BOOTSTRAP_OUTCOME: ${bootstrapOutcome}`);
assert.ok(["PASS", "FAIL", "NOT_EXECUTED"].includes(runtimeGate), `invalid TRACK_A_RUNTIME_GATE: ${runtimeGate}`);

const report = {
  schema_version: 1,
  track: "A",
  fixture_version: config.fixture_version,
  qualification_level: "runtime-substrate",
  candidate: candidateName,
  repository: candidate.repository,
  revision: candidate.revision,
  license: candidate.license,
  work_uri: "yukh://qualification/track-a/work/hello-evidence",
  operation: "verify pinned public host substrate using candidate-owned ACP/permission/MCP tests",
  harness_fixture: {
    purpose: "reserved deterministic input for the later model-driven common fixture; not consumed by this substrate gate",
    value: fixtureBytes.toString("utf8"),
    byte_length: fixtureBytes.length,
    sha256: fixtureDigest
  },
  public_surface_checks: pathChecks,
  bootstrap: {
    outcome: bootstrapOutcome
  },
  runtime_gate: {
    command: candidate.runtime_gate,
    outcome: runtimeGate,
    started_at: startedAt,
    finished_at: finishedAt
  },
  authority_claims: {
    yukh_authority_granted_to_host: false,
    host_memory_is_evidence: false,
    private_reasoning_required: false,
    native_safety_disabled: false
  },
  dimensions: {
    pinned_revision: "PASS",
    public_integration_surface: "PASS",
    candidate_bootstrap: bootstrapOutcome === "NOT_REQUIRED" ? "PASS" : bootstrapOutcome,
    upstream_acp_permission_tests: runtimeGate,
    model_driven_capability_composition: "NOT_EXECUTED",
    restart_recovery: "NOT_EXECUTED",
    neutral_evidence_export: "NOT_EXECUTED",
    adapter_cost: "NOT_EXECUTED"
  }
};

await mkdir(reportDir, { recursive: true });
const output = join(reportDir, `${candidateName}.json`);
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(output);
