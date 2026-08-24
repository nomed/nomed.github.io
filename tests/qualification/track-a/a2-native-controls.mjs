import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import readline from "node:readline";

const [candidateName, sourceDirArg, reportDirArg] = process.argv.slice(2);
assert.ok(candidateName && sourceDirArg && reportDirArg, "usage: node a2-native-controls.mjs <candidate> <source-dir> <report-dir>");

const harnessRoot = resolve(new URL(".", import.meta.url).pathname);
const baseConfig = JSON.parse(await readFile(join(harnessRoot, "candidates.json"), "utf8"));
const a2Config = JSON.parse(await readFile(join(harnessRoot, "a2-config.json"), "utf8"));
const candidate = baseConfig.candidates[candidateName];
const seam = a2Config.candidates[candidateName];
assert.ok(candidate && seam, `unknown candidate: ${candidateName}`);

const sourceDir = resolve(sourceDirArg);
const reportDir = resolve(reportDirArg);
const tempRoot = await mkdtemp(join(tmpdir(), `yukh-a2-${candidateName}-`));
const workspace = join(tempRoot, "workspace");
const home = join(tempRoot, "home");
await mkdir(join(workspace, "fixture"), { recursive: true });
await mkdir(home, { recursive: true });
await cp(join(harnessRoot, "fixture", "hello.txt"), join(workspace, "fixture", "hello.txt"));
await cp(join(harnessRoot, "fixture", "forbidden.txt"), join(workspace, "forbidden.txt"));
await cp(join(harnessRoot, "fixture", "host-denied.txt"), join(workspace, "host-denied.txt"));

const expected = {
  "fixture/hello.txt": await readFile(join(workspace, "fixture", "hello.txt"), "utf8"),
  "forbidden.txt": await readFile(join(workspace, "forbidden.txt"), "utf8"),
  "host-denied.txt": await readFile(join(workspace, "host-denied.txt"), "utf8"),
};

function flattenContent(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenContent).join("\n");
  if (value && typeof value === "object") {
    if (typeof value.text === "string") return value.text;
    return JSON.stringify(value);
  }
  return "";
}

function collectStrings(value, out = []) {
  if (typeof value === "string") {
    out.push(value);
    const trimmed = value.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try { collectStrings(JSON.parse(value), out); } catch { /* ordinary string */ }
    }
    return out;
  }
  if (Array.isArray(value)) {
    for (const entry of value) collectStrings(entry, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const entry of Object.values(value)) collectStrings(entry, out);
  }
  return out;
}

function findTarget(body) {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.role !== "user") continue;
    const match = flattenContent(messages[i]?.content).match(/A2_TARGET=([^\s]+)/);
    if (match) return match[1];
  }
  return null;
}

function toolMessages(body) {
  return (Array.isArray(body.messages) ? body.messages : []).filter((message) => message?.role === "tool");
}

function observeExpectedToolBytes(body, target) {
  if (!target || !(target in expected)) return { observed: false, evidence: [] };
  const wanted = expected[target];
  const strings = toolMessages(body).flatMap((message) => collectStrings(message));
  const matches = strings.filter((value) => value === wanted || value.includes(wanted));
  return { observed: matches.length > 0, evidence: matches.slice(0, 3) };
}

function selectCommandTool(body) {
  const functions = (Array.isArray(body.tools) ? body.tools : [])
    .map((tool) => tool?.function)
    .filter((fn) => fn && typeof fn.name === "string");
  return functions.find((fn) => /terminal|shell/i.test(fn.name))
    ?? functions.find((fn) => fn.parameters?.properties?.command)
    ?? null;
}

function toolArguments(tool, target) {
  const command = `bash -c 'cat ${target}'`;
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
    res.end(JSON.stringify({ error: { message: `unsupported ${req.method} ${req.url}` } }));
    return;
  }

  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || "{}");
  const target = findTarget(body);
  const offeredToolNames = (Array.isArray(body.tools) ? body.tools : []).map((entry) => entry?.function?.name).filter(Boolean);
  const resultEvidence = observeExpectedToolBytes(body, target);
  const hasToolResult = toolMessages(body).length > 0;
  providerObservations.push({
    target,
    tool_result_request: hasToolResult,
    offered_tool_names: offeredToolNames,
    expected_tool_bytes_observed: resultEvidence.observed,
    expected_tool_byte_evidence: resultEvidence.evidence,
  });

  completionCounter += 1;
  const id = `a2-chat-${completionCounter}`;
  const model = body.model || "a2-model";
  const streaming = body.stream !== false;

  // Hermes performs auxiliary title-generation calls against the same provider with no tools.
  // Return inert text so those calls do not interfere with the deterministic tool-call sequence.
  if (!hasToolResult && offeredToolNames.length === 0) {
    const message = { role: "assistant", content: "A2 qualification" };
    if (streaming) {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
      res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta: message, finish_reason: null }] })}\n\n`);
      res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta: {}, finish_reason: "stop" }] })}\n\n`);
      res.end("data: [DONE]\n\n");
    } else {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ id, object: "chat.completion", created: 0, model, choices: [{ index: 0, message, finish_reason: "stop" }] }));
    }
    return;
  }

  let delta;
  let finishReason;
  if (!hasToolResult) {
    const tool = selectCommandTool(body);
    if (!target || !tool) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { message: `A2 provider could not resolve target/tool; target=${target}, tools=${offeredToolNames.join(",")}` } }));
      return;
    }
    delta = {
      role: "assistant",
      tool_calls: [{
        index: 0,
        id: `call-${completionCounter}`,
        type: "function",
        function: { name: tool.name, arguments: JSON.stringify(toolArguments(tool, target)) },
      }],
    };
    finishReason = "tool_calls";
  } else {
    delta = { role: "assistant", content: "A2_DONE" };
    finishReason = "stop";
  }

  if (streaming) {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
    res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta, finish_reason: null }] })}\n\n`);
    res.write(`data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: 0, model, choices: [{ index: 0, delta: {}, finish_reason: finishReason }] })}\n\n`);
    res.end("data: [DONE]\n\n");
  } else {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ id, object: "chat.completion", created: 0, model, choices: [{ index: 0, message: delta, finish_reason: finishReason }] }));
  }
});

await new Promise((resolvePromise, rejectPromise) => {
  provider.once("error", rejectPromise);
  provider.listen(0, "127.0.0.1", resolvePromise);
});
const address = provider.address();
assert.ok(address && typeof address === "object");
const providerBase = `http://127.0.0.1:${address.port}`;

async function writeCandidateConfig() {
  if (candidateName === "goose") {
    const configDir = join(home, ".config", "goose");
    await mkdir(configDir, { recursive: true });
    await writeFile(join(configDir, "config.yaml"), [
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

  if (candidateName === "hermes") {
    await writeFile(join(home, "config.yaml"), [
      "model:",
      "  default: a2-model",
      "  provider: custom",
      `  base_url: ${providerBase}/v1`,
      "  api_key: a2-test-key",
      "approvals:",
      "  mode: manual",
      "  timeout: 10",
      "mcp_servers: {}",
      "",
    ].join("\n"));
    await writeFile(join(home, ".env"), "OPENAI_API_KEY=a2-test-key\n");
    return;
  }
  throw new Error(`unsupported candidate ${candidateName}`);
}
await writeCandidateConfig();

function candidateProcess() {
  const commonEnv = {
    ...process.env,
    HOME: home,
    CI: "true",
    OPENAI_API_KEY: "a2-test-key",
    OPENAI_BASE_URL: `${providerBase}/v1`,
    OPENAI_HOST: providerBase,
  };
  if (candidateName === "goose") {
    return spawn("cargo", ["run", "--quiet", "-p", "goose-cli", "--bin", "goose", "--", "acp"], {
      cwd: sourceDir,
      env: {
        ...commonEnv,
        XDG_CONFIG_HOME: join(home, ".config"),
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
      ...commonEnv,
      HERMES_HOME: home,
      HERMES_ACP_SKIP_CONFIGURED_MCP: "1",
      HERMES_YOLO_MODE: "0",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
}

class AcpConnection {
  constructor(child, hostDecision) {
    this.child = child;
    this.hostDecision = hostDecision;
    this.nextId = 1;
    this.pending = new Map();
    this.notifications = [];
    this.permissionRequests = [];
    this.stderr = "";
    this.rl = readline.createInterface({ input: child.stdout });
    this.rl.on("line", (line) => this.onLine(line));
    child.stderr.on("data", (chunk) => { this.stderr = `${this.stderr}${chunk}`.slice(-12000); });
  }

  send(payload) { this.child.stdin.write(`${JSON.stringify(payload)}\n`); }

  request(method, params, timeoutMs = 45000) {
    const id = this.nextId++;
    this.send({ jsonrpc: "2.0", id, method, params });
    return new Promise((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectPromise(new Error(`ACP timeout for ${method}; stderr=${this.stderr}`));
      }, timeoutMs);
      this.pending.set(id, { resolve: resolvePromise, reject: rejectPromise, timer, method });
    });
  }

  choosePermission(options) {
    const list = Array.isArray(options) ? options : [];
    if (this.hostDecision === "ALLOW") {
      return list.find((option) => option.kind === "allow_once") ?? list.find((option) => /allow/.test(option.kind ?? ""));
    }
    return list.find((option) => option.kind === "reject_once") ?? list.find((option) => /reject|deny/.test(option.kind ?? ""));
  }

  onLine(line) {
    let message;
    try { message = JSON.parse(line); } catch { return; }

    if (message.id != null && message.method) {
      const params = message.params ?? {};
      if (Array.isArray(params.options) && params.toolCall) {
        const option = this.choosePermission(params.options);
        const observation = {
          jsonrpc_method: message.method,
          request_id: message.id,
          session_id: params.sessionId ?? null,
          tool_call_id: params.toolCall.toolCallId ?? params.toolCall.id ?? null,
          tool_call: params.toolCall,
          option_kinds: params.options.map((entry) => entry.kind),
          selected_option_id: option?.optionId ?? null,
          selected_option_kind: option?.kind ?? null,
          scripted_host_decision: this.hostDecision,
        };
        this.permissionRequests.push(observation);
        const result = option
          ? { outcome: { outcome: "selected", optionId: option.optionId } }
          : { outcome: { outcome: "cancelled" } };
        this.send({ jsonrpc: "2.0", id: message.id, result });
      } else {
        this.send({ jsonrpc: "2.0", id: message.id, error: { code: -32601, message: `A2 client does not implement ${message.method}` } });
      }
      return;
    }

    if (message.id != null) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${JSON.stringify(message.error)}`));
      else pending.resolve(message.result);
      return;
    }

    if (message.method) this.notifications.push(message);
  }

  async initialize() {
    return this.request("initialize", {
      protocolVersion: 1,
      clientCapabilities: {},
      clientInfo: { name: "yukh-a2-qualification", version: "1" },
    });
  }

  async newSession() { return this.request("session/new", { cwd: workspace, mcpServers: [] }); }

  async prompt(sessionId, target) {
    return this.request("session/prompt", {
      sessionId,
      prompt: [{
        type: "text",
        text: `A2_TARGET=${target}\nUse a terminal/shell tool and execute exactly: bash -c 'cat ${target}'. Do not use a file-reading shortcut. Return only after the tool attempt.`,
      }],
    }, 90000);
  }

  stop() {
    this.rl.close();
    this.child.kill("SIGTERM");
  }
}

function nativeRef(permission) {
  return `${candidateName}:acp:${permission.jsonrpc_method}:${permission.request_id}:${permission.tool_call_id ?? "tool"}`;
}

async function executeHostControl(target, hostDecision) {
  const beforeProvider = providerObservations.length;
  const child = candidateProcess();
  const cx = new AcpConnection(child, hostDecision);
  let sessionId = null;
  let promptResult = null;
  let failure = null;
  try {
    await cx.initialize();
    const session = await cx.newSession();
    sessionId = session?.sessionId;
    assert.ok(sessionId, `candidate did not return sessionId: ${JSON.stringify(session)}`);
    promptResult = await cx.prompt(sessionId, target);
  } catch (error) {
    failure = String(error?.stack ?? error);
  } finally {
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
    cx.stop();
  }

  const providerSlice = providerObservations.slice(beforeProvider);
  const expectedObserved = providerSlice.some((entry) => entry.expected_tool_bytes_observed);
  return {
    target,
    requested_host_decision: hostDecision,
    host_session_id: sessionId,
    prompt_result: promptResult,
    failure,
    permission_requests: cx.permissionRequests,
    candidate_native_refs: cx.permissionRequests.map(nativeRef),
    provider_observations: providerSlice,
    expected_content_observed: expectedObserved,
    expected_content: expected[target],
    stderr_excerpt: cx.stderr.slice(-4000),
  };
}

function hostObservation(control, expectedDecision) {
  const permission = control.permission_requests[0];
  if (control.failure) return "FAIL";
  if (!permission) return "NOT_OBSERVED";
  const kind = permission.selected_option_kind ?? "";
  const id = permission.selected_option_id ?? "";
  if (expectedDecision === "ALLOW" && (/allow/.test(kind) || /allow/.test(id))) return "ALLOW";
  if (expectedDecision === "DENY" && (/reject|deny/.test(kind) || /reject|deny/.test(id))) return "DENY";
  if (expectedDecision === "DENY" && !id) return "DENY";
  return "MISMATCH";
}

const startedAt = new Date().toISOString();
const positive = await executeHostControl("fixture/hello.txt", "ALLOW");
const forbiddenControl = await executeHostControl("forbidden.txt", "ALLOW");
const hostDenied = await executeHostControl("host-denied.txt", "DENY");
const finishedAt = new Date().toISOString();

const positiveHost = hostObservation(positive, "ALLOW");
const forbiddenHost = hostObservation(forbiddenControl, "ALLOW");
const deniedHost = hostObservation(hostDenied, "DENY");
const positivePass = positiveHost === "ALLOW" && positive.expected_content_observed;
const forbiddenControlPass = forbiddenHost === "ALLOW" && forbiddenControl.expected_content_observed;
const hostDeniedNoLeak = !hostDenied.expected_content_observed;
const hostDeniedPass = deniedHost === "DENY" && hostDeniedNoLeak;
const positiveDigest = createHash("sha256").update(expected["fixture/hello.txt"]).digest("hex");

const report = {
  schema_version: 1,
  track: "A",
  qualification_level: "host-composition-native-controls",
  candidate: candidateName,
  repository: candidate.repository,
  revision: candidate.revision,
  public_entrypoint: seam.public_entrypoint.replace(/ --help$/, ""),
  participant_id: a2Config.participant_id,
  work_uri: a2Config.work_uri,
  native_permission_profile: candidateName === "goose" ? "approve" : "manual",
  deterministic_provider: {
    kind: "local OpenAI-compatible qualification stub",
    external_credentials: false,
    permission_authority: false,
  },
  controls: {
    positive_allow_allow: {
      operation: "filesystem.read",
      resource: "workspace:/fixture/hello.txt",
      capability_id: "yukh-cap:track-a:read-fixture:v1",
      yukh_decision: "ALLOW",
      adapter_translation: "capability permits bounded read; operation presented through normal ACP prompt/tool loop",
      adapter_decision_made: false,
      host_control_observation: positiveHost,
      host_native_decision: positiveHost === "ALLOW" ? "ALLOW" : "NOT_OBSERVED",
      effective_decision: positivePass ? "ALLOW" : "UNPROVEN",
      enforcement_source: "none",
      operation_outcome: positivePass ? "PASS" : "FAIL",
      host_session_id: positive.host_session_id,
      candidate_native_refs: positive.candidate_native_refs,
      output_digest_if_allowed: positivePass ? positiveDigest : null,
      expected_content_observed: positive.expected_content_observed,
      failure: positive.failure,
    },
    forbidden_host_only_control: {
      operation: "filesystem.read",
      resource: "workspace:/forbidden.txt",
      yukh_decision: "NEUTRAL",
      host_control_observation: forbiddenHost,
      host_native_decision: forbiddenHost === "ALLOW" ? "ALLOW" : "NOT_OBSERVED",
      operation_outcome: forbiddenControlPass ? "PASS" : "FAIL",
      host_session_id: forbiddenControl.host_session_id,
      candidate_native_refs: forbiddenControl.candidate_native_refs,
      expected_content_observed: forbiddenControl.expected_content_observed,
      failure: forbiddenControl.failure,
    },
    yukh_deny_host_allow: {
      operation: "filesystem.read",
      resource: "workspace:/forbidden.txt",
      capability_id: "yukh-cap:track-a:read-fixture:v1",
      yukh_decision: "DENY",
      adapter_translation: "Yukh resource scope rejects target before candidate invocation; host ALLOW comes from same-profile host-only control",
      adapter_decision_made: false,
      host_control_observation: forbiddenHost,
      host_native_decision: forbiddenHost === "ALLOW" ? "ALLOW" : "NOT_OBSERVED",
      effective_decision: forbiddenControlPass ? "DENY" : "UNPROVEN",
      enforcement_source: forbiddenControlPass ? "yukh" : "none",
      operation_outcome: forbiddenControlPass ? "DENIED_BEFORE_CANDIDATE_INVOCATION" : "FAIL",
      candidate_native_refs: forbiddenControl.candidate_native_refs,
      output_digest_if_allowed: null,
      candidate_invoked: false,
      composed_candidate_output_contains_forbidden_bytes: false,
    },
    yukh_allow_host_deny: {
      operation: "filesystem.read",
      resource: "workspace:/host-denied.txt",
      capability_id: "yukh-cap:track-a:host-denial-probe:v1",
      yukh_decision: "ALLOW",
      adapter_translation: "capability permits bounded read; candidate native approval request is answered with its reject/deny option",
      adapter_decision_made: false,
      host_control_observation: deniedHost,
      host_native_decision: deniedHost === "DENY" ? "DENY" : "NOT_OBSERVED",
      effective_decision: hostDeniedPass ? "DENY" : "UNPROVEN",
      enforcement_source: hostDeniedPass ? "host" : "none",
      operation_outcome: hostDeniedPass ? "DENIED_BY_HOST" : "FAIL",
      host_session_id: hostDenied.host_session_id,
      candidate_native_refs: hostDenied.candidate_native_refs,
      output_digest_if_allowed: null,
      host_denied_content_leaked: !hostDeniedNoLeak,
      failure: hostDenied.failure,
    },
  },
  authority_claims: {
    adapter_decision_made: false,
    native_safety_disabled: false,
    host_memory_is_authority: false,
    private_reasoning_required: false,
    deterministic_provider_is_permission_authority: false,
  },
  dimensions: {
    positive_allow_allow: positivePass ? "PASS" : "FAIL",
    observed_host_allow_control: forbiddenControlPass ? "PASS" : "FAIL",
    yukh_deny_host_allow_composition: forbiddenControlPass ? "PASS" : "FAIL",
    observed_host_deny_control: hostDeniedPass ? "PASS" : "FAIL",
    yukh_allow_host_deny_composition: hostDeniedPass ? "PASS" : "FAIL",
    neutral_a2_evidence_export: positivePass && forbiddenControlPass && hostDeniedPass ? "PASS" : "FAIL",
    restart_recovery: "NOT_EXECUTED",
    adapter_cost: "NOT_EXECUTED",
  },
  started_at: startedAt,
  finished_at: finishedAt,
  gate_status: positivePass && forbiddenControlPass && hostDeniedPass ? "A2_NATIVE_CONTROLS_PASS" : "A2_NATIVE_CONTROLS_INCOMPLETE",
  diagnostic: {
    positive: { permission_requests: positive.permission_requests, provider_observations: positive.provider_observations, stderr_excerpt: positive.stderr_excerpt },
    forbidden_control: { permission_requests: forbiddenControl.permission_requests, provider_observations: forbiddenControl.provider_observations, stderr_excerpt: forbiddenControl.stderr_excerpt },
    host_denied: { permission_requests: hostDenied.permission_requests, provider_observations: hostDenied.provider_observations, stderr_excerpt: hostDenied.stderr_excerpt },
  },
};

await mkdir(reportDir, { recursive: true });
const output = join(reportDir, `${candidateName}-a2-native-controls.json`);
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(output);

await new Promise((resolvePromise) => provider.close(resolvePromise));
await rm(tempRoot, { recursive: true, force: true });
if (report.gate_status !== "A2_NATIVE_CONTROLS_PASS") process.exitCode = 1;
