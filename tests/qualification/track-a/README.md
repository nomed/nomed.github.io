# Track A runtime qualification harness

This directory implements the executable part of issue #58. It is deliberately candidate-neutral: the same fixtures, wire-level ACP client, policy cases and verifiers are used for goose and Hermes Agent.

The first executable gate is **runtime-substrate qualification**. It proves that the pinned external source can be checked out, exposes the expected ACP/MCP and permission substrate, and can run candidate-owned tests around those surfaces without credentials. It does **not** prove Yukh/host authority composition.

The second gate is **A2 host composition**. It starts by pinning and invoking each candidate's supported public ACP entrypoint. The public-seam probe deliberately fails closed and cannot emit a composition PASS by itself.

The native-control slice then exercises the canonical three cases through the supported ACP boundary with a deterministic localhost OpenAI-compatible provider that selects the normal terminal/shell tool but has no permission authority:

1. Yukh ALLOW + observed host ALLOW -> effective ALLOW;
2. observed host ALLOW + Yukh DENY -> effective DENY before candidate invocation;
3. Yukh ALLOW + observed host DENY -> effective DENY by the host.

Candidate-native permission requests, session IDs and tool-call IDs are exported as evidence refs. The adapter never invents a host decision. Hermes qualification disables optional title generation through supported configuration so it cannot trigger unrelated inference fallbacks; dependency bootstrap is kept outside measured control evidence. Goose keeps candidate configuration/session state isolated while reusing only the runner's already-provisioned Rust toolchain paths.

## Invariants

- no secrets or production credentials;
- no external inference credentials or paid provider dependency;
- no mutation outside the ephemeral runner workspace;
- no external Project apply or Yukh infrastructure deployment;
- external repositories are pinned by commit SHA;
- native safety controls are not disabled merely to make the fixture pass;
- generated evidence contains operational facts, never chain-of-thought;
- configuration/documentation cannot be promoted into an observed host decision;
- an adapter cannot invent or reconstruct candidate-native ALLOW/DENY;
- provider-local and dependency-bootstrap boundaries are verified separately;
- a failed or missing public seam or native control is a valid qualification result.

## Files

- `candidates.json` — pinned candidate revisions and substrate inputs;
- `qualify.mjs` — runtime-substrate evidence writer;
- `verify-report.mjs` — runtime-substrate schema/invariant checks;
- `a2-config.json` — exact A2 public-entrypoint hypotheses and documented permission surfaces;
- `a2-public-seam-probe.mjs` — executes the pinned public CLI entrypoint and records public-contract evidence;
- `verify-a2-public-seam.mjs` — verifies public-seam evidence while native controls remain unclaimed;
- `a2-native-controls-v2.mjs` — candidate-neutral ACP native-control composition runner;
- `verify-a2-native-controls.mjs` — verifies ALLOW/ALLOW, Yukh-DENY/Host-ALLOW and Yukh-ALLOW/Host-DENY evidence plus environment invariants;
- `fixture/hello.txt` — canonical positive-operation input;
- `fixture/forbidden.txt` — file the host must be observed to allow before Yukh denies the composed operation;
- `fixture/host-denied.txt` — file Yukh allows but the host independently denies.

Two workflows keep evidence and CI cost separated:

- `.github/workflows/qualify-track-a-hosts.yml` owns the already-established runtime-substrate gate. Its PR trigger is limited to substrate pins, verifier code and `hello.txt`.
- `.github/workflows/qualify-track-a-a2.yml` owns A2 public-seam and native-control composition. It runs only when A2 config, executable code, fixtures or that workflow change. Superseded PR runs are cancelled so expensive goose compilation is not repeated for obsolete heads.

This separation is intentional: iterating on A2 must not rerun the expensive goose runtime-substrate suite merely because a composition probe changes. A2 still builds/installs enough of each pinned candidate to invoke its supported public entrypoint; it never reuses a prior PASS as proof of a new observation.

A Track A pull request is the preferred review-time observability path because its qualification run is directly attributable to the harness revision under review. Post-merge reruns are explicit through `workflow_dispatch`, not automatic on every push to `main`.
