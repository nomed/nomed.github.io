import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { Resolver } from "node:dns/promises";
import { createServer } from "node:http";
import net from "node:net";

const [, , repository, privateHome, npmCli] = process.argv;
assert.ok(repository && privateHome && npmCli, "repository, private HOME and npm CLI are required");

function timeout(label) {
  return new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out`)), 2_000);
    timer.unref();
  });
}

function deniedWithoutTimingOut(error) {
  assert.doesNotMatch(error.message, /timed out$/);
  return true;
}

async function probeLoopback() {
  const server = createServer((_request, response) => response.end("loopback-ok"));
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const response = await fetch(`http://127.0.0.1:${address.port}`);
    assert.equal(await response.text(), "loopback-ok");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

async function probeExternalConnectionDenied() {
  const connection = new Promise((resolve, reject) => {
    const socket = net.connect({ host: "192.0.2.1", port: 80 });
    socket.once("connect", () => {
      socket.destroy();
      resolve();
    });
    socket.once("error", reject);
  });

  await assert.rejects(
    Promise.race([connection, timeout("external connection probe")]),
    deniedWithoutTimingOut,
  );
}

async function probeExternalDnsDenied() {
  const resolver = new Resolver();
  resolver.setServers(["1.1.1.1"]);
  await assert.rejects(
    Promise.race([resolver.resolve4("example.com"), timeout("external DNS probe")]),
    deniedWithoutTimingOut,
  );
}

await probeLoopback();
await probeExternalConnectionDenied();
await probeExternalDnsDenied();

const result = spawnSync(process.execPath, [npmCli, "run", "e2e"], {
  cwd: repository,
  env: {
    ...process.env,
    HOME: privateHome,
    XDG_CACHE_HOME: `${privateHome}/cache`,
    npm_config_cache: `${privateHome}/npm-cache`,
    NEXT_TELEMETRY_DISABLED: "1",
  },
  encoding: "utf8",
  timeout: 120_000,
});

assert.equal(result.error, undefined, result.error?.message);
assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
