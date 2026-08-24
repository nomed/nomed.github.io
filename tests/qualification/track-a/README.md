# Track A runtime qualification harness

This directory implements the executable part of issue #58. It is deliberately candidate-neutral: the same fixture and verifier are used for goose and Hermes Agent.

The first executable gate is **runtime-substrate qualification**. It proves that the pinned external source can be checked out, exposes the expected public ACP/MCP and permission surfaces, and can run candidate-owned tests around those surfaces without credentials. It does **not** claim that model-driven end-to-end execution has happened.

A later gate may exercise the complete agent loop only when a deterministic credential-free provider or other equally reproducible public seam is available for both candidates. Until then, model-dependent dimensions remain `NOT EXECUTED` rather than being simulated.

## Invariants

- no secrets or production credentials;
- no mutation outside the ephemeral runner workspace;
- no external Project apply or Yukh infrastructure deployment;
- external repositories are pinned by commit SHA;
- native safety controls are not disabled merely to make the fixture pass;
- generated evidence contains operational facts, never chain-of-thought;
- a failed candidate is a valid result.

## Files

- `candidates.json` — pinned candidate inputs and public seams;
- `qualify.mjs` — common verifier and evidence writer;
- `verify-report.mjs` — schema/invariant checks for generated reports;
- `fixture/hello.txt` — deterministic operation input.

The workflow `.github/workflows/qualify-track-a-hosts.yml` can be dispatched manually. It also runs on pull requests only when the Track A workflow or harness itself changes, so ordinary editorial/site PRs do not pay the qualification cost. Each candidate produces its own evidence artifact even when its runtime gate fails.