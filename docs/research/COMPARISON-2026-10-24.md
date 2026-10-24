# First independent candidate comparison — 24 October 2026

**Scope:** Team-scale agentic work, multi-project task automation and attribution of customer-engagement cost. **Status:** desk research, not product qualification or selection. No existing Yukh architecture informs ranking.

## Method and meaning of marks

**D** = documented by upstream primary sources; **U** = unresolved/not verified; **N** = upstream explicitly says not currently supported. No mark implies a successful installation or independent test. GitHub connector confirmed that each of the eight primary candidate repository paths below exists and was not archived on 2026-10-24. This alone does not establish development velocity, licensing, commercial maturity or security.

| Candidate | Category | Documented capabilities | Key gaps for this use case | Suggested next test |
| --- | --- | --- | --- | --- |
| [Paperclip](https://github.com/paperclipai/paperclip) | Organizational agent control plane | D: goal/task assignment, heartbeat-driven agents, multi-organization, per-agent/company/project budgets, cost APIs, scheduled routines | D: bring-your-own-ticket-system described as roadmap; U: Jira/GitHub work-item synchronization, bill-to-commessa reconciliation, policy isolation under load | Native work/task/usage event into externally-owned Jira/GitHub issue, then reconcile cost |
| [Superset](https://github.com/superset-sh/superset) | Human coding-agent cockpit | D: isolated Git worktrees, concurrent CLI agents, CLI, SDK, MCP, remote hosts, user-provided subscriptions, agent usage history | D: Elastic License 2.0 is source-available, not OSI open source; N: native Windows desktop; U: budget/accounting per client engagement and full Jira bridge | 2 agents / 2 repos / remote host / PR review / usage attribution |
| [Ruflo](https://github.com/ruvnet/ruflo) | Meta-harness/swarm | D: CLI/MCP entry points, routing, swarm, TUI, agent-specific hooks; D: cost cockpit described | U: trustworthy costing, crash/restart recovery, project/commessa tenancy, issue assignment reliability | Repeat parallel workflow with failure injection and evidence |
| [OpenHands](https://github.com/OpenHands/OpenHands) | Remote/sandbox agent execution | Source repository confirmed; previously identified as sandbox candidate | U: work-item integration, actual isolation and per-engagement accounting in this research | Minimal remote issue-to-PR experiment |
| [OpenCode](https://github.com/anomalyco/opencode) | Agent runtime | Source repository confirmed; candidate for independent CLI runtime comparison | U: auth/SDK/headless/plan terms, remote process management, telemetry | Headless unattended run and usage event capture |
| [Orca](https://github.com/stablyai/orca) | Parallel agent workspaces | Source repository confirmed | U: feature inventory, source license, CLI/API, remote workspaces, work management | Examine license, tagged release and reproduce two-task run |
| [Multica](https://github.com/multica-ai/multica) | Task/agent workspace | Source repository confirmed | U: GitHub/Jira contract, worker types, pricing, reproducibility | Trace one issue through task ownership and PR |
| [Herdr](https://github.com/herdrdev/herdr) | Session supervision | Source repository confirmed | U: deployment, actual persistence, integration surfaces, tenancy | Restart and restore concurrent agent sessions |

## Initial evidence-based observations

### Paperclip: strong organizational overlap, accounting caveat

Upstream describes organization-scoped agent teams, goals, tasks, approvals, heartbeats, scheduled routines and budgets. Costs and budgets documentation explicitly mentions `GET /api/companies/{companyId}/costs/by-project` and per-agent and company budgets. This is a candidate for the *organizational control-plane* comparison, not proof that it handles actual invoiced cost or GitHub/Jira state. The repository's implementation specification also labels some costing text as draft; documentation and implementation must be reconciled during testing.

Primary sources:
- https://github.com/paperclipai/paperclip
- https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/costs-and-budgets.md
- https://github.com/paperclipai/paperclip/blob/master/doc/SPEC.md

### Superset: strong human development workbench, separate accounting problem

The upstream README documents separate Git worktrees, local/remote hosts, CLI, SDK, MCP and compatibility with many CLI agents. Its supported-agent matrix documents usage-history support with provider-specific differences. The repository identifies Elastic License 2.0, which is not the same as a permissive open-source license. It is a worker-cockpit candidate, not yet a proven multi-commessa control plane.

Primary sources:
- https://github.com/superset-sh/superset
- https://docs.superset.sh/supported-agents
- https://superset.sh/

### Ruflo: substantial multi-agent harness, unverified claims

The upstream repository documents `npx ruflo@latest init wizard`, MCP stdio server `ruflo mcp start`, integration with Claude Code, and conceptual Router → Swarm → Agents → Memory chain. A conceptual diagram and feature count are not proof of reliable concurrency or durable recovery.

Primary source:
- https://github.com/ruvnet/ruflo

## What not to assume

- GitHub stars or trending rank do not establish capability, quality or production fitness.
- Agent usage history is **not** a verified provider bill.
- A provider subscription on an interactive desktop is **not** automatic authorization for server-side pooled headless usage.
- GitHub Issues, Jira and internal task tables have different authority and consistency models.
- A vendor's multi-organization claim is not equivalent to independently tested tenant isolation.
- No candidate has yet passed a reproducible end-to-end multi-project/commessa experiment.

## Decision-free experiment shortlist

**Experiment A:** Paperclip organizational control plane with external issue/project lifecycle and reconciled costs.  
**Experiment B:** Superset as a human-owned parallel/remote development workspace; compare independent CLI workers.  
**Experiment C:** Ruflo harness under concurrency, interruption and duplicate-work scenarios.  
**Experiment D:** OpenHands vs a lightweight self-managed container worker for isolated issue-to-PR delivery.

Run with a neutral fixture: two Git repositories, two customer engagements, three work items, two workers, one approval boundary, one injected failure, and independent evidence capture. Evaluate before inspecting existing Yukh component implementations.

## Missing evidence to collect

Per repository: pinned SHA/version; license; release freshness; maintainer and contributor concentration; issue and PR handling; reproducible install; worker privilege; isolation; API/CLI; GitHub/Jira adapters; usage source, cost certainty and reconciliation; backup/restore; security disclosures; hosting and license cost. Until collected, corresponding judgments remain **unknown**.
