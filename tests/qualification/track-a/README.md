# Track A runtime qualification harness

This directory implements the executable part of issue #58. It is deliberately candidate-neutral: the same fixture and verifier are used for goose and Hermes Agent.

The first executable gate is **runtime-substrate qualification**. It proves that the pinned external source can be checked out, exposes the expected ACP/MCP and permission substrate, and can run candidate-owned tests around those surfaces without credentials. It does **not** prove Yukh/host authority composition.

The next gate is **A2 host composition**. Its accepted ordering begins by pinning and actually invoking the supported public entrypoint for each candidate before any native ALLOW/DENY control is claimed. The public-seam probe added here is that first executable slice. It deliberately fails closed: it may establish `READY_FOR_NATIVE_CONTROL_SLICE`, but it cannot emit an A2 PASS while native host controls remain `NOT_EXECUTED`.

A later A2 slice must exercise the canonical positive, Yukh-denial and host-denial operations using candidate-native observations. A deterministic credential-free local provider or equivalent reproducible public seam may be introduced only if it works through supported candidate configuration and does not disable native safety.

## Invariants

- no secrets or production credentials;
- no mutation outside the ephemeral runner workspace;
- no external Project apply or Yukh infrastructure deployment;
- external repositories are pinned by commit SHA;
- native safety controls are not disabled merely to make the fixture pass;
- generated evidence contains operational facts, never chain-of-thought;
- configuration/documentation cannot be promoted into an observed host decision;
- an adapter cannot invent or reconstruct candidate-native ALLOW/DENY;
- a failed or missing public seam is a valid qualification result.

## Files

- `candidates.json` — pinned candidate revisions and substrate inputs;
- `qualify.mjs` — runtime-substrate evidence writer;
- `verify-report.mjs` — runtime-substrate schema/invariant checks;
- `a2-config.json` — exact A2 public-entrypoint hypotheses and documented permission surfaces;
- `a2-public-seam-probe.mjs` — executes the pinned public CLI entrypoint and records public-contract evidence;
- `verify-a2-public-seam.mjs` — verifies that the seam evidence passes while all native control dimensions remain `NOT_EXECUTED`;
- `fixture/hello.txt` — canonical positive-operation input;
- `fixture/forbidden.txt` — file the host must be observed to allow before Yukh denies the composed operation;
- `fixture/host-denied.txt` — file Yukh allows but the host must independently deny in the later native-control slice.

Two workflows keep evidence and CI cost separated:

- `.github/workflows/qualify-track-a-hosts.yml` owns the already-established runtime-substrate gate. Its PR trigger is limited to substrate pins, verifier code and `hello.txt`.
- `.github/workflows/qualify-track-a-a2.yml` owns A2 public-seam and future A2 control slices. It runs only when A2 config, A2 executable code, A2 fixtures or that workflow change.

This separation is intentional: iterating on A2 must not rerun the expensive goose 320-test runtime-substrate suite merely because a composition probe changes. A2 still builds/installs enough of each pinned candidate to invoke its supported public entrypoint; it does not reuse a prior PASS as proof of a new A2 observation.

A Track A pull request is the preferred review-time observability path because its qualification run is directly attributable to the harness revision under review. Post-merge reruns are explicit through `workflow_dispatch`, not automatic on every push to `main`.
