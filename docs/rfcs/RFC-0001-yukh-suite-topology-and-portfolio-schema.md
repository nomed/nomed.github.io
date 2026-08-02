# RFC-0001 — Yukh suite topology, ownership, and portfolio schema

- **Status:** Proposed
- **Date:** 2026-08-02
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#3](https://github.com/nomed/nomed.github.io/issues/3)
- **Affected repositories:** `nomed.github.io`, `yukh`, `yukh-projects`, `yukh-mcp`, `yukh-coordination`

## Summary

The Yukh suite uses bounded repositories with explicit authority. `yukh-projects` succeeds the legacy `yukh` reconciler through its existing clean-room migration. `yukh-mcp` owns governed capabilities. `yukh-coordination` owns a non-authoritative coordination protocol. `nomed.github.io` owns cross-suite RFCs and public aggregation. GitHub Project 5 remains the shared portfolio and delivery control plane.

This RFC does not authorize repository, Project, issue, workflow, release, tag, permission, or secret mutations.

## Context

The current public repositories already express three distinct product boundaries:

- Yukh MCP gives agents governed capability rather than custody of credentials.
- Yukh Projects reconciles reviewed configuration into GitHub Projects state and is performing a behavior-led clean-room migration.
- Yukh Coordination makes cross-session work observable without becoming a supervisor or source of authority.

The existing `nomed/yukh` repository publishes the reconciliation Action consumed by `yukh-mcp`, but it is designated for deprecation after a compatible successor is verified. GitHub Project 5 already describes itself as the public Yukh portfolio and classifies work as MCP, Projects, Coordination, Shared, or Legacy.

An MCP-specific bootstrap plan is currently suspended. Its last reviewed dry-run proposed creating `Area` and `Work Type`, adding `P3` to `Priority`, and adding `Blocked` to `Status`. No Project apply was performed.

## Goals

- establish durable cross-repository ownership;
- prevent duplicate or ambiguously named components;
- define the migration boundary from `yukh` to `yukh-projects`;
- preserve Project 5 as a coherent suite portfolio;
- decide which portfolio fields are shared and how repository-specific classification is represented;
- define how to evaluate Coordination before introducing any authoritative coordinator.

## Non-goals

- implementing or copying reconciler code;
- accepting the Yukh Coordination protocol;
- creating an orchestration service;
- applying Project schema or issue reconciliation;
- renaming, creating, deprecating, or archiving repositories;
- publishing or moving releases and tags.

## Confirmed decisions

The owner has confirmed the following direction. These decisions become authoritative only if this RFC is accepted.

### Repository topology

| Repository | Responsibility | Authority boundary |
| --- | --- | --- |
| `nomed/yukh-mcp` | Policy-governed MCP capability gateway | Authorizes and executes only explicitly modeled capabilities under its own security model |
| `nomed/yukh-projects` | Declarative GitHub Projects reconciliation | Plans and applies only explicitly authorized repository and Project state |
| `nomed/yukh-coordination` | Cross-session coordination protocol | Communicates claims, progress, evidence, review, and handoff; grants no project or execution authority |
| `nomed/nomed.github.io` | Public suite surface and cross-suite RFCs | Publishes reviewed facts and decisions; does not own component runtime behavior |
| `nomed/yukh` | Legacy reconciliation implementation | Maintains compatibility during migration; receives no new strategic product authority |

`nomed/yukh-projects` is the intended successor to `nomed/yukh`.

### Portfolio

GitHub Project 5 remains the shared Yukh portfolio and delivery control plane. Issues remain owned by their source repositories. The Project owns cross-suite portfolio status, priority, sequencing, component classification, and dates.

### Cross-suite records

Cross-suite RFCs live under `docs/rfcs/` in `nomed.github.io`. Component-specific ADRs, RFCs, threat models, contracts, and release evidence remain in their owning repositories.

## Proposed portfolio schema

### Suite-wide fields

The following fields have consistent portfolio meaning and SHOULD be shared:

| Field | Purpose |
| --- | --- |
| `Component` | MCP, Projects, Coordination, Shared, or Legacy |
| `Status` | Portfolio workflow state |
| `Priority` | Cross-suite delivery priority |
| `Size` | Relative delivery size |
| `Estimate` | Numeric planning estimate |
| `Iteration` | Shared planning cadence |
| `Work Type` | Epic, Gate, Feature, Task, Bug, or Technical Debt |
| `Start date` / `Target date` | Portfolio scheduling |

Existing values are preserved unless a separately reviewed migration explicitly changes them.

### Area classification

`Area` is unresolved. The current MCP vocabulary does not cover Projects and Coordination completely. Three alternatives were considered:

1. one shared, bounded cross-suite `Area` taxonomy;
2. one area field per component;
3. repository-local area labels without a shared Project field.

This RFC recommends alternative 1 because it supports cross-suite filtering without producing mostly empty component-specific columns. The initial candidate vocabulary is:

- Governance
- Security
- Architecture
- Contracts
- Protocol
- Runtime
- Integration
- Reconciliation
- Provider
- Audit
- Conformance
- Delivery
- Documentation
- Release

Before acceptance, this vocabulary MUST be checked against the active backlogs of MCP, Projects, and Coordination. Ambiguous items MUST remain unmapped rather than receiving guessed values.

### Schema ownership

No individual consumer repository may unilaterally expand a suite-wide field. A schema change requires:

1. a cross-suite issue or RFC amendment while this RFC is Proposed;
2. an exact bootstrap dry-run;
3. review of every create, update, preserve, rename, and delete operation;
4. explicit human approval before apply;
5. a second identical apply proving zero remaining operations.

Repository policy may validate stricter local subsets while mapping to the shared portfolio vocabulary.

## Coordination versus coordinator

The existing Yukh Coordination boundary is intentionally non-authoritative. It provides observable communication and evidence but does not select agents, grant credentials, approve plans, invoke capabilities, or infer ownership transfer.

Before creating an authoritative coordinator, evaluate whether the desired use cases can be satisfied by:

- Yukh Coordination for claims, progress, questions, review, and handoff;
- Project 5 for portfolio state and priority;
- Yukh MCP for capability authorization and execution;
- explicit human or repository governance for acceptance.

A separate coordinator is justified only if a concrete requirement needs authority not owned by those components. Any such proposal requires its own RFC and threat model covering identity, authorization, credential custody, delegation, replay, confused-deputy risk, persistence, and emergency shutdown.

## Legacy migration

### Phase 0 — freeze strategic expansion

- keep `nomed/yukh` supported at its last verified compatibility line;
- direct new product design to `yukh-projects`;
- do not move tags or rewrite historical releases.

### Phase 1 — clean-room capability migration

- follow the accepted neutrality and migration rules in `yukh-projects`;
- re-author from public behavior specifications;
- use entirely synthetic fixtures;
- migrate pure parsing and planning before any GitHub adapter or mutation path.

### Phase 2 — read-only compatibility

- publish a bundled, immutable, read-only preview from `yukh-projects`;
- verify dry-run behavior against synthetic consumers;
- publish contract and diagnostic compatibility differences.

### Phase 3 — controlled apply compatibility

- specify least-privilege permissions, apply gates, retries, partial failure, rollback, and convergence;
- prove a repeated identical apply produces zero additional operations;
- publish provenance, checksums, and a software bill of materials.

### Phase 4 — consumer migration

- update consumers through reviewed pull requests from immutable legacy pins to immutable `yukh-projects` release commits;
- run dry-run first and review exact drift;
- retain a tested rollback pin for the supported transition window.

### Phase 5 — deprecation and archival

- publish a deprecation notice and final support window in `nomed/yukh`;
- stop new feature work;
- archive only after known consumers have migrated or explicitly accepted the risk;
- preserve issues, releases, tags, and history as evidence.

## Rollback

Before legacy archival, a consumer can roll back by restoring its last verified immutable `nomed/yukh` commit and returning to dry-run. A failed `yukh-projects` migration does not authorize tag movement, history rewriting, Project field deletion, or silent contract downgrade.

Project schema additions are treated as persistent until a separately reviewed destructive migration is approved. This RFC therefore keeps the current bootstrap suspended until `Area` and schema ownership are accepted.

## Security consequences

- The clean-room successor introduces a new source-to-release trust path and must update its threat model as adapters and mutations enter.
- Cross-suite governance must not become authorization by implication.
- Coordination evidence remains untrusted until independently verified.
- A future authoritative coordinator would create identity, delegation, persistence, and confused-deputy boundaries absent from the current protocol.
- Migration credentials remain isolated per consumer and never enter suite RFCs or public examples.

## Compatibility consequences

- `nomed/yukh@v0.9.1` remains the current verified legacy release until a successor release passes explicit compatibility gates.
- `yukh-mcp` remains pinned to an immutable legacy commit during the transition.
- Contract or diagnostic incompatibilities require release notes and a consumer migration plan.
- Repository names and package identifiers do not change through this RFC alone.

## Acceptance gates

Before this RFC can be accepted:

- [ ] validate the proposed shared fields against all three active component backlogs;
- [ ] accept, revise, or reject the shared `Area` vocabulary;
- [ ] document the concrete coordination use cases and show whether the current non-authoritative protocol covers them;
- [ ] identify known consumers of `nomed/yukh` without publishing private adopter information;
- [ ] define the legacy support window and minimum rollback period;
- [ ] obtain explicit human acceptance in the governing issue or pull request.

## Immediate effect while Proposed

- Project 5 bootstrap and reconciliation apply remain suspended.
- No new `yukh-project` or `yukh-coordinator` repository is created.
- Existing repository names and authority boundaries remain unchanged.
- Read-only analysis and dry-runs may continue when they cannot mutate external state.
