import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const [candidateName, sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(candidateName && sourceDirArg && reportDirArg, "usage: node a2-public-seam-probe.mjs <candidate> <source-dir> <report-dir>");

const root = resolve(new URL(".", import.meta.url).pathname);
const baseConfig = JSON.parse(await readFile(join(root, "candidates.json"), "utf8"));
const a2Config = JSON.parse(await readFile(join(root, "a2-config.json"), "utf8"));
const candidate = baseConfig.candidates[candidateName];
const a2 = a2Config.candidates[candidateName];
assert.ok(candidate && a2, `unknown candidate: ${candidateName}`);

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);

function runEntrypoint() {
  if (candidateName === "goose") {
    return spawnSync("cargo", ["run", "--quiet", "-p", "goose-cli", "--bin", "goose", "--", "acp", "--help"], {
      cwd: sourceDir,
      encoding: "utf8",
      timeout: 15 * 60 * 1000,
      env: { ...process.env, CI: "true" },
    });
  }

  if (candidateName === "hermes") {
    return spawnSync("hermes", ["acp", "--help"], {
      cwd: sourceDir,
      encoding: "utf8",
      timeout: 2 * 60 * 1000,
      env: { ...process.env, CI: "true" },
    });
  }

  throw new Error(`unsupported candidate: ${candidateName}`);
}

const entrypointSource = await readFile(join(sourceDir, a2.entrypoint_source), "utf8");
const entrypointSourceChecks = a2.entrypoint_markers.map((marker) => ({
  marker,
  present: entrypointSource.toLowerCase().includes(marker.toLowerCase()),
}));

const permissionSurfaceChecks = [];
for (const surface of a2.permission_surfaces) {
  const contents = await readFile(join(sourceDir, surface.path), "utf8");
  permissionSurfaceChecks.push({
    path: surface.path,
    markers: surface.markers.map((marker) => ({
      marker,
      present: contents.toLowerCase().includes(marker.toLowerCase()),
    })),
  });
}

const invocation = runEntrypoint();
const stdout = invocation.stdout ?? "";
const stderr = invocation.stderr ?? "";
const combined = `${stdout}\n${stderr}`.trim();
const invocationPass = invocation.status === 0 && /acp|agent client protocol/i.test(combined);
const sourcePass = entrypointSourceChecks.every((check) => check.present);
const permissionsPass = permissionSurfaceChecks.every((surface) => surface.markers.every((check) => check.present));

const report = {
  schema_version: 1,
  track: "A",
  qualification_level: "host-composition-public-seam",
  candidate: candidateName,
  repository: candidate.repository,
  revision: candidate.revision,
  participant_id: a2Config.participant_id,
  work_uri: a2Config.work_uri,
  public_entrypoint: a2.public_entrypoint,
  entrypoint_kind: a2.entrypoint_kind,
  public_entrypoint_probe: {
    outcome: invocationPass ? "PASS" : "FAIL",
    exit_code: invocation.status,
    signal: invocation.signal ?? null,
    output_excerpt: combined.slice(0, 3000),
  },
  public_contract_evidence: {
    entrypoint_source: a2.entrypoint_source,
    entrypoint_source_checks: entrypointSourceChecks,
    permission_surfaces: permissionSurfaceChecks,
  },
  authority_claims: {
    adapter_decision_made: false,
    native_safety_disabled: false,
    host_memory_is_authority: false,
    private_reasoning_required: false,
  },
  dimensions: {
    pinned_public_entrypoint: invocationPass && sourcePass ? "PASS" : "FAIL",
    documented_permission_surface: permissionsPass ? "PASS" : "FAIL",
    observed_host_allow_control: "NOT_EXECUTED",
    yukh_deny_host_allow_composition: "NOT_EXECUTED",
    observed_host_deny_control: "NOT_EXECUTED",
    yukh_allow_host_deny_composition: "NOT_EXECUTED",
    neutral_a2_evidence_export: "NOT_EXECUTED",
  },
  gate_status: invocationPass && sourcePass && permissionsPass ? "READY_FOR_NATIVE_CONTROL_SLICE" : "PUBLIC_SEAM_PROBE_FAILED",
  note: "This probe pins and executes the supported public entrypoint only. It MUST NOT be interpreted as an A2 PASS; native ALLOW/DENY controls remain unexecuted.",
};

await mkdir(reportDir, { recursive: true });
const outputPath = join(reportDir, `${candidateName}-a2-public-seam.json`);
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(outputPath);

if (report.gate_status !== "READY_FOR_NATIVE_CONTROL_SLICE") {
  process.exitCode = 1;
}
