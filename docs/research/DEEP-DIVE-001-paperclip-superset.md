# Deep dive 001 — Paperclip vs Superset

- **Observed:** 2026-10-25 (Europe/Rome)
- **Status:** Primary-source document review; **no installation or runtime benchmark executed**
- **Purpose:** Compare two different categories of agentic work infrastructure without inheriting any Yukh architecture assumption.

## Executive distinction

**Paperclip** is an organizational control plane: companies, agents, task trees, work assignment, cost/budget reporting, heartbeat scheduling and approvals. **Superset** is a developer workspace/control surface: concurrent terminal coding agents in isolated Git worktrees with local/remote hosts, CLI, SDK, MCP and interactive review.

They are **not direct substitutes**. A neutral evaluation must also consider using neither, both, or alternatives.

## Evidence matrix

Legend: **D** upstream documented, **U** unresolved, **T** needs experiment. D is not an independently verified operational claim.

| Dimension | Paperclip | Superset | Next evidence |
| --- | --- | --- | --- |
| Organizational model | D: multiple companies, agents, task hierarchy, budgets | D: developer workspaces and organizations/hosts | Compare permissions for separate legal customers |
| Runtime integration | D: Claude/Codex local adapters, process/HTTP, others described | D: CLI coding agents, worktree terminals | Pin versions and validate Codex + Claude auth |
| API | D: JSON REST under `/api` | D: TypeScript SDK, CLI and MCP | Check complete API contracts and stability |
| Local execution | D: local agent subprocess adapters | D: local workspaces | Capture restart/recovery traces |
| Remote/VPS | D: external HTTP/process adapters; host/deployment specifics T | D: remote hosts selected with `--host`, relay/cloud path | Test VPS security, auth, disconnect behavior |
| Git branches/worktrees | D: optional project workspace execution | D: separate Git worktree per task | Simulate collisions and duplicate issues |
| Native issue management | D: company-scoped issues, blockers, comments, checkout | U: authoritative work-item state | Evaluate external GitHub/Jira source of truth |
| GitHub/Jira integrations | U: external synchronization correctness | U: full issue tracker adapter | Trace issue updates both directions, webhooks, conflicts |
| Costs | D: usage by company/agent/project/issue/model and budgets (reported) | D: usage history with provider-specific coverage | Compare invoice vs captured usage vs allocated subscription |
| Work approvals | D: board and task approvals, execution policies | D: human diff/review workflow | Validate irreversible gates |
| Licensing | D: self-hosted open source claimed; **check SPDX/repo LICENSE before redistribution** | D: Elastic License 2.0, source-available; hosted service restrictions | Legal assessment |
| Offline/disconnection | U | D: local-target CLI via loopback; remote uses cloud relay | Network-denial test |

## Paperclip — architecture and APIs

Upstream describes a Node.js/React control plane with company-scoped tasks, org structure, budgets and agents. Heartbeat triggers result in adapter execution; the agent uses Paperclip REST to inspect/checkout work, and the adapter captures stdout, usage and session details. Its issue API has company-scoped collections and issue operations, with hierarchy, blockers, attachments and approvals.

The organization model is tree-oriented: each agent reports to one manager. This is a **product design choice**, not a general requirement for multi-agent work. We should test whether cross-functional and shared-service work needs a graph instead of a strict org chart.

The documentation specifies reported cost tracking and limits, including an 80% warning and a 100% pause; one primary document notes recorded spending and in-flight work can delay enforcement. This means **not** an automatically accurate invoice reconciler, nor a proven instantaneous hard spending limit.

### Questions that remain open

- Can an existing GitHub Issue or Jira ticket stay authoritative without copying its lifecycle into a competing Paperclip work-item system?
- Can an agent's ordinary interactive Codex/Claude usage be observed without forcing it to run as a managed Paperclip heartbeat?
- Which authentication modes are safe and contractually permitted for pooled remote workers?
- Are organizations/projects independent customer engagements and do scoped budgets cover subscription allocations, API invoices and VPS charges?
- Which features are stable in the pinned release versus only stated on `master`?

Sources checked:
- [Architecture](https://github.com/paperclipai/paperclip/blob/master/docs/start/architecture.md)
- [Core concepts](https://github.com/paperclipai/paperclip/blob/master/docs/start/core-concepts.md)
- [Issue API](https://github.com/paperclipai/paperclip-docs/blob/main/docs/reference/api/issues.md)
- [API/authentication](https://github.com/paperclipai/paperclip-docs/blob/main/docs/reference/api/overview.md)
- [Adapter overview](https://github.com/paperclipai/paperclip-docs/blob/main/docs/reference/adapters/overview.md)
- [Budgets and cost tracking](https://github.com/paperclipai/paperclip/blob/master/docs/guides/board-operator/costs-and-budgets.md)
- [Project README](https://github.com/paperclipai/paperclip)

**Documentation inconsistency to verify:** an installation guide refers broadly to API keys and API charges, while adapter documentation describes local CLI/agent modes. Do not infer that subscription-authenticated, unattended deployment is allowed by either underlying provider.

## Superset — workbench and hosting model

Upstream documents CLI-based coding agents running in parallel, each inside a Git worktree. Workspace operations are available through desktop app, `superset` CLI, TypeScript SDK and MCP. This is valuable for teams whose developers retain their preferred coding agent instead of routing every operation through a proprietary interface.

The CLI distinguishes explicitly selected local and remote hosts. **Local-target reads default locally; mutations require `--local` or `--host`; remote calls route via cloud API and relay.** Thus remote support does not mean a fully self-contained, disconnected VPS deployment. That needs experiment and policy/security review.

The repository says the desktop app is free for local parallel work and uses **Elastic License 2.0**. Self-hosting claims and the exact permitted commercial uses require review of license text and deployment model; ELv2 should not be described as permissive open source.

### Questions that remain open

- Can Superset orchestrate fully unattended issue-driven work, or is it primarily a human developer's control surface?
- How are user identities and agent-level token consumption captured across developer workstations and remote hosts?
- What is the recovery model after losing the local host, remote relay, or workstation?
- Can GitHub/Jira issues be tracked as independent authoritative tasks without a custom orchestration layer?
- Does per-agent usage history fully represent billed costs, or just telemetry exposed by compatible agents?

Sources checked:
- [Repository/readme, CLI/SDK/MCP and license](https://github.com/superset-sh/superset)
- [CLI getting started, remote hosts and storage](https://github.com/superset-sh/superset/blob/main/apps/docs/content/docs/cli/getting-started.mdx)
- [Supported-agent usage documentation](https://docs.superset.sh/supported-agents)

## Comparative test plan

**Fixture:** two unrelated Git repositories, two customers/commesse, three independent issues (at least one from Jira), Codex + Claude Code, one remote VPS, one local workstation, one reviewer. No existing Yukh runtime.

1. Validate provider-specific auth and permitted unattended execution before involving subscription credentials.
2. Import or reference external issues without unintentionally changing their authoritative state.
3. Run concurrent tasks through native controls, record actor identity and Git artifacts.
4. Interrupt the worker/relay; test resume, idempotence, and unintended duplicate work.
5. Compare reported usage with provider usage/billing evidence; allocate subscription and VPS resources separately.
6. Test denial paths, privileges, secrets, tenant isolation and required human approvals.
7. Repeat with alternative tools or a minimalist script-based solution.

**Acceptance** must be backed by reproducible logs, exact versions, CI artifacts, cost source provenance and explicit gaps. Neither product is selected by this desk review.

## Research implication

Prioritize **Paperclip for organizational/task/cost experiments** and **Superset for developer-workspace/parallel-host experiments**. Also benchmark an independent composition or no-platform baseline. Compare the architecture derived from experiments with the old Yukh system only after the clean-sheet evaluation.
