# RFC-0005 — First usable Yukh suite preview

- **Status:** Accepted
- **Date:** 2026-08-09
- **Accepted:** 2026-08-09 by `@nomed`
- **Owner:** `@nomed`
- **Governing issue:** [#40](https://github.com/nomed/nomed.github.io/issues/40)
- **Affected repositories:** `nomed.github.io`, `yukh-projects`, `yukh-mcp`, `yukh-coordination`

## Summary

The first usable Yukh suite release will be a public, explicitly
non-production preview. It will run the accepted
[RFC-0003](RFC-0003-yukh-reference-architecture-and-minimum-runtime.md)
minimum vertical slice in an ephemeral, containerized sandbox with NATS
JetStream.

The preview will prove two distinct consequential effects on synthetic GitHub
Projects state:

1. a separately planned and approved Yukh Projects reconciliation; and
2. a separately planned and approved Yukh MCP capability whose bounded provider
   performs a different allowlisted Yukh Projects mutation.

The two effects share a sandbox and compatibility profile, but they do not
share plans, approvals, authorization decisions, precondition snapshots,
idempotency keys, verifiers, credentials, or audit event chains. This preserves
RFC-0003 steps 8 and 9 as independent authority boundaries.

## Context

The three components have independently delivered much of the required
foundation:

- Yukh Coordination has a protocol, reference relay, JetStream adapter,
  bootstrap and bounded nonce and lease primitives;
- Yukh Projects has an immutable `v1.7.0` release with deterministic planning,
  provider routing and controlled-apply contracts; and
- Yukh MCP has deny-by-default contracts, a provider-neutral lifecycle,
  repository-local durable audit and a synthetic mutation qualification.

These foundations do not yet form a supported suite path. Coordination
deployment and client connection remain gated. Projects has not completed a
consumer-owned sandbox qualification. The ordinary MCP gateway remains inert
and has no registered mutation capability.

Connecting the components without a cross-suite decision could silently turn a
Coordination message into approval, let a Projects workflow bypass MCP
admission, or let MCP redefine Projects reconciliation semantics. This RFC
freezes the minimum preview boundary before those integrations are enabled.

## Goals

- complete RFC-0003 minimum vertical slice steps 1 through 10;
- publish one reproducible, public and explicitly non-production gold path;
- qualify JetStream against the deterministic Coordination reference adapter;
- reconcile one separately approved Projects change;
- execute one separately approved MCP capability against a different synthetic
  Projects target;
- preserve component authority through exact, independently verifiable
  bindings;
- fail closed before effect on stale, substituted, replayed or ambiguous input;
- produce structurally redacted receipts, audit records and release evidence;
- reproduce the complete path twice from clean environments before release.

## Non-goals

- production readiness, availability or support claims;
- production or adopter data;
- federation, multi-region operation or hardened multi-tenancy;
- a general-purpose GitHub, GraphQL, shell, SSH or container capability;
- Matrix bridge delivery;
- autonomous approval or acceptance;
- using Coordination delivery, a broker acknowledgement, workflow dispatch or
  environment review as execution authority;
- automatic retry after an unknown provider outcome;
- replacing component-local release, security or operational records.

## Decision

### Preview profile

The profile is an ephemeral sandbox assembled only from immutable candidate
artifacts. It contains:

- a Yukh Coordination relay and primitives service;
- NATS JetStream behind relay-owned ports;
- two isolated client sessions with independently attributable participants;
- one dedicated GitHub repository, Project and synthetic issue set;
- the Yukh Projects planner and controlled-apply entrypoints;
- the Yukh MCP gateway, lifecycle, audit store and one bounded Projects
  capability provider; and
- an approval and credential materialization boundary outside the workload
  being approved.

The public profile records artifact digests and logical bindings, not private
infrastructure identifiers, credentials, provider responses or unrestricted
transcripts.

### Two effects, not one combined effect

One resulting Projects mutation cannot satisfy both RFC-0003 steps 8 and 9.
Step 8 proves that Projects can reconcile reviewed delivery state under its own
plan and approval. Step 9 proves that MCP can admit and execute a modeled
capability under its own policy and evidence lifecycle.

The preview therefore uses two distinct synthetic targets or two disjoint
operation sets:

- **Effect A — Projects reconciliation:** planned, approved, applied and
  verified directly through the accepted Projects boundary.
- **Effect B — MCP capability:** planned and admitted through MCP; its provider
  invokes an immutable Projects controlled-apply entrypoint for a different
  allowlisted mutation.

Effect A does not approve Effect B. Effect B does not reinterpret Effect A.
Success of either is only evidence for that effect.

### Authority matrix

| Function | Authority |
| --- | --- |
| Record attributed coordination statements | Coordination |
| Sequence, receipt, replay and project Coordination events | Coordination relay |
| Issue bounded nonce and fenced lease results | Coordination primitives |
| Observe GitHub Projects state and create a reconciliation plan | Projects |
| Define Projects mutation and convergence semantics | Projects |
| Evaluate and admit the MCP capability | MCP |
| Invoke the bounded provider after admission | MCP |
| Verify the MCP capability postcondition and release its result | MCP verifier |
| Approve each exact plan or capability | Independent human-governed approval authority |
| Accept component releases and this suite preview | Human and repository governance |

Coordination may communicate approval references but cannot issue, infer or
upgrade them. Projects cannot infer approval from MCP admission. MCP cannot
infer admission from a Projects plan, apply result or environment review.

### Exact bindings

Each effect binds, at minimum:

- repository, Project, item and operation-set scope;
- policy commit and immutable producer release;
- fresh precondition snapshot identity;
- plan identifier and canonical plan digest;
- ordered operation-set digest;
- capability definition and provider implementation digest where MCP applies;
- environment and protected workflow identity;
- approval issuer, subject, issue time, expiry and unique nonce;
- component-scoped idempotency key;
- Coordination epoch and fenced lease identity where required; and
- verifier identity and declared postconditions.

Bindings are canonical and equality-checked before effect. A changed policy,
snapshot, release, target, plan, operation set, capability, environment,
approval, nonce, lease or verifier requires a new plan and approval.

The two effects use distinct values for every authority-bearing binding. A
shared compatibility matrix or evidence index is not an authority-bearing
binding.

### Credential materialization

The preview uses the accepted OIDC-bound, one-shot materialization shape:

1. the protected workflow obtains an OIDC assertion with an exact audience;
2. a fixed materializer verifies repository, workflow, environment, commit,
   run, attempt, plan and expiry bindings;
3. the materializer returns one closed, size-bounded package containing
   distinct short-lived read and write credentials, the exact approval,
   selected public trust root and host capsule;
4. secrets are masked before any consumer step and exposed only through private
   runtime files or equivalently bounded local handles; and
5. an unconditional finalizer removes runtime material.

No workload receives broker credentials. No credential is accepted from
repository content, dispatch input, fallback discovery or a manually supplied
general-purpose token. Retrieval is atomic and one-shot; refresh, redirect,
polling and retry are forbidden.

### Failure semantics

The preview uses one attempt per approved effect.

- Authorization, approval, audit admission, nonce consumption and lease
  acquisition fail closed before provider invocation.
- A stale snapshot, substituted binding, expired approval, replayed nonce,
  unavailable audit sink or lost lease prevents effect.
- A provider acknowledgement is not verification.
- Verification independently re-observes the target and compares the declared
  postconditions.
- A provider crash, timeout or lost response after possible effect produces
  `completion_unknown`; it is never retried automatically.
- Recovery requires operator reconciliation and, if another effect is needed,
  a fresh plan, approval, nonce, lease and idempotency key.
- Restore is a separately planned and approved capability, not implicit undo.

### Coordination semantics

The reference and JetStream adapters run the same versioned corpus. The
distributed profile must preserve canonical event bytes, relay sequencing,
idempotent receipts, concurrent claim conflict, transcript epochs, handoff
compare-and-set and cursor replay.

JetStream subjects, credentials, offsets, consumers and storage keys remain
private adapter details. Agent clients and MCP or Projects integrations receive
only the versioned Coordination API and bounded primitive results.

## Minimum mission thread

Two clean, isolated sessions must:

1. create or discover one channel with explicit ACL and retention policy;
2. join and publish presence;
3. append concurrent claims and observe the canonical conflict projection;
4. exchange a question, answer, progress and immutable evidence descriptor;
5. publish independent evidence verification and a review verdict;
6. offer one handoff, accept it atomically and reject a stale competitor;
7. establish the successor claim and explicitly release the source claim;
8. execute Effect A through a fresh Projects plan and independent approval;
9. execute Effect B through a fresh MCP plan, authorization and independent
   approval;
10. publish only bounded evidence references for both effects;
11. disconnect, reconnect from a cursor and reproduce the same final
   Coordination projection; and
12. restore or tear down the sandbox and verify the declared final state.

Steps 8 and 9 may run in the same test window but neither may consume the
other's authority-bearing artifacts.

## Adversarial qualification

The candidate must demonstrate deterministic outcomes for:

- duplicate publication and at-least-once redelivery;
- reconnect and cursor recovery;
- concurrent claims and valid, stale and competing handoff acceptance;
- cross-tenant or cross-channel access denial;
- policy, target, provider, verifier and operation-set substitution;
- expired approval, nonce replay and lease contention or loss;
- audit unavailability before effect;
- provider rejection with proven no effect;
- provider crash, timeout and unknown completion;
- verification mismatch and remaining drift;
- exact idempotent replay without a second effect;
- credential and runtime cleanup failure; and
- restore success, failure and ordering.

Every negative case has an expected stable error class, declared effect status
and evidence outcome. Tests must prove absence of provider invocation where the
failure is required to occur before effect.

## Security consequences

- Identity is bound to exact workflow and workload claims before credentials
  are materialized.
- Read and write credentials are distinct, short-lived and scoped to their
  exact phase.
- Broker credentials remain relay-side.
- Approval and plan substitution are prevented by canonical signatures and
  exact equality checks.
- Nonce consumption and fenced leases do not grant approval; they only enforce
  replay and concurrency properties.
- Audit admission is mandatory before effect and cannot be reconstructed from
  workflow logs.
- Public evidence excludes tokens, keys, approval contents, provider payloads,
  private observations, URLs, infrastructure identifiers and timestamps that
  disclose private operations.
- Ephemeral infrastructure reduces persistence but does not remove host,
  hypervisor, identity-provider, GitHub or operator compromise risk.
- Residual risks and the threat-model delta require explicit owner acceptance
  at Operational Readiness Review.

## Repository ownership

| Repository | Preview responsibility |
| --- | --- |
| `nomed.github.io` | This RFC, governing issue, compatibility matrix, maturity statement and suite evidence index |
| `yukh-coordination` | Sandbox relay profile, client bootstrap, JetStream qualification, receipts, replay and operator instructions |
| `yukh-projects` | Effect A policy, plan, apply, verification, restore and immutable producer release evidence |
| `yukh-mcp` | Effect B capability, authorization, provider, audit, verification, restore and gateway release evidence |

Component threat models, contracts, implementation, tutorials and release
artifacts remain in their owning repositories.

## Compatibility and versioning

The preview publishes a compatibility matrix containing exact immutable
component versions, artifact digests and protocol or contract versions.

A component may publish a successor candidate without forcing a suite release.
The suite profile changes only after the complete mission thread passes with the
new matrix. Existing releases and evidence are never rewritten or retagged.

The original `yukh` reconciler remains a compatibility implementation under the
transition rules of RFC-0001. This preview does not shorten that transition or
authorize a consumer migration.

## Delivery gates

### Gate 1 — concept review

- the governing issue, mission thread, stakeholders, non-goals and risks exist;
- the two-effect authority model is explicitly accepted or revised;
- each repository confirms ownership without importing another component's
  authority.

### Gate 2 — contract review

- schemas, canonical bindings, transitions, stable failure classes and evidence
  ownership are versioned;
- independent adapters can implement the Coordination and provider contracts;
- adversarial fixtures can falsify authority collapse and binding substitution;
- component threat-model deltas are reviewed.

### Gate 3 — test readiness

- reference implementations and synthetic semantic oracles pass;
- the JetStream sandbox and both effect paths are reproducible from immutable
  inputs;
- rollback or restore, cleanup and resource bounds are explicit;
- duplicate, reorder, reconnect, denial, contention, partial failure and
  unknown-completion cases have deterministic expected outcomes.

### Gate 4 — operational readiness

- the full mission thread passes against candidate release artifacts;
- receipts, audit chains, plan and projection digests are independently
  verified;
- operator and rollback instructions contain no undocumented manual step;
- unresolved risks have named owners and explicit acceptance or deferral;
- a second clean reproduction produces the same declared outcomes; and
- maturity and limitation claims match the evidence.

Only Gate 4 acceptance authorizes publication of compatible preview tags and a
suite gold path. It does not authorize production use.

## Release artifacts and evidence

Each component publishes artifacts required by its own release policy,
including checksums, software bill of materials and provenance where supported.
The suite evidence index references, rather than copies:

- immutable source and artifact digests;
- component test and conformance results;
- reference-versus-JetStream comparison;
- redacted plan, operation count and terminal status for each effect;
- audit and receipt verification outcomes;
- reconnect projection digest;
- restore or teardown verification;
- first and second clean reproduction records;
- compatibility matrix, runbooks, rollback and known limitations.

Raw credentials, approval envelopes, provider responses, private observations
and unrestricted transcripts are never release artifacts.

## Rollback

Before acceptance, rollback is declining this proposal; component foundations
remain unchanged and inert integrations remain disabled.

During qualification, the sandbox may be discarded without changing public
contracts. A failed distributed adapter records a spike result and falls back
to the deterministic reference adapter; it does not gain a compatibility
claim.

After preview publication:

- each component may return to its last verified immutable artifact;
- the suite site may withdraw the gold-path link and mark the matrix unsupported;
- synthetic target state is reconciled or restored through a new reviewed plan;
- releases, evidence and failure records remain immutable.

Rollback never reuses an approval, nonce, lease, plan or credential.

## Completion evidence

This RFC is implemented only when:

- RFC-0003 minimum vertical slice steps 1 through 10 pass with distinct Effect A
  and Effect B evidence;
- reference and JetStream adapters produce canonically equivalent protocol
  outcomes;
- both effects converge and a fresh second observation reports zero drift;
- every required pre-effect denial proves zero provider calls;
- ambiguous completion produces durable recovery evidence and no automatic
  retry;
- reconnect reproduces the same canonical projection digest;
- audit and receipt chains verify independently and pass structural redaction;
- restore or teardown reaches the declared final state;
- all component, contract, conformance and cross-suite candidate tests pass;
- two clean reproductions require no undocumented intervention; and
- immutable artifacts, compatibility matrix, runbooks, rollback, limitations
  and the evidence index are public.

## Unresolved decisions

1. The exact synthetic repository, Project, item and disjoint operation sets for
   Effect A and Effect B.
2. The exact MCP capability name and version.
3. The component preview version numbers and compatibility-matrix identifier.
4. Whether the sandbox orchestration artifact is owned by Coordination or is a
   suite test harness referenced from this repository.
5. Which independent verifier performs the second clean reproduction.

These choices require reviewed component records or the governing issue. They
do not permit implementation to weaken the authority or security boundaries in
this proposal.

## Acceptance record

The owner accepted this RFC on 2026-08-09, including the two-effect authority
model that preserves RFC-0003 steps 8 and 9 as independently planned, approved,
authorized, verified and audited effects.

Acceptance authorizes component planning and implementation within the
repository ownership and delivery gates defined here. It does not authorize
deployment, credential creation, live mutation, preview publication or
production use.
