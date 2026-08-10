import assert from "node:assert/strict";
import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repository = new URL("../", import.meta.url);
const privateHome = new URL("../.network-denial-home/", import.meta.url);
const nextCache = new URL("../.next/", import.meta.url);
const staticOutput = new URL("../out/", import.meta.url);

test("fresh-cache E2E succeeds without non-loopback network access", async () => {
  await Promise.all([
    rm(privateHome, { recursive: true, force: true }),
    rm(nextCache, { recursive: true, force: true }),
    rm(staticOutput, { recursive: true, force: true }),
  ]);
  await mkdir(privateHome, { recursive: true });

  const environment = {
    ...process.env,
    HOME: privateHome.pathname,
    XDG_CACHE_HOME: new URL("cache/", privateHome).pathname,
    npm_config_cache: new URL("npm-cache/", privateHome).pathname,
    NEXT_TELEMETRY_DISABLED: "1",
  };
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const profile = '(version 1) (allow default) (deny network-outbound) (allow network-outbound (remote ip "localhost:*"))';
  const command = process.platform === "darwin" ? "sandbox-exec" : npm;
  const args = process.platform === "darwin"
    ? ["-p", profile, npm, "run", "e2e"]
    : ["run", "e2e"];

  if (process.platform !== "darwin") {
    const preload = new URL("./deny-external-network.mjs", import.meta.url).pathname;
    environment.NODE_OPTIONS = `${environment.NODE_OPTIONS ?? ""} --import=${preload}`.trim();
  }

  try {
    const result = spawnSync(command, args, {
      cwd: repository,
      env: environment,
      encoding: "utf8",
      timeout: 120_000,
    });

    assert.equal(result.error, undefined, result.error?.message);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    await rm(privateHome, { recursive: true, force: true });
  }
});
