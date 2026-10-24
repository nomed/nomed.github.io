# Yukh Research — independent discovery

- **Status:** Active discovery, not an adopted architecture
- **Started:** 2026-10-24
- **Owner:** @nomed
- **Public entry:** /research/
- **Scope:** team-scale agentic engineering across multiple projects and cost centers

## Mandate

Investigate how teams of humans and AI agents can plan, execute, coordinate, review and account for work across projects, repositories and organizations. Yukh is **a subject of this research, not an architectural constraint**. Legitimate outcomes include retaining, shrinking, replacing, merging or deleting existing Yukh components, including a complete redesign.

This research does not supersede [RFC-0003](../rfcs/RFC-0003-yukh-reference-architecture-and-minimum-runtime.md) or authorize implementation. Any accepted change requires a later, explicitly reviewed, superseding RFC. Follow the documentation ownership model in [RFC-0004](../rfcs/RFC-0004-yukh-documentation-architecture.md) and the evidence discipline of [YUKH-SEMP](../engineering/YUKH-SEMP.md).

## Questions and scope

1. **Work delivery:** GitHub Issues/Projects, Jira, automatic task decomposition, cross-project dependencies, PR workflows, acceptance and escalation.
2. **Agent runtimes:** Codex, Claude Code and alternatives; IDE, CLI, SDK, App Server, API, local and headless execution; provider authentication, subscriptions, terms and limits.
3. **Orchestration:** durable workflows, agent teams, delegation, retries, checkpoints, approvals and error recovery.
4. **Infrastructure:** developer workstation, remote VPS, Docker/Kubernetes, sandbox isolation, secrets, identity and capacity.
5. **FinOps:** individual and service identity, session/run correlation, token usage, actual billed vs imputed subscription cost, project/cost-center allocation, budgets, audit and privacy.
6. **Governance:** authority boundaries, policy composition, evidence, independent validation, human review and vendor portability.
7. **Scale:** 10/50/200 developer scenarios, multiple clients and repositories, concurrent agent runs, operational support.

## Method

For every candidate, record primary-source URL, version/date checked, deployment mode, license, auth model, limitations, integration surface, findings and disqualifiers. Mark each assertion as **verified documentation**, **experimentally observed**, **inference** or **open**. An upstream feature claim is never equivalent to demonstrated Yukh integration. Do not claim a test, production readiness, or supported subscription use without evidence.

Study **build / buy / integrate / eliminate** without preserving sunk costs. Compare against explicit scenarios and measurable acceptance criteria. Separate work acceptance from transient execution state; do not assume that current Yukh boundaries are optimal.

## Initial investigations

- Runtime licensing and automation matrix (Codex/Claude/OpenCode/other hosts)
- GitHub Issues + Jira adapters and event-driven PR delivery
- Orchestration: OpenHands, Temporal, agent-specific frameworks and hosted coding agents
- Worker deployments: local IDE, VPS, containers, cloud
- FinOps: telemetry, attribution, reconciliation, estimated versus invoiced spend
- Existing Yukh component inventory, replaceability and total-refactor scenario

## Records

- [Research backlog](BACKLOG.md)
- [Evidence ledger](EVIDENCE.md)
- [Existing architecture review #56](https://github.com/nomed/nomed.github.io/issues/56)
- [Existing host qualification #58](https://github.com/nomed/nomed.github.io/issues/58)
- [Shared-memory qualification #63](https://github.com/nomed/nomed.github.io/issues/63)

## Decision gates

**D0:** research scope and questions published. **D1:** source-backed landscape and comparable requirements. **D2:** isolated reproducible experiments with security/FinOps evidence. **D3:** ranked architecture alternatives including full replacement. **D4:** reviewed superseding RFC, if warranted. No implementation preference is accepted at D0.
