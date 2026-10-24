# Research Increment 002 — multi-agent orchestration and GitHub radar

- **Date:** 2026-10-25
- **Status:** Primary-source desk research, not experimentally qualified
- **Mandate:** Clean-sheet exploration; existing Yukh architectures, contracts and RFCs are not evaluation constraints.

## Findings: separate the problem layers

Organizational work assignment, runtime coordination, durable workflow execution, interactive developer workspaces and execution isolation are **different functions**. A product can serve one without being an end-to-end platform. Evaluate combined and standalone alternatives, including no new software.

| Candidate | Category | Upstream-documented surface | Work-item integration | Remote execution | Project/cost accounting | Research status |
| --- | --- | --- | --- | --- | --- | --- |
| [Ruflo](https://github.com/ruvnet/ruflo) | Agent meta-harness | CLI, MCP, Claude plugins; workflows with pause/resume and approval gates | GitHub workflow tools documented; Jira coverage unverified | Federation claimed; security/reliability untested | Cost console described; per-commessa reconciliation unverified | Review + experiment |
| [OpenHands Agent Canvas](https://github.com/OpenHands/OpenHands) | Multi-backend agent control | ACP agents incl. Claude, Codex, OpenCode; automations/webhooks | GitHub and Linear documented; Jira unverified | Local, Docker, VM, remote and cloud documented | Per-customer billing not independently demonstrated | Review + experiment |
| [OpenCode](https://github.com/anomalyco/opencode) | Coding-agent runtime | Terminal and desktop, build/plan/subagent modes | External orchestration/integration not yet tested | Headless/API deployment unverified in this increment | Attribution unverified | Runtime comparison |
| [Orca](https://github.com/stablyai/orca) | Human developer workspace | Codex/Claude/OpenCode/Pi, parallel Git worktrees and mobile companion | GitHub, Linear, Jira, GitLab task links documented | Remote worker and automation boundaries need verification | Cost-center accounting unverified | Workspace benchmark |
| [Multica](https://github.com/multica-ai/multica) | Issue-led agent team workspace | Assign agent to issue, progress/blockers/review, bring-your-own daemon | Native board documented; external Jira/GitHub sync unverified | Laptop or cloud-box daemon documented | Cost attribution and billing accuracy unverified | Work-state benchmark |
| [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell) | Policy-based sandbox runtime | Gateway/CLI, sandbox, kernel controls, network/credential policy, Kubernetes deployment | Not issue tracker; must integrate with work orchestrator | Local and K8s paths documented; test VPS support | No per-commessa cost claim verified | Security experiment |
| [TencentCloud Octop](https://github.com/TencentCloud/Octop) | Self-hosted multi-user assistant | Web/CLI, HTTP/SSE/WebSocket, ACP, AgentTeams beta | Software-delivery lifecycle unverified | Self-host and pluggable workspace described | Accounting unverified | Watch |

### Ruflo: orchestration is not guaranteed delivery authority

Upstream documentation presents two separate workflow surfaces: persisted MCP lifecycle (create/run/pause/resume/cancel) and native Claude Code JavaScript fanout. Install modality matters: Claude plugin and complete CLI setup differ in hooks and MCP exposure. Do not assume Codex has identical hook support. For a fair comparison, record whether a workflow survives daemon restart and whether human approval is enforced by an independent boundary rather than a model statement.

Sources: [README](https://github.com/ruvnet/ruflo/blob/main/README.md), [workflow plugin](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-workflows/README.md).

### OpenHands: investigate backend abstraction, not only its built-in agent

Agent Canvas upstream README explicitly lists third-party ACP-compatible agents, local/remote/cloud backends, and scheduled/webhook automations connecting GitHub, Slack and Linear. This makes it a candidate for the worker/control surface. Multi-tenant isolation, role boundaries, API stability and comprehensive accounting are still open questions.

Source: [OpenHands README](https://github.com/OpenHands/OpenHands/blob/main/README.md).

### Orca vs Multica: worktrees versus issue-centered collaboration

Orca documents a task-scoped worktree for each concurrent development effort, with optional links to GitHub/Linear/Jira/GitLab. A link is not evidence of authoritative bidirectional synchronization. Multica instead presents its native issue board as the work coordination and agent progress surface, with a daemon running on user infrastructure; investigate whether external issue trackers can remain the source of truth.

Sources: [Orca README](https://github.com/stablyai/orca/blob/main/README.md), [Orca worktrees](https://github.com/stablyai/orca/blob/main/docs/site/content/docs/model/worktrees.mdx), [Multica README](https://github.com/multica-ai/multica/blob/main/README.md), [Multica self-hosting](https://github.com/multica-ai/multica/blob/main/SELF_HOSTING.md).

### OpenShell: a newly prominent adjacent dependency

NVIDIA documents a separate runtime isolation layer with policy enforcement on filesystem, syscalls and outbound network; credentials are mediated to approved endpoints. This is relevant whenever untrusted coding agents execute on shared infrastructure. Upstream states 0.1.x maturity and Kubernetes support. Security claims require adversarial tests and independent verification.

Source: [OpenShell README](https://github.com/NVIDIA/OpenShell/blob/main/README.md).

### OpenCode / Octop: complementary comparison points

OpenCode is an independent coding-agent runtime with built-in plan/build roles and subagents. Octop explores self-hosted multi-user assistants, including agent teams (beta), ACP and multiple transport interfaces. Neither should be ranked as a Jira-to-production control plane without further evidence.

Sources: [OpenCode README](https://github.com/anomalyco/opencode/blob/dev/README.md), [Octop README](https://github.com/TencentCloud/Octop/blob/main/README.md).

## Trend signals — not adoption evidence

The 24 October GitHub Trending aggregations surfaced Ruflo, Orca and OpenShell among quickly growing repositories. These are **secondary discovery signals only**; GitHub source identity was independently checked and the upstream README inspected. Counts, star growth, rankings and quality claims are not carried into an adoption score.

- https://githubtrending.today/topic/ai-agents/
- https://trend.ondo.sh/github/2026-10-24/en.html
- https://github.locker/topics/agent-orchestration

## New falsifiable investigation threads

1. **Issue authority:** Given Jira issue and GitHub PR, which system owns state transitions, reconciliation and duplicate webhooks? Verify by concrete trace.
2. **Worker identity:** Can every run correlate human, autonomous worker, provider session and external ticket across workstations/VPS?
3. **Restart:** Kill supervisor and executor midway, restart and inspect duplicates, side effects, checkpoints and claims.
4. **Budget:** Distinguish provider-reported usage, paid API charges, allocated seat subscriptions, VPS overhead and user-facing estimates.
5. **Security:** Attempt cross-commessa filesystem, Git credential, network and environment-variable access; collect independent evidence.
6. **Vendor portability:** Reproduce the same bounded task using Codex and Claude without changing the authoritative workflow definition.
7. **Issue-to-PR:** Force approval denial before merge; ensure a model's own success statement cannot bypass it.

## Experiment priority, not product ranking

- **EXP-002A:** Ruflo workflow lifecycle / crash and approval gate against no-orchestrator baseline.
- **EXP-002B:** OpenHands versus bare container worker with the same Codex/OpenCode task.
- **EXP-002C:** Orca versus Multica for developer experience and issue-to-PR evidence.
- **EXP-002D:** OpenShell adversarial isolation in local/VPS worker.
- **EXP-002E:** Cost capture completeness and invoice/seat reconciliation across all relevant runners.

**No installation, security benchmark, remote worker run or verified cost measurement has been executed in this increment.** No architectural decision has been made.
