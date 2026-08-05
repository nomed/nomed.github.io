# RFC-0005 — Yukh usage metering and cost governance

- **Status:** Proposed
- **Date:** 2026-08-05
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#35](https://github.com/nomed/nomed.github.io/issues/35)
- **Parent initiative:** [nomed.github.io#9](https://github.com/nomed/nomed.github.io/issues/9)
- **Affected repositories:** `nomed.github.io`, `yukh-coordination`, `yukh-mcp`, `yukh-projects`

## Summary

Yukh SHOULD account for AI-development usage as point-in-time, append-only
metering events. Each event is attributable to one provider/product, model,
session, agent role, and primary work reference. It records measured tokens and
an estimated cost calculated from an immutable, versioned rate card.

GitHub issues are the normal primary work reference. A bounded temporary work
item is allowed when an issue does not yet exist, provided it records a reason,
an accountable owner, and a terminal resolution. A temporary item cannot
authorize a consequential external mutation.

This RFC defines governance and public contracts only. It does not authorize
telemetry collection, a provider integration, a persistence backend, a GitHub
Project mutation, cost enforcement, or publication of individual usage data.

## Context

Yukh is built by people and agents working across sessions, providers, models,
and repositories. Aggregate chat or subscription usage cannot answer the
delivery questions that govern the suite:

- which independently verifiable work consumed a given amount of model usage;
- which sessions and agent roles contributed to an issue;
- which provider/model mix generated an estimate;
- whether unplanned exploration became governed delivery work;
- whether a cost claim can be reproduced from its measured inputs and rate
  card.

Attribution must not turn metering into authority. A claim, token count, cost
estimate, or budget alert does not accept delivery state, authorize a
capability, grant a credential, or choose an agent.

Current Copilot CLI session databases and inboxes are implementation details of
one runtime. They are not a Yukh telemetry contract and MUST NOT be scraped,
written, or relied upon as a production metering interface.

## Goals

- record one immutable usage event for each observable model request or other
  bounded provider usage unit;
- attribute every event to provider/product, model, session, agent role, and
  one primary work reference;
- distinguish measured token quantities from calculated cost estimates;
- support GitHub issues and governed temporary work items without inventing
  issue links;
- aggregate usage by issue, work item, agent role, model, provider, component,
  and time interval without exposing prompts or transcripts;
- make rate-card versions, missing measurements, corrections, and estimation
  confidence explicit;
- allow at least two independently implemented source adapters to conform to
  the same event contract.

## Non-goals

- collecting prompts, completions, chain-of-thought, tool output, credentials,
  raw session transcripts, or private repository data;
- using token count as a measure of developer value, agent quality, or human
  performance;
- creating a billing system, a chargeback system, or automatic budget
  enforcement;
- granting work ownership, Project acceptance, execution authority, or
  approval from a usage event;
- treating undocumented local runtime files, browser instrumentation, or
  reverse-engineered provider endpoints as a supported usage source;
- requiring every provider to expose identical token dimensions;
- changing existing component maturity claims.

## Decision

### Metering event

The logical event is an append-only `usage.metered.v1` record. An event
describes one measured provider request, or one explicitly bounded provider
usage unit when request-level measurement is unavailable.

The canonical contract includes:

| Field | Requirement |
| --- | --- |
| `eventId` | Globally unique immutable identifier. |
| `observedAt` | UTC time at which the source observed final usage. |
| `usageInterval` | Bounded start and end timestamps when the provider exposes them. |
| `source` | Provider, product, adapter version, model identifier, and measurement method. |
| `actor` | Restricted session reference and agent/role reference. |
| `work` | Exactly one primary issue or temporary-work-item reference. |
| `usage` | Input, output, cached, reasoning, and total tokens when available; absent dimensions are explicitly `unavailable`, never zero-filled. |
| `rateCard` | Immutable rate-card identifier, digest, currency, effective interval, and token dimensions used. |
| `estimate` | Deterministic amount in integer minor units, calculation version, and confidence. |
| `evidence` | Stable source receipt/reference and classification, without request or response content. |
| `supersedes` | Optional prior event identifier for a correction; records are never edited in place. |

The event uses integer token counts and integer minor currency units. Floating
point currency values are forbidden. If a provider cannot expose a required
measurement, the event records the available dimensions and an `unavailable`
estimate rather than fabricating a token count or cost.

### Attribution

Every metered event has exactly one primary work reference. It is either:

```text
github-issue:github.com/<owner>/<repository>#<number>
temporary-work-item:<issuer>/<opaque-id>
```

Related issue links may be retained as non-attributive context, but they do not
duplicate the event's usage into multiple issue totals. A future allocation
extension may split a single event only if every allocation is explicit and the
integer token and cost totals sum exactly to the original event.

`actor.sessionRef` and `actor.agentRef` are restricted operational identifiers,
not public display names. Public reporting uses aggregate or pseudonymous
views. A provider/product value such as `GitHub Copilot`, `ChatGPT`, or a local
runtime identifies the service category; it does not imply that the service
validated the attribution.

### Temporary work items

A temporary work item covers bounded discovery, triage, recovery, operational
overhead, or work that begins before a governing issue exists. It is created
before its first metered event and includes:

- opaque identifier and issuer;
- accountable human or agent role;
- stated purpose and reason no issue exists yet;
- start time and expiry/closure bound;
- parent issue, initiative, or component when known;
- terminal resolution: `linked_to_issue`, `closed_as_overhead`, or
  `rejected`.

A temporary work item MAY collect usage for analysis, but it MUST NOT authorize
an external mutation. A plan, apply, release, permission change, deployment,
or other consequential action remains governed by an accepted issue, plan, and
the owning component's approval rules.

The concrete token and duration limits, and the point at which a temporary item
must become an issue, are portfolio policy settings. They are not silently
inferred from a provider quota.

### Rate cards and estimates

Rate cards are immutable versioned records. A rate card specifies provider,
product, model matching rules, currency, effective interval, per-dimension
rates, calculation precision, and source/evidence classification. A usage
event binds the exact rate-card digest used to calculate its estimate.

Reported estimates are labelled as estimates unless reconciled against an
authoritative provider invoice under a separately accepted privacy and access
policy. A later rate-card change does not rewrite historical estimates; a
separate correction event may state a newly calculated estimate and its reason.

### Ownership boundaries

| Component | Owns | Must not do |
| --- | --- | --- |
| `yukh-coordination` | Neutral event/receipt semantics, work-reference correlation, handoff continuity, and replayable metering evidence references | Grant authority or treat a cost event as claim acceptance |
| `yukh-projects` | Portfolio-level aggregate views and explicitly authorized issue/work-item reconciliation | Store prompts, infer attribution, or mutate state from a Coordination event |
| `yukh-mcp` | Capability-specific usage evidence and policy-bound execution correlation | Select portfolio priority or make cost data execution authority |
| Source adapters | Provider-specific measurement and redaction under an explicit contract | Export provider credentials, raw content, or undocumented runtime internals |
| `nomed.github.io` | Cross-suite RFCs, aggregate maturity/cost-governance reporting, and evidence index | Become the raw metering datastore |
| Human owner | Accept rate-card policy, retention, budget policy, and consequential enforcement changes | Delegate acceptance through a threshold or silence |

## Security and privacy consequences

Metering introduces a new cross-suite identity, persistence, and financial-data
boundary. Before implementation, each owning component MUST add a threat-model
delta covering at least:

- attribution forgery, session/agent impersonation, and work-reference
  substitution;
- provider or adapter measurement errors, replay, duplicate events, and
  correction abuse;
- model/provider metadata revealing confidential projects, usage patterns, or
  identities;
- rate-card substitution, currency/precision errors, and misleading estimates;
- retention, deletion, restricted access, aggregate publication, and audit
  integrity;
- a malicious prompt or tool result attempting to change work attribution or
  expose a usage source credential.

Raw events are restricted operational data. Public records contain only
reviewed aggregates that cannot reveal private consumers, individual prompts,
credentials, or sensitive operational timing. Every adapter fails closed when
it cannot preserve the declared classification and bounded event shape.

## Compatibility and migration

The contract is additive. Existing sessions, issues, claims, Projects fields,
MCP capabilities, and provider integrations remain valid without a metering
adapter.

Adapters declare their supported dimensions. A source that can report only
total tokens must not claim input/output/cache/reasoning granularity. A source
with no authorized measurement path remains unsupported; manual estimates are
recorded only through a separately versioned evidence class.

No existing local session-store schema, undocumented CLI database, provider
browser surface, or private consumer integration becomes a compatibility
commitment under this RFC.

## Rollout and gates

### Phase 1 — contract and policy review

- accept this RFC;
- define the canonical schema, validation errors, redaction classes, and
  versioned rate-card format;
- decide temporary-work-item limits, restricted ledger retention, and aggregate
  reporting policy;
- complete component threat-model deltas.

**Gate:** two independent schema validators reject malformed, duplicate,
non-attributable, precision-invalid, and content-bearing events.

### Phase 2 — synthetic source qualification

- implement a network-free synthetic source adapter;
- verify deterministic estimate calculations from immutable synthetic rate
  cards;
- test duplicate, correction, unavailable-dimension, rate-card mismatch,
  expired temporary-item, and unauthorized-mutation cases.

**Gate:** a complete synthetic work item produces replayable aggregate totals
without a provider credential or content-bearing record.

### Phase 3 — first authorized provider adapter

- select one documented provider measurement interface;
- qualify restricted identity, redaction, retention, and source evidence;
- correlate a bounded read-only development slice with an existing issue;
- publish only approved aggregate evidence.

**Gate:** an independent verifier reproduces the event totals and estimates
from restricted evidence, and no prompt, credential, or raw transcript enters
the ledger.

### Phase 4 — portfolio aggregation

- expose reviewed aggregates by issue and component;
- reconcile temporary-item terminal resolutions;
- evaluate optional budget alerts as non-authoritative observations.

**Gate:** portfolio totals do not double-count multi-session or multi-model
work, and no alert can cause an automatic Project or execution mutation.

### Phase 5 — enforcement proposal, if justified

Any spend cap, admission control, approval requirement, chargeback, or
provider-routing decision requires a later RFC and threat-model review.

## Rollback

Before a provider adapter is enabled, rollback is declining this proposal.
After an adapter is enabled, disable ingestion and aggregation access while
retaining restricted evidence according to the accepted retention policy.

Rollback never edits or deletes an existing metering event to improve a total.
Corrections are append-only. Disabling metering cannot block a pre-existing
approved capability, Project operation, or Coordination handoff unless a later
accepted enforcement policy explicitly says otherwise.

## Completion evidence

This RFC is complete only when:

- the event and rate-card schemas are versioned and independently validated;
- two adapters or validators pass the same conformance corpus;
- temporary work-item creation, expiry, resolution, and issue-linking are
  deterministically testable;
- token and estimate totals are reproducible using integer arithmetic;
- privacy/redaction, duplicate, correction, and work-substitution tests pass;
- public reporting is aggregate-only and reviewed;
- the first provider adapter has independent restricted evidence.

## Unresolved decisions

1. Which documented provider interface becomes the first authorized metering
   source.
2. The restricted ledger location, retention period, and access model.
3. Temporary-work-item token and duration thresholds.
4. The initial currency and approved rate-card evidence source.
5. Whether and how a provider invoice may reconcile an estimate.
6. The minimum aggregation threshold for public reporting.
7. Whether a later budget-alert model is useful without creating a performance
   surveillance or execution-authority boundary.
