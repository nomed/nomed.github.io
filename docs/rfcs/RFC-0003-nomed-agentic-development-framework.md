# RFC-0003 — Nomed Agentic Development Framework

- **Status:** Proposed
- **Date:** 2026-08-02
- **Owner:** `@nomed`
- **Governing issue:** [nomed.github.io#9](https://github.com/nomed/nomed.github.io/issues/9)
- **Affected repositories:** `nomed.github.io`, `yukh-mcp`, `yukh-projects`, `yukh-coordination`

## Summary

Nomed defines a vendor-neutral practice for governed agentic development across isolated sessions and multiple repositories. Golden paths shape repositories, skills shape participant behaviour, Yukh Projects reconciles portfolio state, Yukh Coordination records cross-session work signals, and Yukh MCP governs external capabilities.

No issue, claim, message, verdict, session record, or client identity grants authority by implication.

## Problem

Agent sessions can coordinate local subagents but do not share durable context with other sessions. GitHub Issues and Projects preserve governance and delivery state, but are too coarse to act as a live protocol for presence, bounded claims, correlated questions, evidence exchange, review, and handoff. Copying state through a human makes the human an accidental message bus.

The problem is independent of one client. Codex and ChatGPT are initial adopters; Claude, Gemini, human clients, services, and future runtimes must participate through the same public contracts.

## Decisions

### Component responsibilities

| Component | Owns | Does not own |
| --- | --- | --- |
| Yukh Projects | Declarative reconciliation of reviewed GitHub Project and repository delivery state | Session presence, execution credentials, or agent selection |
| Yukh Coordination | Channels, participant signals, claims, progress, questions, reviews, evidence references, handoffs, and replayable transcripts | Execution authority, credentials, project acceptance, or invisible orchestration |
| Yukh MCP | Typed capabilities, policy decisions, credential custody, execution, verification, and operational receipts | Portfolio priority, work assignment, or coordination truth |
| `nomed.github.io` | Cross-suite governance, context-pack schemas, golden paths, official skills, compatibility, and public aggregation | Component runtime behaviour or adopter credentials |

Each boundary is independent. A Project item does not grant a capability; a Coordination claim does not authorize a mutation; an MCP success does not close an issue; a Coordination verdict does not replace project acceptance.

### Coordination levels and clients

Local coordinators may arrange subagents within one runtime. Yukh Coordination connects root participants of isolated sessions; it does not define a global supervisor agent.

Core identity, event, claim, and handoff semantics must not depend on one model provider. Vendor metadata is advisory and non-authorizing. HTTP replay/publish/watch is portable; CLI and MCP are replaceable adapters. Unsupported capabilities fail explicitly.

### Multi-repository projects

Portfolio, project, repository, work item, claim, and session are distinct identities. One work item may span repositories. Claims declare repository and path boundaries; sharing a work item is not by itself a conflict.

### Context Pack

`.context` is a portable bootstrap and continuity contract, not a second event store or governance system. It may index canonical ADRs and RFCs, record sanitized sessions and handoffs, and materialize coordination state. Component-owned decisions remain canonical in their owning repositories.

Session records never contain secrets, personal data, private prompts, chain-of-thought, or unrestricted logs. They are evidence-bearing summaries and are non-authoritative.

### Golden paths and skills

All official Nomed golden paths and skills live in `nomed.github.io`. A golden path includes a specification, templates, generated examples, conformance checks, maturity, and a derogation policy. A language golden path never makes a Nomed protocol language-specific.

## Compatibility

Existing repository-local `.context` layouts remain valid inputs during v0.1 migration. Markdown and YAML authoring are compatible when they preserve the normative fields and precedence. Reference artifacts use JSON so closed schemas validate them without ambiguous typing.

## Security impact

The framework introduces no execution authority. Authentication remains distinct from authorization. New relay, persistence, identity, adapter, and capability boundaries require threat-model review in the owning component. Context packs and public transcripts exclude credentials and private reasoning.

## Migration

1. Publish Context Pack, golden-path, and adapter standards as drafts.
2. Materialize a Yukh multi-repository context pack.
3. Build the first Go golden path in `nomed.github.io`.
4. Adopt it in the Yukh Coordination relay without changing protocol conformance.
5. Run the existing two-session, four-agent qualification scenario.
6. Promote only behaviour supported by replayable evidence.

## Rollback

Before acceptance, remove the drafts without changing component contracts. After acceptance, supersede this RFC rather than rewriting it. Components continue from canonical records when context materialization or an adapter is unavailable.

## Acceptance gates

- Context Pack v0.1 has closed schemas, fixtures, and a valid Yukh example.
- Golden-path governance defines executable examples and regeneration checks.
- Vendor-neutral adapter semantics cover HTTP, CLI, and MCP boundaries.
- Existing Coordination issues remain the implementation backlog.
- A fresh session resumes bounded work without user-mediated message copying.
