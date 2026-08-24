import assert from "node:assert/strict";
import { createServer } from "node:http";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import readline from "node:readline";

const [candidateName, sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(candidateName && sourceDirArg && reportDirArg, "usage: node recovery-adapter-cost-v2.mjs <candidate> <source-dir> <report-dir>");

const root = resolve(new URL(".", import.meta.url).pathname);
const candidates = JSON.parse(await readFile(join(root, "candidates.json"), "utf8"));
const candidate = candidates.candidates[candidateName];
assert.ok(candidate, `unknown candidate ${candidateName}`);

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);
const tempRoot = await mkdtemp(join(tmpdir(), `yukh-recovery-${candidateName}-`));
const workspace = join(tempRoot, "workspace");
const durableHome = join(tempRoot, "host-home");
await mkdir(join(workspace, "fixture"), { recursive: true });
await mkdir(durableHome, { recursive: true });
await cp(join(root, "fixture", "hello.txt"), join(workspace, "fixture", "hello.txt"));
const expected = await readFile(join(workspace, "fixture", "hello.txt"), "utf8");
const marker = `RECOVERY_BYTES=${expected.trimEnd()}`;
const command = `bash -c 'printf "RECOVERY_BYTES="; cat fixture/hello.txt'`;

const checkpoint = Object.freeze({
  schema_version: 1,
  participant_id: "participant:track-a:qualification",
  work_uri: "yukh://qualification/track-a/work/hello-evidence",
  capability_id: "yukh-cap:track-a:read-fixture:v1",
  evidence_run_id: "track-a-recovery-run-v1",
});
await writeFile(join(tempRoot, "yukh-checkpoint.json"), `${JSON.stringify(checkpoint, null, 2)}\n`);

function flatten(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join("\n");
  return "";
}
function toolMessages(body) {
  return (Array.isArray(body.messages) ? body.messages : []).filter((m) => m?.role === "tool");
}
function selectCommandTool(body) {
  const fns = (Array.isArray(body.tools) ? body.tools : []).map((t) => t?.function).filter((f) => f?.name);
  return fns.find((f) => /terminal|shell/i.test(f.name)) ?? fns.find((f) => f.parameters?.properties?.command) ?? fns.find((f) => f.parameters?.properties?.cmd) ?? null;
}
function toolArgs(tool) {
  const props = tool?.parameters?.properties ?? {};
  if (props.command) return { command };
  if (props.cmd) return { cmd: command };
  if (props.commands) return { commands: [command] };
  return { command };
}

const providerEvents = [];
let completion = 0;
const provider = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/v1/models") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ object: "list", data: [{ id: "recovery-model", object: "model", created: 0, owned_by: "yukh-qualification" }] }));
    return;
  }
  if (req.method !== "POST" || req.url !== "/v1/chat/completions") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { message: "unsupported qualification request" } }));
    return;
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || "{}");
  const tools = (Array.isArray(body.tools) ? body.tools : []).map((t) => t?.function?.name).filter(Boolean);
  const results = toolMessages(body);
  const hasToolResult = results.length > 0;
  providerEvents.push({
    has_tool_result: hasToolResult,
    marker_observed: flatten(results).includes(marker),
    checkpoint_observed: flatten(body.messages).includes(checkpoint.work_uri) && flatten(body.messages).includes(checkpoint.participant_id),
    tools,
  });

  completion += 1;
  const id = `recovery-${completion}`;
  const model = body.model || "recovery-model";
  const streaming = body.stream === true;
  let message;
  let finishReason;
  if (!hasToolResult) {
    const tool = selectCommandTool(body);
    if (!tool) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { message: `no terminal tool offered: ${tools.join(",")}` } }));
      return;
    }
    message = { role: "assistant", tool_calls: [{ id: `call-${completion}`, type: "function", function: { name: tool.name, arguments: JSON.stringify(toolArgs(tool)) } }] };
    finishReason = "tool_calls";
  } else {
    message = { role: "assistant", content: "RECOVERY_DONE" };
    finishReason = "stop";
  }
  if (!streaming) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ id, object: "chat.completion", created: 0, model, choices: [{ index: 0, message, finish_reason: finishReason }] }));
    return;
  }
  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
  const delta = { ...message };
  if (Array.isArray(delta.tool_calls)) delta.tool_calls = delta.tool_calls.map((call, index) => ({ index, ...call }));
  res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta, finish_reason: null }] })}\n\n`);
  res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta: {}, finish_reason: finishReason }] })}\n\n`);
  res.end("data: [DONE]\n\n");
});
await new Promise((ok, fail) => { provider.once("error", fail); provider.listen(0, "127.0.0.1", ok); });
const address = provider.address();
assert.ok(address && typeof address === "object");
const providerBase = `http://127.0.0.1:${address.port}`;

async function writeConfig() {
  if (candidateName === "goose") {
    const dir = join(durableHome, ".config", "goose");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "config.yaml"), [
      "GOOSE_PROVIDER: openai",
      "GOOSE_MODEL: recovery-model",
      "GOOSE_MODE: approve",
      `OPENAI_HOST: ${providerBase}`,
      "OPENAI_API_KEY: recovery-test-key",
      "GOOSE_TOOL_PAIR_SUMMARIZATION: false",
      "",
    ].join("\n"));
    return;
  }
  await writeFile(join(durableHome, "config.yaml"), [
    "model:",
    "  default: recovery-model",
    "  provider: custom",
    `  base_url: ${providerBase}/v1`,
    "  api_key: recovery-test-key",
    "approvals:",
    "  mode: manual",
    "  timeout: 10",
    "auxiliary:",
    "  free_only: true",
    "  title_generation:",
    "    enabled: false",
    "mcp_servers: {}",
    "",
  ].join("\n"));
  await writeFile(join(durableHome, ".env"), "OPENAI_API_KEY=recovery-test-key\n");
}
await writeConfig();

const candidateFacts = candidateName === "goose"
  ? {
      command: "cargo run -p goose-cli --bin goose -- acp",
      config_keys: ["GOOSE_PROVIDER", "GOOSE_MODEL", "GOOSE_MODE", "OPENAI_HOST", "OPENAI_API_KEY", "GOOSE_TOOL_PAIR_SUMMARIZATION"],
      persistent_state: "isolated HOME/XDG goose session store",
      bootstrap_dependencies: ["pre-provisioned Rust toolchain"],
    }
  : {
      command: "hermes acp",
      config_keys: ["model.default", "model.provider", "model.base_url", "model.api_key", "approvals.mode", "auxiliary.free_only", "auxiliary.title_generation.enabled"],
      persistent_state: "$HERMES_HOME/state.db",
      bootstrap_dependencies: ["Tirith may auto-install before measured controls"],
    };

function childProcess() {
  const common = {
    ...process.env,
    HOME: durableHome,
    CI: "true",
    OPENAI_API_KEY: "recovery-test-key",
    OPENAI_BASE_URL: `${providerBase}/v1`,
    OPENAI_HOST: providerBase,
  };
  if (candidateName === "goose") {
    return spawn("cargo", ["run", "--quiet", "-p", "goose-cli", "--bin", "goose", "--", "acp"], {
      cwd: sourceDir,
      env: { ...common, XDG_CONFIG_HOME: join(durableHome, ".config"), GOOSE_PROVIDER: "openai", GOOSE_MODEL: "recovery-model", GOOSE_MODE: "approve" },
      stdio: ["pipe", "pipe", "pipe"],
    });
  }
  return spawn("hermes", ["acp"], {
    cwd: sourceDir,
    env: { ...common, HERMES_HOME: durableHome, HERMES_ACP_SKIP_CONFIGURED_MCP: "1", HERMES_YOLO_MODE: "0" },
    stdio: ["pipe", "pipe", "pipe"],
  });
}

class AcpClient {
  constructor(child) {
    this.child = child;
    this.nextId = 1;
    this.pending = new Map();
    this.permissions = [];
    this.stderr = "";
    this.rl = readline.createInterface({ input: child.stdout });
    this.rl.on("line", (line) => this.onLine(line));
    child.stderr.on("data", (chunk) => { this.stderr += chunk.toString(); });
  }
  send(obj) { this.child.stdin.write(`${JSON.stringify(obj)}\n`); }
  request(method, params, timeoutMs = 90000) {
    const id = this.nextId++;
    this.send({ jsonrpc: "2.0", id, method, params });
    return new Promise((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => { this.pending.delete(id); rejectPromise(new Error(`timeout ${method}: ${this.stderr.slice(-3000)}`)); }, timeoutMs);
      this.pending.set(id, { resolvePromise, rejectPromise, timer, method });
    });
  }
  onLine(line) {
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    if (msg.id != null && msg.method) {
      const p = msg.params ?? {};
      if (Array.isArray(p.options) && p.toolCall) {
        const selected = p.options.find((o) => o.kind === "allow_once") ?? p.options.find((o) => /allow/.test(o.kind ?? ""));
        this.permissions.push({ method: msg.method, request_id: msg.id, session_id: p.sessionId ?? null, tool_call_id: p.toolCall.toolCallId ?? p.toolCall.id ?? null, selected_option: selected?.kind ?? null });
        this.send({ jsonrpc: "2.0", id: msg.id, result: selected ? { outcome: { outcome: "selected", optionId: selected.optionId } } : { outcome: { outcome: "cancelled" } } });
      } else {
        this.send({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: `unsupported client request ${msg.method}` } });
      }
      return;
    }
    if (msg.id != null) {
      const pending = this.pending.get(msg.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(msg.id);
      if (msg.error) pending.rejectPromise(new Error(`${pending.method}: ${JSON.stringify(msg.error)}`)); else pending.resolvePromise(msg.result);
    }
  }
  async initialize() {
    return this.request("initialize", { protocolVersion: 1, clientCapabilities: {}, clientInfo: { name: "yukh-track-a-recovery", version: "2" } });
  }
  async newSession() { return this.request("session/new", { cwd: workspace, mcpServers: [] }); }
  async loadSession(sessionId) { return this.request("session/load", { sessionId, cwd: workspace, mcpServers: [] }, 45000); }
  async prompt(sessionId, phase) {
    const text = [
      `YUKH_PARTICIPANT=${checkpoint.participant_id}`,
      `YUKH_WORK_URI=${checkpoint.work_uri}`,
      `YUKH_CAPABILITY=${checkpoint.capability_id}`,
      `YUKH_EVIDENCE_RUN=${checkpoint.evidence_run_id}`,
      `RECOVERY_PHASE=${phase}`,
      `Execute exactly with terminal/shell: ${command}`,
      "The Yukh identifiers above come from the external checkpoint and remain authoritative for correlation; host memory is context only.",
    ].join("\n");
    return this.request("session/prompt", { sessionId, prompt: [{ type: "text", text }] });
  }
  stop() { this.rl.close(); this.child.kill("SIGTERM"); }
}

function externalProviderAttempt(stderr) {
  return /PAID lane engaged|trying fallback|marking openrouter unhealthy|Auxiliary Nous client unavailable|api\.openrouter\.ai|portal\.nous/i.test(stderr);
}
function tirithBootstrap(stderr) {
  return /tirith not found|downloading latest release|tirith installed/i.test(stderr);
}

async function runNew(phase) {
  const before = providerEvents.length;
  const started = performance.now();
  const child = childProcess();
  const client = new AcpClient(child);
  let sessionId = null;
  let failure = null;
  try {
    await client.initialize();
    const session = await client.newSession();
    sessionId = session?.sessionId;
    assert.ok(sessionId, "missing session id");
    await client.prompt(sessionId, phase);
  } catch (error) { failure = String(error); }
  const elapsed = Math.round(performance.now() - started);
  await new Promise((r) => setTimeout(r, 200));
  client.stop();
  const events = providerEvents.slice(before);
  return {
    session_id: sessionId,
    failure,
    elapsed_ms: elapsed,
    marker_observed: events.some((e) => e.marker_observed),
    checkpoint_observed: events.some((e) => e.checkpoint_observed),
    permissions: client.permissions,
    external_provider_attempt: externalProviderAttempt(client.stderr),
    tirith_bootstrap_observed: tirithBootstrap(client.stderr),
    stderr_excerpt: client.stderr.slice(-3000),
  };
}

async function runLoad(originalSessionId) {
  const before = providerEvents.length;
  const started = performance.now();
  const child = childProcess();
  const client = new AcpClient(child);
  let failure = null;
  let loadResponse = null;
  try {
    await client.initialize();
    loadResponse = await client.loadSession(originalSessionId);
    await client.prompt(originalSessionId, "native-restore");
  } catch (error) { failure = String(error); }
  const elapsed = Math.round(performance.now() - started);
  await new Promise((r) => setTimeout(r, 200));
  client.stop();
  const events = providerEvents.slice(before);
  return {
    session_id: originalSessionId,
    load_response: loadResponse,
    failure,
    elapsed_ms: elapsed,
    marker_observed: events.some((e) => e.marker_observed),
    checkpoint_observed: events.some((e) => e.checkpoint_observed),
    permissions: client.permissions,
    external_provider_attempt: externalProviderAttempt(client.stderr),
    tirith_bootstrap_observed: tirithBootstrap(client.stderr),
    stderr_excerpt: client.stderr.slice(-3000),
  };
}

let dependencyPreflight = null;
if (candidateName === "hermes") dependencyPreflight = await runNew("dependency-preflight");

const initial = await runNew("initial");
assert.ok(initial.session_id, `initial session failed: ${initial.failure}`);
const nativeRestore = await runLoad(initial.session_id);
const rebind = await runNew("yukh-checkpoint-rebind");

const initialPass = !initial.failure && initial.marker_observed && initial.checkpoint_observed;
const nativeRestorePass = !nativeRestore.failure && nativeRestore.marker_observed && nativeRestore.checkpoint_observed;
const rebindPass = !rebind.failure && rebind.marker_observed && rebind.checkpoint_observed;
const correlationPass = initialPass && rebindPass && initial.session_id !== rebind.session_id;
const memoryNonAuthorityPass = rebindPass;
const measured = [initial, nativeRestore, rebind];
const providerLocal = !measured.some((x) => x.external_provider_attempt);
const bootstrapExcluded = !measured.some((x) => x.tirith_bootstrap_observed);

const report = {
  schema_version: 2,
  track: "A",
  gate: "restart-recovery-adapter-cost",
  candidate: candidateName,
  repository: candidate.repository,
  revision: candidate.revision,
  checkpoint,
  dependency_preflight: dependencyPreflight ? {
    excluded_from_measured_controls: true,
    external_provider_attempt: dependencyPreflight.external_provider_attempt,
    tirith_bootstrap_observed: dependencyPreflight.tirith_bootstrap_observed,
  } : null,
  results: {
    initial_execution: initialPass ? "PASS" : "FAIL",
    native_session_restore: nativeRestorePass ? "PASS" : (nativeRestore.failure ? "FAIL" : "PARTIAL"),
    yukh_checkpoint_rebind: rebindPass ? "PASS" : "FAIL",
    stable_participant_work_correlation: correlationPass ? "PASS" : "FAIL",
    memory_non_authority: memoryNonAuthorityPass ? "PASS" : "FAIL",
    neutral_recovery_evidence: correlationPass && providerLocal ? "PASS" : "FAIL",
    provider_local_recovery_controls: providerLocal ? "PASS" : "FAIL",
    dependency_bootstrap_excluded_from_controls: bootstrapExcluded ? "PASS" : "FAIL",
  },
  sessions: { initial, native_restore: nativeRestore, checkpoint_rebind: rebind },
  adapter_surface: {
    public_protocol: "ACP stdio only",
    candidate_specific_command: candidateFacts.command,
    candidate_specific_config_keys: candidateFacts.config_keys,
    candidate_specific_config_key_count: candidateFacts.config_keys.length,
    persistent_state_for_native_restore: candidateFacts.persistent_state,
    bootstrap_dependencies: candidateFacts.bootstrap_dependencies,
    candidate_specific_api_calls_required: false,
  },
  operational_friction: {
    initial_elapsed_ms: initial.elapsed_ms,
    native_restore_elapsed_ms: nativeRestore.elapsed_ms,
    fresh_rebind_elapsed_ms: rebind.elapsed_ms,
    external_provider_dependency_in_measured_controls: !providerLocal,
    dependency_bootstrap_in_measured_controls: !bootstrapExcluded,
  },
  support_gate_pass: rebindPass && correlationPass && memoryNonAuthorityPass && providerLocal && bootstrapExcluded,
};

await mkdir(reportDir, { recursive: true });
const output = join(reportDir, `${candidateName}-recovery-adapter-cost.json`);
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(output);
await new Promise((r) => provider.close(r));
await rm(tempRoot, { recursive: true, force: true });
if (!report.support_gate_pass) process.exitCode = 1;
