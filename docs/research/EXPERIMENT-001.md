# EXP-001 — neutral multi-project agent-delivery benchmark

**Status:** Protocol proposed, not executed. **Date:** 2026-10-24.

## Fixture

Two unrelated repositories and customer engagements A and B; three issues with explicit acceptance criteria; two coding agents; one supervisor; one human reviewer; one test failure; one simulated worker crash; traceable model usage, host consumption and project allocation.

No current Yukh protocols, services or schemas are installed. Projects must be independently created in a clean workspace.

## Scenario

1. Ingest one GitHub issue and one Jira issue, correlate external IDs without changing either's authoritative state without permission.
2. Assign two isolated tasks, run concurrently on local or VPS workers using supported CLI/SDK modes.
3. Observe a duplicate assignment and worker restart; document loss or recovery of state.
4. Produce branches, CI results, pull requests and review evidence.
5. Require explicit human acceptance before merge; document denied actions.
6. Reconcile token usage, subscription allocation, API charges and VPS cost separately; derive cost per issue and commessa with uncertainty bounds.
7. Compare build, integrate and commercial alternatives on the same fixture.

## Measurements

- Work items delivered and independently accepted; elapsed time; manual intervention count
- Identity and authorization boundaries; uncontrolled side effects and secret exposure
- Resume accuracy; duplicate action rate; state/evidence durability
- Cost coverage ratio, missing usage, estimated vs actual charges
- Deployment burden, provider portability, licenses, recoverability

No results can be marked PASS without raw logs, source revisions, repeatable command transcripts and independent assertions. Do not use developer subscription credentials on a remote shared worker without verifying provider entitlement and security policies.
