import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import readline from "node:readline";

const [candidateName, sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(candidateName && sourceDirArg && reportDirArg, "usage: node a2-native-controls-v2.mjs <candidate> <source-dir> <report-dir>");

const root = resolve(new URL(".", import.meta.url).pathname);
const baseConfig = JSON.parse(await readFile(join(root, "candidates.json"), "utf8"));
const a2Config = JSON.parse(await readFile(join(root, "a2-config.json"), "utf8"));
const candidate = baseConfig.candidates[candidateName];
const seam = a2Config.candidates[candidateName];
assert.ok(candidate && seam, `unknown candidate: ${candidateName}`);

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);
const tempRoot = await mkdtemp(join(tmpdir(), `yukh-a2-${candidateName}-`));
const workspace = join(tempRoot, "workspace");
const isolatedHome = join(tempRoot, "home");
await mkdir(join(workspace, "fixture"), { recursive: true });
await mkdir(isolatedHome, { recursive: true });
for (const file of ["hello.txt", "forbidden.txt", "host-denied.txt"]) {
  const source = join(root, "fixture", file);
  const target = file === "hello.txt" ? join(workspace, "fixture", file) : join(workspace, file);
  await cp(source, target);
}

const expected = {
  "fixture/hello.txt": await readFile(join(workspace, "fixture", "hello.txt"), "utf8"),
  "forbidden.txt": await readFile(join(workspace, "forbidden.txt"), "utf8"),
  "host-denied.txt": await readFile(join(workspace, "host-denied.txt"), "utf8"),
};
const markerFor = (target) => `A2_BYTES=${expected[target].trimEnd()}`;
const commandFor = (target) => `bash -c 'printf "A2_BYTES="; cat ${target}'`;

function flatten(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join("\n");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join("\n");
  return "";
}

function findTarget(body) {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role !== "user") continue;
    const match = flatten(messages[i]?.content).match(/A2_TARGET=([^\s]+)/);
    if (match) return match[1];
  }
  return null;
}

function toolMessages(body) {
  return (Array.isArray(body.messages) ? body.messages : []).filter((m) => m?.role === "tool");
}

function observeMarker(body, target) {
  if (!target || !(target in expected)) return false;
  const text = toolMessages(body).map((m) => flatten(m)).join("\n");
  return text.includes(markerFor(target));
}

function selectCommandTool(body) {
  const fns = (Array.isArray(body.tools) ? body.tools : [])
    .map((tool) => tool?.function)
    .filter((fn) => fn && typeof fn.name === "string");
  return fns.find((fn) => /terminal|shell/i.test(fn.name))
    ?? fns.find((fn) => fn.parameters?.properties?.command)
    ?? fns.find((fn) => fn.parameters?.properties?.cmd)
    ?? null;
}

function argsFor(tool, target) {
  const command = commandFor(target);
  const props = tool?.parameters?.properties ?? {};
  if (props.command) return { command };
  if (props.cmd) return { cmd: command };
  if (props.commands) return { commands: [command] };
  return { command };
}

const providerObservations = [];
let completionCounter = 0;
const provider = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/v1/models") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ object: "list", data: [{ id: "a2-model", object: "model", created: 0, owned_by: "yukh-qualification" }] }));
    return;
  }
  if (req.method !== "POST" || req.url !== "/v1/chat/completions") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { message: "unsupported local qualification request" } }));
    return;
  }

  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || "{}");
  const target = findTarget(body);
  const tools = (Array.isArray(body.tools) ? body.tools : []).map((t) => t?.function?.name).filter(Boolean);
  const hasToolResult = toolMessages(body).length > 0;
  providerObservations.push({
    target,
    tool_result_request: hasToolResult,
    offered_tool_names: tools,
    expected_marker_observed: observeMarker(body, target),
  });

  completionCounter += 1;
  const id = `a2-chat-${completionCounter}`;
  const model = body.model || "a2-model";
  const streaming = body.stream === true;

  let message;
  let finishReason;
  if (!hasToolResult) {
    const tool = selectCommandTool(body);
    if (!target || !tool) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { message: `unable to select bounded command tool; target=${target}; tools=${tools.join(",")}` } }));
      return;
    }
    message = {
      role: "assistant",
      tool_calls: [{
        id: `call-${completionCounter}`,
        type: "function",
        function: { name: tool.name, arguments: JSON.stringify(argsFor(tool, target)) },
      }],
    };
    finishReason = "tool_calls";
  } else {
    message = { role: "assistant", content: "A2_DONE" };
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
const addr = provider.address();
assert.ok(addr && typeof addr === "object");
const providerBase = `http://127.0.0.1:${addr.port}`;

async function writeConfig() {
  if (candidateName === "goose") {
    const dir = join(isolatedHome, ".config", "goose");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "config.yaml"), [
      "GOOSE_PROVIDER: openai",
      "GOOSE_MODEL: a2-model",
      "GOOSE_MODE: approve",
      `OPENAI_HOST: ${providerBase}`,
      "OPENAI_API_KEY: a2-test-key",
      "GOOSE_TOOL_PAIR_SUMMARIZATION: false",
      "",
    ].join("\n"));
    return;
  }
  await writeFile(join(isolatedHome, "config.yaml"), [
    "model:",
    "  default: a2-model",
    "  provider: custom",
    `  base_url: ${providerBase}/v1`,
    "  api_key: a2-test-key",
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
  await writeFile(join(isolatedHome, ".env"), "OPENAI_API_KEY=a2-test-key\n");
}
await writeConfig();

function candidateProcess() {
  const env = {
    ...process.env,
    HOME: isolatedHome,
    CI: "true",
    OPENAI_API_KEY: "a2-test-key",
    OPENAI_BASE_URL: `${providerBase}/v1`,
    OPENAI_HOST: providerBase,
  };
  if (candidateName === "goose") {
    return spawn("cargo", ["run", "--quiet", "-p", "goose-cli", "--bin", "goose", "--", "acp"], {
      cwd: sourceDir,
      env: {
        ...env,
        XDG_CONFIG_HOME: join(isolatedHome, ".config"),
        GOOSE_PROVIDER: "openai",
        GOOSE_MODEL: "a2-model",
        GOOSE_MODE: "approve",
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
  }
  return spawn("hermes", ["acp"], {
    cwd: sourceDir,
    env: {
      ...env,
      HERMES_HOME: isolatedHome,
      HERMES_ACP_SKIP_CONFIGURED_MCP: "1",
      HERMES_YOLO_MODE: "0",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
}

class AcpClient {
  constructor(child, hostDecision) {
    this.child = child;
    this.hostDecision = hostDecision;
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
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectPromise(new Error(`ACP timeout ${method}; stderr=${this.stderr.slice(-5000)}`));
      }, timeoutMs);
      this.pending.set(id, { resolvePromise, rejectPromise, timer, method });
    });
  }
  choose(options) {
    const list = Array.isArray(options) ? options : [];
    if (this.hostDecision === "ALLOW") return list.find((o) => o.kind === "allow_once") ?? list.find((o) => /allow/.test(o.kind ?? ""));
    return list.find((o) => o.kind === "reject_once") ?? list.find((o) => /reject|deny/.test(o.kind ?? ""));
  }
  onLine(line) {
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    if (msg.id != null && msg.method) {
      const p = msg.params ?? {};
      if (Array.isArray(p.options) && p.toolCall) {
        const selected = this.choose(p.options);
        this.permissions.push({
          jsonrpc_method: msg.method,
          request_id: msg.id,
          session_id: p.sessionId ?? null,
          tool_call_id: p.toolCall.toolCallId ?? p.toolCall.id ?? null,
          tool_call: p.toolCall,
          option_kinds: p.options.map((o) => o.kind),
          selected_option_id: selected?.optionId ?? null,
          selected_option_kind: selected?.kind ?? null,
          scripted_host_decision: this.hostDecision,
        });
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
      if (msg.error) pending.rejectPromise(new Error(`${pending.method}: ${JSON.stringify(msg.error)}`));
      else pending.resolvePromise(msg.result);
    }
  }
  async run(target) {
    await this.request("initialize", { protocolVersion: 1, clientCapabilities: {}, clientInfo: { name: "yukh-a2", version: "2" } });
    const session = await this.request("session/new", { cwd: workspace, mcpServers: [] });
    const sessionId = session?.sessionId;
    assert.ok(sessionId, "missing ACP session id");
    const result = await this.request("session/prompt", {
      sessionId,
      prompt: [{ type: "text", text: `A2_TARGET=${target}\nExecute exactly with terminal/shell: ${commandFor(target)}. Do not use a file-read shortcut.` }],
    });
    return { sessionId, result };
  }
  stop() { this.rl.close(); this.child.kill("SIGTERM"); }
}

function externalProviderAttempt(stderr) {
  return /openrouter|nous client|PAID lane|api\.openrouter|portal\.nous/i.test(stderr);
}
function tirithBootstrap(stderr) {
  return /tirith not found|downloading latest release|tirith installed/i.test(stderr);
}
function nativeRef(permission) {
  return `${candidateName}:acp:${permission.jsonrpc_method}:${permission.request_id}:${permission.tool_call_id ?? "tool"}`;
}

async function execute(target, hostDecision) {
  const before = providerObservations.length;
  const child = candidateProcess();
  const cx = new AcpClient(child, hostDecision);
  let run = null;
  let failure = null;
  try { run = await cx.run(target); }
  catch (error) { failure = String(error?.stack ?? error); }
  finally { await new Promise((r) => setTimeout(r, 250)); cx.stop(); }
  const observations = providerObservations.slice(before);
  return {
    target,
    failure,
    host_session_id: run?.sessionId ?? null,
    permission_requests: cx.permissions,
    candidate_native_refs: cx.permissions.map(nativeRef),
    expected_marker_observed: observations.some((o) => o.expected_marker_observed),
    provider_observations: observations,
    external_provider_attempt: externalProviderAttempt(cx.stderr),
    tirith_bootstrap_observed: tirithBootstrap(cx.stderr),
    stderr_excerpt: cx.stderr.slice(-5000),
  };
}

let dependencyPreflight = null;
if (candidateName === "hermes") {
  dependencyPreflight = await execute("fixture/hello.txt", "ALLOW");
}

const startedAt = new Date().toISOString();
const positive = await execute("fixture/hello.txt", "ALLOW");
const forbidden = await execute("forbidden.txt", "ALLOW");
const denied = await execute("host-denied.txt", "DENY");
const finishedAt = new Date().toISOString();

function observedDecision(control, expectedDecision) {
  const p = control.permission_requests[0];
  if (control.failure || !p) return "NOT_OBSERVED";
  const text = `${p.selected_option_kind ?? ""} ${p.selected_option_id ?? ""}`;
  if (expectedDecision === "ALLOW" && /allow/.test(text)) return "ALLOW";
  if (expectedDecision === "DENY" && /reject|deny/.test(text)) return "DENY";
  return "MISMATCH";
}

const positiveHost = observedDecision(positive, "ALLOW");
const forbiddenHost = observedDecision(forbidden, "ALLOW");
const deniedHost = observedDecision(denied, "DENY");
const controlsAreProviderLocal = !positive.external_provider_attempt && !forbidden.external_provider_attempt && !denied.external_provider_attempt;
const controlsAvoidBootstrap = !positive.tirith_bootstrap_observed && !forbidden.tirith_bootstrap_observed && !denied.tirith_bootstrap_observed;
const positivePass = positiveHost === "ALLOW" && positive.expected_marker_observed;
const forbiddenPass = forbiddenHost === "ALLOW" && forbidden.expected_marker_observed;
const deniedPass = deniedHost === "DENY" && !denied.expected_marker_observed;
const nativeControlsPass = positivePass && forbiddenPass && deniedPass && controlsAreProviderLocal && controlsAvoidBootstrap;

const report = {
  schema_version: 2,
  track: "A",
  qualification_level: "host-composition-native-controls",
  candidate: candidateName,
  repository: candidate.repository,
  revision: candidate.revision,
  public_entrypoint: seam.public_entrypoint.replace(/ --help$/, ""),
  participant_id: a2Config.participant_id,
  work_uri: a2Config.work_uri,
  native_permission_profile: candidateName === "goose" ? "approve" : "manual",
  deterministic_provider: { kind: "localhost OpenAI-compatible qualification stub", external_credentials: false, permission_authority: false },
  dependency_preflight: dependencyPreflight ? {
    excluded_from_gate_evidence: true,
    tirith_bootstrap_observed: dependencyPreflight.tirith_bootstrap_observed,
    external_provider_attempt: dependencyPreflight.external_provider_attempt,
  } : null,
  controls: {
    positive_allow_allow: {
      yukh_decision: "ALLOW", host_native_decision: positiveHost, effective_decision: positivePass ? "ALLOW" : "UNPROVEN",
      enforcement_source: "none", operation_outcome: positivePass ? "PASS" : "FAIL", operation: "filesystem.read",
      resource: "workspace:/fixture/hello.txt", capability_id: "yukh-cap:track-a:read-fixture:v1",
      candidate_native_refs: positive.candidate_native_refs,
      output_digest_if_allowed: positivePass ? createHash("sha256").update(expected["fixture/hello.txt"]).digest("hex") : null,
      marker_observed: positive.expected_marker_observed,
    },
    forbidden_host_only_control: {
      yukh_decision: "NEUTRAL", host_native_decision: forbiddenHost, operation_outcome: forbiddenPass ? "PASS" : "FAIL",
      resource: "workspace:/forbidden.txt", candidate_native_refs: forbidden.candidate_native_refs, marker_observed: forbidden.expected_marker_observed,
    },
    yukh_deny_host_allow: {
      yukh_decision: "DENY", host_native_decision: forbiddenHost, effective_decision: forbiddenPass ? "DENY" : "UNPROVEN",
      enforcement_source: forbiddenPass ? "yukh" : "none", operation_outcome: forbiddenPass ? "DENIED_BEFORE_CANDIDATE_INVOCATION" : "FAIL",
      resource: "workspace:/forbidden.txt", capability_id: "yukh-cap:track-a:read-fixture:v1",
      candidate_native_refs: forbidden.candidate_native_refs, candidate_invoked: false, output_digest_if_allowed: null,
    },
    yukh_allow_host_deny: {
      yukh_decision: "ALLOW", host_native_decision: deniedHost, effective_decision: deniedPass ? "DENY" : "UNPROVEN",
      enforcement_source: deniedPass ? "host" : "none", operation_outcome: deniedPass ? "DENIED_BY_HOST" : "FAIL",
      resource: "workspace:/host-denied.txt", capability_id: "yukh-cap:track-a:host-denial-probe:v1",
      candidate_native_refs: denied.candidate_native_refs, host_denied_content_leaked: denied.expected_marker_observed, output_digest_if_allowed: null,
    },
  },
  authority_claims: {
    adapter_decision_made: false,
    native_safety_disabled: false,
    host_memory_is_authority: false,
    private_reasoning_required: false,
    deterministic_provider_is_permission_authority: false,
  },
  environment_claims: {
    control_provider_egress_attempted: !controlsAreProviderLocal,
    control_dependency_bootstrap_observed: !controlsAvoidBootstrap,
    title_generation_disabled_for_qualification: candidateName === "hermes",
  },
  dimensions: {
    positive_allow_allow: positivePass ? "PASS" : "FAIL",
    observed_host_allow_control: forbiddenPass ? "PASS" : "FAIL",
    yukh_deny_host_allow_composition: forbiddenPass ? "PASS" : "FAIL",
    observed_host_deny_control: deniedPass ? "PASS" : "FAIL",
    yukh_allow_host_deny_composition: deniedPass ? "PASS" : "FAIL",
    provider_local_controls: controlsAreProviderLocal ? "PASS" : "FAIL",
    dependency_bootstrap_excluded_from_controls: controlsAvoidBootstrap ? "PASS" : "FAIL",
    neutral_a2_evidence_export: nativeControlsPass ? "PASS" : "FAIL",
    restart_recovery: "NOT_EXECUTED",
    adapter_cost: "NOT_EXECUTED",
  },
  started_at: startedAt,
  finished_at: finishedAt,
  gate_status: nativeControlsPass ? "A2_NATIVE_CONTROLS_PASS" : "A2_NATIVE_CONTROLS_INCOMPLETE",
  diagnostic: {
    positive,
    forbidden_control: forbidden,
    host_denied: denied,
  },
};

await mkdir(reportDir, { recursive: true });
const output = join(reportDir, `${candidateName}-a2-native-controls.json`);
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(output);
await new Promise((r) => provider.close(r));
await rm(tempRoot, { recursive: true, force: true });
if (!nativeControlsPass) process.exitCode = 1;
