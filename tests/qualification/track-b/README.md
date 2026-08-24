# Track B — durable execution qualification

Track B asks whether durable execution can remain replaceable machinery beneath Yukh coordination semantics.

The first candidate is pinned to:

- `apache/maka@8fd33df4bb26cadff93d38f3d824ae0760a4d01d`

The governing contract is issue #74.

## First gate: public recovery preflight

Before executing a crash/recovery scenario, the harness verifies that the pinned candidate exposes enough **supported public surface** to make the scenario meaningful without candidate patching, private APIs, or undocumented state mutation.

At the pinned revision Maka exposes real public `run --resume`, `--continue`, and `--graph` surfaces and substantial durable recovery foundations. Its own controlled-model release smoke, however, configures a deterministic provider by importing internal `@maka/storage` runtime-policy APIs, while the public CLI documentation describes interactive provider setup.

The recovery architecture file present at the pin is marked current but was last verified on 2026-07-28. It documents the production Phase 3 reconciler / complete host-owner lifecycle as future work and Phase 4 workspace checkpoint recovery as not implemented. Track B records those as **documented gaps requiring executable revalidation**, not as proof that every newer code path is absent.

Therefore the first gate is intentionally **fail-closed**: it records `PARTIAL` rather than using internal storage APIs or stale documentation assumptions to manufacture a crash/recovery PASS.

A PARTIAL result is a valid qualification outcome. It means Maka remains a credible durable-execution candidate, but Yukh does not yet adopt or qualify it as default machinery.

## Yukh authority boundary

Maka RuntimeEvents, sessions, Graph state, and recovery projections are candidate-owned execution context. They are not Yukh authority, accepted work state, or evidence truth.

The external Yukh checkpoint remains limited to:

- `participant_id`;
- `work_uri`;
- `capability_id`;
- `evidence_run_id`.

A later executable crash/recovery probe may proceed only when a supported public deterministic/non-interactive provider bootstrap exists and the uncertain-side-effect recovery boundary can be tested through supported public behavior at a pinned revision.
