# Yukh agent systems landscape — 2026-08-24

> **Status:** research record, not an accepted architecture decision.
>
> **Governing issue:** #56
>
> Existing Yukh components may be narrowed, replaced, merged, or retired. Inclusion of an external project does not imply adoption.

## Question

What should Yukh own as durable semantics, and what should it obtain from existing agent hosts, runtimes, workspaces, orchestration systems, memory systems, sandboxes, and interoperability projects?

RFC-0003 remains the accepted architecture until superseded. This review challenges that architecture against the current ecosystem instead of protecting prior investment.

## Evidence discipline

The comparisons below are not product rankings. They record public capabilities and hypotheses observed on **2026-08-24**.

- `High`, `Medium`, and `Low` mean relevance to the named concern, not overall quality.
- Roadmap or in-development capabilities are not qualified implementation seams.
- A capability remains a candidate until a bounded spike proves that it preserves Yukh authority, attribution, replay, privacy and evidence requirements.
- Unknown, platform-dependent, subscription-coupled or unstable behavior is stated explicitly rather than inferred.
- Product documentation is evidence of intended behavior, not proof of operational fitness.

## Current Yukh decomposition

| Component | Current responsibility | Distinct value today | Main risk |
| --- | --- | --- | --- |
| Yukh MCP | Policy-governed capability gateway | Explicit capability/policy/evidence boundary | May duplicate runtime-native permission machinery |
| Yukh Projects | Durable delivery/project state reconciled into GitHub Projects | Reviewed, idempotent, dry-run-first reconciliation | GitHub Projects may be an adapter rather than a universal Yukh pillar |
| Yukh Coordination | Cross-session claims, questions, evidence, review and handoff | Non-authoritative coordination, deterministic conflict/handoff and replay | Could overlap with external workspaces/orchestrators if it grows beyond its semantic kernel |

### Initial internal assessment

**Yukh MCP — retain the semantic boundary; implementation remains under challenge.**
The value is cross-runtime capability policy and evidence, not another approval UI or tool gateway.

**Yukh Coordination — retain the protocol kernel; resist product expansion.**
Attributed claims, observable conflict, explicit handoff, evidence references, deterministic replay, and the rule that messaging does not grant authority remain distinctive until another protocol proves equivalent semantics.

**Yukh Projects — narrow the claim now.**
The general need is **accepted work state**. GitHub Projects is the first implementation to test, not evidence of a universal architectural layer.

## External landscape

| Project | Primary strength | Agent host/runtime | Durable execution | Human/agent workspace | Multi-agent/orchestration | Sandbox/isolation | Interop | Memory | Yukh relevance |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| Apache Maka | Event-sourced execution runtime | High | **High** | Medium | Low | Medium / evolving / platform-dependent | Verify | execution-oriented | **High: AgentRun/evidence** |
| goose | Vendor-neutral agent host / developer-kit direction | **High** | Medium / verify | High | Medium via subagents | Medium / verify | **MCP + ACP** | Medium / verify | **Very high host candidate** |
| Hermes Agent | Persistent provider-neutral agent host | **High** | Medium / verify | High via gateway surfaces | **High via isolated subagents** | Medium/High via multiple execution backends | **MCP; ACP support to qualify** | **High** | **Very high host candidate** |
| OpenHuman | Durable orchestration + personal memory platform | High | **High via checkpointed graphs / verify** | **High** | **High** | Opt-in / verify | MCP + external-agent/A2A claims | **High** | **High challenger: orchestration/memory** |
| OpenHands | Agent server + execution infrastructure | **High** | Medium / verify | High | Medium | **High** | Medium / verify | Medium | **High: execution provider** |
| Buzz | Shared human-agent workspace over signed events | Medium | Medium / verify | **High** | **High** | Medium / verify | ACP agent + MCP tools | Medium | **High: workspace/identity** |
| Codex | Production coding-agent runtime | **High** | Medium / opaque to Yukh | Medium | Medium / evolving | **High in supported environments** | MCP; runtime-specific | runtime/session-specific | participant, not substrate |
| Claude Code | Coding runtime with subagents/teams/hooks | **High** | Medium / verify | Medium | **High inside runtime** | High in supported environments | MCP; runtime-specific | runtime/session-specific | participant + benchmark |

## Important corrections and caveats

### Sandbox is not one generic capability

Maka is not treated as a generic high-strength sandbox boundary. Its primary Yukh relevance is durable execution semantics. OpenHands remains the strongest first candidate for external execution-isolation qualification.

Hermes exposes multiple execution backends including local, Docker, SSH and hosted/serverless environments. That is useful execution machinery, but Yukh still has to prove which backend enforces the required isolation and how policy decisions compose with it.

### OpenHuman is broader than the other candidates

OpenHuman publicly positions itself as a local-first personal AI system with persistent memory, durable checkpointed graphs, approval-gated workflows, agent fleets, many integrations and encrypted agent-to-agent orchestration. This breadth is exactly why it is relevant and why it must be treated cautiously.

It may challenge several pieces of custom Yukh machinery at once, but a broad application platform must not silently become the authority source for Yukh work. Its local-first, account/subscription, backend and offline boundaries must be verified operationally rather than inferred from positioning. Its GPL licensing also matters for embedding or code reuse; protocol-level integration remains a different question.

### Hermes and goose should be compared, not crowned

Both are strong candidates for a reference agent host. goose is particularly interesting for MCP/ACP interoperability and a composable developer-kit direction. Hermes is particularly interesting for persistent memory, autonomous skill formation, subagents, messaging surfaces, scheduled work and multiple execution backends.

Yukh should not pick either by feature count. The qualification must ask whether each can host Yukh participant/capability/evidence semantics through stable public seams without runtime-specific contracts leaking upward.

## Project observations and hypotheses

### Apache Maka

**Observed:** local-first Runtime Host, recoverable runtime event log, AgentRun ledger, event-sourced projections and evaluation tooling.

**Use if:** one AgentRun can map losslessly to Yukh intent/capability/evidence identifiers, restart/replay remains deterministic, and private reasoning is not required.

**Reject if:** Maka-specific fields become Yukh semantics or its execution authority cannot compose with external capability policy.

### goose

**Observed:** desktop/CLI/API agent, MCP, ACP support, subagents and an active direction toward more composable host operations.

**Posture:** reference-host qualification candidate, not selected reference host.

**Reject if:** integration requires patching internals, duplicates permission paths, or turns Yukh coordination into goose subagent semantics.

### Hermes Agent

**Observed:** provider-neutral persistent agent host; cross-session memory and skills; isolated subagents; scheduled automation; multiple messaging surfaces; MCP integration; several local/remote/container execution backends.

**Why it matters:** Hermes may already provide most machinery needed for a persistent Yukh-compatible participant without Yukh creating an agent host.

**Qualification:** implement the same minimal Yukh participant/capability/evidence flow used for goose, then compare integration surface, authority composition, memory separation and evidence quality.

**Reject if:** Hermes memory becomes authoritative evidence, host-specific abstractions leak into Yukh contracts, or stable integration requires internal patching.

### OpenHuman

**Observed:** persistent local memory, checkpointed graph execution, durable approval-gated workflows, subagent fleets, wide integration surface and encrypted agent-to-agent orchestration claims.

**Why it matters:** it challenges the assumption that durable execution, orchestration, workflow and memory must be separate pieces built by Yukh.

**Qualification:** use OpenHuman only as an external orchestration/memory participant in a bounded scenario. Verify restart/resume, human approval, external-agent interaction, evidence correlation, local/offline behavior and authority separation.

**Reject if:** using its orchestration requires OpenHuman to become project/execution authority, offline/local behavior is insufficient for the intended profile, or integration requires adopting broad personal-AI semantics unrelated to Yukh.

### OpenHands

**Observed:** agent server, multiple execution environments, Docker/remote runtime patterns and action/observation flows.

**Qualification:** execute one bounded Yukh capability in an external isolated environment and return correlated evidence.

**Reject if:** the whole platform is required just for isolation, policy cannot remain external, or evidence cannot correlate to Yukh run/capability IDs.

### Buzz

**Observed:** self-hostable rooms with attributed human/agent identities, signed event substrate, ACP at agent boundaries and MCP for tools.

**Qualification:** round-trip Yukh Coordination events through a Buzz room and verify attribution, replay, conflict and handoff without authority leakage.

**Reject if:** event/workspace semantics redefine Yukh authority, retention, tenancy or handoff.

## Semantic ownership

| Semantic concern | Stable Yukh contract? | Candidate implementation(s) | Current view |
| --- | --- | --- | --- |
| Participant identity / attribution | Yes | runtime principals, Buzz identities, IdP adapters | portable attribution before identity substrate |
| Claim / ownership / conflict | Yes | Yukh Coordination; workspace/transport adapters | keep unless another model proves equivalent semantics |
| Handoff | Yes | Yukh Coordination | distinctive and worth preserving |
| Capability request / policy decision | Yes | Yukh MCP + runtime permission hooks | keep semantics; implementation may become thinner |
| Agent host / loop | No | goose, Hermes, Maka, OpenHands, Codex, Claude | do not build without demonstrated gap |
| Sandbox execution | No, only interface/evidence semantics | OpenHands, Hermes backends, runtime-native sandboxes | prefer external implementation |
| Durable AgentRun facts | Probably | Maka first; OpenHuman checkpointed runs as challenger; tracing standards to assess | research contract, not repository |
| Durable workflow/orchestration engine | Probably not core | OpenHuman/tinyagents/tinyflows, other engines | Yukh may standardize authority/evidence seams only |
| Persistent agent memory | No, except retention/evidence boundaries | Hermes, OpenHuman, external stores | memory is not authority |
| Accepted work state | Yes, abstractly | GitHub Projects via yukh-projects; future adapters | Projects likely adapter |
| Human collaborative workspace | No | Buzz, Matrix, IDEs, web clients | prefer external surfaces |
| Evaluation harness | Probably not core | Maka and runtime-specific eval tooling | standardize evidence only if needed |

## Adoption posture

| Component | Posture now | Increase confidence if | Disqualify if |
| --- | --- | --- | --- |
| Yukh MCP | **Keep semantics; qualify composition** | external-runtime policy/evidence integration works cleanly | duplicates/bypasses runtime security |
| Yukh Coordination | **Keep kernel; integrate surfaces** | replay/handoff works through external workspace/runtime | external protocol is equivalent with less machinery |
| Yukh Projects | **Narrow to accepted-state adapter** | accepted-state contract proves GitHub-independent | core remains inherently GitHub-specific |
| Maka | **Evaluate deeply for AgentRun/evidence** | lossless mapping + compatible authority model | private reasoning/runtime-specific contracts required |
| goose | **Reference-host qualification candidate** | public seams host Yukh adapters cleanly | internal patching or goose-specific Yukh semantics |
| Hermes Agent | **Reference-host qualification candidate** | same Yukh host scenario works through public surfaces with clean memory/evidence separation | memory/skills/host abstractions become Yukh authority or contracts |
| OpenHuman | **Orchestration + durable-memory challenger** | restartable graph/workflow and A2A scenario preserves Yukh authority and evidence | broad platform coupling, unstable deployment boundary or authority leakage |
| OpenHands | **Execution-provider candidate** | bounded capability executes in isolation and returns evidence | full-platform coupling or external policy impossible |
| Buzz | **Workspace/coordination adapter candidate** | event round-trip preserves Yukh semantics | event substrate forces incompatible authority/handoff semantics |
| Codex / Claude Code | **Participants, not dependencies** | stable adapter/MCP/hooks | vendor behavior becomes required Yukh semantics |

## Plausible pivots

1. **Yukh Projects stops being a top-level conceptual pillar.** `Accepted Work State` becomes semantic; `yukh-projects` becomes the GitHub adapter.
2. **Yukh never builds an agent host.** goose, Hermes or another external runtime supplies it.
3. **Yukh does not build durable workflow or personal memory machinery.** OpenHuman or narrower external systems provide it behind Yukh contracts.
4. **Buzz or another workspace supplies human-facing coordination.** Yukh Coordination shrinks to semantics/conformance where still necessary.
5. **OpenHands or another runtime supplies execution isolation.** Yukh MCP authorizes; external machinery executes; evidence returns.
6. **A current Yukh repository is retired.** Repository survival is not a success criterion.

## Capability-based qualification tracks

### Track A — agent host

Run the same minimal Yukh integration against **goose** and **Hermes Agent**:

- attributed participant joins one coordination channel;
- receives one bounded capability request;
- requests/observes policy decision without bypassing native security;
- executes or delegates one safe operation;
- returns correlated evidence;
- reconnects without turning host memory into Yukh authority.

Outcome: choose zero, one or both as supported/reference hosts. Do not build a Yukh host unless both expose a demonstrated gap.

### Track B — durable execution

Map **Maka AgentRun** to a vendor-neutral run/evidence envelope and compare with **OpenHuman checkpointed graph execution**. The aim is not to standardize either event model; it is to find the smallest durable execution facts Yukh actually needs.

### Track C — orchestration + memory

Use **OpenHuman** as an external durable workflow/memory system in one bounded flow. Test restart, approval, A2A, offline/local behavior, evidence correlation and authority boundaries. Treat its personal-memory model as non-authoritative.

### Track D — workspace

Map Yukh Coordination through **Buzz** and identify whether custom relay/UI machinery remains necessary.

### Track E — execution isolation

Execute one bounded Yukh capability through **OpenHands** and verify isolation plus evidence return.

### Track F — accepted state

Re-evaluate **yukh-projects** as the GitHub adapter for abstract accepted work state after the runtime/orchestration tracks clarify what state must persist outside sessions.

## Proposed layering to test

```text
Human surfaces / workspaces
  Buzz | Matrix | IDE | Web | CLI
                 |
Agent hosts / runtimes
  goose | Hermes | Maka | OpenHuman | OpenHands | Codex | Claude | others
                 |
External machinery
  execution isolation | workflows/orchestration | memory | evaluations
                 |
Interoperability
  ACP | MCP | runtime-specific public adapters
                 |
Yukh semantic contracts
  participant attribution
  coordination / claim / handoff
  capability policy / decision / evidence
  durable execution facts (candidate)
  accepted work state
                 |
Current Yukh implementations
  Coordination relay | MCP gateway | yukh-projects GitHub adapter
```

This is **not** a replacement architecture. It is the model to qualify.

## Sources observed on 2026-08-24

- Apache Maka: https://github.com/apache/maka
- Buzz: https://github.com/block/buzz
- goose documentation: https://block.github.io/goose/
- goose repository / roadmap material: https://github.com/block/goose
- Hermes Agent: https://github.com/NousResearch/hermes-agent
- OpenHuman: https://github.com/tinyhumansai/openhuman
- OpenHands: https://github.com/OpenHands/OpenHands
- Current Yukh component repositories and accepted RFC-0003

External projects move quickly. Revalidate observations against current public documentation and released/testable interfaces before adoption, replacement or RFC changes.
