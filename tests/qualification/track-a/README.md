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
- `fixture/hello.txt` — deterministic input reserved for the later model-driven common fixture.

The workflow `.github/workflows/qualify-track-a-hosts.yml` can be dispatched manually. It is also path-aware on pull requests: it runs when the workflow, candidate pins, executable verifier scripts, or deterministic fixture change. Evidence-only and explanatory documentation changes do not run the qualification, so ordinary site and record updates do not pay the runtime cost.

A Track A pull request is the preferred review-time observability path because its qualification run is directly attributable to the harness revision under review. Post-merge reruns are explicit through `workflow_dispatch`, not automatic on every push to `main`.
