import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { isolationInvocation } from "./network-isolation.mjs";

const repository = fileURLToPath(new URL("../", import.meta.url));
const privateHome = fileURLToPath(new URL("../.network-denial-home/", import.meta.url));
const nextCache = fileURLToPath(new URL("../.next/", import.meta.url));
const staticOutput = fileURLToPath(new URL("../out/", import.meta.url));
const runner = fileURLToPath(new URL("./network-denial-runner.mjs", import.meta.url));

test("fresh-cache E2E succeeds without non-loopback network access", async () => {
  await Promise.all([
    rm(privateHome, { recursive: true, force: true }),
    rm(nextCache, { recursive: true, force: true }),
    rm(staticOutput, { recursive: true, force: true }),
  ]);
  await mkdir(privateHome, { recursive: true });

  const { command, args } = isolationInvocation(process.platform, {
    node: process.execPath,
    runner,
    repository,
    privateHome,
    npmCli: process.env.npm_execpath,
    uid: process.getuid?.(),
    gid: process.getgid?.(),
  });

  try {
    const result = spawnSync(command, args, {
      cwd: repository,
      env: process.env,
      encoding: "utf8",
      timeout: 120_000,
    });

    assert.equal(result.error, undefined, result.error?.message);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    await rm(privateHome, { recursive: true, force: true });
  }
});

test("filesystem URL conversion executes a path containing escaped characters", async () => {
  const scratch = fileURLToPath(new URL("../.network-denial path-ü/", import.meta.url));
  const script = join(scratch, "probe script.mjs");

  await rm(scratch, { recursive: true, force: true });
  await mkdir(scratch, { recursive: true });
  await writeFile(script, 'process.stdout.write("decoded-path-ok")\n');

  try {
    const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
    assert.equal(result.error, undefined, result.error?.message);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "decoded-path-ok");
    assert.doesNotMatch(script, /%20|%C3%BC/i);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Linux isolation is fail-closed and configures only loopback", () => {
  const invocation = isolationInvocation("linux", {
    node: "/node",
    runner: "/runner.mjs",
    repository: "/repo",
    privateHome: "/private-home",
    npmCli: "/npm-cli.js",
    uid: 1000,
    gid: 1000,
  });

  assert.equal(invocation.command, "sudo");
  assert.deepEqual(invocation.args.slice(0, 4), ["--non-interactive", "unshare", "--net", "--"]);
  assert.match(invocation.args.join(" "), /ip link set lo up/);
  assert.match(invocation.args.join(" "), /setpriv --reuid/);
  assert.doesNotMatch(invocation.args.join(" "), /NODE_OPTIONS|deny-external-network/);
});

test("unsupported platforms fail instead of running E2E without isolation", () => {
  assert.throws(
    () => isolationInvocation("win32", {
      node: "/node",
      runner: "/runner.mjs",
      repository: "/repo",
      privateHome: "/private-home",
      npmCli: "/npm-cli.js",
    }),
    /Unsupported OS-level network isolation/,
  );
});
