# RFC-0003 — Yukh reference architecture and minimum runtime

- **Status:** Proposed
- **Date:** 2026-08-03
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#29](https://github.com/nomed/nomed.github.io/issues/29)
- **Affected repositories:** `nomed.github.io`, `yukh-projects`, `yukh-mcp`, `yukh-coordination`

## Summary

Yukh will be developed as a protocol-first system of bounded components. The Yukh Coordination protocol and conformance corpus form the coordination kernel. Clients use a transport-neutral Coordination API; relay persistence and messaging remain behind explicit ports. Projects retains accepted delivery state, MCP retains execution authority, and a coordinator remains a non-authoritative participant.

The first distributed runtime candidate is NATS JetStream, evaluated against a deterministic reference adapter. IRC and Matrix are presentation bridges only. This RFC proposes the architecture and the experiment that may accept or reject NATS; it does not yet select a production broker or authorize infrastructure deployment.

## Context

RFC-0001 separated the suite into governed execution, durable project state, and non-authoritative coordination. Yukh Coordination has since defined a versioned envelope, canonicalization, relay-local ordering, deterministic projections, receipts, evidence verification, claim conflicts, and handoff semantics.

The existing protocol establishes two constraints that the runtime architecture must preserve:

1. concurrent claim assertions are accepted and deterministically projected as `conflicting`; a relay does not select or reject a claimant to manufacture exclusive ownership;
2. `handoff_accept` is the core transactional compare-and-set boundary; ordinary claim append is not a lock operation.

Choosing a broker before preserving these semantics would allow infrastructure conventions to redefine the protocol accidentally.

## Goals

- define the minimum logical and deployment architecture needed for an end-to-end slice;
- preserve protocol and authority semantics across storage and transport adapters;
- provide a deterministic reference implementation and a realistic distributed implementation;
- make reconnect, replay, duplicate delivery, concurrent claims, and handoff races testable;
- connect Coordination, Projects, MCP, and immutable evidence without merging their authority;
- support model-provider-neutral clients and optional human-readable bridges;
- produce the evidence needed to establish a runtime gold path.

## Non-goals

- accepting NATS, RabbitMQ, Matrix, IRC, PostgreSQL, or another product as the production platform;
- creating a privileged autonomous supervisor;
- changing the accepted Yukh Coordination 0.1 envelope or transition semantics;
- making coordination messages authoritative project mutations;
- granting MCP capability through message delivery;
- storing model chain-of-thought or unrestricted session transcripts;
- solving public federation, multi-region availability, or hardened multi-tenancy in the first slice;
- adding a repository before an ownership gap is demonstrated.

## Architecture principles

### Protocol, not broker

The public contract consists of Yukh events, receipts, projections, errors, and evidence. Broker subjects, exchanges, queues, offsets, consumer names, and storage keys are private adapter details.

### Append, then derive

The relay authenticates and authorizes the caller, validates the canonical event, atomically appends the event with its principal binding and relay sequence, and returns a receipt. Read models are deterministic projections over accepted transcripts. A projection may be rebuilt without changing the transcript.

### Conflict is observable state

The relay admits valid concurrent claims within the protocol resource bound. It does not implement an exclusive claim registry. The work projection exposes `conflicting` until attributed lifecycle events resolve the active set.

### Authority stays bounded

- Coordination records attributed statements and receipts.
- Projects owns reviewed portfolio and delivery state.
- MCP evaluates and executes modeled capabilities under policy.
- Evidence verification records what a verifier observed.
- The human owner accepts suite-level governance changes.

No acknowledgement, timeout, silence, coordinator recommendation, or projection alone crosses those boundaries.

### Coordinator as replaceable participant

A coordinator may consume projections, detect collisions, propose work, ask questions, and request review. It uses the same attributed protocol as other participants, receives no implicit mutation capability, and can disappear without losing authoritative state.

## Logical architecture

```text
Codex  Claude  Gemini  human clients  IRC/Matrix bridge
   \      |      /          |               /
             client adapters
                    |
       Coordination API / streaming port
                    |
 authenticate -> authorize -> validate -> append -> receipt
                    |
      relay persistence and subscription ports
             /                      \
 deterministic reference       distributed adapter
             \                      /
        canonical transcript and projections
                    |
       +------------+-------------+
       |                          |
 Projects integration       MCP integration
 accepted delivery state    governed capability
       \                          /
          immutable evidence refs
```

## Runtime ports

The exact language interface is component-local, but every adapter must support these semantic operations:

| Operation | Required semantics |
| --- | --- |
| `createChannel(metadata, retentionPolicy)` | Persist immutable tenant/channel binding before the first event |
| `append(event, principalContext)` | Atomic validation result, principal binding, sequence, idempotency record, and signed receipt |
| `read(channel, cursor, limit)` | Scoped ordered replay with integrity-protected cursor and transcript completeness |
| `subscribe(channel, cursor)` | Recoverable delivery; duplicates are permitted and handled by protocol idempotency |
| `project(channel, work, asOf)` | Deterministic canonical projection from accepted events |
| `acceptHandoff(command, expectedBoundary)` | Transactional CAS over the exact protocol handoff preconditions |
| `export(channel, epoch)` | Explicit completeness and lifecycle metadata; never manufacture continuity |

`claim` uses `append`; it is deliberately not a CAS operation.

## Adapter strategy

### Reference adapter

The reference adapter optimizes for determinism and inspectability. It runs in memory for conformance and may use SQLite for a single-node integration environment. It is the executable semantic oracle, not the production scalability claim.

### Distributed candidate: NATS JetStream

The first distributed spike will map accepted events to a replicated JetStream stream and recoverable subscriptions to durable consumers. Adapter code must handle at-least-once delivery and may use JetStream atomic primitives only where the Yukh protocol already requires a transaction, such as handoff acceptance or immutable channel creation.

NATS Key/Value must not become an exclusive claim lock. If the adapter cannot preserve accepted concurrent claims, contiguous relay sequencing, idempotent receipts, transcript epochs, and handoff CAS, the spike fails.

### IRC and Matrix

IRC and Matrix may expose rooms and human-readable activity. A bridge translates authorized input into protocol requests and renders accepted events. It stores no authoritative state and does not treat a displayed or delivered message as acceptance. Bridge loss must not lose the transcript.

### Other brokers and stores

RabbitMQ, PostgreSQL, Kafka, or other substrates may be added only as adapters driven by a demonstrated requirement or an interoperability test. Their native model does not redefine the public contract.

## Event and API specifications

The existing Yukh envelope remains authoritative for protocol 0.1.

The implementation phase will produce:

1. an explicit, lossless mapping assessment between the Yukh envelope and CloudEvents 1.0 attributes;
2. an AsyncAPI 3 document for channels, operations, messages, correlation, errors, and transport bindings;
3. transport bindings that are versioned separately from protocol semantics.

CloudEvents compatibility is accepted only if round-trip mapping preserves canonical bytes, identifiers, correlation, causation, evidence, and signature inputs. No rewrite is implied by this RFC.

## Memory model

| Memory class | Owner | Retention and authority |
| --- | --- | --- |
| Presence observations | Coordination | Bounded events; expiry never implies release |
| Coordination transcript | Coordination relay | Append-only within a declared retention policy and transcript epoch |
| Work projection | Coordination projector | Rebuildable view; not accepted project state |
| Portfolio and delivery state | Projects | Reviewed, durable, reconciled state |
| Capability decisions and execution receipts | MCP | Policy-bound evidence of execution |
| Engineering records | Git and optional standardized `.context/` | RFCs, ADRs, session summaries, handoffs, and evidence references |
| Model-local context | Client runtime | Ephemeral and non-authoritative |

## Minimum vertical slice

The first slice uses two isolated client sessions and at least two independently attributable participant instances:

1. create or discover one channel under an explicit retention and ACL policy;
2. join and publish presence;
3. append two concurrent claims for one canonical work URI and observe `conflicting`;
4. publish a question, answer, progress, and immutable evidence descriptor;
5. publish an independent evidence verification and review verdict;
6. offer and atomically accept one valid handoff while rejecting a stale competing acceptance;
7. create the successor claim and release the source claim explicitly;
8. reconcile one separately approved Projects change;
9. execute one separately approved MCP capability and attach its verification evidence;
10. disconnect, reconnect from a cursor, replay, and reproduce the same canonical final projection.

Steps 8 and 9 require their own plans and approvals. Coordination events cannot authorize them.

## Spike comparison

The reference and NATS adapters run the same corpus. The spike records:

- accepted event and receipt equivalence;
- canonical replay and projection digests;
- duplicate publication and redelivery outcomes;
- reconnect and cursor recovery;
- concurrent-claim projection;
- valid, stale, and competing handoff acceptance;
- partial failure between append, receipt, and delivery;
- authorization denial and tenant/channel isolation;
- operational steps, failure recovery, and rollback.

The NATS candidate is rejected or redesigned if protocol-specific exceptions leak into clients, canonical results diverge, operations require unbounded manual repair, or the security boundary cannot be evidenced.

## Security consequences

- Broker credentials remain service-side and are never distributed as general agent capability.
- Authentication precedes non-enumerating tenant/channel authorization and protocol validation.
- Storage and subscriptions are scoped by relay-derived tenant and immutable channel identity.
- At-least-once delivery requires idempotency and duplicate-safe consumers.
- Evidence descriptors remain references with digests; arbitrary evidence bytes do not enter events.
- Coordinator and bridge identities are attributable principals with bounded channel permissions.
- Retention, deletion, export, backup, and transcript-epoch policies are explicit before channel creation.
- The component threat models must record adapter-specific trust and failure boundaries before Test Readiness Review.

## Compatibility consequences

- Protocol version, API version, and transport binding version evolve independently.
- Reference and distributed adapters must pass the same versioned conformance corpus.
- Consumers ignore only extensions permitted by the accepted protocol compatibility rules.
- No adapter may claim compatibility from successful delivery alone.

## Repository ownership

| Repository | Work owned by this RFC |
| --- | --- |
| `nomed.github.io` | Suite architecture, SEMP, governing issue, acceptance evidence index |
| `yukh-coordination` | Runtime ports, relay adapters, AsyncAPI/binding records, protocol conformance, threat-model delta |
| `yukh-projects` | Separately authorized integration that reconciles accepted delivery state |
| `yukh-mcp` | Separately authorized capability and evidence integration |

No new repository is proposed.

## Delivery gates

### Gate 1 — concept review

- RFC scope, authority matrix, mission thread, non-goals, and risks reviewed;
- unresolved product choices remain explicit;
- human owner decides whether to accept or revise this RFC.

### Gate 2 — contract review

- runtime port semantics and adapter failure vocabulary are explicit;
- CloudEvents mapping assessment and AsyncAPI draft exist;
- the conformance corpus covers both adapters without transport-specific expected outcomes.

### Gate 3 — test readiness

- reference adapter passes the complete corpus;
- NATS environment is reproducible and contains no agent-held broker credential;
- adversarial and recovery scenarios have expected evidence;
- rollback is demonstrated.

### Gate 4 — operational readiness

- isolated sessions complete the minimum slice;
- deterministic replay and evidence package are independently verified;
- maturity and limitations are published honestly;
- a gold path is extracted only after a second clean reproduction.

## Rollback

Before RFC acceptance, rollback is document reversion with the governing issue retained as history. During the spike, the distributed adapter may be discarded without changing protocol fixtures or the reference adapter. Any test infrastructure is ephemeral and contains no production state. A failed candidate produces a recorded spike report rather than a compatibility promise.

## Open questions

1. Which public API shape best preserves receipt and streaming semantics: HTTP plus SSE, HTTP plus WebSocket, or a bidirectional RPC binding?
2. Does SQLite add useful reference evidence beyond the in-memory conformance implementation?
3. Can NATS preserve the relay atomicity and receipt requirements without a separate transactional store?
4. Should the first human bridge be IRC, Matrix, or a read-only web transcript?
5. Which exact Projects mutation and MCP capability are sufficiently bounded for the first slice?

## Acceptance evidence

This RFC remains Proposed. Acceptance requires:

- human approval of the architectural direction;
- review against component-local accepted protocol and security records;
- confirmed ownership of the first component issues;
- no unresolved contradiction with RFC-0001;
- a recorded decision on whether the spike may provision ephemeral NATS infrastructure.

## Informative references

- [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream)
- [NATS JetStream consumers](https://docs.nats.io/nats-concepts/jetstream/consumers)
- [CloudEvents specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md)
- [AsyncAPI 3.0 specification](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
- [Matrix specification](https://spec.matrix.org/latest/)
- [Yukh SEMP](../engineering/YUKH-SEMP.md)
